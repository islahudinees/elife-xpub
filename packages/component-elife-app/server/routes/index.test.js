jest.mock('@pubsweet/logger')
jest.mock('@elifesciences/component-elife-app/server/health')

const express = require('express')
const supertest = require('supertest')
const health = require('../health')

describe('ping route test', () => {
  let routes

  const makeApp = () => {
    const app = express()
    routes(app)
    return supertest(app)
  }

  beforeEach(() => {
    routes = require('.')
    health.checkDataBase.mockResolvedValue(14)
    setS3Success(1)
    setDbSuccess(1)
  })

  const setS3Success = value => {
    health.checkS3.mockResolvedValue({ Contents: value })
  }

  const setS3Error = value => {
    health.checkS3.mockResolvedValue(new Error('Mock error'))
  }

  const setDbSuccess = value => {
    health.checkDataBase.mockResolvedValue(value)
  }

  it('returns success when app ok', async () => {
    const request = makeApp()
    await request.get('/ping').expect(200)
  })

  describe('Response Errors', () => {
    it('returns failure when an invalid response is returned from the database', async () => {
      setDbSuccess(0)
      const request = makeApp()
      const response = await request.get('/ping').expect(410)
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toEqual('Database Error')
    })

    it('returns failure when an invalid response is returned from S3', async () => {
      setS3Success(0)
      health.checkDataBase.mockResolvedValue(17)
      const request = makeApp()
      const response = await request.get('/ping').expect(410)
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toEqual('S3 Error')
    })

    it('both S3 and database return invalid responses', async () => {
      setS3Success(0)
      setDbSuccess(0)
      const request = makeApp()
      const response = await request.get('/ping').expect(410)
      expect(response.body).toHaveLength(2)
      expect(response.body[0]).toEqual('Database Error')
      expect(response.body[1]).toEqual('S3 Error')
    })
  })

  describe('Connection Errors', () => {
    it('returns connection error on S3', async () => {
      setS3Error()
      const request = makeApp()
      const response = await request.get('/ping').expect(410)
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toEqual('S3 Error')
    })

    it('returns connection error on database', async () => {
      setDbSuccess(new Error('connection Error'))
      const request = makeApp()
      const response = await request.get('/ping').expect(410)
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toEqual('Database Error')
    })

    it('both returns connection errors', async () => {
      setS3Error()
      setDbSuccess(new Error('connection Error'))
      const request = makeApp()
      const response = await request.get('/ping').expect(410)
      expect(response.body).toHaveLength(2)
      expect(response.body[0]).toEqual('Database Error')
      expect(response.body[1]).toEqual('S3 Error')
    })
  })
})

describe('status route test', () => {
  let routes

  const makeApp = () => {
    const app = express()
    routes(app)
    return supertest(app)
  }

  beforeEach(() => {
    routes = require('.')
  })

  it('returns success when app ok', async () => {
    const request = makeApp()
    await request.get('/status').expect(200)
  })
})