import React, { useState } from "react";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { database } from "../firebase/firebaseConfig";
import {
  Button,
  Container,
  Fab,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Footer from "./Footer";
import Header from "./Header";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

const useStyles = makeStyles((theme) => ({
  maxWidthSm: {
    maxWidth: "70%",
  },
  text: {
    fontSize: "20px",
    fontWeight: "10",
  },
  questionInput: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "3px 6px 13px 1px #ddd",
    
    "&:hover": {
      boxShadow: "none",
      // border:"3px solid green"
    },
    "&:focus": {
      border: "3px solid green",
    },
    padding: "20px",
    size: "2rem",
  },
  option: {
    width: "100%",
    marginTop: "20px",
    marginRight: "3px",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "3px 6px 13px 1px #ddd",
    "&:hover": {
      border: "none",
      boxShadow: "none",
    },
    padding:"10px"
  },
  deleteBtn: {
    cursor: "pointer",
    color: "red",
    fontSize: "30px",
    marginTop: "15px",
  },
  margin: {
    marginTop: theme.spacing(5),
  },
  createBtn: {
    marginTop: theme.spacing(5),
    padding: "15px",
    "&:disabled": {
      cursor: "not-allowed",
    },
  },
  
 
}));

export default function CreatePoll(props) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleCreate = async () => {
    setDisable(true);
    const optionAndVotesArr = options.map((option) => {
      return {
        optionName: option,
        votes: 0,
      };
    });
    let poll = {
      question,
      options,
      totalVotes: 0,
      votesToEachOption: optionAndVotesArr,
    };
    try {
      let resp = database.polls.doc();
      let pollId = resp.id;
      await resp.set(poll);
      let iop = JSON.parse(localStorage.getItem("pollIds"));
      let oldPollIds = iop == null ? [] : iop;
      oldPollIds.push(pollId);
      console.log(oldPollIds);
      localStorage.setItem("pollIds", JSON.stringify(oldPollIds));
      setDisable(false);
      props.history.push(`/new/${pollId}`);
    } catch (err) {
      console.log("Error :", err);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleDelete = (e) => {
    let idx = Number(e.target.parentNode.id);
    let tempOptions = [...options];
    let UpdatedOptions = [];
    for (let i = 0; i < tempOptions.length; i++) {
      if (i !== idx) {
        UpdatedOptions.push(tempOptions[i]);
      }
    }
    setOptions(UpdatedOptions);
  };

  useEffect(() => {
    if (question !== "") {
      setDisable(false);
    } else {
      setDisable(true);
    }
    for (let i = 0; i < options.length; i++) {
      if (options[i] === "") {
        setDisable(true);
        break;
      } else if (question !== "") {
        setDisable(false);
      } else {
        setDisable(true);
      }
    }
  }, [question, options]);

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  const classes = useStyles();
  return (
    <>
      {loading ? (
        <>
          <Skeleton
            variant="rect"
            width="100%"
            height={250}
            animation="wave"
            marginTop="0px"
            style={{ backgroundColor: "#edf2f7" }}
          />
          <div style={{ maxWidth: "70%", margin: "0 auto" }}>
            <Skeleton
              height={50}
              animation="wave"
              style={{
                width: "300px",
                backgroundColor: "#edf2f7",
                marginTop: "30px",
              }}
            />
            <Skeleton
              animation="wave"
              height={30}
              style={{ width: "500px", backgroundColor: "#edf2f7" }}
            />
            <Skeleton
              animation="wave"
              height={150}
              style={{ margin: "0 auto", backgroundColor: "#edf2f7" }}
            />
            <Skeleton
              animation="wave"
              height={80}
              style={{ margin: "0 auto", backgroundColor: "#edf2f7" }}
            />
            <Skeleton
              animation="wave"
              height={80}
              style={{ margin: "0 auto", backgroundColor: "#edf2f7" }}
            />
          </div>
        </>
      ) : (
        <>
          <Header />
          <Container maxWidth="sm" className={classes.maxWidthSm}>
            <div>
              <h1>Create Poll</h1>
              <p className={classes.text}>
                Complete below fields to create a poll
              </p>
            </div>
            <div>
              {/* <TextField
                className={classes.questionInput}
                id="outlined-multiline-static"
                label="Poll question"
                placeholder="What's your favorite movie?"
                multiline
                rows={4}
                variant="outlined"
                onChange={(e) => setQuestion(e.target.value)}
              /> */}
              {/* <TextareaAutosize
                InputProps={{
                  classes: { notchedOutline: classes.noBorder },
                }}
                autoFocus
                classes={{ notchedOutline: classes.input }}
                InputProps={{
                  disableUnderline: true, // <== added this
                }}
                className={classes.questionInput}
                aria-label="Poll Question"
                minRows={3}
                placeholder="What's your favourite movie"
              /> */}
              <TextField
                variant="standard" // <== changed this
                margin="normal"
                placeholder="What's your favorite movie?"
                multiline
                rows={2}
                required
                fullWidth
                className={classes.questionInput}
                InputProps={{
                  disableUnderline: true, 
                  style: {fontSize: 20},
                  
                }}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              {options.map((option, idx) => {
                return (
                  <div
                    key={idx}
                    id={idx}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      className={classes.option}
                      
                      variant="standard"
                      placeholder={`Option ${idx + 1}`}
                      value={option}
                      InputProps={{
                        disableUnderline: true, 
                        style: {fontSize: 18},
                        
                      }}
                      onChange={(e) => {
                        let tempArr = [...options];
                        tempArr[idx] = e.target.value;
                        setOptions(tempArr);
                      }}
                    />
                    {options.length > 2 ? (
                      <DeleteForeverIcon
                        onClick={handleDelete}
                        className={classes.deleteBtn}
                      />
                    ) : null}
                  </div>
                );
              })}
              <Fab
                color="secondary"
                aria-label="add"
                className={classes.margin}
                onClick={handleAddOption}
              >
                <AddIcon />
              </Fab>
              {/* <Button
                variant="contained"
                style={{
                  backgroundColor: "rgba(7,10,57,155)",
                  boxShadow: "3px 6px 13px 1px #ddd",

                  color: "white",
                }}
                className={classes.createBtn}
                onClick={handleAddOption}
              >
                Add Another Option
              </Button> */}

              <br />
              <Button
                variant="contained"
                style={{
                  backgroundColor: "rgba(104,211,145,155)",
                  boxShadow: "0 10px 20px -8px rgba(0, 0, 0,.7)",

                  color: "white",
                }}
                className={classes.createBtn}
                onClick={handleCreate}
                disabled={disable}
              >
                Create Your Poll
              </Button>
            </div>
          </Container>
          <Footer />
        </>
      )}
    </>
  );
}
