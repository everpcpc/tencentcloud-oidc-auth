'use strict';

export interface ResponseError {
    Code: string;
    Message: string;
}

// from https://github.com/TencentCloud/tencentcloud-sdk-nodejs/blob/master/tencentcloud/services/sts/v20180813/sts_models.d.ts

/**
 * 临时证书
 */
export interface Credentials {
    /**
      * token。token长度和绑定的策略有关，最长不超过4096字节。
      */
    Token: string;
    /**
      * 临时证书密钥ID。最长不超过1024字节。
      */
    TmpSecretId: string;
    /**
      * 临时证书密钥Key。最长不超过1024字节。
      */
    TmpSecretKey: string;
}

/**
 * AssumeRoleWithWebIdentity请求参数结构体
 */
export interface AssumeRoleWithWebIdentityRequest {
    /**
      * 身份提供商名称
      */
    ProviderId: string;
    /**
      * IdP签发的OIDC令牌
      */
    WebIdentityToken: string;
    /**
      * 角色访问描述名
      */
    RoleArn: string;
    /**
      * 会话名称
      */
    RoleSessionName: string;
    /**
      * 指定临时证书的有效期，单位：秒，默认 7200 秒，最长可设定有效期为 43200 秒
      */
    DurationSeconds?: number;
}

/**
 * AssumeRoleWithWebIdentity返回参数结构体
 */
export interface AssumeRoleWithWebIdentityResponse {
    /**
      * 临时密钥过期时间(时间戳)
      */
    ExpiredTime: number;
    /**
      * 临时密钥过期时间
      */
    Expiration: string;
    /**
      * 临时密钥
      */
    Credentials: Credentials;
    /**
      * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
      */
    RequestId?: string;

    /**
     * 错误信息
     */
    Error?: ResponseError;
}
