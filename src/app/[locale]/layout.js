'use client';

import { notFound } from 'next/navigation';
import './globals.css';
import { Inter, Almarai } from 'next/font/google'; // Import Almarai font from Google
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { NextIntlClientProvider } from 'next-intl';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });
const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'], // Specify the available weights
  display: 'swap',
  variable: '--font-almarai',
});

export default function RootLayout({ children, params }) {
  const locale = params?.locale || 'en';

  // Import messages dynamically based on locale
  let messages;
  try {
    messages = require(`../../../messages/${locale}.json`);
  } catch (error) {
    notFound();
  }

  // Determine if layout should be RTL or LTR based on the locale
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className={`${almarai.variable}`}>
      <body className={isRTL ? almarai.className : inter.className}>
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
