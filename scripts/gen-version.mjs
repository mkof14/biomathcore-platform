import { writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
const sh = (cmd) => execSync(cmd, {stdio:['ignore','pipe','ignore']}).toString().trim();
const commit = (process.env.VERCEL_GIT_COMMIT_SHA || sh('git rev-parse HEAD')).slice(0,7);
const branch = process.env.VERCEL_GIT_COMMIT_REF || sh('git rev-parse --abbrev-ref HEAD');
const builtAt = new Date().toISOString();
const payload = { branch, commit, builtAt };
writeFileSync('public/version.json', JSON.stringify(payload, null, 2));
console.log(payload);
