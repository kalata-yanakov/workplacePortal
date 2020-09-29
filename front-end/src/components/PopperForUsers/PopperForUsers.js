import React from 'react';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import { BASE_URL } from '../Common/constants';

const Popper = ({
  currentDesk,
  desks,
  setDesks,
  deskid,
  users,
  workplace,
  setWorkplaceToView,
  resetPage,
  setReset,
}) => {
  const assignUser = (deskid, userId) => {
    fetch(`${BASE_URL}/api/admin/desk/${deskid}/user/${userId}`, {
      method: 'PUT',
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

        const newDesks = workplace.desks.desks
          .map((e) => {
            if (e.id === result.id) {
              e.user = { id: result.user.id, username: result.user.username };
            }

            setReset(!resetPage);
          })
          .catch((error) => error.message);
      });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button
        aria-describedby={id}
        variant='contained'
        color='primary'
        style={{ maxHeight: '30px' }}
        onClick={handleClick}
      >
        {currentDesk.user !== null && currentDesk.user !== undefined
          ? 'change user'
          : 'set user'}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {users.length > 0
          ? users.map((e) => {
              return (
                <button
                  key={e.id}
                  onClick={() =>
                    /*assignUser(e.id)*/ assignUser(currentDesk.id, e.id)
                  }
                >
                  {e.username}
                </button>
              );
            })
          : null}
      </Popover>
    </div>
  );
};

export default Popper;
