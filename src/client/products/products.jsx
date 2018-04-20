import PropTypes from 'prop-types';
import queryString from 'query-string';
import React from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { change } from 'redux-form';
import {
  createLoadProductCategories,
  createLoadProducts,
  createLoadPublicProducers,
  createSetFilter,
} from '../actions';
import MainSpinner from '../layout/mainSpinner.jsx';
import ProductList from '../products/productList.jsx';
import { ProducerPropType, ProductCategoryPropType, ProductPropType } from '../propTypes';
import NothingFound from './nothingFound.jsx';
import ProductFilter, { formName } from './productFilter.jsx';

class Products extends React.Component {
  componentWillMount() {
    if (!this.props.products.length) {
      this.props.loadProducts();
    }

    if (!this.props.producers.length) {
      this.props.loadProducers();
    }

    if (!this.props.productCategories.length) {
      this.props.loadProductCategories();
    }

    const query = queryString.parse(this.props.location.search);
    if (query && query.search) {
      this.props.updateForm(query.search);
    }

    this.updateFilter(
      this.props.location.search,
      this.props.productCategories,
      this.props.producers
    );
  }

  componentWillUpdate(nextProps) {
    if (this.props.location.search !== nextProps.location.search
      || this.props.productCategories.length !== nextProps.productCategories.length
      || this.props.producers.length !== nextProps.producers.length
    ) {
      this.updateFilter(
        nextProps.location.search,
        nextProps.productCategories,
        nextProps.producers
      );
    }

    if (this.props.filterString && !nextProps.filterString) {
      this.props.updateForm('');
    }
  }

  updateFilter(locationSearch, productCategories, producers) {
    const query = queryString.parse(locationSearch);
    if ((query.categories || query.producers || query.search)
      && productCategories.length && producers.length) {
      const categories = query.categories ? query.categories.split(',') : [];
      const queryProducers = query.producers ? query.producers.split(',') : [];

      this.props.setFilter(
        productCategories.filter(category => categories.includes(category._id)),
        producers.filter(producer => queryProducers.includes(producer._id)),
        query.search
      );
    } else {
      this.props.setFilter();
    }
  }

  render() {
    const {
      products,
      filteredProducts,
      filterShown,
      intl,
      categoriesToFilter,
      filterString,
    } = this.props;

    return (
      <div>
        <Helmet>
          <title>
            {intl.formatMessage(
              { id: 'PRODUCTS.TITLE' },
              {
                searchTerm: filterString ? `${filterString} | ` : '',
                categoryCount: categoriesToFilter.length,
                categories: categoriesToFilter.map(category => category.de.name).join(', '),
              }
            )}
          </title>
        </Helmet>
        <ProductFilter />
        {
          products.length
            ? filteredProducts.length
            ? <ProductList products={filteredProducts} filterShown={filterShown} />
            : <NothingFound />
            : <MainSpinner />
        }
      </div>
    );
  }
}

Products.propTypes = {
  products: PropTypes.arrayOf(ProductPropType).isRequired,
  loadProducts: PropTypes.func.isRequired,
  loadProducers: PropTypes.func.isRequired,
  loadProductCategories: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  productCategories: PropTypes.arrayOf(ProductCategoryPropType).isRequired,
  producers: PropTypes.arrayOf(ProducerPropType).isRequired,
  categoriesToFilter: PropTypes.arrayOf(ProductCategoryPropType).isRequired,
  filteredProducts: PropTypes.arrayOf(ProductPropType).isRequired,
  filterShown: PropTypes.bool.isRequired,
  filterString: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(
  state => ({
    products: state.products.products,
    productCategories: state.products.productCategories,
    producers: state.products.producers,
    filteredProducts: state.products.filteredProducts,
    filterShown: state.products.filterShown,
    categoriesToFilter: state.products.categoriesToFilter,
    filterString: state.products.filterString,
  }),
  dispatch => ({
    loadProducts() {
      dispatch(createLoadProducts());
    },
    loadProducers() {
      dispatch(createLoadPublicProducers());
    },
    loadProductCategories() {
      dispatch(createLoadProductCategories());
    },
    updateForm(filterString) {
      dispatch(change(formName, 'search', filterString));
    },
    setFilter(productCategories, producers, filterString) {
      dispatch(createSetFilter({
        productCategories,
        producers,
        filterString,
      }));
    },
  }),
)(withRouter(injectIntl(Products)));
