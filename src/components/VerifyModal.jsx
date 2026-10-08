import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { setUserDetails, saveUserDetails, sendVerificationCode, verifyCode, setVerificationCode, fetchUserData } from '../redux/actions/verification';
import { useState, useEffect } from 'react';

Modal.setAppElement('#root');

const VerifyModal = ({ isOpen, onRequestClose }) => {
  const dispatch = useDispatch();
  const verifyState = useSelector((state) => state.verification || {});
  const {
    email = '',
    verificationCode = '',
    isCodeSent = false,
    verificationConfirm = false,
    name = '',
    phoneNumber = '',
    address = '',
    isUserExist = null, // предполагаем, что это поле есть в состоянии
  } = verifyState;

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showUserDetailsForm, setShowUserDetailsForm] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);

useEffect(() => {
    // Если подтверждение прошло и данные пользователя загружены
    if (verificationConfirm && userDataLoaded) {
      if (isUserExist === false) {
        setShowUserDetailsForm(true);
      } else if (isUserExist === true) {
        onRequestClose(); // Закрываем модальное окно, если пользователь найден
      }
    } else {
      setShowUserDetailsForm(false);
    }
  }, [verificationConfirm, userDataLoaded, isUserExist, onRequestClose]);

const handleVerifyCode = async () => {
  try {
    await dispatch(verifyCode(email, verificationCode));
    await dispatch(fetchUserData(email));
    setUserDataLoaded(true); // Устанавливаем состояние, что данные пользователя загружены
  } catch (error) {
    setUserDataLoaded(false); // Сбрасываем состояние в случае ошибки
  }
};


  const handleSendCode = (e) => {
    e.preventDefault();
    if (email) {
      dispatch(sendVerificationCode(email));
    } else {
      alert('Пожалуйста, введите email.');
    }
  };

  const handleAddressChange = async (e) => {
    const inputValue = e.target.value;
    dispatch(setUserDetails({ ...verifyState, address: inputValue }));

    if (inputValue) {
      try {
        const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=17832c8b-6141-48f8-8f39-7b51697f537a&geocode=${encodeURIComponent(inputValue)}&format=json`);
        const data = await response.json();

        if (
          data?.response?.GeoObjectCollection?.featureMember &&
          data.response.GeoObjectCollection.featureMember.length > 0
        ) {
          const suggestions = data.response.GeoObjectCollection.featureMember.map(
            (item) =>
              item.GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted
          );
          setAddressSuggestions(suggestions);
        } else {
          setAddressSuggestions([]);
        }
      } catch (error) {
        console.error('Ошибка получения адресов:', error);
        setAddressSuggestions([]);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleSelectAddress = (selectedAddress) => {
    dispatch(setUserDetails({ ...verifyState, address: selectedAddress }));
    setAddressSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(saveUserDetails({ name, email, phoneNumber, address }));
    console.log({ name, email, phoneNumber, address });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Phone Registration"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      {verificationConfirm && showUserDetailsForm  ? (
          
            <>
            <div className='model-container'>
            <h2 className='text'>Укажите ваше имя, номер телефона и адрес</h2>
            <span onClick={onRequestClose} className="close-button">X</span>
          </div>
              <div className='container'>
                <input
                  className="input"
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => dispatch(setUserDetails({ ...verifyState, name: e.target.value }))}
                  placeholder="Введите ваше имя"
                  required
                />
              </div>
              <div className='container'>
                <input
                  className="input"
                  type="tel"
                  id="phone"
                  name="phone"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => dispatch(setUserDetails({ ...verifyState, phoneNumber: e.target.value }))}
                  placeholder="Введите номер телефона"
                  required
                />
              </div>
              <div className='container'>
                <input
                  className="input"
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Введите адрес"
                  required
                />
                {addressSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {addressSuggestions.slice(0, 2).map((suggestion, index) => (
                      <li key={index} onClick={() => handleSelectAddress(suggestion)}>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  className="accept-button"
                  type="button"
                  onClick={handleSubmit}
                >
                  Подтвердить
                </button>
              </div>
            </>

          
        
      ) : (
        <div>
          <div className='model-container'>
            <h2 className='text'>Введите ваш email, чтобы авторизоваться или зарегистрироваться</h2>
            <span onClick={onRequestClose} className="close-button">X</span>
          </div>
          <div className='container'>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => dispatch(setUserDetails({ ...verifyState, email: e.target.value }))}
              placeholder="Введите email"
              required
            />
          </div>
          {isCodeSent && (
            <div className='container'>
              <input
                className="input"
                type="text"
                value={verificationCode}
                onChange={(e) => dispatch(setVerificationCode(e.target.value.trim()))}
                placeholder="Введите 6-значный код подтверждения, отправленный вам на почту"
                required
              />
            </div>
          )}
          <div className='container'>
            <button
              onClick={isCodeSent ? handleVerifyCode : handleSendCode}
              className="accept-button"
              type="button"
            >
              Подтвердить
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default VerifyModal;
