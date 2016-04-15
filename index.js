var minify = require('html-minifier').minify;
var stream = require('stream');
var util = require('util');
var objectAssign = require('object-assign');

var MINIFIER_DEFAULTS = {
  // http://perfectionkills.com/experimenting-with-html-minifier/#options
  removeComments: true,
  collapseWhitespace: true,
  conservativeCollapse: true
};

var DEFAULTS = {
  templateOpts: {},
  minifierOpts: {},
  noMinify: false
};

function compile(str, minifierOpts) {
  var minified = minifierOpts === false ? str : minify(str, minifierOpts);
  return minified;
}

function wrap(source) {
  return 'var dootifyProcess = require(\'dootify/process\');\n' +
    'module.exports = dootifyProcess(\'' + source + '\');';
}

function transform(src, opts) {
  var compiled = compile(src, opts.noMinify ? false : opts.minifierOpts);
  var body = wrap(compiled);
  return body;
}

var templateExtension = /\.(tmt|tpl|html|twig)$/;

function Dootify(opts) {
  stream.Transform.call(this);

  opts = objectAssign({}, opts, DEFAULTS);

  if (opts.minifierOpts !== false) {
    opts.minifierOpts = objectAssign({}, opts.minifierOpts, MINIFIER_DEFAULTS);
  }

  this._data = '';
  this._opts = opts;
}

util.inherits(Dootify, stream.Transform);

Dootify.prototype._transform = function (buf, enc, next) {
  this._data += buf;
  next();
};

Dootify.prototype._flush = function (next) {
  try {
    this.push(transform(this._data, this._opts));
  } catch(err) {
    this.emit('error', err);
    return;
  }
  next();
};

function dootify(file, opts) {
  if (!templateExtension.test(file)) {
    return new stream.PassThrough();
  }
  return new Dootify(opts);
}

module.exports = dootify;
module.exports.compile = compile;
module.exports.wrap = wrap;
module.exports.transform = transform;
