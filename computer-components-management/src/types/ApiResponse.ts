interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
    totalPages: number;
    currentPage: number;
    limit: number;
}

export type { ApiResponse, PaginatedResponse };
