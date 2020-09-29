import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { BASE_URL } from '../Common/constants';
import SingleDesk from '../SingleDesk/SingleDesk';
import toastr from 'toastr';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';

const AdminMatrix = (props) => {
  const setReset = props.setReset;
  const resetPage = props.resetPage;
  const workplace = props.workplace;
  const workplaceId = workplace.id;
  const setWorkplaceToView = props.setWorkplaceToView;
  const matrix = JSON.parse(workplace.matrixmodel);
  const threshholdvalues = [
    workplace.floorplaning.ratio50,
    workplace.floorplaning.ratio75,
  ];
  const [namedontmatter, setnamedontmatter] = useState(false);
  const [ratiosToSend, setRatiosToSend] = useState('');
  const desks = workplace.desks.desks;

  const [users, setUsers] = useState('');
  useEffect(() => {
    fetch(`${BASE_URL}/api/admin/workplace/${workplaceId}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) {
          throw new Error(result.message);
        }
        setUsers(result);
      })
      .catch((error) => error.message);
  }, []);

  const changeTreshholdValues = (values) => {
    const ratiosToSend = { newRatios: values.split(',') };
    if (ratiosToSend.newRatios[0] > 100) {
      toastr.error(`кви са тия проценти, приятел`);
    }

    fetch(`${BASE_URL}/api/admin/workplace/${workplaceId}/treshhold`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(ratiosToSend),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) {
          throw new Error(result.message);
        }

        setReset(!resetPage);
      })
      .catch((error) => error.message);
  };

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
        Threshhold values: {`${threshholdvalues[0]}% - ${threshholdvalues[1]}%`}
      </h3>
      <button onClick={() => setnamedontmatter(!namedontmatter)}>
        Change threshhold values
      </button>
      {namedontmatter ? (
        <>
          <input
            type='text'
            placeholder={'Write the new % with , between them.'}
            onChange={(e) => setRatiosToSend(e.target.value)}
          ></input>
          <button
            onClick={() => (
              changeTreshholdValues(ratiosToSend),
              setnamedontmatter(!namedontmatter)
            )}
          >
            send
          </button>
        </>
      ) : null}
      <br />
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
                  <Grid item /* sloji key-ove */>
                    <Paper className={classes.paper}>0</Paper>
                  </Grid>
                );
              } else if (e === 1) {
                return (
                  <Grid item>
                    <SingleDesk
                      key={(b = desks[increment()].id)}
                      deskid={b}
                      desks={desks}
                      workplaceId={workplaceId}
                      workplace={workplace}
                      setWorkplaceToView={setWorkplaceToView}
                      resetPage={resetPage}
                      setReset={setReset}
                      users={users}
                    />
                  </Grid>
                );
              } else if (e === 2) {
                return (
                  <Grid item>
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

export default AdminMatrix;
