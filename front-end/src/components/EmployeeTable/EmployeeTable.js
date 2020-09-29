import React, { useContext, useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { BASE_URL } from '../Common/constants';
import UserContext from '../Providers/UserContext';
import toastr from 'toastr';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
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

const EmployeeTable = () => {
  const classes = useStyles();
  const userContext = useContext(UserContext);
  const loggedUser = userContext.user;

  const [state, setState] = useState({
    columns: [
      {
        title: 'Id',
        field: 'id',
        type: 'numeric',
        editable: 'never',
        defaultGroupSort: 'asc',
        cellStyle: {
          width: 20,
          minWidth: 20,
          maxWidth: 20,
        },
        headerStyle: {
          width: 20,
          minWidth: 20,
          maxWidth: 20,
        },
      },
      {
        title: 'First Name',
        field: 'firstName',
        editable: 'never',
        cellStyle: {
          width: 150,
          minWidth: 150,
          maxWidth: 150,
        },
        headerStyle: {
          width: 150,
          minWidth: 150,
          maxWidth: 150,
        },
      },
      {
        title: 'Last Name',
        field: 'lastName',
        editable: 'never',
        cellStyle: {
          width: 150,
          minWidth: 150,
          maxWidth: 150,
        },
        headerStyle: {
          width: 150,
          minWidth: 150,
          maxWidth: 150,
        },
      },
      {
        title: 'Country',
        field: 'country',
        editable: 'onUpdate',
        cellStyle: {
          width: 150,
          minWidth: 150,
          maxWidth: 150,
        },
        headerStyle: {
          width: 150,
          minWidth: 150,
          maxWidth: 150,
        },
        align: 'left',
        lookup: {
          Bulgaria: 'Bulgaria',
          Russia: 'Russia',
          Norway: 'Norway',
          Belgium: 'Belgium',
          India: 'India',
          Greece: 'Greece',
          Austria: 'Austria',
          Chile: 'Chile',
        },
      },
      {
        title: 'Vacation-start',
        field: 'HolidayStartDate',
        type: 'date',
        editable: 'never',
        dateSetting: { locale: 'string' },
        cellStyle: {
          width: 20,
          minWidth: 20,
          maxWidth: 20,
        },
        headerStyle: {
          width: 20,
          minWidth: 20,
          maxWidth: 20,
        },
      },
      {
        title: 'Vacation-end',
        field: 'HolidayEndDate',
        type: 'date',
        editable: 'never',
        dateSetting: { locale: 'string' },
        cellStyle: {
          width: 20,
          minWidth: 20,
          maxWidth: 20,
        },
        headerStyle: {
          width: 20,
          minWidth: 20,
          maxWidth: 20,
        },
      },

      {
        title: 'Location',
        field: 'location',
        editable: 'onUpdate',
        cellStyle: {
          width: 100,
          minWidth: 100,
          maxWidth: 100,
        },
        headerStyle: {
          width: 100,
          minWidth: 100,
          maxWidth: 100,
        },
        align: 'left',
        lookup: {
          Office: 'Office',
          Home: 'Home',
          Vacation: 'Vacation',
        },
      },
      {
        title: 'Project',
        field: 'project',
        editable: 'onUpdate',
        cellStyle: {
          width: 100,
          minWidth: 100,
          maxWidth: 100,
        },
        headerStyle: {
          width: 100,
          minWidth: 100,
          maxWidth: 100,
        },
        lookup: {
          Telerik: 'Telerik',
          NKpro: 'NKpro',
        },
      },
    ],
    data: [],
  });

  const [userData, setuserData] = useState([]);
  const [isClicked, setIsclicked] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [thisWeekData, setThisWeekData] = useState([]);

  const mondayOfWeek = moment().day(1);
  const fridayOfWeek = moment().day(5);
  const mondayOfNextWeek = mondayOfWeek.clone().add(7, 'days');
  const fridayOfNextWeek = fridayOfWeek.clone().add(7, 'days');

  const [weekDays, setWeekDays] = useState({
    fromDay: mondayOfWeek.format('L'),
    toDate: fridayOfWeek.format('L'),
  });

  useEffect(() => {
    fetch(`${BASE_URL}/api/users/userInfo`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.message);
        }
        setuserData(data);
      })
      .catch((error) => error.message);
  }, [isClicked]);

  const loadThisWeekData = () => {
    fetch(`${BASE_URL}/api/covidData/changesByPercentFirstWeek`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.message);
        }
        setThisWeekData([data.flat()]);
      })
      .catch((error) => error.message);
  };

  const loadNextWeekData = () => {
    fetch(`${BASE_URL}/api/covidData/changesByPercentNextWeek`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.message);
        }
        setThisWeekData([...thisWeekData, data]);
      })
      .catch((error) => error.message);
  };

  const seeShedule = () => {
    loadThisWeekData();
    setShowSchedule(true);
  };

  const seeNextWeekAndButton = () => {
    setWeekDays({
      fromDay: mondayOfNextWeek.format('L'),
      toDate: fridayOfNextWeek.format('L'),
    });
    setShowButton(!showButton);
    loadNextWeekData();
  };

  const goBackToWeekAndButton = () => {
    setWeekDays({
      fromDay: mondayOfWeek.format('L'),
      toDate: fridayOfWeek.format('L'),
    });
    setShowButton(false);
  };

  const sendReminderEmail = () => {
    const emailRecepients = userData.map(({ email }) => email);

    fetch(`${BASE_URL}/sendEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ email: emailRecepients }),
    })
      .then((r) => r.text())
      .then((data) => {
        if (data.error) {
          throw new Error(data.message);
        }
      })
      .catch((error) => error.message);
  };
  return (
    <>
      <Button
        variant='contained'
        color='primary'
        className={classes.button}
        style={{
          margin: '2.4em',
          padding: '0.6em',
          background: '#E3AE57',
          color: '#232B2B',
        }}
        onClick={seeShedule}
      >
        Weekly schedule
      </Button>
      <Button
        variant='contained'
        color='primary'
        className={classes.button}
        style={{
          margin: '2.4em',
          padding: '0.6em',
          background: '#05386b',
          color: '#edf5e1',
        }}
        onClick={sendReminderEmail}
      >
        Send reminders
      </Button>
      {showSchedule ? (
        <form className={classes.container} noValidate>
          <TextField
            id='date'
            label='Week from'
            value={weekDays.fromDay}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={true}
          />
          <TextField
            id='dateiD'
            label='Week to'
            value={weekDays.toDate}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={true}
          />
          <Button
            variant='contained'
            color='primary'
            className={classes.button}
            style={{
              margin: '2.4em',
              padding: '0.6em',
              background: '#E3AE57',
              color: '#232B2B',
            }}
            onClick={seeNextWeekAndButton}
          >
            Next week
          </Button>
          {showButton ? (
            <Button
              variant='contained'
              color='secondary'
              className={classes.button}
              style={{
                margin: '2.4em',
                padding: '0.6em',
                background: '#E3AE57',
                color: '#232B2B',
              }}
              onClick={goBackToWeekAndButton}
            >
              This week
            </Button>
          ) : null}
        </form>
      ) : null}

      <MaterialTable
        title='Employee table'
        columns={state.columns}
        data={
          thisWeekData.length === 0
            ? userData
            : thisWeekData[thisWeekData.length - 1]
        }
        editable={
          loggedUser.role === 'Admin'
            ? {
                onRowUpdate: (newData, oldData) => {
                  return fetch(`${BASE_URL}/api/admin/updateUser`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${
                        localStorage.getItem('token') || ''
                      }`,
                    },
                    body: JSON.stringify({ ...newData }),
                  })
                    .then((r) => r.json())
                    .then((result) => {
                      if (result.error) {
                        throw new Error(result.message);
                      }
                      if (oldData) {
                        setState((prevState) => {
                          const data = [...prevState.data];
                          data[data.indexOf(oldData)] = newData;
                          toastr['success']('Field changed!');
                          return { ...prevState, data };
                        });
                        setIsclicked(!isClicked);
                      }
                    })
                    .catch((error) => error.message);
                },
              }
            : null
        }
        options={{
          tableLayout: 'auto',
          padding: 'dense',
          pageSize: 10,
          doubleHorizontalScroll: false,
          headerStyle: {
            width: 26,
            whiteSpace: 'nowrap',
            textAlign: 'left',
            flexDirection: 'row',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            paddingLeft: 5,
            paddingRight: 5,
            backgroundColor: '#DC3D24',
            color: 'whitesmoke',
            fontWeight: 'bold',
            fontSize: 16,
          },
          rowStyle: { backgroundColor: '#E5E5E5' },
        }}
      />
    </>
  );
};

export default EmployeeTable;
