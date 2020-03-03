import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import FilmPlayer from "../components/FilmPlayer";
import FilmInfo from "../components/FilmInfo";
import FilmComments from "../components/FilmComments";
import { API_ENDPOINT } from "../constant";
import Footer from "../components/Footer";
import Box from "@material-ui/core/Box";

const FilmPage = props => {
  const [movieInfo, setMovieInfo] = useState({});

  function getFilmInfo() {
    fetch(`${API_ENDPOINT}/movie/information/${props.match.params.id}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        setMovieInfo(res);
      });
    fetch(`${API_ENDPOINT}/movie/isee/${props.match.params.id}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "GET"
    });
  }
  if (movieInfo.id === undefined || movieInfo.id === null) getFilmInfo();
  return (
    <div>
      <NavBar />
      <Container component="main">
        <FilmInfo movieInfo={{ ...movieInfo }} />
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item>
            <FilmPlayer id={props.match.params.id} imdbId={movieInfo.imdbId} />
          </Grid>
          <Grid item>
            <FilmComments id={props.match.params.id} />
          </Grid>
        </Grid>
      </Container>
      <Box mt={5}>
        <Footer />
      </Box>
    </div>
  );
};

export default FilmPage;
