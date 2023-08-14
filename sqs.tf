resource "aws_sqs_queue" "studyoracle_queue" {
  name = "studyoracle"
}

# get the subnet_group_name from vpc
resource "aws_elasticache_subnet_group" "studyoracle_redis" {
  name       = "studyoracle-redis"
  subnet_ids = data.aws_subnets.private.ids
}

# Create an Elasticache clster
resource "aws_elasticache_cluster" "studyoracle_redis" {
  cluster_id           = "studyoracle-redis"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.studyoracle_redis.name
}