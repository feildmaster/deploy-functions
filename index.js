import { getInput } from '@actions/core';
import { exec } from '@actions/exec';
import cache_file from '@fmdev/cache-file/src/cache_file';

const serviceAccount = getInput('SERVICE_ACCOUNT');
const only = getInput('ONLY');

if (!serviceAccount) throw new Error('Missing service account');

const fileName = cache_file(serviceAccount);

exec('npx firebase-tools', [
  'deploy',
  '--only',
  `functions${only ? `:${only}` : ''}`,
], {
  env: {
    ...process.env,
    FIREBASE_DEPLOY_AGENT: 'github-actions',
    GOOGLE_APPLICATION_CREDENTIALS: fileName,
  },
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
