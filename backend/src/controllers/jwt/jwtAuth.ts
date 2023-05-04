import { Request as ExpressRequest, Response, NextFunction} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import "dotenv/config";
import  env from '../../util/validateEnv';


interface Request extends ExpressRequest {
    userId?: string;
  }
// Verify Token Function
function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const bearerHeader: string | undefined = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    const bearer: string[] = bearerHeader.split(' ');
    const bearerToken: string = bearer[1];

    jwt.verify(
      bearerToken,
      env.JWT_SECRET,
      (err, authData)=>{ 
        if (err) {
          res.sendStatus(403);
        } else {
            req.userId = (authData as JwtPayload)._id;
   
           }
        }
    );

    next();
  } else {
    res.sendStatus(403);
  }
}

export { verifyToken };
