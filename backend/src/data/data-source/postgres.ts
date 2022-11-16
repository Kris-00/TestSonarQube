
import { PrismaClient } from '@prisma/client'
import winston from 'winston'

declare global {
    // allow global `var` declarations
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
  }
  
  export const prisma = global.prisma || new PrismaClient({
    log: ['query'],
  })

  export const errorLogger = winston.createLogger({
    level: 'error',
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log' })
    ]
  })
  
if (process.env.NODE_ENV !== 'production') global.prisma = prisma