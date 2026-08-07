export const metadata = {
  title: 'あこ告 本質タイプ診断',
  description: '愛され四柱推命 本質タイプ算出アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f9f8f6' }}>
        {children}
      </body>
    </html>
  )
}
