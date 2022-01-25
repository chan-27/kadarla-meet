import { Paper, Grid, Typography, makeStyles } from "@material-ui/core";
import React, { useEffect, useContext, useState, useRef } from "react";
import { SocketContext } from "../../SocketContext";
import CallPageFooter from "./components/call_page_footer/CallPageFooter";
import CallPageHeader from "./components/call_page_header/CallPageHeader";
import MeetInfo from "./components/meet_info/MeetInfo";

import { useLocation } from "react-router-dom";
import "./CallPage.scss";
import AdmitUser from "./components/admit_user/AdmitUser";

const CallPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    name,

    myVideo,

    stream,
    callAccepted,
    callEnded,
    me,
    leaveCall,
    getCurrentStream,
    userVideo,
  } = useContext(SocketContext);
  const location = useLocation();
  const myVideoCaller = useRef();

  useEffect(() => {
    console.log("call page useeffect", location.state.isAdmin);
    setIsAdmin(location.state.isAdmin);
    if (location.state.isAdmin) getCurrentStream();
    else {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          myVideoCaller.current.srcObject = currentStream;
        });
    }
  }, []);

  return (
    <div className="callpage-container">
      {/* <video src="" controls></video> */}
      {stream && (
        <video
          playsInline
          muted
          ref={location.state.isAdmin ? myVideo : myVideoCaller}
          autoPlay
          className={
            callAccepted && !callEnded
              ? "video-container-call-started"
              : "video-container"
          }
        />
      )}
      {callAccepted && !callEnded && (
        <video
          playsInline
          ref={userVideo}
          autoPlay
          className="video-container"
        />
      )}
      {/* <CallPageHeader /> */}
      <CallPageFooter
        link={window.location.pathname.split("/")[1]}
        disconnectCall={leaveCall}
      />
      {isAdmin && <AdmitUser />}
    </div>
  );
};

export default CallPage;
