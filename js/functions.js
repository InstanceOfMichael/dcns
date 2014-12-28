/**
 * a file for rogue named functions
 */
function make_id(m)//for new object in hash map
{
  var hash;
  do
  {
     hash = ('' + Math.random());// not cryptographically secure
  }
  while(typeof  m[hash] != 'undefined'); // prevent collisions
  
  m[hash] = null;
  
  return hash;
}
function mt_rand(min, max){
  return Math.floor(Math.random() * (max - min) + min);
}
function prob(a)
{
  return Math.random() < a;
}
/**
 *  probably like jQuery.extend, probably like php array_merge or php array union operator
 */
function assoc_merge () {
    var obj = {},
        i = 0,
        il = arguments.length,
        key;
    for (; i < il; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                obj[key] = arguments[i][key];
            }
        }
    }
    return obj;
}
function assert(condition, message) {
  if (!condition)
  {
    message = message || "Assertion failed";
    if (typeof Error !== "undefined")
    {
        throw new Error(message);
    }
    throw message; // Fallback
  }
  return true;
}
var dir = [
  'west',
  'nw',
  'ne',
  'east',
  'se',
  'sw'
];
function generate_sub_direction_arr(d){
  return {
  'west':['sw','west'],
  'nw':['west','nw'],
  'ne':['nw','ne'],
  'east':['ne','east'],
  'se':['east','se'],
  'sw':['se','sw']
  }[d]||dir;
}
