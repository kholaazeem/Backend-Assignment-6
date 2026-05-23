const ConfirmModal = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger,
  onCancel,
  onConfirm,
}) => (
  <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
    <div className="w-full max-w-[420px] rounded-lg border border-white/10 bg-[#15161a] p-5 text-white shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
      <div className={`mb-4 grid h-12 w-12 place-items-center rounded-lg ${danger ? 'bg-red-500/15 text-red-200' : 'bg-[#ffc414] text-black'}`}>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d="M12 2 1 21h22L12 2Zm1 16h-2v-2h2v2Zm0-4h-2V9h2v5Z" />
        </svg>
      </div>
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#aeb3bf]">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-md bg-white/10 px-4 text-sm font-bold text-white transition hover:bg-white/15"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`h-10 rounded-md px-4 text-sm font-black transition ${
            danger
              ? 'bg-red-500 text-white hover:bg-red-400'
              : 'bg-[#ffc414] text-black hover:bg-[#ffd24a]'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
)

export default ConfirmModal