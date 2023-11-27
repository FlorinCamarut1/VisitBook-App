// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';

import styles from './Form.module.css';
import 'react-datepicker/dist/react-datepicker.css';

import { useURLPosition } from '../hooks/useURLPosition';
import Button from './Button';
import BackButton from './BackButton';
import Message from '../components/Message';
import Spinner from './Spinner';
import DatePicker from 'react-datepicker';
import { useCities } from '../context/CitiesContext';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useURLPosition();
  const navigate = useNavigate();
  const [isLoadingGeoCoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [emoji, setEmoji] = useState('');
  const [error, setError] = useState('');

  const { addCity, isLoading } = useCities();

  useEffect(() => {
    if (!lat && !lng) return;
    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true);
        setError('');
        const response = await fetch(
          `${BASE_URL}?latitude=${lat}&longitude=${lng}`
        );
        if (!response.ok) {
          throw new Error('Could not find data!');
        }
        const data = await response.json();
        if (!data.countryCode) {
          throw new Error('Could not find the city you clicked on!!');
        }
        setCountry(data.countryName);
        setCityName(data.city || data.locality || '');
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityName && !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await addCity(newCity);
    navigate('/app');
  };

  if (!lat && !lng)
    return <Message message='Start by clicking somewhere on the map!' />;
  if (isLoadingGeoCoding) return <Spinner />;
  if (error) return <Message message={error} />;

  return (
    <form
      className={`${isLoading ? styles.loading : ''} ${styles.form}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        <DatePicker
          id='date'
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat='dd/MM/yyyy'
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
