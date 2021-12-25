import './Chat.scss';
import io from "socket.io-client";
import {useState,useEffect,useRef} from 'react';
import {useParams} from 'react-router-dom';
import Editor from "@monaco-editor/react";

const Chat = ()=>{
  const monacoRef = useRef(null);
  const socketRef = useRef(null);
  const search = useParams();
  const [doc,setDoc] = useState(''); 


  useEffect(() => {
    if (socketRef.current == null) return

    const interval = setInterval(() => {
      socketRef.current.emit("saveDoc", doc);
    }, 200)

    return () => {
      clearInterval(interval)
    }
  }, [doc])

  const  onMount = editor => {
    monacoRef.current = editor;
    socketRef.current = io('http://localhost:5000',{query:search});
    socketRef.current.on('loadDoc',data=>editor.getModel().setValue(data.data));
    socketRef.current.on('newmsg', data => {
      monacoRef.current.executeEdits(null, [{
        range: data.changes[0].range,
        text: data.changes[0].text,
        forceMoveMarkers: true
      }]);
   })
  }; 
  
  const onChange = (v,e) => {
    setDoc(v);
    console.log(e);
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