'use strict';

import * as core from "@actions/core";

export function exportEnvs(secretId: string, secretKey: string, securityToken: string, region: string) {
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
    core.exportVariable('TENCENTCLOUD_SECURITY_TOKEN', securityToken);
    core.exportVariable('TENCENTCLOUD_REGION', region);
}
