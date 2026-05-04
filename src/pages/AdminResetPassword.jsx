import { useState } from 'react';

export default function AdminResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setMessage('');

    const res = await fetch("http://localhost:6100/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token, newPassword })
    });

    const data = await res.json();

    if (data.error) {
      setError(data.error);
      return;
    }

    setMessage("Password updated successfully!");
  };

  return (
    <div>
      <h2>Admin Reset Password</h2>

      <input
        placeholder="Enter token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button onClick={handleSubmit}>Reset Password</button>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}