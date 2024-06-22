import { formatZodError } from "./../../../utils/formatZodError";
import bcrypt from "bcrypt";
import { lockAccount } from "./../../../utils/lockAccount";
import { sendEmail } from "./../../../utils/sendEmail";
import { createForgotPasswordLink } from "./createForgotPasswordLink";
import { userIsNotFound } from "./errorMessages";
import { User } from "./../../../entity/User";
import {
  AuthResponse,
  MutationForgotPasswordChangeArgs,
  MutationSendForgotPasswordEmailArgs,
} from "./../../../types/generated.d";
import { ResolverMap } from "./../../../types/graphql-type.d";
import { forgotPasswordPrefix } from "../../../constants";
import z from "zod";

const schema = z.object({
  password: z.string().min(3).max(255),
});

const resolvers: ResolverMap = {
  Mutation: {
    sendForgotPasswordEmail: async (
      _,
      { email }: MutationSendForgotPasswordEmailArgs,
      { redis, url }
    ): Promise<AuthResponse> => {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return {
          errors: [
            {
              path: "email",
              message: userIsNotFound,
            },
          ],
          success: false,
        };
      }

      await lockAccount(email, user.id, redis);
      const urlLink = await createForgotPasswordLink(url, user.id, redis);
      await sendEmail(user.email, urlLink, " to change your password");

      return {
        errors: null,
        success: true,
      };
    },
    forgotPasswordChange: async (
      _,
      { newPassword, key }: MutationForgotPasswordChangeArgs,
      { redis }
    ): Promise<AuthResponse> => {
      try {
        schema.parse({ password: newPassword });
      } catch (e) {
        return {
          errors: formatZodError(e),
          success: false,
        };
      }
      const userId = await redis.get(`${forgotPasswordPrefix}${key}`);

      if (userId) {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await User.update(
          {
            id: userId,
          },
          {
            password: hashedPassword,
            lockAccount: false,
          }
        );

        await redis.del(`${forgotPasswordPrefix}${key}`);

        return {
          errors: null,
          success: true,
        };
      }

      return {
        errors: [
          {
            path: "key",
            message: userIsNotFound,
          },
        ],
        success: false,
      };
    },
  },
};

export default resolvers;
