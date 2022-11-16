const fs = require('fs');

function base64(file, callback){
    var coolFile = {};
    function readerOnload(e){
      var base64 = btoa(e.target.result);
      coolFile.base64 = base64;
      callback(coolFile)
    };
  
  
  }

  var reader = new FileReader();
  reader.onload = readerOnload;

  var file = file[0].files[0];
  coolFile.filetype = file.type;
  coolFile.size = file.size;
  coolFile.filename = file.name;
  fs.readAsBinaryString(file);
  reader.readAsBinaryString(file);

exports.base64 = base64;