import {combineReducers} from 'redux'

import filters from './filters';
import products from './products';
import cart from './cart';
import order from './order';
import verification from './verification';
import payment from './payment';

const rootReducer = combineReducers({
    filters, 
    products,
    cart,
    order,
    verification,
    payment
})

export default rootReducer