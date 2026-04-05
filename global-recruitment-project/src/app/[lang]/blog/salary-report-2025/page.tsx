export default function SalaryReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <div className="mb-8">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">🔥 病毒报告</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">2025年金融与Web3行业薪资真相报告</h1>
          <p className="text-gray-500 mt-2">数据来源：Jobsbor全球职位分析 | 样本量：10,503个职位</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <h2 className="text-xl font-bold mb-4">📊 核心发现</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-500">传统金融</p>
              <p className="text-2xl font-bold">$185k</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Web3/加密</p>
              <p className="text-2xl font-bold text-green-700">$220k</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600">Quant/高频</p>
              <p className="text-2xl font-bold text-purple-700">$350k</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3">🔥 最抢手职位</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>ZK工程师 - 需求增长400%，平均$250k-$350k</li>
              <li>AI+量化研究员 - 年薪可达$500k-$1M</li>
              <li>DeFi协议架构师 - 年薪$200k-$350k</li>
              <li>区块链安全审计 - 时薪$200-$500</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-900">💡 最佳工作地</h3>
            <p className="text-blue-800">迪拜（零税）+ 远程工作（灵活性）= 最佳性价比</p>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <a href="/tools/salary-comparison" className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg font-semibold">
            💰 查询更多薪资
          </a>
          <a href="/jobs" className="flex-1 bg-green-600 text-white text-center py-3 rounded-lg font-semibold">
            🔍 浏览10,000+职位
          </a>
        </div>
      </div>
    </div>
  );
}
