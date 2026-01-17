/**
 * Context for global application configuration
 * Fetches config from backend and provides it throughout the app
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  configService,
  type GlobalConfig,
  type FederationConfig,
} from "../services/configService";
import { FederationType } from "../types/enums";

interface ConfigContextValue {
  config: GlobalConfig | null;
  loading: boolean;
  error: Error | null;
  getFederationConfig: (id: FederationType) => FederationConfig | null;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useState<GlobalConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchConfig = async () => {
      try {
        setLoading(true);
        const data = await configService.getGlobalConfig();
        if (!cancelled) {
          setConfig(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error("Failed to load config")
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  const getFederationConfig = (id: FederationType): FederationConfig | null => {
    if (!config || id === FederationType.ALREADY_FEDERATED) {
      return null;
    }
    return config.federations.find((f: FederationConfig) => f.id === id) || null;
  };

  return (
    <ConfigContext.Provider
      value={{ config, loading, error, getFederationConfig }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

/**
 * Hook to access the global configuration
 */
export function useConfig(): ConfigContextValue {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
