import { useState } from 'react';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    const res = await fetch("http://localhost:6100/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    setToken(data.token);
  };

  return (
    <div>
      <h2>Admin Forgot Password</h2>

      <input
        placeholder="Enter admin email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit}>Generate Token</button>

      {error && <p>{error}</p>}

      {token && (
        <div>
          <p>Your reset token:</p>
          <b>{token}</b>
        </div>
      )}
    </div>
  );
}