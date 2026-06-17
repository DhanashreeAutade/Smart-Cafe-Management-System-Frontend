import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormCard from '../components/FormCard';
import FormField from '../components/FormField';
import SubmitButton from '../components/SubmitButton';
import ErrorBox from '../components/ErrorBox';
import BackLink from '../components/BackLink';

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
  }, []);

  const handleSubmit = async () => {
    try {
      setError('');

      const res = await login(email, password);

      if (!res.ok) {
        setError(res.error);
        return;
      }

      //  get role directly from response
      if (res.user?.roleName === "admin") {
        nav('/admin');
      } else {
        nav('/menu');
      }

    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
      <BackLink onClick={() => nav('/')} />
      <FormCard title="Welcome Back" subtitle="Sign in to order your favorites">
        <ErrorBox message={error} />

        <FormField
          label="Email"
          icon="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="off"
        />

        <FormField
          label="Password"
          icon="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="new-password"
        />

        {/*  ADD THIS BLOCK HERE */}
        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <span
            onClick={() => nav('/reset-password')}
            style={{ color: '#92400E', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}
          >
            Forgot Password?
          </span>
        </div>

        <SubmitButton onClick={handleSubmit}>Sign In</SubmitButton>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          Don't have an account?{' '}
          <span onClick={() => nav('/register')} style={{ cursor: 'pointer' }}>
            Create one
          </span>
        </div>
      </FormCard>
    </div>
  );
}