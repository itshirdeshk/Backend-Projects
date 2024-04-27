import { prismaClient } from "../lib/db";
import jwt from 'jsonwebtoken'
import { createHmac, randomBytes } from 'node:crypto'

const JWT_SECRET = '$uperM@n123'

export interface CreateUserPayload {
    firstName: string,
    lastName?: string,
    email: string,
    password: string
}

export interface GetUserTokenPayload {
    email: string,
    passoword: string
}

class UserService {
    private static generateHash(salt: string, password: string) {
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');
        return hashedPassword;
    }
    public static createUser(payload: CreateUserPayload) {
        const { firstName, lastName, email, password } = payload;
        const salt = randomBytes(32).toString('hex');
        const hashedPassword = UserService.generateHash(salt, password);

        return prismaClient.user.create({
            data: {
                firstName, lastName, email, salt, password: hashedPassword
            }
        })
    }

    public static getUserById(id: string) {
        return prismaClient.user.findUnique({ where: { id } });
    }

    private static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({ where: { email } })
    }

    public static async getUserToken(payload: GetUserTokenPayload) {
        const { email, passoword } = payload;
        const user = await UserService.getUserByEmail(email);

        if (!user) throw new Error('User not found!');

        const salt = user.salt;
        const usersHashedPassword = UserService.generateHash(salt, passoword);

        if (usersHashedPassword !== user.password) throw new Error('Incorrect Password');

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        return token;

    }

    public static decodeJWTToken(token: string) {
        const user = jwt.verify(token, JWT_SECRET);
        // console.log("User: ", user);

        return user;
    }
}

export default UserService;