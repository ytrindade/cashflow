import React from 'react';

export default function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  confirming,
  theme,
  confirmColor = '#ef4444',
  confirmHoverColor = '#dc2626'
}) {
  return (
    <>
      <div
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)' }}
        className="fixed inset-0 z-40"
        onClick={onCancel}
      />
      <div className="fixed inset-0 flex justify-center items-center z-50 p-6">
        <div
          style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary, backdropFilter: 'blur(2px)' }}
          className="w-full max-w-sm p-8 rounded-lg shadow-2xl flex flex-col gap-6"
        >
          <h2 className="m-0 text-xl font-bold text-center">{title}</h2>
          <p className="m-0 text-center text-sm">{message}</p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirming}
              className="flex-1 h-11 border-none rounded text-base font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50 text-white"
              style={{ backgroundColor: confirmColor }}
              onMouseEnter={(e) => !confirming && (e.target.style.backgroundColor = confirmHoverColor)}
              onMouseLeave={(e) => !confirming && (e.target.style.backgroundColor = confirmColor)}
            >
              {confirmLabel}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={confirming}
              className="flex-1 h-11 border-2 rounded text-base font-semibold cursor-pointer transition-all duration-200 disabled:opacity-50"
              style={{ borderColor: theme.borderColor, color: theme.textPrimary, backgroundColor: 'transparent' }}
              onMouseEnter={(e) => !confirming && (e.target.style.backgroundColor = theme.bgInput)}
              onMouseLeave={(e) => !confirming && (e.target.style.backgroundColor = 'transparent')}
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
