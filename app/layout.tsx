import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const poppins = Poppins({ 
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Growth Diary - Hành trình phát triển cá nhân',
  description: 'Ứng dụng nhật ký cảm xúc với AI hỗ trợ, theo dõi tâm trạng, và phân tích xu hướng phát triển cá nhân.',
  applicationName: 'Growth Diary',
  authors: [{ name: 'Growth Diary Team' }],
  generator: 'Next.js',
  keywords: ['nhật ký', 'cảm xúc', 'phát triển cá nhân', 'AI', 'tâm trạng', 'wellness'],
  referrer: 'origin-when-cross-origin',
  creator: 'Growth Diary Team',
  publisher: 'Growth Diary',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://growth-diary.com',
  },
  
  // Open Graph
  openGraph: {
    title: 'Growth Diary - Hành trình phát triển cá nhân',
    description: 'Ứng dụng nhật ký cảm xúc với AI hỗ trợ, theo dõi tâm trạng, và phân tích xu hướng phát triển cá nhân.',
    url: 'https://growth-diary.com',
    siteName: 'Growth Diary',
    locale: 'vi_VN',
    type: 'website',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Growth Diary - Hành trình phát triển cá nhân',
    description: 'Ứng dụng nhật ký cảm xúc với AI hỗ trợ, theo dõi tâm trạng, và phân tích xu hướng phát triển cá nhân.',
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  
  // Manifest
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8b5cf6' },
    { media: '(prefers-color-scheme: dark)', color: '#3b82f6' }
  ],
};

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/poppins-var.woff2" as="font" type="font/woff2" crossOrigin="" />
        
        {/* Viewport and Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Growth Diary" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Theme Colors */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#8b5cf6" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#3b82f6" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Growth Diary',
              description: 'Ứng dụng nhật ký cảm xúc với AI hỗ trợ, theo dõi tâm trạng, và phân tích xu hướng phát triển cá nhân.',
              url: 'https://growth-diary.com',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'VND',
              },
              author: {
                '@type': 'Organization',
                name: 'Growth Diary Team',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Growth Diary',
              },
              inLanguage: 'vi-VN',
              availableLanguage: ['vi-VN', 'en-US'],
            }),
          }}
        />
        
        {/* Performance Metrics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Web Vitals tracking
              (function() {
                const observer = new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                      console.log('LCP:', entry.startTime);
                    }
                    if (entry.entryType === 'first-input') {
                      console.log('FID:', entry.processingStart - entry.startTime);
                    }
                  }
                });
                observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
              })();
            `,
          }}
        />
      </head>
      <body 
        className={`
          font-inter bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 
          dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 
          antialiased selection:bg-purple-200 selection:text-purple-900
          dark:selection:bg-purple-800 dark:selection:text-purple-100
          overflow-x-hidden
        `}
        suppressHydrationWarning
      >
        {/* Loading Screen Fallback */}
        <div 
          id="loading-fallback" 
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600"
          style={{ display: 'none' }}
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-medium">Đang tải Growth Diary...</p>
          </div>
        </div>
        
        {/* Skip to Content Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-50 transition-all duration-300 hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
        >
          Bỏ qua tới nội dung chính
        </a>
        
        {/* Main Content */}
        <div id="main-content" className="relative min-h-screen">
          <Providers>
            {children}
          </Providers>
        </div>
        
        {/* Critical Error Boundary */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                console.error('Global error:', e.error);
                // You can add error reporting here
              });
              
              window.addEventListener('unhandledrejection', function(e) {
                console.error('Unhandled promise rejection:', e.reason);
                // You can add error reporting here
              });
            `,
          }}
        />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        
        {/* Accessibility Enhancements */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Keyboard navigation enhancement
              document.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                  document.body.classList.add('keyboard-nav');
                }
              });
              
              document.addEventListener('mousedown', function() {
                document.body.classList.remove('keyboard-nav');
              });
              
              // Reduced motion preference
              if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.style.setProperty('--animation-duration', '0.01ms');
              }
            `,
          }}
        />
      </body>
    </html>
  );
} 