import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Modal from "react-modal";
import { Tooltip } from "react-tippy";
import qs from "query-string";
import GameBoard from "./GameBoard.js";
import SpeedIcon from "./SpeedIcon.js";
import UserDisplay from "./UserDisplay.js";
import CampaignLevels, { BELTS } from "../util/CampaignLevels.js";
import GameState from "../util/GameState.js";

const Game = ({
  match,
  location,
  history,
  playerKey,
  fetchUserInfo,
  checkGame,
  knownUsers,
  playerKeys,
  startCampaignLevel,
  inviteUser,
  user,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [musicVolume, setMusicVolume] = useState(20);
  const [soundVolume, setSoundVolume] = useState(20);
  const [gameState, setGameState] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showReady, setShowReady] = useState(true);
  const [inviteUsername, setInviteUsername] = useState("");
  const [game, setGame] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [oldRating, setOldRating] = useState(null);
  const [newRating, setNewRating] = useState(null);
  const [newBelt, setNewBelt] = useState(null);

  let music = null;
  let captureSounds = [];
  let finishSound = null;
  let beltSound = null;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    initGameState();
  }, [match.params.gameId]);

  const handleKeyPress = (e) => {
    if (e.keyCode === 32 && gameState) {
      if (gameState.game && gameState.game.finished) {
        gameState.reset();
      } else {
        gameState.ready();
      }
      e.preventDefault();
    }
  };

  const initGameState = () => {
    if (gameState) {
      gameState.unregisterListener(updateGameState);
      gameState.destroy();
    }

    const gameId = match.params.gameId;
    const { key } = qs.parse(location.search);
    const currentPlayerKey = playerKey || key;

    const newGameState = new GameState(
      gameId,
      currentPlayerKey,
      fetchUserInfo,
      () => {
        history.push("/");
      },
      handleRatingChange,
      handleBeltAchievement
    );

    setGameState(newGameState);

    setModalType(null);
    setShowReady(true);
    setInviteUsername("");
    setGame(null);
    setPlayer(null);
    setIsReady(false);
    setOldRating(null);
    setNewRating(null);
    setNewBelt(null);

    newGameState.registerListener(updateGameState);

    if (user) {
      checkGame(gameId);
    }
  };

  const updateGameState = (gameState, updates) => {
    const { playerKeys } = playerKeys;

    let newModalType = modalType;
    let newShowReady = showReady;

    if (gameState.game) {
      if (newModalType === null && gameState.game.finished) {
        if (finishSound) {
          finishSound.volume = soundVolume / 100;
          finishSound.currentTime = 0;
          finishSound.play();
        }
        newModalType = "game-finished";
      } else if (newModalType === "game-finished" && !gameState.game.finished) {
        newModalType = null;
      } else if (newModalType === "ready" && gameState.game.started) {
        newModalType = null;
      }

      if (!gameState.game.started && gameState.player !== 0) {
        newModalType = "ready";
        newShowReady =
          playerKeys === null ||
          !("2" in playerKeys) ||
          gameState.level !== null ||
          !Object.values(gameState.game.players).includes("o") ||
          gameState.game.playersReady["1"] ||
          gameState.game.playersReady["2"];
      }
    }

    const hasCapture = updates && updates.some((u) => u.type === "capture");
    if (hasCapture && captureSounds.length > 0) {
      const soundIndex = Math.floor(Math.random() * captureSounds.length);
      const randomSound = captureSounds[soundIndex];
      randomSound.volume = soundVolume / 100;
      randomSound.currentTime = 0;
      randomSound.play();
    }

    setModalType(newModalType);
    setShowReady(newShowReady);
    setGame(gameState.game);
    setPlayer(gameState.player);
    setIsReady(gameState.isReady());
  };

  const closeModal = () => {
    setModalType(null);
  };

  const inviteUserData = () => {
    inviteUser(gameState.gameId, inviteUsername, () => {
      setShowReady(true);
    });
  };

  const handleRatingChange = (oldRating, newRating) => {
    setOldRating(oldRating);
    setNewRating(newRating);
  };

  const handleBeltAchievement = (newBelt) => {
    if (newBelt && beltSound) {
      window.setTimeout(() => {
        if (finishSound) {
          finishSound.pause();
        }

        beltSound.volume = soundVolume / 100;
        beltSound.currentTime = 0;
        beltSound.play();
      }, 2000);
    }

    setNewBelt(newBelt);
  };

  const changeDifficulty = (difficulty) => {
    gameState.changeDifficulty(2, difficulty);
  };

  const renderAudio = () => {
    return (
      <div>
        <audio ref={(musicRef) => (music = musicRef)} loop>
          <source src="/static/kfchess-music.mp3" type="audio/mp3" />
        </audio>
        {captureSounds.map((_, index) => (
          <audio key={index} ref={(sound) => (captureSounds[index] = sound)}>
            <source
              src={`/static/kfchess-sound${index + 1}.mp3`}
              type="audio/mp3"
            />
          </audio>
        ))}
        <audio ref={(sound) => (finishSound = sound)}>
          <source src="/static/kfchess-gong.mp3" type="audio/mp3" />
        </audio>
        <audio ref={(sound) => (beltSound = sound)}>
          <source src="/static/belt-upgrade.mp3" type="audio/mp3" />
        </audio>
      </div>
    );
  };

  const renderGameModal = () => {
    if (modalType === "ready") {
      return (
        <Modal
          isOpen={modalType === "ready"}
          onRequestClose={closeModal}
          contentLabel="Ready Modal"
        >
          <div className="modal-content">
            <h2>Ready to play?</h2>
            <div className="ready-form">
              <button onClick={gameState.ready}>Ready</button>
            </div>
          </div>
        </Modal>
      );
    } else if (modalType === "game-finished") {
      return (
        <Modal
          isOpen={modalType === "game-finished"}
          onRequestClose={closeModal}
          contentLabel="Game Finished Modal"
        >
          <div className="modal-content">
            <h2>Game Over</h2>
            <p>
              {playerKeys ? (
                newBelt ? (
                  <>
                    Congratulations! You've achieved the rank of{" "}
                    <b>{BELTS[newBelt]}</b>!
                  </>
                ) : (
                  <>
                    Your rating has changed from <b>{oldRating}</b> to{" "}
                    <b>{newRating}</b>.
                  </>
                )
              ) : (
                "Thank you for playing!"
              )}
            </p>
            <div className="modal-actions">
              <button onClick={gameState.reset}>Play Again</button>
            </div>
          </div>
        </Modal>
      );
    }
    return null;
  };

  return (
    <div className="game">
      <div className="game-content">
        {game ? (
          <>
            <UserDisplay
              user={knownUsers[playerKeys[1]]}
              game={game}
              player={1}
              isReady={game.playersReady && game.playersReady["1"]}
              showReady={showReady}
              onInvite={inviteUserData}
              playerKey={playerKey}
            />
            <GameBoard
              gameState={gameState}
              game={game}
              player={1}
              width={windowWidth}
              height={windowHeight}
              soundVolume={soundVolume}
            />
            <UserDisplay
              user={knownUsers[playerKeys[2]]}
              game={game}
              player={2}
              isReady={game.playersReady && game.playersReady["2"]}
              showReady={showReady}
              onInvite={inviteUserData}
              playerKey={playerKey}
            />
          </>
        ) : (
          <div className="loading">Loading...</div>
        )}
      </div>
      <div className="game-sidebar">
        <div className="volume-control">
          <label>Music Volume:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={(e) => {
              setMusicVolume(parseInt(e.target.value));
              if (music) {
                music.volume = parseInt(e.target.value) / 100;
              }
            }}
          />
          <label>Sound Volume:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={soundVolume}
            onChange={(e) => {
              setSoundVolume(parseInt(e.target.value));
            }}
          />
        </div>
        <SpeedIcon
          width={40}
          height={40}
          speed={gameState && gameState.speed ? gameState.speed : 1}
          onClick={() => {
            gameState.changeSpeed();
          }}
        />
        {game && game.level !== null && (
          <div className="difficulty">
            <label>Difficulty:</label>
            <div className="difficulty-buttons">
              <button
                className={game.level === 0 ? "active" : ""}
                onClick={() => {
                  changeDifficulty(0);
                }}
              >
                Easy
              </button>
              <button
                className={game.level === 1 ? "active" : ""}
                onClick={() => {
                  changeDifficulty(1);
                }}
              >
                Medium
              </button>
              <button
                className={game.level === 2 ? "active" : ""}
                onClick={() => {
                  changeDifficulty(2);
                }}
              >
                Hard
              </button>
            </div>
          </div>
        )}
      </div>
      {renderGameModal()}
      {renderAudio()}
    </div>
  );
};

