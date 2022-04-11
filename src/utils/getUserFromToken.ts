import JWT from "jsonwebtoken";
import "dotenv/config";

export const getUserFromToken = (token: string) => {
  try {
    return JWT.verify(token, process.env.JWT_SIGNATURE as string) as {
      userId: number;
    };
  } catch (error) {
    return null;
  }
};
