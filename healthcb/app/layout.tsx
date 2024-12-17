import '../styles/globals.css';
import { Karla, DM_Sans } from 'next/font/google';

const karla = Karla({ 
  subsets: ['latin'],
  variable: '--font-karla',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${karla.variable} ${dmSans.variable} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}