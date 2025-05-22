import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SiteDataProvider } from '@/lib/SiteDataContext';
import '@/styles/globals.css';

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${inter.variable} font-sans`}>
      <ThemeProvider>
        <SiteDataProvider>
          <Component {...pageProps} />
        </SiteDataProvider>
      </ThemeProvider>
    </main>
  );
} 