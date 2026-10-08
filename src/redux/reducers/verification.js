// Начальное состояние
const initialState = {
  name: '',
  email: '',
  phoneNumber: '', 
  address: '', 
  verificationCode: '',
  isCodeSent: false,
  verificationConfirm: false,
  isUserExist: false,
  loading: false,
  error: null
};

export const verifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_DETAILS':
      return { 
        ...state, 
        name: action.payload.name,
        email: action.payload.email,
        phoneNumber: action.payload.phoneNumber,
        address: action.payload.address,
      };
    case 'SET_USER_DETAILS_LOADING':
      return {
        ...state,
        loading: true,
        error: null, // Сбрасываем ошибку при начале загрузки
      };
    case 'SET_USER_DETAILS_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
      };
    case 'SET_USER_DETAILS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'SET_VERIFICATION_CODE':
      return { 
        ...state, 
        verificationCode: action.payload 
      };
    case 'SET_CODE_SENT':
      return { 
        ...state, 
        isCodeSent: action.payload 
      };
    case 'SET_VERIFICATION_CONFIRM':
      return { 
        ...state, 
        verificationConfirm: action.payload 
      };
    case 'SET_USER_EXISTENCE': // обработка нового действия
      return {
        ...state,
        isUserExist: action.payload,
      };
    case 'USER_EXIT':
      return {
        initialState
      };
    

    default:
      return state;
  }
};

export default verifyReducer;