export default Game;

// // import amplitude from "amplitude-js";
// import qs from "query-string";
// import React, { Component } from "react";
// import { CopyToClipboard } from "react-copy-to-clipboard";
// import Modal from "react-modal";
// import { withRouter } from "react-router";
// import { Link } from "react-router-dom";
// import { Tooltip } from "react-tippy";

// import GameBoard from "./GameBoard.js";
// import SpeedIcon from "./SpeedIcon.js";
// import UserDisplay from "./UserDisplay.js";
// import CampaignLevels, { BELTS } from "../util/CampaignLevels.js";
// import GameState from "../util/GameState.js";

// class Game extends Component {
//   constructor(props) {
//     super(props);

//     let musicVolume = 20,
//       soundVolume = 20;
//     if (window.localStorage) {
//       if (window.localStorage.musicVolume !== undefined) {
//         musicVolume = window.localStorage.musicVolume;
//       }
//       if (window.localStorage.soundVolume !== undefined) {
//         soundVolume = window.localStorage.soundVolume;
//       }
//     } else {
//       // no local storage, default to 0 volume to not be annoying
//       musicVolume = soundVolume = 0;
//     }

//     this.state = {
//       windowWidth: window.innerWidth,
//       windowHeight: window.innerHeight,

//       musicVolume,
//       soundVolume,
//     };

