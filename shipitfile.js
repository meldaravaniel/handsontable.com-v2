module.exports = function(shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    production: {
      servers: 'deploy@142.4.202.189:22022',
      workspace: '/tmp/handsontable.com',
      deployTo: '/home/httpd/handsontable.com',
      repositoryUrl: 'https://github.com/handsontable/handsontable.com-v2.git',
      branch: 'master',
      ignores: ['.git', 'node_modules', 'www'],
      rsync: ['--force', '--delete', '--delete-excluded', '-I', '--stats', '--chmod=ug=rwX'],
      keepReleases: 5,
      shallowClone: true
    },
    development: {
      servers: 'deploy@142.4.202.189:22022',
      workspace: '/tmp/dev.handsontable.com',
      deployTo: '/home/httpd/dev/handsontable.com',
      repositoryUrl: 'https://github.com/handsontable/handsontable.com-v2.git',
      branch: 'develop',
      ignores: ['.git', 'node_modules', 'www'],
      rsync: ['--force', '--delete', '--delete-excluded', '-I', '--stats', '--chmod=ug=rwX'],
      keepReleases: 1,
      shallowClone: true
    }
  });

  shipit.task('test', function() {
    shipit.remote('pwd');
  });

  shipit.blTask('deploy', ['deploy:init', 'deploy:fetch', 'deploy:update']);

  shipit.on('updated', function() {
    const path = shipit.releasePath;
    const dirname = shipit.releaseDirname;

    shipit.remote(`cd ${shipit.config.deployTo} && ./build.sh ${dirname}`).then(function() {
      shipit.start(['deploy:publish', 'deploy:clean']);
    });
  });
  
  shipit.on('published', function() {
    shipit.remote(`cd ${shipit.config.deployTo} && ./up.sh`);
  });
};
