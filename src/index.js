import http from 'http'
import { PORT } from './config.js'
import { bienvenida, mostrarEmpleados } from './controller.js'

const requestHandler = (request, response) => {
  console.log(`Solicitud ${request.method} ${request.url}`)

  if (request.method === 'GET' && request.url === '/') {
    bienvenida(request, response)
  } else if (request.method === 'GET' && request.url === '/empleados') {
    mostrarEmpleados(request, response)
  } else {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('No se encontro la ruta')
  }
}

const server = http.createServer(requestHandler)

server.listen(PORT, () => {
  console.log(`Servidor escuchado en http://localhost:${PORT}`)
})
