const logger = require('@pubsweet/logger')
const ManuscriptModel = require('@elifesciences/xpub-model').Manuscript
const FileModel = require('@elifesciences/xpub-model').File
const UserModel = require('@elifesciences/xpub-model').User

const Notification = require('./notification')

class Manuscript {
  constructor(config, user, storage, scienceBeamApi, pubsubManager) {
    this.userId = user
    this.config = config
    this.storage = storage
    this.scienceBeamApi = scienceBeamApi
    this.pubsubManager = pubsubManager
  }

  async upload(manuscriptId, file, fileSize) {
    const { ON_UPLOAD_PROGRESS } = this.pubsubManager.asyncIterators

    // This is necessary as the config of the pubsub connection relies on the
    // profileId being used. Should be revisited as part of #1493
    const profileId = await UserModel.getProfileForUuid(this.userId)

    if (fileSize > this.config.get('fileUpload.maxSizeMB') * 1e6) {
      throw new Error(
        `File size shouldn't exceed ${this.config.get(
          'fileUpload.maxSizeMB',
        )}MB`,
      )
    }
    // ensure user can view manuscript
    let manuscript = await ManuscriptModel.find(manuscriptId, this.userId)

    const { stream, filename, mimetype: mimeType } = await file
    let fileEntity = await new FileModel({
      manuscriptId,
      url: `manuscripts/${manuscriptId}`,
      filename,
      type: 'MANUSCRIPT_SOURCE_PENDING',
      mimeType,
    }).save()

    const fileId = fileEntity.id

    logger.info(
      `Manuscript Upload Size: ${filename}, ${fileSize} | ${manuscriptId}`,
    )

    const pubsub = await this.pubsubManager.getPubsub()

    // Predict upload time - The analysis was done on #839
    const predictedTime = 5 + 4.67e-6 * fileSize
    const startedTime = Date.now()

    const handle = setInterval(() => {
      const elapsed = Date.now() - startedTime
      let progress = parseInt((100 * elapsed) / 1000 / predictedTime, 10)
      // don't let the prediction complete the upload
      if (progress > 99) progress = 99
      pubsub.publish(`${ON_UPLOAD_PROGRESS}.${profileId}`, {
        uploadProgress: progress,
      })
    }, 200)

    logger.info(
      `Manuscript Upload fileContents::start ${filename} | ${manuscriptId}`,
    )
    const fileContents = await new Promise((resolve, reject) => {
      let uploadedSize = 0
      const chunks = []
      stream.on('data', chunk => {
        uploadedSize += chunk.length
        chunks.push(chunk)
      })
      stream.on('error', reject)
      stream.on('end', () => {
        resolve(Buffer.concat(chunks))
        if (uploadedSize !== fileSize) {
          logger.warn(
            'Reported file size for manuscript is different than the actual file size',
          )
        }
      })
    })
    fileEntity = await FileModel.find(fileId)
    await fileEntity.updateStatus('UPLOADED')

    logger.info(
      `Manuscript Upload fileContents::end ${filename} | ${manuscriptId}`,
    )

    logger.info(`Manuscript Upload S3::start ${filename} | ${manuscriptId}`)

    fileEntity = await FileModel.find(fileId)

    try {
      await this.storage.putContent(fileEntity, fileContents, {
        size: fileSize,
      })
      await fileEntity.updateStatus('STORED')
    } catch (err) {
      logger.error(
        `Manuscript was not uploaded to S3: ${err} | ${manuscriptId}`,
      )
      await fileEntity.updateStatus('CANCELLED')
      await fileEntity.delete()
      clearInterval(handle)
      throw err
    }

    logger.info(`Manuscript Upload S3::end ${filename} | ${manuscriptId}`)

    let title = ''
    try {
      // also send source file to conversion service
      title = await this.scienceBeamApi.extractSemantics(
        this.config,
        fileContents,
        filename,
        mimeType,
      )
    } catch (error) {
      let errorMessage = ''
      if (error.error.code === 'ETIMEDOUT' || error.error.connect === false) {
        errorMessage = 'Request to science beam timed out'
      } else {
        errorMessage = error.message
      }
      logger.warn('Manuscript conversion failed', {
        error: errorMessage,
        manuscriptId,
        filename,
      })
    }

    // After the length file operations above - now update the manuscript...
    manuscript = await ManuscriptModel.find(manuscriptId, this.userId)
    const oldFileIndex = manuscript.files.findIndex(
      element => element.type === 'MANUSCRIPT_SOURCE',
    )

    logger.info(
      `Manuscript Upload found index ${oldFileIndex} ${
        fileEntity.filename
      } | ${manuscriptId}`,
    )

    if (oldFileIndex >= 0) {
      const oldFile = await FileModel.find(manuscript.files[oldFileIndex].id)
      manuscript.files.splice(oldFileIndex, 1)
      await oldFile.delete()
    }

    const pendingFileIndex = manuscript.files.findIndex(
      element => element.type === 'MANUSCRIPT_SOURCE_PENDING',
    )

    manuscript.files[pendingFileIndex].type = 'MANUSCRIPT_SOURCE'

    logger.info(`Manuscript Upload Manuscript::save ${title} | ${manuscriptId}`)
    manuscript.meta.title = title
    await manuscript.save()

    const sourceList = manuscript.files.filter(
      f => f.type === 'MANUSCRIPT_SOURCE',
    )
    const pendingList = manuscript.files.filter(
      f => f.type === 'MANUSCRIPT_SOURCE_PENDING',
    )
    if (sourceList.length !== 1 || pendingList.length !== 0) {
      logger.error(`Validation failed ${JSON.stringify(manuscript, null, 4)}`)
      throw new Error(`Validation Failure on ${manuscript.id}`)
    }

    logger.info(
      `Manuscript Upload Manuscript::saved ${
        manuscript.meta.title
      } | ${manuscriptId}`,
    )

    clearInterval(handle)
    pubsub.publish(`${ON_UPLOAD_PROGRESS}.${profileId}`, {
      uploadProgress: 100,
    })
    const actualTime = (Date.now() - startedTime) / 1000
    logger.info(
      `Manuscript Upload Time, Actual (${actualTime}) , Predicted (${predictedTime}) | ${manuscriptId}`,
    )

    return ManuscriptModel.find(manuscriptId, this.userId)
  }

  async update(data) {
    const manuscript = await ManuscriptModel.find(data.id, this.userId)
    if (manuscript.status !== ManuscriptModel.statuses.INITIAL) {
      throw new Error(
        `Cannot update manuscript with status of ${manuscript.status}`,
      )
    }

    const originalEmails = (manuscript.getAuthor()
      ? manuscript.getAuthor()
      : []
    )
      .map(author => author.alias.email)
      .join(',')

    manuscript.applyInput(data)

    const newAuthors = manuscript.getAuthor()
    const newEmails = newAuthors.map(author => author.alias.email).join(',')

    // Send email here only when author changes...
    if (newEmails !== originalEmails) {
      // sendEmail
      const notify = new Notification(this.config, newAuthors)
      notify.sendDashboardEmail()
    }

    await manuscript.save()
    logger.debug(`Updated manuscript`, {
      manuscriptId: data.id,
      userId: this.userId,
    })

    return manuscript
  }
}

module.exports = Manuscript
