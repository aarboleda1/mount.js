const mount = require('./mount');
	
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