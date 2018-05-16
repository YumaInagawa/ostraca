node {
    stage('scm'){
        checkout scm
    }

    stage('first job'){
        sh "echo 'Hello Jenkins from Jenkinsfile'"
    }

    stage('second job'){
        sh "ls -l"
    }

}