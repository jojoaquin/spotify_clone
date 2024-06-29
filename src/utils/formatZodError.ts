import { Error } from "./../types/generated.d";
import { ZodError } from "zod";

export class CustomError extends Error {
  path: string;
  constructor(path: string, message: string) {
    super(message);
    this.path = path;
  }
}

export const formatZodError = (err: ZodError) => {
  const errors: Array<Error> = [];
  if (err instanceof ZodError) {
    err.errors.forEach((value) => {
      errors.push({
        path: value.path.toString(),
        message: value.message,
      });
    });
  }
  return errors;
};
