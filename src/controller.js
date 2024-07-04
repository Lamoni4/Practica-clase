import fs from 'fs'
import { pool } from './db.js'

export const bienvenida = (request, response) => {
  fs.readFile('./index.html', (err, data) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Error al cargar bienvenida')
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      response.end(data)
    }
  })
}

export const mostrarEmpleados = async (request, response) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuarios')
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify(rows))
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify({ error: 'No se puidieron mostrar los empleados' }))
  }
}
