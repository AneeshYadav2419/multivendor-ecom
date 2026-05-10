import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const registerUser = async (userData: any) => {
  const { name, email, password, role } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error: any = new Error("User already exists with this email");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "CUSTOMER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async (loginData: any) => {
  const { email, password } = loginData;

  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 2. Check existence & compare password
  // We use a generic error message for security (don't reveal if email or password is wrong)
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error: any = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // 3. Generate JWT Token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // 4. Prepare safe user object
  const { password: _, ...safeUser } = user;

  return { token, user: safeUser };
};
