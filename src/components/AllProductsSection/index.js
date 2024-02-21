import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiConstrant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class AllProductsSection extends Component {
  state = {
    apiStatus: apiConstrant.initial,
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    activeCategoryId: '',
    activeRatingId: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({apiStatus: apiConstrant.loading})
    const jwtToken = Cookies.get('jwt_token')

    const {activeOptionId, activeCategoryId, activeRatingId, searchInput} =
      this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&rating=${activeRatingId}&title_search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiConstrant.success,
      })
    }
    if (response.status === 401) {
      this.setState({apiStatus: apiConstrant.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onSearchProduct = searchInput => {
    this.setState({searchInput})
  }

  onEnterSearchInput = () => {
    this.getProducts()
  }

  clickCategory = categoryId => {
    this.setState({activeCategoryId: categoryId}, this.getProducts)
  }

  clickRating = ratingId => {
    this.setState(
      {
        activeRatingId: ratingId,
      },
      this.getProducts,
    )
  }

  onClickFilter = () => {
    this.setState(
      {searchInput: '', activeCategoryId: '', activeRatingId: ''},
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        {productsList.length === 0 ? (
          <div className="no-product-image">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
              alt="no products"
            />
            <h1> No Products Found </h1>
            <p> We could not find any products. Try others filters. </p>
          </div>
        ) : (
          <ul className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="no-product-image">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1> Oops! Something went Wrong </h1>
      <p>
        {' '}
        We are having some trouble processing your request Please try again.{' '}
      </p>
    </div>
  )

  apiResult = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstrant.success:
        return this.renderProductsList()
      case apiConstrant.failure:
        return this.renderFailure()
      case apiConstrant.loading:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId, activeRatingId, searchInput} = this.state
    return (
      <div className="all-products-section">
        <FiltersGroup
          onSearchProduct={this.onSearchProduct}
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          clickCategory={this.clickCategory}
          clickRating={this.clickRating}
          onClickFilter={this.onClickFilter}
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          searchInput={searchInput}
          onEnterSearchInput={this.onEnterSearchInput}
        />
        {this.apiResult()}
      </div>
    )
  }
}

export default AllProductsSection
