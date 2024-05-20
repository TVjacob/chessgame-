import React, { useState } from 'react'
import CustomGame from './CustomGame';
import TimeSelector from './TimeSelector';
import FullAcessReq from './FullAceessReq';
import ModalLayout from './ModalLayout';

const NewGame = ({open}) => {
  const [tab, setTab] = useState(0);
  const [idx, setIdx] = useState(7);
  const [mdlshow, setModal] = useState(false);

  if (!open) return null;
  return (
    <div className='new-game-tab-component'>
      {tab===0 &&
      <div className='new-game-tab-content'>
        <div className='new-game-main'>
          <div className='new-game-play'>
            <div className='new-game-margin'>
              <TimeSelector idx={idx} setIdx={setIdx} />
              <button className='form-button button-full'>
                Play
              </button>
            </div>
          </div>
          <div className='new-game-margin new-game-btns'>
            <button
              className='form-button options-btn'
              onClick={() => setTab(1)}
            >
              <span className='new-game-option game-setting' />
              <span className='new-game-option-label'>Custom Game</span>
            </button>

            <button
              className='form-button options-btn'
              onClick={() => setModal(true)}
            >
              <span className='new-game-option handshake' />
              <span className='new-game-option-label'>Play a Friend</span>
            </button>

            <button
              className='form-button options-btn'
              onClick={() => setModal(true)}
            >
              <span className='new-game-option medal' />
              <span className='new-game-option-label'>Tournaments</span>
            </button>
            <ModalLayout
              open={mdlshow}
              setOpen={setModal}
              content={<FullAcessReq />}
            />
          </div>
        </div>
        <div className='live-stats-component'>
          <span className='live-stats-icon'>
            <i className="fas fa-list-alt"></i>
          </span>
          <span className='live-stats-text'>
            <strong>133,561</strong>
            playing&nbsp;&nbsp;
            <strong>10,160,065</strong>
            games today
          </span>
        </div>
      </div>}
      <CustomGame
        open={tab===1}
        handleOpen={setTab}
        idx={idx}
        setIdx={setIdx}
      />
    </div>
  );
};

export default NewGame
