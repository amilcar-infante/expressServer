var chokidar = require('chokidar');

var watcher = chokidar.watch('./public/images/', {
  ignored: /node_modules|\.git/,
  persistent: true,
  // followSymlinks: false,
  // useFsEvents: false,
  // usePolling: false
//}).on('all', function(event, path) {
//  console.log(event, path);
//}).on('ready', function() {
//  console.log('Ready');
})

/*
var watcher = chokidar.watch('.', {
  ignored: /[\/\\]\./, persistent: true
});
*/
var log = console.log.bind(console);

watcher
  .on('add', function(path) { log('File', path, 'has been added'); })
  .on('addDir', function(path) { log('Directory', path, 'has been added'); })
  .on('change', function(path) { log('File', path, 'has been changed'); })
  .on('unlink', function(path) { log('File', path, 'has been removed'); })
  .on('unlinkDir', function(path) { log('Directory', path, 'has been removed'); })
  .on('error', function(error) { log('Error happened', error); })
  .on('ready', function() { log('Initial scan complete. Ready for changes.'); })
  .on('raw', function(event, path, details) { log('Raw event info:', event, path, details); })

/*
// 'add', 'addDir' and 'change' events also receive stat() results as second
// argument when available: http://nodejs.org/api/fs.html#fs_class_fs_stats
watcher.on('change', function(path, stats) {
  if (stats) console.log('File', path, 'changed size to', stats.size);
});*/

// Only needed if watching is `persistent: true`.
//watcher.close();
module.exports = watcher
