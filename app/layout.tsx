import './globals.css'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '社群發文工具',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white shadow-sm mb-6">
          <div className="max-w-4xl mx-auto px-4 py-3 flex gap-6">
            <Link href="/gbp-post" className="text-gray-700 hover:text-blue-600 font-medium">
              📝 發布貼文
            </Link>
            <Link href="/posts" className="text-gray-700 hover:text-blue-600 font-medium">
              📋 發布紀錄
            </Link>
            <Link href="/guide" className="text-gray-700 hover:text-blue-600 font-medium">
              ❓ 使用說明
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
