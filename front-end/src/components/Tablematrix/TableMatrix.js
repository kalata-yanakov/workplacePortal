import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const TableMatrix = (props) => {
  const workplace = props.workplace;
  const matrix = JSON.parse(workplace.matrixmodel);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    container: {
      display: 'grid',
      gridTemplateColumns: `repeat(${matrix.matrix[0].length}, 1fr)`,
      gridGap: theme.spacing(1),
      gridTemplateRows: `repeat(${matrix.matrix.length}, 1fr)`,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    container1: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(0),
      width: 150,
      padding: '0.9em',
    },
  }));

  const counter = (a = 0) => () => a++;
  const increment = counter();
  let b;

  const classes = useStyles();

  const mondayOfWeek = moment().day(1);
  const fridayOfWeek = moment().day(5);

  const [weekDays, setWeekDays] = useState({
    fromDay: mondayOfWeek.format('L'),
    toDate: fridayOfWeek.format('L'),
  });

  return (
    <>
      <h3>
        Infected percent for{' '}
        {`${workplace.country.name}: ${workplace.currentPercent}%`}
      </h3>
      <h3>
        current threshhold values:{' '}
        {`${workplace.floorplaning.ratio50}% - ${workplace.floorplaning.ratio75}%`}
      </h3>

      <TextField
        id='date'
        value={weekDays.fromDay}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        disabled={true}
      />

      <TextField
        id='dateiD'
        value={weekDays.toDate}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        disabled={true}
      />
      <div className={classes.root}>
        <Grid container className={classes.container} spacing={2}>
          {matrix.matrix.map((el) =>
            el.map((e) => {
              if (e === 0) {
                return (
                  <Grid item /*xs={1}*/>
                    <Paper className={classes.paper}>0</Paper>
                  </Grid>
                );
              } else if (e === 1) {
                return (
                  <Grid item /*xs={1}*/>
                    <Paper
                      className={classes.paper}
                      style={
                        workplace.desks.desks[(b = increment())].user !== null
                          ? { backgroundColor: '#A52A2A', maxHeight: '50px' }
                          : { backgroundColor: '#228B22', maxHeight: '50px' }
                      }
                    >
                      {workplace.desks.desks[b].user !== null
                        ? workplace.desks.desks[b].user.username
                        : 'free'}
                    </Paper>
                  </Grid>
                );
              } else if (e === 2) {
                return (
                  <Grid item /*xs={1}*/>
                    <Paper
                      className={classes.paper}
                      style={{ backgroundColor: '#DC3D24' }}
                    >
                      Forbidden
                    </Paper>
                  </Grid>
                );
              }
            })
          )}
        </Grid>
      </div>
    </>
  );
};

export default TableMatrix;