//     this.resize = this.resize.bind(this);
//     this.keyPress = this.keyPress.bind(this);
//     this.update = this.update.bind(this);
//     this.closeModal = this.closeModal.bind(this);

//     this.music = null;
//     this.captureSounds = [];
//     this.finishSound = null;
//     this.beltSound = null;
//   }

//   componentWillMount() {
//     // listen for resizes
//     window.addEventListener("resize", this.resize);
//     window.addEventListener("keydown", this.keyPress);
//   }

//   componentDidMount() {
//     const { props } = this;

//     this.initGameState(props);
//   }

//   componentWillUnmount() {
//     window.removeEventListener("resize", this.resize);
//     window.removeEventListener("keydown", this.keyPress);

//     const { gameState } = this.state;

//     if (gameState) {
//       gameState.unregisterListener(this.update);
//       gameState.destroy();
//     }
//   }

//   resize() {
//     this.setState({
//       windowWidth: window.innerWidth,
//       windowHeight: window.innerHeight,
//     });
//   }

//   keyPress(e) {
//     const { gameState } = this.state;

//     if (e.keyCode === 32 && gameState) {
//       // space signals ready, game start, or reset
//       if (gameState.game && gameState.game.finished) {
//         gameState.reset();
//       } else {
//         gameState.ready();
//       }
//       e.preventDefault();
//     }
//   }

//   componentWillReceiveProps(nextProps) {
//     const gameId = this.props.match.params.gameId;
//     const nextGameId = nextProps.match.params.gameId;
//     if (gameId === nextGameId) {
//       return;
//     }

//     this.initGameState(nextProps);
//   }

//   initGameState(props) {
//     if (this.state.gameState) {
//       this.state.gameState.unregisterListener(this.update);
//       this.state.gameState.destroy();
//     }

//     const gameId = props.match.params.gameId;
//     const { key } = qs.parse(props.location.search);
//     const playerKey = props.playerKey || key;

//     const gameState = new GameState(
//       gameId,
//       playerKey,
//       props.fetchUserInfo,
//       () => {
//         this.props.history.push("/");
//       },
//       (oldRating, newRating) => {
//         this.setState({ oldRating, newRating });
//       },
//       (newBelt) => {
//         if (newBelt && this.beltSound) {
//           window.setTimeout(() => {
//             if (this.finishSound) {
//               this.finishSound.pause();
//             }

//             const { soundVolume } = this.state;
//             this.beltSound.volume = soundVolume / 100;
//             this.beltSound.currentTime = 0;
//             this.beltSound.play();
//           }, 2000);
//         }

//         this.setState({ newBelt });
//       }
//     );

//     this.setState(
//       {
//         gameState,

//         modalType: null,
//         showReady: true,
//         inviteUsername: "",

//         game: null,
//         player: null,
//         isReady: false,

