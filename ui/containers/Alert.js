import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

const Alert = ({ error }) => {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (error && (!error.id || error.id !== error.id)) {
      // Fixed this line
      setShowing(true);

      // Dismiss the alert after 5s
      const timeoutId = setTimeout(() => {
        setShowing(false);
      }, 5000);

      // Clear timeout on component unmount
      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  return (
    <div className="alert">
      <CSSTransition in={showing} timeout={500} classNames="alert-transition">
        <div
          className={`alert-message ${showing ? "alert-message-showing" : ""}`}
        >
          <i className="fas fa-exclamation-circle" />
          {error && error.message}
        </div>
      </CSSTransition>
    </div>
  );
};

export default Alert;

// // import amplitude from 'amplitude-js';
// import React, { Component } from "react";
// import { CSSTransition } from "react-transition-group";

// export default class Alert extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       showing: false,
//     };
//   }

//   componentWillReceiveProps(nextProps) {
//     if (
//       nextProps.error &&
//       (!this.props.error || nextProps.error.id !== this.props.error.id)
//     ) {
//       this.setState(
//         {
//           showing: true,
//         },
//         () => {
//           // dismiss the alert after 5s
//           window.setTimeout(() => {
//             this.setState({
//               showing: false,
//             });
//           }, 5000);
//         }
//       );
//     }
//   }

//   render() {
//     const { showing } = this.state;
//     const { error } = this.props;

//     return (
//       <div className="alert">
//         <CSSTransition in={showing} timeout={500} classNames="alert-transition">
//           <div
//             className={`alert-message ${
//               showing ? "alert-message-showing" : ""
//             }`}
//           >
//             <i className="fas fa-exclamation-circle" />
//             {error && error.message}
//           </div>
//         </CSSTransition>
//       </div>
//     );
//   }
// }
