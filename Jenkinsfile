elifePipeline {
    node('containers-jenkins-plugin') {
        def commit
        stage 'Checkout', {
            checkout scm
            commit = elifeGitRevision()
        }

        stage 'Build image', {
            // TODO: pull existing docker image if caching is not already effective
            sh "docker build --build-arg CI_COMMIT_SHA=${commit} -t elifesciences/elife-xpub:$commit ."
            //sh "docker push elifesciences/elife-xpub:$commit}"
        }
    }
}
