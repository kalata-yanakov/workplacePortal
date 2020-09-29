import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Popper from '../PopperForUsers/PopperForUsers';

const SingleDesk = ({
  desks,
  deskid,
  setDesks,
  workplaceId,
  users,
  workplace,
  setWorkplaceToView,
  resetPage,
  setReset,
}) => {
  const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }));

  const classes = useStyles();

  let currentDesk = desks.find((e) => e.id === deskid);

  return (
    <>
      <Paper
        className={classes.paper}
        style={
          currentDesk.user !== null
            ? { backgroundColor: '#A52A2A', maxHeight: '50px' }
            : { backgroundColor: '#228B22', maxHeight: '50px' }
        }
      >
        {currentDesk.user !== null ? currentDesk.user.username : 'free'}

        <div>
          <Popper
            key={currentDesk.id}
            currentDesk={currentDesk}
            users={users}
            setDesks={setDesks}
            workplace={workplace}
            setWorkplaceToView={setWorkplaceToView}
            setReset={setReset}
            resetPage={resetPage}
          />
        </div>
      </Paper>
    </>
  );
};

export default SingleDesk;
