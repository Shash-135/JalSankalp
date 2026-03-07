import React, { useState } from 'react';
import { HiX } from 'react-icons/hi';
import api from '../../services/api';
import { useAppContext } from '../../context/AppContext';

const EditOperatorModal = ({ operator, onClose, onSaved }) => {
  const { areas } = useAppContext();
  const [formData, setFormData] = useState({
    name: operator.name || '',
    assigned_area_id: operator.assigned_area_id || '',
    status: operator.status || 'active',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.put(`/operator/${operator.id}`, formData);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update operator details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800">Edit Operator: {operator.name}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <HiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Operator Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Assigned Area</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white"
                value={formData.assigned_area_id}
                onChange={(e) => setFormData({ ...formData, assigned_area_id: e.target.value })}
              >
                <option value="">No Assigned Area</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Employment Status</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none bg-white"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all disabled:opacity-70"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOperatorModal;
