const { createTables } = require('@elifesciences/component-model')
const config = require('config')
const logger = require('@pubsweet/logger')
const mailer = require('@pubsweet/component-send-email')
const express = require('express')
const bodyParser = require('body-parser')
const supertest = require('supertest')
const AuditLog = require('@elifesciences/component-model-audit-log').model
const User = require('@elifesciences/component-model-user').model
const Manuscript = require('@elifesciences/component-model-manuscript').model
const routes = require('./routes')

const makeApp = () => {
  const app = express()
  app.use(bodyParser.json())
  routes(app)
  return supertest(app)
}

describe('MECA HTTP callback handler', () => {
  let userId
  const apiKey = config.get('meca.apiKey')

  beforeEach(async () => {
    jest.clearAllMocks()
    await createTables(true)
    const profileId = 'ewwboc7m'
    const user = await User.createWithIdentity(profileId)
    userId = user.id
    mailer.clearMails()
  })

  it('rejects wrong API key', async () => {
    jest.spyOn(logger, 'warn').mockImplementationOnce(() => {})
    const request = makeApp()
    await request
      .post(`/meca-result/f05bbbf9-ddf4-494f-a8da-84957e2708ee`)
      .set('Authorization', `Bearer wrong-token`)
      .send({ result: 'success' })
      .expect(403, { error: 'Invalid API key' })
    expect(logger.warn).toHaveBeenCalled()
  })

  it('rejects wrong request body', async () => {
    jest.spyOn(logger, 'warn').mockImplementationOnce(() => {})
    const request = makeApp()
    await request
      .post(`/meca-result/f05bbbf9-ddf4-494f-a8da-84957e2708ee`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ result: 'foobar' })
      .expect(400, { error: 'Invalid request body' })
    expect(logger.warn).toHaveBeenCalled()
  })

  it('updates manuscript status on success', async () => {
    const manuscript = await Manuscript.makeInitial({
      createdBy: userId,
    }).save()
    const request = makeApp()
    expect(manuscript.status).toBe(Manuscript.statuses.INITIAL)
    await request
      .post(`/meca-result/${manuscript.id}`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ result: 'success' })
      .expect(204)
    const updatedManuscript = await Manuscript.find(manuscript.id, userId)
    expect(updatedManuscript.status).toBe(
      Manuscript.statuses.MECA_IMPORT_SUCCEEDED,
    )
  })

  it('updates manuscript status on failure', async () => {
    const manuscript = await Manuscript.makeInitial({
      createdBy: userId,
    }).save()
    const request = makeApp()
    expect(manuscript.status).toBe(Manuscript.statuses.INITIAL)
    await request
      .post(`/meca-result/${manuscript.id}`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ result: 'failure' })
      .expect(204)
    const updatedManuscript = await Manuscript.find(manuscript.id, userId)
    expect(updatedManuscript.status).toBe(
      Manuscript.statuses.MECA_IMPORT_FAILED,
    )
  })

  it('sends an email on failure', async () => {
    const manuscript = await Manuscript.makeInitial({
      createdBy: userId,
    }).save()
    const request = makeApp()
    expect(manuscript.status).toBe(Manuscript.statuses.INITIAL)
    await request
      .post(`/meca-result/${manuscript.id}`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ result: 'failure' })
      .expect(204)
    await mailer._sendPromise
    expect(mailer.getMails()).toHaveLength(1)
    expect(mailer.getMails()[0]).toMatchObject({
      text: expect.stringContaining(manuscript.id),
    })
  })

  it('fails for invalid manuscript ID', async () => {
    jest.spyOn(logger, 'error').mockImplementationOnce(() => {})
    const request = makeApp()
    await request
      .post(`/meca-result/F05BBBF9-DDF4-494F-A8DA-84957E2708EE`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ result: 'success' })
      .expect(500, {
        error: 'Manuscript not found: F05BBBF9-DDF4-494F-A8DA-84957E2708EE',
      })
    expect(logger.error).toHaveBeenCalled()
  })

  it('triggers the auditLog.save', async () => {
    const manuscript = await Manuscript.makeInitial({
      createdBy: userId,
    }).save()
    const request = makeApp()
    expect(manuscript.status).toBe(Manuscript.statuses.INITIAL)
    await request
      .post(`/meca-result/${manuscript.id}`)
      .set('Authorization', `Bearer ${apiKey}`)
      .send({ result: 'success' })
      .expect(204)
    const updatedManuscript = await Manuscript.find(manuscript.id, userId)
    expect(updatedManuscript.status).toBe(
      Manuscript.statuses.MECA_IMPORT_SUCCEEDED,
    )
    const audits = await AuditLog.all()
    expect(audits).toHaveLength(3)
    expect(audits[1].objectType).toBe('manuscript')
    expect(audits[1].action).toBe('MECA_RESULT')
  })
})
