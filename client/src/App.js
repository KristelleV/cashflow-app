import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://cashflow-api-86lg.onrender.com/api';

const api = async (path, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_URL}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error occurred');
  return data;
};

// ── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const body = mode === 'login' ? { email, password } : { name, email, password };
      const data = await api(path, 'POST', body);
      localStorage.setItem('token', data.token);
      onLogin(data.user);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 16, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: 50 }}>💰</div>
          <h2 style={{ margin: '10px 0 5px', color: '#333' }}>Cashflow App</h2>
          <p style={{ color: '#888', margin: 0 }}>{mode === 'login' ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #fc8181', color: '#c53030', padding: '10px 15px', borderRadius: 8, marginBottom: 15, fontSize: 14 }}>
            {error}
          </div>
        )}

        {mode === 'register' && (
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Smith"
              style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
            />
          </div>
        )}

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          style={{ width: '100%', padding: 13, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, color: '#666', fontSize: 14 }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            style={{ color: '#667eea', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {mode === 'login' ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const [stats, setStats] = useState({ totalRevenue: 0, totalExpenses: 0, totalProfit: 0, projectCount: 0 });

  useEffect(() => {
    api('/retailers/stats/dashboard').then(setStats).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Revenue', value: `₱${Number(stats.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: '#48bb78' },
    { label: 'Total Expenses', value: `₱${Number(stats.totalExpenses || 0).toLocaleString()}`, icon: '📊', color: '#ed8936' },
    { label: 'Net Profit', value: `₱${Number(stats.totalProfit || 0).toLocaleString()}`, icon: '📈', color: '#667eea' },
    { label: 'Projects', value: stats.projectCount || 0, icon: '📋', color: '#764ba2' },
  ];

  return (
    <div>
      <h2 style={{ color: '#333', marginBottom: 5 }}>Welcome back, {user && user.name ? user.name : 'User'}! 👋</h2>
      <p style={{ color: '#888', marginBottom: 25 }}>Here's your financial overview</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 30 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 12, padding: 25, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', borderLeft: `4px solid ${c.color}` }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 'bold', color: '#333' }}>{c.value}</div>
            <div style={{ color: '#888', fontSize: 13, marginTop: 5 }}>{c.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'white', borderRadius: 12, padding: 30, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <h3 style={{ color: '#333', marginBottom: 15 }}>🎉 Your App is Live!</h3>
        <p style={{ color: '#555', lineHeight: 1.7 }}>Your cashflow app is running. Use the navigation to manage Projects, Payroll, and Overheads.</p>
      </div>
    </div>
  );
}

// ── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [retailerName, setRetailerName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [revenue, setRevenue] = useState('');
  const [status, setStatus] = useState('Active');
  const [startDate, setStartDate] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => api('/retailers').then(d => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      await api('/retailers', 'POST', { retailerName, projectName, revenue, status, startDate });
      setMsg('Project added!');
      setShow(false);
      setRetailerName(''); setProjectName(''); setRevenue(''); setStartDate('');
      load();
    } catch (e) { setMsg(e.message); }
  };

  const del = async (id) => {
    if (window.confirm('Delete this project?')) {
      await api(`/retailers/${id}`, 'DELETE').catch(() => {});
      load();
    }
  };

  return (
    <div>
      {msg && <div style={{ background: '#f0fff4', border: '1px solid #9ae6b4', color: '#276749', padding: '12px 16px', borderRadius: 8, marginBottom: 15 }}>{msg}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: '#333', margin: 0 }}>📋 Projects</h2>
        <button onClick={() => setShow(!show)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
          {show ? '✕ Cancel' : '+ Add Project'}
        </button>
      </div>
      {show && (
        <div style={{ background: 'white', borderRadius: 12, padding: 25, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 20, color: '#333' }}>New Project</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Retailer Name</label>
              <input value={retailerName} onChange={e => setRetailerName(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Project Name</label>
              <input value={projectName} onChange={e => setProjectName(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Revenue (₱)</label>
              <input type="number" value={revenue} onChange={e => setRevenue(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', background: 'white' }}>
                <option>Active</option><option>Pending</option><option>Completed</option><option>Cancelled</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
          </div>
          <button onClick={save} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Save Project</button>
        </div>
      )}
      <div style={{ background: 'white', borderRadius: 12, padding: 25, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Retailer', 'Project', 'Revenue', 'Status', 'Action'].map(h => (
                <th key={h} style={{ background: '#f8f9fa', padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#666', borderBottom: '2px solid #e1e4e8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#888' }}>No projects yet. Click "+ Add Project" to start!</td></tr>
            ) : items.map(p => (
              <tr key={p._id}>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}><strong>{p.retailerName}</strong></td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>{p.projectName}</td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>₱{Number(p.revenue || 0).toLocaleString()}</td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: p.status === 'Active' ? '#f0fff4' : '#f7fafc', color: p.status === 'Active' ? '#276749' : '#555' }}>{p.status}</span>
                </td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
                  <button onClick={() => del(p._id)} style={{ padding: '6px 14px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── PAYROLL ──────────────────────────────────────────────────────────────────
function Payroll() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [frequency, setFrequency] = useState('Monthly');

  const load = () => api('/payroll').then(d => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const save = async () => {
    await api('/payroll', 'POST', { employeeName, amount, dueDate, frequency }).catch(() => {});
    setShow(false); setEmployeeName(''); setAmount(''); setDueDate(''); load();
  };

  const del = async (id) => {
    if (window.confirm('Delete?')) { await api(`/payroll/${id}`, 'DELETE').catch(() => {}); load(); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: '#333', margin: 0 }}>👥 Payroll</h2>
        <button onClick={() => setShow(!show)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
          {show ? '✕ Cancel' : '+ Add Payroll'}
        </button>
      </div>
      {show && (
        <div style={{ background: 'white', borderRadius: 12, padding: 25, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 20, color: '#333' }}>New Payroll Entry</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Employee Name</label>
              <input value={employeeName} onChange={e => setEmployeeName(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Amount (₱)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', background: 'white' }}>
                <option>One-time</option><option>Weekly</option><option>Bi-weekly</option><option>Monthly</option>
              </select>
            </div>
          </div>
          <button onClick={save} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
        </div>
      )}
      <div style={{ background: 'white', borderRadius: 12, padding: 25, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Employee', 'Amount', 'Due Date', 'Frequency', 'Action'].map(h => <th key={h} style={{ background: '#f8f9fa', padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#666', borderBottom: '2px solid #e1e4e8' }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#888' }}>No payroll entries yet.</td></tr>
            ) : items.map(p => (
              <tr key={p._id}>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}><strong>{p.employeeName}</strong></td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>₱{Number(p.amount || 0).toLocaleString()}</td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '—'}</td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>{p.frequency}</td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}><button onClick={() => del(p._id)} style={{ padding: '6px 14px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── OVERHEADS ────────────────────────────────────────────────────────────────
function Overheads() {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Other');
  const [frequency, setFrequency] = useState('Monthly');

  const load = () => api('/overheads').then(d => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const save = async () => {
    await api('/overheads', 'POST', { expenseName, amount, dueDate, category, frequency }).catch(() => {});
    setShow(false); setExpenseName(''); setAmount(''); setDueDate(''); load();
  };

  const del = async (id) => {
    if (window.confirm('Delete?')) { await api(`/overheads/${id}`, 'DELETE').catch(() => {}); load(); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: '#333', margin: 0 }}>🏢 Overheads</h2>
        <button onClick={() => setShow(!show)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
          {show ? '✕ Cancel' : '+ Add Overhead'}
        </button>
      </div>
      {show && (
        <div style={{ background: 'white', borderRadius: 12, padding: 25, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 20, color: '#333' }}>New Overhead Entry</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Expense Name</label>
              <input value={expenseName} onChange={e => setExpenseName(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Amount (₱)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', background: 'white' }}>
                {['Rent','Utilities','Insurance','Software','Marketing','Supplies','Equipment','Maintenance','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 5 }}>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
            </div>
          </div>
          <button onClick={save} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
        </div>
      )}
      <div style={{ background: 'white', borderRadius: 12, padding: 25, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Expense', 'Amount', 'Category', 'Due Date', 'Action'].map(h => <th key={h} style={{ background: '#f8f9fa', padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#666', borderBottom: '2px solid #e1e4e8' }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#888' }}>No overhead entries yet.</td></tr>
            ) : items.map(o => (
              <tr key={o._id}>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}><strong>{o.expenseName}</strong></td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>₱{Number(o.amount || 0).toLocaleString()}</td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>{o.category}</td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>{o.dueDate ? new Date(o.dueDate).toLocaleDateString() : '—'}</td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}><button onClick={() => del(o._id)} style={{ padding: '6px 14px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api('/auth/me').then(data => { setUser(data); setChecking(false); }).catch(() => { localStorage.removeItem('token'); setChecking(false); });
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
        <div style={{ color: 'white', fontSize: 20 }}>Loading...</div>
      </div>
    );
  }

  if (!user) return <Login onLogin={setUser} />;

  const logout = () => { localStorage.removeItem('token'); setUser(null); setPage('dashboard'); };

  const pages = { dashboard: <Dashboard user={user} />, projects: <Projects />, payroll: <Payroll />, overheads: <Overheads /> };
  const navItems = [
    { key: 'dashboard', label: '🏠 Dashboard' },
    { key: 'projects', label: '📋 Projects' },
    { key: 'payroll', label: '👥 Payroll' },
    { key: 'overheads', label: '🏢 Overheads' },
  ];

  return (
    <div style={{ fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', minHeight: '100vh', background: '#f5f6fa' }}>
      <nav style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 'bold', margin: 0 }}>💰 Cashflow App</h1>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {navItems.map(n => (
            <button key={n.key} onClick={() => setPage(n.key)} style={{ background: page === n.key ? 'white' : 'rgba(255,255,255,0.15)', color: page === n.key ? '#667eea' : 'white', border: 'none', padding: '7px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: page === n.key ? 'bold' : 'normal' }}>
              {n.label}
            </button>
          ))}
          <button onClick={logout} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '7px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13 }}>
            Logout
          </button>
        </div>
      </nav>
      <main style={{ maxWidth: 1100, margin: '30px auto', padding: '0 20px' }}>
        {pages[page]}
      </main>
    </div>
  );
}
