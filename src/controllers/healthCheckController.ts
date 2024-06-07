import { Request, Response } from "express";
const { performance } = require("perf_hooks");

export class HealthCheckController {
    public static async getHealthStatus(req: Request, res: Response) {
        let timeTaken = performance.now();
        return res.status(200).send({ statusCode: 200, statusMessage: "Its all Good", timeTaken:  (performance.now() - timeTaken)})
    }
}
