import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: '', email: '', role: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.get('/admin/me');
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to load profile', err);
      setError('Could not load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/admin/me', { name: profile.name, email: profile.email });
      setSuccess('Profile changes saved securely.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="grid gap-6">
      <div className="card-surface p-6">
        <div className="text-sm text-slate-500">User preferences</div>
        <h2 className="text-xl font-semibold text-slate-800">Profile Settings</h2>
        
        {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        {success && <div className="mt-4 p-3 bg-teal-50 text-teal-700 rounded-lg text-sm">{success}</div>}

        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <div>
            <label className="text-sm text-slate-600">Full Name</label>
            <input name="name" value={profile.name || ''} onChange={handleChange} className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-accent/70" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Role</label>
            <input disabled value={profile.role || ''} className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input name="email" type="email" value={profile.email || ''} onChange={handleChange} className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-accent/70" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Phone</label>
            <input disabled value={profile.phone || ''} className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500" />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow hover:bg-primary/90 transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={fetchProfile} className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 transition">Reset</button>
        </div>
      </div>

      <div className="card-surface p-6">
        <div className="section-title">Notifications</div>
        <div className="grid gap-3 mt-4">
          {["Downtime alerts", "Complaint escalations", "Operator shift changes"].map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-5 w-5 text-primary" />
              <span className="text-slate-700">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
