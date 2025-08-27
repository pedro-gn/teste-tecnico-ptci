import { Roboto } from 'next/font/google';
import { Metadata } from 'next';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import darkTheme from '@/theme';

import React from 'react'

import "./globals.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});


export const metadata: Metadata = {
  title: {
    default: 'Jogateca', 
    template: '%s | Jogateca',
  },
  description: 'Explore an infinite list of amazing games.',
};

export default function RootLayout({ children } : { children : React.ReactNode}) {
   return (
    <html lang="en" className={roboto.variable}>
       <body>
          <AppRouterCacheProvider>
           <ThemeProvider theme={darkTheme}>
               <CssBaseline />
               {children}
           </ThemeProvider>
          </AppRouterCacheProvider>
       </body>
     </html>
   );
 }
