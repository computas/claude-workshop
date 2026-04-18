import { useState } from 'react';
import { useAppContext } from '../context/AppContext.js';
import { Dashboard } from '../components/admin/Dashboard.js';
import { OrderList } from '../components/admin/OrderList.js';

type Tab = 'dashboard' | 'orders';

export function AdminPage() {
  const { t } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  const tabStyle = (tab: Tab): React.CSSProperties => ({
    padding: '10px 20px',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #0070f3' : '3px solid transparent',
    background: 'transparent',
    cursor: 'pointer',
    fontWeight: activeTab === tab ? '600' : '400',
    color: activeTab === tab ? '#0070f3' : '#4a5568',
    fontSize: '1rem',
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px' }}>{t('admin_title')}</h1>

      <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <button style={tabStyle('dashboard')} onClick={() => setActiveTab('dashboard')}>
          {t('admin_dashboard')}
        </button>
        <button style={tabStyle('orders')} onClick={() => setActiveTab('orders')}>
          {t('admin_orders')}
        </button>
      </div>

      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'orders' && <OrderList />}
    </div>
  );
}
