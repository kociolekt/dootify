# dootify

> Auto-variablizing browserify plugin to require [Twig](https://github.com/justjohn/twig.js/wiki) template files.

## installation
Install from npm:
```
$ npm install dootify
```

## usage
Use it as browserify transform module with -t:
```
$ browserify -t dootify main.js -o bundle.js
```

Or use it as browserify transform module in gulp:
```js
browserify({
  entries: 'main.js',
  debug: true,
  transform: [
    'dootify'
  ]
});
```

Twig template files (.tmt, .tpl, .html, .twig)
```html
<!-- template.html -->
<div class="example">
  {{content}}
  <div class="button" data-dootify="exampleButton"></div>
</div>
```

Require inside main.js and invoke like Twig template. Use it like DOM Element with cached nodes in object fields.
```js
// main.js
var template = require('../../templates/template.html'); // Twig template

// Append template with javascript
var templateDOM = template({content: 'Hello'}); // HTML DOM DocumentFragment
document.body.appendChild(templateDOM);

// Bind events
var templateButton = templateDOM.exampleButton // Cached HTML DOM Element Object
templateButton.addEventListener('click', function(){
  alert(1);
});
```
