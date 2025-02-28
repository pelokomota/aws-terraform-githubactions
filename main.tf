terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 4.16" 
    }
  }   
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "app_server" {
  ami = "ami-00c257e12d6828491"
  instance_type = "t2.micro"
  key_name = "key-deploy-system"

  tags = {
    Name = "tetris"
  }
}