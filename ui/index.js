import React from "react";
import ReactDOM from "react-dom";
import ReactModal from "react-modal";
import ReactGA from "react-ga"; // Import Google Analytics

import App from "./containers/App";

import "react-tippy/dist/tippy.css";
import "./styles/index.less";

ReactGA.initialize("YOUR_GOOGLE_ANALYTICS_TRACKING_ID"); // Initialize Google Analytics

ReactDOM.render(<App />, document.getElementById("app"));

ReactModal.setAppElement("#app");
ReactModal.defaultStyles.overlay.backgroundColor = 0x000000;

// import amplitude from 'amplitude-js';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import ReactModal from 'react-modal';

// import App from './containers/App';

// import 'react-tippy/dist/tippy.css';
// import './styles/index.less';

// amplitude.getInstance().init(AMPLITUDE_API_KEY, null, {
//     includeReferrer: true,
// });

// ReactDOM.render(<App />, document.getElementById('app'));

// ReactModal.setAppElement('#app');
// ReactModal.defaultStyles.overlay.backgroundColor = 0x000000;
// //
