import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withRouter } from 'react-router-dom';
import UserContext from '../Providers/UserContext';
import ListIcon from '@material-ui/icons/List';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  title: {
    flexGrow: 1,
  },
}));

const MenuAppBar = (props) => {
  const history = props.history;
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { user, setUser } = useContext(UserContext);
  const [hitButton, setHitButton] = useState(null);

  const handleClicked = (event) => {
    setHitButton(event.currentTarget);
  };

  const handleClosed = () => {
    setHitButton(null);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');

    history.push('/');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position='static'
        style={{ background: '#232B2B', width: '100vw' }}
      >
        <Toolbar>
          <IconButton
            aria-label='more'
            aria-controls='long-menu'
            aria-haspopup='true'
            onClick={handleClicked}
          >
            <ListIcon style={{ color: '#DC3D24 ' }} />
          </IconButton>
          <Menu
            id='simple-menu'
            anchorEl={hitButton}
            keepMounted
            open={Boolean(hitButton)}
            onClose={handleClosed}
          >
            <MenuItem onClick={() => history.push('/home')}>Home</MenuItem>
            <MenuItem onClick={() => history.push('/login')}>Login</MenuItem>
            <MenuItem onClick={() => history.push('/workplace')}>
              Workplace
            </MenuItem>
            <MenuItem onClick={() => history.push('/userInfo')}>
              User Info
            </MenuItem>
            <MenuItem onClick={() => history.push('/covidData')}>
              Covid Info
            </MenuItem>

            {user !== null && user.role === 'Admin' ? (
              <MenuItem onClick={() => history.push('/admin')}>Admin</MenuItem>
            ) : null}
            <MenuItem onClick={() => history.push('/register')}>
              Register
            </MenuItem>
          </Menu>

          <Typography
            variant='h6'
            className={classes.title}
            style={{ color: '#FFFFFF ' }}
          >
            Workplace Portal
          </Typography>

          {user && (
            <div>
              <IconButton
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenu}
                color='inherit'
              >
                <AccountCircle style={{ color: '#FFFFFF ' }} />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={(handleClose, () => history.push('/profile'))}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={(handleClose, logout)}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(MenuAppBar);
