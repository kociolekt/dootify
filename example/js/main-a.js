var
  $ = require('jquery'),
  template = require('./twig/index.html.twig');

console.log(common, a, b);

$(document).ready(function() {
  console.log(template);
  var t = template({
    item: 'world',
    posts: [
      {
        title: 'aaaaaaaaaaaa',
        body: 'lorem ipsum dolor sit amet'
      },
      {
        title: 'bbbbbbbbbbbb',
        body: 'ipsum dolor sit amet'
      },
      {
        title: 'bvvvvvvvvvvvv',
        body: 'dolor sit amet'
      }
    ]
  });
  console.log(t);
  $(document.body).find('#content').append(t);
});
