/* @author: Albert ten Napel
 * @version: 1.2
 * @date: 2013-9-30
 */
var TypeClass = (function() {
	function TypeClass(name, methods, fallbacks) {
		if(!methods || !methods.length)
			throw 'TypeClass needs atleast one method.';
		this._name = name;
		this._methods = methods;
		this._fallbacks = fallbacks || {};
		this._types = {};

		for(var i=0,l=methods.length;i<l;i++) (function(c, self) {
			self[c] = (function(a) {
				if(a === undefined) throw "First argument can't be undefined."
				
				var t = typeof a,
						f = (t == 'number' || t == 'function' || t == 'string')?
							t:
							a.constructor && a.constructor.name?
								a.constructor.name:
								t;
				
				var fn = this._types[f] && this._types[f][c];
				if(fn)
					return fn.apply(this, arguments);
				else
					if(this._fallbacks[c]) return this._fallbacks[c].apply(this, arguments);
				else
					throw 'No instance found for type '+f+' for TypeClass '+this._name+' for method '+c+'.';
			}).bind(self);
		})(methods[i], this);
	}

	TypeClass.prototype.instance = function(type, methods) {
		if(!type)
			throw 'An instance needs a type.';

		var ms = methods && (
			typeof methods == 'string'?
				this._types[methods]:
				methods);

		if(!ms && typeof type != 'string' && !Array.isArray(type)) {
			ms = {};
			for(var i=0,l=this._methods.length;i<l;i++) {
				var tpm = this._methods[i];
				var m = type[tpm] || (type.prototype && type.prototype[tpm]);
				if(m) ms[tpm] = this._wrapMethod(m);
			}
		}

		if(typeof type != 'string') {
			if(Array.isArray(type))
				type = type.map(function(c) {return typeof c == 'string'? c: c.name});
			else type = type.name;
		}

		if(!ms) ms = {};

		if(Array.isArray(type))
			for(var i=0,l=type.length;i<l;i++)
				this._types[type[i]] = ms;
		else
			this._types[type] = ms;
		
		return this;
	};

	TypeClass.prototype._wrapMethod = function(m) {
		return function() {
			return m.apply(arguments[0], [].slice.call(arguments, 1));
		};
	};

	TypeClass.prototype.hasInstance = function(a) {
		var t = typeof a,
				f = (t == 'number' || t == 'function' || t == 'string')?
					t:
					a.constructor && a.constructor.name?
						a.constructor.name:
						t;
		return !!this._types[f];
	};

	return TypeClass;
})();

if(typeof module != 'undefined') module.exports = TypeClass;
