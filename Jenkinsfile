pipeline {
    agent any
    tools{
        nodejs  '19.0.0'
    }
    stages {
        stage ('Frontend Dependency Check') {
            steps {
                dir("frontend"){
                    echo 'Checking is dependencies are vulnerable'
                    sh 'npm audit'
                }
            }
        }
        stage ('Backend Dependency Check') {
            steps {
                dir("backend"){
                    echo 'Checking is dependencies are vulnerable'
                    sh 'npm audit'
                }
            }
        }
        stage('Build Frontend') {
            steps {
                dir("frontend"){
                    echo 'Installing Dependencies for Frontend...'
                    sh 'npm install'
                }
            }
        }
        stage('Build Backend'){
            steps {
                dir("backend") {
                    echo 'Installing Dependencies for Backend...'
                    sh 'npm install'
                }
            }
        }
        stage('Test Backend'){
            steps {
                dir("backend") {
                    echo 'Running Backend Test Cases...'
                    sh 'npm test'
                }
            }
        }
    }
}