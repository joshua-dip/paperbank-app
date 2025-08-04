'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 로그인 상태 확인 (실제로는 토큰이나 세션을 확인해야 함)
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('사용자 데이터 로딩 오류:', error)
      localStorage.removeItem('user')
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PaperBank</h1>
            </div>
            <nav className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                    안녕하세요, {user?.name || user?.email}님!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    href="/login"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 transition"
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            PaperBank에 오신 것을 환영합니다
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            논문과 연구 자료를 효율적으로 관리하고 공유하세요
          </p>

          {isLoggedIn ? (
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                대시보드
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-blue-900 mb-2">내 논문</h4>
                  <p className="text-3xl font-bold text-blue-600">0</p>
                  <p className="text-sm text-blue-700">저장된 논문</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-green-900 mb-2">즐겨찾기</h4>
                  <p className="text-3xl font-bold text-green-600">0</p>
                  <p className="text-sm text-green-700">즐겨찾는 논문</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-purple-900 mb-2">최근 조회</h4>
                  <p className="text-3xl font-bold text-purple-600">0</p>
                  <p className="text-sm text-purple-700">최근 본 논문</p>
                </div>
              </div>
              <div className="mt-8">
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                  새 논문 추가
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                시작하려면 로그인하세요
              </h3>
              <p className="text-gray-600 mb-6">
                계정을 만들고 논문 관리를 시작해보세요. 무료로 시작할 수 있습니다.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  href="/signup"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  무료로 시작하기
                </Link>
                <Link
                  href="/login"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
                >
                  기존 계정으로 로그인
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 PaperBank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
