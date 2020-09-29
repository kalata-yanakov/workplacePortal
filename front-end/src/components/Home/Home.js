import React, { useState } from 'react';
import { Button, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

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
    width: 460,
    height: 435,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

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
}));

const Home = (props) => {
  const classes = useStyles();
  const modalClasses = modalStyles();
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const qrCode = (
    <div style={modalStyle} className={modalClasses.paper}>
      <img
        src={require('../Common/img/QR_code_5FR5JBY.png')}
        alt='qrcode'
        width='400px'
        height='400px'
      />
    </div>
  );

  return (
    <div>
      <img
        src={require('../Common/img/homepage.png')}
        alt='homepage'
        width='1280px'
        height='768'
      />
      <Button
        variant='contained'
        color='primary'
        className={classes.button}
        style={{ margin: '0.3em', padding: '1em', backgroundColor: '#DC3D24' }}
        onClick={handleOpen}
      >
        Take survey
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {qrCode}
      </Modal>
    </div>
  );
};

export default withRouter(Home);
