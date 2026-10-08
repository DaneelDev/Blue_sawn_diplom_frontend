const initialState = {
    loading: false,
    order: null,
    error: null,
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SEND_ORDER_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'SEND_ORDER_SUCCESS':
            return {
                ...state,
                loading: false,
                order: action.payload,
                error: null,
            };
        case 'SEND_ORDER_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default orderReducer;
