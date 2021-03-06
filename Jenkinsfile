elifePipeline {
    def minimumNumberOfUnitTests = 400

    def commit
    node('containers-jenkins-plugin') {
        def image
        stage 'Checkout', {
            checkout scm
            commit = elifeGitRevision()
            image = "elifesciences/elife-xpub:$commit"
            sh "ln -sf .env.ci .env"
        }

        stage 'Build image', {
            // may have been written by a container in which this repository was mounted as a volume
            sh "sudo rm -rf .config"
            // TODO: pull existing docker image if caching is not already effective
            dockerComposeBuild(commit, ["parallel": true])
        }

        stage 'Project tests', {
            def actions = [
                'lint': {
                    withCommitStatus({
                        sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_app_lint app npm run lint"
                    }, 'lint', commit)
                },
                'test': {
                  try {
                      withCommitStatus({
                          sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=unit-test docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d postgres"
                          sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=unit-test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh postgres:5432'"
                          sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=unit-test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_app_test app npx pubsweet migrate"
                          sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=unit-test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_app_test app npm test"
                      }, 'test', commit)
                  } finally {
                      sh "docker ps -a"
                      sh "mkdir -p build/postgres-logs && sh -c \"docker logs elife-xpub_postgres_1 > build/postgres-logs/unit-postgres-output.txt\""
                      sh "sh -c \"docker cp elife-xpub_postgres_1:/var/lib/postgresql/data/logs/. build/postgres-logs/\""
                      archiveArtifacts artifacts: "build/postgres-logs/**/*", allowEmptyArchive: true
                      junit testResults: "build/jest-junit/unit-tests.xml"
                      elifeCountJunitXml "build/jest-junit/unit-tests.xml", minimumNumberOfUnitTests
                  }
                },
                'test:dependencies': {
                    withCommitStatus({
                        sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_app_test_dependencies app npm run test:dependencies"
                    }, 'test:dependencies', commit)
                },
            ]

            def folder
            elifePullRequestOnly { prNumber ->
                folder = "${prNumber}"
            }
            elifeMainlineOnly {
                folder = 'develop'
            }
            // actions['styleguide'] = {
            //     def targetUrl = "https://s3.amazonaws.com/ci-elife-xpub-styleguide/${folder}/index.html"
            //     withCommitStatus(
            //         {
            //             sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --name elife-xpub_app_style_guide app npm run build:styleguide"
            //             sh "docker cp elife-xpub_app_style_guide:/home/xpub/_build_styleguide ${folder}"
            //             sh "aws s3 cp --recursive ${folder} s3://ci-elife-xpub-styleguide/${folder}"
            //             echo "Styleguide URL: $targetUrl"
            //         },
            //         [
            //             'name': 'styleguide',
            //             'commit': commit,
            //             'targetUrl': targetUrl,
            //         ]
            //     )
            // }

            try {
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d postgres"
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh -t 15 postgres:5432'"
                parallel actions
            } finally {
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml down -v"
                sh "sudo rm -rf ./build/* || true"
            }
        }

        stage 'Integration Tests', {
            def actions = [
                "browser": {
                  sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait-app-browser-test app bash -c './scripts/wait-for-app.sh app:3000'"
                  withCommitStatus({
                      sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run -p 10081:10081 --rm --name elife-xpub_app_test_browser test_browser"
                      sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=unit-test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_app_test app bash -c 'scripts/pipeline-log-filter-test.sh'"
                  }, 'test:browser', commit)
                },
                "api": {
                  sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait-app-api-test app bash -c './scripts/wait-for-app.sh app:3000'"
                  dir("tools/api-tests") {
                    withCommitStatus({
                      try {
                        sh "NODE_ENV=production NODE_CONFIG_ENV=test docker-compose build"
                        sh "JWT_SECRET=fakesecret NODE_ENV=production NODE_CONFIG_ENV=test docker-compose run api-test npm run ci"
                      } finally {
                        sh "docker-compose down"
                      }
                    }, 'test:api', commit)
                  }
                }
            ]
            try {
                sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d postgres api-dummy fakes3 sftp"
                sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh postgres:5432'"
                sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh sftp:22'"
                sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh api-dummy:8080'"
                sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_wait_postgres app bash -c './scripts/wait-for-it.sh fakes3:4569'"
                sh "aws --endpoint-url='http://localhost:4569' s3 mb s3://test"
                sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name elife-xpub_setupdb app bash -c 'npx pubsweet migrate'"
                sh "IMAGE_TAG=${commit} NODE_ENV=production NODE_CONFIG_ENV=test docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d app"
                parallel actions
            } finally {
                sh "docker ps -a"
                sh "mkdir -p build/browser"
                sh "sh -c \"docker logs elife-xpub_app_1 > build/browser/app-output.txt\""
                sh "sh -c \"docker logs elife-xpub_postgres_1 > build/browser/postgres-output.txt\""
                sh "sh -c \"docker logs elife-xpub_sftp_1 > build/browser/sftp-output.txt\""
                sh "sh -c \"docker logs elife-xpub_fakes3_1 > build/browser/fakes3-output.txt\""
                archiveArtifacts artifacts: "build/logs/**/*,build/screenshots/**/*,build/browser/**/*,build/meca/*.zip", allowEmptyArchive: true
                sh "aws --endpoint-url='http://localhost:4569' s3 ls s3://test --recursive"
                sh "IMAGE_TAG=${commit} docker-compose -f docker-compose.yml -f docker-compose.ci.yml down -v"
                sh "sudo rm -rf ./build/* || true"
            }
        }

        stage 'Push image', {
            sh "docker push elifesciences/elife-xpub:${commit}"
            elifeMainlineOnly {
                sh "docker tag elifesciences/elife-xpub:${commit} elifesciences/elife-xpub:latest"
                sh "docker push elifesciences/elife-xpub:latest"
            }
        }
    }

    elifePullRequestOnly { prNumber ->
        stage 'Deploy for review', {
            checkout scm
            sh "scripts/helm_deploy.sh pr-${prNumber} ${commit}"
            def reviewUrl = sh(script: "scripts/helm_url.sh pr-${prNumber}", returnStdout: true).trim()
            echo "Review url: $reviewUrl"
            elifeGithubCommitStatus(
                commit,
                'success',
                'continuous-integration/jenkins/deploy-for-review',
                'Deploy for review URL (experimental)',
                reviewUrl
            )
        }
    }

    elifeMainlineOnly {
        stage 'Downstream', {
            build job: '/dependencies/dependencies-elife-xpub-deployment-update-xpub', wait: false, parameters: [string(name: 'commit', value: commit)]
        }
    }
}
