import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Redirect from 'react-router-dom/Redirect';
import withRouter from 'react-router-dom/withRouter';
import { createLoadProductCategories } from '../../actions';
import MainSpinner from '../../layout/mainSpinner';
import { ProductPropType } from '../../propTypes';
import PrivateRoute from '../../router/privateRoute';
import {
  createLoadCompleteProducts,
  createLoadProducers,
  createLoadSuppliers,
  createLoadTags,
} from '../adminActions';
import ProducerForm from '../producers/producerForm';
import ProductCategoryForm from '../productcategories/productCategoryForm';
import SupplierForm from '../suppliers/supplierForm';
import TagForm from '../tags/tagForm';
import ProductForm from './productForm';

const paths = [
  '/admin/forms/products',
  '/admin/forms/productcategories',
  '/admin/forms/suppliers',
  '/admin/forms/producers',
  '/admin/forms/tags',
];
const allowedRoles = ['admin'];

class Forms extends React.Component {
  componentWillMount() {
    this.props.loadProducts();
    this.props.loadProductCategories();
    this.props.loadProducers();
    this.props.loadSuppliers();
    this.props.loadTags();
  }

  render() {
    if (this.props.location.pathname.endsWith('/admin/forms')) {
      return (
        <Redirect to={{
          pathname: paths[0],
        }}
        />
      );
    }

    return [
      <Tabs
        key="tabBar"
        onChange={(event, path) => this.props.history.push(path)}
        value={paths.find(path => this.props.location.pathname.includes(path))}
        indicatorColor="primary"
        textColor="primary"
        scrollable
        scrollButtons="auto"
      >
        <Tab label="Products" value={paths[0]} />
        <Tab label="Product Categories" value={paths[1]} />
        <Tab label="Suppliers" value={paths[2]} />
        <Tab label="Producers" value={paths[3]} />
        <Tab label="Tags" value={paths[4]} />
      </Tabs>,
      this.props.products.length
        ? (
          <PrivateRoute
            key="containerProducts"
            path={`${paths[0]}/:id?`}
            allowedRoles={allowedRoles}
            component={ProductForm}
          />
        )
        : <MainSpinner key="productLoadingSpinner" />,
      <PrivateRoute
        key="containerProductCategories"
        path={paths[1]}
        allowedRoles={allowedRoles}
        component={ProductCategoryForm}
      />,
      <PrivateRoute
        key="containerSuppliers"
        path={paths[2]}
        allowedRoles={allowedRoles}
        component={SupplierForm}
      />,
      <PrivateRoute
        key="containerProducers"
        path={paths[3]}
        allowedRoles={allowedRoles}
        component={ProducerForm}
      />,
      <PrivateRoute
        key="containerTags"
        path={paths[4]}
        allowedRoles={allowedRoles}
        component={TagForm}
      />,
    ];
  }
}

Forms.propTypes = {
  loadProducts: PropTypes.func.isRequired,
  loadProductCategories: PropTypes.func.isRequired,
  loadProducers: PropTypes.func.isRequired,
  loadSuppliers: PropTypes.func.isRequired,
  loadTags: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(ProductPropType).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(
  state => state.forms,
  dispatch => ({
    loadProducts() {
      dispatch(createLoadCompleteProducts());
    },
    loadProductCategories() {
      dispatch(createLoadProductCategories());
    },
    loadProducers() {
      dispatch(createLoadProducers());
    },
    loadSuppliers() {
      dispatch(createLoadSuppliers());
    },
    loadTags() {
      dispatch(createLoadTags());
    },
  }),
)(withRouter(Forms));
