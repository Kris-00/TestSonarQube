import { prisma } from "../data/data-source/postgres";
import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import jwt from "jsonwebtoken";

export enum Role {
  Customer = 1,
  Vendor = 2,
  Admin = 4,
}

export function minimumPermissionLevelRequired(role: Role) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.headers["authorization"]?.split(" ")[1];

      const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY!);
      let decoded: any = jwt.verify(token!, publicKey, {
        algorithms: ["RS256"],
      });

      const user = await prisma.account.findFirst({
        where: {
          email: decoded.email,
        },
      });

      if (user) {
        var isAllowed = (user.role & role)
        
        if (isAllowed > 0) return next();
        else return res.status(403).send();
      } 
      else {
        return res.status(400).send();
      }
    } catch (err) {
      console.log(err)
      return res.status(500).send();
    }
  };
}
