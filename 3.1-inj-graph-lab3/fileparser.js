/**
 * Created by numminorihsf on 20.07.15.
 */
function getXmlHttp() {
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}

function File(path){
  this.path = path;
  this.data = null;
  this.callback = null;
  var xmlhttp = getXmlHttp();
  xmlhttp.open('GET', path, true);
  
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
          var response = xmlhttp.responseText;
          this.data = JSON.parse(response);
          if (this.callback) this.callback();
    }
  }.bind(this);

  
  xmlhttp.send(null);
  
  return this;
}

File.prototype.getObjects = function(){
  return this.data.map(function(elem){
    return {type: elem.type, coordinates: elem.coordinates.map(function(c){
      return [c[0], c[1]];
    })}
  });
};

File.prototype.onLoad = function(cb){
    if (this.data) cb();
    else this.callback = cb;
}