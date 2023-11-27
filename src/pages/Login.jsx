import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/FakeAuthContext';
import { useEffect, useState } from 'react';
import styles from './Login.module.css';
import PageNav from '../components/PageNav';
import Button from '../components/Button';

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState('florin.camarut@student.usv.ro');
  const [password, setPassword] = useState('qwerty');
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/app', { replace: true });
  }, [navigate, isAuthenticated]);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (email && password) login(email, password);
  };
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={formSubmitHandler}>
        <div className={styles.row}>
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            id='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type='primary'>Login</Button>
        </div>
      </form>
    </main>
  );
}
