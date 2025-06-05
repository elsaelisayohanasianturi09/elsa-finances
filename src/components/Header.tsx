
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
    <header className="sticky top-0 z-50 w-full border-b-2 border-purple-200 bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg">
              <PiggyBank className="h-7 w-7 text-purple-600" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-bounce" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">
              Elsa Finance ✨
            </h1>
            <p className="text-sm text-purple-100 font-bold">
              Yuk kelola uang dengan bijak! 💰
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl bg-white/20 hover:bg-white/30 text-white"
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
            className="h-10 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold"
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
