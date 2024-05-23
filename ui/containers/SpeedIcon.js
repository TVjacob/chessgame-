import React from "react";
import { Tooltip } from "react-tippy";

import * as Speed from "../util/Speed.js";

const SpeedIcon = ({ speed, iconOnly, rated }) => {
  // Check if speed is undefined or has an unexpected value
  if (!speed || !Speed.isValidSpeed(speed)) {
    return null; // Or render a default icon or handle the case appropriately
  }

  // Get the display name based on the speed
  const displayName = Speed.getDisplayName(speed);

  // Render the component based on the speed
  return (
    <div className="speed-icon">
      {!iconOnly ? displayName + " Speed" + (rated ? " (Rated)" : "") : ""}
      {speed === "standard" && (
        <Tooltip title={displayName}>
          <i className="fas fa-clock speed-icon-i" />
        </Tooltip>
      )}
      {speed === "lightning" && (
        <Tooltip title={displayName}>
          <i className="fas fa-bolt speed-icon-i" />
        </Tooltip>
      )}
    </div>
  );
};

export default SpeedIcon;

// import React, { Component } from 'react';
// import { Tooltip } from 'react-tippy';

// import * as Speed from '../util/Speed.js';

// export default class SpeedIcon extends Component {

//     render() {
//         const { speed, iconOnly, rated } = this.props;
//         const displayName = Speed.getDisplayName(speed);

//         return (
//             <div className='speed-icon'>
//                 {!iconOnly ? displayName + ' Speed' + (rated ? ' (Rated)' : '') : ''}
//                 {speed === 'standard' &&
//                     <Tooltip
//                         title={displayName}
//                     >
//                         <i className='fas fa-clock speed-icon-i' />
//                     </Tooltip>
//                 }
//                 {speed === 'lightning' &&
//                     <Tooltip
//                         title={displayName}
//                     >
//                         <i className='fas fa-bolt speed-icon-i' />
//                     </Tooltip>
//                 }
//             </div>
//         );
//     }
// };
