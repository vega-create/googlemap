import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { content, imageUrl, cta, link } = await req.json()

  const response = await fetch('https://api.ayrshare.com/api/post', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      post: content,
      platforms: ['gmb'],
      mediaUrls: imageUrl ? [imageUrl] : [],
      gmbOptions: cta && link ? {
        callToActionType: cta,
        callToActionUrl: link,
      } : undefined,
    }),
  })

  const data = await response.json()
  return NextResponse.json(data)
}
