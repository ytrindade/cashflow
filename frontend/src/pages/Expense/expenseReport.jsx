import React, { useState } from 'react';
import { REPORT_URL } from '../../constants/apiUrls';
import api from '../../services/api';
import pdfIcon from '../../assets/pdf.png';
import excelIcon from '../../assets/excel.png';

export default function ExpenseReport({ theme }) {
  const noDataMessage = '* Não há despesas cadastradas para este mês';
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [reportMonthYear, setReportMonthYear] = useState('');
  const [exportError, setExportError] = useState('');
  const [exporting, setExporting] = useState(false);

  const handleOpenExportModal = () => {
    setExportError('');
    setExportModalOpen(true);
  };

  const handleCloseExportModal = () => {
    setExportError('');
    setExportModalOpen(false);
  };

  const handleExportReport = async (format) => {
    setExportError('');
    setExporting(true);

    try {
      const query = reportMonthYear ? `?month=${encodeURIComponent(reportMonthYear)}` : '';
      const response = await api.get(`${REPORT_URL}/${format}${query}`, {
        responseType: 'blob',
      });

      if (response.status === 204 || !response.data || response.data.size === 0) {
        setExportError(noDataMessage);
        return;
      }

      const downloadUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      const extension = format === 'excel' ? 'xlsx' : 'pdf';
      const fileName = `relatorio-${reportMonthYear || 'geral'}.${extension}`;

      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      setExportModalOpen(false);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      setExportError('Erro ao exportar relatório.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenExportModal}
        className="fixed bottom-5 z-60 flex items-center gap-2 h-12 px-4 border rounded-full cursor-pointer transition-colors duration-200 font-bold"
        style={{ right: '84px', backgroundColor: theme.bgSecondary, borderColor: theme.borderColor, color: theme.textPrimary }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.bgInput)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.bgSecondary)}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
        <span className="text-sm">Exportar</span>
      </button>

      {exportModalOpen && (
        <>
          <div
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)' }}
            className="fixed inset-0 z-40"
            onClick={handleCloseExportModal}
          />
          <div className="fixed inset-0 flex justify-center items-center z-50 p-6">
            <div
              style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }}
              className="w-full max-w-sm p-6 rounded-lg shadow-2xl flex flex-col gap-5"
            >
              <div className="flex justify-between items-center">
                <h2 className="m-0 text-xl font-bold">Exportar relatório</h2>
                <button
                  type="button"
                  onClick={handleCloseExportModal}
                  className="p-0 bg-transparent border-none cursor-pointer text-lg"
                  style={{ color: theme.textPrimary }}
                  aria-label="Fechar"
                  title="Fechar"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <label className="flex flex-col text-sm">
                <span className="font-bold mb-1">Mês e ano</span>
                <input
                  type="text"
                  value={reportMonthYear}
                  onChange={(e) => setReportMonthYear(e.target.value)}
                  placeholder="2026-02"
                  className="h-10 px-3 border rounded text-base transition-colors duration-200 focus:outline-none"
                  style={{ backgroundColor: theme.bgInput, borderColor: theme.borderColor, color: theme.textPrimary }}
                  onFocus={(e) => (e.target.style.borderColor = theme.primary)}
                  onBlur={(e) => (e.target.style.borderColor = theme.borderColor)}
                />
              </label>

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleExportReport('pdf')}
                  disabled={exporting}
                  className="w-20 h-20 border rounded-lg cursor-pointer transition-colors duration-200 flex items-center justify-center"
                  style={{ borderColor: theme.borderColor, backgroundColor: theme.bgInput }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.bgPrimary)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.bgInput)}
                >
                  <img src={pdfIcon} alt="Exportar PDF" className="w-12 h-12 object-contain" />
                </button>
                <button
                  type="button"
                  onClick={() => handleExportReport('excel')}
                  disabled={exporting}
                  className="w-20 h-20 border rounded-lg cursor-pointer transition-colors duration-200 flex items-center justify-center"
                  style={{ borderColor: theme.borderColor, backgroundColor: theme.bgInput }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.bgPrimary)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.bgInput)}
                >
                  <img src={excelIcon} alt="Exportar Excel" className="w-12 h-12 object-contain" />
                </button>
              </div>

              {exportError && (
                <p
                  className="m-0 text-sm text-center font-bold"
                  style={{ color: exportError === noDataMessage ? theme.textPrimary : theme.errorText }}
                >
                  {exportError}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}