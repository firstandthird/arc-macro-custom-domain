module.exports = function(arc, cloudformation, stage) {
  if (!arc.customDomain) {
    return cloudformation;
  }
  const params = {};
  arc.customDomain.forEach(e => {
    params[e[0]] = e[1];
  });
  const domainName = process.env.ARC_DOMAIN || (
    stage === 'staging' ? params.stagingDomain : params.productionDomain);
  // abort if no domainName was specified:
  if (!domainName) {
    console.log('WARNING: no domain name was specified for arc-macro-custom-domain!! (did you forget to set something?)');
    return cloudformation;
  }
  const route53Host = params.zoneName;
  const certArn = stage === 'staging' ? params.stagingCertArn : params.productionCertArn;
  const restId = Object.keys(cloudformation.Resources)[0]; //probably could make this better
  cloudformation.Resources.ApiGatewayDomain = {
    Type: 'AWS::ApiGateway::DomainName',
    Properties: {
      RegionalCertificateArn: certArn,
      DomainName: domainName,
      EndpointConfiguration: {
        Types: ['REGIONAL']
      }

    }
  };
  cloudformation.Resources.ApiGatewayMapping = {
    Type: 'AWS::ApiGateway::BasePathMapping',
    Properties: {
      BasePath: '',
      DomainName: domainName,
      Stage: {
        Ref: `${restId}.Stage`
      },
      RestApiId: {
        Ref: restId
      }
    }
  };
  //route53
  cloudformation.Resources.DomainDns = {
    Type: 'AWS::Route53::RecordSetGroup',
    Properties: {
      HostedZoneName: `${route53Host}.`,
      Comment: 'Route to api gateway stage',
      RecordSets: [{
        Name: domainName,
        Type: 'A',
        AliasTarget: {
          HostedZoneId: { 'Fn::GetAtt': ['ApiGatewayDomain', 'RegionalHostedZoneId'] },
          DNSName: { 'Fn::GetAtt': ['ApiGatewayDomain', 'RegionalDomainName'] }
        }
      }]
    }
  };
  cloudformation.Outputs.Domain = {
    Description: 'Domain',
    Value: `https://${domainName}`
  };
  return cloudformation;
};
