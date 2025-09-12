export interface RequestAccessBranchJWT extends Request {
  userId: string
  storeCode: string
}

export interface LoginDecodeJWT {
  userId: string
  storeCode: string
}
