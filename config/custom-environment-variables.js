module.exports = {
  'pubsweet-server': {
    db: {
      user: 'PGUSER',
      host: 'PGHOST',
      database: 'PGDATABASE',
      password: 'PGPASSWORD',
      port: 'PGPORT',
    },
    hostname: 'PUBSWEET_HOSTNAME',
    baseUrl: 'PUBSWEET_BASEURL',
    secret: 'PUBSWEET_SECRET',
  },
  'pubsweet-client': {
    sha: 'CI_COMMIT_SHA',
  },
  meca: {
    sftp: {
      connectionOptions: {
        host: 'MECA_SFTP_HOST',
        port: 'MECA_SFTP_PORT',
        username: 'MECA_SFTP_USERNAME',
        password: 'MECA_SFTP_PASSWORD',
      },
      remotePath: 'MECA_SFTP_REMOTEPATH',
    },
    apiKey: 'MECA_API_KEY',
  },
}
