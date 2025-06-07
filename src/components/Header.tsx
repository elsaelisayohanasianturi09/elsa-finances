
import React from 'react';
import { Moon, Sun, PiggyBank, LogOut, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/98 backdrop-blur-lg emoji-bg soft-shadow">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 soft-shadow">
              <PiggyBank className="h-7 w-7 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-bounce" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Elsa Finance ✨
            </h1>
            <p className="text-sm text-muted-foreground font-bold">
              Yuk kelola uang dengan bijak! 💰
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="h-10 px-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive font-bold"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
