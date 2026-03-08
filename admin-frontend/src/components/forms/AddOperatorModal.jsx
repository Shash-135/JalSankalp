import React, { useState } from 'react';
import api from '../../services/api';
import { useAppContext } from '../../context/AppContext';

const AddOperatorModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({ name: '', mobile: '', password: '', assigned_area_id: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { areas } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/operator', form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register operator.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card-surface p-6 w-full max-w-sm">
        <h3 className="section-title mb-4">Register Operator</h3>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div>
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <input 
               type="text" 
               className="w-full mt-1 px-3 py-2 border rounded-xl" 
               required 
               value={form.name} 
               onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
            <input 
               type="tel" 
               className="w-full mt-1 px-3 py-2 border rounded-xl" 
               required 
               pattern="[0-9]{10}"
               value={form.mobile} 
               onChange={(e) => setForm({...form, mobile: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input 
               type="password" 
               className="w-full mt-1 px-3 py-2 border rounded-xl" 
               required 
               value={form.password} 
               onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Assigned Area</label>
            <select
               className="w-full mt-1 px-3 py-2 border rounded-xl bg-white" 
               required 
               value={form.assigned_area_id} 
               onChange={(e) => setForm({...form, assigned_area_id: e.target.value})}
            >
              <option value="">Select an area...</option>
              {areas && areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" className="px-4 py-2 font-semibold text-slate-600" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow" disabled={saving}>
              {saving ? 'Saving...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOperatorModal;
