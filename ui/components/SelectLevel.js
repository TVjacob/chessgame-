import React, { useState } from 'react';
import { Piece, HorsePiece, Shelter, King } from '../assets/svgs';

const SelectLevel = ({ handleOpen }) => {
  const [checked, setChecked] = useState(0);
  return (
    <div className='authentication-intro-component'>
      <h2 className='authentication-intro-title'>
        Play Online Chess
      </h2>
      <h3 className='authentication-intro-subtitle'>
        What is your chess skill level?
      </h3>
      <div className='authentication-intro-levels'>
        <label
          htmlFor='new'
          className='authentication-intro-level'
          onClick={() => {
            setChecked(0);
            handleOpen(false);
          }}
        >
          <input id='new' type='radio' className='authentication-intro-input' value='1' name='registration[skillLevel]' />
          <div className='authentication-intro-label-icon'>
            <div className={`authentication-intro-icon ${checked === 0 && 'checked-icon'}`}>
              <span className={`authentication-intro-piece ${checked === 0 && 'checked'}`}>
                <Piece />
              </span>
            </div>
          </div>
          <div className='authentication-intro-label'>
            <span className="authentication-intro-name">New to Chess</span>
          </div>
        </label>
        <label
          htmlFor='beginner'
          className='authentication-intro-level'
          onClick={() => {
            setChecked(1);
            handleOpen(false);
          }}
        >
          <input id='beginner' type='radio' className='authentication-intro-input' value='2' name='registration[skillLevel]' />
          <div className='authentication-intro-label-icon'>
            <div className={`authentication-intro-icon ${checked === 1 && 'checked-icon'}`}>
              <span className={`authentication-intro-piece ${checked === 1 && 'checked'}`}>
                <HorsePiece />
              </span>
            </div>
          </div>
          <div className='authentication-intro-label'>
            <span className="authentication-intro-name">Beginner</span>
          </div>
        </label>
        <label
          htmlFor='intermidiate'
          className='authentication-intro-level'
          onClick={() => {
            setChecked(2);
            handleOpen(false);
          }}
        >
          <input id='intermidiate' type='radio' className='authentication-intro-input' value='3' name='registration[skillLevel]' />
          <div className='authentication-intro-label-icon'>
            <div className={`authentication-intro-icon ${checked === 2 && 'checked-icon'}`}>
              <span className={`authentication-intro-piece ${checked === 2 && 'checked'}`}>
                <Shelter />
              </span>
            </div>
          </div>
          <div className='authentication-intro-label'>
            <span className="authentication-intro-name">Intermediate</span>
          </div>
        </label>
        <label
          htmlFor='advanced'
          className='authentication-intro-level'
          onClick={() => {
            setChecked(3);
            handleOpen(false);
          }}
        >
          <input id='advanced' type='radio' className='authentication-intro-input' value='1' name='registration[skillLevel]' />
          <div className='authentication-intro-label-icon'>
            <div className={`authentication-intro-icon ${checked === 3 && 'checked-icon'}`}>
              <span className={`authentication-intro-piece ${checked === 3 && 'checked'}`}>
                <King />
              </span>
            </div>
          </div>
          <div className='authentication-intro-label'>
            <span className="authentication-intro-name">Advanced</span>
          </div>
        </label>
      </div>
      <button
        type='submit'
        className='submit-button authentication-intro-button'
      >
        Play as a Guest
      </button>
      <button type='button' className='submit-button authentication-intro-signup'>
        Sign Up
      </button>
      <a href='/login_and_go' className='authentication-intro-login'>Already have an account? Log In</a>
    </div>
  );
};

export default SelectLevel;
