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
    response.end(JSON.stringify({ error: 'No se pudieron mostrar los empleados' }))
  }
}

export const exportarEmpleados = async (request, response) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuarios')

    const data = rows.map(row => JSON.stringify(row)).join('\n')
    fs.writeFile('empleados.txt', data, err => {
      if (err) {
        response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
        response.end('Error al exportar los empleados')
        console.error('Error al escribir en el archivo empleados.txt', err)
      } else {
        response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
        response.end('Datos de empleados exportados correctamente')
        console.log('Datos de empleados guardados en empleados.txt')
      }
    })
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify({ error: 'No se pudieron exportar los empleados' }))
  }
}

export const importarEmpleados = async (request, response) => {
  try {
    const data = fs.readFileSync('empleados.txt', 'utf8')
    const empleados = data.split('\n').map(line => JSON.parse(line))

    const insertPromises = empleados.map(empleado => {
      // eslint-disable-next-line camelcase
      const { id, nombre, apellido, correo, dni, edad, fecha_creacion, telefono } = empleado
      return pool.execute(
        `INSERT INTO usuarios (id, nombre, apellido, correo, dni, edad, fecha_creacion, telefono) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
          nombre = VALUES(nombre), 
          apellido = VALUES(apellido), 
          correo = VALUES(correo), 
          dni = VALUES(dni), 
          edad = VALUES(edad), 
          fecha_creacion = VALUES(fecha_creacion), 
          telefono = VALUES(telefono)`,
        // eslint-disable-next-line camelcase
        [id, nombre, apellido, correo, dni, edad, fecha_creacion, telefono]
      )
    })

    await Promise.all(insertPromises)

    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Datos de empleados importados correctamente')
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(JSON.stringify({ error: 'No se pudieron importar los empleados' }))
  }
}
