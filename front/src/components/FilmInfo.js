import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  paper1: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

export default function FilmInfo(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <ExpansionPanel
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography className={classes.heading}>
          {props.movieInfo.runtime} min
        </Typography>
        <Typography className={classes.heading}>
          {props.movieInfo.title} - {props.movieInfo.year}
        </Typography>
        <Rating name="simple-controlled" value={props.movieInfo.rating / 2} />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid
          container
          justify="space-around"
          alignItems="center"
          direction="row"
          spacing={4}
        >
          <Grid item>
            <Paper className={classes.paper}>
              <img alt="" src={props.movieInfo.cover} height="42%" />
            </Paper>
          </Grid>
          <Grid item>
            <Paper className={classes.paper1}>
              <Typography className={classes.heading}>Resume</Typography>
              <Typography>{props.movieInfo.resume}</Typography>
            </Paper>
          </Grid>
          <Grid item>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Photo</TableCell>
                    <TableCell align="right">Kind</TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Character</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="right">
                      <img alt="" src="" />
                    </TableCell>
                    <TableCell align="right">Producer</TableCell>
                    <TableCell align="right">
                      {props.movieInfo.producer}
                    </TableCell>
                    <TableCell align="right">none</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="right">
                      <img alt="" src="" />
                    </TableCell>
                    <TableCell align="right">Director</TableCell>
                    <TableCell align="right">
                      {props.movieInfo.director}
                    </TableCell>
                    <TableCell align="right">none</TableCell>
                  </TableRow>

                  {props.movieInfo.casting !== undefined &&
                  Array.isArray(props.movieInfo.casting)
                    ? props.movieInfo.casting.map((actor, index) => (
                        <TableRow key={index}>
                          <TableCell align="right">
                            <img alt="" src={actor.url_small_image} />
                          </TableCell>
                          <TableCell align="right">Actor</TableCell>
                          <TableCell align="right">{actor.name}</TableCell>
                          <TableCell align="right">
                            {actor.character_name}
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item>
            <Paper>
              <iframe
                title="trailer"
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${props.movieInfo.trailer}`}
                frameBorder={0}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </Paper>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
