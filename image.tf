# Build and push the server image to ECR
resource "aws_ecr_repository" "studyoracle_server" {
  name = "studyoracle_server"
}

resource "docker_image" "studyoracle_server" {
  name = "${aws_ecr_repository.studyoracle_server.repository_url}:latest"
  build {
    context    = "."
    dockerfile = "Dockerfile"
  }
}

resource "docker_registry_image" "studyoracle_server" {
  name = docker_image.studyoracle_server.name
}

output "ecr_repository_url_server" {
  value = aws_ecr_repository.studyoracle_server.repository_url
}
