const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const modulePath = require('../util/module-path');
const getTagInfo = require('../util/get-tag-info');

getTagInfo()
  .then(({electronVersion}) => {
    var modulePath_ = modulePath();
    var target = electronVersion.replace('v', '');
    var targetArch = process.env.TARGET_ARCH;
    var cmd = path.join(modulePath_, 'node_modules', '.bin', 'node-pre-gyp');

    cmd = [cmd, 'package', 'publish', '--runtime=electron', `--target=${target}`];

    if (targetArch) {
      cmd.push(`--target_arch=${targetArch}`)
    }

    cmd = cmd.join(' ');
    var proc = cp.exec(cmd, {cwd: modulePath_, maxBuffer: Number.MAX_VALUE}, function (err, stdout, stderr) {
      console.log(stdout);
      console.error(stderr);
      if (err) {
        process.exit(1);
      }
      process.exit(0);
    });
  })
  .catch(e => {
    console.error('Error pubishing:');
    console.error(e);
    process.exit(1);
  });
