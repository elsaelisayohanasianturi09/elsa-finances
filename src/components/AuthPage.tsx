
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { PiggyBank, Heart, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Waduh, ada yang salah! 😅",
            description: error.message === "Invalid login credentials" 
              ? "Email atau password salah nih! Coba cek lagi ya~"
              : error.message
          });
        } else {
          toast({
            title: "Yeay! Selamat datang kembali! 🎉",
            description: "Ayo lanjut kelola keuangan dengan bijak!"
          });
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message?.includes('User already registered') || error.message?.includes('already registered')) {
            toast({
              variant: "destructive",
              title: "Email sudah terdaftar! 📧",
              description: "Coba login atau gunakan email lain ya!"
            });
          } else if (error.message?.includes('Password should be at least 6 characters')) {
            toast({
              variant: "destructive",
              title: "Password terlalu pendek! 🔒",
              description: "Password minimal 6 karakter ya!"
            });
          } else {
            toast({
              variant: "destructive",
              title: "Oops! Ada masalah nih 😓",
              description: error.message || "Coba lagi dalam beberapa saat ya..."
            });
          }
        } else {
          toast({
            title: "Akun berhasil dibuat! 🎊",
            description: "Selamat! Sekarang kamu bisa login! 🚀"
          });
          // Auto switch to login after successful signup
          setIsLogin(true);
          setPassword(''); // Clear password for security
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ada error nih! 🤔",
        description: "Coba lagi dalam beberapa saat ya..."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-white/10 dark:bg-black/20"></div>
      
      <Card className="w-full max-w-md relative z-10 soft-shadow border-0 bg-card/98 backdrop-blur-lg">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse shadow-lg">
                <PiggyBank className="h-8 w-8 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-yellow-400 animate-bounce" />
            </div>
          </div>
          
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {isLogin ? 'Hai lagi, Elsa! 👋' : 'Halo, Elsa! 🌟'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              {isLogin 
                ? 'Yuk lanjut kelola uang dengan bijak! 💰' 
                : 'Mari mulai perjalanan finansial yang seru! ✨'
              }
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-semibold text-foreground">
                  Nama Lengkap
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap kamu ✨"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="border-2 focus:border-indigo-400 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contoh@email.com 📧"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 focus:border-indigo-400 bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password yang kuat ya! 🔒"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="border-2 focus:border-indigo-400 bg-background text-foreground placeholder:text-muted-foreground pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground">Minimal 6 karakter ya! 💪</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>{isLogin ? 'Masuk Yuk! 🚀' : 'Daftar Sekarang! 🎉'}</span>
                </div>
              )}
            </Button>
          </form>

          <div className="text-center space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">atau</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
              </p>
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/50 mt-1"
              >
                {isLogin ? 'Daftar di sini! ✨' : 'Masuk di sini! 👆'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
