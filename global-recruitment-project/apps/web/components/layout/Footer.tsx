import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github, 
  MessageCircle 
} from 'lucide-react';

const footerLinks = {
  product: {
    title: '产品',
    links: [
      { name: '找工作', href: '/jobs' },
      { name: '招人才', href: '/employers' },
      { name: '薪资洞察', href: '/salary' },
      { name: '行业报告', href: '/reports' },
      { name: '企业方案', href: '/enterprise' },
    ],
  },
  resources: {
    title: '资源',
    links: [
      { name: '求职指南', href: '/guides/job-seekers' },
      { name: '招聘指南', href: '/guides/employers' },
      { name: '简历模板', href: '/templates' },
      { name: '面试技巧', href: '/interview-tips' },
      { name: '职业发展', href: '/career-development' },
    ],
  },
  company: {
    title: '公司',
    links: [
      { name: '关于我们', href: '/about' },
      { name: '加入我们', href: '/careers' },
      { name: '新闻中心', href: '/press' },
      { name: '合作伙伴', href: '/partners' },
      { name: '联系我们', href: '/contact' },
    ],
  },
  legal: {
    title: '法律',
    links: [
      { name: '隐私政策', href: '/privacy' },
      { name: '服务条款', href: '/terms' },
      { name: 'Cookie政策', href: '/cookies' },
      { name: '数据安全', href: '/security' },
    ],
  },
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/globalrecruit', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/company/globalrecruit', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/globalrecruit', label: 'GitHub' },
  { icon: MessageCircle, href: 'https://discord.gg/globalrecruit', label: 'Discord' },
];

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <span className="text-lg font-bold text-white">G</span>
              </div>
              <span className="text-xl font-bold text-white">GlobalRecruit</span>
            </Link>
            <p className="text-sm text-neutral-400 mb-6 max-w-xs">
              连接全球顶尖金融与互联网人才的机会。AI驱动的智能匹配，让您的职业生涯腾飞。
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:contact@globalrecruit.com" className="hover:text-primary transition-colors">
                  contact@globalrecruit.com
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+86-400-888-8888" className="hover:text-primary transition-colors">
                  400-888-8888
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>上海市浦东新区</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} GlobalRecruit. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-neutral-400 hover:text-primary hover:bg-neutral-800 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
