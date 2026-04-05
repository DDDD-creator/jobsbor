'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 gradient-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>开启您的职业新篇章</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            准备好迈出下一步了吗？
          </h2>

          <p className="max-w-2xl mx-auto text-lg text-white/80 mb-10">
            无论您是寻找职业机会的求职者，还是寻找顶尖人才的企业，
            <br className="hidden sm:block" />
            GlobalRecruit 都是您的最佳选择
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup?type=candidate"
              className="btn bg-white text-primary hover:bg-white/90 btn-xl gap-2"
            >
              免费注册求职
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/signup?type=employer"
              className="btn border-2 border-white text-white hover:bg-white/10 btn-xl gap-2"
            >
              发布职位
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/60">
            无需信用卡 • 免费版永久可用 • 随时升级
          </p>
        </div>
      </div>
    </section>
  );
}
