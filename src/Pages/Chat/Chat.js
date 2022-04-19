import './Chat.scss';
import io from "socket.io-client";
import {useState,useEffect,useRef} from 'react';
import Editor from "@monaco-editor/react";
import {createWidget} from '../../Utils/createWidget.js';
import {useParams,useNavigate} from 'react-router-dom';


const Chat = ()=>{
  const userData  = useRef(null);
  const editorRef = useRef(null);
  const socketRef = useRef(null);
  const monacoRef = useRef(null);
  var contentWidgets = {}
  var decorations = {}
  var users = {}

  const navigate = useNavigate();
  const {room} = useParams();

  const insertWidget = (e) => {
    contentWidgets[e.socketId] = {
        domNode: null,
        position: {
            lineNumber: 0,
            column: 0
        },
        allowEditorOverflow: true,
        getId: () => {
            return 'content.' + e.socketId
        },
        getDomNode: function () {
            if (!this.domNode) {
              this.domNode = createWidget(e);
            }
            return this.domNode
        },
        getPosition:  function() {
            return {
                position: this.position,
                preference: [monacoRef.current.editor.ContentWidgetPositionPreference.ABOVE]
            }
        }
    }
}


const changeWidgetPosition =(cursor) => {
  editorRef.current.removeContentWidget(contentWidgets[cursor.socketId])
  contentWidgets[cursor.socketId].position.lineNumber = cursor.selection.endLineNumber
  contentWidgets[cursor.socketId].position.column = cursor.selection.endColumn
  editorRef.current.addContentWidget(contentWidgets[cursor.socketId])
  // cursor.secondarySelections.map((element)={

  // })
}


  const changeSeleciton = (e) => {
    console.log(e);
    var selectionArray = [];
    if (e.selection.startColumn == e.selection.endColumn && e.selection.startLineNumber == e.selection.endLineNumber) { 
        e.selection.endColumn++
        selectionArray.push({
            range: e.selection,
            options: {
              className: `my-cursor user${e.socketId}` ,
            }
        })
    } else {   
        selectionArray.push({   
            range: e.selection,
            options: {
              className: `my-cursor user${e.socketId}` ,
            }
        })
    }

    for (let data of e.secondarySelections) { 
      console.log(data);
        if (data.startColumn == data.endColumn && data.startLineNumber == data.endLineNumber) {        
            selectionArray.push({
                range: data,
                options: {
                  className: `my-cursor user${e.socketId}` ,
                }
            })
        } else
            selectionArray.push({
                range: data,
                options: {
                  className: `my-cursor user${e.socketId}` ,
                }
            })
    }
    decorations[e.socketId] = editorRef.current.deltaDecorations(decorations[e.socketId], selectionArray);
    console.log(decorations);
  }

  const  onMount = (editor,monaco) => {
    var cursor;
    editorRef.current = editor;
    monacoRef.current=monaco;
    socketRef.current = io('http://localhost:5000',{
      query: {'room': room},
      reconnect: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 10000,
      secure: true,
      withCredentials: true
    });

    socketRef.current.on('failed',()=>{
      navigate("/home");
    });

    socketRef.current.on('personalData',  (data) => { 
      userData.current = data;
    })

    socketRef.current.on('connected',  (data) => { 
      console.log(data);
      socketRef.current.emit('selection', cursor);
      insertWidget(data);
      users[data.socketId] = data.color;
      decorations[data.socketId] = []
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(`.user${data.socketId} {background: 'white'}`);
      document.adoptedStyleSheets = [sheet];
      console.log(document.querySelector(`.my-cursor`));
    })

    socketRef.current.on('userdata', userData =>{
      for (var i of userData) {
        console.log(i);
        users[i.socketId] = i.color
        insertWidget(i)
        decorations[i.socketId] = []
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`.user${i.socketId} {background: 'white'}`);
        document.adoptedStyleSheets = [...document.adoptedStyleSheets,sheet];
        console.log(document.querySelector(`.my-cursor`));        
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

    editor.onDidChangeCursorSelection( e => {
      cursor = e;
      socketRef.current.emit('selection', e);
    })
  }; 

 
  useEffect(() => {
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      socketRef.current.emit("clientLeft", userData.current.socketId,userData.current.room,editorRef.current.getModel().getValue());
      socketRef.current.disconnect();
    });
  }, [userData.current])

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