window.addEvent('domready', function() {
  var combos = document.querySelectorAll('[data-action="submits"]');
  for (var i=0; i<combos.length; i++) {
    console.log(combos[i]);
    combos[i].addEventListener('onchange', function() {document.getElementById('adminForm').submit();});    
  }
});