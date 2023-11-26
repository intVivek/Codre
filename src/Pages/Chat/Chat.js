import "./Chat.scss";
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { createWidget } from "../../Utils/createWidget.js";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../Components/NavBar/NavBar.js";
import LoadingPage from "../LoadingPage/LoadingPage.js";
import { toast } from "react-toastify";
import { isAuthenticated } from "../../Services";
require("dotenv").config();

const Chat = () => {
  const userData = useRef(null);
  const editorRef = useRef(null);
  const socketRef = useRef(null);
  const [contentWidgets, setContentWidgets] = useState({});
  //   var decorations = {}
  var users = {};

  const navigate = useNavigate();
  const { room } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const insertWidget = (e) => {
    if (e._id === userData.current._id) return;
    setContentWidgets((prevState) => {
      prevState[e._id] = {
        domNode: null,
        position: {
          lineNumber: 0,
          column: 0,
        },
        allowEditorOverflow: true,
        getId: () => {
          return "content." + e._id;
        },
        getDomNode: function () {
          if (!this.domNode) {
            this.domNode = createWidget(e);
          }
          return this.domNode;
        },
        getPosition: function () {
          return {
            position: this.position,
            preference: [1],
          };
        },
      };
      return prevState;
    });
  };

  const changeWidgetPosition = (cursor) => {
    editorRef.current.removeContentWidget(contentWidgets[cursor?._id]);
    setContentWidgets((prevState) => {
      prevState[cursor?._id].position.lineNumber =
        cursor?.selection.endLineNumber;
      prevState[cursor?._id].position.column = cursor?.selection.endColumn;
      return prevState;
    });
    editorRef.current.addContentWidget(contentWidgets[cursor?._id]);
  };

  const onMount = (editor) => {
    var cursor;
    editorRef.current = editor;
    setLoading(true);
    socketRef.current = io(process.env.REACT_APP_API_URL, {
      query: { room: room },
      reconnect: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 10000,
      secure: true,
      withCredentials: true,
    });

    socketRef.current.on("roomAlreadyJoined", () => {
      navigate("/home");
      toast.error("Session already exists, Please Close all other active tabs");
    });

    socketRef.current.on("failed", () => {
      navigate("/home");
    });

    socketRef.current.on("personalData", (data) => {
      userData.current = data;
      setLoading(false);
      setUser(data);
    });

    socketRef.current.on("connected", (data) => {
      socketRef.current.emit("selection", cursor);
      insertWidget(data);
      users[data._id] = data.color;
    });

    socketRef.current.on("usersList", (usersList) => {
      for (var i of usersList) {
        users[i._id] = i.color;
        insertWidget(i);
      }
    });

    socketRef.current.on("loadDocument", (data) => {
      data && editor && editor?.getModel()?.setValue(data);
    });

    socketRef.current.on("requestDataFromRandomUser", (socketId) => {
      socketRef.current.emit("dataRequestFromForeignClient", {
        socketId,
        data: editor?.getModel()?.getValue(),
      });
    });

    socketRef.current.on("selection", (data) => {
      changeWidgetPosition(data);
    });

    socketRef.current.on("exit", (data) => {
      editorRef.current.removeContentWidget(contentWidgets[data]);
      setContentWidgets((prevState) => {
        delete prevState[data];
        return prevState;
      });
      // editorRef.current.deltaDecorations(decorations[data], []);
      // delete decorations[data]
    });

    socketRef.current.on("textChange", (data) => {
      editorRef.current.executeEdits(null, [
        {
          range: data.changes[0].range,
          text: data.changes[0].text,
          forceMoveMarkers: true,
        },
      ]);
    });

    socketRef.current.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        socketRef.current.connect();
      }
    });

    editor.onDidChangeCursorSelection((e) => {
      cursor = e;
      socketRef.current.emit("selection", e);
    });
  };

  useEffect(() => {
    (async () => {
      const res = await isAuthenticated();
      if (res.status === 0) navigate("/");
    })();

    const disconnect = (event) => {
      socketRef.current?.emit(
        "saveChangesOnClientLeft",
        editorRef?.current?.getModel()?.getValue()
      );
      socketRef.current?.disconnect();
    };
    window.addEventListener("beforeunload", disconnect);
    return () => {
      disconnect();
      window.removeEventListener("beforeunload", disconnect);
    };
  }, [navigate]);

  const onChange = (v, e) => {
    if (e.changes[0].forceMoveMarkers === true || e.isFlush) return;
    socketRef.current.emit("textChange", e);
  };

  return (
    <div className="chatPage">
      <LoadingPage loading={loading} />
      <NavBar img={user?.photos ? user?.photos[0].value : ""} />
      <div className="window">
        <Editor
          width="100vw"
          defaultLanguage="javascript"
          theme="vs-dark"
          onMount={onMount}
          onChange={onChange}
          options={{
            fontFamily: 'Consolas, "Courier New", monospace',
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
};

export default Chat;
