'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Brain, Mail, User, ArrowRight, Sparkles } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'demo@growthiary.com',
    name: 'Demo User'
  });

  // Check if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading time for better UX
    setTimeout(() => {
      auth.signIn(formData.email, formData.name);
      router.push('/');
    }, 2000);
  };

  const handleQuickLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      auth.signIn('demo@growthiary.com', 'Demo User');
      router.push('/');
    }, 1500);
  };

  if (isLoading) {
    return <LoadingScreen type="default" isLoading={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Magical Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute animate-float rounded-full bg-white/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Login Card */}
        <div className="glass-card p-8 rounded-3xl border border-white/20 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 animate-pulse-soft">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Growth Diary
            </h1>
            <p className="text-white/70 text-sm">
              Hành trình phát triển cá nhân của bạn
            </p>
          </div>

          {/* Quick Login Button */}
          <div className="mb-6">
            <button
              onClick={handleQuickLogin}
              className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg font-semibold"
            >
              <Sparkles className="w-5 h-5" />
              Vào thẳng Demo App
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/70">hoặc</span>
            </div>
          </div>

          {/* Custom Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Tên hiển thị
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Tên của bạn"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              {isLoading ? (
                <>
                  <div className="spinner w-5 h-5" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Bắt đầu hành trình
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-xs">
              ✨ Đây là demo app - không cần mật khẩu thật
            </p>
            <p className="text-white/60 text-xs mt-1">
              🔒 Dữ liệu lưu trữ trên máy bạn (localStorage)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/50 text-sm">
            Made with ✨ magic and 💜 passion
          </p>
        </div>
      </div>
    </div>
  );
} 