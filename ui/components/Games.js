import React, { useState } from 'react';
import TypeSelector from './TypeSelector';
import { users } from '../assets/mock';

const Games = ({open}) => {
  const [tab, setValue] = useState(1);
  if (!open) return null;
  return (
    <div className='tab-container-component'>
      <div className='underlined-tabs-component'>
        <div
          className={`underlined-tabs-tab ${tab === 0 && 'tabs-active'}`}
          onClick={() => setValue(0)}
        >
          <div className='underlined-label'>
            Daily Games
          </div>
        </div>
        <div
          className={`underlined-tabs-tab ${tab === 1 && 'tabs-active'}`}
          onClick={() => setValue(1)}
        >
          <div className='underlined-label'>
            Archive
          </div>
        </div>
        <div
          className={`underlined-tabs-tab ${tab === 2 && 'tabs-active'}`}
          onClick={() => setValue(2)}
        >
          <div className='underlined-label'>
            Watch
          </div>
        </div>
      </div>
      {tab === 1 &&
      <div className='tab-content-component'>
        <div className='filter-input-component archive-tab-filter'>
          <div className='form-input-component'>
            <input
              name='filter-input'
              placeholder='Username...'
              type='text'
              className='form-input-input'
            />
          </div>
          <span className='filter-input-icon'>
            <i className="fas fa-search"></i>
          </span>
        </div>
        <div className='scrollable-pages-component'>
          <div className='archive-tab-row'>
            <div className='archive-tab-typerapid'>
              <i className="far fa-stopwatch"></i>
            </div>
            <div className='archive-tab-component user-tagline-component'>
              <div className='user-username'>fake user</div>
              <span className='user-tagline-rating'>(644)</span>
            </div>
            <div className='user-tagline-component archive-tab-player'>
              <div className='user-username'>siddh</div>
              <span className='user-tagline-rating'>(848)</span>
            </div>
            <div className='archive-tab-result'>0-1</div>
            <div className='archive-tab-time'>10 min</div>
          </div>
        </div>
      </div>}
      {tab===2 &&
      <div className='tab-content-component'>
        <div className='filter-input-component'>
          <div className='form-input-input'>
            <input
              name='filter-input'
              placeholder='Username...'
              type='text'
              className='form-input-input'
            />
          </div>
          <span className='filter-input-icon'>
            <i className="fas fa-search"></i>
          </span>
          <div className='dropdown-menu-component'>
            <div className='dropdown-toggle'>
              {/* <span>All Types</span> */}
              <TypeSelector title='All Types' />
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
                  <span className='user-chess-title-component'>FM</span>
                  <span className='user-tagline-username user-username'>{item.player1}</span>
                  <span className='user-tagline-rating'>({item.rating1})</span>
                  <div className='country-flags-component country-ru'/>
                </div>
                <div className='user-tagline-component events-list-tagline'>
                  <span className='user-chess-title-component'>FM</span>
                  <span className='user-tagline-username user-username'>{item.player2}</span>
                  <span className='user-tagline-rating'>({item.rating2})</span>
                  <div className='country-flags-component country-ru'/>
                </div>
              </div>
              <div className='events-list-type blitz'>
               <i className="fas fa-bolt" />
              </div>
              <div className='events-list-time'>{item.time} min</div>
            </div>))}
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default Games
