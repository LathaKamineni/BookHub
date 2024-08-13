import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'

import './index.css'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Slider from 'react-slick'

import Header from '../Header'
import Footer from '../Footer'

const topRatedBooksApiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Home extends Component {
  state = {
    topRatedBooksApiStatus: topRatedBooksApiConstants.initial,
    topRatedBooks: [],
  }
  componentDidMount() {
    this.getTopRatedBooks()
  }
  //on click try again
  onClickTryAgain = () => {
    this.getTopRatedBooks()
  }

  //onClick find books button
  onClickFindBooks = () => {
    const {history} = this.props
    history.replace('/shelf')
  }
  //top rated books API
  getTopRatedBooks = async () => {
    this.setState({
      topRatedBooksApiStatus: topRatedBooksApiConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const topRatedBooksApi = 'https://apis.ccbp.in/book-hub/top-rated-books'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(topRatedBooksApi, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const books = fetchedData.books.map(book => ({
        id: book.id,
        title: book.title,
        authorName: book.author_name,
        coverPic: book.cover_pic,
      }))

      this.setState({
        topRatedBooksApiStatus: topRatedBooksApiConstants.success,
        topRatedBooks: books,
      })
    } else {
      this.setState({topRatedBooksApiStatus: topRatedBooksApiConstants.failure})
    }
  }
  //render Loading view
  renderLoadingView = () => {
    return (
      <div className="loader-container" testid="loader">
        <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
      </div>
    )
  }

  //render home failure view
  renderHomeFailureView = () => {
    return (
      <div className="home-failure-container">
        <h1 className="failure-heading">Find Your Next Favorite Books?</h1>
        <p className="failure-description">
          You are in the right place. Tell us what titles or genres you have
          enjoyed in the past, and we will give you surprisingly insightful
          recommendations.
        </p>
        <button
          className="find-books-button"
          type="button"
          onClick={this.onClickFindBooks}
        >
          Find Books
        </button>
        <div className="top-rated-books-container">
          <div className="books-button-container">
            <h1 className="top-rated-heading">Top Rated Books</h1>
            <button
              className="find-books-desktop-button"
              onClick={this.onClickFindBooks}
            >
              Find Books
            </button>
          </div>
          <div className="top-rated-failure-container">
            <img
              alt="failure view"
              src="https://res.cloudinary.com/dj7lfkwta/image/upload/v1723101511/Group_7522_kdph2u.png"
            />
            <p className="top-rated-failure-description">
              Something went wrong. Please try again
            </p>
            <button
              type="button"
              className="try-again-button"
              onClick={this.onClickTryAgain}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  //render home success view
  renderHomeSuccessView = () => {
    const {topRatedBooks} = this.state

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
      ],
    }

    return (
      <div className="home-failure-container">
        <h1 className="failure-heading">Find Your Next Favorite Books?</h1>
        <p className="failure-description">
          You are in the right place. Tell us what titles or genres you have
          enjoyed in the past, and we will give you surprisingly insightful
          recommendations.
        </p>
        <button className="find-books-button" onClick={this.onClickFindBooks}>
          Find Books
        </button>
        <div className="top-rated-books-container">
          <div className="books-button-container">
            <h1 className="top-rated-heading">Top Rated Books</h1>
            <button
              className="find-books-desktop-button"
              onClick={this.onClickFindBooks}
            >
              Find Books
            </button>
          </div>
          <ul className="slick-container">
            <Slider {...settings}>
              {topRatedBooks.map(book => {
                const {id, title, authorName, coverPic} = book
                return (
                  <li className="slick-item" key={id}>
                    <Link to={`/books/${id}`} className="link-item">
                      <img src={coverPic} className="cover-pic" />
                      <h1 className="book-title">{title}</h1>
                      <p className="book-author">{authorName}</p>
                    </Link>
                  </li>
                )
              })}
            </Slider>
          </ul>
        </div>
        <Footer />
      </div>
    )
  }
  renderHomeView = () => {
    const {topRatedBooksApiStatus} = this.state
    switch (topRatedBooksApiStatus) {
      case topRatedBooksApiConstants.success:
        return this.renderHomeSuccessView()
      case topRatedBooksApiConstants.failure:
        return this.renderHomeFailureView()
      case topRatedBooksApiConstants.inProgress:
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
      <div>
        <Header />
        <div className="home-container">{this.renderHomeView()}</div>
      </div>
    )
  }
}
export default Home
