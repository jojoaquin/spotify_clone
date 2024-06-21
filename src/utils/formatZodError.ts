import { Error } from "src/types/generated";
import { ZodError } from "zod";

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
