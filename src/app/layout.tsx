import type { Metadata, Viewport } from 'next';
import './globals.css';

// 禁止 CDN/Next 长期缓存 HTML，避免「旧 HTML 引用已不存在的旧 JS chunk」导致水合失败、页面能看不能点
export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: '火锅套餐毛利率计算器',
    template: '%s | 火锅套餐毛利率计算器',
  },
  description: '面向餐饮从业者的火锅套餐毛利率计算器，支持多套餐对比、成本结构可视化、数据库同步',
  keywords: [
    '火锅套餐毛利率计算器',
    '餐饮成本核算',
    '毛利率计算',
    '套餐定价',
  ],
  authors: [{ name: '火锅成本核算工具' }],
  openGraph: {
    title: '火锅套餐毛利率计算器',
    description: '面向餐饮从业者的火锅套餐毛利率计算器，支持多套餐对比、成本结构可视化、数据库同步',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {/* 内联首屏 Loading 关键样式 — 避免 CSS 加载前看到裸文字 */}
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
          body{margin:0;background:#fff;}
          .loading-wrap{
            position:fixed;inset:0;z-index:9999;
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            background:#fff;font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;
          }
          .loading-hotpot{
            width:64px;height:64px;margin-bottom:20px;position:relative;
            display:flex;align-items:center;justify-content:center;
          }
          .loading-pot{
            width:48px;height:32px;background:#e0322d;border-radius:0 0 24px 24px;position:relative;top:6px;
          }
          .loading-pot::before{
            content:"";position:absolute;top:-6px;left:-4px;width:56px;height:8px;
            background:#c02823;border-radius:4px;
          }
          .loading-pot::after{
            content:"";position:absolute;top:8px;left:-10px;width:8px;height:14px;
            border:3px solid #c02823;border-radius:50%;
            box-shadow:56px 0 0 -1px #c02823;
          }
          .loading-steam{position:absolute;top:-12px;left:50%;transform:translateX(-50%);display:flex;gap:6px;}
          .loading-steam span{
            display:block;width:4px;height:14px;background:#e5e7eb;border-radius:2px;
            animation:loading-steam 1.4s ease-in-out infinite;
          }
          .loading-steam span:nth-child(1){animation-delay:0s;}
          .loading-steam span:nth-child(2){animation-delay:.15s;}
          .loading-steam span:nth-child(3){animation-delay:.3s;}
          .loading-steam span:nth-child(4){animation-delay:.45s;}
          .loading-steam span:nth-child(5){animation-delay:.6s;}
          @keyframes loading-steam{
            0%,100%{opacity:.2;transform:translateY(0) scaleY(.8);}
            50%{opacity:.9;transform:translateY(-6px) scaleY(1.2);}
          }
          .loading-brand{font-size:16px;color:#1f2329;font-weight:600;margin-bottom:8px;}
          .loading-dots{font-size:13px;color:#6b7280;}
          .loading-dots::after{
            content:"...";display:inline-block;width:1.2em;text-align:left;
            animation:loading-dots 1.2s steps(4,end) infinite;
          }
          @keyframes loading-dots{
            0%{content:"";}
            25%{content:".";}
            50%{content:"..";}
            75%{content:"...";}
            100%{content:"";}
          }
        `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
