import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { getApiErrorMessages } from '../../utils/apiErrors';
import { normalizeEmail } from '../../utils/formatters';
import { isNonEmpty, isValidEmail } from '../../utils/validators';
import { createUser } from '../../services/userService';

export default function Register() {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        const newForm = { ...form, [field]: value };
        setForm(newForm);
        validateForm(newForm);
    };

    const validateForm = (f) => {
        const isValid = isNonEmpty(f.name) && isValidEmail(f.email) && f.password.length > 0;
        setIsFormValid(isValid);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError([]);

        try {
            const response = await createUser({
                name: form.name,
                email: normalizeEmail(form.email),
                password: form.password
            });

            localStorage.setItem('name', response.data.name);
            localStorage.setItem('token', response.data.token);

            navigate('/expenses');

        } catch (err) {
            setError(getApiErrorMessages(err, 'Erro ao criar conta. Tente novamente.'));
            console.error(err);
        }
    };

    const goToLogin = () => {
        navigate('/');
    };

    return (
        <div style={{ backgroundColor: theme.bgPrimary, color: theme.textPrimary }} className="min-h-screen w-full flex flex-col">
            <header className="w-full py-6">
                <h1 style={{ color: theme.textPrimary }} className="font-bold text-center text-2xl">
                    Gerenciador de despesas
                </h1>
            </header>

            <main className="flex flex-1 justify-center items-center p-4">
                <div style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }} className="w-full max-w-sm p-8 rounded-lg shadow-2xl flex flex-col gap-6">
                    <h2 style={{ color: theme.primary }} className="text-center text-2xl font-bold">Criar conta</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="flex flex-col text-sm">
                            Nome
                            <input
                                type="text"
                                value={form.name}
                                onChange={handleChange('name')}
                                required
                                style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                                className="h-10 px-3 mt-1 border rounded focus:outline-none"
                                onFocus={(e) => e.target.style.borderColor = theme.primary}
                                onBlur={(e) => e.target.style.borderColor = theme.borderColor}
                                placeholder="Seu nome"
                            />
                        </label>

                        <label className="flex flex-col text-sm">
                            Email
                            <input
                                type="email"
                                value={form.email}
                                onChange={handleChange('email')}
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
                                    value={form.password}
                                    onChange={handleChange('password')}
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
                            style={{ backgroundColor: theme.primary, color: theme.textPrimary }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = theme.primaryHover}
                            onMouseLeave={(e) => e.target.style.backgroundColor = theme.primary}
                            className="h-11 mt-2 rounded font-semibold transition disabled:opacity-60 cursor-pointer disabled:cursor-default"
                        >
                            Criar conta
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
                            onClick={goToLogin}
                            style={{ color: theme.primary }}
                            className="text-sm underline cursor-pointer"
                            onMouseEnter={(e) => e.target.style.color = theme.primaryHover}
                            onMouseLeave={(e) => e.target.style.color = theme.primary}
                        >
                            Já tem conta? Entrar
                        </a>
                    </div>

                </div>
            </main>
        </div>
    );
}
