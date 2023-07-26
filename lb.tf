# provision the application load balancer
resource "aws_lb" "studyoracle" {
  name               = "studyoracle"
  internal           = false
  load_balancer_type = "application"
  subnets            = data.aws_subnets.private.ids
  security_groups    = [aws_security_group.studyoracle_lb.id]

}

# define the internal side of the load balancer
resource "aws_lb_target_group" "studyoracle_server" {
  name        = "studyoracleserver"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_security_group.studyoracle.vpc_id
  target_type = "ip"
  health_check {
    path                = "/api/v1/health"
    port                = "8080"
    protocol            = "HTTP"
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 10
  }
}

# define the external side of the load balancer
resource "aws_lb_listener" "studyoracle_server" {
  load_balancer_arn = aws_lb.studyoracle.arn
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.studyoracle_server.arn
  }
}

# define the security group of the balancer
resource "aws_security_group" "studyoracle_lb" {
  name        = "studyoraclelb"
  description = "studyoracle Security Group"
  ingress {
    from_port   = 80
    to_port     = 80
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
