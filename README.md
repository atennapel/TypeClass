TypeClass
=========

Typeclasses (dispatches on the first argument at runtime) for Javascript.

# Methods
## Constructor
```javascript
new TypeClass(name, methods, [fallback])

name(string): name of the typeclass.
methods(array<string>): the methods an instance of this typeclass must implement.
fallback(object<string, function>): if a method of an instance is not found,
	the method in this object will be used.
```

## instance
```javascript
typeclass.instance(type, methods)

type(string | array<string>): the type to dispatch on, 
	can be 'number', 'string', 'function', 'Object', 'Array' or any constructor name.
	An array can also be used if the implementations of the instances are the same.
methods(object<string, function> | string): the implementations of the methods of the typeclass.
	Can also be a string if you want to use an implementation of an existing instance.
```

# Example
```javascript
var Eq = new TypeClass('Eq', ['eq', 'neq'], {
	neq: function(a, b) {
		return !this.eq(a, b);
	}
});

var eq = Eq.eq,
		neq = Eq.neq;

Eq.instance(['number', 'string'], {
	eq: function(a, b) {
		return a === b;
	}
}).instance('Object', {
	eq: function(a, b) {
		var keys = Object.keys(a);
		if(this.neq(keys, Object.keys(b)))
			return false;

		for(var i=0,l=keys.length;i<l;i++)
			if(this.neq(a[keys[i]], b[keys[i]]))
				return false
		return true;
	}
}).instance('Array', {
	eq: function(a, b) {
		if(a.length !== b.length) return false;
		else if(a.length === 0) return true;

		for(var i=0,l=a.length;i<l;i++)
			if(this.neq(a[i], b[i]))
				return false;
		return true;
	}
});

console.log(
	eq(10, 10),
	neq(5, 6),
	eq('abc', 'abc'),
	eq({a: 1, b: 2}, {a: 1, b: 2}),
	eq([1, 2, 3], [1, 2, 3])
);
```
