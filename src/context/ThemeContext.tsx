import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
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
  const systemTheme = useColorScheme(); // device theme
  const [theme, setTheme] = useState<Theme>("dark");

  // Load saved theme
  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem("theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      } else {
        // fallback to system theme
        setTheme(systemTheme === "light" ? "light" : "dark");
      }
    };
    loadTheme();
  }, []);

  // Save theme
  useEffect(() => {
    AsyncStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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