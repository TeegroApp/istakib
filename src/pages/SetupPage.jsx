export default function SetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          İstakib Kurulumu
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Uygulamayı kullanmak için Supabase bağlantı bilgilerini girmeniz gerekiyor.
        </p>

        <ol className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">1</span>
            <span>
              <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline">supabase.com</a>'a gidin ve ücretsiz bir proje oluşturun.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">2</span>
            <span>
              <strong>SQL Editor</strong>'e gidin ve <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">src/lib/supabase.sql</code> dosyasındaki SQL'i çalıştırın.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">3</span>
            <span>
              Proje klasöründe <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.env</code> dosyası oluşturun:
            </span>
          </li>
        </ol>

        <pre className="mt-3 bg-gray-900 text-green-400 text-xs rounded-xl p-4 overflow-auto">
{`VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...`}
        </pre>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Bilgileri <strong>Settings → API</strong> sayfasında bulabilirsiniz. Dosyayı kaydedip uygulamayı yeniden başlatın.
        </p>
      </div>
    </div>
  )
}
