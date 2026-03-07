import React, { useState } from 'react';
import api from '../../services/api';

const ResolveComplaintModal = ({ complaintId, onClose, onSaved }) => {
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // In a real app we'd upload the photo to AWS S3 or similar and pass the URL
      // For this prototype, we'll just simulate it passing the filename or a dummy URL
      const payload = { 
        status: 'resolved', 
        note,
        photo_url: photo ? `https://demo-storage.in/proofs/${photo.name}` : null
      };
      
      await api.put(`/complaints/${complaintId}/resolve`, payload);
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card-surface p-6 w-full max-w-sm">
        <h3 className="section-title mb-4">Resolve Complaint</h3>
        <p className="text-sm text-slate-500 mb-4">Ticket ID: {complaintId}</p>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div>
            <label className="text-sm font-semibold text-slate-700">Resolution Note</label>
            <textarea 
               className="w-full mt-1 px-3 py-2 border rounded-xl" 
               rows="3"
               required 
               placeholder="Describe what was done..."
               value={note} 
               onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Proof of Resolution (Optional)</label>
            <input 
               type="file" 
               accept="image/*"
               className="w-full mt-1 px-3 py-2 border rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
               onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" className="px-4 py-2 font-semibold text-slate-600" onClick={onClose}>Cancel</button>
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
