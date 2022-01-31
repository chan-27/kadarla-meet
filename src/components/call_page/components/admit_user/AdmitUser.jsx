import React, { useContext } from "react";
import "./AdmitUser.scss";

import { SocketContext } from "../../../../SocketContext";

const AdmitUser = () => {
  const { answerCall, call } = useContext(SocketContext);
  return (
    <>
      {call.isReceivingCall && !call.isCallAccepted && (
        <div className="admit-block">
          <div className="meeting-header">
            <h3>Admit Request</h3>
            <h4 className="icon"> close</h4>
          </div>
          {/* <p className="info-text">
        You have been invited to join a meeting. Please click the button below
      </p> */}
          <div className="meet-link">
            <span> {call.userDetails.name}</span>
            <h4 className="icon" onClick={answerCall}>
              ADMIT
            </h4>
          </div>
        </div>
      )}
    </>
  );
};

export default AdmitUser;
