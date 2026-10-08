import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails, saveUserDetails, userExit } from '../redux/actions/verification';
import { YMaps, Map, Placemark, ZoomControl, SearchControl } from '@pbe/react-yandex-maps';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.verification);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [placemark, setPlacemark] = useState(null);
  const [mapState, setMapState] = useState({
    center: [47.22360251653857, 39.719324054985094],
    zoom: 12,
  });
  const [suggestions, setSuggestions] = useState([]);

  // При загрузке компонента устанавливаем данные из Redux
  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || '');
      setEmail(userDetails.email || '');
      setPhone(userDetails.phoneNumber || '');
      const addr = userDetails.address || '';
      setAddress(addr);

      if (addr) {
        // Обратное геокодирование: получаем координаты по адресу
        (async () => {
          try {
            const response = await fetch(
              `https://geocode-maps.yandex.ru/1.x/?apikey=17832c8b-6141-48f8-8f39-7b51697f537a&geocode=${encodeURIComponent(addr)}&format=json`
            );
            const data = await response.json();
            const featureMember = data?.response?.GeoObjectCollection?.featureMember;
            if (featureMember && featureMember.length > 0) {
              const pos = featureMember[0].GeoObject.Point.pos.split(' ').map(Number);
              // Координаты в формате [долгота, широта], меняем местами на [широта, долгота]
              const coords = [pos[1], pos[0]];
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
      } else {
        setAddress('Адрес не найден');
      }
    } catch (error) {
      setAddress('Ошибка при определении адреса');
      console.error(error);
    }

    setPlacemark(coords);
  };

  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value) {
      try {
        const response = await fetch(
          `https://geocode-maps.yandex.ru/1.x/?apikey=d3676733-5e56-4077-ac7e-b33bed9bd9c4&geocode=${encodeURIComponent(value)}&format=json&results=5`
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
    setPlacemark(suggestion.coords);
    setMapState((prev) => ({ ...prev, center: suggestion.coords }));

    // Обновляем адрес в Redux
    dispatch(setUserDetails({ name, email, phoneNumber: phone, address: suggestion.address }));
    setSuggestions([]); // Убираем подсказки
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      await dispatch(saveUserDetails({ name, email, phoneNumber: phone, address }));
      alert('Данные обновлены!')
    };

  const navigate = useNavigate()
  const handleUserExit = () => {
    const confirmExit = window.confirm("Вы уверены, что хотите выйти из аккаунта?");
    if (confirmExit) {
        dispatch(userExit());
        navigate ('/')
    }
};

  return (
    <div className="profile-container">
      <h1 className="profile-title">Личный кабинет
        <button type="button" onClick={handleUserExit} className="exit-button">
          Выйти
        </button>
      </h1>
      
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Имя</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Номер телефона</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address" className="form-label">
            Адрес доставки:
          </label>
          <input
            type="text"
            id="address"
            name="address"
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
        </div>
        <YMaps query={{ apikey: '17832c8b-6141-48f8-8f39-7b51697f537a' }}>
          <Map
            state={mapState}
            style={{ width: '100%', height: '500px' }}
            onClick={handleMapClick}
          >
            <ZoomControl />
            {placemark && (
              <Placemark
                geometry={placemark}
                properties={{
                  balloonContent: `Адрес: ${address}`,
                }}
              />
            )}
          </Map>
        </YMaps>
        <button type="submit" className="submit-button">
          Сохранить
        </button>
        
      </form>
    </div>
  );
};

export default Profile;
