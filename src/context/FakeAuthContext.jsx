import { createContext, useContext, useReducer } from 'react';

const FAKE_USER = {
  name: 'Florin',
  email: 'florin.camarut@student.usv.ro',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

const AuthContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'logout':
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error('Bad action into reducer function!');
  }
};
const initialState = {
  user: null,
  isAuthenticated: false,
};
const AuthProvider = ({ children }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const login = (email, password) => {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({
        type: 'login',
        payload: FAKE_USER,
      });
  };
  const logout = () => {
    dispatch({ type: 'logout' });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('Auth context used outside AuthProvider!');
  return context;
};
export { AuthProvider, useAuth };
