import { createContext, useContext, useState, type ReactNode } from 'react';

interface FeatureFlags {
  dadJokesEnabled: boolean;
}

interface FeatureFlagsContextValue {
  flags: FeatureFlags;
  setFlag: (key: keyof FeatureFlags, value: boolean) => void;
}

const STORAGE_KEY = 'feature_flags';

function loadFlags(): FeatureFlags {
  try {
    return { dadJokesEnabled: true, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') };
  } catch {
    return { dadJokesEnabled: true };
  }
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(null);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(loadFlags);

  function setFlag(key: keyof FeatureFlags, value: boolean) {
    setFlags(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <FeatureFlagsContext.Provider value={{ flags, setFlag }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags(): FeatureFlagsContextValue {
  const ctx = useContext(FeatureFlagsContext);
  if (!ctx) throw new Error('useFeatureFlags must be used inside FeatureFlagsProvider');
  return ctx;
}
