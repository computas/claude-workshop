import { Dashboard } from '../../components/admin/Dashboard';

export function AdminDashboardPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Admin</h1>
      <Dashboard />
    </div>
  );
}
