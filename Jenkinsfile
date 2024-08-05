pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-id')
        GITHUB_CREDENTIALS = credentials('github')
        SNYK_API = credentials('snykapi')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github',
                    url: 'https://github.com/aycaoktay/devops-case.git'
            }
        }

        stage('Code Scan') {
            steps {
                snykSecurity(
                    organisation: 'aycaoktay',
                    projectName: 'aycaoktay/devops-case',
                    snykTokenId: 'snykapi',
                    snykInstallation: 'snyk',
                    targetFile: 'package.json'
                )
            }
        }

        stage('Build') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-id', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh 'docker build -t aycaoktay/weatherapp-nodejs:1.0 .'
                }
            }
        }

        stage('Image Scan and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-id', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        docker.withRegistry('https://index.docker.io/v1/', 'docker-id') {
                            sh 'docker push aycaoktay/weatherapp-nodejs:1.0'
                        }
                    }
                    sh 'grype aycaoktay/weatherapp-nodejs:1.0'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/deployment.yaml'
            }
        }

        stage('Test') {
            steps {
                sh 'npm start &'
                sh 'sleep 10'
                sh 'node selenium-test.js'
            }
        }
    }

    post {
        always {
            echo 'I will always run'
        }
    }
}
