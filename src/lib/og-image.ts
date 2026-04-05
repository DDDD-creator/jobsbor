/**
 * OG (Open Graph) 社交分享图生成器
 * 为职位页、公司页、博客生成动态分享图片
 */

export interface OGImageConfig {
  type: 'job' | 'company' | 'blog' | 'default';
  title: string;
  subtitle?: string;
  salary?: string;
  company?: string;
  logo?: string;
  tags?: string[];
  background?: string;
}

/**
 * 生成 OG 图片 HTML 模板
 * 用于 Next.js 的 ImageResponse API
 */
export function generateOGImageHTML(config: OGImageConfig): string {
  const {
    type,
    title,
    subtitle,
    salary,
    company,
    tags = [],
    background = '#0a0f1c',
  } = config;

  // 背景渐变
  const gradients: Record<string, string> = {
    job: 'linear-gradient(135deg, #0a0f1c 0%, #1a1a2e 50%, #16213e 100%)',
    company: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    blog: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    default: 'linear-gradient(135deg, #0a0f1c 0%, #1a1a2e 100%)',
  };

  const bgColor = gradients[type] || gradients.default;

  // 标签渲染
  const tagsHTML = tags
    .slice(0, 4)
    .map(
      (tag) =>
        `<div style="display: inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); color: #818cf8; font-size: 16px; margin-right: 8px;">${tag}</div>`
    )
    .join('');

  // 薪资徽章
  const salaryHTML = salary
    ? `<div style="display: flex; align-items: center; padding: 8px 20px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 8px; margin-top: 20px;">
        <span style="color: white; font-size: 24px; font-weight: bold;">💰 ${salary}</span>
       </div>`
    : '';

  // 公司名
  const companyHTML = company
    ? `<div style="color: #94a3b8; font-size: 20px; margin-bottom: 8px;">@ ${company}</div>`
    : '';

  // 副标题
  const subtitleHTML = subtitle
    ? `<div style="color: #94a3b8; font-size: 20px; margin-bottom: 8px;">${subtitle}</div>`
    : '';

  return `
    <div style="display: flex; flex-direction: column; width: 1200px; height: 630px; background: ${bgColor}; padding: 60px;">
      <!-- 顶部品牌栏 -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 24px; font-weight: bold;">J</span>
          </div>
          <span style="color: white; font-size: 28px; font-weight: bold;">JobsBor</span>
        </div>
        <div style="color: #64748b; font-size: 18px;">jobsbor.com</div>
      </div>

      <!-- 主内容区 -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
        ${type === 'job' ? companyHTML : ''}
        ${type === 'job' ? subtitleHTML : ''}
        
        <h1 style="color: white; font-size: 48px; font-weight: bold; margin: 0 0 20px 0; line-height: 1.2; max-width: 800px;">
          ${title}
        </h1>
        
        ${salaryHTML}
        
        <div style="display: flex; flex-wrap: wrap; margin-top: 24px; gap: 8px;">
          ${tagsHTML}
        </div>
      </div>

      <!-- 底部信息 -->
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.1);">
        <div style="color: #64748b; font-size: 18px;">
          🌐 全球远程工作 · 华人友好 · 薪资透明
        </div>
        <div style="display: flex; align-items: center; gap: 8px; color: #6366f1; font-size: 18px;">
          <span>👉 立即查看</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Next.js ImageResponse 配置
 * 用于 API 路由生成 OG 图片
 */
export const OG_RESPONSE_OPTIONS = {
  width: 1200,
  height: 630,
  fonts: [
    {
      name: 'Inter',
      data: fetch(new URL('../fonts/Inter-Bold.ttf', import.meta.url)).then(
        (res) => res.arrayBuffer()
      ),
      weight: 700,
    },
    {
      name: 'Inter',
      data: fetch(new URL('../fonts/Inter-Regular.ttf', import.meta.url)).then(
        (res) => res.arrayBuffer()
      ),
      weight: 400,
    },
    {
      name: 'Noto Sans SC',
      data: fetch(
        new URL('../fonts/NotoSansSC-Bold.ttf', import.meta.url)
      ).then((res) => res.arrayBuffer()),
      weight: 700,
    },
  ],
} as const;