//         oldRating: null,
//         newRating: null,
//         newBelt: null,
//       },
//       () => {
//         // listen for updates
//         gameState.registerListener(this.update);

//         // check game
//         const { user } = this.props;

//         if (user) {
//           this.props.checkGame(gameState.gameId);
//         }
//       }
//     );
//   }

//   update(gameState, updates) {
//     const { soundVolume } = this.state;
//     const { playerKeys } = this.props;

//     let modalType = this.state.modalType;
//     let showReady = this.state.showReady;
//     if (gameState.game) {
//       // various modal triggers
//       if (modalType === null && gameState.game.finished) {
//         // amplitude.getInstance().logEvent('Finish Game', {
//         //     gameId: gameState.gameId,
//         //     player: gameState.player,
//         //     won: (gameState.game.finished === gameState.player),
//         //     level: gameState.level,
//         // });

//         if (this.finishSound) {
//           this.finishSound.volume = soundVolume / 100;
//           this.finishSound.currentTime = 0;
//           this.finishSound.play();
//         }

//         modalType = "game-finished";
//       } else if (modalType === "game-finished" && !gameState.game.finished) {
//         modalType = null;
//       } else if (modalType === "ready" && gameState.game.started) {
//         // amplitude.getInstance().logEvent('Start Game', {
//         //     gameId: gameState.gameId,
//         //     player: gameState.player,
//         //     level: gameState.level,
//         // });

//         modalType = null;
//       }

//       if (!gameState.game.started && gameState.player !== 0) {
//         modalType = "ready";
//         showReady =
//           playerKeys === null ||
//           !("2" in playerKeys) ||
//           gameState.level !== null ||
//           !Object.values(gameState.game.players).includes("o") ||
//           gameState.game.playersReady["1"] ||
//           gameState.game.playersReady["2"];
//       }
//     }

//     const hasCapture = updates && updates.some((u) => u.type === "capture");
//     if (hasCapture && this.captureSounds.length > 0) {
//       const soundIndex = Math.floor(Math.random() * this.captureSounds.length);
//       const randomSound = this.captureSounds[soundIndex];
//       randomSound.volume = soundVolume / 100;
//       randomSound.currentTime = 0;
//       randomSound.play();
//     }

//     this.setState({
//       modalType,
//       showReady,
//       game: gameState.game,
//       player: gameState.player,
//       isReady: gameState.isReady(),
//     });
//   }

//   closeModal() {
//     this.setState({
//       modalType: null,
//     });
//   }

//   inviteUser() {
//     const { gameState, inviteUsername } = this.state;

//     this.props.inviteUser(gameState.gameId, inviteUsername, () => {
//       this.setState({ showReady: true });
//     });
//   }

//   changeDifficulty(difficulty) {
//     const { gameState } = this.state;

//     // amplitude.getInstance().logEvent('Change AI Difficulty', {
//     //     gameId: gameState.gameId,
//     //     difficulty,
//     // });
//     gameState.changeDifficulty(2, difficulty);
//   }

//   render() {
//     const {
//       gameState,
//       modalType,
//       showReady,
//       inviteUsername,
//       game,
//       player,
//       isReady,
//       windowWidth,
//       windowHeight,
//       musicVolume,
//       soundVolume,
//     } = this.state;

//     const { knownUsers, playerKeys } = this.props;

//     const baseUrl = `${window.location.origin}${window.location.pathname}`;

//     let started = false;
//     if (game) {
//       started = game.started;
//     }

//     let friendLink = null;
//     if (playerKeys && "2" in playerKeys) {
//       friendLink = `${baseUrl}?key=${playerKeys["2"]}`;
//     }

//     let invited = false;
//     if (
//       player === 1 &&
//       game.players["2"] &&
//       game.players["2"].startsWith("u:")
//     ) {
//       invited = true;
//     }

//     let difficulty = null;
//     if (
//       player === 1 &&
//       game.players["2"] &&
//       game.players["2"].startsWith("b")
//     ) {
//       difficulty = game.players["2"].substring(2);
//     }

//     let endGameText = null;
//     if (game && game.finished) {
//       if (gameState.player === 0) {
//         if (game.finished === 1) {
//           endGameText = "White wins!";
//         } else if (game.finished === 2) {
//           endGameText = "Black wins!";
//         } else {
//           endGameText = "Draw!";
//         }
//       } else if (game.finished === gameState.player) {
//         endGameText = "You win!";
//       } else if (game.finished === -1) {
//         endGameText = "Draw!";
//       } else {
//         endGameText = "You lost!";
//       }
//     }

