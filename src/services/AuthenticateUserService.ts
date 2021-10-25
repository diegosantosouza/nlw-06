import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UserRepositories";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface IAuthenticateRequest {
    email: string;
    password: string;
}
class AuthenticateUserService {
    async execute({ email, password }: IAuthenticateRequest) {

        const usersRepositories = getCustomRepository(UsersRepositories);

        const user = await usersRepositories.findOne({ email });

        if (!user) {
            throw new Error("Incorrect email/password combination");
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error("Incorrect email/password combination");
        }

        const token = sign({
            email: user.email
        }, "9ccc5bdd91ec5a1bf7ff85a9e7e7eae6", {
            subject : user.id,
            expiresIn: "1d"
        })

        return token;

    }
}

export { AuthenticateUserService };