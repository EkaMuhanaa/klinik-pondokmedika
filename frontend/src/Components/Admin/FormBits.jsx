import React from 'react';
import { MdSave, MdOutlineRefresh } from 'react-icons/md';

// eslint-disable-next-line react-refresh/only-export-components
export const inputClass = 'w-full px-4 py-3 rounded-lg bg-surface-container border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none';

/** Label + petunjuk + pesan error untuk satu isian form. */
export const Field = ({ label, hint, error, htmlFor, children }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-sm font-bold text-on-surface mb-2">{label}</label>
    {children}
    {hint && <p className="text-xs text-on-surface-variant mt-1">{hint}</p>}
    {error && <p className="text-xs text-error mt-1 font-bold">{error}</p>}
  </div>
);

export const Check = ({ checked, onChange, label, hint }) => (
  <label className="flex items-start gap-3 cursor-pointer select-none min-h-[44px] py-2">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-5 h-5 mt-0.5 accent-primary" />
    <span>
      <span className="font-bold text-on-surface block">{label}</span>
      {hint && <span className="text-xs text-on-surface-variant">{hint}</span>}
    </span>
  </label>
);

export const SaveButton = ({ saving, label }) => (
  <button
    type="submit"
    disabled={saving}
    className="bg-primary text-on-primary px-8 min-h-[48px] rounded-full font-bold hover:bg-primary/90 flex items-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
  >
    {saving ? <MdOutlineRefresh className="text-xl animate-spin" aria-hidden="true" /> : <MdSave className="text-xl" aria-hidden="true" />}
    {saving ? 'Menyimpan...' : label}
  </button>
);

/** Ubah error validasi Laravel ({field: [msg]}) jadi {field: msg}. */
// eslint-disable-next-line react-refresh/only-export-components
export const firstErrors = (err) => Object.fromEntries(Object.entries(err.response?.data?.errors || {}).map(([k, v]) => [k, v[0]]));
