import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://cashflow-api-86lp.onrender.com/api';

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = {
  app: { fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', minHeight: '100vh', background: '#f5f6fa' },
  nav: { background: 'linear-gradient(135deg,#667eea,#764ba2)', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' },
  navTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', margin: 0 },
  navLinks: { display: 'flex', gap: 20 },
  navBtn: { background: 'none', border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 14 },
  navBtnActive: { background: 'white', color: '#667eea', border: 'none', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' },
  main: { maxWidth: 1100, margin: '30px auto', padding: '0 20px' },
  card: { background: 'white', borderRadius: 12, padding: 30, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20, borderBottom: '2px solid #667eea', paddingBottom: 10 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 30 },
  statCard: { background: 'linear-gradient(135deg,#667eea,#764ba2)', borderRadius: 12, padding: 25, color: 'white', textAlign: 'center' },
  statNum: { fontSize: 32, fontWeight: 'bold', margin: '10px 0 5px' },
  statLabel: { fontSize: 13, opacity: 0.85 },
  form: { display: 'flex', flexDirection: 'column', gap: 15 },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 5, display: 'block' },
  input: { width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px 14px', border: '2px solid #e1e4e8', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', boxSizing: 'border-box' },
  btn: { padding: '12px 28px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer' },
  btnDanger: { padding: '8px 16px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
  btnSecondary: { padding: '12px 28px', background: '#e9ecef', color: '#333', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#f8f9fa', padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: '600', color: '#666', borderBottom: '2px solid #e1e4e8' },
  td: { padding: '14px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 14, color: '#333' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: '600' },
  alert: { padding: '14px 20px', borderRadius: 8, marginBottom: 20, fontSize: 14 },
  loginBox: { maxWidth: 420, margin: '80px auto', background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 10px 40px rgba(0,0,0,0.15)' },
  loginTitle: { textAlign: 'center', fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  loginSub: { textAlign: 'center', color: '#888', marginBottom: 30, fontSize: 14 },
};

// ─── API helper ────────────────────────────────────────────────────────────
const api = async (path, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  const opts = { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_URL}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error');
  return data;
};

// ─── Login Page ────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setError('');
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const body = mode === 'login' ? { email: form.email, password: form.password } : form;
      const data = await api(path, 'POST', body);
      localStorage.setItem('token', data.token);
      onLogin(data.user);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={styles.loginBox}>
        <div style={{ textAlign: 'center', fontSize: 48, marginBottom: 10 }}>💰</div>
        <h2 style={styles.loginTitle}>Cashflow App</h2>
        <p style={styles.loginSub}>{mode === 'login' ? 'Sign in to your account' : 'Create a new account'}</p>
        {error && <div style={{ ...styles.alert, background: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030' }}>{error}</div>}
        <div style={styles.form}>
          {mode === 'register' && (
            <div><label style={styles.label}>Full Name</label><input style={styles.input} placeholder="John Smith" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          )}
          <div><label style={styles.label}>Email</label><input style={styles.input} type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div><label style={styles.label}>Password</label><input style={styles.input} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
          <button style={styles.btn} onClick={submit} disabled={loading}>{loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}</button>
          <p style={{ textAlign: 'center', color: '#666', fontSize: 14 }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span style={{ color: '#667eea', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Register' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api('/retailers/stats/dashboard').then(setStats).catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 25 }}>
        <h2 style={{ color: '#333', marginBottom: 5 }}>Welcome back, {user?.name || 'User'}! 👋</h2>
        <p style={{ color: '#888' }}>Here's your financial overview</p>
      </div>
      <div style={styles.statsGrid}>
        {[
          { label: 'Total Revenue', value: `₱${(stats?.totalRevenue || 0).toLocaleString()}`, icon: '💰' },
          { label: 'Total Expenses', value: `₱${(stats?.totalExpenses || 0).toLocaleString()}`, icon: '📊' },
          { label: 'Net Profit', value: `₱${(stats?.totalProfit || 0).toLocaleString()}`, icon: '📈' },
          { label: 'Total Projects', value: stats?.projectCount || 0, icon: '📋' },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ fontSize: 36 }}>{s.icon}</div>
            <div style={styles.statNum}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>🎉 Your App is Live!</div>
        <p style={{ color: '#555', lineHeight: 1.7 }}>
          Your professional cashflow forecasting system is up and running. Use the navigation above to manage your projects, payroll, and overheads.
        </p>
        <ul style={{ color: '#555', marginTop: 15, lineHeight: 2, paddingLeft: 20 }}>
          <li>📋 <strong>Projects</strong> — Track retailer projects and payments</li>
          <li>👥 <strong>Payroll</strong> — Manage employee payments</li>
          <li>🏢 <strong>Overheads</strong> — Track business expenses</li>
        </ul>
      </div>
    </div>
  );
}

// ─── Projects ──────────────────────────────────────────────────────────────
function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ retailerName: '', projectName: '', revenue: '', startDate: '', endDate: '', status: 'Active' });
  const [msg, setMsg] = useState('');

  const load = () => api('/retailers').then(setProjects).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      await api('/retailers', 'POST', form);
      setMsg('Project added!'); setShowForm(false);
      setForm({ retailerName: '', projectName: '', revenue: '', startDate: '', endDate: '', status: 'Active' });
      load();
    } catch (e) { setMsg(e.message); }
  };

  const del = async (id) => {
    if (window.confirm('Delete this project?')) {
      await api(`/retailers/${id}`, 'DELETE'); load();
    }
  };

  const statusColor = s => ({ Active: '#48bb78', Completed: '#667eea', Pending: '#ed8936', Cancelled: '#fc8181' }[s] || '#888');

  return (
    <div>
      {msg && <div style={{ ...styles.alert, background: '#f0fff4', border: '1px solid #9ae6b4', color: '#276749' }}>{msg}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: '#333' }}>📋 Projects</h2>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>{showForm ? '✕ Cancel' : '+ Add Project'}</button>
      </div>
      {showForm && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>New Project</div>
          <div style={styles.form}>
            <div style={styles.formRow}>
              <div><label style={styles.label}>Retailer Name</label><input style={styles.input} value={form.retailerName} onChange={e => setForm({ ...form, retailerName: e.target.value })} /></div>
              <div><label style={styles.label}>Project Name</label><input style={styles.input} value={form.projectName} onChange={e => setForm({ ...form, projectName: e.target.value })} /></div>
            </div>
            <div style={styles.formRow}>
              <div><label style={styles.label}>Revenue (₱)</label><input style={styles.input} type="number" value={form.revenue} onChange={e => setForm({ ...form, revenue: e.target.value })} /></div>
              <div><label style={styles.label}>Status</label>
                <select style={styles.select} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {['Active', 'Pending', 'Completed', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={styles.formRow}>
              <div><label style={styles.label}>Start Date</label><input style={styles.input} type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
              <div><label style={styles.label}>End Date</label><input style={styles.input} type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
            </div>
            <div><button style={styles.btn} onClick={save}>Save Project</button></div>
          </div>
        </div>
      )}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead><tr>{['Retailer', 'Project', 'Revenue', 'Status', 'Start Date', 'Action'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan={6} style={{ ...styles.td, textAlign: 'center', color: '#888', padding: 40 }}>No projects yet. Click "+ Add Project" to get started!</td></tr>
            ) : projects.map(p => (
              <tr key={p._id}>
                <td style={styles.td}><strong>{p.retailerName}</strong></td>
                <td style={styles.td}>{p.projectName}</td>
                <td style={styles.td}>₱{(p.revenue || 0).toLocaleString()}</td>
                <td style={styles.td}><span style={{ ...styles.badge, background: statusColor(p.status) + '20', color: statusColor(p.status) }}>{p.status}</span></td>
                <td style={styles.td}>{p.startDate ? new Date(p.startDate).toLocaleDateString() : '—'}</td>
                <td style={styles.td}><button style={styles.btnDanger} onClick={() => del(p._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Payroll ───────────────────────────────────────────────────────────────
function Payroll() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employeeName: '', amount: '', dueDate: '', frequency: 'Monthly', notes: '' });

  const load = () => api('/payroll').then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    await api('/payroll', 'POST', form); setShowForm(false);
    setForm({ employeeName: '', amount: '', dueDate: '', frequency: 'Monthly', notes: '' }); load();
  };

  const del = async (id) => { if (window.confirm('Delete?')) { await api(`/payroll/${id}`, 'DELETE'); load(); } };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: '#333' }}>👥 Payroll</h2>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>{showForm ? '✕ Cancel' : '+ Add Payroll'}</button>
      </div>
      {showForm && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>New Payroll Entry</div>
          <div style={styles.form}>
            <div style={styles.formRow}>
              <div><label style={styles.label}>Employee Name</label><input style={styles.input} value={form.employeeName} onChange={e => setForm({ ...form, employeeName: e.target.value })} /></div>
              <div><label style={styles.label}>Amount (₱)</label><input style={styles.input} type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
            </div>
            <div style={styles.formRow}>
              <div><label style={styles.label}>Due Date</label><input style={styles.input} type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></div>
              <div><label style={styles.label}>Frequency</label>
                <select style={styles.select} value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}>
                  {['One-time', 'Weekly', 'Bi-weekly', 'Monthly'].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div><label style={styles.label}>Notes</label><input style={styles.input} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            <div><button style={styles.btn} onClick={save}>Save</button></div>
          </div>
        </div>
      )}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead><tr>{['Employee', 'Amount', 'Due Date', 'Frequency', 'Action'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#888', padding: 40 }}>No payroll entries yet.</td></tr>
            ) : items.map(p => (
              <tr key={p._id}>
                <td style={styles.td}><strong>{p.employeeName}</strong></td>
                <td style={styles.td}>₱{(p.amount || 0).toLocaleString()}</td>
                <td style={styles.td}>{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '—'}</td>
                <td style={styles.td}>{p.frequency}</td>
                <td style={styles.td}><button style={styles.btnDanger} onClick={() => del(p._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Overheads ─────────────────────────────────────────────────────────────
function Overheads() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ expenseName: '', amount: '', dueDate: '', frequency: 'Monthly', category: 'Other' });

  const load = () => api('/overheads').then(setItems).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    await api('/overheads', 'POST', form); setShowForm(false);
    setForm({ expenseName: '', amount: '', dueDate: '', frequency: 'Monthly', category: 'Other' }); load();
  };

  const del = async (id) => { if (window.confirm('Delete?')) { await api(`/overheads/${id}`, 'DELETE'); load(); } };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: '#333' }}>🏢 Overheads</h2>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>{showForm ? '✕ Cancel' : '+ Add Overhead'}</button>
      </div>
      {showForm && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>New Overhead Entry</div>
          <div style={styles.form}>
            <div style={styles.formRow}>
              <div><label style={styles.label}>Expense Name</label><input style={styles.input} value={form.expenseName} onChange={e => setForm({ ...form, expenseName: e.target.value })} /></div>
              <div><label style={styles.label}>Amount (₱)</label><input style={styles.input} type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
            </div>
            <div style={styles.formRow}>
              <div><label style={styles.label}>Category</label>
                <select style={styles.select} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {['Rent', 'Utilities', 'Insurance', 'Software', 'Marketing', 'Supplies', 'Equipment', 'Maintenance', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={styles.label}>Frequency</label>
                <select style={styles.select} value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}>
                  {['One-time', 'Weekly', 'Monthly'].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div><label style={styles.label}>Due Date</label><input style={styles.input} type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></div>
            <div><button style={styles.btn} onClick={save}>Save</button></div>
          </div>
        </div>
      )}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead><tr>{['Expense', 'Amount', 'Category', 'Due Date', 'Action'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ ...styles.td, textAlign: 'center', color: '#888', padding: 40 }}>No overhead entries yet.</td></tr>
            ) : items.map(o => (
              <tr key={o._id}>
                <td style={styles.td}><strong>{o.expenseName}</strong></td>
                <td style={styles.td}>₱{(o.amount || 0).toLocaleString()}</td>
                <td style={styles.td}>{o.category}</td>
                <td style={styles.td}>{o.dueDate ? new Date(o.dueDate).toLocaleDateString() : '—'}</td>
                <td style={styles.td}><button style={styles.btnDanger} onClick={() => del(o._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api('/auth/me').then(data => setUser(data)).catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  if (!user) return <LoginPage onLogin={setUser} />;

  const pages = { dashboard: <Dashboard user={user} />, projects: <Projects />, payroll: <Payroll />, overheads: <Overheads /> };

  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <h1 style={styles.navTitle}>💰 Cashflow App</h1>
        <div style={styles.navLinks}>
          {['dashboard', 'projects', 'payroll', 'overheads'].map(p => (
            <button key={p} style={page === p ? styles.navBtnActive : styles.navBtn} onClick={() => setPage(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
          <button style={{ ...styles.navBtn, background: 'rgba(255,255,255,0.2)' }} onClick={logout}>Logout</button>
        </div>
      </nav>
      <main style={styles.main}>{pages[page]}</main>
    </div>
  );
}
