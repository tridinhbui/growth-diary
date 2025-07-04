'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChatRoom from '@/components/ChatRoom';
import { ArrowLeft, TreePine } from 'lucide-react';
import { auth } from '@/lib/auth';

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const user = auth.currentUser;
    setIsAuthenticated(!!user);
    setIsLoading(false);
    
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-white/10 via-white/5 to-transparent backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Về trang chủ
              </Link>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <TreePine className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Cộng Đồng Ẩn Danh</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Chia Sẻ & Hỗ Trợ Lẫn Nhau
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Đây là không gian an toàn để bạn chia sẻ cảm xúc và kết nối với cộng đồng. 
            Tất cả cuộc trò chuyện đều ẩn danh và tôn trọng quyền riêng tư.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Room */}
          <div className="lg:col-span-3">
            <ChatRoom />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Community Guidelines */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Quy Tắc Cộng Đồng</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Tôn trọng và lắng nghe nhau</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Chia sẻ những trải nghiệm tích cực</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Hỗ trợ khi ai đó cần</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Không spam hay quảng cáo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Không chia sẻ thông tin cá nhân</span>
                  </li>
                </ul>
              </div>

              {/* Help & Support */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Hỗ Trợ</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
                  <p>
                    Nếu bạn đang trải qua khủng hoảng tâm lý, hãy liên hệ:
                  </p>
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <p className="font-medium text-red-800 dark:text-red-400">Đường dây nóng</p>
                    <p className="text-red-700 dark:text-red-300">📞 1800-1234</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">Hoạt động 24/7</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-medium text-blue-800 dark:text-blue-400">Tư vấn trực tuyến</p>
                    <p className="text-blue-700 dark:text-blue-300">🌐 counseling.vn</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Thống Kê</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Người dùng online</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tin nhắn hôm nay</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">147</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Lượt hỗ trợ</span>
                    <span className="text-sm font-medium text-pink-600 dark:text-pink-400">89</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Mẹo Nhỏ</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>💡 Sử dụng emoji để thể hiện cảm xúc</p>
                  <p>🤝 Nhấn "🤝" để đồng cảm</p>
                  <p>❤️ Nhấn "❤️" để ủng hộ</p>
                  <p>⏰ Chat hoạt động tốt nhất vào buổi tối</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 