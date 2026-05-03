export type HTTPError = Error & {
  status: number;
  errors?: string[];
};
