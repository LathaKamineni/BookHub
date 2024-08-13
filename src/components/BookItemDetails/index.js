import {Component} from 'react'

import './index.css'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsFillStarFill} from 'react-icons/bs'

import Header from '../Header'
import Footer from '../Footer'

const bookApiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}
class BookItemDetails extends Component {
  state = {
    bookDetails: {},
    bookApiStatus: bookApiConstants.initial,
  }
  componentDidMount() {
    this.getBookItemDetail()
  }

  // onClick try button

  onClickTryAgainButton = () => {
    this.getBookItemDetail()
  }
  //get book details API
  getBookItemDetail = async () => {
    this.setState({bookApiStatus: bookApiConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    console.log(id)
    const bookApiUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(bookApiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const formattedData = {
        id: data.book_details.id,
        aboutAuthor: data.book_details.about_author,
        aboutBook: data.book_details.about_book,
        authorName: data.book_details.author_name,
        coverPic: data.book_details.cover_pic,
        readStatus: data.book_details.read_status,
        rating: data.book_details.rating,
        title: data.book_details.title,
      }
      this.setState({
        bookDetails: formattedData,
        bookApiStatus: bookApiConstants.success,
      })
    } else {
      this.setState({bookApiStatus: bookApiConstants.failure})
    }
  }
  //render loading view
  renderLoadingView = () => {
    return (
      <div className="loader-container" testid="loader">
        <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
      </div>
    )
  }

  //render books view
  renderBookSuccessView = () => {
    const {bookDetails} = this.state
    const {
      title,
      rating,
      readStatus,
      coverPic,
      authorName,
      aboutBook,
      aboutAuthor,
      id,
    } = bookDetails
    console.log(bookDetails)
    return (
      <div className="book-details-footer-container">
        <div className="book-detail-container">
          <div className="book-top-section-container">
            <img src={coverPic} className="cover-pic" alt={title} />
            <div className="book-cover-pic-container ">
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
          </div>
          <hr className="line" />
          <div>
            <h1 className="auhtor-heading">About Author</h1>
            <p className="author-description">{aboutAuthor}</p>
            <h1 className="auhtor-heading">About Book</h1>
            <p className="author-description">{aboutBook}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
  //render books failure view
  renderBookFailureView = () => {
    return (
      <div className="top-rated-failure-container">
        <img
          src="https://res.cloudinary.com/dj7lfkwta/image/upload/v1723101511/Group_7522_kdph2u.png"
          alt="failure view"
        />
        <p className="top-rated-failure-description">
          Something went wrong. Please try again
        </p>
        <button
          type="button"
          className="try-again-button"
          onClick={this.onClickTryAgainButton}
        >
          Try Again
        </button>
      </div>
    )
  }

  //render book view
  renderBookView = () => {
    const {bookApiStatus} = this.state
    switch (bookApiStatus) {
      case bookApiConstants.success:
        return this.renderBookSuccessView()
      case bookApiConstants.failure:
        return this.renderBookFailureView()
      case bookApiConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        {this.renderBookView()}
      </>
    )
  }
}

export default BookItemDetails
