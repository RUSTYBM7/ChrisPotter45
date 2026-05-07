import type { ApiError } from "./types";

export class ApiException extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    const err = data as ApiError;
    throw new ApiException(err.message ?? "Request failed", res.status);
  }

  return data as T;
}