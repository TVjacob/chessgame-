import React, { useState } from 'react'
import TimeSelector from './TimeSelector';

const levels = [
  {title: 'Standard', icon: <i className="fas fa-chess-board" />, cls: 'standard'},
  {title: 'Chess960', icon: <i className="fas fa-chess-king" />, cls: 'chess960'},
  {title: '3 Check', icon: <i className="fas fa-th-list" />, cls: 'threecheck'},
  {title: 'King of the Hill', icon: <i className="fas fa-archive" />, cls: 'kingofthehill'}
];

const CustomGame = ({open, handleOpen, idx, setIdx}) => {
  const [tab, setValue] = useState(0);
  const [options, setOptions] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!open) return null;

  return (
    <div className='tab-container-component'>
      <div className='underlined-tabs-component'>
        <div
          className={`underlined-tabs-tab ${tab === 0 && 'tabs-active'}`}
          onClick={() => setValue(0)}
        >
          <div
            className='underlined-tabs-back'
            onClick={() => handleOpen(0)}
          >
            <i className="fas fa-arrow-left" />
          </div>
          <div className='underlined-label'>
            Custom Game
          </div>
        </div>
        <div
          className={`underlined-tabs-tab ${tab === 1 && 'tabs-active'}`}
          onClick={() => setValue(1)}
        >
          <div className='underlined-label'>
            Open Challenges
          </div>
        </div>
      </div>
      <div className='custom-game-content'>
        <div className='custom-game-options-component'>
          <div className='new-game-margin-component'>
            <div className='custom-game-options-row'>
              <div className='game-type-selector-component'>
                <button
                  className='form-button game-type-selector-button'
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className={`game-type-selector-icon ${levels[options].cls}`}>
                    {levels[options].icon}
                  </span>
                  <span>{levels[options].title}</span>
                  <span className='icon-selector'>
                    <i className="fas fa-angle-down" />
                  </span>
                </button>
                {isOpen &&
                <ul className='game-type-selector-options'>
                  {levels.map((item, idx) => (
                    <li
                      key={item.title}
                      className={options === idx ? 'game-type-selector-selected' : undefined}
                      onClick={() => {
                        setOptions(idx);
                        setIsOpen(false);
                      }}
                    >
                      <span className={`game-type-selector-icon ${item.cls}`}>
                        {item.icon}
                      </span>
                      {item.title}
                      <span className='game-type-selector-icon question-icon'>
                        <i className="fas fa-question-circle" />
                      </span>
                    </li>
                  ))}
                </ul>}
              </div>
            </div>
            <div className='custom-game-options-row'>
              <TimeSelector idx={idx} setIdx={setIdx} />
            </div>
          </div>
          <div className='new-game-footer-component custom-game-options-footer'></div>
        </div>
      </div>
    </div>
  )
}

export default CustomGame;
