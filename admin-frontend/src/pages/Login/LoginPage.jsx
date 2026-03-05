import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-primary/10 via-slate-50 to-secondary/10">
      <div className="card-surface p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-xs uppercase tracking-[0.4em] text-primary">JANSANKALP</div>
          <div className="text-2xl font-semibold text-slate-800 mt-1">Smart Water Pump Monitoring</div>
          <p className="text-sm text-slate-500 mt-2">Control Room Access</p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              type="email"
              required
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/60"
              placeholder="admin@gp.in"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              required
              className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/60"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-lg hover:bg-primary/90"
          >
            Sign In
          </button>
          <p className="text-center text-xs text-slate-500">
            Dashboard access is restricted to authorized Gram Panchayat operators.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
