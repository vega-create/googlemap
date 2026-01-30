'use client'
import { useState } from 'react'

export default function GBPPost() {
  const [content, setContent] = useState('')
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null)
  const [platforms, setPlatforms] = useState<string[]>([])
  const [cta, setCta] = useState('')
  const [link, setLink] = useState('')
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const uploadedUrls: string[] = []
    let detectedType: 'image' | 'video' | null = null

    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith('video/')
      detectedType = isVideo ? 'video' : 'image'

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        uploadedUrls.push(data.url)
      }
    }

    setMediaUrls(prev => [...prev, ...uploadedUrls])
    setMediaType(detectedType)
    
    // 如果是影片，自動取消 GBP
    if (detectedType === 'video') {
      setPlatforms(prev => prev.filter(p => p !== 'gmb'))
    }
    
    setUploading(false)
  }

  const removeMedia = (index: number) => {
    setMediaUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index)
      if (newUrls.length === 0) {
        setMediaType(null)
      }
      return newUrls
    })
  }

  const togglePlatform = (platform: string) => {
    // 如果是影片且選擇 GBP，阻止
    if (platform === 'gmb' && mediaType === 'video') {
      alert('Google 我的商家不支援影片')
      return
    }
    
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  const handleSubmit = async () => {
    if (platforms.length === 0) {
      alert('請選擇至少一個平台')
      return
    }

    setLoading(true)
    setResult(null)

    let scheduledAt = null
    if (scheduleType === 'scheduled' && scheduleDate && scheduleTime) {
      scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
    }

    const res = await fetch('/api/gbp-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        mediaUrls,
        platforms,
        cta: platforms.includes('gmb') ? cta : null,
        link: platforms.includes('gmb') ? link : null,
        scheduledAt,
      }),
    })
    const data = await res.json()

    if (data.success) {
      setResult({ success: true, message: '發布成功！' })
      setContent('')
      setMediaUrls([])
      setMediaType(null)
      setPlatforms([])
      setCta('')
      setLink('')
      setScheduleType('now')
      setScheduleDate('')
      setScheduleTime('')
    } else {
      setResult({ success: false, message: '發布失敗：' + (data.error || JSON.stringify(data)) })
    }
    setLoading(false)
  }

  const platformOptions = [
    { id: 'facebook', label: 'Facebook', icon: '📘' },
    { id: 'instagram', label: 'Instagram', icon: '📸' },
    { id: 'gmb', label: 'Google 我的商家', icon: '📍' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">📱 社群發文工具</h1>
            <p className="text-gray-500 mt-2">一次發布到多個平台</p>
          </div>

          <div className="space-y-5">
            {/* 貼文內容 */}
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

            {/* 上傳圖片/影片 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                圖片或影片
                {mediaType === 'video' && <span className="text-orange-500 ml-2">（影片不支援 GBP）</span>}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {uploading ? (
                    <p className="text-blue-500">上傳中...</p>
                  ) : (
                    <div className="py-4">
                      <span className="text-4xl">📁</span>
                      <p className="text-gray-500 mt-2">點擊上傳圖片或影片</p>
                    </div>
                  )}
                </label>
              </div>

              {mediaUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="relative">
                      {mediaType === 'video' ? (
                        <video src={url} className="w-full h-24 object-cover rounded-lg" />
                      ) : (
                        <img src={url} alt={`媒體 ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      )}
                      <button
                        onClick={() => removeMedia(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 選擇平台 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                發布平台 *
              </label>
              <div className="flex flex-wrap gap-2">
                {platformOptions.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => togglePlatform(id)}
                    disabled={id === 'gmb' && mediaType === 'video'}
                    className={`px-4 py-2 rounded-xl border-2 transition ${
                      platforms.includes(id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${id === 'gmb' && mediaType === 'video' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* GBP 專用 CTA */}
            {platforms.includes('gmb') && (
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <p className="text-sm font-medium text-gray-700">📍 GBP 專用設定</p>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">CTA 按鈕</option>
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
                    className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* 發布時間 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                發布時間
              </label>
              <div className="flex gap-3 mb-3">
                <button
                  onClick={() => setScheduleType('now')}
                  className={`flex-1 py-2 rounded-xl border-2 transition ${
                    scheduleType === 'now'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300'
                  }`}
                >
                  立即發布
                </button>
                <button
                  onClick={() => setScheduleType('scheduled')}
                  className={`flex-1 py-2 rounded-xl border-2 transition ${
                    scheduleType === 'scheduled'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300'
                  }`}
                >
                  排程發布
                </button>
              </div>
              {scheduleType === 'scheduled' && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="border border-gray-300 p-3 rounded-xl"
                  />
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="border border-gray-300 p-3 rounded-xl"
                  />
                </div>
              )}
            </div>

            {/* 發布按鈕 */}
            <button
              onClick={handleSubmit}
              disabled={loading || !content || platforms.length === 0}
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
