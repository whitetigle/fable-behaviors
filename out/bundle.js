(function (exports,PIXI) {
'use strict';

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// 7.1.4 ToInteger
var ceil  = Math.ceil;
var floor = Math.floor;
var _toInteger = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

var toInteger = _toInteger;
var defined   = _defined;
// true  -> String#at
// false -> String#codePointAt
var _stringAt = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _library = true;

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
});

var _aFunction = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

var aFunction = _aFunction;
var _ctx = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

var _isObject = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var isObject = _isObject;
var _anObject = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

var _descriptors = !_fails(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

var isObject$1 = _isObject;
var document$1 = _global.document;
var is = isObject$1(document$1) && isObject$1(document$1.createElement);
var _domCreate = function(it){
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function(){
  return Object.defineProperty(_domCreate('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

var isObject$2 = _isObject;
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function(it, S){
  if(!isObject$2(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject$2(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

var anObject       = _anObject;
var IE8_DOM_DEFINE = _ie8DomDefine;
var toPrimitive    = _toPrimitive;
var dP$1             = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP$1(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

var dP         = _objectDp;
var createDesc = _propertyDesc;
var _hide = _descriptors ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

var global$1    = _global;
var core      = _core;
var ctx       = _ctx;
var hide$1      = _hide;
var PROTOTYPE = 'prototype';

var $export$1 = function(type, name, source){
  var IS_FORCED = type & $export$1.F
    , IS_GLOBAL = type & $export$1.G
    , IS_STATIC = type & $export$1.S
    , IS_PROTO  = type & $export$1.P
    , IS_BIND   = type & $export$1.B
    , IS_WRAP   = type & $export$1.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global$1 : IS_STATIC ? global$1[name] : (global$1[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global$1)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export$1.R && expProto && !expProto[key])hide$1(expProto, key, out);
    }
  }
};
// type bitmap
$export$1.F = 1;   // forced
$export$1.G = 2;   // global
$export$1.S = 4;   // static
$export$1.P = 8;   // proto
$export$1.B = 16;  // bind
$export$1.W = 32;  // wrap
$export$1.U = 64;  // safe
$export$1.R = 128; // real proto method for `library` 
var _export = $export$1;

var _redefine = _hide;

var hasOwnProperty = {}.hasOwnProperty;
var _has = function(it, key){
  return hasOwnProperty.call(it, key);
};

var _iterators = {};

var toString$1 = {}.toString;

var _cof = function(it){
  return toString$1.call(it).slice(8, -1);
};

var cof = _cof;
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

var IObject = _iobject;
var defined$1 = _defined;
var _toIobject = function(it){
  return IObject(defined$1(it));
};

var toInteger$1 = _toInteger;
var min       = Math.min;
var _toLength = function(it){
  return it > 0 ? min(toInteger$1(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var toInteger$2 = _toInteger;
var max       = Math.max;
var min$1       = Math.min;
var _toIndex = function(index, length){
  index = toInteger$2(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

var toIObject$1 = _toIobject;
var toLength  = _toLength;
var toIndex   = _toIndex;
var _arrayIncludes = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject$1($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var global$2 = _global;
var SHARED = '__core-js_shared__';
var store  = global$2[SHARED] || (global$2[SHARED] = {});
var _shared = function(key){
  return store[key] || (store[key] = {});
};

var id = 0;
var px = Math.random();
var _uid = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var shared = _shared('keys');
var uid    = _uid;
var _sharedKey = function(key){
  return shared[key] || (shared[key] = uid(key));
};

var has$2          = _has;
var toIObject    = _toIobject;
var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO$1     = _sharedKey('IE_PROTO');

var _objectKeysInternal = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO$1)has$2(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has$2(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

var $keys       = _objectKeysInternal;
var enumBugKeys$1 = _enumBugKeys;

var _objectKeys = Object.keys || function keys(O){
  return $keys(O, enumBugKeys$1);
};

var dP$2       = _objectDp;
var anObject$2 = _anObject;
var getKeys  = _objectKeys;

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties){
  anObject$2(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP$2.f(O, P = keys[i++], Properties[P]);
  return O;
};

var _html = _global.document && document.documentElement;

var anObject$1    = _anObject;
var dPs         = _objectDps;
var enumBugKeys = _enumBugKeys;
var IE_PROTO    = _sharedKey('IE_PROTO');
var Empty       = function(){ /* empty */ };
var PROTOTYPE$1   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE$1][enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE$1] = anObject$1(O);
    result = new Empty;
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

var _wks = createCommonjsModule(function (module) {
var store      = _shared('wks')
  , uid        = _uid
  , Symbol     = _global.Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;
var has$3 = _has;
var TAG = _wks('toStringTag');

var _setToStringTag = function(it, tag, stat){
  if(it && !has$3(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

var create$1         = _objectCreate;
var descriptor     = _propertyDesc;
var setToStringTag$1 = _setToStringTag;
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function(){ return this; });

var _iterCreate = function(Constructor, NAME, next){
  Constructor.prototype = create$1(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag$1(Constructor, NAME + ' Iterator');
};

var defined$2 = _defined;
var _toObject = function(it){
  return Object(defined$2(it));
};

var has$4         = _has;
var toObject    = _toObject;
var IE_PROTO$2    = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has$4(O, IE_PROTO$2))return O[IE_PROTO$2];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var LIBRARY        = _library;
var $export        = _export;
var redefine       = _redefine;
var hide           = _hide;
var has$1            = _has;
var Iterators      = _iterators;
var $iterCreate    = _iterCreate;
var setToStringTag = _setToStringTag;
var getPrototypeOf$1 = _objectGpo;
var ITERATOR       = _wks('iterator');
var BUGGY          = !([].keys && 'next' in [].keys());
var FF_ITERATOR    = '@@iterator';
var KEYS           = 'keys';
var VALUES         = 'values';

var returnThis = function(){ return this; };

var _iterDefine = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf$1($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has$1(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

var $at  = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

var _addToUnscopables = function(){ /* empty */ };

var _iterStep = function(done, value){
  return {value: value, done: !!done};
};

var addToUnscopables = _addToUnscopables;
var step             = _iterStep;
var Iterators$2        = _iterators;
var toIObject$2        = _toIobject;

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function(iterated, kind){
  this._t = toIObject$2(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators$2.Arguments = Iterators$2.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

var global$3        = _global;
var hide$2          = _hide;
var Iterators$1     = _iterators;
var TO_STRING_TAG = _wks('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global$3[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide$2(proto, TO_STRING_TAG, NAME);
  Iterators$1[NAME] = Iterators$1.Array;
}

var f$1 = _wks;

var _wksExt = {
	f: f$1
};

var iterator$2 = _wksExt.f('iterator');

var iterator = createCommonjsModule(function (module) {
module.exports = { "default": iterator$2, __esModule: true };
});

var _meta = createCommonjsModule(function (module) {
var META     = _uid('meta')
  , isObject = _isObject
  , has      = _has
  , setDesc  = _objectDp.f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !_fails(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
});

var global$5         = _global;
var core$1           = _core;
var LIBRARY$1        = _library;
var wksExt$1         = _wksExt;
var defineProperty$1 = _objectDp.f;
var _wksDefine = function(name){
  var $Symbol = core$1.Symbol || (core$1.Symbol = LIBRARY$1 ? {} : global$5.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty$1($Symbol, name, {value: wksExt$1.f(name)});
};

var getKeys$1   = _objectKeys;
var toIObject$4 = _toIobject;
var _keyof = function(object, el){
  var O      = toIObject$4(object)
    , keys   = getKeys$1(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

var f$2 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$2
};

var f$3 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$3
};

var getKeys$2 = _objectKeys;
var gOPS    = _objectGops;
var pIE     = _objectPie;
var _enumKeys = function(it){
  var result     = getKeys$2(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

var cof$1 = _cof;
var _isArray = Array.isArray || function isArray(arg){
  return cof$1(arg) == 'Array';
};

var $keys$2      = _objectKeysInternal;
var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys$2(O, hiddenKeys);
};

var _objectGopn = {
	f: f$5
};

var toIObject$5 = _toIobject;
var gOPN$1      = _objectGopn.f;
var toString$2  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN$1(it);
  } catch(e){
    return windowNames.slice();
  }
};

var f$4 = function getOwnPropertyNames(it){
  return windowNames && toString$2.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(toIObject$5(it));
};

var _objectGopnExt = {
	f: f$4
};

var pIE$1            = _objectPie;
var createDesc$2     = _propertyDesc;
var toIObject$6      = _toIobject;
var toPrimitive$2    = _toPrimitive;
var has$6            = _has;
var IE8_DOM_DEFINE$1 = _ie8DomDefine;
var gOPD$1           = Object.getOwnPropertyDescriptor;

var f$6 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P){
  O = toIObject$6(O);
  P = toPrimitive$2(P, true);
  if(IE8_DOM_DEFINE$1)try {
    return gOPD$1(O, P);
  } catch(e){ /* empty */ }
  if(has$6(O, P))return createDesc$2(!pIE$1.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$6
};

var global$4         = _global;
var has$5            = _has;
var DESCRIPTORS    = _descriptors;
var $export$2        = _export;
var redefine$1       = _redefine;
var META           = _meta.KEY;
var $fails         = _fails;
var shared$1         = _shared;
var setToStringTag$2 = _setToStringTag;
var uid$1            = _uid;
var wks            = _wks;
var wksExt         = _wksExt;
var wksDefine      = _wksDefine;
var keyOf          = _keyof;
var enumKeys       = _enumKeys;
var isArray$1        = _isArray;
var anObject$3       = _anObject;
var toIObject$3      = _toIobject;
var toPrimitive$1    = _toPrimitive;
var createDesc$1     = _propertyDesc;
var _create        = _objectCreate;
var gOPNExt        = _objectGopnExt;
var $GOPD          = _objectGopd;
var $DP            = _objectDp;
var $keys$1          = _objectKeys;
var gOPD           = $GOPD.f;
var dP$3             = $DP.f;
var gOPN           = gOPNExt.f;
var $Symbol        = global$4.Symbol;
var $JSON          = global$4.JSON;
var _stringify     = $JSON && $JSON.stringify;
var PROTOTYPE$2      = 'prototype';
var HIDDEN         = wks('_hidden');
var TO_PRIMITIVE   = wks('toPrimitive');
var isEnum         = {}.propertyIsEnumerable;
var SymbolRegistry = shared$1('symbol-registry');
var AllSymbols     = shared$1('symbols');
var OPSymbols      = shared$1('op-symbols');
var ObjectProto$1    = Object[PROTOTYPE$2];
var USE_NATIVE     = typeof $Symbol == 'function';
var QObject        = global$4.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP$3({}, 'a', {
    get: function(){ return dP$3(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto$1, key);
  if(protoDesc)delete ObjectProto$1[key];
  dP$3(it, key, D);
  if(protoDesc && it !== ObjectProto$1)dP$3(ObjectProto$1, key, protoDesc);
} : dP$3;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE$2]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto$1)$defineProperty(OPSymbols, key, D);
  anObject$3(it);
  key = toPrimitive$1(key, true);
  anObject$3(D);
  if(has$5(AllSymbols, key)){
    if(!D.enumerable){
      if(!has$5(it, HIDDEN))dP$3(it, HIDDEN, createDesc$1(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has$5(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc$1(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP$3(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject$3(it);
  var keys = enumKeys(P = toIObject$3(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive$1(key, true));
  if(this === ObjectProto$1 && has$5(AllSymbols, key) && !has$5(OPSymbols, key))return false;
  return E || !has$5(this, key) || !has$5(AllSymbols, key) || has$5(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject$3(it);
  key = toPrimitive$1(key, true);
  if(it === ObjectProto$1 && has$5(AllSymbols, key) && !has$5(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has$5(AllSymbols, key) && !(has$5(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject$3(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has$5(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto$1
    , names  = gOPN(IS_OP ? OPSymbols : toIObject$3(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has$5(AllSymbols, key = names[i++]) && (IS_OP ? has$5(ObjectProto$1, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid$1(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto$1)$set.call(OPSymbols, value);
      if(has$5(this, HIDDEN) && has$5(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc$1(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto$1, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine$1($Symbol[PROTOTYPE$2], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  _objectGopn.f = gOPNExt.f = $getOwnPropertyNames;
  _objectPie.f  = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !_library){
    redefine$1(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  };
}

$export$2($export$2.G + $export$2.W + $export$2.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i$1 = 0; symbols.length > i$1; )wks(symbols[i$1++]);

for(var symbols = $keys$1(wks.store), i$1 = 0; symbols.length > i$1; )wksDefine(symbols[i$1++]);

$export$2($export$2.S + $export$2.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has$5(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export$2($export$2.S + $export$2.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export$2($export$2.S + $export$2.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray$1(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag$2($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag$2(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag$2(global$4.JSON, 'JSON', true);

_wksDefine('asyncIterator');

_wksDefine('observable');

var index = _core.Symbol;

var symbol = createCommonjsModule(function (module) {
module.exports = { "default": index, __esModule: true };
});

var _typeof_1 = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

var _iterator = iterator;

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = symbol;

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
});

var _typeof = unwrapExports(_typeof_1);

var core$2  = _core;
var $JSON$1 = core$2.JSON || (core$2.JSON = {stringify: JSON.stringify});
var stringify$2 = function stringify$2(it){ // eslint-disable-line no-unused-vars
  return $JSON$1.stringify.apply($JSON$1, arguments);
};

var stringify$1 = createCommonjsModule(function (module) {
module.exports = { "default": stringify$2, __esModule: true };
});

var _JSON$stringify = unwrapExports(stringify$1);

var cof$2 = _cof;
var TAG$1 = _wks('toStringTag');
var ARG = cof$2(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

var _classof = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? cof$2(O)
    // ES3 arguments fallback
    : (B = cof$2(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var _anInstance = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

var anObject$4 = _anObject;
var _iterCall = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject$4(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject$4(ret.call(iterator));
    throw e;
  }
};

var Iterators$3  = _iterators;
var ITERATOR$1   = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function(it){
  return it !== undefined && (Iterators$3.Array === it || ArrayProto[ITERATOR$1] === it);
};

var classof$1   = _classof;
var ITERATOR$2  = _wks('iterator');
var Iterators$4 = _iterators;
var core_getIteratorMethod = _core.getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR$2]
    || it['@@iterator']
    || Iterators$4[classof$1(it)];
};

var _forOf = createCommonjsModule(function (module) {
var ctx         = _ctx
  , call        = _iterCall
  , isArrayIter = _isArrayIter
  , anObject    = _anObject
  , toLength    = _toLength
  , getIterFn   = core_getIteratorMethod
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
});

var anObject$5  = _anObject;
var aFunction$2 = _aFunction;
var SPECIES   = _wks('species');
var _speciesConstructor = function(O, D){
  var C = anObject$5(O).constructor, S;
  return C === undefined || (S = anObject$5(C)[SPECIES]) == undefined ? D : aFunction$2(S);
};

// fast apply, http://jsperf.lnkit.com/fast-apply/5
var _invoke = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

var ctx$2                = _ctx;
var invoke             = _invoke;
var html               = _html;
var cel                = _domCreate;
var global$7             = _global;
var process$1            = global$7.process;
var setTask            = global$7.setImmediate;
var clearTask          = global$7.clearImmediate;
var MessageChannel     = global$7.MessageChannel;
var counter            = 0;
var queue              = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer;
var channel;
var port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(_cof(process$1) == 'process'){
    defer = function(id){
      process$1.nextTick(ctx$2(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx$2(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global$7.addEventListener && typeof postMessage == 'function' && !global$7.importScripts){
    defer = function(id){
      global$7.postMessage(id + '', '*');
    };
    global$7.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx$2(run, id, 1), 0);
    };
  }
}
var _task = {
  set:   setTask,
  clear: clearTask
};

var global$8    = _global;
var macrotask = _task.set;
var Observer  = global$8.MutationObserver || global$8.WebKitMutationObserver;
var process$2   = global$8.process;
var Promise$1   = global$8.Promise;
var isNode$1    = _cof(process$2) == 'process';

var _microtask = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode$1 && (parent = process$2.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode$1){
    notify = function(){
      process$2.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise$1 && Promise$1.resolve){
    var promise = Promise$1.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global$8, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};

var hide$3 = _hide;
var _redefineAll = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide$3(target, key, src[key]);
  } return target;
};

var global$9      = _global;
var core$3        = _core;
var dP$4          = _objectDp;
var DESCRIPTORS$1 = _descriptors;
var SPECIES$1     = _wks('species');

var _setSpecies = function(KEY){
  var C = typeof core$3[KEY] == 'function' ? core$3[KEY] : global$9[KEY];
  if(DESCRIPTORS$1 && C && !C[SPECIES$1])dP$4.f(C, SPECIES$1, {
    configurable: true,
    get: function(){ return this; }
  });
};

var ITERATOR$3     = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

var _iterDetect = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR$3]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR$3] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

var LIBRARY$2            = _library;
var global$6             = _global;
var ctx$1                = _ctx;
var classof            = _classof;
var $export$3            = _export;
var isObject$3           = _isObject;
var aFunction$1          = _aFunction;
var anInstance         = _anInstance;
var forOf              = _forOf;
var speciesConstructor = _speciesConstructor;
var task               = _task.set;
var microtask          = _microtask();
var PROMISE            = 'Promise';
var TypeError$1          = global$6.TypeError;
var process            = global$6.process;
var $Promise           = global$6[PROMISE];
var process            = global$6.process;
var isNode             = classof(process) == 'process';
var empty              = function(){ /* empty */ };
var Internal;
var GenericPromiseCapability;
var Wrapper;

var USE_NATIVE$1 = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[_wks('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject$3(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError$1('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction$1(resolve);
  this.reject  = aFunction$1(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError$1('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global$6, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global$6.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global$6.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global$6, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global$6.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError$1("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx$1($resolve, wrapper, 1), ctx$1($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE$1){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction$1(executor);
    Internal.call(this);
    try {
      executor(ctx$1($resolve, this, 1), ctx$1($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = _redefineAll($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx$1($resolve, promise, 1);
    this.reject  = ctx$1($reject, promise, 1);
  };
}

$export$3($export$3.G + $export$3.W + $export$3.F * !USE_NATIVE$1, {Promise: $Promise});
_setToStringTag($Promise, PROMISE);
_setSpecies(PROMISE);
Wrapper = _core[PROMISE];

// statics
$export$3($export$3.S + $export$3.F * !USE_NATIVE$1, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export$3($export$3.S + $export$3.F * (LIBRARY$2 || !USE_NATIVE$1), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export$3($export$3.S + $export$3.F * !(USE_NATIVE$1 && _iterDetect(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

var promise$1 = _core.Promise;

var promise = createCommonjsModule(function (module) {
module.exports = { "default": promise$1, __esModule: true };
});

var _Promise = unwrapExports(promise);

var $export$4 = _export;
var core$4    = _core;
var fails   = _fails;
var _objectSap = function(KEY, exec){
  var fn  = (core$4.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export$4($export$4.S + $export$4.F * fails(function(){ fn(1); }), 'Object', exp);
};

var toObject$1        = _toObject;
var $getPrototypeOf = _objectGpo;

_objectSap('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject$1(it));
  };
});

var getPrototypeOf$3 = _core.Object.getPrototypeOf;

var getPrototypeOf$2 = createCommonjsModule(function (module) {
module.exports = { "default": getPrototypeOf$3, __esModule: true };
});

var _Object$getPrototypeOf = unwrapExports(getPrototypeOf$2);

var classCallCheck = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
});

var _classCallCheck = unwrapExports(classCallCheck);

var possibleConstructorReturn = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

var _typeof2 = _typeof_1;

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
});

var _possibleConstructorReturn = unwrapExports(possibleConstructorReturn);

var $export$5 = _export;
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export$5($export$5.S + $export$5.F * !_descriptors, 'Object', {defineProperty: _objectDp.f});

var $Object = _core.Object;
var defineProperty$4 = function defineProperty$4(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

var defineProperty$2 = createCommonjsModule(function (module) {
module.exports = { "default": defineProperty$4, __esModule: true };
});

var createClass = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

var _defineProperty = defineProperty$2;

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
});

var _createClass = unwrapExports(createClass);

var isObject$4 = _isObject;
var anObject$6 = _anObject;
var check = function(O, proto){
  anObject$6(O);
  if(!isObject$4(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
var _setProto = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

var $export$6 = _export;
$export$6($export$6.S, 'Object', {setPrototypeOf: _setProto.set});

var setPrototypeOf$3 = _core.Object.setPrototypeOf;

var setPrototypeOf$1 = createCommonjsModule(function (module) {
module.exports = { "default": setPrototypeOf$3, __esModule: true };
});

var $export$7 = _export;
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export$7($export$7.S, 'Object', {create: _objectCreate});

var $Object$1 = _core.Object;
var create$4 = function create$4(P, D){
  return $Object$1.create(P, D);
};

var create$2 = createCommonjsModule(function (module) {
module.exports = { "default": create$4, __esModule: true };
});

var inherits = createCommonjsModule(function (module, exports) {
"use strict";

exports.__esModule = true;

var _setPrototypeOf = setPrototypeOf$1;

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = create$2;

var _create2 = _interopRequireDefault(_create);

var _typeof2 = _typeof_1;

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
});

var _inherits = unwrapExports(inherits);

var fableGlobal = function () {
    var globalObj = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : null;
    if (typeof globalObj.__FABLE_CORE__ === "undefined") {
        globalObj.__FABLE_CORE__ = {
            types: new Map(),
            symbols: {
                reflection: Symbol("reflection"),
                generics: Symbol("generics")
            }
        };
    }
    return globalObj.__FABLE_CORE__;
}();
var FSymbol = fableGlobal.symbols;

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NonDeclaredType = function () {
    function NonDeclaredType(kind, name, generics) {
        _classCallCheck$1(this, NonDeclaredType);

        this.kind = kind;
        this.name = name;
        this.generics = generics || [];
    }

    _createClass$1(NonDeclaredType, [{
        key: "Equals",
        value: function Equals(other) {
            return this.kind === other.kind && this.name === other.name && equals(this.generics, other.generics);
        }
    }]);

    return NonDeclaredType;
}();

var GenericNonDeclaredType = function (_NonDeclaredType) {
    _inherits$1(GenericNonDeclaredType, _NonDeclaredType);

    function GenericNonDeclaredType(kind, generics) {
        _classCallCheck$1(this, GenericNonDeclaredType);

        return _possibleConstructorReturn$1(this, (GenericNonDeclaredType.__proto__ || Object.getPrototypeOf(GenericNonDeclaredType)).call(this, kind, null, generics));
    }

    _createClass$1(GenericNonDeclaredType, [{
        key: FSymbol.generics,
        value: function value() {
            return this.generics;
        }
    }]);

    return GenericNonDeclaredType;
}(NonDeclaredType);

var Any = new NonDeclaredType("Any");
var Unit = new NonDeclaredType("Unit");




function declare(cons) {
    var info = cons.prototype[FSymbol.reflection];
    if (typeof info === "function") {
        var type = info().type;
        if (typeof type === "string") fableGlobal.types.set(type, cons);
    }
}

/**
 * Checks if this a function constructor extending another with generic info.
 */
function isGeneric(typ) {
    return typeof typ === "function" && !!typ.prototype[FSymbol.generics];
}
/**
 * Returns the parent if this is a declared generic type or the argument otherwise.
 * Attention: Unlike .NET this doesn't throw an exception if type is not generic.
*/
function getDefinition(typ) {
    return typeof typ === "function" && typ.prototype[FSymbol.generics] ? Object.getPrototypeOf(typ.prototype).constructor : typ;
}
function extendInfo(cons, info) {
    var parent = Object.getPrototypeOf(cons.prototype);
    if (typeof parent[FSymbol.reflection] === "function") {
        var _ret = function () {
            var newInfo = {},
                parentInfo = parent[FSymbol.reflection]();
            Object.getOwnPropertyNames(info).forEach(function (k) {
                var i = info[k];
                if ((typeof i === "undefined" ? "undefined" : _typeof$1(i)) === "object") {
                    newInfo[k] = Array.isArray(i) ? (parentInfo[k] || []).concat(i) : Object.assign(parentInfo[k] || {}, i);
                } else {
                    newInfo[k] = i;
                }
            });
            return {
                v: newInfo
            };
        }();

        if ((typeof _ret === "undefined" ? "undefined" : _typeof$1(_ret)) === "object") return _ret.v;
    }
    return info;
}
function hasInterface(obj, interfaceName) {
    if (typeof obj[FSymbol.reflection] === "function") {
        var interfaces = obj[FSymbol.reflection]().interfaces;
        return Array.isArray(interfaces) && interfaces.indexOf(interfaceName) > -1;
    }
    return false;
}

function getRestParams(args, idx) {
    for (var _len = args.length, restArgs = Array(_len > idx ? _len - idx : 0), _key = idx; _key < _len; _key++) {
        restArgs[_key - idx] = args[_key];
    }return restArgs;
}
function toString$3(o) {
    return o != null && typeof o.ToString == "function" ? o.ToString() : String(o);
}

function equals(x, y) {
    // Optimization if they are referencially equal
    if (x === y) return true;else if (x == null) return y == null;else if (y == null) return false;else if (isGeneric(x) && isGeneric(y)) return getDefinition(x) === getDefinition(y) && equalsRecords(x.prototype[FSymbol.generics](), y.prototype[FSymbol.generics]());else if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y)) return false;else if (typeof x.Equals === "function") return x.Equals(y);else if (Array.isArray(x)) {
        if (x.length != y.length) return false;
        for (var i = 0; i < x.length; i++) {
            if (!equals(x[i], y[i])) return false;
        }return true;
    } else if (ArrayBuffer.isView(x)) {
        if (x.byteLength !== y.byteLength) return false;
        var dv1 = new DataView(x.buffer),
            dv2 = new DataView(y.buffer);
        for (var _i = 0; _i < x.byteLength; _i++) {
            if (dv1.getUint8(_i) !== dv2.getUint8(_i)) return false;
        }return true;
    } else if (x instanceof Date) return x.getTime() == y.getTime();else return false;
}
function compare(x, y) {
    // Optimization if they are referencially equal
    if (x === y) return 0;
    if (x == null) return y == null ? 0 : -1;else if (y == null) return -1;else if (Object.getPrototypeOf(x) !== Object.getPrototypeOf(y)) return -1;else if (hasInterface(x, "System.IComparable")) return x.CompareTo(y);else if (Array.isArray(x)) {
        if (x.length != y.length) return x.length < y.length ? -1 : 1;
        for (var i = 0, j = 0; i < x.length; i++) {
            if ((j = compare(x[i], y[i])) !== 0) return j;
        }return 0;
    } else if (ArrayBuffer.isView(x)) {
        if (x.byteLength != y.byteLength) return x.byteLength < y.byteLength ? -1 : 1;
        var dv1 = new DataView(x.buffer),
            dv2 = new DataView(y.buffer);
        for (var _i2 = 0, b1 = 0, b2 = 0; _i2 < x.byteLength; _i2++) {
            b1 = dv1.getUint8(_i2), b2 = dv2.getUint8(_i2);
            if (b1 < b2) return -1;
            if (b1 > b2) return 1;
        }
        return 0;
    } else if (x instanceof Date) return compare(x.getTime(), y.getTime());else return x < y ? -1 : 1;
}
function equalsRecords(x, y) {
    // Optimization if they are referencially equal
    if (x === y) {
        return true;
    } else {
        var keys = Object.getOwnPropertyNames(x);
        for (var i = 0; i < keys.length; i++) {
            if (!equals(x[keys[i]], y[keys[i]])) return false;
        }
        return true;
    }
}
function compareRecords(x, y) {
    // Optimization if they are referencially equal
    if (x === y) {
        return 0;
    } else {
        var keys = Object.getOwnPropertyNames(x);
        for (var i = 0; i < keys.length; i++) {
            var res = compare(x[keys[i]], y[keys[i]]);
            if (res !== 0) return res;
        }
        return 0;
    }
}
function equalsUnions(x, y) {
    // Optimization if they are referencially equal
    if (x === y) {
        return true;
    } else if (x.Case !== y.Case) {
        return false;
    } else {
        for (var i = 0; i < x.Fields.length; i++) {
            if (!equals(x.Fields[i], y.Fields[i])) return false;
        }
        return true;
    }
}
function compareUnions(x, y) {
    // Optimization if they are referencially equal
    if (x === y) {
        return 0;
    } else {
        var res = compare(x.Case, y.Case);
        if (res !== 0) return res;
        for (var i = 0; i < x.Fields.length; i++) {
            res = compare(x.Fields[i], y.Fields[i]);
            if (res !== 0) return res;
        }
        return 0;
    }
}

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ofArray(args, base) {
    var acc = base || new List$1();
    for (var i = args.length - 1; i >= 0; i--) {
        acc = new List$1(args[i], acc);
    }
    return acc;
}

var List$1 = function () {
    function List(head, tail) {
        _classCallCheck$2(this, List);

        this.head = head;
        this.tail = tail;
    }

    _createClass$2(List, [{
        key: "ToString",
        value: function ToString() {
            return "[" + Array.from(this).map(toString$3).join("; ") + "]";
        }
    }, {
        key: "Equals",
        value: function Equals(x) {
            // Optimization if they are referencially equal
            if (this === x) {
                return true;
            } else {
                var iter1 = this[Symbol.iterator](),
                    iter2 = x[Symbol.iterator]();
                for (;;) {
                    var cur1 = iter1.next(),
                        cur2 = iter2.next();
                    if (cur1.done) return cur2.done ? true : false;else if (cur2.done) return false;else if (!equals(cur1.value, cur2.value)) return false;
                }
            }
        }
    }, {
        key: "CompareTo",
        value: function CompareTo(x) {
            // Optimization if they are referencially equal
            if (this === x) {
                return 0;
            } else {
                var acc = 0;
                var iter1 = this[Symbol.iterator](),
                    iter2 = x[Symbol.iterator]();
                for (;;) {
                    var cur1 = iter1.next(),
                        cur2 = iter2.next();
                    if (cur1.done) return cur2.done ? acc : -1;else if (cur2.done) return 1;else {
                        acc = compare(cur1.value, cur2.value);
                        if (acc != 0) return acc;
                    }
                }
            }
        }
    }, {
        key: Symbol.iterator,
        value: function value() {
            var cur = this;
            return {
                next: function next() {
                    var tmp = cur;
                    cur = cur.tail;
                    return { done: tmp.tail == null, value: tmp.head };
                }
            };
        }
        //   append(ys: List<T>): List<T> {
        //     return append(this, ys);
        //   }
        //   choose<U>(f: (x: T) => U, xs: List<T>): List<U> {
        //     return choose(f, this);
        //   }
        //   collect<U>(f: (x: T) => List<U>): List<U> {
        //     return collect(f, this);
        //   }
        //   filter(f: (x: T) => boolean): List<T> {
        //     return filter(f, this);
        //   }
        //   where(f: (x: T) => boolean): List<T> {
        //     return filter(f, this);
        //   }
        //   map<U>(f: (x: T) => U): List<U> {
        //     return map(f, this);
        //   }
        //   mapIndexed<U>(f: (i: number, x: T) => U): List<U> {
        //     return mapIndexed(f, this);
        //   }
        //   partition(f: (x: T) => boolean): [List<T>, List<T>] {
        //     return partition(f, this) as [List<T>, List<T>];
        //   }
        //   reverse(): List<T> {
        //     return reverse(this);
        //   }
        //   slice(lower: number, upper: number): List<T> {
        //     return slice(lower, upper, this);
        //   }

    }, {
        key: FSymbol.reflection,
        value: function value() {
            return {
                type: "Microsoft.FSharp.Collections.FSharpList",
                interfaces: ["System.IEquatable", "System.IComparable"]
            };
        }
    }, {
        key: "length",
        get: function get() {
            var cur = this,
                acc = 0;
            while (cur.tail != null) {
                cur = cur.tail;
                acc++;
            }
            return acc;
        }
    }]);

    return List;
}();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function toList(xs) {
    return foldBack(function (x, acc) {
        return new List$1(x, acc);
    }, xs, new List$1());
}








function compareWith(f, xs, ys) {
    var nonZero = tryFind(function (i) {
        return i != 0;
    }, map2(function (x, y) {
        return f(x, y);
    }, xs, ys));
    return nonZero != null ? nonZero : count(xs) - count(ys);
}
function delay(f) {
    return _defineProperty$1({}, Symbol.iterator, function () {
        return f()[Symbol.iterator]();
    });
}










function fold(f, acc, xs) {
    if (Array.isArray(xs) || ArrayBuffer.isView(xs)) {
        return xs.reduce(f, acc);
    } else {
        var cur = void 0;
        for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
            cur = iter.next();
            if (cur.done) break;
            acc = f(acc, cur.value, i);
        }
        return acc;
    }
}
function foldBack(f, xs, acc) {
    var arr = Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs : Array.from(xs);
    for (var i = arr.length - 1; i >= 0; i--) {
        acc = f(arr[i], acc, i);
    }
    return acc;
}




function tryHead(xs) {
    var iter = xs[Symbol.iterator]();
    var cur = iter.next();
    return cur.done ? null : cur.value;
}





function iterate(f, xs) {
    fold(function (_, x) {
        return f(x);
    }, null, xs);
}






// A export function 'length' method causes problems in JavaScript -- https://github.com/Microsoft/TypeScript/issues/442
function count(xs) {
    return Array.isArray(xs) || ArrayBuffer.isView(xs) ? xs.length : fold(function (acc, x) {
        return acc + 1;
    }, 0, xs);
}
function map$1(f, xs) {
    return delay(function () {
        return unfold(function (iter) {
            var cur = iter.next();
            return !cur.done ? [f(cur.value), iter] : null;
        }, xs[Symbol.iterator]());
    });
}

function map2(f, xs, ys) {
    return delay(function () {
        var iter1 = xs[Symbol.iterator]();
        var iter2 = ys[Symbol.iterator]();
        return unfold(function () {
            var cur1 = iter1.next(),
                cur2 = iter2.next();
            return !cur1.done && !cur2.done ? [f(cur1.value, cur2.value), null] : null;
        });
    });
}










function rangeStep(first, step, last) {
    if (step === 0) throw new Error("Step cannot be 0");
    return delay(function () {
        return unfold(function (x) {
            return step > 0 && x <= last || step < 0 && x >= last ? [x, x + step] : null;
        }, first);
    });
}

function range(first, last) {
    return rangeStep(first, 1, last);
}











function sum(xs) {
    return fold(function (acc, x) {
        return acc + x;
    }, 0, xs);
}





function tryFind(f, xs, defaultValue) {
    for (var i = 0, iter = xs[Symbol.iterator]();; i++) {
        var cur = iter.next();
        if (cur.done) return defaultValue === void 0 ? null : defaultValue;
        if (f(cur.value, i)) return cur.value;
    }
}









function unfold(f, acc) {
    return _defineProperty$1({}, Symbol.iterator, function () {
        return {
            next: function next() {
                var res = f(acc);
                if (res != null) {
                    acc = res[1];
                    return { done: false, value: res[0] };
                }
                return { done: true };
            }
        };
    });
}

var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenericComparer = function () {
    function GenericComparer(f) {
        _classCallCheck$4(this, GenericComparer);

        this.Compare = f || compare;
    }

    _createClass$4(GenericComparer, [{
        key: FSymbol.reflection,
        value: function value() {
            return { interfaces: ["System.IComparer"] };
        }
    }]);

    return GenericComparer;
}();

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var MapTree = function MapTree(caseName, fields) {
    _classCallCheck$3(this, MapTree);

    this.Case = caseName;
    this.Fields = fields;
};
function tree_sizeAux(acc, m) {
    return m.Case === "MapOne" ? acc + 1 : m.Case === "MapNode" ? tree_sizeAux(tree_sizeAux(acc + 1, m.Fields[2]), m.Fields[3]) : acc;
}
function tree_size(x) {
    return tree_sizeAux(0, x);
}
function tree_empty() {
    return new MapTree("MapEmpty", []);
}
function tree_height(_arg1) {
    return _arg1.Case === "MapOne" ? 1 : _arg1.Case === "MapNode" ? _arg1.Fields[4] : 0;
}
function tree_mk(l, k, v, r) {
    var matchValue = [l, r];
    var $target1 = function $target1() {
        var hl = tree_height(l);
        var hr = tree_height(r);
        var m = hl < hr ? hr : hl;
        return new MapTree("MapNode", [k, v, l, r, m + 1]);
    };
    if (matchValue[0].Case === "MapEmpty") {
        if (matchValue[1].Case === "MapEmpty") {
            return new MapTree("MapOne", [k, v]);
        } else {
            return $target1();
        }
    } else {
        return $target1();
    }
}

function tree_rebalance(t1, k, v, t2) {
    var t1h = tree_height(t1);
    var t2h = tree_height(t2);
    if (t2h > t1h + 2) {
        if (t2.Case === "MapNode") {
            if (tree_height(t2.Fields[2]) > t1h + 1) {
                if (t2.Fields[2].Case === "MapNode") {
                    return tree_mk(tree_mk(t1, k, v, t2.Fields[2].Fields[2]), t2.Fields[2].Fields[0], t2.Fields[2].Fields[1], tree_mk(t2.Fields[2].Fields[3], t2.Fields[0], t2.Fields[1], t2.Fields[3]));
                } else {
                    throw new Error("rebalance");
                }
            } else {
                return tree_mk(tree_mk(t1, k, v, t2.Fields[2]), t2.Fields[0], t2.Fields[1], t2.Fields[3]);
            }
        } else {
            throw new Error("rebalance");
        }
    } else {
        if (t1h > t2h + 2) {
            if (t1.Case === "MapNode") {
                if (tree_height(t1.Fields[3]) > t2h + 1) {
                    if (t1.Fields[3].Case === "MapNode") {
                        return tree_mk(tree_mk(t1.Fields[2], t1.Fields[0], t1.Fields[1], t1.Fields[3].Fields[2]), t1.Fields[3].Fields[0], t1.Fields[3].Fields[1], tree_mk(t1.Fields[3].Fields[3], k, v, t2));
                    } else {
                        throw new Error("rebalance");
                    }
                } else {
                    return tree_mk(t1.Fields[2], t1.Fields[0], t1.Fields[1], tree_mk(t1.Fields[3], k, v, t2));
                }
            } else {
                throw new Error("rebalance");
            }
        } else {
            return tree_mk(t1, k, v, t2);
        }
    }
}
function tree_add(comparer, k, v, m) {
    if (m.Case === "MapOne") {
        var c = comparer.Compare(k, m.Fields[0]);
        if (c < 0) {
            return new MapTree("MapNode", [k, v, new MapTree("MapEmpty", []), m, 2]);
        } else if (c === 0) {
            return new MapTree("MapOne", [k, v]);
        }
        return new MapTree("MapNode", [k, v, m, new MapTree("MapEmpty", []), 2]);
    } else if (m.Case === "MapNode") {
        var c = comparer.Compare(k, m.Fields[0]);
        if (c < 0) {
            return tree_rebalance(tree_add(comparer, k, v, m.Fields[2]), m.Fields[0], m.Fields[1], m.Fields[3]);
        } else if (c === 0) {
            return new MapTree("MapNode", [k, v, m.Fields[2], m.Fields[3], m.Fields[4]]);
        }
        return tree_rebalance(m.Fields[2], m.Fields[0], m.Fields[1], tree_add(comparer, k, v, m.Fields[3]));
    }
    return new MapTree("MapOne", [k, v]);
}
function tree_find(comparer, k, m) {
    var res = tree_tryFind(comparer, k, m);
    if (res != null) return res;
    throw new Error("key not found");
}
function tree_tryFind(comparer, k, m) {
    if (m.Case === "MapOne") {
        var c = comparer.Compare(k, m.Fields[0]);
        return c === 0 ? m.Fields[1] : null;
    } else if (m.Case === "MapNode") {
        var c = comparer.Compare(k, m.Fields[0]);
        if (c < 0) {
            return tree_tryFind(comparer, k, m.Fields[2]);
        } else {
            if (c === 0) {
                return m.Fields[1];
            } else {
                return tree_tryFind(comparer, k, m.Fields[3]);
            }
        }
    }
    return null;
}
function tree_mem(comparer, k, m) {
    return m.Case === "MapOne" ? comparer.Compare(k, m.Fields[0]) === 0 : m.Case === "MapNode" ? function () {
        var c = comparer.Compare(k, m.Fields[0]);
        if (c < 0) {
            return tree_mem(comparer, k, m.Fields[2]);
        } else {
            if (c === 0) {
                return true;
            } else {
                return tree_mem(comparer, k, m.Fields[3]);
            }
        }
    }() : false;
}
function tree_mkFromEnumerator(comparer, acc, e) {
    var cur = e.next();
    while (!cur.done) {
        acc = tree_add(comparer, cur.value[0], cur.value[1], acc);
        cur = e.next();
    }
    return acc;
}
// function tree_ofArray(comparer: IComparer<any>, arr: ArrayLike<[any,any]>) {
//   var res = tree_empty();
//   for (var i = 0; i <= arr.length - 1; i++) {
//     res = tree_add(comparer, arr[i][0], arr[i][1], res);
//   }
//   return res;
// }
function tree_ofSeq(comparer, c) {
    var ie = c[Symbol.iterator]();
    return tree_mkFromEnumerator(comparer, tree_empty(), ie);
}
// function tree_copyToArray(s: MapTree, arr: ArrayLike<any>, i: number) {
//   tree_iter((x, y) => { arr[i++] = [x, y]; }, s);
// }
function tree_collapseLHS(stack) {
    if (stack.tail != null) {
        if (stack.head.Case === "MapOne") {
            return stack;
        } else if (stack.head.Case === "MapNode") {
            return tree_collapseLHS(ofArray([stack.head.Fields[2], new MapTree("MapOne", [stack.head.Fields[0], stack.head.Fields[1]]), stack.head.Fields[3]], stack.tail));
        } else {
            return tree_collapseLHS(stack.tail);
        }
    } else {
        return new List$1();
    }
}
function tree_mkIterator(s) {
    return { stack: tree_collapseLHS(new List$1(s, new List$1())), started: false };
}
function tree_moveNext(i) {
    function current(i) {
        if (i.stack.tail == null) {
            return null;
        } else if (i.stack.head.Case === "MapOne") {
            return [i.stack.head.Fields[0], i.stack.head.Fields[1]];
        }
        throw new Error("Please report error: Map iterator, unexpected stack for current");
    }
    if (i.started) {
        if (i.stack.tail == null) {
            return { done: true, value: null };
        } else {
            if (i.stack.head.Case === "MapOne") {
                i.stack = tree_collapseLHS(i.stack.tail);
                return {
                    done: i.stack.tail == null,
                    value: current(i)
                };
            } else {
                throw new Error("Please report error: Map iterator, unexpected stack for moveNext");
            }
        }
    } else {
        i.started = true;
        return {
            done: i.stack.tail == null,
            value: current(i)
        };
    }
    
}

var FMap = function () {
    /** Do not call, use Map.create instead. */
    function FMap() {
        _classCallCheck$3(this, FMap);
    }

    _createClass$3(FMap, [{
        key: "ToString",
        value: function ToString() {
            return "map [" + Array.from(this).map(toString$3).join("; ") + "]";
        }
    }, {
        key: "Equals",
        value: function Equals(m2) {
            return this.CompareTo(m2) === 0;
        }
    }, {
        key: "CompareTo",
        value: function CompareTo(m2) {
            var _this = this;

            return this === m2 ? 0 : compareWith(function (kvp1, kvp2) {
                var c = _this.comparer.Compare(kvp1[0], kvp2[0]);
                return c !== 0 ? c : compare(kvp1[1], kvp2[1]);
            }, this, m2);
        }
    }, {
        key: Symbol.iterator,
        value: function value() {
            var i = tree_mkIterator(this.tree);
            return {
                next: function next() {
                    return tree_moveNext(i);
                }
            };
        }
    }, {
        key: "entries",
        value: function entries() {
            return this[Symbol.iterator]();
        }
    }, {
        key: "keys",
        value: function keys() {
            return map$1(function (kv) {
                return kv[0];
            }, this);
        }
    }, {
        key: "values",
        value: function values() {
            return map$1(function (kv) {
                return kv[1];
            }, this);
        }
    }, {
        key: "get",
        value: function get(k) {
            return tree_find(this.comparer, k, this.tree);
        }
    }, {
        key: "has",
        value: function has(k) {
            return tree_mem(this.comparer, k, this.tree);
        }
        /** Not supported */

    }, {
        key: "set",
        value: function set(k, v) {
            throw new Error("not supported");
        }
        /** Not supported */

    }, {
        key: "delete",
        value: function _delete(k) {
            throw new Error("not supported");
        }
        /** Not supported */

    }, {
        key: "clear",
        value: function clear() {
            throw new Error("not supported");
        }
    }, {
        key: FSymbol.reflection,
        value: function value() {
            return {
                type: "Microsoft.FSharp.Collections.FSharpMap",
                interfaces: ["System.IEquatable", "System.IComparable"]
            };
        }
    }, {
        key: "size",
        get: function get() {
            return tree_size(this.tree);
        }
    }]);

    return FMap;
}();

function from(comparer, tree) {
    var map$$1 = new FMap();
    map$$1.tree = tree;
    map$$1.comparer = comparer || new GenericComparer();
    return map$$1;
}
function create$6(ie, comparer) {
    comparer = comparer || new GenericComparer();
    return from(comparer, ie ? tree_ofSeq(comparer, ie) : tree_empty());
}
function add(k, v, map$$1) {
    return from(map$$1.comparer, tree_add(map$$1.comparer, k, v, map$$1.tree));
}





function tryFind$1(k, map$$1) {
    return tree_tryFind(map$$1.comparer, k, map$$1.tree);
}

function append$$1(xs, ys) {
    return fold(function (acc, x) {
        return new List$1(x, acc);
    }, ys, reverse$$1(xs));
}


// TODO: should be xs: Iterable<List<T>>








function reverse$$1(xs) {
    return fold(function (acc, x) {
        return new List$1(x, acc);
    }, new List$1(), xs);
}


/* ToDo: instance unzip() */

/* ToDo: instance unzip3() */

var _createClass$5 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Promise$1 = function (__exports) {
    var PromiseBuilder = __exports.PromiseBuilder = function () {
        _createClass$5(PromiseBuilder, [{
            key: FSymbol.reflection,
            value: function value() {
                return extendInfo(PromiseBuilder, {
                    type: "Fable.PowerPack.Promise.PromiseBuilder",
                    interfaces: [],
                    properties: {}
                });
            }
        }]);

        function PromiseBuilder() {
            _classCallCheck$5(this, PromiseBuilder);
        }

        _createClass$5(PromiseBuilder, [{
            key: "For",
            value: function For(seq, body) {
                var p = Promise.resolve();
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    var _loop = function _loop() {
                        var a = _step.value;
                        p = p.then(function () {
                            return body(a);
                        });
                    };

                    for (var _iterator = seq[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        _loop();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return p;
            }
        }, {
            key: "While",
            value: function While(guard, p) {
                var _this = this;

                return guard() ? p.then(function () {
                    return _this.While(guard, p);
                }) : Promise.resolve();
            }
        }, {
            key: "TryFinally",
            value: function TryFinally(p, compensation) {
                return p.then(function (x) {
                    compensation();
                    return x;
                }, function (er) {
                    compensation();
                    throw er;
                });
            }
        }, {
            key: "Delay",
            value: function Delay(generator) {
                return {
                    then: function then(f1, f2) {
                        try {
                            return generator().then(f1, f2);
                        } catch (er) {
                            if (f2 == null) {
                                return Promise.reject(er);
                            } else {
                                try {
                                    return Promise.resolve(f2(er));
                                } catch (er_1) {
                                    return Promise.reject(er_1);
                                }
                            }
                        }
                    },
                    catch: function _catch(f) {
                        try {
                            return generator().catch(f);
                        } catch (er) {
                            try {
                                return Promise.resolve(f(er));
                            } catch (er_1) {
                                return Promise.reject(er_1);
                            }
                        }
                    }
                };
            }
        }, {
            key: "Using",
            value: function Using(resource, binder) {
                return this.TryFinally(binder(resource), function () {
                    resource.Dispose();
                });
            }
        }]);

        return PromiseBuilder;
    }();

    declare(PromiseBuilder);
    return __exports;
}({});

var PromiseImpl = function (__exports) {
    var promise = __exports.promise = new _Promise$1.PromiseBuilder();
    return __exports;
}({});

function create$7(pattern, options) {
    var flags = "g";
    flags += options & 1 ? "i" : "";
    flags += options & 2 ? "m" : "";
    return new RegExp(pattern, flags);
}
// From http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escape(str) {
    return str.replace(/[\-\[\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}



function matches(str, pattern) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var reg = str instanceof RegExp ? (reg = str, str = pattern, reg.lastIndex = options, reg) : reg = create$7(pattern, options);
    if (!reg.global) throw new Error("Non-global RegExp"); // Prevent infinite loop
    var m = void 0;
    var matches = [];
    while ((m = reg.exec(str)) !== null) {
        matches.push(m);
    }return matches;
}

function fromTicks(ticks) {
    return ticks / 10000;
}

function __getValue(d, key) {
    return d[(d.kind == 1 /* UTC */ ? "getUTC" : "get") + key]();
}


function parse(v, kind) {
    var date = v == null ? new Date() : new Date(v);
    if (isNaN(date.getTime())) throw new Error("The string is not a valid Date.");
    date.kind = kind || (typeof v == "string" && v.slice(-1) == "Z" ? 1 /* UTC */ : 2 /* Local */);
    return date;
}

function create$8(year, month, day) /* Local */{
    var h = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var m = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var s = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var ms = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    var kind = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 2;

    var date = kind === 1 /* UTC */ ? new Date(Date.UTC(year, month - 1, day, h, m, s, ms)) : new Date(year, month - 1, day, h, m, s, ms);
    if (isNaN(date.getTime())) throw new Error("The parameters describe an unrepresentable Date.");
    date.kind = kind;
    return date;
}
function now() {
    return parse();
}

function today() {
    return date(now());
}
function isLeapYear(year) {
    return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
}
function daysInMonth(year, month) {
    return month == 2 ? isLeapYear(year) ? 29 : 28 : month >= 8 ? month % 2 == 0 ? 31 : 30 : month % 2 == 0 ? 30 : 31;
}



function date(d) {
    return create$8(year(d), month(d), day(d), 0, 0, 0, 0, d.kind);
}
function day(d) {
    return __getValue(d, "Date");
}
function hour(d) {
    return __getValue(d, "Hours");
}
function millisecond(d) {
    return __getValue(d, "Milliseconds");
}
function minute(d) {
    return __getValue(d, "Minutes");
}
function month(d) {
    return __getValue(d, "Month") + 1;
}
function second(d) {
    return __getValue(d, "Seconds");
}
function year(d) {
    return __getValue(d, "FullYear");
}








function addSeconds(d, v) {
    return parse(d.getTime() + v * 1000, d.kind);
}





function toLongDateString(d) {
    return d.toDateString();
}
function toShortDateString(d) {
    return d.toLocaleDateString();
}

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var fsFormatRegExp = /(^|[^%])%([0+ ]*)(-?\d+)?(?:\.(\d+))?(\w)/;
var formatRegExp = /\{(\d+)(,-?\d+)?(?:\:(.+?))?\}/g;
function fsFormat(str) {
    var _cont = void 0;
    function isObject(x) {
        return x !== null && (typeof x === "undefined" ? "undefined" : _typeof$2(x)) === "object" && !(x instanceof Number) && !(x instanceof String) && !(x instanceof Boolean);
    }
    function formatOnce(str, rep) {
        return str.replace(fsFormatRegExp, function (_, prefix, flags, pad, precision, format) {
            switch (format) {
                case "f":
                case "F":
                    rep = rep.toFixed(precision || 6);
                    break;
                case "g":
                case "G":
                    rep = rep.toPrecision(precision);
                    break;
                case "e":
                case "E":
                    rep = rep.toExponential(precision);
                    break;
                case "O":
                    rep = toString$3(rep);
                    break;
                case "A":
                    try {
                        rep = JSON.stringify(rep, function (k, v) {
                            return v && v[Symbol.iterator] && !Array.isArray(v) && isObject(v) ? Array.from(v) : v;
                        });
                    } catch (err) {
                        // Fallback for objects with circular references
                        rep = "{" + Object.getOwnPropertyNames(rep).map(function (k) {
                            return k + ": " + String(rep[k]);
                        }).join(", ") + "}";
                    }
                    break;
            }
            var plusPrefix = flags.indexOf("+") >= 0 && parseInt(rep) >= 0;
            if (!isNaN(pad = parseInt(pad))) {
                var ch = pad >= 0 && flags.indexOf("0") >= 0 ? "0" : " ";
                rep = padLeft(rep, Math.abs(pad) - (plusPrefix ? 1 : 0), ch, pad < 0);
            }
            var once = prefix + (plusPrefix ? "+" + rep : rep);
            return once.replace(/%/g, "%%");
        });
    }
    function makeFn(str) {
        return function (rep) {
            var str2 = formatOnce(str, rep);
            return fsFormatRegExp.test(str2) ? makeFn(str2) : _cont(str2.replace(/%%/g, "%"));
        };
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    if (args.length === 0) {
        return function (cont) {
            _cont = cont;
            return fsFormatRegExp.test(str) ? makeFn(str) : _cont(str);
        };
    } else {
        for (var i = 0; i < args.length; i++) {
            str = formatOnce(str, args[i]);
        }
        return str.replace(/%%/g, "%");
    }
}








function padLeft(str, len, ch, isRight) {
    ch = ch || " ";
    str = String(str);
    len = len - str.length;
    for (var i = -1; ++i < len;) {
        str = isRight ? str + ch : ch + str;
    }return str;
}

var _createClass$6 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Trampoline = function () {
    function Trampoline() {
        _classCallCheck$7(this, Trampoline);

        this.callCount = 0;
    }

    _createClass$6(Trampoline, [{
        key: "incrementAndCheck",
        value: function incrementAndCheck() {
            return this.callCount++ > Trampoline.maxTrampolineCallCount;
        }
    }, {
        key: "hijack",
        value: function hijack(f) {
            this.callCount = 0;
            setTimeout(f, 0);
        }
    }], [{
        key: "maxTrampolineCallCount",
        get: function get() {
            return 2000;
        }
    }]);

    return Trampoline;
}();
function protectedCont(f) {
    return function (ctx) {
        if (ctx.cancelToken.isCancelled) ctx.onCancel("cancelled");else if (ctx.trampoline.incrementAndCheck()) ctx.trampoline.hijack(function () {
            try {
                f(ctx);
            } catch (err) {
                ctx.onError(err);
            }
        });else try {
            f(ctx);
        } catch (err) {
            ctx.onError(err);
        }
    };
}
function protectedBind(computation, binder) {
    return protectedCont(function (ctx) {
        computation({
            onSuccess: function onSuccess(x) {
                return binder(x)(ctx);
            },
            onError: ctx.onError,
            onCancel: ctx.onCancel,
            cancelToken: ctx.cancelToken,
            trampoline: ctx.trampoline
        });
    });
}
function protectedReturn(value) {
    return protectedCont(function (ctx) {
        return ctx.onSuccess(value);
    });
}
var AsyncBuilder = function () {
    function AsyncBuilder() {
        _classCallCheck$7(this, AsyncBuilder);
    }

    _createClass$6(AsyncBuilder, [{
        key: "Bind",
        value: function Bind(computation, binder) {
            return protectedBind(computation, binder);
        }
    }, {
        key: "Combine",
        value: function Combine(computation1, computation2) {
            return this.Bind(computation1, function () {
                return computation2;
            });
        }
    }, {
        key: "Delay",
        value: function Delay(generator) {
            return protectedCont(function (ctx) {
                return generator()(ctx);
            });
        }
    }, {
        key: "For",
        value: function For(sequence, body) {
            var iter = sequence[Symbol.iterator]();
            var cur = iter.next();
            return this.While(function () {
                return !cur.done;
            }, this.Delay(function () {
                var res = body(cur.value);
                cur = iter.next();
                return res;
            }));
        }
    }, {
        key: "Return",
        value: function Return(value) {
            return protectedReturn(value);
        }
    }, {
        key: "ReturnFrom",
        value: function ReturnFrom(computation) {
            return computation;
        }
    }, {
        key: "TryFinally",
        value: function TryFinally(computation, compensation) {
            return protectedCont(function (ctx) {
                computation({
                    onSuccess: function onSuccess(x) {
                        compensation();
                        ctx.onSuccess(x);
                    },
                    onError: function onError(x) {
                        compensation();
                        ctx.onError(x);
                    },
                    onCancel: function onCancel(x) {
                        compensation();
                        ctx.onCancel(x);
                    },
                    cancelToken: ctx.cancelToken,
                    trampoline: ctx.trampoline
                });
            });
        }
    }, {
        key: "TryWith",
        value: function TryWith(computation, catchHandler) {
            return protectedCont(function (ctx) {
                computation({
                    onSuccess: ctx.onSuccess,
                    onCancel: ctx.onCancel,
                    cancelToken: ctx.cancelToken,
                    trampoline: ctx.trampoline,
                    onError: function onError(ex) {
                        try {
                            catchHandler(ex)(ctx);
                        } catch (ex2) {
                            ctx.onError(ex2);
                        }
                    }
                });
            });
        }
    }, {
        key: "Using",
        value: function Using(resource, binder) {
            return this.TryFinally(binder(resource), function () {
                return resource.Dispose();
            });
        }
    }, {
        key: "While",
        value: function While(guard, computation) {
            var _this = this;

            if (guard()) return this.Bind(computation, function () {
                return _this.While(guard, computation);
            });else return this.Return(void 0);
        }
    }, {
        key: "Zero",
        value: function Zero() {
            return protectedCont(function (ctx) {
                return ctx.onSuccess(void 0);
            });
        }
    }]);

    return AsyncBuilder;
}();
var singleton$2 = new AsyncBuilder();

var _createClass$7 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var Choice = function () {
    function Choice(t, d) {
        _classCallCheck$8(this, Choice);

        this.Case = t;
        this.Fields = d;
    }

    _createClass$7(Choice, [{
        key: "Equals",
        value: function Equals(other) {
            return equalsUnions(this, other);
        }
    }, {
        key: "CompareTo",
        value: function CompareTo(other) {
            return compareUnions(this, other);
        }
    }, {
        key: FSymbol.reflection,
        value: function value() {
            return {
                type: "Microsoft.FSharp.Core.FSharpChoice",
                interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"]
            };
        }
    }, {
        key: "valueIfChoice1",
        get: function get() {
            return this.Case === "Choice1Of2" ? this.Fields[0] : null;
        }
    }, {
        key: "valueIfChoice2",
        get: function get() {
            return this.Case === "Choice2Of2" ? this.Fields[0] : null;
        }
    }]);

    return Choice;
}();

function emptyContinuation(x) {
    // NOP
}
function awaitPromise(p) {
    return fromContinuations(function (conts) {
        return p.then(conts[0]).catch(function (err) {
            return (err == "cancelled" ? conts[2] : conts[1])(err);
        });
    });
}

var defaultCancellationToken = { isCancelled: false };

function fromContinuations(f) {
    return protectedCont(function (ctx) {
        return f([ctx.onSuccess, ctx.onError, ctx.onCancel]);
    });
}



function start$1(computation, cancellationToken) {
    return startWithContinuations(computation, cancellationToken);
}
function startImmediate(computation, cancellationToken) {
    return start$1(computation, cancellationToken);
}
function startWithContinuations(computation, continuation, exceptionContinuation, cancellationContinuation, cancelToken) {
    if (typeof continuation !== "function") {
        cancelToken = continuation;
        continuation = null;
    }
    var trampoline = new Trampoline();
    computation({
        onSuccess: continuation ? continuation : emptyContinuation,
        onError: exceptionContinuation ? exceptionContinuation : emptyContinuation,
        onCancel: cancellationContinuation ? cancellationContinuation : emptyContinuation,
        cancelToken: cancelToken ? cancelToken : defaultCancellationToken,
        trampoline: trampoline
    });
}

var pow = function pow(tupledArg) {
  return Math.pow(tupledArg[0], tupledArg[1]);
};





function linear(t, b, c, d) {
  return c * t / d + b;
}



function inCubic(t, b, c, d) {
  var t_1 = t / d;
  return c * pow([t_1, 3]) + b;
}
function outCubic(t, b, c, d) {
  var t_1 = t / d - 1;
  return c * (pow([t_1, 3]) + 1) + b;
}

var ESprite = function (_Sprite) {
  _inherits(ESprite, _Sprite);

  _createClass(ESprite, [{
    key: FSymbol.reflection,
    value: function value() {
      return extendInfo(ESprite, {
        type: "Index.ESprite",
        interfaces: ["System.IDisposable"],
        properties: {
          Id: "string",
          IsDisposed: "boolean"
        }
      });
    }
  }]);

  function ESprite(t, id, behaviors) {
    _classCallCheck(this, ESprite);

    var _this = _possibleConstructorReturn(this, (ESprite.__proto__ || _Object$getPrototypeOf(ESprite)).call(this, t));

    _this.id = id;
    _this._behaviors = behaviors;
    _this._disposed = false;
    _this._prevTime = 0;
    return _this;
  }

  _createClass(ESprite, [{
    key: "Behave",
    value: function Behave(b) {
      this._behaviors = new List$1(b, this._behaviors);
    }
  }, {
    key: "Update",
    value: function Update(dt) {
      var _this2 = this;

      return function (builder_) {
        return builder_.Delay(function () {
          var behaviors = _this2._behaviors;
          _this2._behaviors = new List$1();
          var notCompletedBehaviors = new List$1();

          var dt_1 = function () {
            var tmp = _this2._prevTime;
            _this2._prevTime = dt;

            if (tmp === 0) {
              return 0;
            } else {
              return dt - tmp;
            }
          }();

          return builder_.For(behaviors, function (_arg1) {
            return _arg1(_this2, dt_1).then(function (_arg2) {
              return !_arg2 ? function () {
                notCompletedBehaviors = new List$1(_arg1, notCompletedBehaviors);
                return _Promise.resolve();
              }() : _Promise.resolve();
            });
          }).then(function () {
            return builder_.Delay(function () {
              _this2._behaviors = append$$1(_this2._behaviors, notCompletedBehaviors);
              return _Promise.resolve();
            });
          });
        });
      }(PromiseImpl.promise);
    }
  }, {
    key: "Dispose",
    value: function Dispose() {
      if (!this._disposed) {
        this._disposed = true;
        this.parent.removeChild(this);
      }
    }
  }, {
    key: "Id",
    get: function get() {
      return this.id;
    }
  }, {
    key: "IsDisposed",
    get: function get() {
      return this._disposed;
    }
  }]);

  return ESprite;
}(PIXI.Sprite);
declare(ESprite);
var State = function () {
  function State(caseName, fields) {
    _classCallCheck(this, State);

    this.Case = caseName;
    this.Fields = fields;
  }

  _createClass(State, [{
    key: FSymbol.reflection,
    value: function value() {
      return {
        type: "Index.State",
        interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
        cases: {
          Loading: [],
          MainTitle: [],
          NextDate: [],
          Nothing: [],
          Play: []
        }
      };
    }
  }, {
    key: "Equals",
    value: function Equals(other) {
      return equalsUnions(this, other);
    }
  }, {
    key: "CompareTo",
    value: function CompareTo(other) {
      return compareUnions(this, other);
    }
  }]);

  return State;
}();
declare(State);
var CodeFrequency = function () {
  function CodeFrequency(timestamp, addition, deletion) {
    _classCallCheck(this, CodeFrequency);

    this.timestamp = timestamp;
    this.addition = addition;
    this.deletion = deletion;
  }

  _createClass(CodeFrequency, [{
    key: FSymbol.reflection,
    value: function value() {
      return {
        type: "Index.CodeFrequency",
        interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
        properties: {
          timestamp: "number",
          addition: "number",
          deletion: "number"
        }
      };
    }
  }, {
    key: "Equals",
    value: function Equals(other) {
      return equalsRecords(this, other);
    }
  }, {
    key: "CompareTo",
    value: function CompareTo(other) {
      return compareRecords(this, other);
    }
  }]);

  return CodeFrequency;
}();
declare(CodeFrequency);
var Launcher = function () {
  function Launcher(plus, minus) {
    _classCallCheck(this, Launcher);

    this.plus = plus;
    this.minus = minus;
  }

  _createClass(Launcher, [{
    key: FSymbol.reflection,
    value: function value() {
      return {
        type: "Index.Launcher",
        interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
        properties: {
          plus: "number",
          minus: "number"
        }
      };
    }
  }, {
    key: "Equals",
    value: function Equals(other) {
      return equalsRecords(this, other);
    }
  }, {
    key: "CompareTo",
    value: function CompareTo(other) {
      return compareRecords(this, other);
    }
  }]);

  return Launcher;
}();
declare(Launcher);
var Trail = function () {
  function Trail(sprite, dec) {
    _classCallCheck(this, Trail);

    this.sprite = sprite;
    this.dec = dec;
  }

  _createClass(Trail, [{
    key: FSymbol.reflection,
    value: function value() {
      return {
        type: "Index.Trail",
        interfaces: ["FSharpRecord", "System.IEquatable"],
        properties: {
          sprite: PIXI.Sprite,
          dec: "number"
        }
      };
    }
  }, {
    key: "Equals",
    value: function Equals(other) {
      return equalsRecords(this, other);
    }
  }]);

  return Trail;
}();
declare(Trail);
var Behaviors = function (__exports) {
  var distanceBetween2Points = function distanceBetween2Points(p1, p2) {
    var tx = p2.x - p1.x;
    var ty = p2.y - p1.y;
    return Math.sqrt(tx * tx + ty * ty);
  };

  var fade = __exports.fade = function fade(easeFunction, duration) {
    var ms = 0;
    return function (s, dt) {
      return _Promise.resolve(s.alpha > 0 ? function () {
        ms = ms + dt;
        var result = easeFunction(ms, 0, 1, duration);
        s.alpha = 1 - result;

        if (s.alpha < 0) {
          s.alpha = 0;
          return true;
        } else {
          return false;
        }
      }() : true);
    };
  };

  var fadeOut = __exports.fadeOut = function fadeOut(easeFunction, duration, onCompleted) {
    var ms = 0;
    return function (s, dt) {
      return _Promise.resolve(s.alpha < 1 ? function () {
        ms = ms + dt;
        var result = easeFunction(ms, 0, 1, duration);
        s.alpha = result;
        return false;
      }() : function () {
        if (s.alpha > 1) {
          s.alpha = 1;
        }

        onCompleted(s);
        return true;
      }());
    };
  };

  var curveTo = __exports.curveTo = function curveTo(easeFunction, duration, radius, p, onCompleted) {
    var ms = -1;
    var distance = 0;
    var a = 0;
    var where$$1 = Math.random() > 0.5 ? 1 : -1;
    var curve = Math.random() * 5 / 500 * where$$1;
    return function (s, dt) {
      var patternInput = [p.x - s.position.x, p.y - s.position.y];
      a = Math.atan2(patternInput[1], patternInput[0]) + curve;
      return _Promise.resolve(ms < 0 ? function () {
        var patternInput_1 = [p.x - s.position.x, p.y - s.position.y];
        distance = Math.sqrt(patternInput_1[0] * patternInput_1[0] + patternInput_1[1] * patternInput_1[1]);
        ms = 0;
        return false;
      }() : function () {
        ms = ms + dt;
        var result = easeFunction(ms, 0, 1, duration);
        var d = Math.abs(distance) * (1 - result);

        if (result < 1 ? true : d > radius) {
          var factor = distance > 0 ? -1 : 1;
          s.rotation = a;
          s.position = new PIXI.Point(p.x + d * Math.cos(a) * factor, p.y + d * Math.sin(a) * factor);
          return false;
        } else {
          onCompleted(s);
          return true;
        }
      }());
    };
  };

  var breathe = __exports.breathe = function breathe(amplitude, speed) {
    var scale = new PIXI.Point(0, 0);
    var ms = -1;
    var a = 0;
    return function (s, _arg1) {
      if (ms < 0) {
        scale = new PIXI.Point(s.scale.x, s.scale.y);
        ms = 0;
      } else {
        a = a + speed;
        s.scale.x = scale.x + Math.cos(a) * amplitude;
        s.scale.y = scale.y + Math.cos(a) * amplitude;
      }

      return _Promise.resolve(false);
    };
  };

  var alphaDeath = __exports.alphaDeath = function alphaDeath(onCompleted) {
    return function (s, _arg1) {
      return _Promise.resolve(s.alpha <= 0 ? function () {
        s.Dispose();
        onCompleted(s);
        return true;
      }() : false);
    };
  };

  var killOffScreen = __exports.killOffScreen = function killOffScreen(bounds, onCompleted) {
    return function (s, _arg1) {
      var sx = s.position.x;
      var sy = s.position.y;
      var offScreen = ((sx + s.width < bounds.x ? true : sy + s.height < bounds.y) ? true : s.y - s.height >= bounds.height) ? true : sx - s.width > bounds.width;

      if (offScreen) {
        onCompleted(s);
        s.Dispose();
      }

      return _Promise.resolve(offScreen);
    };
  };

  var grow = __exports.grow = function grow(easeFunction, duration, max$$1, min$$1) {
    var ms = -1;
    var scale = max$$1;
    var diff = max$$1 - min$$1;
    return function (s, dt) {
      ms = ms + dt;
      var result = easeFunction(ms, 0, 1, duration);
      scale = min$$1 + result * diff;
      return _Promise.resolve(scale >= max$$1 ? true : (s.scale = new PIXI.Point(scale, scale), false));
    };
  };

  return __exports;
}({});
function updateLoop(renderer, stage) {
  var centerX = renderer.width * 0.5;
  var centerY = renderer.height * 0.5;
  var rwidth = renderer.width;
  var rheight = renderer.height;
  var maxParticlesByCodeFrequency = 300;
  var fps = 60;
  var maxParticlesByFrame = maxParticlesByCodeFrequency / fps;
  var id = -1;
  var state = new State("Loading", []);
  var resources = null;
  var launchers = new List$1();
  var sprites = new List$1();
  var ghData = new List$1();
  var trails = new List$1();
  var rocketsGreen = [];
  var rocketsYellow = [];
  var sum$$1 = 0;
  var plusSum = 0;
  var minusSum = 0;
  var planet = null;
  var title = null;
  var subtitle = null;
  var minusBand = null;
  var plusBand = null;
  var maskPlus = null;
  var maskMinus = null;
  var textPlus = null;
  var textMinus = null;

  var createParticleContainer = function createParticleContainer(max$$1) {
    var options = {
      scale: true,
      rotation: true,
      alpha: true
    };
    return new PIXI.ParticleContainer(max$$1, options);
  };

  var backgroundContainer = new PIXI.Container();
  var yellowContainer = createParticleContainer(500000);
  var minusContainer = createParticleContainer(50000);
  var planetContainer = new PIXI.Container();
  var greenContainer = createParticleContainer(500000);
  var plusContainer = createParticleContainer(500000);

  var bindContainer = function bindContainer(c) {
    stage.addChild(c);
  };

  iterate(function (arg00) {
    bindContainer(arg00);
  }, [backgroundContainer, yellowContainer, minusContainer, greenContainer, plusContainer, planetContainer]);

  var nextId = function nextId() {
    id = id + 1;
    return fsFormat("%i")(function (x) {
      return x;
    })(id);
  };

  var makeSprite = function makeSprite(t) {
    return new PIXI.Sprite(t);
  };

  var makeESprite = function makeESprite(behaviors) {
    return function (t) {
      return new ESprite(t, nextId(), behaviors);
    };
  };

  var getTexture = function getTexture(name) {
    return resources[name].texture;
  };

  var addToContainer = function addToContainer(c) {
    return function (s) {
      c.addChild(s);
      return s;
    };
  };

  var setPosition = function setPosition(x) {
    return function (y) {
      return function (s) {
        s.position = new PIXI.Point(x, y);
        return s;
      };
    };
  };

  var setAnchor = function setAnchor(x) {
    return function (y) {
      return function (s) {
        s.anchor = new PIXI.Point(x, y);
        return s;
      };
    };
  };

  var setScale = function setScale(sx) {
    return function (sy) {
      return function (s) {
        s.scale = new PIXI.Point(sx, sy);
        return s;
      };
    };
  };

  var drawRect = function drawRect(g) {
    return function (color) {
      return function (width) {
        return function (height) {
          g.beginFill(color);
          g.drawRect(0, 0, width, height);
          g.endFill();
          return g;
        };
      };
    };
  };

  var setRotation = function setRotation(r) {
    return function (s) {
      s.rotation = r;
      return s;
    };
  };

  var setAlpha = function setAlpha(a) {
    return function (s) {
      s.alpha = a;
      return s;
    };
  };

  var addToESprites = function addToESprites(s) {
    sprites = append$$1(ofArray([s]), sprites);
    return s;
  };

  var updateParticles = function updateParticles(trails_1) {
    iterate(function (e) {
      e.sprite.alpha = e.sprite.alpha - e.dec;
    }, trails_1);
    return trails_1;
  };

  var addTrails = function addTrails() {
    var addTotrails = function addTotrails(t) {
      trails = new List$1(new Trail(t, 0.005), trails);
    };

    iterate(function (rocket) {
      addTotrails(function (arg00) {
        var clo1 = addToContainer(arg00);
        return function (arg10) {
          return clo1(arg10);
        };
      }(greenContainer)(setRotation(rocket.rotation)(setAnchor(rocket.anchor.x)(rocket.anchor.y)(setScale(0.2)(0.2)(setAlpha(0.5)(setPosition(rocket.position.x)(rocket.position.y)(makeSprite(getTexture("plus")))))))));
    }, rocketsGreen);
    iterate(function (rocket) {
      addTotrails(function (arg00) {
        var clo1 = addToContainer(arg00);
        return function (arg10) {
          return clo1(arg10);
        };
      }(yellowContainer)(setRotation(rocket.rotation)(setAnchor(rocket.anchor.x)(rocket.anchor.y)(setScale(0.2)(0.1)(setAlpha(0.5)(setPosition(rocket.position.x)(rocket.position.y)(makeSprite(getTexture("minus")))))))));
    }, rocketsYellow);
  };

  var update = function update(currentState) {
    trails = updateParticles(trails);
    addTrails();

    if (currentState.Case === "Loading") {
      var _ret = function () {
        var onLoadComplete = function onLoadComplete(r) {
          var endLoadSequence = function endLoadSequence(r_1) {
            return function (json) {
              window.document.getElementById("loading").style.display = "none";
              resources = r_1;
              var rawData = json;
              ghData = toList(map$1(function (inValue) {
                var out = inValue;
                var timestamp = out[0];
                var deletion = out[2];
                return new CodeFrequency(timestamp, out[1], deletion);
              }, rawData));
              sum$$1 = sum(map$1(function (cd) {
                return cd.addition - cd.deletion;
              }, ghData));
              state = new State("MainTitle", []);
            };
          };

          var loadRemoteJson = function loadRemoteJson(r_1) {
            return function (url) {
              var now$$1 = today();
              var key = fsFormat("fable_behaviors_cache_%s")(function (x) {
                return x;
              })(toShortDateString(now$$1));

              var cached = function (arg00) {
                return JSON.parse(arg00);
              }(function (_arg1) {
                return _arg1 == null ? "[]" : _arg1;
              }(localStorage.getItem(key)));

              if (cached.length <= 0) {
                console.log("GitHub data not found in LocalStorage. Retrieveing data from GitHub");

                (function (arg00) {
                  startImmediate(arg00);
                })(function (builder_) {
                  return builder_.Delay(function () {
                    return builder_.TryWith(builder_.Delay(function () {
                      return builder_.Bind(awaitPromise(fetch(url)), function (_arg2) {
                        return builder_.Bind(awaitPromise(_arg2.json()), function (_arg3) {
                          localStorage.setItem(key, _JSON$stringify(_arg3));
                          endLoadSequence(r_1)(_arg3);
                          return builder_.Zero();
                        });
                      });
                    }), function (_arg4) {
                      throw new Error(fsFormat("could not load json from url %s")(function (x) {
                        return x;
                      })(url));
                      return builder_.Zero();
                    });
                  });
                }(singleton$2));
              } else {
                console.log(fsFormat("Loading GitHub data from LocalStorage (%s)")(function (x) {
                  return x;
                })(key));
                endLoadSequence(r_1)(cached);
              }
            };
          };

          loadRemoteJson(r)("https://api.github.com/repos/fable-compiler/Fable/stats/code_frequency");
        };

        var errorCallback = function errorCallback(e) {
          console.log(e);
        };

        var onProgress = function onProgress(e) {
          console.log(e);
        };

        var addAssetToLoad = function addAssetToLoad(rawName) {
          var extractName = function extractName(rawName_1) {
            var rawName_2 = rawName_1.substr(rawName_1.lastIndexOf("/") + 1);
            var keys = rawName_2.split(".");
            return keys[0];
          };

          PIXI.loader.add(extractName(rawName), "out/" + rawName);
        };

        addAssetToLoad("font.fnt");

        (function (source) {
          iterate(addAssetToLoad, source);
        })(map$1(function (name) {
          return fsFormat("%s.png")(function (x) {
            return x;
          })(name);
        }, ofArray(["background", "feedbackgreen", "feedbackyellow", "greentrail", "yellowtrail", "maintitle", "github", "planet", "plus", "minus", "title2", "githubsmall", "minusband", "plusband"])));

        PIXI.loader.on("error", errorCallback);
        PIXI.loader.load();
        PIXI.loader.on("progress", onProgress);
        PIXI.loader.once("complete", function (loader$$1, resources_1) {
          onLoadComplete(resources_1);
        });
        return {
          v: new State("Nothing", [])
        };
      }();

      if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    } else {
      if (currentState.Case === "MainTitle") {
        setAlpha(0.6)(addToContainer(backgroundContainer)(makeSprite(getTexture("background"))));

        var planetBreathe = function planetBreathe(es) {
          es.Behave(Behaviors.breathe(0.05, 0.022));
          return es;
        };

        planet = setAlpha(0)(setPosition(centerX)(centerY)(setAnchor(0.5)(0.5)(function (arg00) {
          var clo1 = addToContainer(arg00);
          return function (arg10) {
            return clo1(arg10);
          };
        }(planetContainer)(addToESprites(planetBreathe(makeESprite(ofArray([Behaviors.fadeOut(function (delegateArg0, delegateArg1, delegateArg2, delegateArg3) {
          return outCubic(delegateArg0, delegateArg1, delegateArg2, delegateArg3);
        }, 3000, function (value) {
          value;
        })]))(getTexture("planet"))))))));
        title = setAlpha(0)(setPosition(planet.position.x)(planet.position.y + 50)(setAnchor(0.5)(0)(function (arg00) {
          var clo1 = addToContainer(arg00);
          return function (arg10) {
            return clo1(arg10);
          };
        }(planetContainer)(addToESprites(makeESprite(ofArray([Behaviors.fadeOut(function (delegateArg0, delegateArg1, delegateArg2, delegateArg3) {
          return outCubic(delegateArg0, delegateArg1, delegateArg2, delegateArg3);
        }, 3300, function (s) {
          fsFormat("done")(function (x) {
            console.log(x);
          });
        })]))(getTexture("title2")))))));

        var launchNext = function launchNext(s) {
          state = new State("NextDate", []);
        };

        subtitle = setAlpha(0)(setPosition(title.position.x)(title.position.y + title.height + 5)(setAnchor(0.5)(0)(function (arg00) {
          var clo1 = addToContainer(arg00);
          return function (arg10) {
            return clo1(arg10);
          };
        }(planetContainer)(addToESprites(makeESprite(ofArray([Behaviors.fadeOut(function (delegateArg0, delegateArg1, delegateArg2, delegateArg3) {
          return outCubic(delegateArg0, delegateArg1, delegateArg2, delegateArg3);
        }, 3600, launchNext)]))(getTexture("githubsmall")))))));
        var margin = 480;
        minusBand = setPosition(centerX - margin)(rheight - 20)(setAnchor(0)(0.5)(addToContainer(planetContainer)(makeSprite(getTexture("minusband")))));
        plusBand = setPosition(centerX - margin)(rheight - 50)(setAnchor(0)(0.5)(addToContainer(planetContainer)(makeSprite(getTexture("plusband")))));
        setPosition(plusBand.position.x - 40)(plusBand.position.y)(setAnchor(0)(0.5)(addToContainer(planetContainer)(makeSprite(getTexture("plus")))));
        setPosition(minusBand.position.x - 42)(minusBand.position.y)(setAnchor(0)(0.5)(addToContainer(planetContainer)(makeSprite(getTexture("minus")))));
        maskPlus = new PIXI.Graphics();
        maskPlus.beginFill(16777215);
        maskPlus.drawRect(0, 0, 1, 20);
        maskPlus.endFill();
        planetContainer.addChild(maskPlus);
        maskPlus.position = new PIXI.Point(plusBand.position.x, plusBand.position.y - 10);
        plusBand.mask = maskPlus;
        textPlus = new PIXI.extras.BitmapText("", {
          font: "20px Josefin Sans",
          align: "left",
          tint: 11917213
        });
        var text = fsFormat("%i")(function (x) {
          return x;
        })(~~Math.ceil(plusSum));
        textPlus.text = text;
        textPlus.position = new PIXI.Point(plusBand.position.x + maskPlus.width + 20, plusBand.position.y - 10);
        planetContainer.addChild(textPlus);
        maskMinus = new PIXI.Graphics();
        maskMinus.beginFill(16777215);
        maskMinus.drawRect(0, 0, 1, 20);
        maskMinus.endFill();
        planetContainer.addChild(maskMinus);
        maskMinus.position = new PIXI.Point(minusBand.position.x, minusBand.position.y - 10);
        minusBand.mask = maskMinus;
        textMinus = new PIXI.extras.BitmapText("", {
          font: "20px Josefin Sans",
          align: "left",
          tint: 16751360
        });
        var text_1 = fsFormat("%i")(function (x) {
          return x;
        })(~~Math.ceil(minusSum));
        textMinus.text = text_1;
        textMinus.position = new PIXI.Point(plusBand.position.x + maskMinus.width + 20, minusBand.position.y - 10);
        planetContainer.addChild(textMinus);
        return new State("Play", []);
      } else {
        if (currentState.Case === "NextDate") {
          yellowContainer.removeChildren();
          greenContainer.removeChildren();
          rocketsYellow = [];
          rocketsGreen = [];
          trails = new List$1();
          {
            var matchValue = tryHead(ghData);

            if (matchValue == null) {
              fsFormat("gameover")(function (x) {
                console.log(x);
              });
            } else {
              (function () {
                var ratio = 0.003;
                plusSum = plusSum + matchValue.addition;
                var addPct = plusSum / sum$$1 * 1000;
                maskPlus.scale.x = addPct;
                var text = fsFormat("[ + ] %i")(function (x) {
                  return x;
                })(~~Math.ceil(plusSum));
                textPlus.text = text;
                textPlus.position = new PIXI.Point(plusBand.position.x + maskPlus.scale.x + 10, plusBand.position.y - 10);
                var plusCount = ~~Math.ceil(matchValue.addition * ratio);
                var deletions = -matchValue.deletion;
                minusSum = minusSum + deletions;
                var addPct_1 = minusSum / sum$$1 * 1000;
                maskMinus.scale.x = addPct_1;
                var text_1 = fsFormat("[ - ] %i")(function (x) {
                  return x;
                })(~~Math.ceil(minusSum));
                textMinus.text = text_1;
                textMinus.position = new PIXI.Point(plusBand.position.x + maskMinus.scale.x + 10, minusBand.position.y - 10);
                var minusCount = ~~Math.ceil(deletions * ratio);
                fsFormat("%i")(function (x) {
                  console.log(x);
                })(minusCount);

                var addToRockets = function addToRockets(s) {
                  rocketsGreen[rocketsGreen.length] = s;
                  return s;
                };

                var addToRocketsYellow = function addToRocketsYellow(s) {
                  rocketsYellow[rocketsYellow.length] = s;
                  return s;
                };

                var nextState = function nextState() {
                  state = new State("NextDate", []);
                };

                window.setTimeout(nextState, 3500);
                var time = 1000;
                var addTime = 2000 / plusCount;
                iterate(function (i) {
                  var onComplete = function onComplete(s) {
                    s.Behave(Behaviors.fade(function (delegateArg0, delegateArg1, delegateArg2, delegateArg3) {
                      return linear(delegateArg0, delegateArg1, delegateArg2, delegateArg3);
                    }, 100));
                  };

                  var posX = centerX + Math.cos((Math.random() + 0.01) * 360 * PIXI.DEG_TO_RAD) * 1200;
                  var posY = centerY + Math.sin((Math.random() + 0.01) * 360 * PIXI.DEG_TO_RAD) * 1200;
                  addToRockets(setPosition(posX)(posY)(setAnchor(0.5)(0.5)(function (arg00) {
                    var clo1 = addToContainer(arg00);
                    return function (arg10) {
                      return clo1(arg10);
                    };
                  }(plusContainer)(addToESprites(makeESprite(ofArray([Behaviors.curveTo(function (delegateArg0, delegateArg1, delegateArg2, delegateArg3) {
                    return linear(delegateArg0, delegateArg1, delegateArg2, delegateArg3);
                  }, time + i * addTime, 10, new PIXI.Point(centerX, centerY), onComplete), Behaviors.alphaDeath(function (value) {
                    value;
                  })]))(getTexture("plus")))))));
                }, range(0, plusCount));
                var addTime_1 = 2000 / minusCount;
                iterate(function (i) {
                  var onComplete = function onComplete(s) {
                    s.Behave(Behaviors.fade(function (delegateArg0, delegateArg1, delegateArg2, delegateArg3) {
                      return linear(delegateArg0, delegateArg1, delegateArg2, delegateArg3);
                    }, 100));
                  };

                  var posX = centerX + Math.cos((Math.random() + 0.01) * 360 * PIXI.DEG_TO_RAD) * 1200;
                  var posY = centerY + Math.sin((Math.random() + 0.01) * 360 * PIXI.DEG_TO_RAD) * 1200;
                  var p = new PIXI.Point(posX, posY);
                  addToRocketsYellow(setPosition(centerX)(centerY)(setAnchor(0.5)(0.5)(function (arg00) {
                    var clo1 = addToContainer(arg00);
                    return function (arg10) {
                      return clo1(arg10);
                    };
                  }(minusContainer)(addToESprites(makeESprite(ofArray([Behaviors.curveTo(function (delegateArg0, delegateArg1, delegateArg2, delegateArg3) {
                    return inCubic(delegateArg0, delegateArg1, delegateArg2, delegateArg3);
                  }, time + i * addTime_1, 100, p, onComplete), Behaviors.fade(function (delegateArg0, delegateArg1, delegateArg2, delegateArg3) {
                    return linear(delegateArg0, delegateArg1, delegateArg2, delegateArg3);
                  }, time + i * addTime_1), Behaviors.alphaDeath(function (value) {
                    value;
                  })]))(getTexture("minus")))))));
                }, range(0, minusCount));
                var date$$1 = create$8(1970, 0, 0, 0, 0, 0);
                var date_1 = addSeconds(date$$1, matchValue.timestamp);
                var date_2 = toLongDateString(date_1);
                var text_2 = new PIXI.extras.BitmapText(date_2, {
                  font: "25px Josefin Sans",
                  align: "left",
                  tint: 16777215
                });
                addToContainer(planetContainer)(setPosition(130)(plusBand.position.y - 30)(function (arg00) {
                  var clo1 = setAnchor(arg00);
                  return function (arg10) {
                    var clo2 = clo1(arg10);
                    return function (arg20) {
                      return clo2(arg20);
                    };
                  };
                }(0.5)(0.5)(addToESprites(makeESprite(ofArray([Behaviors.fade(function (delegateArg0, delegateArg1, delegateArg2, delegateArg3) {
                  return inCubic(delegateArg0, delegateArg1, delegateArg2, delegateArg3);
                }, 3500), Behaviors.alphaDeath(function (value) {
                  value;
                })]))(text_2.generateTexture(renderer))))));
                ghData = ghData.tail;
              })();
            }
          }
          return new State("Play", []);
        } else {
          if (currentState.Case === "Play") {
            return new State("Play", []);
          } else {
            return new State("Nothing", []);
          }
        }
      }
    }
  };

  var updateLoop_1 = function updateLoop_1(render) {
    return function (dt) {
      (function (builder_) {
        return builder_.Delay(function () {
          var xs = new List$1();
          return builder_.For(sprites, function (_arg5) {
            return _arg5.Update(dt).then(function () {
              return !_arg5.IsDisposed ? function () {
                xs = new List$1(_arg5, xs);
                return _Promise.resolve();
              }() : _Promise.resolve();
            });
          }).then(function () {
            return builder_.Delay(function () {
              return _Promise.resolve(xs);
            });
          });
        });
      })(PromiseImpl.promise).then(function (sprites_1) {
        state = update(state);
        render();
        window.requestAnimationFrame(function (dt_1) {
          updateLoop_1(render)(dt_1);
        });
      });
    };
  };

  return updateLoop_1;
}
function start$$1(divName) {
  var renderer = new PIXI.WebGLRenderer(1024, 600, {
    antialias: true,
    backgroundColor: 0
  });
  document.getElementById("game").appendChild(renderer.view);

  var stage = function () {
    var returnVal = new PIXI.Container();
    {
      returnVal.interactive = true;
    }
    return returnVal;
  }();

  updateLoop(renderer, stage)(function () {
    renderer.render(stage);
  })(0);
}
start$$1("game");

exports.ESprite = ESprite;
exports.State = State;
exports.CodeFrequency = CodeFrequency;
exports.Launcher = Launcher;
exports.Trail = Trail;
exports.Behaviors = Behaviors;
exports.updateLoop = updateLoop;
exports.start = start$$1;

}((this.index = this.index || {}),PIXI));

//# sourceMappingURL=bundle.js.map