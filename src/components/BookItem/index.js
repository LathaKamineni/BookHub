import './index.css'

import {Link} from 'react-router-dom'

import {BsFillStarFill} from 'react-icons/bs'

const BookItem = props => {
  const {book, activeBookshelfName} = props
  const {authorName, coverPic, title, id, rating, readStatus} = book

  return (
    <Link to={`/books/${id}`} className="link-item">
      <li className="book-item-container">
        <img src={coverPic} className="cover-pic" alt={title} />
        <div className="book-content-container">
          <h1 className="book-title">{title}</h1>
          <p className="author">{authorName}</p>
          <div className="rating-container">
            <p className="rating-text">Avg Rating</p>
            <BsFillStarFill className="star-icon" />
            <p className="rating">{rating}</p>
          </div>
          <p className="book-status">
            Status: <span className="status">{readStatus}</span>
          </p>
        </div>
      </li>
    </Link>
  )
}

export default BookItem
