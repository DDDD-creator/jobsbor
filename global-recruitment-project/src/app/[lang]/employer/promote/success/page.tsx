import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PromoteSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">推广创建成功！</h1>
        <p className="text-muted-foreground mb-6">
          您的职位推广已激活，预计将在几分钟内生效。您可以在推广管理页面查看效果。
        </p>
        <div className="space-y-3">
          <Link href="/employer/jobs">
            <Button className="w-full">查看我的职位</Button>
          </Link>
          <Link href="/employer/promotions">
            <Button variant="outline" className="w-full">推广管理</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
