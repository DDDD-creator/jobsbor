import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">订阅成功！</h1>
        <p className="text-muted-foreground mb-6">
          感谢您的订阅。您的账户已升级，现在可以享受所有高级功能了。
        </p>
        <div className="space-y-3">
          <Link href="/employer/dashboard">
            <Button className="w-full">进入控制台</Button>
          </Link>
          <Link href="/employer/payments">
            <Button variant="outline" className="w-full">查看支付历史</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
