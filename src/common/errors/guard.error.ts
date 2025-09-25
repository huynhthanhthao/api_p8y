export const GUARD_ERROR = {
  TOKEN_REQUIRED: {
    code: 'GUARD_01',
    message: 'Không tìm thấy token'
  },
  TOKEN_EXPIRED: {
    code: 'GUARD_02',
    message: 'Token đã hết hạn'
  },
  INVALID_TOKEN: {
    code: 'GUARD_03',
    message: 'Token không hợp lệ'
  },
  TOKEN_VERIFICATION_FAILED: {
    code: 'GUARD_04',
    message: 'Xác thực token thất bại'
  }
}
