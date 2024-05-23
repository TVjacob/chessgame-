import React from "react";

const ProfilePic = ({ user, className }) => {
  return (
    <div className={`profile-pic ${className || ""}`}>
      <img
        src={user.pictureUrl || "/static/default-profile.jpg"}
        alt="Profile"
      />
    </div>
  );
};

export default ProfilePic;

// import React, { Component } from 'react';

// export default class ProfilePic extends Component {

//     render() {
//         const { user, className } = this.props;

//         return (
//             <div className={`profile-pic ${className || ''}`}>
//                 <img src={user.pictureUrl || '/static/default-profile.jpg'} />
//             </div>
//         );
//     }
// };
