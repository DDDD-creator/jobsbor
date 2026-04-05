'use client';

import { useState } from 'react';

const QUESTIONS = [
  { id: '1', company: 'Google', question: '解释 TCP 三次握手的过程', difficulty: '中等' },
  { id: '2', company: 'Google', question: '设计一个 LRU 缓存', difficulty: '困难' },
  { id: '3', company: 'Amazon', question: '描述一个你解决复杂问题的经历', difficulty: '中等' },
  { id: '4', company: '字节跳动', question: '设计一个短链接服务', difficulty: '中等' },
  { id: '5', company: '阿里巴巴', question: '设计一个秒杀系统', difficulty: '困难' },
];

export default function InterviewQuestionsPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">📚 面试题库</h1>
        <div className="space-y-4">
          {QUESTIONS.map((q, i) => (
            <div key={q.id} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">{q.company}</span>
                <span className={`px-2 py-1 rounded text-xs ${q.difficulty === '困难' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{q.difficulty}</span>
              </div>
              <p className="text-lg font-medium text-gray-900">{i + 1}. {q.question}</p>
              <button onClick={() => setShowLogin(true)} className="mt-3 text-purple-600 text-sm hover:underline">
                🔒 查看答案
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a href="/tools" className="text-gray-600 hover:text-gray-900">← 返回工具箱</a>
        </div>
      </div>
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLogin(false)}>
          <div className="bg-white p-8 rounded-2xl max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">查看答案需要登录</h3>
            <p className="text-gray-600 mb-4">注册 Jobsbor 账号即可查看所有面试题答案</p>
            <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold">免费注册</button>
            <button onClick={() => setShowLogin(false)} className="w-full py-3 mt-2 text-gray-600">稍后再说</button>
          </div>
        </div>
      )}
    </div>
  );
}