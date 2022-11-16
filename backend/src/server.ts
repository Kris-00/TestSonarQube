import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const server = express();
server.use(express.json({ limit: '3mb'}));
server.use(cookieParser());

export default server