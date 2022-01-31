import "./CallPageFooter.scss";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import React, { useEffect, useContext, useState, useRef } from "react";
import { SocketContext } from "../../../../SocketContext";
import * as copy from "copy-to-clipboard";

const CallPageFooter = ({
  isPresenting,
  stopScreenShare,
  screenShare,
  isAudio,
  toggleAudio,
  disconnectCall,
  link,
}) => {
  const { stream } = useContext(SocketContext);
  return (
    <Box className="footer-item" sx={{ "& > :not(style)": { m: 1 } }}>
      <Fab
        variant="extended"
        onClick={() => {
          console.log("chandan");
          copy(link, { debug: true, message: "Press #{key} to copy" });
        }}
      >
        <ContentCopyRoundedIcon sx={{ mr: 1 }} />
        {link}
      </Fab>
      <Fab
        color="primary"
        aria-label="add"
        style={{ color: "white", backgroundColor: "red" }}
      >
        <CallEndRoundedIcon />
      </Fab>
      <Fab
        color="secondary"
        aria-label="edit"
        onClick={() => {
          console.log(stream);
          stream.getTracks().forEach((track) => {
            if (track.kind === "video") {
              track.enabled = !track.enabled;
            }
          });
        }}
      >
        <EditIcon />
      </Fab>

      <Fab disabled aria-label="like">
        <FavoriteIcon />
      </Fab>
    </Box>
    // <Box className="footer-item">
    //   <Button
    //     variant="contained"
    //     style={{ color: "white", marginRight: "7px" }}
    //     endIcon={<IoCopy />}
    //   >
    //     {link}
    //   </Button>
    //   <CopyToClipboard text={link} className="left-item">
    //     <div className="icon-block">
    //       <Typography
    //         variant="h6"
    //         gutterBottom
    //         style={{ color: "white", marginRight: "7px" }}
    //         component="div"
    //       >
    //         {link}
    //       </Typography>
    //       <IoCopy color="white" size={"20px"} />
    //     </div>
    //   </CopyToClipboard>
    // </Box>
    // <div className="footer-item">
    //   <div className="left-item">
    //     {/* <div className="icon-block">
    //       Meeting details
    //       <FontAwesomeIcon className="icon" icon={faAngleUp} />
    //     </div> */}
    //     <div className="meet-link">
    //       <span>{link || "url"}</span>
    //       <CopyToClipboard text={link}>
    //         <h4 className="icon"> copy</h4>
    //       </CopyToClipboard>
    //     </div>
    //   </div>
    //   <div className="center-item">
    //     {/* <div
    //       className={`icon-block ${!isAudio ? "red-bg" : null}`}
    //       onClick={() => toggleAudio(!isAudio)}
    //     >
    //       <FontAwesomeIcon
    //         className="icon"
    //         icon={isAudio ? faMicrophone : faMicrophoneSlash}
    //       />
    //     </div> */}
    //     <div className="icon-block" onClick={disconnectCall}>
    //       <FontAwesomeIcon className="icon red" icon={faPhone} />
    //     </div>
    //     {/* <div className="icon-block">
    //       <FontAwesomeIcon className="icon" icon={faVideo} />
    //     </div> */}
    //   </div>
    //   <div className="right-item">
    //     {/* <div className="icon-block">
    //       <FontAwesomeIcon className="icon red" icon={faClosedCaptioning} />
    //       <p className="title">Turn on captions</p>
    //     </div> */}

    //     {/* {isPresenting ? (
    //       <div className="icon-block" onClick={stopScreenShare}>
    //         <FontAwesomeIcon className="icon red" icon={faDesktop} />
    //         <p className="title">Stop presenting</p>
    //       </div>
    //     ) : (
    //       <div className="icon-block" onClick={screenShare}>
    //         <FontAwesomeIcon className="icon red" icon={faDesktop} />
    //         <p className="title">Present now</p>
    //       </div>
    //     )} */}
    //   </div>
    // </div>
  );
};

export default CallPageFooter;
