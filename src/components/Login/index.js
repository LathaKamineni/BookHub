import './index.css'

import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

class Login extends Component {
  state = {
    showErrMsg: false,
    username: '',
    password: '',
    errorMsg: '',
  }

  //on successful submit
  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  //on sumbit failure
  onSubmitFailure = errorMsg => {
    this.setState({showErrMsg: true, errorMsg})
  }
  //onSubmit form
  onSubmitForm = async event => {
    event.preventDefault()
    const {password, username} = this.state
    const userDetails = {password, username}
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApiUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }
  //update user name
  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }
  //update password
  onChangePassword = event => {
    this.setState({password: event.target.value})
  }
  //render input user name
  renderUsernameField = () => {
    const {username} = this.state
    return (
      <div className="input-container">
        <label htmlFor="userName" className="input-label">
          Username*
        </label>
        <input
          type="text"
          id="userName"
          className="input-field"
          onChange={this.onChangeUserName}
          value={username}
        />
      </div>
    )
  }

  //render password
  renderPasswordField = () => {
    const {password} = this.state
    return (
      <div className="input-container">
        <label htmlFor="password" className="input-label">
          Password*
        </label>
        <input
          type="password"
          id="password"
          className="input-field"
          onChange={this.onChangePassword}
          value={password}
        />
      </div>
    )
  }
  render() {
    const {showErrMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="login-image-container">
          <img
            alt="website login"
            src="https://res.cloudinary.com/dj7lfkwta/image/upload/v1723080879/Ellipse_99_oqck4y.png"
          />
          <img
            src="https://res.cloudinary.com/dj7lfkwta/image/upload/v1723080966/Group_7731_lxpzoj.png"
            className="book-hub-img"
            alt="login website logo"
          />
        </div>
        <img
          src="https://res.cloudinary.com/dj7lfkwta/image/upload/v1723082646/Rectangle_1467_ocqxqv.png"
          className="book-desktop-img"
          alt="website login"
        />
        <form className="login-form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://res.cloudinary.com/dj7lfkwta/image/upload/v1723080966/Group_7731_lxpzoj.png"
            className="book-desktop-hub-img"
            alt="login website logo"
          />
          {this.renderUsernameField()}
          {this.renderPasswordField()}
          {showErrMsg && <p className="error-msg">{errorMsg}</p>}
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default Login
