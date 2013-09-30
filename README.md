TypeClass
=========

Typeclasses (dispatches on the first argument at runtime) for Javascript.
At the moment this relies on the function name of the constructor of a class.

# Methods
## Constructor
```javascript
new TypeClass(name, methods, [fallback])
Create a new typeclass.

name(string): name of the typeclass.
methods(array<string>): the methods an instance of this typeclass must implement.
fallback(object<string, function>): if a method of an instance is not found,
	the method in this object will be used.

returns TypeClass object
```

## instance
```javascript
typeclass.instance(type, [methods])
Creates an instance for this type of this typeclass.

type(string | array<string> | constructor): the type to dispatch on, 
	can be 'boolean', 'number', 'string', 'function', 'Object', 'Array' or any constructor name as string or constructor function.
	An array can also be used if the implementations of the instances are the same.
methods(object<string, function> | string): the implementations of the methods of the typeclass.
	Can also be a string if you want to use an implementation of an existing instance.
	If no methods are provided and type is a constructor then the methods will be searched for in the object and prototype.

returns the typeclass
```

## hasInstance
```javascript
typeclass.hasInstance(object)

object: the object to test if an instance exists

returns true if the object has an instance for this typeclass else false
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

Eq.instance(['number', 'string', 'boolean'], {
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

var Ord = new TypeClass('Ord', ['compare']);

Ord.instance(['number', 'string'], {
	compare: function(a, b) {
		return a > b? 1: a < b? -1: 0;
	}
});

// Person class
function Person(name, age) {
	this.name = name;
	this.age = age;
};
Person.prototype.compare = function(other) {
	return Ord.compare(this.age, other.age);
};

Ord.instance(Person);

var max = function(a, b) {
	return Ord.compare(a, b) == 1? a: b;
};

var arr1 = [
	new Person('Albert', 10),
	new Person('Berta', 20),
	new Person('Costner', 30)
], arr2 = [1, 5, 7, 3, 8, 7], arr3 = ['b', 'c', 'a'];

console.log(
	arr1.reduce(max),
	arr2.reduce(max),
	arr3.reduce(max),
	Eq.hasInstance('asd'),
	Eq.hasInstance(10),
	Eq.hasInstance({a: 10}),
	Eq.hasInstance([2]),
	Eq.hasInstance(/.*/),
	Ord.hasInstance('abc'),
	Ord.hasInstance(10),
	Ord.hasInstance([1])
);
```
