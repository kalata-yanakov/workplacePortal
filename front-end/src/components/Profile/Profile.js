import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { Typography, Button, Icon } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { blue } from '@material-ui/core/colors';
import UserContext from '../Providers/UserContext';
import { BASE_URL } from '../Common/constants';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import toastr from 'toastr';

const useStyles = makeStyles((theme) => ({
  surrounding: {
    paddingTop: '30px',
  },
  root: {
    maxWidth: 345,
    paddingTop: '20px',
    margin: 'auto',
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
    backgroundSize: '150px 150px',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: blue[500],
  },
}));

const ProfileCard = (props) => {
  const history = props.history;
  const classes = useStyles();

  const { user } = useContext(UserContext);

  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const handleDateStart = (date) => {
    setSelectedStartDate(date);
  };

  const [selectedEndDate, setSelectedEndDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const handleDateEnd = (date) => {
    setSelectedEndDate(date);
  };

  const applyVacation = (startDate, endDate) => {
    const vacationStart = startDate.toISOString().slice(0, 10);
    const vacationEnd = endDate.toISOString().slice(0, 10);

    fetch(`${BASE_URL}/api/users/holiday`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({
        HolidayStartDate: vacationStart,
        HolidayEndDate: vacationEnd,
      }),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) {
          throw new Error(result.message);
        }
        toastr['success']('Vacation applied!');
      })
      .catch((error) => error.message);
  };

  const cancelVacation = () => {
    fetch(`${BASE_URL}/api/users/holidayCancelation`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) {
          throw new Error(result.message);
        }
        toastr['info']('Vacation cancelled!');
      })
      .catch((error) => error.message);
  };

  return (
    <div className={classes.surrounding}>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label='recipe' className={classes.avatar}></Avatar>
          }
          title='Employee profile '
          subheader={user.role}
        />
        <CardMedia
          className={classes.media}
          image={
            'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'
          }
          style={{ height: '50px' }}
        />
        <CardContent>
          <Typography
            variant='body2'
            color='textSecondary'
            component='p'
            variant='body1'
          >
            Employee name: {user.firstName} {user.lastName}
          </Typography>
          <Typography
            variant='body2'
            color='textSecondary'
            component='p'
            variant='body1'
          >
            Employee number: {user.id}
          </Typography>

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify='space-around'>
              <KeyboardDatePicker
                margin='normal'
                id='date-picker-dialog'
                format='MM/dd/yyyy'
                value={selectedStartDate}
                onChange={handleDateStart}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <KeyboardDatePicker
                margin='normal'
                id='date-picker-dialog2'
                format='MM/dd/yyyy'
                value={selectedEndDate}
                onChange={handleDateEnd}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Button
              variant='contained'
              color='primary'
              className={classes.button}
              endIcon={<Icon>send</Icon>}
              style={{ margin: '1.8em', background: '#05386b' }}
              onClick={() => applyVacation(selectedStartDate, selectedEndDate)}
            >
              Apply it!
            </Button>

            <Button
              variant='contained'
              color='secondary'
              className={classes.button}
              endIcon={<Icon>cancel</Icon>}
              style={{ backgroundColor: '#DC3D24' }}
              onClick={() => cancelVacation()}
            >
              Cancel
            </Button>
          </MuiPickersUtilsProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCard;
