import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { savePaymentData } from '../redux/actions/payment';

const PaymentModal = ({ isOpen, onRequestClose }) => {
  const dispatch = useDispatch();

  const [cardType, setCardType] = useState('visa');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Функция для проверки валидности срока в формате MM/YY
  const isValidExpiryDate = (date) => {
    if (!/^\d{2}\/\d{2}$/.test(date)) return false;
    const [monthStr, yearStr] = date.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    if (month < 1 || month > 12) return false;

    // Дополнительно можно проверять, что срок не истек
    const currentYear = new Date().getFullYear() % 100; // последние 2 цифры года
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  // Проверяем валидность всех полей
  const isFormValid = () => {
    const cardNumberDigits = cardNumber.replace(/\s/g, '');
    return (
      cardType &&
      cardNumberDigits.length === 16 &&
      isValidExpiryDate(expiryDate) &&
      cvv.length === 3
    );
  };

  const handleConfirm = () => {
    if (!isFormValid()) {
      alert('Пожалуйста, заполните все поля корректно');
      return;
    }

    dispatch(savePaymentData({
      cardType,
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryDate,
      cvv,
    }));

    alert('Заказ поступил в обработку!')
    onRequestClose()
  };

  return (
    <Modal isOpen={isOpen} contentLabel="Phone Registration" style={
        {
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
      }
    }>
      <div className="form-group">
        <div className='model-container'>
          <h2 className='text'>Введите данные для оплаты</h2>
        </div>

        <div style={{
          marginTop: 10,
          padding: 10,
          border: '1px solid #ccc',
          maxWidth: 300
        }}>
          <label>
            Тип карты:
            <select
              value={cardType}
              onChange={e => setCardType(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 6, marginTop: 4, marginBottom: 10 }}
            >
              <option value="visa">Visa</option>
              <option value="mastercard">MasterCard</option>
            </select>
          </label>

          <label>
            Номер карты:
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              maxLength={19}
              onChange={e => setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16).replace(/(.{4})/g, '\$1 ').trim())}
              style={{ display: 'block', width: '100%', padding: 6, marginTop: 4, marginBottom: 10 }}
            />
          </label>

          <label>
            Срок действия:
            <input
              type="text"
              placeholder="MM/YY"
              value={expiryDate}
              maxLength={5}
              onChange={e => setExpiryDate(e.target.value.replace(/[^0-9/]/g, '').slice(0, 5))}
              style={{ display: 'block', width: '100%', padding: 6, marginTop: 4, marginBottom: 10 }}
            />
          </label>

          <label>
            Код безопасности (CVV):
            <input
              type="text"
              placeholder="123"
              value={cvv}
              maxLength={3}
              onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
              style={{ display: 'block', width: '100%', padding: 6, marginTop: 4 }}
            />
          </label>
        </div>
      </div>

      <div className='container'>
        <button
          className="accept-button"
          type="button"
          disabled={!isFormValid()}
          onClick={handleConfirm}
        >
          Подтвердить
        </button>
      </div>
    </Modal>
  );
};

export default PaymentModal;
