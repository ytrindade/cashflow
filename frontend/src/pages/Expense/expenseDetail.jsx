import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { TagEnum, TagNames, TagColors, PaymentTypeEnum, PaymentTypeNames } from '../../constants/enums';
import { getApiErrorMessages } from '../../utils/apiErrors';
import Expense from './expenses';
import { createExpense, getExpenseById, updateExpense } from '../../services/expenseService';

export default function ExpenseDetail() {
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [form, setForm] = useState({
    title: '',
    description: '',
    amount: '',
    paymentType: PaymentTypeEnum.Cash,
    date: '',
    tags: [],
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (isEditing) {
      const fetchExpense = async () => {
        try {
          const response = await getExpenseById(id);
          const expense = response.data;
          setForm({
            title: expense.title || '',
            description: expense.description || '',
            amount: expense.amount || '',
            paymentType: expense.paymentType ?? PaymentTypeEnum.Cash,
            date: expense.date ? expense.date.split('T')[0] : '',
            tags: expense.tags || [],
          });
          setSelectedTags(expense.tags || []);
          setError([]);
        } catch (err) {
          console.error('Erro ao buscar despesa:', err);
          setError(getApiErrorMessages(err, 'Erro ao carregar despesa'));
        } finally {
          setLoading(false);
        }
      };
      fetchExpense();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((t) => t !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);

    const today = new Date().toISOString().split('T')[0];
    let formattedDate = form.date || today;
    if (formattedDate.includes('/')) {
      const [day, month, year] = formattedDate.split('/');
      formattedDate = `${year}-${month}-${day}`;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        date: formattedDate,
        paymentType: parseInt(form.paymentType),
        amount: form.amount ? parseFloat(form.amount) : 0,
        tags: selectedTags,
      };

      console.log('Objeto sendo enviado:', payload);

      if (isEditing) {
        await updateExpense(id, payload);
        navigate('/expenses', {
          state: {
            expenseNotification: {
              action: 'edited',
              title: payload.title,
            },
          },
        });
      } else {
        await createExpense(payload);
        navigate('/expenses', {
          state: {
            expenseNotification: {
              action: 'created',
              title: payload.title,
            },
          },
        });
      }
    } catch (err) {
      console.error('Erro ao salvar despesa:', err);
      setError(getApiErrorMessages(err, 'Erro ao salvar despesa'));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    navigate('/expenses');
  };

  if (loading) {
    return (
      <>
        <Expense />
        <div style={{ backgroundColor: `rgba(0, 0, 0, 0.5)`, backdropFilter: 'blur(2px)' }} className="fixed inset-0 flex justify-center items-center z-40">
          <p style={{ color: theme.textPrimary }}>Carregando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Expense />

      <div
        style={{ backgroundColor: `rgba(0, 0, 0, 0.5)`, backdropFilter: 'blur(2px)' }}
        className="fixed inset-0 z-40"
        onClick={handleClose}
      />

      <div className="fixed inset-0 flex justify-center items-center z-50 p-6">
        <div
          style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto p-8 rounded-lg shadow-2xl flex flex-col gap-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="m-0 text-2xl font-bold">
              {isEditing ? 'Editar Despesa' : 'Cadastrar Despesa'}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="p-0 bg-transparent border-none cursor-pointer text-lg"
              style={{ color: theme.textPrimary }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col text-sm">
              <span className="font-bold mb-1">Título</span>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="h-10 px-3 border rounded text-base transition-colors duration-200 focus:outline-none"
                style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = theme.borderColor}
                placeholder="Ex: Almoço com cliente"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="font-bold mb-1">Descrição</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={2}
                className="px-3 py-2 border rounded text-sm transition-colors duration-200 focus:outline-none"
                style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary, resize: 'none' }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = theme.borderColor}
                placeholder="Detalhes da despesa (opcional)"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="font-bold mb-1">Valor</span>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                step="0.01"
                className="h-10 px-3 border rounded text-base transition-colors duration-200 focus:outline-none"
                style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = theme.borderColor}
                placeholder="0.00"
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="font-bold mb-1">Tipo de pagamento</span>
              <select
                name="paymentType"
                value={form.paymentType}
                onChange={handleChange}
                className="h-10 px-3 border rounded text-base transition-colors duration-200 focus:outline-none"
                style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = theme.borderColor}
              >
                {Object.entries(PaymentTypeEnum).map(([, value]) => (
                  <option key={value} value={value}>
                    {PaymentTypeNames[value]}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col text-sm">
              <span className="font-bold mb-1">Data</span>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="h-10 px-3 border rounded text-base transition-colors duration-200 focus:outline-none"
                style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = theme.borderColor}
              />
            </label>

            <div className="flex flex-col text-sm">
              <label className="font-bold mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(TagEnum).map(([, value]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleTagToggle(value)}
                    className="px-3 py-1 rounded text-xs font-semibold transition-colors duration-200 cursor-pointer border-2"
                    style={{
                      backgroundColor: selectedTags.includes(value) ? TagColors[value] : 'transparent',
                      borderColor: TagColors[value],
                      color: selectedTags.includes(value) ? '#fff' : theme.textPrimary,
                    }}
                  >
                    {TagNames[value]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 h-11 border-none rounded text-base font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50 text-white"
                style={{ backgroundColor: theme.primary}}
                onMouseEnter={(e) => !saving && (e.target.style.backgroundColor = theme.primaryHover)}
                onMouseLeave={(e) => !saving && (e.target.style.backgroundColor = theme.primary)}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                className="flex-1 h-11 border-2 rounded text-base font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50"
                style={{ borderColor: theme.borderColor, color: theme.textPrimary, backgroundColor: 'transparent' }}
                onMouseEnter={(e) => !saving && (e.target.style.backgroundColor = theme.bgInput)}
                onMouseLeave={(e) => !saving && (e.target.style.backgroundColor = 'transparent')}
              >
                Cancelar
              </button>
            </div>
          </form>

          {error.length > 0 && (
            <ul className="text-sm m-0 pl-5 list-disc" style={{ color: theme.errorText }}>
              {error.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
