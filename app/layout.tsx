import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SoloStack 独立接单工具箱 — 从报价到回款与口碑',
  description: '按当前卡点进入最短解决路径：报价、跟进、月费、范围、客户风险、催款、利润、客户口碑与完整经营系统。',
  metadataBase: new URL('https://chenxiaolong-maxgent.github.io/solostack-cn/'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'SoloStack 独立接单工具箱 — 从报价，到回款与口碑',
    description: '8 个免费工具、7 个成品商品、5 项产品化服务，按经营卡点进入最短解决路径。',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'SoloStack 独立接单工具箱' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoloStack 独立接单工具箱 — 从报价，到回款与口碑',
    description: '免费工具、成交模板与经营系统，一处选对下一步。',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
