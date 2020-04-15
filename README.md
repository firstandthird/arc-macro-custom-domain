# arc-macro-custom-domain

- can override domain with `ARC_DOMAIN`

## Example .arc
```
@app
example

@http
get /

@macros
arc-macro-custom-domain

@customDomain
zoneName {route53 host}
productionCertArn {production arn}
productionDomain {production domain}
stagingCertArn {staging arn}
stagingDomain {staging domain}
```
