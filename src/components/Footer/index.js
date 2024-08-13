import './index.css'

import {FaGoogle} from 'react-icons/fa'
import {FaTwitter} from 'react-icons/fa'
import {FaInstagram} from 'react-icons/fa'
import {FaYoutube} from 'react-icons/fa'

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="icons-container">
        <FaGoogle className="icon" />
        <FaTwitter className="icon" />
        <FaInstagram className="icon" />
        <FaYoutube className="icon" />
      </div>
      <p className="contact-us-heading">Contact Us</p>
    </div>
  )
}

export default Footer
