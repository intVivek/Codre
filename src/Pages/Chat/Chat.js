import './Chat.scss';
import io from "socket.io-client";
import {useEffect,useRef,useState} from 'react';
import Editor from "@monaco-editor/react";
import {createWidget} from '../../Utils/createWidget.js';
import {useParams,useNavigate} from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar.js';
import LoadingPage from '../LoadingPage/LoadingPage.js';
require('dotenv').config();


const Chat = ()=>{
  const userData  = useRef(null);
  const editorRef = useRef(null);
  const socketRef = useRef(null);
  const [contentWidgets, setContentWidgets] = useState({});
//   var decorations = {}
  var users = {}

  const navigate = useNavigate();
  const {room} = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const insertWidget = (e) => {
    setContentWidgets(prevState => {
      prevState[e.socketId] = {
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
                preference: [1]
            }
        }
    }
    return prevState;
  })
}

const changeWidgetPosition =(cursor) => {
  editorRef.current.removeContentWidget(contentWidgets[cursor?.socketId])
  setContentWidgets(prevState => {
    prevState[cursor?.socketId].position.lineNumber = cursor?.selection.endLineNumber
    prevState[cursor?.socketId].position.column = cursor?.selection.endColumn
    return prevState;
  })
  editorRef.current.addContentWidget(contentWidgets[cursor?.socketId])
}

  // const changeSeleciton = (e) => {
  //   var selectionArray = [];
  //   if (e.selection.startColumn == e.selection.endColumn && e.selection.startLineNumber == e.selection.endLineNumber) { 
  //       e.selection.endColumn++
  //       selectionArray.push({
  //           range: e.selection,
  //           options: {
  //             className: `my-cursor user${e.socketId}` ,
  //           }
  //       })
  //   } else {   
  //       selectionArray.push({   
  //           range: e.selection,
  //           options: {
  //             className: `my-cursor user${e.socketId}` ,
  //           }
  //       })
  //   }

  //   for (let data of e.secondarySelections) { 
  //       if (data.startColumn == data.endColumn && data.startLineNumber == data.endLineNumber) {        
  //           selectionArray.push({
  //               range: data,
  //               options: {
  //                 className: `my-cursor user${e.socketId}` ,
  //               }
  //           })
  //       } else
  //           selectionArray.push({
  //               range: data,
  //               options: {
  //                 className: `my-cursor user${e.socketId}` ,
  //               }
  //           })
  //   }
  //   decorations[e.socketId] = editorRef.current.deltaDecorations(decorations[e.socketId], selectionArray);
  // }


  const  onMount = (editor) => {
    var cursor;
    editorRef.current = editor;
    setLoading(true);
    socketRef.current = io(process.env.REACT_APP_API_URL,{
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
      setLoading(false);
      setUser(data);
    })

    socketRef.current.on('connected',  (data) => { 
      socketRef.current.emit('selection', cursor);
      insertWidget(data);
      users[data.socketId] = data.color;
      // const sheet = new CSSStyleSheet();
      // sheet.replaceSync(`.user${data.socketId} {background: 'white'}`);
      // document.adoptedStyleSheets = [sheet];
    })

    socketRef.current.on('userdata', userData =>{
      for (var i of userData) {
        users[i.socketId] = i.color
        insertWidget(i)
        // const sheet = new CSSStyleSheet();
        // sheet.replaceSync(`.user${i.socketId} {background: 'white'}`);
        // document.adoptedStyleSheets = [...document.adoptedStyleSheets,sheet];
      }
    });

    socketRef.current.on('loadDoc', modelValue =>{
      modelValue && editor && editor?.getModel()?.setValue(modelValue?.data);
    });

    socketRef.current.on('clientRequestedData',(id)=>{
      socketRef.current.emit('clientRequestedData',{id,'data':editor?.getModel()?.getValue()});
    })

    socketRef.current.on('selection', (data) =>{  
      // changeSeleciton(data);
      changeWidgetPosition(data);
    })

    socketRef.current.on('exit', (data) =>{   
      editorRef.current.removeContentWidget(contentWidgets[data]);
      setContentWidgets(prevState => {
        delete prevState[data];
        return prevState;
      })
      // editorRef.current.deltaDecorations(decorations[data], []);
      // delete decorations[data]
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

  useEffect(()=>{
    const disconnect = (event) => {
      event.preventDefault();
      socketRef.current.emit("clientLeft", userData.current.socketId,userData.current.room,editorRef.current.getModel().getValue());
      socketRef.current.disconnect();
    }
    window.addEventListener('beforeunload', disconnect);
    return () => {
      window.removeEventListener('beforeunload',disconnect);
    }
  },[])

  const onChange = (v,e) => {
    if(e.changes[0].forceMoveMarkers === true || e.isFlush) return;
    socketRef.current.emit('textChange', e);
  }

  return(
    <div className='chatPage'>
      <LoadingPage loading={loading}/>
      <NavBar img={user?.photos?user?.photos[0].value:''}/>
      <div className='window'>
       <Editor
          width="100vw"
          defaultLanguage="javascript"
          theme= 'vs-dark'
          onMount={onMount}
          onChange={onChange}
          options={{    
            fontFamily: 'Consolas, "Courier New", monospace',
            tabSize: 4
          }}
        />
      </div>
    </div>
  );
}

export default Chat;