import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors, ThemeType } from "../constants/theme";

const STORAGE_KEY = "APP_THEME";

interface ThemeContextType {
  theme: ThemeType;
  colors: (typeof Colors)[ThemeType];
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(
    systemTheme === "dark" ? "dark" : "light"
  );
  const [hasUserTheme, setHasUserTheme] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        setHasUserTheme(true);
      } else {
        setTheme(systemTheme === "dark" ? "dark" : "light");
        setHasUserTheme(false);
      }
    };

    loadTheme();
  }, [systemTheme]);

  useEffect(() => {
    if (!hasUserTheme) {
      setTheme(systemTheme === "dark" ? "dark" : "light");
    }
  }, [hasUserTheme, systemTheme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "light" ? "dark" : "light";
      AsyncStorage.setItem(STORAGE_KEY, nextTheme);
      return nextTheme;
    });
    setHasUserTheme(true);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: Colors[theme],
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useTheme must be used within a ThemeProvider"
    );
  }
  return context;
}
