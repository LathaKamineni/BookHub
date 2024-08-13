import './index.css'
import {Component} from 'react'

import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {IoMdCloseCircle} from 'react-icons/io'

class Header extends Component {
  state = {showHambuger: false}

  onClickHambergur = () => {
    this.setState({showHambuger: true})
  }
  onClickClose = () => {
    this.setState({showHambuger: false})
  }
  onClickLogout = () => {
    console.log('LOGUT')
    const {history} = this.props
    console.log(history)
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  //render hamburger options
  renderOptions = () => {
    return (
      <div className="options">
        <ul className="options-list">
          <li>
            <Link to="/" className="link-item">
              Home
            </Link>
          </li>
          <li>
            <Link to="/shelf" className="link-item">
              BookShelves
            </Link>
          </li>
        </ul>
        <button
          type="button"
          className="logout-button"
          onClick={this.onClickLogout}
        >
          Logout
        </button>
        <button
          type="button"
          className="close-button"
          onClick={this.onClickClose}
        >
          <IoMdCloseCircle size={25} />
        </button>
      </div>
    )
  }
  render() {
    const {showHambuger} = this.state
    return (
      <div className="header-container">
        <div className="hambuger-container">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dj7lfkwta/image/upload/v1723080966/Group_7731_lxpzoj.png"
              className="book-hub-img"
              alt="website logo"
            />
          </Link>
          <div className="desktop-options">{this.renderOptions()}</div>
          <button
            className="hambuger-button"
            type="button"
            onClick={this.onClickHambergur}
          >
            <img src="https://res.cloudinary.com/dj7lfkwta/image/upload/v1723090370/menu_igvgnm.png" />
          </button>
        </div>
        <div className="mobile-view-options">
          {showHambuger && this.renderOptions()}
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
