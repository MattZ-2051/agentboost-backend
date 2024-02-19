export type User = {
  id: number;
  email: string;
  rtHash: string | null;
};

export type Tokens = {
  access: string;
  refresh: string;
};

export type JwtPayload = {
  email: string;
  sub: number;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

export type GoogleUser = {
  email: string;
  fullName: string;
  picture: string;
};
