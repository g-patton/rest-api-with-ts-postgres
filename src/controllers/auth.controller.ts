import { CookieOptions, NextFunction, Request, Response } from 'express';
import config from 'config';
import { CreateUserInput, LoginUserInput } from '../schemas/user.schema';
import {
  createUser,
  findUserByEmail,
  findUserById,
  signTokens,
} from '../services/user.service';
import AppError from '../utils/appError';
import redisClient from '../utils/connectRedis';
import { signJwt, verifyJwt } from '../utils/jwt';
import { User } from '../entities/user.entity';

const cookiesOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
  };
  
  if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;
  
  const accessTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(
      Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
  };
  
  const refreshTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(
      Date.now() + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000,
  };
  
  
export const registerUserHandler = async (
    req: Request<{}, {}, CreateUserInput>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, password, email } = req.body;
  
      const user = await createUser({
        name,
        email: email.toLowerCase(),
        password,
      });
  
      res.status(201).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err: any) {
      if (err.code === '23505') {
        return res.status(409).json({
          status: 'fail',
          message: 'User with that email already exist',
        });
      }
      next(err);
    }
  };
  