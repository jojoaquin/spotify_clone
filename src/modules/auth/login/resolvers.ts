import bcrypt from "bcrypt";
import { confirmEmailError, invalidLogin } from "./errorMessages";
import { User } from "../../../entity/User";
import { formatZodError } from "./../../../utils/formatZodError";
import { AuthResponse, MutationLoginArgs } from "./../../../types/generated.d";
import z from "zod";

const schema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(3).max(255),
});

const errorResponse = {
  errors: [
    {
      path: "email",
      message: invalidLogin,
    },
  ],
  success: false,
};

const resolvers: ResolverMap = {
  Mutation: {
    login: async (
      _,
      { email, password }: MutationLoginArgs
    ): Promise<AuthResponse> => {
      try {
        schema.parse({ email, password });
      } catch (e) {
        return {
          errors: formatZodError(e),
          success: false,
        };
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return errorResponse;
      }

      if (!user.confirmed) {
        return {
          errors: [
            {
              path: "email",
              message: confirmEmailError,
            },
          ],
          success: false,
        };
      }

      const valid = await bcrypt.compare(password, user!.password);

      if (!valid) {
        return errorResponse;
      }

      return {
        errors: null,
        success: true,
      };
    },
  },
};

export default resolvers;
