import {execSync, spawnSync} from 'child_process';
import {config} from 'dotenv';

config();

const {GCP_PROJECT, npm_package_version} = process.env;

const IMAGE = `europe-west2-docker.pkg.dev/${GCP_PROJECT}/integration-generic/integration-generic`;
const VERSION = npm_package_version;

let COMMIT_HASH = '';
try {
  COMMIT_HASH = execSync('git rev-parse --short HEAD').toString().trim();
} catch (error) {
  const errorMsg = 'Failed to get current commit hash';
  console.error(errorMsg);
  throw Error(errorMsg);
}

const localLatestTag = 'integration-generic:latest';
const pushLatestTag = `${IMAGE}:latest`;
const pushImageTag = `${IMAGE}:${VERSION}`;
const pushImageTagWithCommitHash = `${pushImageTag}.${COMMIT_HASH}`;

const buildCommandArgs = [
  'build',
  '-f',
  'examples/generic-connector/Dockerfile',
  '.',
  '-t',
  localLatestTag,
  '-t',
  pushLatestTag,
  '-t',
  pushImageTag,
  '-t',
  pushImageTagWithCommitHash,
];

try {
  console.log(`Building Docker image: ${pushImageTag}`);
  console.log(`Build command: docker ${buildCommandArgs.join(' ')}`);

  spawnSync('docker', buildCommandArgs, {
    stdio: 'inherit',
    shell: false,
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  throw error;
}
