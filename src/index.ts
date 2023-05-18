'use strict';

import * as core from '@actions/core';
import * as github from "@actions/github";
import { errorMessage } from '@google-github-actions/actions-utils';
import { sts } from 'tencentcloud-sdk-nodejs';
import * as utils from './utils';


export function genSessionName(rawName: string) {
    const replaceIllegalCharacters = function (s: string) {
        return s.replace(/[^-\w.@]/g, '@');
    };
    let finalName = rawName;
    if (finalName.length < 2) {
        finalName = 'github-actions-<orgName>-<repoName>';
    }
    if (finalName.includes('<orgName>')) {
        const orgName = github.context.repo.owner;
        finalName = finalName.replace('<orgName>', replaceIllegalCharacters(orgName));
    }
    if (finalName.includes('<repoName>')) {
        const repoName = github.context.repo.repo;
        finalName = finalName.replace('<repoName>', replaceIllegalCharacters(repoName));
    }
    if (finalName.length >= 64) {
        finalName = finalName.slice(0, 63);
    }
    return finalName;
}

async function main() {
    const audience = core.getInput('audience', { required: false });
    const oidcToken = await core.getIDToken(audience);
    const roleArn = core.getInput('role-arn', { required: true });
    const region = core.getInput('region', { required: false });
    const durationSeconds = Number(core.getInput('role-duration-seconds', { required: false }));
    const rawSessionName = core.getInput('role-session-name', { required: false });
    const sessionName = genSessionName(rawSessionName);

    const client = new sts.v20180813.Client({
        credential: {
            secretId: '',
            secretKey: '',
        },
    });

    const resp = await client.AssumeRoleWithWebIdentity({
        RoleArn: roleArn,
        RoleSessionName: sessionName,
        WebIdentityToken: oidcToken,
        DurationSeconds: durationSeconds,
        ProviderId: 'OIDC',
    });

    utils.exportEnvs(resp.Credentials.TmpSecretId, resp.Credentials.TmpSecretKey, resp.Credentials.Token, region);
}

async function run() {
    try {
        await main();
    } catch (e) {
        // @ts-ignore
        core.error(e);
        const msg = errorMessage(e);
        core.setFailed(`TencentCloud OIDC Auth failed with: ${msg}`);
    }
}

run();
