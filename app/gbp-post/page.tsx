'use client'
import { useState } from 'react'

export default function GBPPost() {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [cta, setCta] = useState('')
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    setImageUrl(data.url)
    setUploading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch('/api/gbp-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, imageUrl, cta, link }),
    })
    const data = await res.json()
    setResult(data.status === 'success' ? '發布成功！' : '發布失敗：' + JSON.stringify(data))
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">GBP 發文</h1>
      
      <textarea
        placeholder="貼文內容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
        rows={4}
      />
      
      <div className="mb-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="w-full"
        />
        {uploading && <p className="text-sm text-gray-500">上傳中...</p>}
        {imageUrl && (
          <img src={imageUrl} alt="預覽" className="mt-2 max-h-40 rounded" />
        )}
      </div>
      
      <select
        value={cta}
        onChange={(e) => setCta(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      >
        <option value="">CTA 按鈕（選填）</option>
        <option value="LEARN_MORE">瞭解詳情</option>
        <option value="BOOK">立即預約</option>
        <option value="ORDER">線上訂購</option>
        <option value="SHOP">立即選購</option>
        <option value="CALL">致電</option>
      </select>
      
      <input
        type="text"
        placeholder="CTA 連結網址"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />
      
      <button
        onClick={handleSubmit}
        disabled={loading || !content}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? '發布中...' : '發布'}
      </button>
      
      {result && <p className="mt-3 text-sm">{result}</p>}
    </div>
  )
}
