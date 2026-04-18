import { useFeatureFlags } from '../../context/FeatureFlagsContext.js';
import { cat } from '../../theme.js';

interface Props {
  onClose: () => void;
}

export function FeatureFlagsPopup({ onClose }: Props) {
  const { flags, setFlag } = useFeatureFlags();

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(17,17,27,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: cat.mantle, borderRadius: '16px', padding: '32px',
          minWidth: '320px', boxShadow: '0 20px 60px rgba(17,17,27,0.6)',
          border: `1px solid ${cat.surface1}`,
        }}
      >
        <h2 style={{ margin: '0 0 24px', color: cat.text, fontSize: '1.2rem' }}>Feature Flags</h2>

        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '24px' }}>
          <span style={{ fontSize: '0.95rem', color: cat.subtext1 }}>Dad Jokes on Search</span>
          <input
            type="checkbox"
            checked={flags.dadJokesEnabled}
            onChange={e => setFlag('dadJokesEnabled', e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </label>

        <button
          onClick={onClose}
          style={{
            marginTop: '28px', width: '100%', padding: '10px',
            background: cat.surface0, color: cat.text, border: `1px solid ${cat.surface2}`,
            borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 600,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
