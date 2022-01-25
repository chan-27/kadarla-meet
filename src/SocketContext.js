import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { Link, useNavigate } from "react-router-dom";

const SocketContext = createContext();

// const socket = io("https://kadarla-video-call.herokuapp.com/");
const socket = io("http://localhost:8000");

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const [users, setUsers] = useState([]);

  const myVideo = useRef();
  const userVideo = useRef();
  const navigate = useNavigate();

  const startCall = () => {
    if (me !== "") navigate(`/${me}`, { state: { isAdmin: true } });
  };

  const getCurrentStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });
  };

  useEffect(() => {
    socket.on("me", (id) => {
      console.log("setting me");
      setMe(id);
    });

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      console.log("user calling");
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      console.log("answeringCall", data);
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      console.log("currentStream", currentStream);
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
  };

  // calles when a user tries to join the call
  const callUser = async (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (_currentStream) => {
      console.log("currentStream", _currentStream);
      userVideo.current.srcObject = _currentStream;
    });

    socket.on("callAccepted", (_signal) => {
      navigate(`/${id}`, { state: { isAdmin: false, id: id } });

      setCallAccepted(true);
      console.log("callAccepted", _signal);
      peer.signal(_signal);
    });
  };

  const leaveCall = () => {
    setCallEnded(true);
    setCallAccepted(false);
    setCall({});

    navigate(`/`);
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        startCall,
        getCurrentStream,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
