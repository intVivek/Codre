import './Chat.scss';
import io from "socket.io-client";
import {useState,useEffect,useRef,useCallback} from 'react';
import {useParams} from 'react-router-dom';
import Editor from "@monaco-editor/react";

const Chat = ()=>{
  const editorRef = useRef(null);
  const socketRef = useRef(null);
  const monacoRef = useRef(null);
  const room = useParams();
  var contentWidgets = {}
  var decorations = {}
  var users = {}
  

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
        getDomNode: () => {
            if (!this.domNode) {
                this.domNode = document.createElement('div')
                this.domNode.innerHTML = e.id
                this.domNode.style.background = e.color
                this.domNode.style.color = 'black'
                this.domNode.style.opacity = 0.8
                this.domNode.style.width = 'max-content'
            }
            return this.domNode
        },
        getPosition:  () => {
            return {
                position: this.position,
                preference: [monacoRef.current.editor.ContentWidgetPositionPreference.BELOW,monacoRef.current.editor.ContentWidgetPositionPreference.ABOVE]
            }
        }
    }
}


  const changeSeleciton = (e) => {
    var selectionArray = []
    if (e.selection.startColumn == e.selection.endColumn && e.selection.startLineNumber == e.selection.endLineNumber) { 
        e.selection.endColumn++
        selectionArray.push({
            range: e.selection,
            options: {
              className: 'my-cursor',
                hoverMessage: {
                    value: e.user
                }
            }
        })
    } else {   
        selectionArray.push({   
            range: e.selection,
            options: {
              className: 'my-cursor',
                hoverMessage: {
                    value: e.user
                }
            }
        })
    }
    for (let data of e.secondarySelections) {      
        if (data.startColumn == data.endColumn && data.startLineNumber == data.endLineNumber) {        
            selectionArray.push({
                range: data,
                options: {
                  className: 'my-cursor',
                    hoverMessage: {
                        value: e.user
                    }
                }
            })
        } else
            selectionArray.push({
                range: data,
                options: {
                  className: 'my-cursor',
                    hoverMessage: {
                        value: e.user
                    }
                }
            })
    }
    console.log(decorations);
    decorations[e.user] = editorRef.current.deltaDecorations(decorations[e.user], selectionArray);
}

const changeWidgetPosition =(e) => {
  console.log(e);
  console.log(contentWidgets);
  contentWidgets[e.user].position.lineNumber = e.selection.endLineNumber
  contentWidgets[e.user].position.column = e.selection.endColumn

  editorRef.current.removeContentWidget(contentWidgets[e.user])
  editorRef.current.addContentWidget(contentWidgets[e.user])
}

  const  onMount = (editor,monaco) => {
    var cursor;
    editorRef.current = editor;
    monacoRef.current=monaco;
    socketRef.current = io('http://192.168.1.200:5000',{query:room});

    socketRef.current.on('connected',  (data) => { 
      console.log('My Cursor', cursor);
      socketRef.current.emit('selection', cursor);
      insertWidget(data);
      console.log(data);
      users[data.id] = data.color;
      decorations[data.id] = []
    })

    socketRef.current.on('userdata', userData =>{
      console.log(userData);
      for (var i of userData) {
        users[i.id] = i.color
        insertWidget(i)
        decorations[i.id] = []
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
      editorRef.current.deltaDecorations(decorations[data], []);
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
          onMount={onMount}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default Chat;