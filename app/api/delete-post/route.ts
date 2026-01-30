import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { id, ayrshareId } = await req.json()

  try {
    // 從 Ayrshare 刪除
    if (ayrshareId) {
      await fetch('https://api.ayrshare.com/api/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: ayrshareId }),
      })
    }

    // 從 Supabase 刪除
    const { error } = await supabase
      .from('gbp_posts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
