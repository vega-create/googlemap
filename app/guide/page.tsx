export default function Guide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">❓ 使用說明</h1>

          <div className="space-y-8">
            {/* 發布貼文 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                📝 發布貼文
              </h2>
              <div className="space-y-2 text-gray-600">
                <p><strong>1. 輸入貼文內容</strong>：填寫你想發布的文字內容</p>
                <p><strong>2. 上傳圖片或影片</strong>：可上傳多張圖片或一個影片</p>
                <p><strong>3. 選擇平台</strong>：勾選要發布的平台（可多選）</p>
                <p><strong>4. 設定發布時間</strong>：選擇「立即發布」或「排程發布」</p>
                <p><strong>5. 按下發布按鈕</strong>：完成！</p>
              </div>
            </section>

            {/* 平台說明 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                📱 平台說明
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">平台</th>
                      <th className="text-center py-2">圖片</th>
                      <th className="text-center py-2">影片</th>
                      <th className="text-center py-2">多張圖</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b">
                      <td className="py-2">📘 Facebook</td>
                      <td className="text-center">✅</td>
                      <td className="text-center">✅</td>
                      <td className="text-center">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">📸 Instagram</td>
                      <td className="text-center">✅</td>
                      <td className="text-center">✅</td>
                      <td className="text-center">✅</td>
                    </tr>
                    <tr>
                      <td className="py-2">📍 Google 我的商家</td>
                      <td className="text-center">✅</td>
                      <td className="text-center">❌</td>
                      <td className="text-center">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-orange-600 mt-2">
                ⚠️ 注意：Google 我的商家不支援影片，上傳影片時會自動停用
              </p>
            </section>

            {/* GBP 專用設定 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                📍 Google 我的商家專用設定
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>勾選 GBP 時，可以額外設定：</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>CTA 按鈕</strong>：瞭解詳情、立即預約、線上訂購、立即選購、致電</li>
                  <li><strong>CTA 連結</strong>：按鈕點擊後要前往的網址</li>
                </ul>
              </div>
            </section>

            {/* 排程發布 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                ⏰ 排程發布
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>選擇「排程發布」後，可以設定日期和時間，貼文會在指定時間自動發布。</p>
                <p className="text-sm text-gray-500">提示：建議設定在上班時間或用餐時間，觸及率較高。</p>
              </div>
            </section>

            {/* 發布紀錄 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                📋 發布紀錄
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>可以查看所有發布過的貼文，包含：</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>發布平台</li>
                  <li>貼文內容與圖片</li>
                  <li>發布/排程時間</li>
                </ul>
                <p className="mt-2">點擊「🗑️ 刪除」可以同時從所有平台刪除該貼文。</p>
              </div>
            </section>

            {/* 常見問題 */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                💡 常見問題
              </h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <p className="font-medium">Q：發布後多久會出現？</p>
                  <p className="text-sm">A：通常 1-5 分鐘內會出現在各平台。</p>
                </div>
                <div>
                  <p className="font-medium">Q：為什麼上傳影片後 GBP 不能選？</p>
                  <p className="text-sm">A：Google 我的商家目前不支援影片貼文，只能發圖片。</p>
                </div>
                <div>
                  <p className="font-medium">Q：圖片有大小限制嗎？</p>
                  <p className="text-sm">A：建議 5MB 以內，格式為 JPG 或 PNG。</p>
                </div>
                <div>
                  <p className="font-medium">Q：可以修改已發布的貼文嗎？</p>
                  <p className="text-sm">A：不行，只能刪除後重新發布。</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
