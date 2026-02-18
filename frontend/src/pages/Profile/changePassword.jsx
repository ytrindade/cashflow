import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { getApiErrorMessages } from '../../utils/apiErrors';
import { clearAuthSession } from '../../services/authSession';
import { changeUserPassword } from '../../services/userService';

export default function ChangePassword({ onClose }) {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState([]);
  const [changePasswordForm, setChangePasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePasswordChange = (field) => (e) => {
    setChangePasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError([]);

    try {
      await changeUserPassword({
        currentPassword: changePasswordForm.currentPassword,
        newPassword: changePasswordForm.newPassword
      });

      clearAuthSession();
      navigate('/');
    } catch (err) {
      console.error('Erro ao mudar senha:', err);
      setError(getApiErrorMessages(err, 'Erro ao mudar senha'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)' }} className="fixed inset-0 flex items-center justify-center z-50">
      <div style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }} className="w-full max-w-md p-6 rounded-lg shadow-2xl flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="m-0 text-2xl font-bold">Mudar senha</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-0 bg-transparent border-none cursor-pointer text-lg"
            style={{ color: theme.textPrimary }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error.length > 0 && (
          <ul className="text-sm m-0 pl-5 list-disc" style={{ color: theme.errorText }}>
            {error.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleChangePassword}>
          <label className="flex flex-col text-sm">
            <span className="font-bold mb-1">Senha atual</span>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={changePasswordForm.currentPassword}
                onChange={handleChangePasswordChange('currentPassword')}
                style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                className="w-full h-10 px-3 border rounded focus:outline-none pr-10"
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = theme.borderColor}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{ color: theme.textPrimary }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer transition-colors duration-200 hover:opacity-70"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  {showCurrentPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </label>

          <label className="flex flex-col text-sm">
            <span className="font-bold mb-1">Nova senha</span>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={changePasswordForm.newPassword}
                onChange={handleChangePasswordChange('newPassword')}
                style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                className="w-full h-10 px-3 border rounded focus:outline-none pr-10"
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = theme.borderColor}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{ color: theme.textPrimary }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer transition-colors duration-200 hover:opacity-70"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  {showNewPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </label>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-11 rounded font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed text-white cursor-pointer"
              style={{ backgroundColor: theme.primary }}
              onMouseEnter={(e) => saving ? null : (e.target.style.backgroundColor = theme.primaryHover)}
              onMouseLeave={(e) => saving ? null : (e.target.style.backgroundColor = theme.primary)}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded font-semibold transition text-white cursor-pointer"
              style={{ backgroundColor: theme.borderColor }}
              onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.target.style.opacity = '1')}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
