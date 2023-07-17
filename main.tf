## CONFIGURE PROVIDERS
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "aws" {
  region                   = "us-east-1"
  shared_credentials_files = ["./credentials"]
  default_tags {
    tags = {
      Name       = "StudyOracle"
      Automation = "Terraform"
    }
  }
}

#------------------------------------------------------------

## Configure a provider to build the Dockerfile from within terraform
data "aws_ecr_authorization_token" "ecr_token" {}

provider "docker" {
  registry_auth {
    address  = data.aws_ecr_authorization_token.ecr_token.proxy_endpoint
    username = data.aws_ecr_authorization_token.ecr_token.user_name
    password = data.aws_ecr_authorization_token.ecr_token.password
  }
}

#------------------------------------------------------------
# CONFIGURE LOCAL VARIABLES
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

locals {
    openai_api_key = "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"
    server_image = aws_ecr_repository.studyoracle_server.repository_url
    region = data.aws_region.current.name
    account_id = data.aws_caller_identity.current.account_id
}

data "aws_iam_role" "lab" {
  name = "LabRole"
}

data "aws_vpc" "default" {
    default = true
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

#------------------------------------------------------------
# CONFIGURE DEPLOYMENT URL OUTPUT AFTER BUILD
resource "local_file" "url" {
  content  = "http://${aws_lb.studyoracle.dns_name}"
  filename = "./api.txt"
}

#------------------------------------------------------------
