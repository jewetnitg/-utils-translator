pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                nvm use
                yarn install
                yarn build
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                yarn test
            }
        }
        stage('Documentation') {
            steps {
                echo 'Generating documentation....'
            }
        }
        stage('Deploy documentation') {
            steps {
                echo 'Deploying documentation....'
            }
        }
    }
}