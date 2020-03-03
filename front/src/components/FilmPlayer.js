import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import { API_ENDPOINT } from "../constant";

const FilmPlayer = props => {
  const [sub, setSub] = useState(null);

  const getSub = () => {
    fetch(`${API_ENDPOINT}/movie/sub/${props.imdbId}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "GET"
    })
      .then(res => res.json())
      .then(res => {
        setSub(res);
      });
  };
  if ((sub === null || sub.en === undefined) && props.imdbId !== undefined)
    getSub();

  return (
    <Card>
      <video
        style={{ height: "100%", width: "100%" }}
        id="videoPlayer"
        controls
      >
        <source src={`${API_ENDPOINT}/movie/${props.id}`} type="video/mp4" />
        {sub !== null && sub.en !== undefined ? (
          <track
            kind="subtitles"
            label="English"
            src={`data:text/vtt;base64, ${sub.en}`}
          />
        ) : null}
        {sub !== null && sub.fr !== undefined ? (
          <track
            kind="subtitles"
            label="French"
            src={`data:text/vtt;base64, ${sub.fr}`}
          />
        ) : null}
        {sub !== null && sub.es !== undefined ? (
          <track
            kind="subtitles"
            label="Spanish"
            src={`data:text/vtt;base64, ${sub.es}`}
          />
        ) : null}
      </video>
    </Card>
  );
};

export default FilmPlayer;
