pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker-compose'
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Skipping clone as we are executing from the local directory for this setup.'
            }
        }
        
        stage('Stop Old Containers') {
            steps {
                bat 'docker compose down'
            }
        }
        
        stage('Build & Run') {
            steps {
                bat 'docker compose up -d --build'
            }
        }
    }
}
