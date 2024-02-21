import {IoIosSearch} from 'react-icons/io'
import './index.css'

const FiltersGroup = props => {
  const {
    onSearchProduct,
    categoryOptions,
    ratingsList,
    clickCategory,
    clickRating,
    activeCategoryId,
    activeRatingId,
    searchInput,
    onClickFilter,
    onEnterSearchInput,
  } = props

  const onSearchInput = event => {
    onSearchProduct(event.target.value)
  }

  const onEnterInput = event => {
    if (event.key === 'Enter') {
      onEnterSearchInput()
    }
  }

  const onClickCategory = categoryId => {
    clickCategory(categoryId)
  }

  const onClickRating = ratingId => {
    clickRating(ratingId)
  }

  const clearFilter = () => {
    onClickFilter()
  }
  return (
    <div className="filters-group-container">
      <div className="search-input-container">
        <input
          type="search"
          value={searchInput}
          placeholder="search"
          className="searchInput"
          onChange={onSearchInput}
          onKeyDown={onEnterInput}
        />
        <IoIosSearch />
      </div>
      <h1 className="filter-heading"> Category </h1>
      <ul className="Category-menu">
        {categoryOptions.map(eachCategory => (
          <li
            className={`category-list ${
              activeCategoryId === eachCategory.categoryId
                ? 'active-category'
                : ' '
            }`}
            onClick={() => onClickCategory(eachCategory.categoryId)}
          >
            <p> {eachCategory.name} </p> 
          </li>
        ))}
      </ul>
      <h1 className="filter-heading"> Rating </h1>
      <ul className="rating-menu">
        {ratingsList.map(eachRating => (
          <li
            className="rating-list"
            onClick={() => onClickRating(eachRating.ratingId)}
          >
            <img
              src={eachRating.imageUrl}
              className="rating-star-image"
              alt={eachRating.ratingId}
            />
            <p
              className={`${
                activeRatingId === eachRating.ratingId ? 'active-rating' : ' '
              }`}
            >
              & Up
            </p>
          </li>
        ))}
      </ul>
      <button className="clear-filter-btn" onClick={clearFilter} type="button">
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
