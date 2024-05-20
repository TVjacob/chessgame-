import React, { useState } from 'react'

const SelectIcon = (e) => {
  if ([0,1,2].includes(e)) return <i className="fas fa-angle-double-right" />
  if ([3,4,5,6].includes(e)) return <i className="fas fa-bolt" />
  if (e === 7) return <i className="fas fa-stopwatch" />
};

const getPositiveIndex = (e) => {
  let res = -1;
  for (let i = 0; i < e.length; i++) {
    if (e[i]) res = i; 
  }
  return res;
};

const timesOpt = ['1 min', '1 | 1', '2 | 1', '3 min', '3 | 2', '5 min', '5 | 5', '10 min'];

const TimeSelector = ({idx, setIdx}) => {
  const [show, setShow] = useState(false);
  const initialBtns = new Array(7).fill(false);
  initialBtns[idx] = true;
  const [btns, setBtns] = useState(initialBtns);

  const handleBtns = (e) => {
    let temp = [];
    temp[e] = true;
    setIdx(e);
    setBtns(temp);
    setShow(false);
  }

  return (
    <div className='new-game-selector'>
      <button
        className='form-button time-selector'
        onClick={() => setShow(!show)}
      >
        <span className='icon-time'>
          {SelectIcon(getPositiveIndex(btns))}
        </span>
        {timesOpt[getPositiveIndex(btns)]}
        <span className='icon-selector'>
          <i className="fas fa-angle-down"></i>
        </span>
      </button>
      <div className={`time-selector-open ${show && 'time-show'}`}>
        <div className='time-selector-category'>
          <span className='bullet time-selector-category-icon'>
            <i className="fas fa-angle-double-right"></i>
          </span>
          <div className='time-selector-category-component'>
            {timesOpt.slice(0,3).map((item, index) => (
              <button
                key={item}
                className={`form-button timelines ${btns[index] && 'time-select-active'}`}
                onClick={() => handleBtns(index)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className='time-selector-category'>
          <span className='bullet time-selector-category-icon'>
            <i className="fas fa-bolt"></i>
          </span>
          <div className='time-selector-category-component'>
            {timesOpt.slice(3,7).map((item, index) => (
              <button
                key={item}
                className={`form-button timelines ${btns[index+3] && 'time-select-active'}`}
                onClick={() => handleBtns(index+3)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className='time-selector-category'>
          <span className='clock time-selector-category-icon'>
            <i className="fas fa-stopwatch"></i>
          </span>
          <div className='time-selector-category-component'>
            <button
              className={`form-button timelines ${btns[7] && 'time-select-active'}`}
              onClick={() => handleBtns(7)}
            >
              10 min
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSelector
