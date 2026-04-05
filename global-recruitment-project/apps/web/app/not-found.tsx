import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">页面未找到</h1>
        <p className="text-muted-foreground mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
            返回首页
          </Link>
          <Link href="/jobs" className="px-6 py-3 border rounded-xl font-medium hover:bg-accent transition-colors">
            浏览职位
          </Link>
        </div>
      </div>
    </div>
  );
}
