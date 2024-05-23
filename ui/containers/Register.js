import React, { useState } from "react";
import Footer from "./footer";

const Register = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    skill: "1", // Default skill level
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onSignup function passed as a prop with the form data
    onSignup(formData);
  };

  return (
    <div className="layout-component">
      <div className="layout-column-one">
        <div className="registration-sheet">
          <h1 className="security-title">Join Now - It's Free & Easy!</h1>
          <div className="security-container">
            <div className="register-sheet-component">
              <form onSubmit={handleSubmit} className="register-sheet-form">
                <div className="register-form-line">
                  <label htmlFor="username">Username</label>
                  <div className="form-input-component">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      className="form-input"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="register-form-line">
                  <label htmlFor="email">Email</label>
                  <div className="form-input-component">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="register-form-line">
                  <label htmlFor="password">Password</label>
                  <div className="form-input-component">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="form-input"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="register-form-line">
                  <label htmlFor="skill">Skill Level</label>
                  <div className="form-select-component">
                    <select
                      id="skill"
                      name="skill"
                      className="form-select-large"
                      value={formData.skill}
                      onChange={handleInputChange}
                    >
                      <option value="1">New to Chess</option>
                      <option value="2">Beginner</option>
                      <option value="3">Intermediate</option>
                      <option value="4">Advanced</option>
                      <option value="5">Expert</option>
                    </select>
                    <div className="form-select-icon">
                      <i className="fas fa-caret-down" />
                    </div>
                  </div>
                </div>
                <div className="register-form-line">
                  <button
                    type="submit"
                    className="ui_v5-button-component submit_btn"
                  >
                    Create Your FREE Account
                  </button>
                </div>
              </form>
              <div className="register-sheet-line">Or sign up using...</div>
              <div className="social-signin register-sheet-line">
                <a
                  href="/register-facebook"
                  className="button-component social-sign-button facebook"
                >
                  <i className="fab fa-facebook" />
                  <span>Facebook</span>
                </a>
                <a
                  href="/login/google"
                  className="button-component social-sign-button google"
                >
                  <i className="fab fa-google" />
                  <span>Google</span>
                </a>
                <a
                  href="/login/apple"
                  className="button-component social-sign-button apple"
                >
                  <i className="fab fa-apple"></i>
                  <span>Apple ID</span>
                </a>
              </div>
            </div>
            <div className="security-terms">
              I accept the site{" "}
              <a target="_blank" href="/legal/user-agreement">
                Terms of Service
              </a>{" "}
              and agree to the{" "}
              <a target="_blank" href="/legal/privacy">
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </div>
      <div className="layout-coumn-two">
        <section className="security-new-user">
          <div className="security-user-overlay">
            <h2>
              <div className="security-user-overlay-icon icon-font-component">
                <i className="fas fa-user"></i>
              </div>
              28,936
            </h2>
            <p>New Members Today</p>
          </div>
        </section>
        <section className="v5-section">
          <div className="security-privacy-notice">
            <h3>Privacy Guaranteed</h3>
            <p>
              Your email address & personal info are safe and will NEVER be
              shared with anyone!
            </p>
            <p>
              See our complete Privacy Policy
              <a href="/legal/user-agreement" target="_blank">
                {" "}
                here
              </a>
              .
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Register;

// import React from 'react';
// import Footer from './footer';

// const Register = () => {
//   return (
//     <div className='layout-component'>
//       <div className='layout-column-one'>
//         <div className='registration-sheet'>
//           <h1 className='security-title'>Join Now - It's Free & Easy!</h1>
//           <div className='security-container'>
//             <div className='register-sheet-component'>
//               <form action='/register' method='post' className='register-sheet-form'>
//                 <div className='register-form-line'>
//                   <label htmlFor='registration_username'>Username</label>
//                   <div className='form-input-component'>
//                     <input
//                       id='registration_username'
//                       name='registration[username]'
//                       type='text'
//                       className='form-input'
//                     />
//                   </div>
//                 </div>
//                 <div className='register-form-line'>
//                   <label htmlFor='registration_email'>Email</label>
//                   <div className='form-input-component'>
//                     <input
//                       id='registration_email'
//                       name='registration[email]'
//                       type='email'
//                       className='form-input'
//                     />
//                   </div>
//                 </div>
//                 <div className='register-form-line'>
//                   <label htmlFor='registration_password'>Password</label>
//                   <div className='form-input-component'>
//                     <input
//                       id='registration_password'
//                       name='registration[password]'
//                       type='password'
//                       className='form-input'
//                     />
//                   </div>
//                 </div>
//                 <div className='register-form-line'>
//                   <label htmlFor='registration_skill'>Skill Level</label>
//                   <div className='form-select-component'>
//                     <select id='registration_skill' name='registration[skill]' className='form-select-large'>
//                       <option value='1'>New to Chess</option>
//                       <option value='2'>Beginner</option>
//                       <option value='3'>Intermediate</option>
//                       <option value='4'>Advanced</option>
//                       <option value='5'>Expert</option>
//                     </select>
//                     <div className='form-select-icon'>
//                       <i className="fas fa-caret-down" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className='register-form-line'>
//                   <button type='submit' className='ui_v5-button-component submit_btn'>
//                     Create Your FREE Account
//                   </button>
//                 </div>
//               </form>
//               <div className='register-sheet-line'>
//                 Or sign up using...
//               </div>
//               <div className='social-signin register-sheet-line'>
//                 <a href='/register-facebook' className='button-component social-sign-button facebook'>
//                   <i className="fab fa-facebook" />
//                   <span>Facebook</span>
//                 </a>
//                 <a href='/login/google' className='button-component social-sign-button google'>
//                   <i className="fab fa-google" />
//                   <span>Google</span>
//                 </a>
//                 <a href='/login/apple' className='button-component social-sign-button apple'>
//                   <i className="fab fa-apple"></i>
//                   <span>Apple ID</span>
//                 </a>
//               </div>
//             </div>
//             <div className='security-terms'>
//               I accept the site <a target='_blank' href='/legal/user-agreement'>Terms of Service</a> and agree to the <a target='_blank' href='/legal/privacy'>Privacy Policy</a>.
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className='layout-coumn-two'>
//         <section className='security-new-user'>
//           <div className='security-user-overlay'>
//             <h2>
//               <div className='security-user-overlay-icon icon-font-component'>
//                 <i className="fas fa-user"></i>
//               </div>
//               28,936
//             </h2>
//             <p>New Members Today</p>
//           </div>
//         </section>
//         <section className='v5-section'>
//           <div className='security-privacy-notice'>
//             <h3>
//               Privacy Guaranteed
//             </h3>
//             <p>Your email address & personal info are safe and will NEVER be shared with anyone!</p>
//             <p>See our complete Privacy Policy
//             <a href='/legal/user-agreement' target='_blank'> here</a>.</p>
//           </div>
//         </section>
//       </div>
//       <Footer />
//     </div>
//   )
// }

// export default Register;
