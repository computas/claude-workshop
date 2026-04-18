import { useState, useEffect } from 'react';
import { getOrderLogs, openLogsDirectory } from '../../api/orders.js';
import { useAppContext } from '../../context/AppContext.js';
import { cat } from '../../theme.js';

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
        <h3 style={{ margin: 0, color: cat.text }}>{t('admin_logs_title')}</h3>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: cat.subtext1 }}>
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
            padding: '6px 14px', background: cat.surface1, border: `1px solid ${cat.surface2}`,
            borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', color: cat.text,
          }}
        >
          📂 {t('admin_open_logs_dir')}
        </button>
      </div>

      {loading && <div style={{ color: cat.subtext0 }}>{t('loading')}</div>}
      {error && <div style={{ color: cat.red }}>{error}</div>}

      {!loading && !error && allLogs.length === 0 && (
        <div style={{ color: cat.subtext0, fontStyle: 'italic' }}>{t('admin_no_logs')}</div>
      )}

      {allLogs.length > 0 && (
        <div style={{
          background: cat.mantle,
          color: cat.text,
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          maxHeight: '400px',
          overflowY: 'auto',
          border: `1px solid ${cat.surface1}`,
        }}>
          {allLogs.map((entry, i) => {
            const { timestamp, message, level, ...rest } = entry as Record<string, unknown>;
            return (
              <div key={i} style={{ marginBottom: '8px', borderBottom: `1px solid ${cat.surface0}`, paddingBottom: '8px' }}>
                <span style={{ color: cat.green }}>{String(timestamp ?? '')}</span>
                {' '}
                <span style={{ color: level === 'error' ? cat.red : cat.sapphire, fontWeight: 'bold' }}>
                  [{String(level ?? 'info').toUpperCase()}]
                </span>
                {' '}
                <span style={{ color: cat.text }}>{String(message ?? '')}</span>
                {Object.keys(rest).length > 0 && (
                  <pre style={{ margin: '4px 0 0 0', color: cat.subtext0, fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
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
