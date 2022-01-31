import Grid from "@mui/material/Grid";
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
    peers,
    setPeers,
    peersRef,
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
    // myVideo.current.srcObject = stream;
    console.log("Joining STREAM");
    setIsAdmin(location.state.isAdmin);
    if (location.state.isAdmin) getCurrentStream();
    else {
      setTimeout(() => {
        console.log("current stream", stream);
        myVideo.current.srcObject = stream;
      }, 1000);
    }
    // for (let i = 0; i < 4; i++) {
    //   peers.push(peers[0]);
    //   if (i === 3) setPeers();
    // }
  }, []);

  return (
    <div className="callpage-container">
      {/* <video src="" controls></video> */}
      {stream && (
        <video
          playsInline
          muted
          ref={myVideo}
          autoPlay
          className={
            callAccepted && !callEnded
              ? "video-container-call-started"
              : "video-container"
          }
        />
      )}
      {callAccepted && !callEnded && (
        <VideoGrid peers={peers} />

        // <video
        //   playsInline
        //   ref={userVideo}
        //   autoPlay
        //   className="video-container"
        // />
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

const VideoEle = (props) => {
  const ref = useRef();
  useEffect(() => {
    console.log("video ele", props.number);
    props.peer.on("track", (track, stream) => {
      console.log("stream", stream);
      ref.current.srcObject = stream;
    });
  }, []);
  return (
    <video
      playsInline
      ref={ref}
      autoPlay
      style={{
        transform: `scaleX(-1)`,
        width: `100%`,
        height: "100%",
        maxHeight: "90vh",
      }}
    />
  );
};

function VideoGrid({ peers }) {
  const [gridSpacing, setGridSpacing] = useState(12);

  useEffect(() => {
    setGridSpacing(Math.max(Math.floor(12 / peers.length), 4));
  }, [peers.length]);

  return (
    <Grid container style={{ height: "100%" }}>
      {peers.map((peer, index) => {
        console.log("peer", peers.length);
        return (
          <Grid
            item
            xs={gridSpacing}
            alignItems="center"
            // style={{ backgroundColor: "red" }}
          >
            <VideoEle key={index} peer={peer} number={peers.length}></VideoEle>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default CallPage;
