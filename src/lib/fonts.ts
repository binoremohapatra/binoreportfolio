import { Inter, JetBrains_Mono } from 'next/font/google';

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// We keep fontSerif just to prevent layout breaking if it's used elsewhere, but we map it to sans
export const fontSerif = Inter({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});
