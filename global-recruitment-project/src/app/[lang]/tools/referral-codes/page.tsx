'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const REFERRALS = [
  { company: 'Google', code: 'GOOG-2024-001', position: '软件工程师', rate: '85%' },
  { company: 'Amazon', code: 'AMZN-SDE-2024', position: 'SDE I/II/III', rate: '82%' },
  { company: '字节跳动', code: 'BYTE-DANCE-01', position: '后端开发', rate: '88%' },
  { company: '阿里巴巴', code: 'ALI-P6-2024', position: 'P6开发工程师', rate: '86%' },
  { company: '腾讯', code: 'TENCENT-WXG-01', position: 'WXG微信开发', rate: '88%' },
  { company: 'Microsoft', code: 'MSFT-SDE-2024', position: 'Software Engineer', rate: '83%' },
];

export default function ReferralCodesPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🎁 内推码</h1>
        <p className="text-gray-600 mb-6">使用内推码，让你的简历优先被HR查看</p>
        <div className="space-y-4">
          {REFERRALS.map((r) => (
            <div key={r.code} className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{r.company}</span>
                  <span className="text-sm text-green-600">{r.rate} 成功率</span>
                </div>
                <p className="text-sm text-gray-500">{r.position}</p>
                <p className="font-mono text-lg text-gray-700 mt-1">{r.code}</p>
              </div>
              <button
                onClick={() => handleCopy(r.code)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${copied === r.code ? 'bg-green-500 text-white' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
              >
                {copied === r.code ? <><Check className="w-4 h-4" /> 已复制</> : <><Copy className="w-4 h-4" /> 复制</>}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a href="/tools" className="text-gray-600 hover:text-gray-900">← 返回工具箱</a>
        </div>
      </div>
    </div>
  );
}