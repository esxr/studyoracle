resource "aws_ecs_cluster" "studyoracle" {
  name = "studyoracle"
}

# feed the credentials to the docker provider

# container definition
resource "aws_ecs_task_definition" "studyoracle" {
  family                   = "studyoracle"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 4096
  memory                   = 8192
  execution_role_arn       = data.aws_iam_role.lab.arn

  container_definitions = <<DEFINITION
[
  {
    "image": "${local.server_image}",
    "cpu": 2048,
    "memory": 4096,
    "name": "studyoracle_server",
    "networkMode": "awsvpc",
    "portMappings": [
      {
        "containerPort": 8080,
        "hostPort": 8080
      }
    ],
    "environment": [
      {
        "name": "OPENAI_API_KEY",
        "value": "${local.openai_api_key}"
      },
      {
        "name": "SQLALCHEMY_DATABASE_URI",
        "value": "postgresql://${local.database_username}:${local.database_password}@${aws_db_instance.database.address}:${aws_db_instance.database.port}/${aws_db_instance.database.db_name}"
      },
      {
        "name": "CELERY_BROKER_URL",
        "value": "sqs://"
      },
      {
        "name": "CELERY_RESULT_BACKEND",
        "value": "db+postgresql://${local.database_username}:${local.database_password}@${aws_db_instance.database.address}:${aws_db_instance.database.port}/${aws_db_instance.database.db_name}"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/studyoracle/server",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs",
        "awslogs-create-group": "true"
      }
    }
  },
  {
    "image": "${local.worker_image}",
    "cpu": 2048,
    "memory": 4096,
    "name": "studyoracle_worker",
    "networkMode": "awsvpc",
    "environment": [
      {
        "name": "OPENAI_API_KEY",
        "value": "${local.openai_api_key}"
      },
      {
        "name": "SQLALCHEMY_DATABASE_URI",
        "value": "postgresql://${local.database_username}:${local.database_password}@${aws_db_instance.database.address}:${aws_db_instance.database.port}/${aws_db_instance.database.db_name}"
      },
      {
        "name": "CELERY_BROKER_URL",
        "value": "sqs://"
      },
      {
        "name": "CELERY_RESULT_BACKEND",
        "value": "db+postgresql://${local.database_username}:${local.database_password}@${aws_db_instance.database.address}:${aws_db_instance.database.port}/${aws_db_instance.database.db_name}"
      },
      {
        "name": "C_FORCE_ROOT",
        "value": "true"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/studyoracle/worker",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs",
        "awslogs-create-group": "true"
      }
    }
  }
]
DEFINITION
}

# scaling
resource "aws_ecs_service" "studyoracle" {
  name            = "studyoracle"
  cluster         = aws_ecs_cluster.studyoracle.id
  task_definition = aws_ecs_task_definition.studyoracle.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.private.ids
    security_groups  = [aws_security_group.studyoracle.id]
    assign_public_ip = true
  }

  # Connect the internal side of the load balancer
  # to the auto-scaling service
  load_balancer {
    target_group_arn = aws_lb_target_group.studyoracle_server.arn
    container_name   = "studyoracle_server"
    container_port   = 8080
  }

}

resource "aws_security_group" "studyoracle" {
  name        = "studyoracle"
  description = "studyoracle Security Group"

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
