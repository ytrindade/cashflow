import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import api from '../../services/api';
import { setAuthSession } from '../../services/authSession';
import { getApiErrorMessages } from '../../utils/apiErrors';
import { normalizeEmail } from '../../utils/formatters';
import { isValidEmail } from '../../utils/validators';

export default function Login() {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleEmailChange = (e) => {
        const email = e.target.value;
        const newCredentials = { ...credentials, email };
        setCredentials(newCredentials);
        validateForm(newCredentials);
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        const newCredentials = { ...credentials, password };
        setCredentials(newCredentials);
        validateForm(newCredentials);
    };

    const validateForm = (creds) => {
        const isValid = isValidEmail(creds.email) && creds.password.length > 0;
        setIsFormValid(isValid);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError([]);

        try {
            const response = await api.post('cashFlow/Login', {
                email: normalizeEmail(credentials.email),
                password: credentials.password
            });
            setAuthSession({
                name: response.data.name,
                token: response.data.token
            });

            navigate('/expenses');

        } catch (err) {
            setError(getApiErrorMessages(err, 'Erro ao fazer login. Tente novamente.'));
            console.error(err);
        }
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div style={{ backgroundColor: theme.bgPrimary, color: theme.textPrimary }} className="min-h-screen w-full flex flex-col">

            <header className="w-full py-6">
                <h1 style={{ color: theme.textPrimary }} className="font-bold text-center text-2xl">
                    Gerenciador de despesas
                </h1>
            </header>

            {/* CONTEÚDO CENTRAL */}
            <main className="flex flex-1 justify-center items-center p-4">
                <div style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }} className="w-full max-w-sm p-8 rounded-lg shadow-2xl flex flex-col gap-6">
                    <h2 style={{ color: theme.primary }} className="text-center text-2xl font-bold">Login</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="flex flex-col text-sm">
                            Email
                            <input
                                type="email"
                                value={credentials.email}
                                onChange={handleEmailChange}
                                required
                                style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                                className="h-10 px-3 mt-1 border rounded focus:outline-none"
                                onFocus={(e) => e.target.style.borderColor = theme.primary}
                                onBlur={(e) => e.target.style.borderColor = theme.borderColor}
                                placeholder="seu@email.com"
                            />
                        </label>

                        <label className="flex flex-col text-sm">
                            Senha
                            <div className="relative mt-1">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={credentials.password}
                                    onChange={handlePasswordChange}
                                    required
                                    style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                                    className="h-10 w-full px-3 pr-10 border rounded focus:outline-none"
                                    onFocus={(e) => e.target.style.borderColor = theme.primary}
                                    onBlur={(e) => e.target.style.borderColor = theme.borderColor}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                    style={{ color: theme.textPrimary }}
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                    title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    <span className="material-symbols-outlined block leading-none" style={{ fontSize: '20px' }}>
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </label>

                        <button
                            type="submit"
                            disabled={!isFormValid}
                            style={{ backgroundColor: theme.primary}}
                            onMouseEnter={(e) => e.target.style.backgroundColor = theme.primaryHover}
                            onMouseLeave={(e) => e.target.style.backgroundColor = theme.primary}
                            className="h-11 mt-2 rounded font-semibold transition disabled:opacity-60 text-white cursor-pointer disabled:cursor-default"
                        >
                            Entrar
                        </button>
                    </form>

                    {error.length > 0 && (
                        <ul className="text-sm m-0 pl-5 list-disc" style={{ color: theme.errorText }}>
                            {error.map((msg, idx) => (
                                <li key={idx}>{msg}</li>
                            ))}
                        </ul>
                    )}

                    <div className="text-center">
                        <a
                            onClick={goToRegister}
                            style={{ color: theme.primary }}
                            className="text-sm underline cursor-pointer"
                            onMouseEnter={(e) => e.target.style.color = theme.primaryHover}
                            onMouseLeave={(e) => e.target.style.color = theme.primary}
                        >
                            Criar conta
                        </a>
                    </div>

                </div>
            </main>
        </div>
    );
}