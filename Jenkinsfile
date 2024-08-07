pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-id')
        GITHUB_CREDENTIALS = credentials('github')
        KUBECONFIG = credentials('kubeconfig-id')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github',
                    url: 'https://github.com/aycaoktay/devops-case.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install selenium-webdriver@latest'
                sh 'npm install chromedriver@latest'
            }
        }

        stage('Code Scan') {
            steps {
                script {
                    try {
                        snykSecurity(
                            organisation: 'aycaoktay',
                            projectName: 'devops-case',
                            snykTokenId: 'snyk-api',
                            snykInstallation: 'snyk',
                            targetFile: 'package.json'
                        )
                    } catch (Exception e) {
                        echo "Snyk taraması başarısız oldu: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Build') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-id', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh 'docker build -t aycaoktay/weatherapp-nodejs:${BUILD_ID} -f Dockerfile .'
                }
            }
        }

        stage('Image Scan and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-id', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                        docker.withRegistry('https://index.docker.io/v1/', 'docker-id') {
                            sh 'docker push aycaoktay/weatherapp-nodejs:${BUILD_ID}'
                        }
                    }
                    sh 'grype aycaoktay/weatherapp-nodejs:${BUILD_ID}'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Kubeconfig 
                    withCredentials([file(credentialsId: 'kubeconfig-id', variable: 'KUBECONFIG')]) {
                         sh '''
                        az login --service-principal -u $CLIENT_ID -p $CLIENT_SECRET --tenant $TENANT_ID
                        cd /var/lib/jenkins/workspace/weatherapp/k8s
                        sed -i "s/:/${BUILD_NUMBER}/g" deployment.yaml
                        kubectl apply -f deployment.yaml
                        '''
                    }
                }
            }
        }
 
        stage('Test') {
            steps {
                sh 'npm start &'
                sh 'sleep 10'
                sh 'google-chrome --version'
                sh 'xvfb-run --server-args="-screen 0 1024x768x24" node selenium-test.js'
            }
        }
    }

    post {
        always {
            echo 'I will always run'
        }
    }
}
