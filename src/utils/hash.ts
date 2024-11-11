import bcryptjs from "bcryptjs";

export const getHashPassword = async (password: string) => {
  const salt = bcryptjs.genSaltSync(10);
  const hashPassword = bcryptjs.hashSync(password, salt);
  return hashPassword;
};

export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string | null
): Promise<boolean> => {
  if (hashedPassword) {
    return await bcryptjs.compare(plainPassword, hashedPassword);
  }
  return false;
};
