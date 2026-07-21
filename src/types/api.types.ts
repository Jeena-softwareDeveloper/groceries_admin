export interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
  meta?: PaginationMeta;
}