//     let readyText = "Waiting for opponent...";
//     let readyAction = null;
//     if (player === 0) {
//       readyText = "Waiting for players...";
//     } else if (!isReady) {
//       if (!gameState || gameState.level === null) {
//         readyText = "I'm ready!";
//       } else {
//         readyText = "Start Game";
//       }
//       readyAction = "ready";
//     }

//     if (game && game.started) {
//       readyText = "Game started!";
//     }
//     if (game && game.finished) {
//       if (player == 0) {
//         readyText = endGameText;
//       } else {
//         readyText = "Play Again";
//         readyAction = "play-again";
//       }
//     }

//     let belt = null;
//     if (gameState && gameState.level !== null) {
//       belt = Math.floor(gameState.level / 8) + 1;
//     }

//     const isPortrait = windowHeight > 1.5 * windowWidth;

//     if (this.music) {
//       if (game && game.started && !game.finished) {
//         this.music.play();
//       } else {
//         this.music.pause();
//         this.music.currentTime = 0;
//       }
//     }

//     return game ? (
//       <div className="game">
//         {this.renderModal(
//           gameState,
//           player,
//           modalType,
//           showReady,
//           inviteUsername,
//           friendLink,
//           invited,
//           difficulty,
//           readyText,
//           readyAction,
//           endGameText
//         )}
//         <div className="game-content">
//           {this.renderAudio()}
//           <div className="game-board">
//             <GameBoard gameState={gameState} />
//           </div>
//           <div className="game-meta">
//             <div>
//               <div className="game-meta-section game-ready-section">
//                 <div
//                   className={`game-ready-button ${
//                     readyAction ? "clickable" : ""
//                   }`}
//                   onClick={() => {
//                     if (readyAction === "ready") {
//                       // amplitude.getInstance().logEvent('Click Ready', {
//                       //     source: 'sidebar',
//                       //     player,
//                       //     gameId: gameState.gameId,
//                       //     level: gameState.level,
//                       // });

//                       gameState.ready();
//                     } else if (readyAction === "play-again") {
//                       // amplitude.getInstance().logEvent('Click Play Again', {
//                       //     source: 'sidebar',
//                       //     player,
//                       //     gameId: gameState.gameId,
//                       //     level: gameState.level,
//                       // });

//                       gameState.reset();
//                     }
//                   }}
//                 >
//                   {readyText}
//                 </div>
//                 {player !== 0 && (!game.started || game.finished !== 0) && (
//                   <div
//                     className="game-cancel-button"
//                     onClick={() => {
//                       // amplitude.getInstance().logEvent('Cancel Game', {
//                       //     source: 'sidebar',
//                       //     player,
//                       //     gameId: gameState.gameId,
//                       //     level: gameState.level,
//                       // });

//                       gameState.cancel();
//                     }}
//                   >
//                     Cancel Game
//                   </div>
//                 )}
//                 {player !== 0 &&
//                   gameState.level !== null &&
//                   game.started &&
//                   game.finished == 0 && (
//                     <div
//                       className="game-cancel-button"
//                       onClick={() => {
//                         // amplitude.getInstance().logEvent('Restart Level', {
//                         //     source: 'sidebar',
//                         //     player,
//                         //     gameId: gameState.gameId,
//                         //     level: gameState.level,
//                         // });

