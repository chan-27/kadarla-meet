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
  const [stream, setStream] = useState(null);
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const [peers, setPeers] = useState([]);

  const peersRef = useRef([]);
  const myVideo = useRef();
  const userVideo = useRef();
  const navigate = useNavigate();

  const startCall = () => {
    socket.emit("create_room", name);
    // if (me !== "") navigate(`/${me}`, { state: { isAdmin: true } });
  };

  const getCurrentStream = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        console.log("Setting stream", stream);
        myVideo.current.srcObject = currentStream;
      });
  };

  useEffect(() => {
    socket.on("room_created", (roomId) => {
      console.log("ROOM CREATED", roomId);
      navigate(`/${roomId}`, { state: { isAdmin: true } });
    });

    socket.on("join_room_request", ({ roomId, userDetails }) => {
      setCall({
        isReceivingCall: true,
        isCallAccepted: false,
        roomId: roomId,
        userDetails,
      });
    });

    socket.on("receiving_signal", ({ signal, from }) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          myVideo.current.srcObject = currentStream;
          setStream(currentStream);

          console.log("RECEIVING SIGNAL", signal, from);
          console.log("Stream", currentStream);
          const peer = addPeer(signal, from, currentStream);
          peersRef.current.push({ peer, peerID: from });
          setPeers((prevPeers) => [...prevPeers, peer]);
        });
    });

    socket.on("receiving_returned_signal", ({ signal, id }) => {
      console.log("RECEIVING RETURN SIGNAL", signal, id);
      console.log(peersRef.current);
      const item = peersRef.current.find((p) => p.peerID === id);
      item.peer.signal(signal);
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    setCall({ ...call, isCallAccepted: true });

    socket.emit("join_room_accept", {
      roomId: call.roomId,
      userDetails: {
        name: call.userDetails.name,
        socketId: call.userDetails.socketId,
      },
    });
  };

  // calles when a user tries to join the call
  const callUser = async (id) => {
    socket.emit("send_room_request_admins", {
      roomId: id,
      userDetails: {
        name,
        socketId: socket.id,
      },
    });

    socket.on("request_accepted", ({ roomId, userDetails, users }) => {
      const peers = [];
      users.forEach((user) => {
        console.log("USER", user);
        console.log("Stream", stream);
        const peer = createPeer(user.id, stream);
        peersRef.current.push({
          peerID: user.id,
          peer,
        });
        peers.push(peer);
      });
      console.log("PEERS", peers);
      setPeers(peers);
      navigate(`/${roomId}`, { state: { isAdmin: false } });
      setCallAccepted(true);
    });
  };

  function createPeer(userToStream, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      console.log("SENDING SIGNAL", data);
      socket.emit("sending_signal", {
        to: userToStream,
        signal: data,
        from: socket.id,
      });
    });

    return peer;
  }

  function addPeer(signal, from, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      console.log("SENDING RETURN SIGNAL", data);
      socket.emit("returning_signal", {
        to: from,
        signal: data,
        from: socket.id,
      });
    });

    peer.signal(signal);

    return peer;
  }

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
        peers,
        peersRef,
        setPeers,
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
