'use client'
import { useState, useEffect } from 'react'

interface Post {
  id: string
  content: string
  platforms: string[]
  media_urls: string[]
  ayrshare_id: string
  scheduled_at: string | null
  created_at: string
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchPosts = async () => {
    const res = await fetch('/api/posts')
    const data = await res.json()
    setPosts(data.posts || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (post: Post) => {
    if (!confirm('確定要刪除這則貼文嗎？這會同時從各平台刪除。')) return

    setDeleting(post.id)
    const res = await fetch('/api/delete-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, ayrshareId: post.ayrshare_id }),
    })
    const data = await res.json()

    if (data.success) {
      setPosts(prev => prev.filter(p => p.id !== post.id))
    } else {
      alert('刪除失敗：' + data.error)
    }
    setDeleting(null)
  }

  const platformLabels: Record<string, string> = {
    facebook: '📘 FB',
    instagram: '📸 IG',
    gmb: '📍 GBP',
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-TW')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">載入中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">📋 發布紀錄</h1>

          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">還沒有發布紀錄</p>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      {post.platforms.map(p => (
                        <span key={p} className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {platformLabels[p] || p}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleDelete(post)}
                      disabled={deleting === post.id}
                      className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                    >
                      {deleting === post.id ? '刪除中...' : '🗑️ 刪除'}
                    </button>
                  </div>

                  <p className="text-gray-800 mb-2 whitespace-pre-wrap">{post.content}</p>

                  {post.media_urls && post.media_urls.length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {post.media_urls.slice(0, 3).map((url, i) => (
                        <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded" />
                      ))}
                      {post.media_urls.length > 3 && (
                        <span className="text-gray-500 text-sm">+{post.media_urls.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-400">
                    {post.scheduled_at ? (
                      <span>排程：{formatDate(post.scheduled_at)}</span>
                    ) : (
                      <span>發布於：{formatDate(post.created_at)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
