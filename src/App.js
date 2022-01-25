import React from "react";
import { Typography, AppBar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VideoPlayer from "./components/video_player";
import Options from "./components/option";
import Notifications from "./components/notifications";
import CallPage from "./components/call_page/CallPage";
import { Link, Routes, Route } from "react-router-dom";
import Main from "./components/main_page/MainPage";
import { ContextProvider } from "./SocketContext";
import CallJoinPage from "./components/call_join_page/CallJoinPage";

const useStyles = makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: "30px 100px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "600px",
    border: "2px solid black",

    [theme.breakpoints.down("xs")]: {
      width: "90%",
    },
  },
  image: {
    marginLeft: "15px",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
}));

const App = () => {
  const classes = useStyles();
  return (
    // <div>
    //   <h1>Bookkeeper</h1>
    //   <nav
    //     style={{
    //       borderBottom: "solid 1px",
    //       paddingBottom: "1rem",
    //     }}
    //   >
    //     <Link to="/invoices">Invoices</Link> |{" "}
    //     <Link to="/expenses">Expenses</Link>
    //   </nav>
    // </div>
    <Routes>
      <Route exact path="/join" element={<CallJoinPage />} />
      <Route exact path="/:id" element={<CallPage />} />
      <Route exact path="/" element={<Main />} />
      {/* <Route exact path="/=*" element={<NoPage />} /> */}
    </Routes>

    // <div className={classes.wrapper}>
    //   <AppBar className={classes.appBar} position="static" color="inherit">
    //     <Typography variant="h2" align="center">
    //       Kadarla Meet
    //     </Typography>
    //   </AppBar>

    //   <VideoPlayer />
    //   <Options>
    //     <Notifications />
    //   </Options>
    // </div>
  );
};

export default App;
