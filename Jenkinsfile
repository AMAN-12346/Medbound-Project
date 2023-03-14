pipeline {
     agent {
         label 'mean2'
     }
     stages {
        stage("Build") {
            steps {
                sh "sudo npm i"
               
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo pm2 restart medbound-1967"
                sh "echo node-medbound.mobiloitte.io"
                
            }
        }
    }
}
