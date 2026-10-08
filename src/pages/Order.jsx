import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { useDispatch, useSelector } from 'react-redux';
import { sendOrder } from '../redux/actions/order';
import { PaymentModal } from '../components';

function Order() {
  const dispatch = useDispatch();
  const { totalPrice, totalCount, items } = useSelector(({ cart }) => cart);
  const userDetails = useSelector((state) => state.verification);

  const [mapState, setMapState] = useState({
    center: [47.22360251653857, 39.719324054985094],
    zoom: 12,
  });
  const [placemark, setPlacemark] = useState(null);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState([null, null]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // При монтировании компонента устанавливаем данные из Redux
  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || '');
      setPhone(userDetails.phoneNumber || '');

      const addr = userDetails.address || '';
      setAddress(addr);

      if (addr) {
        // Обратное геокодирование адреса в координаты
        (async () => {
          try {
            const response = await fetch(
              `https://geocode-maps.yandex.ru/1.x/?apikey=d3676733-5e56-4077-ac7e-b33bed9bd9c4&geocode=${encodeURIComponent(addr)}&format=json`
            );
            const data = await response.json();
            const featureMember = data?.response?.GeoObjectCollection?.featureMember;
            if (featureMember && featureMember.length > 0) {
              const pos = featureMember[0].GeoObject.Point.pos.split(' ').map(Number);
              const coords = [pos[1], pos[0]]; // Поменять местами
              setCoordinates(coords);
              setPlacemark(coords);
              setMapState((prev) => ({ ...prev, center: coords }));
            }
          } catch (error) {
            console.error('Ошибка обратного геокодирования:', error);
          }
        })();
      }
    }
  }, [userDetails]);

  const handleMapClick = async (event) => {
    const coords = event.get('coords');

    try {
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=d3676733-5e56-4077-ac7e-b33bed9bd9c4&geocode=${coords[1]},${coords[0]}&format=json`
      );
      const data = await response.json();

      if (data && data.response && data.response.GeoObjectCollection.featureMember.length > 0) {
        const foundAddress = data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted;
        setAddress(foundAddress);
        setCoordinates(coords);
        setPlacemark(coords);
      } else {
        setAddress('Адрес не найден');
      }
    } catch (error) {
      setAddress('Ошибка при определении адреса');
      console.error(error);
    }
  };

  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value) {
      try {
        const response = await fetch(
          `https://geocode-maps.yandex.ru/1.x/?apikey=17832c8b-6141-48f8-8f39-7b51697f537a&geocode=${encodeURIComponent(value)}&format=json&results=5`
        );
        const data = await response.json();
        const suggestions = data.response.GeoObjectCollection.featureMember.map((feature) => ({
          address: feature.GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted,
          coords: feature.GeoObject.Point.pos.split(' ').map(Number).reverse(), // [широта, долгота]
        }));
        setSuggestions(suggestions);
      } catch (error) {
        console.error('Ошибка при получении подсказок:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.address);
    setCoordinates(suggestion.coords);
    setPlacemark(suggestion.coords);
    setMapState((prev) => ({ ...prev, center: suggestion.coords }));
    setSuggestions([]); // Убираем подсказки
  };

  const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

  const handleOrderSubmit = () => {
    const orderData = {
      recipientName: name,
      recipientPhone: phone,
      recipientAddress: address,
      products: items,
      totalQuantity: totalCount,
      totalPrice: totalPrice,
    };

    dispatch(sendOrder(orderData));
    openModal();
  };






  return (
    <div className="order-form">
      <h2 className="form-title">Оформление заказа</h2>
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Имя:
        </label>
        <input
          type="text"
          id="name"
          className="form-input"
          placeholder="Введите ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone" className="form-label">
          Номер телефона:
        </label>
        <input
          type="tel"
          id="phone"
          className="form-input"
          placeholder="Введите номер телефона"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <YMaps query={{ apikey: '17832c8b-6141-48f8-8f39-7b51697f537a' }}>
        <div className="form-group">
          <label htmlFor="address" className="form-label">
            Адрес доставки:
          </label>
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder="Введите адрес"
            className="form-input"
            required
          />
          {suggestions.length > 0 && (
            <ul className="map-suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.address}
                </li>
              ))}
            </ul>
          )}
          <Map
            state={mapState}
            onClick={handleMapClick}
            style={{ width: '100%', height: '400px' }}
          >
            {placemark && <Placemark geometry={placemark} />}
          </Map>

          <div className="button pay-btn" onClick={handleOrderSubmit}>
            <span>Перейти к оплате</span>
          </div>
        </div>
      </YMaps>
      <PaymentModal isOpen={isModalOpen} onRequestClose={closeModal} />
    </div>
  );
}

export default Order;
