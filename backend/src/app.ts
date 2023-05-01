import "dotenv/config";
import express,{NextFunction, Request, Response} from 'express';
import notesRoutes from './routes/notes';
import userRoutes from './routes/users';
import morgan from 'morgan';
import createHttpError, {isHttpError} from "http-errors";
import session from 'express-session';
import env from './util/validateEnv';
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";


const app = express();

app.use(morgan("dev"));

app.use(express.json());

    app.use(session({
        secret: env.SESSION_SECRET, 
        resave:false, //Session data should not be saved back to the session store on every request.
        saveUninitialized: false, //A session should not be created automatically if a user visits the site without a session cookie.
        cookie: {
            maxAge: 60 * 60 * 1000  //the maximum age of the cookie in milliseconds
        },
        rolling:true, //determines whether the session cookie's expiration time is reset on every request
        store: MongoStore.create({
            mongoUrl: env.MONGO_CONNECTION_STRING
        }),
    }));

app.use('/api/users' , userRoutes)
app.use('/api/notes' ,requiresAuth  ,notesRoutes)

app.use((req,res,next) =>{
    next(createHttpError(404,'Endpoint not found'))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error:unknown, req:Request, res:Response, next:NextFunction )=>{
    console.error(error);
    let errorMessage = 'An unknown error occurred'; 
    let statusCode = 500;
    if(isHttpError(error)){
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(500).json({error:errorMessage}); 

})

export default app;
