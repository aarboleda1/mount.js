    Mount is a simple helper function to turn an Array, String or Object 
    into a set of accessor methods which accept callbacks.

    This is accomplished by porting a source value ( "raw" ), into a storeMaker
    Object, where each property is a function which accepts your callback, passes 
    in usefull arguments to your callback and invokes it.

    These Accessor Methods will return whatever your callback explicitly returns,
    or the instance of storeMaker if undefined is returned.
    
    This allows you to chain Accessor Methods and your callbacks in fluent
    Functional style.

    ##Examples:

    ```
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

    ```
