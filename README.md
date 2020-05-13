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

## Example .arc with http api
```
@app
example

@http
get /

@macros
architect/macro-http-api
arc-macro-custom-domain

@customDomain
zoneName {route53 host}
productionCertArn {production arn}
productionDomain {production domain}
stagingCertArn {staging arn}
stagingDomain {staging domain}
httpAPI true
```
