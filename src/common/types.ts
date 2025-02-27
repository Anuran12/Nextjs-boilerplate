export type TokenPayload = {
  id: string;
  email: string;
  phoneNumber: string;
  name: string;
  admin: boolean;
};

export type DecodedTokenPayload = {
  id: string;
  email: string;
  phoneNumber: string;
  name: string;
  admin: boolean;
  iat: number;
  exp: number;
};
