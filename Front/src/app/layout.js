import { Inter } from 'next/font/google'
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Inventario RGM',
  description: 'Inventario registros garantias mobiliarias',
  icons: {
    icon: '/icon.png', // /public path
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='fondo'>
      <head>
        <link rel='stylesheet' href='https://bootswatch.com/5/cosmo/bootstrap.min.css'/>
        <link rel="stylesheet" href="https://cdn.datatables.net/v/bs5/dt-1.13.4/datatables.min.css" />
        <link rel="stylesheet" href="https://cdn.datatables.net/1.12.1/css/dataTables.bootstrap5.min.css" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