//                         gameState.reset();
//                       }}
//                     >
//                       Restart Level
//                     </div>
//                   )}
//               </div>
//               {gameState.level !== null && (
//                 <div className="game-meta-section game-level-section">
//                   <div className="game-level-num">
//                     Level {gameState.level + 1} ({BELTS[belt]} Belt)
//                   </div>
//                   <div className="game-level-title">
//                     {CampaignLevels[gameState.level].title}
//                   </div>
//                   <div className="game-level-description">
//                     {CampaignLevels[gameState.level].description}
//                   </div>
//                 </div>
//               )}
//               {gameState.level === null && (
//                 <div className="game-meta-section">
//                   <Tooltip
//                     title="Copied to clipboard!"
//                     distance={5}
//                     trigger="click"
//                   >
//                     <CopyToClipboard
//                       text={baseUrl}
//                       onCopy={() => {
//                         // amplitude.getInstance().logEvent('Copy Spectator Link', {
//                         //     source: 'sidebar',
//                         //     gameId: gameState.gameId,
//                         //     player,
//                         // });
//                       }}
//                     >
//                       <div className="game-friend-link">
//                         <div className="game-friend-link-text">
//                           Copy spectator link
//                         </div>
//                         <div className="game-friend-link-icon">
//                           <i className="fas fa-link" />
//                         </div>
//                       </div>
//                     </CopyToClipboard>
//                   </Tooltip>
//                 </div>
//               )}
//               {(gameState.level === null || gameState.player !== 1) && (
//                 <div className="game-meta-section game-meta-players">
//                   <table>
//                     <tbody>
//                       <tr className="game-meta-player">
//                         <td className="game-meta-player-color">White:</td>
//                         <td>
//                           <UserDisplay
//                             value={game.players[1]}
//                             knownUsers={knownUsers}
//                           />
//                         </td>
//                       </tr>
//                       {gameState.level === null && (
//                         <tr className="game-meta-player">
//                           <td className="game-meta-player-color">Black:</td>
//                           <td>
//                             <UserDisplay
//                               value={game.players[2]}
//                               knownUsers={knownUsers}
//                             />
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//             <div className="game-audio-controls">
//               <table>
//                 <tbody>
//                   <tr className="game-audio-control">
//                     <td className="game-audio-control-label">Music:</td>
//                     <td>
//                       <input
//                         className="game-music-volume"
//                         type="range"
//                         min="0"
//                         max="100"
//                         value={musicVolume}
//                         onChange={() => {}}
//                         onInput={(e) => {
//                           // amplitude.getInstance().logEvent('Change Volume', {
//                           //     source: 'game',
//                           //     type: 'music',
//                           //     volume: e.target.value,
//                           // });

//                           this.setState({ musicVolume: e.target.value });
//                           if (window.localStorage) {
//                             window.localStorage.musicVolume = e.target.value;
//                           }
//                         }}
//                       />
//                     </td>
//                   </tr>
//                   <tr className="game-audio-control">
//                     <td className="game-audio-control-label">Sound:</td>
//                     <td>
//                       <input
//                         className="game-sound-volume"
//                         type="range"
//                         min="0"
//                         max="100"
//                         value={soundVolume}
//                         onChange={() => {}}
//                         onInput={(e) => {
//                           // amplitude.getInstance().logEvent('Change Volume', {
//                           //     source: 'game',
//                           //     type: 'sound',
//                           //     volume: e.target.value,
//                           // });

