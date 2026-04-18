import { useEffect, useState } from 'react';
import { cat } from '../../theme.js';

const DAD_JOKES = [
  "Why don't scientists trust atoms? Because they make up everything.",
  "I'm reading a book about anti-gravity. It's impossible to put down.",
  "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
  "Why did the scarecrow win an award? Because he was outstanding in his field.",
  "I used to hate facial hair, but then it grew on me.",
  "What do you call cheese that isn't yours? Nacho cheese.",
  "Why can't you give Elsa a balloon? Because she'll let it go.",
  "I'm on a seafood diet. I see food and I eat it.",
  "What do you call a fake noodle? An impasta.",
  "How do you organize a space party? You planet.",
  "Why did the bicycle fall over? Because it was two-tired.",
  "What do you call a sleeping dinosaur? A dino-snore.",
  "I would tell you a construction joke, but I'm still working on it.",
  "Why do cows wear bells? Because their horns don't work.",
  "What did the ocean say to the beach? Nothing, it just waved.",
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function DadJokePopup({ visible, onClose }: Props) {
  const [joke, setJoke] = useState('');

  useEffect(() => {
    if (visible) {
      setJoke(DAD_JOKES[Math.floor(Math.random() * DAD_JOKES.length)]);
    }
  }, [visible]);

  if (!visible) return null;

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
          background: cat.mantle, borderRadius: '16px', padding: '36px 40px',
          maxWidth: '420px', width: '90%', boxShadow: '0 20px 60px rgba(17,17,27,0.6)',
          textAlign: 'center', border: `1px solid ${cat.surface1}`,
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>😄</div>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: cat.text, marginBottom: '24px' }}>
          {joke}
        </p>
        <button
          onClick={onClose}
          style={{
            background: cat.red, color: cat.crust, border: 'none',
            borderRadius: '8px', padding: '10px 28px', fontSize: '1rem',
            cursor: 'pointer', fontWeight: 600,
          }}
        >
          OK, let me search
        </button>
      </div>
    </div>
  );
}
