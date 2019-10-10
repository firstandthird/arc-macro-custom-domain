# arc-macro-custom-domain

- only works on staging (for now)
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
{domain}
{route53 host}
{certArn}
```
