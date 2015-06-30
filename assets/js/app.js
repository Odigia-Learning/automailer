(function(){
  console.log('loaded app.js');

  var editors = document.getElementsByTagName('textarea');

  if(editors){
    for(var i = 0, x = editors.length; i < x; i++){
      if(editors[i].id){
        CKEDITOR.replace(editors[i].id);
      } else {
        editors[i].id = 'generated-id-' + i;
        CKEDITOR.replace(editors[i].id);
      }
    }
  }
  
})();
