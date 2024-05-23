// import amplitude from 'amplitude-js';
import React from "react";
import { Tooltip } from "react-tippy";

import ProfilePic from "./ProfilePic.js";
const Header = ({ user, router, logout }) => {
  const renderProfileDropdown = () => {
    if (!user || !user.currentGame) {
      return null; // Return null if user or user.currentGame is null
    }
    const navigate = (url) => {
      window.location.href = url;
    };
    return (
      <Tooltip
        position="bottom-end"
        arrow={true}
        distance={15}
        trigger="click"
        interactive={false}
        theme="light"
        className="header-profile-dropdown-tooltip"
        onShow={() => {
          // amplitude.getInstance().logEvent('Click Profile Pic');
          // loadMyInfo(); // Since loadMyInfo is not passed, it's commented out
        }}
        html={
          <div className="header-profile-dropdown">
            <div className="header-profile-dropdown-option">
              <a
                onClick={() => {
                  const { gameId, playerKey } = user.currentGame;
                  navigate(`/game/${gameId}?key=${playerKey}`);
                }}
              >
                In Game!
              </a>
            </div>
            <div className="header-profile-dropdown-option">
              <a
                onClick={() => {
                  navigate(`/profile/${user.userId}`);
                }}
              >
                Profile
              </a>
            </div>
            <div className="header-profile-dropdown-option">
              <a
                onClick={() => {
                  // amplitude.getInstance().logEvent('Logout');
                  logout();
                }}
              >
                Logout
              </a>
            </div>
          </div>
        }
      >
        <ProfilePic className="header-profile-pic" user={user} />
      </Tooltip>
    );
  };

  return (
    <div className="header">
      <div className="navs-top">
        <a
          className="nav-link-component chess-logo-wrapper sprite chess-logo"
          href="/"
        />
        <a href="/register" className="button">
          <span className="label">Sign Up</span>
        </a>
        <a href="/signin" className="button">
          <span className="label">Log In</span>
        </a>
      </div>
      <div className="navs-menu">
        <a href="/search" className="nav-action">
          <div className="nav-toggle">
            <i className="fas fa-search icon" />
            <span className="nav-link-text">Search</span>
          </div>
        </a>
        <a href="/search" className="nav-action">
          <div className="nav-toggle">
            <i className="fas fa-question-circle icon" />
            <span className="nav-link-text">Help</span>
          </div>
        </a>
      </div>
      {renderProfileDropdown()}{" "}
      {/* Call renderProfileDropdown without arguments */}
    </div>
  );
};

export default Header;

// // import amplitude from 'amplitude-js';
// import React, { Component } from "react";
// import { Tooltip } from "react-tippy";

// import ProfilePic from "./ProfilePic.js";

// export default class Header extends Component {
//   render() {
//     return (
//       <div className="header">
//         <div className="navs-top">
//           <a
//             className="nav-link-component chess-logo-wrapper sprite chess-logo"
//             href="/"
//           />
//           <a href="/register" className="button">
//             <span className="label">Sign Up</span>
//           </a>
//           <a href="/signin" className="button">
//             <span className="label">Log In</span>
//           </a>
//         </div>
//         <div className="navs-menu">
//           <a href="/search" className="nav-action">
//             <div className="nav-toggle">
//               <i className="fas fa-search icon" />
//               <span className="nav-link-text">Search</span>
//             </div>
//           </a>
//           <a href="/search" className="nav-action">
//             <div className="nav-toggle">
//               <i className="fas fa-question-circle icon" />
//               <span className="nav-link-text">Help</span>
//             </div>
//           </a>
//         </div>
//       </div>
//     );
//   }

//   renderProfileDropdown() {
//     const { user, router } = this.props;

//     return (
//       <Tooltip
//         position="bottom-end"
//         arrow={true}
//         distance={15}
//         trigger="click"
//         interactive={false}
//         theme="light"
//         className="header-profile-dropdown-tooltip"
//         onShow={() => {
//           // amplitude.getInstance().logEvent('Click Profile Pic');
//           // this.props.loadMyInfo();
//         }}
//         html={
//           <div className="header-profile-dropdown">
//             {user.currentGame && (
//               <div className="header-profile-dropdown-option">
//                 <a
//                   onClick={() => {
//                     const { gameId, playerKey } = user.currentGame;
//                     navigate(`/game/${gameId}?key=${playerKey}`);
//                   }}
//                 >
//                   In Game!
//                 </a>
//               </div>
//             )}
//             <div className="header-profile-dropdown-option">
//               <a
//                 onClick={() => {
//                   navigate(`/profile/${user.userId}`);
//                 }}
//               >
//                 Profile
//               </a>
//             </div>
//             <div className="header-profile-dropdown-option">
//               <a
//                 onClick={() => {
//                   // amplitude.getInstance().logEvent('Logout');

//                   this.props.logout();
//                 }}
//               >
//                 Logout
//               </a>
//             </div>
//           </div>
//         }
//       >
//         <ProfilePic className="header-profile-pic" user={user} />
//       </Tooltip>
//     );
//   }
// }
