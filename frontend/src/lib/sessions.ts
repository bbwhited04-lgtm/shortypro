// @ts-ignore
console.log(Object.keys(session || {}));

export type SessionPayload = {
  sub?: string;
  email?: string;
  plan?: string;
  status?: string;
  iat?: number;
  exp?: number;
};
