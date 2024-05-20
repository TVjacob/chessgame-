import React, { useState } from 'react';
import Chess from 'react-chess';
import ModalLayout from '../components/ModalLayout';
import SelectLevel from '../components/SelectLevel';
import avatar from '../assets/images/avatar.png';
import guest from '../assets/images/guest.gif';
import NewGame from '../components/NewGame';
import Game from '../components/Games';
import Player from '../components/Player';

const Play = () => {
  const [tab, setTab] = useState(0);
  const [mdlshow, setModal] = useState(true);

  const handleTab = (e) => {
    setTab(e);
  };
  

  return (
    <div className='board-container'>
      <div id='board-layout-main' className='board-layout-main'>
        <div className='board-layout-player'>
          <div className='player-avatar'>
            <img src={avatar} alt='avatar' className='avatar' />
          </div>
          <div className='player-tagline'>
            <div className='user-tagline'>
              <div className='username'>Opponent</div>
            </div>
          </div>
          <div className='clock-component'>
            <div className='clock-icon'></div>
            <span>10:00</span>
          </div>
        </div>
        <div className='board-layout-chessboard'>
          <Chess lightSquareColor='#EEEED2' darkSquareColor='#769656' />
        </div>
        <div className='board-layout-player'>
          <div className='player-avatar'>
            <img src={guest} alt='guest' className='avatar' />
          </div>
          <div className='player-tagline'>
            <div className='user-tagline'>
              <div className='username'>Guest12415</div>
            </div>
          </div>
          <div className='clock-component dark-component'>
            <div className='clock-icon'></div>
            <span>10:00</span>
          </div>
        </div>
      </div>
      <div className='board-layout-controls'>
        <div className='icon-item'>
          <i className="fas fa-cog" />
        </div>
        <div className='icon-item'>
          <i className="fas fa-expand-arrows-alt" />
        </div>
        <div className='icon-item'>
          <i className="far fa-square" />
        </div>
        <div className='icon-item'>
          <i className="fas fa-retweet" />
        </div>
      </div>
      <div className='board-layout-sidebar'>
        <div className='sidebar-component'>
          <div className='tabs-component'>
            <div
              className={`tabs ${tab === 0 && 'tabs-active'}`}
              onClick={() => handleTab(0)}
            >
              <span className='tabs-icon'>
              <i className="fas fa-plus-square"></i>
              </span>
              <span className='tabs-label'>New Game</span>
            </div>
            <div
              className={`tabs ${tab === 1 && 'tabs-active'}`}
              onClick={() => handleTab(1)}
            >
              <span className='tabs-icon'>
                <i className="fas fa-chess-board"></i>
              </span>
              <span className='tabs-label'>Games</span>
            </div>
            <ModalLayout
              open={mdlshow}
              setOpen={setModal}
              content={
                <SelectLevel handleOpen={setModal} />
              }
            />
            <div
              className={`tabs ${tab === 2 && 'tabs-active'}`}
              onClick={() => handleTab(2)}
            >
              <span className='tabs-icon'>
              <i className="fas fa-users"></i>
              </span>
              <span className='tabs-label'>Players</span>
            </div>
          </div>
          <NewGame open={tab === 0} />
          <Game open={tab === 1} />
          <Player open={tab == 2} />
        </div>
      </div>
    </div>
  );
};

export default Play;
