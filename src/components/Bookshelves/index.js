import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {BsSearch} from 'react-icons/bs'

import './index.css'

import Header from '../Header'
import Footer from '../Footer'
import BookshelvesOptions from '../BookshelvesOptions'
import BookItem from '../BookItem'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d05-4fba-8191-5122175b154e',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: '361d5fd4-9ea1-4e0c-bd47-da2682a5b7c8',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

const booksApiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}
class Bookshelves extends Component {
  state = {
    activeBookshelfName: bookshelvesList[0].value,
    searchText: '',
    booksArray: [],
    booksApiStatus: booksApiConstants.initial,
  }
  componentDidMount() {
    this.getBooks()
  }

  //on click try again
  onClickTryAgain = () => {
    this.getBooks()
  }
  //  get books api
  getBooks = async () => {
    this.setState({booksApiStatus: booksApiConstants.inProgress})
    const {searchText, activeBookshelfName} = this.state
    const booksApi = `https://apis.ccbp.in/book-hub/books?shelf=${activeBookshelfName}&search=${searchText}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(booksApi, options)
    const fetchedData = await response.json()
    if (response.ok) {
      const books = fetchedData.books.map(book => ({
        id: book.id,
        title: book.title,
        rating: book.rating,
        authorName: book.author_name,
        coverPic: book.cover_pic,
        readStatus: book.read_status,
      }))
      this.setState({
        booksApiStatus: booksApiConstants.success,
        booksArray: books,
      })
    } else {
      this.setState({booksApiStatus: booksApiConstants.failure})
    }
  }

  //on Enter key
  onKeyDownEnter = event => {
    if (event.key === 'Enter') {
      this.getBooks()
    }
  }
  //change search input
  onChangeSearch = event => {
    this.setState({searchText: event.target.value})
  }
  //on click search
  onClickSearch = () => {
    this.getBooks()
  }
  //change active book shelf option
  changeBookShelfValue = id => {
    const {booksArray} = this.state
    const activeBookshelf = bookshelvesList.find(value => value.id === id)
    const activeBookshelfValue = activeBookshelf.value
    const filteredBooks = booksArray.filter(
      book => book.readStatus === activeBookshelf.label,
    )
    this.setState(
      {activeBookshelfName: activeBookshelfValue, booksArray: filteredBooks},
      this.getBooks,
    )
  }
  //render books failure view

  renderBooksFailureView = () => {
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
          onClick={this.onClickTryAgain}
        >
          Try Again
        </button>
      </div>
    )
  }
  // no books view
  renderNoBooksView = () => {
    console.log('NO BOOKSVIEW')
    const {searchText} = this.state
    return (
      <div className="no-books-container">
        <img
          src="https://res.cloudinary.com/dj7lfkwta/image/upload/v1723285481/Asset_1_1_ypnkul.png"
          alt="no books"
        />
        <p className="no-books-description">
          Your search for {searchText} did not find any matches.
        </p>
      </div>
    )
  }

  //render bookds
  renderBooks = () => {
    const {booksArray, searchText, activeBookshelfName} = this.state

    return (
      <div className="books-footer-container">
        <ul className="books-list-contianer">
          {booksArray.map(book => (
            <BookItem book={book} key={book.id} />
          ))}
        </ul>
        <Footer />
      </div>
    )
  }
  //render books success view
  renderBooksSuccessView = () => {
    const {booksArray, searchText, activeBookshelfName} = this.state

    const activeShelf = bookshelvesList.find(
      book => book.value === activeBookshelfName,
    )
    const activeBookState = activeShelf.label
    return (
      <div className="books-view">
        <div className="search-container-desktop-view">
          <h1 className="book-status">{activeBookState} Books</h1>
          <div className="search-desktop-container">
            <input
              type="search"
              placeholder="Search"
              className="input-search"
              value={searchText}
              onChange={this.onChangeSearch}
              onKeyDown={this.onKeyDownEnter}
            />
            <button
              className="search-icon-button"
              onClick={this.onClickSearch}
              testid="searchButton"
            >
              <BsSearch className="search-icon" size={10} />
            </button>
          </div>
        </div>
        {booksArray.length === 0
          ? this.renderNoBooksView()
          : this.renderBooks()}
      </div>
    )
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
  renderBooksView = () => {
    const {booksApiStatus} = this.state
    switch (booksApiStatus) {
      case booksApiConstants.success:
        return this.renderBooksSuccessView()
      case booksApiConstants.failure:
        return this.renderBooksFailureView()
      case booksApiConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  render() {
    const {activeBookshelfName, searchText} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div className="books-shelves-contianer">
        <Header />
        <div className="shelves-books-container">
          <div className="search-container">
            <input
              type="search"
              placeholder="Search"
              className="input-search"
              value={searchText}
              onKeyDown={this.onKeyDownEnter}
              onChange={this.onChangeSearch}
            />
            <button
              className="search-icon-button"
              onClick={this.onClickSearch}
              testid="searchButton"
            >
              <BsSearch className="search-icon" size={10} />
            </button>
          </div>
          <div className="book-shelves-container">
            <h1 className="book-shelves-heading">Bookshelves</h1>
            <ul className="book-shelves-options-list">
              {bookshelvesList.map(option => (
                <BookshelvesOptions
                  option={option}
                  key={option.value}
                  activeBookshelfName={activeBookshelfName}
                  changeBookShelfValue={this.changeBookShelfValue}
                />
              ))}
            </ul>
          </div>
          {this.renderBooksView()}
        </div>
      </div>
    )
  }
}

export default Bookshelves
