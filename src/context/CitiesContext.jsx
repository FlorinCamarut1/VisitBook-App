import { createContext, useContext, useEffect, useReducer } from 'react';

const BASE_URL = 'http://localhost:9000';

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'city/current':
      return { ...state, cities: action.payload };
    case 'city/created':
      return {
        ...state,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        cities: state.cities.filter((city) => action.payload !== city.id),
        currentCity: action.payload,
      };
    case 'loading':
      return { ...state, isLoading: action.payload };
    case 'curCity':
      return { ...state, currentCity: action.payload };
    default:
      return new Error('Reducer error ocurred!');
  }
};

const CitiesContext = createContext();
const CitiesProvider = ({ children }) => {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: 'loading', payload: true });
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        dispatch({ type: 'city/current', payload: data });
      } catch {
        alert('There was an error loading data...');
      } finally {
        dispatch({ type: 'loading', payload: false });
      }
    }
    fetchCities();
  }, []);

  const getCity = async (id) => {
    if (Number(id) === currentCity.id) return;
    try {
      dispatch({ type: 'loading', payload: true });
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await response.json();
      dispatch({ type: 'curCity', payload: data });
    } catch {
      alert('There was an error loading cities...');
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  };
  const addCity = async (newCity) => {
    try {
      dispatch({ type: 'loading', payload: true });
      const response = await fetch(`${BASE_URL}/cities/`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      dispatch({ type: 'city/created', payload: data });
    } catch {
      alert('There was an error creating city...');
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  };
  const deleteCity = async (id) => {
    try {
      dispatch({ type: 'loading', payload: true });
      const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/deleted', payload: id });
    } catch {
      alert('Cannot delete the city...');
    } finally {
      dispatch({ type: 'loading', payload: false });
    }
  };

  return (
    <CitiesContext.Provider
      value={{ cities, isLoading, currentCity, getCity, addCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = () => {
  const value = useContext(CitiesContext);
  if (value === undefined)
    throw new Error('Cities Context was used outside cities provider!');
  return value;
};

export { CitiesProvider, useCities };
