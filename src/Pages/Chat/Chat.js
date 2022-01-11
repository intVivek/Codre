import './Chat.scss';
import io from "socket.io-client";
import {useState,useEffect,useRef} from 'react';
import {useParams,useLocation} from 'react-router-dom';
import Editor from "@monaco-editor/react";


const Chat = ()=>{
  const editorRef = useRef(null);
  const socketRef = useRef(null);
  const monacoRef = useRef(null);
  let { search } = useLocation();
  const room = useParams();
  var contentWidgets = {}
  var decorations = {}
  var users = {}

  const query = new URLSearchParams(search);
  
  const insertWidget = (e) => {
    console.log(e);
    contentWidgets[e.id] = {
        domNode: null,
        position: {
            lineNumber: 0,
            column: 0
        },
        getId: () => {
            return 'content.' + e.id
        },
        getDomNode: function () {
            if (!this.domNode) {
                this.domNode = document.createElement('div')
                this.domNode.innerHTML = e.name
                this.domNode.style.background = e.color
                this.domNode.style.color = 'black'
                this.domNode.style.opacity = 1
                this.domNode.style.fontSize = '10px'
                this.domNode.style.width = 'max-content'
                this.domNode.style.padding = '0 3px 0 3px'
                this.domNode.style.borderRadius = "3px";
            }
            return this.domNode
        },
        getPosition:  function() {
          console.log(this.position);
            return {
                position: this.position,
                preference: [monacoRef.current.editor.ContentWidgetPositionPreference.ABOVE,monacoRef.current.editor.ContentWidgetPositionPreference.BELOW]
            }
        }
    }
}


const changeWidgetPosition =(e) => {
  console.log(e);
  console.log(contentWidgets);
  contentWidgets[e.id].position.lineNumber = e.selection.endLineNumber
  contentWidgets[e.id].position.column = e.selection.endColumn

  editorRef.current.removeContentWidget(contentWidgets[e.id])
  editorRef.current.addContentWidget(contentWidgets[e.id])
}


  const changeSeleciton = (e) => {
    var selectionArray = [];
    if (e.selection.startColumn == e.selection.endColumn && e.selection.startLineNumber == e.selection.endLineNumber) { 
        e.selection.endColumn++
        selectionArray.push({
            range: e.selection,
            options: {
              className: `my-cursor user${e.id}` ,
            }
        })
    } else {   
        selectionArray.push({   
            range: e.selection,
            options: {
              className: `my-cursor user${e.id}` ,
            }
        })
    }

    for (let data of e.secondarySelections) {      
        if (data.startColumn == data.endColumn && data.startLineNumber == data.endLineNumber) {        
            selectionArray.push({
                range: data,
                options: {
                  className: `my-cursor user${data.id}` ,
                }
            })
        } else
            selectionArray.push({
                range: data,
                options: {
                  className: `my-cursor user${data.id}` ,
                }
            })
    }
    console.log(decorations);
    decorations[e.id] = editorRef.current.deltaDecorations(decorations[e.id], selectionArray);
  }

  const  onMount = (editor,monaco) => {
    var cursor;
    editorRef.current = editor;
    monacoRef.current=monaco;
    socketRef.current = io('http://192.168.1.200:5000',{query:{'room':room.search,'name':query.get('user')}});

    socketRef.current.on('connected',  (data) => { 
      console.log('My Cursor', cursor);
      socketRef.current.emit('selection', cursor);
      insertWidget(data);
      console.log(data);
      users[data.id] = data.color;
      decorations[data.id] = []
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(`.user${data.id} {background: ${data.color}}`);
      document.adoptedStyleSheets = [sheet];
    })

    socketRef.current.on('userdata', userData =>{
      console.log(userData);
      for (var i of userData) {
        console.log(i);
        users[i.id] = i.color
        insertWidget(i)
        decorations[i.id] = []
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`.user${i.id} {background: ${i.color}}`);
        document.adoptedStyleSheets = [...document.adoptedStyleSheets,sheet];        
      }
    });

    socketRef.current.on('loadDoc', modelValue =>{
      modelValue && editor.getModel().setValue(modelValue?.data);
    });

    socketRef.current.on('clientRequestedData',(id)=>{
      socketRef.current.emit('clientRequestedData',{id,'data':editor.getModel().getValue()});
    })

    socketRef.current.on('selection', (data) =>{   
      console.log(data);
      changeSeleciton(data);
      changeWidgetPosition(data);
    })

    socketRef.current.on('exit', (data) =>{   
      console.log(data);
      editorRef.current.deltaDecorations(decorations[data], []);
      editorRef.current.removeContentWidget(contentWidgets[data]);
      delete decorations[data]
    })

    socketRef.current.on('textChange', data => {
      editorRef.current.executeEdits(null, [{
        range: data.changes[0].range,
        text: data.changes[0].text,
        forceMoveMarkers: true
      }]);
    })

    editor.onDidChangeCursorSelection( (e) => {
      cursor = e;
      socketRef.current.emit('selection', e);
    })
  }; 

 
  useEffect(() => {
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      socketRef.current.emit("clientLeft", socketRef.current.id,room.search,editorRef.current.getModel().getValue());
      socketRef.current.disconnect();
    });
  }, [])

  const onChange = (v,e) => {
    if(e.changes[0].forceMoveMarkers === true || e.isFlush) return;
    socketRef.current.emit('textChange', e);
  }

  return(
    <div className='chatPage'>
      <div className='window'>
       <Editor
          height="90vh"
          width="100vw"
          defaultLanguage="javascript"
          theme= 'vs-dark'
          onMount={onMount}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default Chat;