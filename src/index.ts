'use strict';

import * as core from '@actions/core';
import axios from 'axios';
import { ExportEnvs, GenSessionName } from './utils';
import { AssumeRoleWithWebIdentityRequest, AssumeRoleWithWebIdentityResponse } from './models';
import { sts } from 'tencentcloud-sdk-nodejs';

export interface APIResponse {
    Response: AssumeRoleWithWebIdentityResponse;
}

async function assumeRole(req: AssumeRoleWithWebIdentityRequest, region: string): Promise<AssumeRoleWithWebIdentityResponse> {
    const response = await axios.post<APIResponse>(
        'https://sts.tencentcloudapi.com/',
        req,
        {
            timeout: 3000,
            headers: {
                "X-TC-Action": "AssumeRoleWithWebIdentity",
                "X-TC-Region": region,
                "X-TC-Timestamp": Math.floor(Date.now() / 1000).toString(),
                "X-TC-Version": "2018-08-13",
                "Authorization": "SKIP",
            },
        },
    );

    const resp = response.data.Response;
    if (resp.Error) {
        throw new Error(`API Error: ${resp.Error.Code}: ${resp.Error.Message}, RequestId: ${resp.RequestId}`);
    }
    return resp;
}

async function checkCallerIdentity(identity: AssumeRoleWithWebIdentityResponse, region: string, maskAccountId: Boolean) {
    const client = new sts.v20180813.Client({
        credential: {
            secretId: identity.Credentials.TmpSecretId,
            secretKey: identity.Credentials.TmpSecretKey,
            token: identity.Credentials.Token,
        },
        region: region,
        profile: {
            httpProfile: {
                endpoint: "sts.tencentcloudapi.com",
                reqTimeout: 10,
            },
        },
    });
    let resp = await client.GetCallerIdentity();
    if (!resp.AccountId) {
        throw new Error(`GetCallerIdentity failed, AccountId is null, RequestId: ${resp.RequestId}`);
    }
    if (maskAccountId) {
        core.setSecret(resp.AccountId);
    }
}


async function main() {
    const audience = core.getInput('audience', { required: false });
    const oidcToken = await core.getIDToken(audience);
    const roleArn = core.getInput('role-arn', { required: true });
    const oidcProviderId = core.getInput('oidc-provider-id', { required: true });
    const region = core.getInput('region', { required: false });
    const durationSeconds = Number(core.getInput('role-duration-seconds', { required: false }));
    const rawSessionName = core.getInput('role-session-name', { required: false });
    const sessionName = GenSessionName(rawSessionName);
    const maskAccountId = core.getInput('mask-account-id', { required: false }) === 'true';

    const req: AssumeRoleWithWebIdentityRequest = {
        DurationSeconds: durationSeconds,
        RoleSessionName: sessionName,
        WebIdentityToken: oidcToken,
        RoleArn: roleArn,
        ProviderId: oidcProviderId,
    };
    const resp = await assumeRole(req, region);
    await checkCallerIdentity(resp, region, maskAccountId);

    ExportEnvs(resp.Credentials.TmpSecretId, resp.Credentials.TmpSecretKey, resp.Credentials.Token, region);
}

async function run() {
    try {
        await main();
    } catch (e) {
        // @ts-ignore
        core.error(e);
        core.setFailed('TencentCloud OIDC Auth failed');
    }
}

run();
