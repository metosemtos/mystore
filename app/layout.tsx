'use client';

import './globals.css';
import { ReactNode } from 'react';
import Link from 'next/link';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>True Mode</title>
        <meta name="description" content="True Mode - متجر إلكتروني للأزياء والإلكترونيات" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <header className="border-b bg-white shadow-sm">
          <div className="container-custom py-4">
            <div className="flex justify-between items-center">
              <nav className="flex justify-between w-full items-center">
                <a href="/" className="flex items-center">
                  <span className="text-2xl font-bold text-primary">True Mode</span>
                </a>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          {children}
        </main>
        
        <footer className="bg-white border-t py-8">
          <div className="container-custom">
            <div className="text-center">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} True Mode. جميع الحقوق محفوظة.</p>
              <div className="mt-4">
                <Link href="/about" className="text-gray-500 hover:text-primary mx-2">من نحن</Link>
                <Link href="/contact" className="text-gray-500 hover:text-primary mx-2">اتصل بنا</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}