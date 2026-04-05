import { HeroSection } from '@/components/layout/HeroSection';
import { StatsSection } from '@/components/layout/StatsSection';
import { FeaturesSection } from '@/components/layout/FeaturesSection';
import { IndustriesSection } from '@/components/layout/IndustriesSection';
import { TestimonialsSection } from '@/components/layout/TestimonialsSection';
import { CTASection } from '@/components/layout/CTASection';
import { FeaturedJobs } from '@/components/jobs/FeaturedJobs';
import { TopCompanies } from '@/components/companies/TopCompanies';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-0">
      {/* Hero Section - 首屏视觉冲击 */}
      <HeroSection />

      {/* Stats Section - 数据建立信任 */}
      <StatsSection />

      {/* Featured Jobs - 展示优质职位 */}
      <FeaturedJobs />

      {/* Features Section - 核心功能介绍 */}
      <FeaturesSection />

      {/* Industries Section - 行业覆盖 */}
      <IndustriesSection />

      {/* Top Companies - 顶级企业合作 */}
      <TopCompanies />

      {/* Testimonials Section - 用户评价 */}
      <TestimonialsSection />

      {/* CTA Section - 最终转化 */}
      <CTASection />
    </div>
  );
}
