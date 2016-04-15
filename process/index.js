var Twig = require('twig'), // Twig module
  twig = Twig.twig; // Render function
  autoElemsFromDom = require('auto-elems-from-dom');

require('auto-elems-from-dom/polyfill');

function process(source) {
  return function(data) {
    var template = twig({ data: source }),
      fragment = autoElemsFromDom(template.render(data), 'attr', 'data-dootify', true);
    return fragment;
  };
}

module.exports = process;
