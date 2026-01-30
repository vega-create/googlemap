import './globals.css'

export const metadata = {
  title: 'GBP 發文工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
