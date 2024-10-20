export interface ValidateTokenGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: ValidateTokenResponse;
}

export interface ValidateTokenResponse {
  username: string;
  message: string;
  status: boolean;
  jwt: string;
}
