import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  
  const fileName = `${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from('gbp-images')
    .upload(fileName, file)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  const { data: urlData } = supabase.storage
    .from('gbp-images')
    .getPublicUrl(fileName)
  
  return NextResponse.json({ url: urlData.publicUrl })
}
