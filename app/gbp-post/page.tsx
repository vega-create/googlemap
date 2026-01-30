'use client'
import { useState } from 'react'

export default function GBPPost() {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [cta, setCta] = useState('')
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

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
    setResult(null)
    const res = await fetch('/api/gbp-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, imageUrl, cta, link }),
    })
    const data = await res.json()
    
    if (data.status === 'success') {
      setResult({ success: true, message: '發布成功！' })
      setContent('')
      setImageUrl('')
      setCta('')
      setLink('')
    } else {
      setResult({ success: false, message: '發布失敗：' + (data.message || JSON.stringify(data)) })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">📍 GBP 發文工具</h1>
            <p className="text-gray-500 mt-2">發布貼文到 Google 我的商家</p>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                貼文內容 *
              </label>
              <textarea
                placeholder="輸入你想發布的內容..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                圖片
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {uploading ? (
                    <p className="text-blue-500">上傳中...</p>
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="預覽" className="max-h-48 mx-auto rounded-lg" />
                  ) : (
                    <div className="py-4">
                      <span className="text-4xl">🖼️</span>
                      <p className="text-gray-500 mt-2">點擊上傳圖片</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CTA 按鈕
                </label>
                <select
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">不使用</option>
                  <option value="LEARN_MORE">瞭解詳情</option>
                  <option value="BOOK">立即預約</option>
                  <option value="ORDER">線上訂購</option>
                  <option value="SHOP">立即選購</option>
                  <option value="CALL">致電</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  連結網址
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={loading || !content}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? '發布中...' : '🚀 發布貼文'}
            </button>
            
            {result && (
              <div className={`p-4 rounded-xl text-center ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {result.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
