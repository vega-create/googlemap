import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { content, mediaUrls, platforms, cta, link, scheduledAt } = await req.json()

  try {
    // 建立 Ayrshare 請求
    const body: any = {
      post: content,
      platforms: platforms,
    }

    if (mediaUrls && mediaUrls.length > 0) {
      body.mediaUrls = mediaUrls
    }

    if (scheduledAt) {
      body.scheduleDate = scheduledAt
    }

    // GBP 專用設定
    if (platforms.includes('gmb') && cta && link) {
      body.gmbOptions = {
        callToActionType: cta,
        callToActionUrl: link,
      }
    }

    // 發送到 Ayrshare
    const response = await fetch('https://api.ayrshare.com/api/post', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (data.status === 'success' || data.id) {
      // 存到 Supabase
      await supabase.from('gbp_posts').insert({
        content,
        platforms,
        media_urls: mediaUrls || [],
        ayrshare_id: data.id,
        platform_post_ids: data.postIds || null,
        scheduled_at: scheduledAt || null,
      })

      return NextResponse.json({ success: true, data })
    } else {
      return NextResponse.json({ success: false, error: data.message || data })
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
