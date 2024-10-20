export interface LoginGeneralResponse {
  isSuccess: boolean;
  status: string;
  message: string;
  data: LoginResponse;
}

export interface LoginResponse {
  username: string;
  message: string;
  status: boolean;
  jwt: string;
}
