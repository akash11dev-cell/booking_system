import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
interface RateLimiterRecord {
    count: number;
    resetAt: number;
}
@Injectable()


export class RateLimiterMiddleware implements NestMiddleware {
    private readonly limit = 3
    private readonly windowMs = 60 * 1000
    private readonly clients: Map<string, RateLimiterRecord> = new Map()
    use(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip as string
        const now = Date.now()

        const record = this.clients.get(ip)
        if (!record || now > record.resetAt) {
            this.clients.set(ip, { count: 1, resetAt: now + this.windowMs })
            return next()
        }
        if (record.count >= this.limit) {
            return res.status(429).json({ message: "Too many requests" })
        }

        record.count++
        next()
    }
}

