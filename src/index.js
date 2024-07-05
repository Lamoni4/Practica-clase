import http from 'http'
import { PORT } from './config.js'
import { bienvenida, mostrarEmpleados, exportarEmpleados, importarEmpleados } from './controller.js'

const requestHandler = (request, response) => {
  console.log(`Solicitud ${request.method} ${request.url}`)

  if (request.method === 'GET' && request.url === '/') {
    bienvenida(request, response)
  } else if (request.method === 'GET' && request.url === '/empleados') {
    mostrarEmpleados(request, response)
  } else if (request.method === 'GET' && request.url === '/export') {
    exportarEmpleados(request, response)
  } else if (request.method === 'POST' && request.url === '/import') {
    importarEmpleados(request, response)
  } else {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('No se encontró la ruta')
  }
}

const server = http.createServer(requestHandler)

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
