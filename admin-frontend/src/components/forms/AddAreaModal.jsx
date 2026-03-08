import React, { useState } from 'react';
import api from '../../services/api';

const AddAreaModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({ name: '', pincode: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/areas', form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create area.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card-surface p-6 w-full max-w-sm">
        <h3 className="section-title mb-4">Add Gram Panchayat Area</h3>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Area Name</label>
            <input 
               type="text" 
               className="w-full mt-1 px-3 py-2 border rounded-xl" 
               placeholder="North Gram Panchayat"
               required 
               value={form.name} 
               onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Pincode</label>
            <input 
               type="text" 
               className="w-full mt-1 px-3 py-2 border rounded-xl" 
               placeholder="411001"
               required 
               value={form.pincode} 
               onChange={(e) => setForm({...form, pincode: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" className="px-4 py-2 font-semibold text-slate-600" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow" disabled={saving}>
              {saving ? 'Saving...' : 'Save Area'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAreaModal;
