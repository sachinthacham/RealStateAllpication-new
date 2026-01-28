export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status: number;
    success: boolean;
}
  
  export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
    code?: string;
}
  
  // Queue item for the refresh logic
  export interface PendingRequest {
    resolve: (token: string) => void;
    reject: (error: any) => void;
}