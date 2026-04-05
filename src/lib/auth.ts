import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '7d'

const getJwtSecret = (): string => {
  if (!JWT_SECRET) {
    // 构建时跳过检查
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return 'build-time-placeholder'
    }
    // 仅在开发环境中使用临时密钥
    if (process.env.NODE_ENV !== 'production') {
      console.warn('WARNING: Using temporary JWT secret for development only!')
      return 'temp-dev-secret-do-not-use-in-production'
    }
    throw new Error('JWT_SECRET environment variable is required')
  }
  return JWT_SECRET
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

/**
 * 密码哈希
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * 验证密码
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * 生成JWT Token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN })
}

/**
 * 验证JWT Token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload
  } catch {
    return null
  }
}

/**
 * 从请求头获取Token
 */
export function getTokenFromHeader(authHeader: string | null | undefined): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.substring(7)
}
