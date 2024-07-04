import mysql2 from 'mysql2'
import {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  DB_DATABASE
} from './config.js'

export const pool = mysql2.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE
}).promise()
