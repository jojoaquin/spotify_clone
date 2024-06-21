import { duplicateEmail } from "./errorMessages";
import { User } from "../../../entity/User";
import { AppDataSource } from "./../../../data-source";
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

const userRepository = AppDataSource.getRepository(User);

const resolvers: ResolverMap = {
  Mutation: {
    register: async (
      _,
      { username, email, password }: MutationRegisterArgs
    ): Promise<AuthResponse> => {
      try {
        schema.parse({ username, email, password });
      } catch (e) {
        return {
          errors: formatZodError(e),
          success: false,
        };
      }

      const userAlreadyExist = await userRepository.findOne({
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

      await userRepository
        .create({
          email: email,
          username: username,
          password: password,
        })
        .save();

      return {
        errors: null,
        success: true,
      };
    },
  },
};

export default resolvers;
