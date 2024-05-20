import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 28,
    right: 0,
    zIndex: 1,
    textAlign: 'left',
    border: '1px solid',
    backgroundColor: theme.palette.background.paper,
    width: 100,
    color: 'black'
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    minHeight: 30,
    paddingLeft: 8,
    cursor: 'pointer',
    borderBottom: '1px solid #e8e7e6',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: '#f1f1f1'
    },
    '& span': {
      marginRight: 2
    }
  },
  btn: {
    background: 'transparent',
    border: 'none',
    color: 'white'
  }
}));

const types = [
  {title: 'All Types'},
  {icon: <i className="fas fa-angle-double-right" />, title: 'Bullet', cls: 'chess960'},
  {icon: <i className="fas fa-bolt" />, title: 'Blitz', cls: 'chess960'},
  {icon: <i className="fas fa-stopwatch" />, title: 'Rapid', cls: 'threecheck'},
  {icon: <i className="fas fa-archive" />, title: 'Variants', cls: 'kingofthehill'},
];

export default function TypeSelector() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('All Types');

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={classes.root}>
        <button type="button" onClick={handleClick} className={classes.btn}>
          {title}
        </button>
        {open ? (
          <div className={classes.dropdown}>
            {types.map((item) => (
              <div
                key={item.title}
                className={classes.dropdownItem}
                onClick={()=>{
                  setTitle(item.title);
                  setOpen(false);
                }}
              >
                <span className={item.cls}>
                  {item.icon}
                </span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </ClickAwayListener>
  );
}