'use client';

import { notFound } from 'next/navigation';
import './globals.css';
import { Inter, Almarai } from 'next/font/google'; // Import Almarai font from Google
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { NextIntlClientProvider } from 'next-intl';
import Layout from '../components/Layout/Layout';

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
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-TWKSZ0CR1R"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TWKSZ0CR1R');
            `,
          }}
        />
        
        {/* Hotjar Tracking Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:397196,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
        
        {/* ContentSquare */}
        <script src="https://t.contentsquare.net/uxa/7a619070550dc.js"></script>
      </head>
      <body className={isRTL ? almarai.className : inter.className}>
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Layout>{children}</Layout>
            <Toaster />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
