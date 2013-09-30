var TypeClass = require('./TypeClass');

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
