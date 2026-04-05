import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const metaConfig: Record<string, { title: string; desc: string; locale: string }> = {
    zh: {
      title: '金融/Web3/互联网招聘平台 | Jobsbor',
      desc: 'Jobsbor是专注于金融、Web3、互联网行业的高端招聘平台。汇聚510+优质职位，涵盖投行、区块链、产品经理等高薪岗位。',
      locale: 'zh_CN',
    },
    en: {
      title: 'Jobsbor | Finance, Web3 & Tech Recruitment',
      desc: 'Jobsbor is a premium recruitment platform for finance, Web3, and internet industries. 510+ quality positions.',
      locale: 'en_US',
    },
    ja: {
      title: 'Jobsbor | 金融・Web3・テック採用プラットフォーム',
      desc: 'Jobsborは金融、Web3、インターネット業界に特化したプレミアム採用プラットフォームです。',
      locale: 'ja_JP',
    },
    ko: {
      title: 'Jobsbor | 금융/Web3/테크 채용 플랫폼',
      desc: 'Jobsbor는 금융, Web3, 인터넷 산업에 특화된 프리미엄 채용 플랫폼입니다.',
      locale: 'ko_KR',
    },
  };

  const config = metaConfig[lang] || metaConfig.zh;

  return {
    title: {
      default: config.title,
      template: '%s | Jobsbor',
    },
    description: config.desc,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://jobsbor.vercel.app'
    ),
    openGraph: {
      type: 'website',
      locale: config.locale,
      title: config.title,
      description: config.desc,
      siteName: 'Jobsbor',
      images: [
        { url: '/og-image.jpg', width: 1200, height: 630, alt: 'Jobsbor' },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.desc,
      images: ['/og-image.jpg'],
    },
    robots: { index: true, follow: true },
  };
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
