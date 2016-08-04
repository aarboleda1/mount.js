/**

    mount is a simple helper function to turn an Array, String or Object 
    ( the raw ) into a new Object ( storeMaker Object ), where 
    each prop is an accesser function which accepts a callback
    and operates on the original value or the prop from the initial 
    raw

    Accessor Functions will return whatever your callback explicitly returns,
    or the instance of storeMaker if undefined is returned.
    
    This allows you to chain Accessor Methods and your callbacks in fluent
    Functional style.

    Examples:

    var o = { name: "john doe", age: 22 };
    var a = ['john doe', 22 ];
    var s = 'john doe, null';

    // Mounting Strings
    mount(s, ',')[0](function(name, i, store, original, order ){
        if( !!parseInt(store[1](store.val) )){
            console.log( name + ' is ' + store[1](store.val) + ' years old')
        } else {
            console.log( 'please have ' + name + ' record his age' )
        }
    }) 
    
    // Mounting an Object
    mount(o).name(function(name){
      console.log('the user\'s name is ' + name );
    }) 
    
    // Mounting an Array
    mount(a)[1](function(name){
      console.log('Welcome back ' + name);
    })
        
    // Remounting
    var o = { name: "john doe", age: 22 };
    var r = mount(o).name((name, prop, store) => { store[prop] = name.toUpperCase(), undefined; } ),
        s = mount(r).age(function(age, prop, store){ store[prop] = ++age; return age })
    
    // Maping Arrays or Strings to a template object.
    var a = ['john doe', 22 ],
        d = mount(a).mapTo({name: 0, age: 1}).name(function(name){console.log(name)});
        
    // Numbers & the rest of the primatives.
    var p = mount(22)
        q = mount(p);
    
    var n = q.val(function(v, k, s){ s[k]++; })
             .val(function(v, k, s){ s[k] += 99; })
             .val();

        console.log(n)
  

*/
function mount( raw, mode ){
    
  // will automaticly remount a previously instantiated Store.
  if( typeof raw === 'object' && raw !== null && raw.isMounted && raw.isMounted(raw) ){
         return raw;
  } 
  
  /**  Prototype Methods **/
  
  function makeStore(){}
  
  makeStore.prototype.mapTo = function( map, stub ){
    if(map.length !== Store.length) return false;
    stub = stub || {};
    for( var key in map ){ stub[key] = Store[map[key]](function(val){ return Store.val(val);}) }
    return mount(stub);
  }
  makeStore.prototype.isMounted = function(obj){ return obj instanceof makeStore }
  makeStore.prototype.Store = function(callback){ return callback ? callback(Store) : Store }
  makeStore.prototype.val = function(val){ return val }
  makeStore.prototype.Source = function(callback){  return callback ? ( callback( raw ), Store ): raw; }
  
  /** Store Instantiation Process **/

  var Store = new makeStore(), 
      tmp = undefined;
  
  // Strings
  if( raw && typeof raw === 'string' ) tmp = raw.split( mode || '');
  
  // Arrays
  if( raw && Array.isArray(raw) || Array.isArray(tmp) ){
    var source = tmp || raw
        source.forEach(function(val, i){
          Store[i] = function(callback ){
            return callback( val, i, Store, raw ) || Store;
          }
        })
  } else {
    if( raw && typeof raw === 'object' ) {
      Object.keys(raw).forEach(function(prop){
        return Store[prop] = function(callback){
          return callback( raw[prop], prop, Store, raw ) || Store;
        }
      })
    } else {
        makeStore.prototype.value = raw;
        makeStore.prototype.val = function(callback){
          if( callback ) return callback( raw, 'value', Store ) || Store;
          return Store.value;
        }   
    } 
  }
  return Store; 
}


module.exports = mount;