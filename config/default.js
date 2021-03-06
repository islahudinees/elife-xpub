const path = require('path')
const logger = require('winston')

module.exports = {
  configTag: 'default',
  authsome: {
    isPublic: true,
    mode: path.resolve(__dirname, 'non-serializable/authsome.js'),
  },
  validations: path.resolve(__dirname, 'non-serializable/validations.js'),
  pubsweet: {
    components: [
      '@elifesciences/component-meca',
      '@elifesciences/component-elife-app',
      '@elifesciences/component-logger',
      '@elifesciences/component-model-semantic-extraction',
      '@elifesciences/component-model-manuscript',
      '@elifesciences/component-model-file',
      '@elifesciences/component-model-audit-log',
      '@elifesciences/component-model-identity',
      '@elifesciences/component-model-team',
      '@elifesciences/component-model-user',
      '@elifesciences/component-model',
      '@elifesciences/component-service-s3',
      '@elifesciences/component-dashboard',
      '@elifesciences/component-submission',
      '@pubsweet/component-send-email',
    ],
  },
  'pubsweet-server': {
    db: {
      // see https://node-postgres.com/features/connecting
      user: '',
      host: '',
      database: '',
      password: '',
      port: 5432,
    },
    port: 3000,
    logger,
    uploads: 'uploads',
    enableExperimentalGraphql: true,
    morganLogFormat:
      ':remote-addr [:date[clf]] :method :url :status :graphql[operation] :res[content-length] :response-time ms',
    secret: 'default-secret-that-needs-changing',
  },
  'pubsweet-client': {
    isPublic: true,
    API_ENDPOINT: '/api',
    'login-redirect': '/',
  },
  git: {
    sha: '',
    ref: '',
  },
  server: {
    api: {
      secret: '',
      url: 'https://prod--gateway.elifesciences.org/',
    },
  },
  client: {
    isPublic: true,
    majorSubjectAreas: {
      'biochemistry-chemical-biology': 'Biochemistry and Chemical Biology',
      'cancer-biology': 'Cancer Biology',
      'cell-biology': 'Cell Biology',
      'chromosomes-gene-expression': 'Chromosomes and Gene Expression',
      'computational-systems-biology': 'Computational and Systems Biology',
      'developmental-biology': 'Developmental Biology',
      ecology: 'Ecology',
      'epidemiology-global-health': 'Epidemiology and Global Health',
      'evolutionary-biology': 'Evolutionary Biology',
      'genetics-genomics': 'Genetics and Genomics',
      'immunology-inflammation': 'Immunology and Inflammation',
      medicine: 'Medicine',
      'microbiology-infectious-disease': 'Microbiology and Infectious Disease',
      neuroscience: 'Neuroscience',
      'physics-living-systems': 'Physics of Living Systems',
      'plant-biology': 'Plant Biology',
      'stem-cells-and-regenerative-medicine':
        'Stem Cells and Regenerative Medicine',
      'structural-biology-molecular-biophysics':
        'Structural Biology and Molecular Biophysics',
    },
  },
  login: {
    // TODO swap this mock for the Journal endpoint when available
    isPublic: true,
    url: '/mock-token-exchange/ewwboc7m',
    enableMock: true,
    signupUrl: 'https://orcid.org/register',
    legacySubmissionUrl: 'https://submit.elifesciences.org',
    sessionTTL: 86400000,
  },
  logout: {
    isPublic: true,
  },
  mailer: {
    from: 'dev@example.com',
    path: `${__dirname}/non-serializable/fake-mailer`,
  },
  aws: {
    credentials: {
      region: '',
      accessKeyId: '',
      secretAccessKey: '',
    },
    s3: {
      s3ForcePathStyle: true,
      params: {
        Bucket: 'dev-elife-xpub',
      },
    },
  },
  meca: {
    s3: {
      remotePath: 'meca-archive',
      disableUpload: false,
    },
    sftp: {
      connectionOptions: {
        host: '',
        port: 22,
        username: '',
        password: '',
      },
      remotePath: '',
      disableUpload: false,
    },
    apiKey: '',
    email: {
      recipient: '',
      sender: 'errors@elifesciences.org',
      subjectPrefix: '',
    },
  },
  staffIds: [],
  scienceBeam: {
    url: 'https://sciencebeam-texture.elifesciences.org/api/convert',
    timeoutMs: 20000,
  },
  fileUpload: {
    isPublic: true,
    maxSizeMB: 100,
  },
  newrelic: {
    isPublic: true,
    licenseKey: '',
    applicationID: '',
  },
  googleAnalytics: {
    isPublic: true,
    trackingId: '',
  },
  schema: {}, // schema extensions for pubsweet-server
  hotJar: {
    isPublic: true,
    enabled: true,
    snippetVersion: 6,
  },
  titles: {
    isPublic: true,
    '': 'Dashboard | eLife',
    'author-guide': 'Author guide | eLife',
    'reviewer-guide': 'Reviewer guide | eLife',
    'contact-us': 'Contact us | eLife',
    login: 'Login | eLife',
    submit: 'Submit | eLife',
  },
  features: {
    isPublic: true,
    demographicSurvey: false,
  },
}
