import { sendEmail } from "./../../../utils/sendEmail";
import { ResolverMap } from "./../../../types/graphql-type.d";
import { createEmailLink } from "./createEmailLink";
import { duplicateEmail } from "./errorMessages";
import { User } from "../../../entity/User";
import { formatZodError } from "./../../../utils/formatZodError";
import {
  MutationRegisterArgs,
  AuthResponse,
} from "./../../../types/generated.d";
import z from "zod";

const schema = z.object({
  username: z.string().min(3).max(255),
  email: z.string().email().min(3).max(255),
  password: z.string().min(3).max(255),
});

const resolvers: ResolverMap = {
  Mutation: {
    register: async (
      _,
      { username, email, password }: MutationRegisterArgs,
      { url, redis }
    ): Promise<AuthResponse> => {
      try {
        schema.parse({ username, email, password });
      } catch (e) {
        return {
          errors: formatZodError(e),
          success: false,
        };
      }

      const userAlreadyExist = await User.findOne({
        where: {
          email,
        },
        select: ["id"],
      });

      if (userAlreadyExist) {
        return {
          errors: [
            {
              path: "email",
              message: duplicateEmail,
            },
          ],
          success: false,
        };
      }

      const user = await User.create({
        email: email,
        username: username,
        password: password,
      }).save();

      if (process.env.NODE_ENV !== "test") {
        const linkUrl = await createEmailLink(url, user.id, redis);
        await sendEmail(email, linkUrl);
      }

      return {
        errors: null,
        success: true,
      };
    },
  },
};

export default resolvers;
