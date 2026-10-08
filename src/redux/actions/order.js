import axios from 'axios';

// Действия больше не используют константы
export const sendOrder = (orderData) => async (dispatch) => {
    try {
        const response = await axios.post('http://localhost:3001/orders', orderData);
        dispatch({ type: 'ORDER_SENT', payload: response.data }); // Обновление состояния в Redux
    } catch (error) {
        console.error('Error sending order:', error);
        dispatch({ type: 'ORDER_ERROR', payload: error });
    }
};
