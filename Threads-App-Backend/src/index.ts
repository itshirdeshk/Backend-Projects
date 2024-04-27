import express from "express";
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user";

async function init() {
    const app = express();

    const port = Number(process.env.PORT) || 8001;
    app.use(express.json());



    app.get('/', (req, res) => {
        res.json({ message: "Server is up and running" })
    })

    app.use('/graphql', expressMiddleware(await createApolloGraphqlServer(), {
        context: async ({ req }) => {
            const token = req.headers['token'];
            try {
                const user =  UserService.decodeJWTToken(token as string);
                return { user };
            } catch (error) {
                return {};
            }
        }
    }));

    app.listen(port, () => {
        console.log(`Server started at PORT: ${port}`);
    })
}

init();