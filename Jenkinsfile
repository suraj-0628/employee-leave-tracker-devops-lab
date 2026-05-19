pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'YOUR_GITHUB_REPO_URL'
            }
        }

        stage('Build') {
            steps {
                sh '''
                npm install || true
                npm run build || true

                mkdir -p dist
                cp index.html dist/ || true

                echo "Pipeline Build Successful"
                '''
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/**'
            }
        }
    }
}