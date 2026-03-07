import React, { useState } from 'react';
import api from '../../services/api';
import { useAppContext } from '../../context/AppContext';

const AddPumpModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({ area_id: '', name: '', installation_date: '', motor_power: '', pipe_size: '' });
  const [saving, setSaving] = useState(false);
  const { areas } = useAppContext(); // Assume areas are loaded in context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/pumps', form);
      onSaved();
      onClose();
    } catch (err) {
      alert("Failed to create pump.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card-surface p-6 w-full max-w-sm">
        <h3 className="section-title mb-4">Register New Pump</h3>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Pump Name</label>
            <input 
               type="text" 
               className="w-full mt-1 px-3 py-2 border rounded-xl" 
               placeholder="Mainline Pump A"
               required 
               value={form.name} 
               onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Area</label>
            <select
               className="w-full mt-1 px-3 py-2 border rounded-xl bg-white" 
               required 
               value={form.area_id} 
               onChange={(e) => setForm({...form, area_id: e.target.value})}
            >
              <option value="">Select an area...</option>
              {areas && areas.map(area => (
                <option key={area.id} value={area.id}>{area.name} - {area.pincode}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Installation Date</label>
            <input 
               type="date" 
               className="w-full mt-1 px-3 py-2 border rounded-xl" 
               required 
               value={form.installation_date} 
               onChange={(e) => setForm({...form, installation_date: e.target.value})}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-700">Motor Power (HP)</label>
              <input 
                 type="text" 
                 className="w-full mt-1 px-3 py-2 border rounded-xl" 
                 placeholder="5.5"
                 value={form.motor_power} 
                 onChange={(e) => setForm({...form, motor_power: e.target.value})}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-700">Pipe Size (inches)</label>
              <input 
                 type="text" 
                 className="w-full mt-1 px-3 py-2 border rounded-xl" 
                 placeholder="2"
                 value={form.pipe_size} 
                 onChange={(e) => setForm({...form, pipe_size: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" className="px-4 py-2 font-semibold text-slate-600" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow" disabled={saving}>
              {saving ? 'Saving...' : 'Save Pump'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPumpModal;
