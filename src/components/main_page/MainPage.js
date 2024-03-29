import React, { useContext, useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../../SocketContext";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  mainDiv: {
    display: "flex",
    height: "100vh",

    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    alignItems: "center",
  },
  header: {
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "30px",
  },
  mainHeading: {
    textAlign: "center",
    color: "white",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  containerStyle: {
    border: "1px solid rgba(0, 0, 0, 0.05)",
    backgroundColor: "rgba(255, 255,255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    margin: "10",
    padding: "10",
  },
  paper: {
    margin: theme.spacing(4, 3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Main() {
  const classes = useStyles();
  const [meetCode, setMeetCode] = useState("");
  let [backgroundImage, setBackgroundImage] = useState(null);
  const [createMeet, setCreateMeet] = useState(true);
  const { name, setName, startCall, me, callUser, getCurrentStream, myVideo } =
    useContext(SocketContext);
  const navigate = useNavigate();

  const handleCreateMeet = async () => {
    console.log("handleSubmit");
    await startCall();
  };

  const handleJoinMeet = async () => {
    console.log(meetCode);

    navigate(`/join`, { state: { isAdmin: false, id: meetCode } });
  };

  useEffect(() => {
    fetch("https://kadarla-video-call.herokuapp.com/image")
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setBackgroundImage(data.image));
  }, []);

  return (
    <div
      className={classes.mainDiv}
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : "url(https://images.unsplash.com/photo-1573804613658-6e8bc17661c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Z29vZ2xlJTIwbWVldHxlbnwwfHwwfHw%3D&w=1000&q=80)",
      }}
    >
      <Grid container spacing={10}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div className={classes.header}>
            <Typography
              component="h1"
              variant="h3"
              className={classes.mainHeading}
            >
              Kadarla's Meet Up
            </Typography>
            {/* <video playsInline muted ref={myVideo} autoPlay /> */}
          </div>
        </Grid>
        {createMeet ? (
          <Grid item xs={12}>
            <Container className={classes.containerStyle} maxWidth="xs">
              <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                  Create a meet
                </Typography>

                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoFocus
                />
                <Button
                  disabled={name === ""}
                  color="primary"
                  variant="contained"
                  fullWidth
                  className={classes.submit}
                  type="submit"
                  onClick={handleCreateMeet}
                >
                  Start meet
                </Button>
                <Typography style={{ marginBottom: "10px" }}>or</Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setCreateMeet(false);
                  }}
                >
                  Join a Meet
                </Button>
              </div>
            </Container>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Container className={classes.containerStyle} maxWidth="xs">
              <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                  Join a meet
                </Typography>

                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  onChange={(e) => setMeetCode(e.target.value)}
                  fullWidth
                  id="MeetingId"
                  label="Code"
                  name="code"
                  autoFocus
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                />

                <Button
                  disabled={!(meetCode !== "" && name !== "")}
                  color="secondary"
                  variant="contained"
                  fullWidth
                  className={classes.submit}
                  type="submit"
                  onClick={handleJoinMeet}
                >
                  join meet
                </Button>
                <Typography style={{ marginBottom: "10px" }}> or</Typography>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setCreateMeet(true);
                  }}
                >
                  Create a Meet
                </Button>
              </div>
            </Container>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
