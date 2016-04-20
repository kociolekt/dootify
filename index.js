'use strict';

var twig             = require('twig').twig;
var through          = require('through2');
var minify           = require('html-minifier').minify;
var autoElemsFromDom = require('auto-elems-from-dom');

var ext = /\.(twig)$/;

var minifyDefaults = {
  removeComments: true,
  collapseWhitespace: true
};

function compile(id, str) {
  var minified = minify(str, minifyDefaults);

  // check if template already exists
  var template = twig({ ref: id });
  if (!template) {
    template = twig({
      id: id,
      data: minified
    });
  }

  var tokens = JSON.stringify(template.tokens);
  // the id will be the filename and path relative to the require()ing module
  return 'function(data) {'+
    '  var template = twig({'+
    '    id: __filename,'+
    '    data:' + tokens + ','+
    '    precompiled: true,'+
    '    allowInlineIncludes: true'+
    '  });'+
    '  var fragment = autoElemsFromDom(' +
    '    template.render(data),' +
    '    \'attr\',' +
    '    \'data-dootify\',' +
    '    true' +
    '  );'+
    '  return fragment;'+
    '}';
}

function process(source) {
  return (
    'var twig = require(\'twig\').twig;\n' +
    'var autoElemsFromDom = require(\'auto-elems-from-dom\');\n' +
    'module.exports = ' + source + ';\n'
  );
}

function twigify(file, opts) {
  if (!ext.test(file)) return through();
  if (!opts) opts = {};

  var id = file;
  // @TODO: pass a path via CLI to use for relative file paths
  //opts.path ? file.replace(opts.path, '') : file;

  var buffers = [];

  function push(chunk, enc, next) {
    buffers.push(chunk);
    next();
  }

  function end(next) {
    var str = Buffer.concat(buffers).toString();
    var compiledTwig;

    try {
      compiledTwig = compile(id, str);
    } catch(e) {
      return this.emit('error', e);
    }

    this.push(process(compiledTwig));
    next();
  }

  return through(push, end);
}

module.exports = twigify;
module.exports.process = process;
module.exports.compile = compile;
