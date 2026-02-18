import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from '../../context/ThemeContext';
import { getApiErrorMessages } from '../../utils/apiErrors';
import { PaymentTypeNames, TagNames, TagColors } from '../../constants/enums';
import ConfirmModal from '../../components/ConfirmModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { deleteExpense, getExpenses } from '../../services/expenseService';
import { clearAuthSession, getAuthName, isAuthenticated } from '../../services/authSession';
import ExpenseReport from './expenseReport';
import useExpenseNotification from './useExpenseNotification';

export default function Expense() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const { notificationData, notificationKey, clearNotification } = useExpenseNotification();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }

    setUserName(getAuthName());

    const fetchExpenses = async () => {
      try {
        const response = await getExpenses();
        setExpenses(response.data.expenses || []);
        setError([]);
      } catch (err) {
        console.error('Erro ao buscar despesas:', err);
        setError(getApiErrorMessages(err, 'Erro ao carregar despesas'));
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [navigate]);

  const handleDeleteClick = (expenseId) => {
    setDeleteConfirmId(expenseId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    setDeleting(true);
    try {
      await deleteExpense(deleteConfirmId);
      
      setExpenses((prev) => prev.filter((e) => e.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      setError([]);
    } catch (err) {
      console.error('Erro ao deletar despesa:', err);
      setError(getApiErrorMessages(err, 'Erro ao deletar despesa'));
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleLogout = () => {
    setLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    clearAuthSession();
    setLogoutConfirmOpen(false);
    navigate('/');
  };

  const handleCancelLogout = () => {
    setLogoutConfirmOpen(false);
  };

  return (
    <div style={{ backgroundColor: theme.bgPrimary, color: theme.textPrimary, '--scrollbar-track': theme.bgSecondary, '--scrollbar-thumb': theme.borderColor, '--scrollbar-thumb-hover': theme.primary }} className="flex justify-center items-start min-h-screen w-full p-25">
      {userName && (
        <div className="absolute top-6 left-6 flex flex-col">
          <button
            type="button"
            className="flex items-center gap-2 p-1 rounded-lg cursor-pointer transition-colors duration-200 text-left"
            style={{ color: theme.textPrimary }}
            onClick={() => navigate('/profile')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>person</span>
            <span className="text-sm font-bold">Meu perfil</span>
          </button>
          <p className="m-0 mt-2 text-xs pl-9" style={{ color: theme.textPrimary }}>Olá, {userName}</p>
        </div>
      )}
      <div className="absolute top-6 right-6 flex items-start gap-3">
        {notificationData && (
          <div
            key={notificationKey}
            onAnimationEnd={clearNotification}
            style={{ backgroundColor: theme.bgInput, color: theme.textPrimary, borderColor: theme.borderColor }}
            className="w-72 p-3 border rounded-lg shadow-2xl expense-notification-border-progress expense-notification-lifetime"
          >
            <p className="m-0 text-sm font-semibold">
              A tarefa "<strong>{notificationData.title}</strong>" {notificationData.actionText}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 rounded-full cursor-pointer transition-colors duration-200 font-bold"
          style={{ color: theme.textPrimary }}
          onMouseEnter={(e) => (e.currentTarget.style.color = theme.primaryHover)}
          onMouseLeave={(e) => (e.currentTarget.style.color = theme.textPrimary)}
          aria-label="Logout"
          title="Logout"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>logout</span>
          <span className="text-sm">Sair</span>
        </button>
      </div>
      <div className="flex flex-col w-full max-w-4xl gap-6">
        <div style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }} className="p-6 rounded-lg shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="m-0 text-2xl font-bold">Despesas</h2>
            </div>
            <button type="button" onClick={() => navigate('/expenses/add')} style={{ backgroundColor: theme.primary }} onMouseEnter={(e)=> e.target.style.backgroundColor = theme.primaryHover} onMouseLeave={(e)=> e.target.style.backgroundColor = theme.primary} className="flex items-center gap-2 h-10 px-4 border-none rounded font-bold cursor-pointer transition-colors duration-200 text-white">        
              Adicionar
            </button>
          </div>

          {error.length > 0 && (
            <ul className="text-sm m-0 pl-5 list-disc" style={{ color: theme.errorText }}>
              {error.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )}

          {loading ? (
            <p className="text-center">Carregando despesas...</p>
          ) : expenses.length === 0 ? (
            <p className="text-center">Nenhuma despesa encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expenses.map((e) => (
                <article key={e.id} style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }} className="p-4 border rounded hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{e.title}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">R$ {formatCurrency(e.amount)}</p>
                      <p className="text-xs" style={{ color: '#9ca3af' }}>{formatDate(e.date)}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between items-center text-sm flex-wrap gap-2">
                    <span className="px-2 py-1 rounded" style={{ backgroundColor: theme.borderColor, color: theme.textPrimary }}>{PaymentTypeNames[e.paymentType] || 'Desconhecido'}</span>
                    {e.tags && e.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {e.tags.map((tagId) => (
                          <span key={tagId} className="text-xs px-1 py-0.5 rounded flex items-center gap-2" style={{ backgroundColor: 'transparent', color: theme.textPrimary }}>
                            <span style={{ width: 10, height: 10, backgroundColor: TagColors[tagId] || '#cccccc' }} className="rounded-full inline-block" />
                            <span>{TagNames[tagId] || 'Tag desconhecida'}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end -mr-2 -mb-4">
                    <button type="button" onClick={() => navigate(`/expenses/edit/${e.id}`)} className="p-1 rounded cursor-pointer transition-colors duration-200 hover:opacity-80" style={{color: theme.textPrimary }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                    </button>
                    <button type="button" onClick={() => handleDeleteClick(e.id)} className="p-1 rounded cursor-pointer transition-colors duration-200" onMouseEnter={(e)=> e.currentTarget.style.color = '#ef4444'} onMouseLeave={(e)=> e.currentTarget.style.color = theme.textPrimary} style={{color: theme.textPrimary }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <ExpenseReport theme={theme} />

      {deleteConfirmId && (
        <ConfirmModal
          title="Excluir Despesa"
          message="Tem certeza que deseja excluir esta despesa?"
          confirmLabel={deleting ? 'Excluindo...' : 'Excluir'}
          cancelLabel="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirming={deleting}
          theme={theme}
        />
      )}
      {logoutConfirmOpen && (
        <ConfirmModal
          title="Sair da conta"
          message="Deseja realmente sair da sua conta?"
          confirmLabel="Sair"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
          confirming={false}
          theme={theme}
          confirmColor={theme.primary}
          confirmHoverColor={theme.primaryHover}
        />
      )}
    </div>
  );
}