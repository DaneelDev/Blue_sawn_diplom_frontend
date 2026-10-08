const initialState = {
  cardType: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
};

const payment = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_PAYMENT_DATA':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default payment;