/*
@customDomain
zoneName robofs.com
productionCertArn {arn}
productionDomain robofs.com
stagingCertArn {arn}
stagingDomain stage.robofs.com
*/

module.exports = function(arc, cloudformation, stage) {
  const params = {};
  console.log('called');
  console.log('called');
  console.log('called');
  console.log(arc);
  //only on stage
  if (stage !== 'staging' || !arc.customDomain) {
    return cloudformation;
  }

  const domainName = process.env.ARC_DOMAIN || arc.customDomain[0];
  const route53Host = arc.customDomain[1];
  const certArn = arc.customDomain[2];
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
