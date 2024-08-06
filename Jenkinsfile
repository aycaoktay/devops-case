pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-id')
        GITHUB_CREDENTIALS = credentials('github')
        KUBECONFIG = credentials('kubeconfig-id')
        CLIENT_ID = '${env.CLIENT_ID}'
        CLIENT_SECRET = '${env.CLIENT_SECRET}'
        TENANT_ID = '${env.TENANT_ID}'
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
                sh 'npm install selenium-webdriver'
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
                        sh 'az login --service-principal -u $CLIENT_ID -p $CLIENT_SECRET --tenant $TENANT_ID '
                        sh 'az aks get-credentials --resource-group internDevopsCase --name MyK8SCluster'
                        //sh 'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"'
                        sh 'sed -i "s/52/${BUILD_NUMBER}/g" devops-case/k8s/deployment.yaml'
                        sh 'kubectl apply -f k8s/deployment.yaml'
                    }
                }
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
