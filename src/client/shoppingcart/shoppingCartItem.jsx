import React from 'react';
import PropTypes from 'prop-types';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import { pinkA400, transparent } from 'material-ui/styles/colors';
import { ShoppingCartItemPropType } from './shoppingCart.proptypes';
import { formatPriceWithoutCurrency } from '../products/priceFormatter';
import AmountAdjuster from './amountAdjuster.jsx';

const styles = {
  avatar: {
    objectFit: 'cover',
  },
};

const ShoppingCartItem = ({
  shoppingCartItem,
  setAmount,
  locale,
}) => (
  <ListItem
    primaryText={shoppingCartItem.product[locale].name}
    secondaryText={<AmountAdjuster shoppingCartItem={shoppingCartItem} setAmount={setAmount} />}
    leftAvatar={<Avatar
      style={styles.avatar}
      src={`/api/products/pictures/${shoppingCartItem.product.files[0]}_s`}
    />}
    rightAvatar={
      <Avatar
        color={pinkA400}
        backgroundColor={transparent}
      >
        {formatPriceWithoutCurrency(shoppingCartItem.product.price * shoppingCartItem.amount)}
      </Avatar>
    }
  />
);

ShoppingCartItem.propTypes = {
  shoppingCartItem: ShoppingCartItemPropType.isRequired,
  setAmount: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

export default ShoppingCartItem;
