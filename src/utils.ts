'use strict';

import * as core from "@actions/core";
import * as github from "@actions/github";


export function ExportEnvs(secretId: string, secretKey: string, securityToken: string, region: string) {
    if (secretId) {
        core.setSecret(secretId);
    }
    if (secretKey) {
        core.setSecret(secretKey);
    }
    if (securityToken) {
        core.setSecret(securityToken);
    }

    core.exportVariable('TENCENTCLOUD_SECRET_ID', secretId);
    core.exportVariable('TENCENTCLOUD_SECRET_KEY', secretKey);
    // for tccli:https://github.com/TencentCloud/tencentcloud-cli/blob/3.0.878.1/tccli/options_define.py#L31
    core.exportVariable('TENCENTCLOUD_TOKEN', securityToken);
    // for pulumi-tencentcloud: https://github.com/tencentcloudstack/pulumi-tencentcloud/blob/v0.1.3/docs/installation-configuration.md?plain=1#L43
    core.exportVariable('TENCENTCLOUD_SECURITY_TOKEN', securityToken);
    core.exportVariable('TENCENTCLOUD_REGION', region);
}

export function GenSessionName(rawName: string) {
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
