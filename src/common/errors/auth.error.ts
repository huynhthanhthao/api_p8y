export const SIGNUP_ERROR = {
  PHONE_ALREADY_EXISTS: {
    code: 'SIGNUP_01',
    message: 'Số điện thoại đã được sử dụng'
  },
  STORE_ALREADY_EXISTS: {
    code: 'SIGNUP_02',
    message: 'Tên cửa hàng đã được sử dụng'
  }
}

export const SIGNIN_ERROR = {
  INVALID_CREDENTIALS: {
    code: 'SIGNIN_01',
    message: 'Tài khoản hoạt mật khẩu không chính xác'
  },
  ACCOUNT_LOCKED: {
    code: 'SIGNIN_03',
    message: 'Tài khoản đã bị khóa'
  }
}
