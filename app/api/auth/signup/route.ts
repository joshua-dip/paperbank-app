import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    // MongoDB 연결
    await dbConnect()

    const { name, email, password } = await request.json()

    // 입력값 유효성 검사
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: '모든 필드를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: '올바른 이메일 형식을 입력해주세요.' },
        { status: 400 }
      )
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return NextResponse.json(
        { message: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { message: '이미 존재하는 이메일입니다.' },
        { status: 409 }
      )
    }

    // 새 사용자 생성 (비밀번호는 모델의 pre-save 미들웨어에서 자동 해싱됨)
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password
    })

    // 회원가입 성공 - 사용자 정보 반환 (비밀번호 제외)
    return NextResponse.json(
      { 
        message: '회원가입이 완료되었습니다.',
        user: { 
          id: newUser._id,
          name: newUser.name,
          email: newUser.email
        }
      },
      { status: 201 }
    )

  } catch (error: unknown) {
    console.error('회원가입 오류:', error)
    
    // MongoDB 유효성 검사 오류 처리
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationError = error as unknown as { errors: Record<string, { message: string }> }
      const messages = Object.values(validationError.errors).map((err) => err.message)
      return NextResponse.json(
        { message: messages.join(', ') },
        { status: 400 }
      )
    }

    // 중복 키 오류 처리 (이메일 중복)
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { message: '이미 존재하는 이메일입니다.' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}