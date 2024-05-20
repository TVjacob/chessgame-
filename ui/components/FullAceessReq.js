import React, { useState } from 'react';
import Swiper from './Swiper';

const trialAssets = [
  {title: 'Play, Learn and Connect', sub: 'Join millions of chess players.', cls: 'sprite-play'},
  {title: '150k+ Puzzles', sub: 'Play every day to improve', cls: 'sprite-puzzle'},
  {title: '1500+ Lessons', sub: 'Learn from chess masters!', cls: 'sprite-lessons'},
  {title: 'Full Game Analysis', sub: 'Learn from every game!', cls: 'sprite-analysis'},
];

const FullAcessReq = () => {
  const [checked, setChecked] = useState(null);
  return (
    <div className='authentication-intro-component'>
      <h2 className='authentication-intro-title'>
        Sign up for full access!
      </h2>
      <div className='modal-trial-body'>
        <div className='trial-slideshow-component'>
          <Swiper data={trialAssets} />
        </div>
      </div>
      <button type='button' className='submit-button authentication-intro-signup'>
        Sign Up
      </button>
      <a href='/login_and_go' className='authentication-intro-login'>Already have an account? Log In</a>
    </div>
  );
};

export default FullAcessReq;
