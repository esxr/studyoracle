data "aws_route53_zone" "studyoracle" {
  name = "studyoracle.com"
}

# create a record
resource "aws_route53_record" "studyoracle" {
  zone_id = data.aws_route53_zone.studyoracle.zone_id
  name    = "studyoracle.com"
  type    = "A"
  alias {
    name                   = aws_lb.studyoracle.dns_name
    zone_id                = aws_lb.studyoracle.zone_id
    evaluate_target_health = true
  }
}
