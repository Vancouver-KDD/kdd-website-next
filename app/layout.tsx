import type {Metadata} from 'next'
import HeaderNav from './HeaderNav'
import './globals.css'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {CSPostHogProvider} from './providers'
import KofiWidgetOverlay from '@/components/KofiWidgetOverlay'
import {Noto_Sans_KR} from 'next/font/google'
import {Toaster} from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Vancouver KDD | 밴쿠버 KDD | 한인 개발자 디자이너 모임',
  description:
    '저희는 밴쿠버 한인 개발자 디자이너로 이루어져 있으며 네트워킹 및 한인 사회에 기여를 추구하는 모임 입니다.',
}

const notoSansKR = Noto_Sans_KR({
  weight: 'variable',
  display: 'auto',
  subsets: ['latin'],
})

// React fetch requests are automatically memoized (on the server) by default.
// Revalidate all fetch requests every 2 minutes so airtable data is at most outdated by 2 mins.
export const revalidate = 120

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="kr" className={notoSansKR.className}>
      <CSPostHogProvider>
        <body>
          <div className="absolute inset-x-0">
            <HeaderNav />
          </div>
          <Toaster position="top-center" />
          {children}
          <SpeedInsights />
          <KofiWidgetOverlay />
        </body>
      </CSPostHogProvider>
    </html>
  )
}
