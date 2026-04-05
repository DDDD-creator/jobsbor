import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { ContactForm } from '@/components/contact/contact-form'
import { Mail, MessageCircle, MapPin } from 'lucide-react'
import { loadTranslations } from '@/i18n/loader'
import type { Locale } from '@/i18n/config'

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params
  const t = await loadTranslations(lang)
  
  return {
    title: `${t.contact.title} | Jobsbor`,
    description: t.contact.subtitle,
  }
}

export default async function ContactPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const t = await loadTranslations(lang)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent mb-4">
              {t.contact.title}
            </h1>
            <p className="text-gray-400 text-lg">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 联系方式 */}
            <div className="space-y-6">
              <Card className="border-white/10 bg-white/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-neon-cyan" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{t.contact.email}</h3>
                      <p className="text-gray-400">{t.contact.emailValue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-neon-purple" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{t.contact.telegram}</h3>
                      <p className="text-gray-400">{t.contact.telegramValue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-pink/20 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-neon-pink" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{t.contact.address}</h3>
                      <p className="text-gray-400">{t.contact.addressValue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 联系表单 */}
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">{t.contact.formTitle}</h2>
                <ContactForm translations={t.contact} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
