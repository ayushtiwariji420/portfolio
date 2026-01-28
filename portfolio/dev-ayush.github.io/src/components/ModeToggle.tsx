import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "../contexts/ThemeProvider";
import { useEffect, useState } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

type Theme = "dark" | "light" | "system";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState(theme || "light");

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

  return (
    <div className="fixed top-4 right-4 z-50"> {/* Ensure the button is always on top */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="bg-transparent border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            {currentTheme === "dark" ? (
              <LightModeIcon className="text-yellow-500" />
            ) : (
              <DarkModeIcon className="text-blue-500" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleThemeChange("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
            Dark
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
