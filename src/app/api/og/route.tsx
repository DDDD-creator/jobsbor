/**
 * OG 图片生成 API 路由
 * GET /api/og?title=xxx&company=xxx&salary=xxx
 */

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'JobsBor - 全球远程工作'
    const company = searchParams.get('company') || ''
    const salary = searchParams.get('salary') || ''

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '1200px',
            height: '630px',
            background: 'linear-gradient(135deg, #0a0f1c 0%, #1a1a2e 100%)',
            padding: '60px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '60px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                J
              </div>
              <span style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>JobsBor</span>
            </div>
            <span style={{ color: '#64748b', fontSize: '18px' }}>jobsbor.com</span>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {company && (
              <div style={{ color: '#94a3b8', fontSize: '20px', marginBottom: '8px' }}>
                @ {company}
              </div>
            )}
            <h1
              style={{
                color: 'white',
                fontSize: '48px',
                fontWeight: 'bold',
                margin: '0 0 20px 0',
                lineHeight: 1.2,
                maxWidth: '800px',
              }}
            >
              {title}
            </h1>

            {salary && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 20px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '8px',
                  marginTop: '20px',
                  width: 'fit-content',
                }}
              >
                <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                  💰 {salary}
                </span>
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '40px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span style={{ color: '#64748b', fontSize: '18px' }}>
              🌐 全球远程工作 · 华人友好 · 薪资透明
            </span>
            <span style={{ color: '#6366f1', fontSize: '18px' }}>👉 立即查看</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error('OG Image generation failed:', e)
    return new Response('Failed to generate OG image', { status: 500 })
  }
}
