import { BadRequestError, UnauthenticatedError } from "../../errors";
import User from "../../models/User";
import bcrypt from "bcrypt";

export interface UserRequestBody {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}
class AuthService {
  public async register(registerParams: UserRequestBody) {
    const { email, firstName, lastName, password, role } = registerParams;
    if (password.length <= 4) {
      throw new BadRequestError("Password must be at least 4 characters long");
    }
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      firstName,
      lastName,
      role,
      password: hashedPassword,
    });
    const token = user.createJWT();
    return { user, token };
  }

  public async login(loginParams: UserRequestBody) {
    const { email, password } = loginParams;
    const user = await User.findOne({ email });

    const isPasswordCorrect = await user?.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    const token = user?.createJWT();

    return { user, token };
  }
}

export const authService = new AuthService();

async function hashPassword(password: string) {
  if (!password) return;
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
