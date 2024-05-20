import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Backdrop, Fade, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    boxShadow: '0 0.3rem 0.7rem 0 rgb(0 0 0 / 40%)',
    maxWidth: 'calc(100% - 10px)',
    position: 'relative',
    width: 467,
    position: 'relative'
  },
  closeBtn: {
    fontSize: 32,
    padding: '0 10px',
    position: 'absolute',
    backgroundColor: 'transparent',
    cursor: 'pointer'
  },
  '@media (min-width: 640px)': {
    paper: {
      padding: '35px 25px 25px',
      margin: '10px 20px',
    },
    closeBtn: {
      right: -40,
      top: -10,
      color: 'hsla(0,0%,100%,.65)'
    }
  }
}));

export default function ModalLayout({open, setOpen, content}) {
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className={classes.paper}>
          <Box className={classes.closeBtn} onClick={handleClose}>
            &times;
          </Box>
          {content}
        </Box>
      </Fade>
    </Modal>
  );
}