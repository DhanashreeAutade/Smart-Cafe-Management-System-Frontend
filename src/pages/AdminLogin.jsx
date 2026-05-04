import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormCard from '../components/FormCard';
import FormField from '../components/FormField';
import SubmitButton from '../components/SubmitButton';
import ErrorBox from '../components/ErrorBox';
import BackLink from '../components/BackLink';

export default function AdminLogin() {
    const nav = useNavigate();
    const { login, isAdmin } = useAuth();
    const [email, setEmail] = useState('admin@cafe.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleSubmit = async () => {
        setError('');

        const res = await login(email, password);

        if (!res.ok) {
            setError(res.error);
            return;
        }
        if (res.user.roleName !== "admin") {
            setError("Not an admin account");
            return;
        }

        nav('/admin');
    };
    return (
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
            <BackLink onClick={() => nav('/')} />
            <FormCard title="Admin Portal" subtitle="Manage your cafe">
                <ErrorBox message={error} />
                <FormField label="Email" icon="email" placeholder="admin@cafe.com" value={email} onChange={setEmail} type="email" autoComplete="email" />
                <FormField label="Password" icon="password" placeholder="••••••••" value={password} onChange={setPassword} type="password" autoComplete="current-password" />
                <SubmitButton onClick={handleSubmit}>Access Admin Panel</SubmitButton>
            </FormCard>
        </div>
    );
}
