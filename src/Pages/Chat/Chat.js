import './Chat.scss';
import io from "socket.io-client";
import {useEffect,useRef} from 'react';
import {useParams} from 'react-router-dom';
import Editor from "@monaco-editor/react";

const Chat = ()=>{
  const monacoRef = useRef(null);
  const socketRef = useRef(null);
  const room = useParams();
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
    console.log(decorations);
    decorations[e.user] = monacoRef.current.deltaDecorations(decorations[e.user], selectionArray);
}
  const  onMount = editor => {
    monacoRef.current = editor;
    socketRef.current = io('http://192.168.1.200:5000',{query:room});

    socketRef.current.on('connected',  (data) => { 
      console.log(data);
      users[data.id] = data.color;
      decorations[data.id] = []
    })

    socketRef.current.on('userdata', userData =>{
      console.log(userData);
      for (var i of userData) {
        users[i.id] = i.color
        decorations[i.id] = []
      }
    });

    socketRef.current.on('loadDoc', modelValue =>{
      modelValue && editor.getModel().setValue(modelValue?.data);
    });


    socketRef.current.on('trail', (d)=>{
      console.log(d);
    });

    socketRef.current.on('clientRequestedData',(id)=>{
      socketRef.current.emit('clientRequestedData',{id,'data':editor.getModel().getValue()});
    })

    socketRef.current.on('selection', (data) =>{   
      changeSeleciton(data);
    })


    socketRef.current.on('textChange', data => {
      monacoRef.current.executeEdits(null, [{
        range: data.changes[0].range,
        text: data.changes[0].text,
        forceMoveMarkers: true
      }]);
    })

    editor.onDidChangeCursorSelection( (e) => {   
      console.log(e);
      socketRef.current.emit('selection', e);
    })
  }; 
 
  useEffect(() => {
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      socketRef.current.emit("clientLeft", socketRef.current.id,room.search,monacoRef.current.getModel().getValue());
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