import type { NextFunction, Request, Response } from 'express';

function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
        console.log(`${req.method} ${req.url} ${res.statusCode} - ${Date.now() - start}ms`);
    });

    next();
}

export default loggerMiddleware;
