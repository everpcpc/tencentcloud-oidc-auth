# tencentcloud-oidc-auth

GitHub Action for authenticating to Tencent Cloud with [GitHub Actions OIDC tokens](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect).


## Usage

```yaml
jobs:
  job-id:
    # ...
    permissions:
      id-token: write
    steps:
      - uses: everpcpc/tencentcloud-oidc-auth@v1
        with:
          role-arn: arn:tc:iam::1234567890:role/role-name
          role-session-name: github-actions
          role-duration-seconds: 3600
          audience: sts.tencentcloudapi.com
          region: ap-guangzhou
      - run: pip install tccli
      - run: tccli cam DescribeUser
```

## Inputs

* `role-arn`: **Required**. The ARN of the role to assume.
* `role-session-name`: *Optional*. The session name to use when assuming the role, default to `github-actions-<orgName>-<repoName>`.
* `role-duration-seconds`: *Optional*. The duration, in seconds, of the role session, default to `3600`.
* `audience`: *Optional*. The intended audience (also known as client ID) of the OIDC token, default to `sts.tencentcloudapi.com`.
* `region`: *Optional*. The region of the role to assume, default to `ap-guangzhou`.


## Output Environment Variables

* `TENCENTCLOUD_SECRET_ID`: The access key ID of the temporary credentials.
* `TENCENTCLOUD_SECRET_KEY`: The secret access key of the temporary credentials.
* `TENCENTCLOUD_SECURITY_TOKEN`: The session token of the temporary credentials.
* `TENCENTCLOUD_REGION`: The region to use when calling Tencent Cloud APIs.
