export class PaginationMetaDto {
  total: number
  lastPage: number
  currentPage: number
  perPage: number
  prev: number | null
  next: number | null
  totalPages: number

  constructor(partial: Partial<PaginationMetaDto>) {
    Object.assign(this, partial)
  }
}

export class PaginationResponseDto<T> {
  meta: PaginationMetaDto
  list: T[]

  constructor(partial: Partial<PaginationResponseDto<T>>) {
    Object.assign(this, partial)
  }
}
