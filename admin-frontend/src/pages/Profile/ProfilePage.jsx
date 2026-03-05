import React from 'react';

const ProfilePage = () => {
  return (
    <div className="grid gap-6">
      <div className="card-surface p-6">
        <div className="text-sm text-slate-500">User preferences</div>
        <h2 className="text-xl font-semibold text-slate-800">Profile Settings</h2>
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <div>
            <label className="text-sm text-slate-600">Full Name</label>
            <input className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-accent/70" defaultValue="Arvind Kumar" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Role</label>
            <input className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-accent/70" defaultValue="Control Room Admin" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-accent/70" defaultValue="admin@gp.in" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Phone</label>
            <input className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-accent/70" defaultValue="+91 98765 43210" />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-primary text-white font-semibold shadow">Save Changes</button>
          <button className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700">Reset</button>
        </div>
      </div>

      <div className="card-surface p-6">
        <div className="section-title">Notifications</div>
        <div className="grid gap-3 mt-4">
          {["Downtime alerts", "Complaint escalations", "Operator shift changes"].map((item) => (
            <label key={item} className="flex items-center gap-3">
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
