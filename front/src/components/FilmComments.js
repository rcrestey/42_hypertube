import React, { useState } from "react";
import Link from "@material-ui/core/Link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";

import { API_ENDPOINT, FRONT_ENDPOINT } from "../constant";

export default function FilmComments(props) {
  const [comments, setComments] = useState(null);
  const [newComments, setNewComments] = useState("");
  function getComments() {
    fetch(`${API_ENDPOINT}/movie/comments/${props.id}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        setComments(res);
      });
  }

  function postComments() {
    fetch(`${API_ENDPOINT}/movie/comments/${props.id}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ payload: newComments })
    })
      .then(res => res.json())
      .then(res => {
        getComments();
      });
  }
  if (comments === null) getComments();
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Comments</TableCell>
            <TableCell></TableCell>
            <TableCell>
              <div>
                <InputBase
                  placeholder="Send a Comment"
                  inputProps={{ "aria-label": "search google maps" }}
                  value={newComments}
                  onChange={e => {
                    setNewComments(e.target.value);
                  }}
                />
                <IconButton aria-label="search" onClick={postComments}>
                  <SendIcon />
                </IconButton>
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(comments) === true
            ? comments.map((comment, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link href={`${FRONT_ENDPOINT}/user/${comment.uuid}`}>
                      <img alt="" src={comment.path} height="50px" />
                    </Link>
                  </TableCell>
                  <TableCell>{comment.username}</TableCell>
                  <TableCell>{comment.payload}</TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
