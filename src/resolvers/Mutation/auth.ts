import { Context } from "../../index";
import validator from "validator";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import "dotenv/config";

interface SignupArgs {
  email: string;
  name: string;
  password: string;
  bio: string;
}

interface UserPayload {
  userErrors: { message: string }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { email, name, password, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      return {
        userErrors: [{ message: "Invalid email" }],
        token: null,
      };
    }

    const isValidPassword = validator.isLength(password, { min: 5 });
    if (!isValidPassword) {
      return {
        userErrors: [{ message: "Invalid password" }],
        token: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [{ message: "Invalid name or bio" }],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
        updatedAt: new Date(),
      },
    });

    const token = await JWT.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SIGNATURE as string,
      { expiresIn: 3600000 }
    );

    return {
      userErrors: [],
      token,
    };
  },
};
