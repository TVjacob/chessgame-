import amplitude from 'amplitude-js';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/ModalLayout';
import hikaru from '../assets/images/hikaru-nakamura.jpg';
import anna from '../assets/images/anna-rudolf.png';
import puzzleboard from '../assets/images/board-puzzles.png';
import lessonboard from '../assets/images/board-lessons.png';
import womenlearn from '../assets/images/womenlearn.png';
import ftx from '../assets/images/ftx.png';
import intersection from '../assets/images/intersection.jpeg';
import beating from '../assets/images/beating.png';
import SelectLevel from './../components/SelectLevel';
import Footer from './footer';
export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            friendlySpeed: (window.localStorage && window.localStorage.friendlySpeed) || 'standard',
            show: false,
        };
    }

    componentDidMount() {
        amplitude.getInstance().logEvent('Visit Home Page');
    }

    changeFriendlySpeed(friendlySpeed) {
        amplitude.getInstance().logEvent('Change Friendly Speed', { friendlySpeed });
        this.setState({ friendlySpeed });

        if (window.localStorage) {
            window.localStorage.friendlySpeed = friendlySpeed;
        }
    }

    handleShow = () => {
        this.setState({show: !this.state.show});
    }

    handleClick = () => {
        this.props.history.push('/play/history')
    }
    render() {
        const { friendlySpeed, show } = this.state;

        return (
            <div className='home'>
                <div className='home-banner'>
                    <div className='home-banner-inner'>
                        <div className='home-banner-video'>
                            <form action='/guest/login' className='guest-button'>
                                <input type='hidden' name='_token' value='uLJkW-jK76xU0k1RN2_cS3Y0Ncaf8hcV76ateY571-g' />
                                <button type='submit'>
                                    <video autoPlay loop muted playsInline>
                                        <source src='/static/banner-video.mp4' type='video/mp4' />
                                    </video>
                                </button>
                            </form>
                        </div>
                        <div className='home-banner-text'>
                            <div>
                                <h1 className='index-title'>Play Chess for Free on the #1 Site!</h1>
                                <div className='index-info'>
                                    <p className='index-info-item'>
                                        <span className='index-info-counter'>9,546,076 </span>
                                        Games Today
                                    </p>
                                    <p className='index-info-item'>
                                        <span className='index-info-counter'>195,710 </span>
                                        Playing Now
                                    </p>
                                </div>
                            </div>
                            <div className='guest-button-wrap'>
                                <div className='guest-button-form'>
                                    <input type='hidden' name='_token' value='uLJkW-jK76xU0k1RN2_cS3Y0Ncaf8hcV76ateY571-g' />
                                    <button type='submit'
                                        className='guest-button'
                                        onClick={this.handleClick}
                                    >
                                        <div className='playhand-icon' />
                                        <div>
                                            <div className='guest-on-title'>Play Online</div>
                                            <div className='guest-on-subtitle'>Play with someone at your level</div>
                                        </div>
                                    </button>
                                    <Modal
                                        open={show}
                                        setOpen={this.handleShow}
                                        content={
                                            <SelectLevel
                                                handleOpen={this.handleShow}
                                            />
                                        }
                                    />
                                </div>
                                <a href='/play/computer' className='guest-button guest-link'>
                                    <div className='playhand-icon computer-icon' />
                                    <div>
                                        <div className='guest-on-title'>Play Computer</div>
                                        <div className='guest-on-subtitle'>Play vs customizable training bots</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <section className='suggestion'>
                    <div className='suggestion-comment-section'>
                        <div>
                            <h2 className='suggestion-title'>
                                Solve Chess Puzzles
                            </h2>
                            <div style={{ display: 'flex' }}>
                                <a href='/puzzles' style={{ margin: 'auto' }}>
                                    <button className='suggestion-btn'>Solve Puzzles</button>
                                </a>
                            </div>
                        </div>
                        <div className='suggestion-comment'>
                            <img src={hikaru} alt='hikaru' className='comment-avatar' />
                            <div className='comment-section'>
                                <p className='comment'>
                                    "Puzzles are the best way to improve pattern recognition, and no site does it better."
                                </p>
                                <div className='comment commentor'>
                                    <span className='index-chess-title'>GM</span>
                                    Hikaru Nakamura
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '45%' }}>
                        <a href='/puzzles'>
                            <img src={puzzleboard} alt='puzzle board' style={{ width: '100%' }} />
                        </a>
                    </div>
                </section>
                <section className='suggestion'>

                    <div style={{ width: '45%' }}>
                        <a href='/lessons'>
                            <img src={lessonboard} style={{ width: '100%' }} alt='lesson board' />
                        </a>
                    </div>
                    <div className='suggestion-comment-section'>
                        <div>
                            <h2 className='suggestion-title'>
                                Take Chess Lessons
                            </h2>
                            <div style={{ display: 'flex' }}>
                                <a href='/lessons' style={{ margin: 'auto' }}>
                                    <button className='suggestion-btn'>Start Lessons</button>
                                </a>
                            </div>
                        </div>
                        <div className='suggestion-comment'>
                            <img src={anna} alt='anna rudolf' className='comment-avatar' />
                            <div className='comment-section'>
                                <p className='comment'>
                                    "Chess.com lessons make it easy to learn to play, then challenge you to continue growing."
                                </p>
                                <div className='comment commentor'>
                                    <span className='index-chess-title'>IM</span>
                                    Anna Rudolf
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className='posts-component'>
                    <a href='/today' style={{width: '100%'}}>
                        <h2 className='posts-title'>
                            Follow what’s happening in Chess Today.
                        </h2>
                    </a>
                    <div className='posts-wrapper'>
                        <a href='https://www.chess.com/article/view/2021-womens-speed-chess-championship-all-the-information' className='post'>
                            <div className='post-img'>
                                <img alt='2021 women learn' src={womenlearn} className='post-img-thumbnail' />
                            </div>
                            <h3 className='post-name'>
                            2021 Women's Speed Chess Championship: Bibisara Assaubayeva Wins Qualifier 3
                            </h3>
                            <div className='post-author'>CHESScom</div>
                        </a>
                        <a href='https://www.chess.com/news/view/ftx-crypto-cup-carlsen-so-in-final' className='post'>
                            <div className='post-img'>
                                <img alt='ftx crypto cup' src={ftx} className='post-img-thumbnail' />
                            </div>
                            <h3 className='post-name'>FTX Crypto Cup: Carlsen, So In Final</h3>
                            <div className='post-author'>PeterDoggers</div>
                        </a>
                        <a href='https://www.chess.com/article/view/the-intersection-of-poker-and-chess' className='post'>
                            <div className='post-img'>
                                <img alt='intersection' src={intersection} className='post-img-thumbnail' />
                            </div>
                            <h3 className='post-name'>The Intersection Of Poker And Chess</h3>
                            <div className='post-author'>wchen8369</div>
                        </a>
                        <a href='https://www.chess.com/video/player/how-to-play-the-kings-indian-attack-beating-h7-h6' className='post'>
                            <div className='post-img'>
                                <img alt='beating' src={beating} className='post-img-thumbnail' />
                            </div>
                            <h3 className='post-name'>How To Play The King's Indian Attack: Beating h7-h6</h3>
                            <div className='post-author'><span className='index-chess-title'>GM</span>dbojkov</div>
                        </a>
                    </div>
                </section>
                <div className='home-play-buttons'>
                    <div className='home-play-button-wrapper'>
                        <Link to='/campaign'>
                            <div className='home-play-button'>
                                Campaign
                            </div>
                        </Link>
                        <div className='home-play-subtitle'>
                            Complete Solo Missions
                        </div>
                    </div>
                    <div className='home-play-button-wrapper'>
                        <div
                            className='home-play-button'
                            onClick={() => this.props.createNewGame(friendlySpeed, true, 'novice')}
                        >
                            Play vs AI
                        </div>
                        <div className='home-play-option-wrapper'>
                            <div
                                className={`home-play-option ${friendlySpeed === 'standard' ? 'selected' : ''}`}
                                onClick={() => this.changeFriendlySpeed('standard')}
                            >
                                Standard
                            </div>
                            <div
                                className={`home-play-option ${friendlySpeed === 'lightning' ? 'selected' : ''}`}
                                onClick={() => this.changeFriendlySpeed('lightning')}
                            >
                                Lightning
                            </div>
                        </div>
                    </div>
                    <div className='home-play-button-wrapper'>
                        <div
                            className='home-play-button'
                            onClick={() => this.props.createNewGame(friendlySpeed, false)}
                        >
                            Play vs Friend
                        </div>
                        <div className='home-play-option-wrapper'>
                            <div
                                className={`home-play-option ${friendlySpeed === 'standard' ? 'selected' : ''}`}
                                onClick={() => this.changeFriendlySpeed('standard')}
                            >
                                Standard
                            </div>
                            <div
                                className={`home-play-option ${friendlySpeed === 'lightning' ? 'selected' : ''}`}
                                onClick={() => this.changeFriendlySpeed('lightning')}
                            >
                                Lightning
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
};
