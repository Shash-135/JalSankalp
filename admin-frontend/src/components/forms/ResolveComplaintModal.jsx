import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const BASE = api.defaults.baseURL.replace(/\/api$/, '');

const ResolveComplaintModal = ({ complaintId, onClose, onSaved }) => {
  const [complaint, setComplaint] = useState(null);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch full complaint detail including villager photo
    api.get('/complaints').then(res => {
      const found = res.data.find(c => c.id === complaintId);
      setComplaint(found);
    }).catch(() => {});
  }, [complaintId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('note', note);
      if (photo) formData.append('resolution_photo', photo);
      
      await api.put(`/complaints/${complaintId}/resolve`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSaved();
      onClose();
    } catch (err) {
      alert("Failed to resolve complaint.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card-surface p-6 w-full max-w-lg my-4">
        <h3 className="section-title mb-1">Resolve Complaint</h3>
        <p className="text-sm text-slate-500 mb-4">Ticket ID: <strong>#{complaintId}</strong></p>

        {/* Villager Submitted Details */}
        {complaint && (
          <div className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200 grid gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Villager Submission</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="font-semibold text-slate-600">Name:</span> {complaint.villager_name}</div>
              <div><span className="font-semibold text-slate-600">Mobile:</span> {complaint.villager_mobile}</div>
              <div><span className="font-semibold text-slate-600">Pump:</span> {complaint.pump_name}</div>
              <div><span className="font-semibold text-slate-600">Issue:</span> {complaint.issue_type}</div>
              <div className="col-span-2"><span className="font-semibold text-slate-600">Description:</span> {complaint.description}</div>
            </div>
            {complaint.photo_url && (
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">Villager Photo</div>
                <img 
                  src={`${BASE}${complaint.photo_url}`} 
                  alt="Villager submitted" 
                  className="w-full max-h-48 object-cover rounded-lg border border-slate-200" 
                />
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-3">
          <div>
            <label className="text-sm font-semibold text-slate-700">Resolution Note *</label>
            <textarea 
               className="w-full mt-1 px-3 py-2 border rounded-xl text-sm" 
               rows="3"
               required 
               placeholder="Describe what was done to fix the issue..."
               value={note} 
               onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Proof of Resolution Photo (Optional)</label>
            <input 
               type="file" 
               accept="image/*"
               className="w-full mt-1 px-3 py-2 border rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
               onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <button type="button" className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-accent text-primary font-semibold shadow" disabled={saving}>
              {saving ? 'Saving...' : 'Mark Resolved'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResolveComplaintModal;
