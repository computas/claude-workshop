import { useState, useEffect } from 'react';
import { getOrderLogs, openLogsDirectory } from '../../api/orders.js';
import { useAppContext } from '../../context/AppContext.js';

interface Props {
  orderId: number;
}

export function LogViewer({ orderId }: Props) {
  const { t } = useAppContext();
  const [orderLogs, setOrderLogs] = useState<object[]>([]);
  const [technicalLogs, setTechnicalLogs] = useState<object[]>([]);
  const [includeTechnical, setIncludeTechnical] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getOrderLogs(orderId, includeTechnical)
      .then(data => {
        setOrderLogs(data.orderLogs);
        setTechnicalLogs(data.technicalLogs ?? []);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load logs'))
      .finally(() => setLoading(false));
  }, [orderId, includeTechnical]);

  function handleOpenDir() {
    openLogsDirectory().catch(console.error);
  }

  const allLogs = includeTechnical
    ? [...orderLogs, ...technicalLogs].sort((a, b) => {
        const ta = (a as { timestamp?: string }).timestamp ?? '';
        const tb = (b as { timestamp?: string }).timestamp ?? '';
        return ta.localeCompare(tb);
      })
    : orderLogs;

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0 }}>{t('admin_logs_title')}</h3>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={includeTechnical}
            onChange={e => setIncludeTechnical(e.target.checked)}
          />
          {t('admin_include_technical')}
        </label>

        <button
          onClick={handleOpenDir}
          style={{
            padding: '6px 14px', background: '#f7fafc', border: '1px solid #e2e8f0',
            borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem',
          }}
        >
          📂 {t('admin_open_logs_dir')}
        </button>
      </div>

      {loading && <div style={{ color: '#718096' }}>{t('loading')}</div>}
      {error && <div style={{ color: '#e53e3e' }}>{error}</div>}

      {!loading && !error && allLogs.length === 0 && (
        <div style={{ color: '#718096', fontStyle: 'italic' }}>{t('admin_no_logs')}</div>
      )}

      {allLogs.length > 0 && (
        <div style={{
          background: '#1a1a2e',
          color: '#e2e8f0',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          maxHeight: '400px',
          overflowY: 'auto',
        }}>
          {allLogs.map((entry, i) => {
            const { timestamp, message, level, ...rest } = entry as Record<string, unknown>;
            return (
              <div key={i} style={{ marginBottom: '8px', borderBottom: '1px solid #2d3748', paddingBottom: '8px' }}>
                <span style={{ color: '#68d391' }}>{String(timestamp ?? '')}</span>
                {' '}
                <span style={{ color: level === 'error' ? '#fc8181' : '#90cdf4', fontWeight: 'bold' }}>
                  [{String(level ?? 'info').toUpperCase()}]
                </span>
                {' '}
                <span>{String(message ?? '')}</span>
                {Object.keys(rest).length > 0 && (
                  <pre style={{ margin: '4px 0 0 0', color: '#a0aec0', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(rest, null, 2)}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
