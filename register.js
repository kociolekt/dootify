var
  fs = require('fs'),
  dootify = require('./'),
  registered,
  DEFAULT_EXTENSIONS = ['.tmt', '.tpl', '.html', '.twig'];

function stripBOM(content) {
  return content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
}

module.exports = function(opts) {
  var extensions;

  if (registered) return;
  if (!opts) opts = {};

  extensions = opts.extensions || DEFAULT_EXTENSIONS;

  function compile(module, file) {
    var
      src = stripBOM(fs.readFileSync(file, 'utf8')),
      transformed = dootify.transform(src, opts);

    module._compile(transformed, file);
  }

  extensions.forEach(function(ext) {
    require.extensions[ext] = compile;
  });
  registered = true;
};
