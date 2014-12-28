// from MDN
if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    if (this === undefined || this === null) {
      throw new TypeError('Cannot convert this value to object');
    }
    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1], 10) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) k = 0;
    }
    while (k < len) {
      var currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}

// http://stackoverflow.com/a/12042959
Array.prototype.unique = function(){
  'use strict';
  var im = {}, uniq = [];
  for (var i=0;i<this.length;i++){
    var type = (this[i]).constructor.name, 
    //          ^note: for IE use this[i].constructor!
        val = type + (!/num|str|regex|bool/i.test(type) 
               ? JSON.stringify(this[i]) 
               : this[i]);
    if (!(val in im)){uniq.push(this[i]);}
    im[val] = 1;
  }
  return uniq;
}