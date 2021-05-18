const app = require('../index.js')
const supertest = require('supertest')
const request = supertest(app)

describe('Post Endpoints', () => {
  it('Crear Rol', async () => {
    const res = await request
      .post('/crear-rol')
      .query({role: "jester"})
    expect(res.statusCode).toEqual(200)
  })

  it('Crear Empresa', async () => {
    const res = await request
      .post('/crear-empresa')
      .query({
          nombre_legal: "jester_corp",
          nombre_comercial: "jester_comercial",
          rfc: "jester",
          telefono: "jester",
          fecha_registro: new Date()
        })
    expect(res.statusCode).toEqual(200)
  })

  it('Crear Usuario', async () => {
    const res = await request
      .post('/crear-usuario')
      .query({
          nombre: "jester",
          apellido: "jester",
          email: "jester@jester.com",
          password: "jester",
          password_confirm: "jester",
          rol: 1,
          empresa: 1
        })
    expect(res.statusCode).toEqual(200)
  })
})

describe('Get Endpoints', () => {
    it('Obtener Roles', async () => {
        const res = await request
          .get('/roles')
        expect(res.statusCode).toEqual(200)
    })

    it('Obtener Usuarios', async () => {
        const res = await request
          .get('/usuarios')
        expect(res.statusCode).toEqual(200)
    })

    it('Obtener Roles', async () => {
        const res = await request
          .get('/empresas')
        expect(res.statusCode).toEqual(200)
    })
})


