'use client';

import { useLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import './globals.css';
import { Inter, Almarai } from 'next/font/google'; // Import Almarai font from Google
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { NextIntlClientProvider } from 'next-intl';
import arMessages from './../../../messages/ar.json';
import enMessages from './../../../messages/en.json';

const inter = Inter({ subsets: ['latin'] });
const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'], // Specify the available weights
});
export default function RootLayout({ children }) {
  const locale = useLocale() || 'en'; // Default to 'en' if locale is undefined
  const messages = {
    en: enMessages,
    ar: arMessages,
  };

  if (!messages[locale]) {
    return notFound();
  }

  // Determine if layout should be RTL or LTR based on the locale
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <link rel='preconnect' href='https://fonts.googleapis.com'></link>
      <link
        rel='preconnect'
        href='https://fonts.gstatic.com'
        crossorigin></link>
      <link
        href='https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap'
        rel='stylesheet'></link>
      {/* Set the direction dynamically */}
      <body className={isRTL ? almarai.className : inter.className}>
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages[locale]}>
            {children}
          </NextIntlClientProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
