/* @author: Albert ten Napel
 * @version: 1.0
 * @date: 2013-9-30
 * Some basic typeclasses.
 */
var TypeClass = require('./TypeClass');

// Eq
var Eq = new TypeClass('Eq', ['eq', 'neq'], {
	neq: function(a, b) {
		return !this.eq(a, b);
	}
});
var eq = Eq.eq, neq = Eq.neq;

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

// Ord
var Ord = new TypeClass('Ord', ['compare', 'lt', 'gt'], {
	lt: function(a, b) {
		return this.compare(a, b) == -1;
	},
	gt: function(a, b) {
		return this.compare(a, b) == 1;
	}
});
var compare = Ord.compare,
		lt = Ord.lt,
		gt = Ord.gt,
		lteq = function(a, b) {
			return Ord.compare(a, b) == -1 || Eq.eq(a, b);
		},
		gteq = function(a, b) {
			return Ord.compare(a, b) == 1 || Eq.eq(a, b);
		},
		max = function(a, b) {
			return Ord.compare(a, b) == 1? a: b;
		};

Ord.instance(['number', 'string'], {
	compare: function(a, b) {
		return a > b? 1: a < b? -1: 0;
	}
});

// Num
var Num = new TypeClass('Num', ['add', 'sub', 'mul', 'div']);
var add = Num.add,
		sub = Num.sub,
		mul = Num.mul,
		div = Num.div;
Num.instance('number', {
	add: function(a, b) {return a+b},
	sub: function(a, b) {return a-b},
	mul: function(a, b) {return a*b},
	div: function(a, b) {return a/b}
});

// Concat
var Concat = new TypeClass('Concat', ['concat']);
var concat = Concat.concat;
Concat.instance('string', {
	concat: function(a, b) {return a+b},
}).instance(Array);

// Enum
var Enum = new TypeClass('Enum', ['succ', 'pred']);
var succ = Enum.succ, pred = Enum.pred;
Enum.instance('number', {
	succ: function(x) {return x+1},
	pred: function(x) {return x-1}
}).instance('string', {
	succ: function(x) {
		return String.fromCharCode(x.charCodeAt()+1)+x.slice(1);
	},
	pred: function(x) {
		return String.fromCharCode(x.charCodeAt()-1)+x.slice(1);
	}
});

var range = function(a, b) {
	for(var r = [a]; Eq.neq(a, b);)
		r.push(a = Enum.succ(a));
	return r;
};

// Bool
var Bool = new TypeClass('Bool', ['bool'], {
	bool: function(x) {return !!x}
});
var bool = Bool.bool;
Bool.instance(['boolean', 'number', 'string'])
		.instance(Array, {
			bool: function(a) {
				return a.length > 0;
			}
		}).instance([Object, 'object'], {
			bool: function(o) {
				return Object.keys(o).length > 0;
			}
		});

// Str
var Str = new TypeClass('Str', ['str'], {
	str: function(x) {return ''+x}
});
var str = Str.str;
Str.instance(['boolean', 'number', 'string']);

// Map
var Map = new TypeClass('Map', ['map']);
var map = Map.map;
Map.instance(Array, {
	map: function(a, f) {return a.map(f)}
}).instance([Object, 'object'], {
	map: function(o, f) {
		var r = {};
		for(var k in o) {
			if(o.hasOwnProperty(k)) {
				r[k] = f(o[k], k);
			}
		}
		return r;
	}
}).instance('string', {
	map: function(s, f) {
		for(var i=0,l=s.length,r=[];i<l;i++)
			r.push(f(s[i]));
		return r.join('');
	}
});
