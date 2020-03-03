import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Container from "@material-ui/core/Container";

import { API_ENDPOINT } from "../constant";
import { FRONT_ENDPOINT } from "../constant";
import Footer from "./Footer";

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
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  root2: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
}));

export default function HomeList() {
  const [limit, setLimit] = useState(15);
  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      setSortBy(newAlignment);
    }
  };

  // TIER
  const [sortBy, setSortBy] = useState("");

  // FILTER
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [rating, setRating] = useState([0, 10]);
  const [year, setYear] = useState([1950, 2020]);
  const [result, setResult] = useState([]);
  useEffect(() => {
    fetch(`${API_ENDPOINT}/home/1/${limit}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        search,
        sortBy,
        filterGender,
        ratingMin: rating[0],
        ratingMax: rating[1],
        yearMin: year[0],
        yearMax: year[1]
      })
    })
      .then(res => res.json())
      .then(res => {
        setResult(res);
      });
  }, [limit, filterGender, rating, search, sortBy, year]);
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleChange2 = (event, newValue) => {
    setRating(newValue);
  };
  const handleChange3 = (event, newValue) => {
    setYear(newValue);
  };

  return (
    <Container component="main">
      <ExpansionPanel
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>More options</Typography>
          <Typography className={classes.secondaryHeading}>
            Order filter and search advenced params
          </Typography>
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
                <Typography variant="h6" gutterBottom>
                  ORDER BY
                </Typography>
                <div className={classes.toggleContainer}>
                  <ToggleButtonGroup
                    value={sortBy}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                  >
                    <ToggleButton value="title" aria-label="left aligned">
                      TITLE
                    </ToggleButton>
                    <ToggleButton value="rating" aria-label="centered">
                      RATING
                    </ToggleButton>
                    <ToggleButton value="year" aria-label="right aligned">
                      YEARS
                    </ToggleButton>
                    <ToggleButton value="gender" aria-label="right aligned">
                      GENDER
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom>
                  SEARCH
                </Typography>
                <div className={classes.toggleContainer}>
                  <InputBase
                    className={classes.input}
                    placeholder="Search a Movie"
                    inputProps={{ "aria-label": "search google maps" }}
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value);
                    }}
                  />
                  <IconButton
                    className={classes.iconButton}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </div>
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom>
                  FITER BY GENDER
                </Typography>
                <div className={classes.toggleContainer}>
                  <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel htmlFor="filled-age-native-simple">
                      GENDER
                    </InputLabel>
                    <Select
                      native
                      value={filterGender}
                      onChange={e => {
                        setFilterGender(e.target.value);
                      }}
                      inputProps={{
                        name: "filterGender",
                        id: "filled-age-native-simple"
                      }}
                    >
                      <option value="" />
                      <option value={"comedy"}>comedy</option>
                      <option value={"sci-fi"}>sci-fi</option>
                      <option value={"horror"}>horror</option>
                      <option value={"romance"}>romance</option>
                      <option value={"action"}>action</option>
                      <option value={"thriller"}>thriller</option>
                      <option value={"drama"}>drama</option>
                      <option value={"mystery"}>mystery</option>
                      <option value={"crime"}>crime</option>
                      <option value={"animation"}>animation</option>
                      <option value={"adventure"}>adventure</option>
                      <option value={"fantasy"}>fantasy</option>
                    </Select>
                  </FormControl>
                </div>
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom>
                  FILTER BY RATING
                </Typography>
                <div>
                  <Slider
                    value={rating}
                    onChange={handleChange2}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    max={10}
                  />
                </div>
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.paper}>
                <Typography variant="h6" gutterBottom>
                  FILTER BY YEAR
                </Typography>
                <div>
                  <Slider
                    value={year}
                    onChange={handleChange3}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={1950}
                    max={2020}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          GO
        </Button>
      </ExpansionPanel>

      <Grid
        container
        justify="space-evenly"
        alignItems="baseline"
        direction="row"
        spacing={4}
      >
        {Array.isArray(result)
          ? result.map(({ id, title, year, rating, image, isSeen }) => (
              <Grid item key={id}>
                <Card className={classes.root2}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={image}
                      title={title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {isSeen === true ? <Visibility /> : <VisibilityOff />}
                        <Rating name="simple-controlled" value={rating / 2} />
                        {year}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      href={`${FRONT_ENDPOINT}/film/${id}`}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          : "no result"}
      </Grid>
      {
        (window.onscroll = function(ev) {
          if (
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight
          ) {
            setLimit(limit + 15);
          }
        })
      }
      {/* <Button
        fullWidth
        component="button"
        onClick={() => {
          setLimit(limit + 9);
        }}
      >
        MORE
      </Button> */}

      <Box mt={8}>
        <Footer />
      </Box>
    </Container>
  );
}
