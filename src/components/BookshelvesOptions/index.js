import './index.css'

const BookshelvesOptions = props => {
  const {option, activeBookshelfName, changeBookShelfValue} = props
  const {id, value, label} = option
  console.log(activeBookshelfName)
  const activeBookshelfStyle = activeBookshelfName === value && 'active-shelf'
  const activeBookshelf = activeBookshelfName === value && 'active-shelf-value'
  const onClickBookshelf = () => {
    changeBookShelfValue(id)
  }
  return (
    <button
      type="button"
      className={`book-shelve-button ${activeBookshelfStyle}`}
      onClick={onClickBookshelf}
    >
      <li className={`book-shelve-option ${activeBookshelf}`}>{label}</li>
    </button>
  )
}

export default BookshelvesOptions
