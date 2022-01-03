import './Chat.scss';
import io from "socket.io-client";
import {useState,useEffect,useRef} from 'react';
import {useParams} from 'react-router-dom';
import Editor from "@monaco-editor/react";

const Chat = ()=>{
  const monacoRef = useRef(null);
  const socketRef = useRef(null);
  const search = useParams();

  var decorations = {}
  var users = {}

  function changeSeleciton(e) {
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
    console.log(decorations[e.user]);
    decorations[e.user] = monacoRef.current.deltaDecorations(decorations[e.user], selectionArray);
}
  const  onMount = editor => {
    monacoRef.current = editor;
    socketRef.current = io('http://192.168.1.200:5000',{query:search});

    socketRef.current.on('connected', function (data) { 
      console.log(data);
      users[data.user] = data.color;
      decorations[data.user] = []
    })

    socketRef.current.on('loadDoc',data=>{
      if(data){
        editor.getModel().setValue(data?.data);
      }
    });
    socketRef.current.on('newmsg', data => {
      monacoRef.current.executeEdits(null, [{
        range: data.changes[0].range,
        text: data.changes[0].text,
        forceMoveMarkers: true
      }]);
    })
    socketRef.current.on('giveData',(id)=>{
      socketRef.current.emit('sendData',{id,'data':editor.getModel().getValue()});
    })
    socketRef.current.on('selection', function (data) {   
      console.log(data); 
      changeSeleciton(data)
    })

    socketRef.current.on('userdata', function (data) {     
      for (var i of data) {
          users[i.user] = i.color
          decorations[i.user] = []
      }
    })

    editor.onDidChangeCursorSelection(function (e) {   
      socketRef.current.emit('selection', e);
    })
  }; 
 
  useEffect(() => {
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      socketRef.current.emit("saveDoc", monacoRef.current.getModel().getValue());
      socketRef.current.disconnect();
    });
  }, [])

  const onChange = (v,e) => {
    if(e.changes[0].forceMoveMarkers === true || e.isFlush) return;
    socketRef.current.emit('msg', e);
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