//                           this.setState({ soundVolume: e.target.value });
//                           if (window.localStorage) {
//                             window.localStorage.soundVolume = e.target.value;
//                           }
//                         }}
//                       />
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         {isPortrait && (
//           <div className="game-portrait-warning">
//             Your browser appears to be in portrait mode.
//             <br />
//             Rotate for a better experience!
//           </div>
//         )}
//       </div>
//     ) : null;
//   }

//   renderAudio() {
//     const { musicVolume } = this.state;

//     return (
//       <div>
//         <audio
//           ref={(music) => {
//             this.music = music;
//             if (this.music) {
//               this.music.volume = musicVolume / 100;
//             }
//           }}
//           loop
//         >
//           <source src="/static/kfchess-music.mp3" type="audio/mp3" />
//         </audio>
//         <audio ref={(sound) => (this.captureSounds[0] = sound)}>
//           <source src="/static/kfchess-sound1.mp3" type="audio/mp3" />
//         </audio>
//         <audio ref={(sound) => (this.captureSounds[1] = sound)}>
//           <source src="/static/kfchess-sound2.mp3" type="audio/mp3" />
//         </audio>
//         <audio ref={(sound) => (this.captureSounds[2] = sound)}>
//           <source src="/static/kfchess-sound3.mp3" type="audio/mp3" />
//         </audio>
//         <audio ref={(sound) => (this.captureSounds[3] = sound)}>
//           <source src="/static/kfchess-sound4.mp3" type="audio/mp3" />
//         </audio>
//         <audio ref={(sound) => (this.captureSounds[4] = sound)}>
//           <source src="/static/kfchess-sound5.mp3" type="audio/mp3" />
//         </audio>
//         <audio ref={(sound) => (this.captureSounds[5] = sound)}>
//           <source src="/static/kfchess-sound6.mp3" type="audio/mp3" />
//         </audio>
//         <audio ref={(sound) => (this.captureSounds[6] = sound)}>
//           <source src="/static/kfchess-sound7.mp3" type="audio/mp3" />
//         </audio>
//         <audio ref={(sound) => (this.captureSounds[7] = sound)}>
//           <source src="/static/kfchess-sound8.mp3" type="audio/mp3" />
//         </audio>
//         <audio ref={(sound) => (this.finishSound = sound)}>
//           <source src="/static/kfchess-gong.mp3" type="audio/mp3" />
//         </audio>
//         <audio ref={(sound) => (this.beltSound = sound)}>
//           <source src="/static/belt-achievement.mp3" type="audio/mp3" />
//         </audio>
//       </div>
//     );
//   }

//   renderModal(
//     gameState,
//     player,
//     modalType,
//     showReady,
//     inviteUsername,
//     friendLink,
//     invited,
//     difficulty,
//     readyText,
//     readyAction,
//     endGameText
//   ) {
//     const { oldRating, newRating, newBelt } = this.state;
//     const { user, knownUsers } = this.props;

//     return (
//       <Modal
//         isOpen={Boolean(modalType)}
//         onRequestClose={this.closeModal}
//         shouldCloseOnOverlayClick={modalType !== "ready"}
//         shouldCloseOnEsc={modalType !== "ready"}
//         className="game-modal"
//         closeTimeoutMS={200}
//       >
//         {modalType === "ready" && (
//           <div className="game-ready">
//             {gameState.level === null && this.renderReadyTitle(gameState.game)}
//             {gameState.level === null && friendLink && !invited && (
//               <Tooltip
//                 title="Copied to clipboard!"
//                 distance={5}
//                 trigger="click"
//               >
//                 <CopyToClipboard
//                   text={friendLink}
//                   onCopy={() => {
//                     // amplitude.getInstance().logEvent('Copy Friend Link', {
//                     //     source: 'modal',
//                     //     player,
//                     //     gameId: gameState.gameId,
//                     // });

//                     this.setState({
//                       showReady: true,
//                     });
//                   }}
//                 >
//                   <div className="game-friend-link">
//                     <div className="game-friend-link-text">
//                       Click to copy link and send to friend!
//                     </div>
//                     <div className="game-friend-link-icon">
//                       <i className="fas fa-link" />
//                     </div>
//                   </div>
//                 </CopyToClipboard>
//               </Tooltip>
//             )}
//             {gameState.level === null && friendLink && !invited && user && (
//               <div className="game-invite">
//                 <input
//                   placeholder="... or invite by username"
//                   value={inviteUsername}
//                   maxLength={24}
//                   onChange={(e) =>
//                     this.setState({ inviteUsername: e.target.value })
//                   }
//                   onKeyPress={(e) => e.key === "Enter" && this.inviteUser()}
//                 />
//                 <div
//                   className="game-invite-submit"
//                   onClick={() => this.inviteUser()}
//                 >
//                   <i className="far fa-paper-plane" />
//                 </div>
//               </div>
//             )}
//             {gameState.level === null && difficulty && (
//               <div className="game-difficulty-wrapper">
//                 <div
//                   className={`game-difficulty-option ${
//                     difficulty === "novice" ? "selected" : ""
//                   }`}
//                   onClick={() => this.changeDifficulty("novice")}
//                 >
//                   Novice
//                 </div>
//                 <div
//                   className={`game-difficulty-option ${
//                     difficulty === "intermediate" ? "selected" : ""
//                   }`}
//                   onClick={() => this.changeDifficulty("intermediate")}
//                 >
//                   Intermediate
//                 </div>
//                 <div
//                   className={`game-difficulty-option ${
//                     difficulty === "advanced" ? "selected" : ""
//                   }`}
//                   onClick={() => this.changeDifficulty("advanced")}
//                 >
//                   Advanced
//                 </div>
//               </div>
//             )}
//             {gameState.level !== null && (
//               <div className="game-level">
//                 <div className="game-level-title">
//                   {CampaignLevels[gameState.level].title}
//                 </div>
//                 <div className="game-level-description">
//                   {CampaignLevels[gameState.level].description}
//                 </div>
//               </div>
//             )}
//             {showReady && (
//               <div
//                 className={`game-ready-button ${
//                   readyAction ? "clickable" : ""
//                 }`}
//                 onClick={() => {
//                   if (readyAction === "ready") {
//                     // amplitude.getInstance().logEvent('Click Ready', {
//                     //     source: 'modal',
//                     //     player,
//                     //     gameId: gameState.gameId,
//                     // });

//                     gameState.ready();
//                   }
//                 }}
//               >
//                 {readyText}
//               </div>
//             )}
//             <div
//               className="game-cancel-button"
//               onClick={() => {
//                 // amplitude.getInstance().logEvent('Cancel Game', {
//                 //     source: 'modal',
//                 //     player,
//                 //     gameId: gameState.gameId,
//                 //     level: gameState.level,
//                 // });

//                 gameState.cancel();
//               }}
//             >
//               Cancel
//             </div>
//           </div>
//         )}
//         {modalType === "game-finished" && (
//           <div className="game-finished">
//             <div className="game-finished-text">{endGameText}</div>
//             {oldRating && (
//               <div className="game-finished-rating">
//                 {`New rating: ${newRating} (${
//                   newRating >= oldRating
//                     ? "+" + (newRating - oldRating)
//                     : newRating - oldRating
//                 })`}
//               </div>
//             )}
//             {newBelt && (
//               <div className="game-finished-new-belt">
//                 <img src={`/static/belt-${BELTS[newBelt].toLowerCase()}.png`} />
//                 <div className="game-finished-new-belt-text">
//                   Congratulations! You've received the {`${BELTS[newBelt]}`}{" "}
//                   Belt.
//                 </div>
//               </div>
//             )}
//             {player !== 0 && (
//               <div className="game-finished-buttons">
//                 <div
//                   className="game-finished-button-again"
//                   onClick={() => {
//                     // amplitude.getInstance().logEvent('Click Play Again', {
//                     //     source: 'modal',
//                     //     player,
//                     //     gameId: gameState.gameId,
//                     //     level: gameState.level,
//                     // });

//                     gameState.reset();
//                   }}
//                 >
//                   Play Again
//                 </div>
//                 {gameState.level !== null &&
//                   gameState.level + 1 < CampaignLevels.length &&
//                   gameState.game.finished == 1 && (
//                     <div
//                       className="game-finished-button-again"
//                       onClick={() => {
//                         // amplitude.getInstance().logEvent('Click Next Level', {
//                         //     source: 'modal',
//                         //     player,
//                         //     gameId: gameState.gameId,
//                         //     level: gameState.level,
//                         // });

//                         this.props.startCampaignLevel(gameState.level + 1);
//                       }}
//                     >
//                       Next Level
//                     </div>
//                   )}
//               </div>
//             )}
//             {player !== 0 && (
//               <div
//                 className="game-cancel-button"
//                 onClick={() => {
//                   // amplitude.getInstance().logEvent('Cancel Game', {
//                   //     source: 'modal',
//                   //     player,
//                   //     gameId: gameState.gameId,
//                   //     level: gameState.level,
//                   // });

//                   gameState.cancel();
//                 }}
//               >
//                 Cancel
//               </div>
//             )}
//           </div>
//         )}
//       </Modal>
//     );
//   }

//   renderReadyTitle(game) {
//     const { knownUsers } = this.props;

//     const rated = Object.values(game.players).every((v) => v.startsWith("u:"));
//     const players = Object.keys(game.players).sort();

//     return (
//       <div className="game-ready-text">
//         <div className="game-ready-text-speed">
//           <SpeedIcon speed={game.speed} iconOnly={false} rated={rated} />
//         </div>
//         <div className="game-ready-text-players">
//           {players.map((player, index) => {
//             const value = game.players[player];
//             if (index === 0) {
//               return (
//                 <div className="game-ready-text-vs-player" key={index}>
//                   <UserDisplay value={value} knownUsers={knownUsers} />
//                 </div>
//               );
//             }

//             return (
//               <div className="game-ready-text-vs-player" key={index}>
//                 <div className="game-ready-text-vs">vs</div>
//                 <UserDisplay value={value} knownUsers={knownUsers} />
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }
// }

// export default withRouter(Game);
