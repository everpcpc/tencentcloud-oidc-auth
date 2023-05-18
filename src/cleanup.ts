'use strict';

import * as core from '@actions/core';
import { ExportEnvs } from './utils';

/**
 * When the GitHub Actions job is done, clean up any environment variables that
 * may have been set by the tencentcloud-oidc-auth steps in the job.
 *
 * Environment variables are not intended to be shared across different jobs in
 * the same GitHub Actions workflow: GitHub Actions documentation states that
 * each job runs in a fresh instance.  However, doing our own cleanup will
 * give us additional assurance that these environment variables are not shared
 * with any other jobs.
 */

async function main() {
    try {
        // The GitHub Actions toolkit does not have an option to completely unset
        // environment variables, so we overwrite the current value with an empty
        // string.
        ExportEnvs('', '', '', '');
    } catch (error) {
        // @ts-ignore
        core.setFailed(error.message);
    }
}

async function run() {
    await main();
}

run();
