import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { getApiErrorMessages } from '../../utils/apiErrors';
import ChangePassword from './changePassword';
import ConfirmModal from '../../components/ConfirmModal';
import { clearAuthSession, isAuthenticated, updateAuthName } from '../../services/authSession';
import { deleteUserAccount, getUserProfile, updateUserProfile } from '../../services/userService';

export default function Profile() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState([]);
  const [profile, setProfile] = useState({ name: '', email: '', password: '' });
  const [initialProfile, setInitialProfile] = useState({ name: '', email: '' });
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setProfile({
          name: response.data?.name || '',
          email: response.data?.email || '',
          password: ''
        });
        setInitialProfile({
          name: response.data?.name || '',
          email: response.data?.email || ''
        });
        setError([]);
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError(getApiErrorMessages(err, 'Erro ao carregar perfil'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);
    setSaving(true);

    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        password: profile.password
      };

      const response = await updateUserProfile(payload);

      const updatedName = response.data?.name ?? payload.name;
      const updatedEmail = response.data?.email ?? payload.email;

      setProfile((prev) => ({
        ...prev,
        name: updatedName,
        email: updatedEmail,
        password: ''
      }));
      setInitialProfile({
        name: updatedName,
        email: updatedEmail
      });
      updateAuthName(updatedName);
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      setError(getApiErrorMessages(err, 'Erro ao salvar perfil'));
    } finally {
      setSaving(false);
    }
  };

  const hasProfileChanges =
    profile.name !== initialProfile.name || profile.email !== initialProfile.email;

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (deletingAccount) {
      return;
    }
    setIsDeleteModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    setError([]);

    try {
      await deleteUserAccount();
      clearAuthSession();
      navigate('/');
    } catch (err) {
      console.error('Erro ao excluir conta:', err);
      setError(getApiErrorMessages(err, 'Erro ao excluir conta'));
      setIsDeleteModalOpen(false);
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div style={{ backgroundColor: theme.bgPrimary, color: theme.textPrimary }} className="min-h-screen w-full flex justify-center items-start p-20">
      <button
        type="button"
        onClick={() => navigate('/expenses')}
        className="absolute top-6 left-6 p-1 rounded-lg cursor-pointer transition-colors duration-200"
        style={{ color: theme.textPrimary }}
        onMouseEnter={(e) => (e.currentTarget.style.color = theme.primaryHover)}
        onMouseLeave={(e) => (e.currentTarget.style.color = theme.textPrimary)}
        aria-label="Voltar"
        title="Voltar"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
          arrow_back
        </span>
      </button>

      <div style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }} className="w-full max-w-md p-6 rounded-lg shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-2xl font-bold">Meu perfil</h2>
        </div>

        {error.length > 0 && (
          <ul className="text-sm m-0 pl-5 list-disc" style={{ color: theme.errorText }}>
            {error.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        )}

        {loading ? (
          <p className="text-center">Carregando perfil...</p>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label className="flex flex-col text-sm">
              <span className="font-bold mb-1">Nome</span>
              <input
                type="text"
                value={profile.name}
                onChange={handleChange('name')}
                style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                className="h-10 px-3 border rounded focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = theme.borderColor}
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="font-bold mb-1">Email</span>
              <input
                type="email"
                value={profile.email}
                onChange={handleChange('email')}
                style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                className="h-10 px-3 border rounded focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = theme.borderColor}
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="font-bold mb-1">Senha</span>
              <input
                type="password"
                value={profile.password}
                onChange={handleChange('password')}
                style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                className="h-10 px-3 border rounded focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = theme.borderColor}
                placeholder="••••••••"
                disabled={true}
              />
            </label>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleOpenChangePasswordModal}
                className="text-left text-sm underline cursor-pointer transition-colors duration-200 hover:opacity-70"
                style={{ color: theme.primary, backgroundColor: 'transparent', border: 'none', padding: 0 }}
              >
                Mudar senha
              </button>

              <button
                type="button"
                onClick={handleOpenDeleteModal}
                className="text-left text-sm underline cursor-pointer transition-colors duration-200 hover:opacity-70"
                style={{ color: theme.errorText, backgroundColor: 'transparent', border: 'none', padding: 0 }}
              >
                Excluir conta
              </button>
            </div>

            <button
              type="submit"
              disabled={saving || !hasProfileChanges}
              className="h-11 mt-2 rounded font-semibold transition disabled:opacity-60 disabled:cursor-default text-white cursor-pointer"
              style={{ backgroundColor: theme.primary }}
              onMouseEnter={(e) => saving || !hasProfileChanges ? null : (e.target.style.backgroundColor = theme.primaryHover)}
              onMouseLeave={(e) => saving || !hasProfileChanges ? null : (e.target.style.backgroundColor = theme.primary)}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        )}
      </div>

      {isChangePasswordModalOpen && (
        <ChangePassword onClose={handleCloseChangePasswordModal} />
      )}

      {isDeleteModalOpen && (
        <ConfirmModal
          title="Excluir conta"
          message="Essa ação é permanente e removerá seus dados. Deseja realmente excluir sua conta?"
          confirmLabel={deletingAccount ? 'Excluindo...' : 'Excluir'}
          cancelLabel="Cancelar"
          onConfirm={handleDeleteAccount}
          onCancel={handleCloseDeleteModal}
          confirming={deletingAccount}
          theme={theme}
        />
      )}
    </div>
  );
}
