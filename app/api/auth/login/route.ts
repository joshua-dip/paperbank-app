import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    // MongoDB 연결
    await dbConnect()

    const { email, password } = await request.json()

    // 이메일과 비밀번호 유효성 검사
    if (!email || !password) {
      return NextResponse.json(
        { message: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 이메일로 사용자 찾기 (비밀번호 포함)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    
    if (!user) {
      return NextResponse.json(
        { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // 비밀번호 확인
    const isPasswordCorrect = await user.comparePassword(password)
    
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // 로그인 성공 - 사용자 정보 반환 (비밀번호 제외)
    return NextResponse.json(
      { 
        message: '로그인 성공', 
        user: { 
          id: user._id,
          email: user.email,
          name: user.name
        } 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('로그인 오류:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}