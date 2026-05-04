import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormCard from '../components/FormCard';
import FormField from '../components/FormField';
import SubmitButton from '../components/SubmitButton';
import ErrorBox from '../components/ErrorBox';
import BackLink from '../components/BackLink';

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    city: '',
    state: '',
    roleName: 'customer',
    phone: '',
    password: ''
  });

  const [error, setError] = useState('');

  const set = (key) => (value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError('');

      //  validation
      if (
        !form.name ||
        !form.email ||
        !form.phone ||
        !form.city ||
        !form.state ||
        !form.password
      ) {
        setError('All fields required.');
        return;
      }

      if (form.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      //  API call
      await register(form);

      //  redirect
      nav('/login');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px'
      }}
    >
      <BackLink onClick={() => nav('/')} />

      <FormCard
        title="Join Our Cafe"
        subtitle="Create your account to start ordering"
      >
        <ErrorBox message={error} />

        <FormField
          label="Full Name"
          name="name"
          placeholder="John Doe"
          value={form.name}
          onChange={set('name')}
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={set('email')}
        />

        <FormField
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={form.phone}
          onChange={set('phone')}
        />

        {/*  ADDED (FIX) */}
        <FormField
          label="City"
          name="city"
          placeholder="Enter city"
          value={form.city}
          onChange={set('city')}
        />

        {/*  ADDED (FIX) */}
        <FormField
          label="State"
          name="state"
          placeholder="Enter state"
          value={form.state}
          onChange={set('state')}
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={form.password}
          onChange={set('password')}
        />

        <SubmitButton onClick={handleSubmit}>
          Create Account
        </SubmitButton>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          Already have an account?{' '}
          <span
            onClick={() => nav('/login')}
            style={{
              color: '#92400E',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Sign in
          </span>
        </div>
      </FormCard>
    </div>
  );
}