pipeline {
    agent any

    tools {
        nodejs 'nodejs'
        snyk 'Snyk'
    }

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        GITHUB_CREDENTIALS = '6d599ca3-78ad-4eec-8f0a-2b411a876174'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: '6d599ca3-78ad-4eec-8f0a-2b411a876174',
                    url: 'https://github.com/aycaoktay/the-devops-project.git' 
            }
        }
        stage('Install Dependencies') {
            steps {
               // sh 'npm install'
                sh 'npm install -g snyk'
            }
        }
     

        stage('Code Scan') {
            steps {
                snykSecurity(
                    organisation: 'aycaoktay',
                    projectName: 'the-devops-project/weatherapp',
                    snykInstallation: 'Snyk',
                    snykTokenId: 'snyk-token',
                    targetFile: 'weatherapp/package.json'
                )
            }
        }
        stage('Build') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh 'docker build -t aycaoktay/weatherapp-devops:2.0 .'
                }
            }
        }
        stage('Image Scan') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                            sh 'docker push aycaoktay/weatherapp-devops:2.0'
                        }
                    }
                    sh 'grype aycaoktay/weatherapp-devops:2.0'
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
