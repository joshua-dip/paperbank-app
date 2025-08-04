import Link from 'next/link'

export default function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">환영합니다!</h2>
          <p className="text-gray-600">
            회원가입이 성공적으로 완료되었습니다.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
          >
            로그인하기
          </Link>
          <Link
            href="/"
            className="block w-full py-2 px-4 border border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-50 transition"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  )
}