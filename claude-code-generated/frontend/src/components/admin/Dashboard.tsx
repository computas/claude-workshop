import { useState, useEffect } from 'react';
import type { OrderStats, OrderStatus } from '@workshop/shared';
import { getAdminStats } from '../../api/orders.js';
import { cat, STATUS_COLORS } from '../../theme.js';

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Received',
  confirmed: 'Confirmed',
  canceled: 'Canceled',
  shipped: 'Shipped',
  delivered: 'Delivered',
  awaiting_return: 'Awaiting Return',
  returned: 'Returned',
};

const ALL_STATUSES: OrderStatus[] = ['received', 'confirmed', 'shipped', 'delivered', 'awaiting_return', 'returned', 'canceled'];

function KpiCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{
      background: cat.surface0, border: `1px solid ${cat.surface1}`,
      borderRadius: '12px', padding: '20px 24px',
      borderTop: `3px solid ${color ?? cat.blue}`,
    }}>
      <div style={{ fontSize: '0.85rem', color: cat.subtext0, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: '700', color: cat.text }}>{value}</div>
    </div>
  );
}

function BarChart({ stats }: { stats: OrderStats }) {
  const maxCount = Math.max(...ALL_STATUSES.map(s => stats.countByStatus[s]), 1);
  const chartH = 160;
  const barW = 36;
  const gap = 16;
  const labelH = 56;
  const chartW = ALL_STATUSES.length * (barW + gap) - gap;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        width={chartW + 40}
        height={chartH + labelH + 24}
        style={{ display: 'block' }}
      >
        {/* Y-axis gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map(frac => {
          const y = 8 + chartH * (1 - frac);
          return (
            <g key={frac}>
              <line x1={32} y1={y} x2={chartW + 40} y2={y} stroke={cat.surface1} strokeWidth={1} />
              <text x={28} y={y + 4} textAnchor="end" fontSize={10} fill={cat.overlay1}>
                {Math.round(maxCount * frac)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {ALL_STATUSES.map((status, i) => {
          const count = stats.countByStatus[status];
          const barH = count === 0 ? 2 : Math.max(4, (count / maxCount) * chartH);
          const x = 36 + i * (barW + gap);
          const y = 8 + chartH - barH;
          const color = STATUS_COLORS[status];

          return (
            <g key={status}>
              <rect x={x} y={y} width={barW} height={barH} rx={4} fill={color} opacity={0.85} />
              <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize={11} fill={cat.text} fontWeight="600">
                {count}
              </text>
              {/* Rotated label */}
              <text
                x={x + barW / 2}
                y={chartH + 20}
                textAnchor="end"
                fontSize={11}
                fill={cat.subtext1}
                transform={`rotate(-40, ${x + barW / 2}, ${chartH + 20})`}
              >
                {STATUS_LABELS[status]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function Dashboard() {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '24px', color: cat.subtext0 }}>Loading…</div>;
  if (error) return <div style={{ padding: '24px', color: cat.red }}>{error}</div>;
  if (!stats) return null;

  const activeOrders = stats.countByStatus.received + stats.countByStatus.confirmed + stats.countByStatus.shipped;
  const completionRate = stats.totalOrders === 0 ? 0 : Math.round((stats.countByStatus.delivered / stats.totalOrders) * 100);

  return (
    <div>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <KpiCard label="Total Orders" value={String(stats.totalOrders)} color={cat.blue} />
        <KpiCard label="Total Revenue" value={`${stats.totalRevenue.toLocaleString('nb-NO')} NOK`} color={cat.green} />
        <KpiCard label="Active Orders" value={String(activeOrders)} color={cat.peach} />
        <KpiCard label="Delivery Rate" value={`${completionRate}%`} color={cat.teal} />
      </div>

      {/* Bar chart */}
      <div style={{ background: cat.surface0, border: `1px solid ${cat.surface1}`, borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px', color: cat.text, fontSize: '1rem' }}>Orders by Status</h3>
        <BarChart stats={stats} />
      </div>
    </div>
  );
}
