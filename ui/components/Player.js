import React, { useState } from 'react';
import { users } from '../assets/mock';
import user1 from '../assets/images/user1.jpeg';
import TypeSelector from './TypeSelector';

const Player = ({open}) => {
  const [tab, setValue] = useState(0);
  if (!open) return null;
  return (
    <div className='tab-container-component'>
      <div className='underlined-tabs-component'>
        <div
          className={`underlined-tabs-tab ${tab === 0 && 'tabs-active'}`}
          onClick={() => setValue(0)}
        >
          <div className='underlined-label'>
            Friends
          </div>
        </div>
        <div
          className={`underlined-tabs-tab ${tab === 1 && 'tabs-active'}`}
          onClick={() => setValue(1)}
        >
          <div className='underlined-label'>
            Top Players
          </div>
        </div>
      </div>
      {tab===0 &&
      <div className='tab-content-component'>
        <div className='filter-input-component'>
          <div className='form-input-input'>
            <input
              name='filter-input'
              placeholder='Username...'
              type='text'
              className='form-input-input player-form'
            />
          </div>
          <span className='filter-input-icon'>
            <i className="fas fa-search"></i>
          </span>
          <div className='dropdown-menu-component'>
            <div className='dropdown-toggle'>
              <TypeSelector />
              <span className='dropdown-icon'>
                <i className="fas fa-caret-down"></i>
              </span>
            </div>
          </div>
        </div>
      </div>}
      {tab===1 &&
      <div className='tab-content-component'>
        <div className='filter-input-component'>
          <div className='form-input-input'>
            <input
              name='filter-input'
              placeholder='Username...'
              type='text'
              className='form-input-input player-form'
            />
          </div>
          <span className='filter-input-icon'>
            <i className="fas fa-search"></i>
          </span>
          <div className='dropdown-menu-component'>
            <div className='dropdown-toggle'>
              <TypeSelector />
              <span className='dropdown-icon'>
                <i className="fas fa-caret-down"></i>
              </span>
            </div>
          </div>
        </div>
        <div className='scrollable-pages-component watch-tab-list'>
          <div className='events-list-component'>
            {users.map((item, index) => (
            <div 
              key={index}
              className='events-list-component events-list-row'>
              <div className='events-list-players'>
                <div className='user-tagline-component events-list-tagline'>
                  <img src={user1} alt='user1' className='user-avatar' />
                  <span className='user-chess-title-component'>FM</span>
                  <span className='user-tagline-username user-username'>{item.player1}</span>
                  <span className='user-tagline-rating'>({item.rating1})</span>
                  <div className='country-flags-component country-ru'/>
                </div>
              </div>
              <div className='events-list-time'>Playing</div>
            </div>))}
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default Player;
