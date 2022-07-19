'use strict';

const path = require('path');
const SftpClient = require('ssh2-sftp-client');
const dotenv = require('dotenv');
const { config, directory } = require('./configs/deploy/sftp-config');

const REMOTE_DIRECTORY = directory;
const LOCAL_DIRECTORY = path.join(__dirname, 'dist');

const dotenvPath = path.join(__dirname, '..', '.env');
dotenv.config({path: dotenvPath});

async function main() {
  const client = new SftpClient('upload-test');

  try {
    await client.connect(config);

    const isExistDir = await client.exists(REMOTE_DIRECTORY);
    if (isExistDir) await client.rmdir(REMOTE_DIRECTORY, true)

    client.on('upload', info => {
      console.log(`Listener: Uploaded ${info.source}`);
    });

    const result = await client.uploadDir(LOCAL_DIRECTORY, REMOTE_DIRECTORY);
    return result;
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main()
    .then(msg => {
      console.log('\x1b[36m%s\x1b[0m', 'Upload is finished');
      console.log('\x1b[34m%s\x1b[0m', msg);

    })
    .catch(err => {
      console.log(`main error: ${err.message}`);
    });
