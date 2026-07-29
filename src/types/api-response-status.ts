export interface ApiResponseStatus {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message?: string;
  loadingMessage?: string;
}
