import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
};
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const isPasswordCorrect = await bcrypt.compare(password, hash);
  return isPasswordCorrect;
};