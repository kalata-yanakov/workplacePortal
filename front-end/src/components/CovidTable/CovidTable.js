import React, { useState, useContext, useEffect } from 'react';
import UserContext from '../Providers/UserContext';
import { BASE_URL, countries } from '../Common/constants';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import PostAddIcon from '@material-ui/icons/PostAdd';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Icon } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Modal from '@material-ui/core/Modal';
import Chart from 'react-google-charts';
import CovidContext from '../Providers/CovidContext';
import { withStyles } from '@material-ui/core/styles';

const columns = [
  { id: 'id', label: 'Id', minWidth: 50 },
  {
    id: 'country',
    label: 'Country',
    minWidth: 100,
    align: 'center',
  },
  { id: 'cases', label: 'TotalCases', minWidth: 100 },
  {
    id: 'testsPerOneMillion',
    label: 'Tests/OneMillion',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'todayCases',
    label: 'TodayCases',
    minWidth: 100,
    align: 'center',
  },

  {
    id: 'infectedPercent',
    label: 'Infected Percent',
    minWidth: 60,
    align: 'center',
  },
];

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#E3AE57 ',
    color: '#232B2B',
    fontSize: 16,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#E5E5E5',
    },
  },
}))(TableRow);

const createData = (
  id,
  country,
  cases,
  testsPerOneMillion,
  todayCases,
  date
) => {
  const infectedPercent = Math.floor(
    ((todayCases * 7) / testsPerOneMillion) * 100
  );

  return {
    id,
    country,
    cases,
    testsPerOneMillion,
    todayCases,
    infectedPercent,
    date,
  };
};

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const modalStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 670,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const useStyles = makeStyles({
  root: {
    width: '100%',
    paddingTop: '2em',
  },
  container: {
    maxHeight: 440,
    borderRadius: '0.25em',
  },
});

const CovidTable = (props) => {
  const classes = useStyles();
  const modalClasses = modalStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const { covidData, setCovidData } = useContext(CovidContext);
  const userContext = useContext(UserContext);
  const loggedUser = userContext.user;
  const [countryToSend, setCoutryToSend] = useState('');
  const [isClicked, setIsclicked] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const showCreateForm = () => {
    setShowInput(!showInput);
  };

  const handleOnChange = (target) => setCoutryToSend(target.name);

  const createCountry = (country) => {
    fetch(`${BASE_URL}/api/country/addCountry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({ name: country }),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) {
          throw new Error(result.message);
        }
      })
      .catch((error) => error.message);
  };

  const loadCoviData = () => {
    fetch(`${BASE_URL}/api/covidData/getData`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((r) => JSON.parse(JSON.stringify(r)))
      .then((result) => {
        if (result.error) {
          throw new Error(result.message);
        }
        setIsclicked(!isClicked);
      })
      .catch((error) => error.message);
  };
  useEffect(() => {
    fetch(`${BASE_URL}/api/covidData/covidInfo`, {
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
        setCovidData(data);
      })
      .catch((error) => error.message);
  }, [isClicked]);

  const rows = covidData.map(
    ({
      id,
      country,
      cases,
      testsPerOneMillion,
      todayCases,
      infectedPercent,
      date,
    }) =>
      createData(
        id,
        country,
        cases,
        testsPerOneMillion,
        todayCases,
        infectedPercent,
        date
      )
  );

  const chartData = covidData.map(Object.values);
  const secondChartData = chartData.map((el) => [el[6], el[1]]);
  const finalChartData = [['Country', 'TotalCases']].concat(secondChartData);
  const filteredChartData = finalChartData.map((el) =>
    [...el].map((country) => {
      if (country === 'USA') {
        country = 'United States';
      } else if (country === 'Russia') {
        country = 'RU';
      }
      return country;
    })
  );

  const googleChart = (
    <div style={modalStyle} className={modalClasses.paper}>
      <Chart
        width={'600px'}
        height={'360px'}
        chartType='GeoChart'
        data={filteredChartData}
        mapsApiKey='AIzaSyC7-p6qXKCbnxa-JwtKqvel-FjlNaipNvI'
        rootProps={{ 'data-testid': '1' }}
        options={{
          colorAxis: { colors: ['#E3AE57', '#DC3D24'] },
        }}
      />
    </div>
  );

  return (
    <>
      <Paper className={classes.root}>
        {loggedUser.role === 'Admin' && (
          <>
            {' '}
            <IconButton onClick={showCreateForm} style={{ color: '#232B2B ' }}>
              <PostAddIcon />
            </IconButton>
            {showInput ? (
              <>
                <Autocomplete
                  id='combo-box'
                  options={countries}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option) => option.name}
                  style={{ width: 260, padding: '0.4em' }}
                  onChange={(e, v) => handleOnChange(v)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Add country'
                      variant='outlined'
                    />
                  )}
                />
                <Button
                  onClick={() => createCountry(countryToSend)}
                  variant='contained'
                  color='primary'
                  size='small'
                  className={classes.button}
                  endIcon={<Icon>send</Icon>}
                  style={{ margin: '5px', backgroundColor: '#DC3D24' }}
                >
                  Add
                </Button>
                <IconButton onClick={() => loadCoviData()}>
                  <RefreshIcon />
                </IconButton>
              </>
            ) : null}{' '}
          </>
        )}

        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      head: { backgroundColor: 'blue' },
                    }}
                  >
                    {column.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <StyledTableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={row.id}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <StyledTableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </StyledTableCell>
                        );
                      })}
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25]}
          component='div'
          count={covidData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      <Button
        variant='contained'
        color='primary'
        className={classes.button}
        style={{ margin: '2em', backgroundColor: '#DC3D24' }}
        onClick={handleOpen}
        endIcon={<Icon>room</Icon>}
      >
        World map
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {googleChart}
      </Modal>
    </>
  );
};

export default CovidTable;
