export interface UserPayload {
  sub: string;
  email: string;
  name: string;
  cpf: string;
  iat?: number;
  exp?: number;
}
