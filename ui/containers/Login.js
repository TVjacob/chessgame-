import React from 'react'

const Login = () => {
  return (
    <div className='base-container'>
      <div className='base-login-layout'>
        <header className='login-header'>
          <a href='/' className='login-logo' />
        </header>
        <main className='login-component'>
          <div className='login-form-wrapper'>
            <form noValidate method='post' action='/login_check' className='login-form'>
              <div className='form-input-component'>
                <input
                  type='email'
                  id='username'
                  name='_username'
                  required
                  className='form-input-login'
                  placeholder='Username or Email'
                  autoFocus
                  autoComplete='email'
                />
              </div>
              <div className='form-input-component'>
                <input
                  type='password'
                  id='password'
                  name='_password'
                  required
                  className='form-input-login form-input-right'
                  placeholder='Password'
                  autoFocus
                  autoComplete='email'
                />
                <button className='login-toggle-password-visibility'>
                  <i className="fas   fa-eye"></i>
                </button>
              </div>
              <div className='authentication-login-options'>
                <a href='/forgot' className='authentication-login-forgot' title='Forgot Password?'>Forgot Password?</a>
                <label className='checkbox-inline'>
                  <input type='checkbox' id='_remember_me'
                  name='_remember_me'
                  />
                  Remember
                  </label>
              </div>
              <button
                type='submit'
                id='login'
                name='login'
                className='login-submit'
              >
                Log In
              </button>
            </form>
            <div className='authentication-login-separator'>
              <span />
              <span className='login-label'>or connect with</span>
              <span />
            </div>
            <div className='login-social'>
              <a href='/login-facebook' className='login-button facebook' rel='nofollow'>
                <i className="fab fa-facebook" />
                <span>Facebook</span>
              </a>
              <a href='/login/google' className='login-button google' rel='nofollow'>
                <i className="fab fa-google" />
                <span>Google</span>
              </a>
              <a href='/login/apple' className='login-button apple' rel='nofollow'>
                <i className="fab fa-apple" />
                <span>Apple ID</span>
              </a>
            </div>
          </div>
          <div className='login-signup'>
            <h4>New?
              <a href='/register'> Sign up - it's FREE!</a>
            </h4>
          </div>
        </main>
        <footer className='login-footer'>
          <a href='/support' rel='noopener' target='_blank' title='Help'>Help</a>
          <a href='/legal/user-agreement'>Terms & Privacy</a>
          <a href='/'>Chess.com © 2021</a>
        </footer>
      </div>
    </div>
  )
}

export default Login;
