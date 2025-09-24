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
    message: 'Tài khoản hoặc mật khẩu không chính xác'
  },
  ACCOUNT_LOCKED: {
    code: 'SIGNIN_02',
    message: 'Tài khoản đã bị khóa'
  },
  SHOP_ACCESS_DENIED: {
    code: 'SIGNIN_03',
    message: 'Bạn không có quyền truy cập cửa hàng này'
  }
}

export const ACCESS_BRANCH_ERROR = {
  BRANCH_ACCESS_DENIED: {
    code: 'ACCESS_BRANCH_01',
    message: 'Bạn không có quyền truy cập chi nhánh này'
  },
  BRANCH_EXPIRED: {
    code: 'ACCESS_BRANCH_02',
    message: 'Chi nhánh đã hết hạn hoạt động'
  },
  INVALID_TOKEN: {
    code: 'ACCESS_BRANCH_03',
    message: 'Token không hợp lệ'
  }
}

export const REFRESH_TOKEN_ERROR = {
  USER_NOT_FOUND: {
    code: 'REFRESH_TOKEN_01',
    message: 'Tài khoản không tồn tại'
  },
  USER_IS_INACTIVE: {
    code: 'REFRESH_TOKEN_02',
    message: 'Tài khoản đã bị khóa'
  }
}

export const GET_ME_ERROR = {
  USER_IS_INACTIVE: {
    code: 'GET_ME_01',
    message: 'Tài khoản đã bị khóa'
  }
}
