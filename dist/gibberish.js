(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Gibberish = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js');

var proto = {
  name: 'abs',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add(_defineProperty({}, this.name, Math.abs));

      out = 'gen.abs( ' + inputs[0] + ' )';
    } else {
      out = Math.abs(parseFloat(inputs[0]));
    }

    return out;
  }
};

module.exports = function (x) {
  var abs = Object.create(proto);

  abs.inputs = [x];

  return abs;
};
},{"./gen.js":30}],2:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js');

var proto = {
  basename: 'accum',

  gen: function gen() {
    var code = void 0,
        inputs = _gen.getInputs(this),
        genName = 'gen.' + this.name,
        functionBody = void 0;

    _gen.requestMemory(this.memory);

    _gen.memory.heap[this.memory.value.idx] = this.initialValue;

    functionBody = this.callback(genName, inputs[0], inputs[1], 'memory[' + this.memory.value.idx + ']');

    _gen.closures.add(_defineProperty({}, this.name, this));

    _gen.memo[this.name] = this.name + '_value';

    return [this.name + '_value', functionBody];
  },
  callback: function callback(_name, _incr, _reset, valueRef) {
    var diff = this.max - this.min,
        out = '',
        wrap = '';

    /* three different methods of wrapping, third is most expensive:
     *
     * 1: range {0,1}: y = x - (x | 0)
     * 2: log2(this.max) == integer: y = x & (this.max - 1)
     * 3: all others: if( x >= this.max ) y = this.max -x
     *
     */

    // must check for reset before storing value for output
    if (!(typeof this.inputs[1] === 'number' && this.inputs[1] < 1)) {
      if (this.initialValue !== this.min) {
        out += '  if( ' + _reset + ' >=1 ) ' + valueRef + ' = ' + this.min + '\n\n';
      } else {
        out += '  if( ' + _reset + ' >=1 ) ' + valueRef + ' = ' + this.initialValue + '\n\n';
      }
    }

    out += '  var ' + this.name + '_value = ' + valueRef + ';\n';

    if (this.shouldWrap === false && this.shouldClamp === true) {
      out += '  if( ' + valueRef + ' < ' + this.max + ' ) ' + valueRef + ' += ' + _incr + '\n';
    } else {
      out += '  ' + valueRef + ' += ' + _incr + '\n'; // store output value before accumulating
    }

    if (this.max !== Infinity && this.shouldWrap) wrap += '  if( ' + valueRef + ' >= ' + this.max + ' ) ' + valueRef + ' -= ' + diff + '\n';
    if (this.min !== -Infinity && this.shouldWrap) wrap += '  if( ' + valueRef + ' < ' + this.min + ' ) ' + valueRef + ' += ' + diff + '\n\n';

    //if( this.min === 0 && this.max === 1 ) {
    //  wrap =  `  ${valueRef} = ${valueRef} - (${valueRef} | 0)\n\n`
    //} else if( this.min === 0 && ( Math.log2( this.max ) | 0 ) === Math.log2( this.max ) ) {
    //  wrap =  `  ${valueRef} = ${valueRef} & (${this.max} - 1)\n\n`
    //} else if( this.max !== Infinity ){
    //  wrap = `  if( ${valueRef} >= ${this.max} ) ${valueRef} -= ${diff}\n\n`
    //}

    out = out + wrap;

    return out;
  }
};

module.exports = function (incr) {
  var reset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var properties = arguments[2];

  var ugen = Object.create(proto),
      defaults = { min: 0, max: 1, shouldWrap: true, shouldClamp: false };

  if (properties !== undefined) Object.assign(defaults, properties);

  if (defaults.initialValue === undefined) defaults.initialValue = defaults.min;

  Object.assign(ugen, {
    min: defaults.min,
    max: defaults.max,
    initial: defaults.initialValue,
    uid: _gen.getUID(),
    inputs: [incr, reset],
    memory: {
      value: { length: 1, idx: null }
    }
  }, defaults);

  Object.defineProperty(ugen, 'value', {
    get: function get() {
      return _gen.memory.heap[this.memory.value.idx];
    },
    set: function set(v) {
      _gen.memory.heap[this.memory.value.idx] = v;
    }
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./gen.js":30}],3:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'acos',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add({ 'acos': Math.acos });

      out = 'gen.acos( ' + inputs[0] + ' )';
    } else {
      out = Math.acos(parseFloat(inputs[0]));
    }

    return out;
  }
};

module.exports = function (x) {
  var acos = Object.create(proto);

  acos.inputs = [x];
  acos.id = _gen.getUID();
  acos.name = acos.basename + '{acos.id}';

  return acos;
};
},{"./gen.js":30}],4:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    mul = require('./mul.js'),
    sub = require('./sub.js'),
    div = require('./div.js'),
    data = require('./data.js'),
    peek = require('./peek.js'),
    accum = require('./accum.js'),
    ifelse = require('./ifelseif.js'),
    lt = require('./lt.js'),
    bang = require('./bang.js'),
    env = require('./env.js'),
    add = require('./add.js'),
    poke = require('./poke.js'),
    neq = require('./neq.js'),
    and = require('./and.js'),
    gte = require('./gte.js'),
    memo = require('./memo.js');

module.exports = function () {
  var attackTime = arguments.length <= 0 || arguments[0] === undefined ? 44100 : arguments[0];
  var decayTime = arguments.length <= 1 || arguments[1] === undefined ? 44100 : arguments[1];
  var _props = arguments[2];

  var _bang = bang(),
      phase = accum(1, _bang, { min: 0, max: Infinity, initialValue: -Infinity, shouldWrap: false }),
      props = Object.assign({}, { shape: 'exponential', alpha: 5 }, _props),
      bufferData = void 0,
      bufferDataReverse = void 0,
      decayData = void 0,
      out = void 0,
      buffer = void 0;

  //console.log( 'shape:', props.shape, 'attack time:', attackTime, 'decay time:', decayTime )
  var completeFlag = data([0]);

  // slightly more efficient to use existing phase accumulator for linear envelopes
  if (props.shape === 'linear') {
    out = ifelse(and(gte(phase, 0), lt(phase, attackTime)), div(phase, attackTime), and(gte(phase, 0), lt(phase, add(attackTime, decayTime))), sub(1, div(sub(phase, attackTime), decayTime)), neq(phase, -Infinity), poke(completeFlag, 1, 0, { inline: 0 }), 0);
  } else {
    bufferData = env({ length: 1024, type: props.shape, alpha: props.alpha });
    bufferDataReverse = env({ length: 1024, type: props.shape, alpha: props.alpha, reverse: true });

    out = ifelse(and(gte(phase, 0), lt(phase, attackTime)), peek(bufferData, div(phase, attackTime), { boundmode: 'clamp' }), and(gte(phase, 0), lt(phase, add(attackTime, decayTime))), peek(bufferDataReverse, div(sub(phase, attackTime), decayTime), { boundmode: 'clamp' }), neq(phase, -Infinity), poke(completeFlag, 1, 0, { inline: 0 }), 0);
  }

  out.isComplete = function () {
    return gen.memory.heap[completeFlag.memory.values.idx];
  };

  out.trigger = function () {
    gen.memory.heap[completeFlag.memory.values.idx] = 0;
    _bang.trigger();
  };

  return out;
};
},{"./accum.js":2,"./add.js":5,"./and.js":7,"./bang.js":11,"./data.js":18,"./div.js":23,"./env.js":24,"./gen.js":30,"./gte.js":32,"./ifelseif.js":35,"./lt.js":38,"./memo.js":42,"./mul.js":48,"./neq.js":49,"./peek.js":54,"./poke.js":56,"./sub.js":65}],5:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'add',
  gen: function gen() {
    var inputs = _gen.getInputs(this),
        out = '',
        sum = 0,
        numCount = 0,
        adderAtEnd = false,
        alreadyFullSummed = true;

    out = '  var ' + this.name + ' = ';

    inputs.forEach(function (v, i) {
      if (isNaN(v)) {
        out += v;
        if (i < inputs.length - 1) {
          adderAtEnd = true;
          out += ' + ';
        }
        alreadyFullSummed = false;
      } else {
        sum += parseFloat(v);
        numCount++;
      }
    });

    if (numCount > 0) {
      out += adderAtEnd || alreadyFullSummed ? sum : ' + ' + sum;
    }

    out += '\n';

    _gen.memo[this.name] = this.name;

    return [this.name, out];
  }
};

module.exports = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var add = Object.create(proto);
  add.id = _gen.getUID();
  add.name = add.basename + add.id;
  add.inputs = args;

  return add;
};
},{"./gen.js":30}],6:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    mul = require('./mul.js'),
    sub = require('./sub.js'),
    div = require('./div.js'),
    data = require('./data.js'),
    peek = require('./peek.js'),
    accum = require('./accum.js'),
    ifelse = require('./ifelseif.js'),
    lt = require('./lt.js'),
    bang = require('./bang.js'),
    env = require('./env.js'),
    param = require('./param.js'),
    add = require('./add.js'),
    gtp = require('./gtp.js'),
    not = require('./not.js');

module.exports = function () {
  var attackTime = arguments.length <= 0 || arguments[0] === undefined ? 44 : arguments[0];
  var decayTime = arguments.length <= 1 || arguments[1] === undefined ? 22050 : arguments[1];
  var sustainTime = arguments.length <= 2 || arguments[2] === undefined ? 44100 : arguments[2];
  var sustainLevel = arguments.length <= 3 || arguments[3] === undefined ? .6 : arguments[3];
  var releaseTime = arguments.length <= 4 || arguments[4] === undefined ? 44100 : arguments[4];
  var _props = arguments[5];

  var envTrigger = bang(),
      phase = accum(1, envTrigger, { max: Infinity, shouldWrap: false }),
      shouldSustain = param(1),
      defaults = {
    shape: 'exponential',
    alpha: 5,
    triggerRelease: false
  },
      props = Object.assign({}, defaults, _props),
      bufferData = void 0,
      decayData = void 0,
      out = void 0,
      buffer = void 0,
      sustainCondition = void 0,
      releaseAccum = void 0,
      releaseCondition = void 0;

  // slightly more efficient to use existing phase accumulator for linear envelopes
  //if( props.shape === 'linear' ) {
  //  out = ifelse(
  //    lt( phase, props.attackTime ), memo( div( phase, props.attackTime ) ),
  //    lt( phase, props.attackTime + props.decayTime ), sub( 1, mul( div( sub( phase, props.attackTime ), props.decayTime ), 1-props.sustainLevel ) ),
  //    lt( phase, props.attackTime + props.decayTime + props.sustainTime ),
  //      props.sustainLevel,
  //    lt( phase, props.attackTime + props.decayTime + props.sustainTime + props.releaseTime ),
  //      sub( props.sustainLevel, mul( div( sub( phase, props.attackTime + props.decayTime + props.sustainTime ), props.releaseTime ), props.sustainLevel) ),
  //    0
  //  )
  //} else {    
  bufferData = env({ length: 1024, alpha: props.alpha, shift: 0, type: props.shape });

  console.log(bufferData);

  sustainCondition = props.triggerRelease ? shouldSustain : lt(phase, add(attackTime, decayTime, sustainTime));

  releaseAccum = props.triggerRelease ? gtp(sub(sustainLevel, accum(div(sustainLevel, releaseTime), 0, { shouldWrap: false })), 0) : sub(sustainLevel, mul(div(sub(phase, add(attackTime, decayTime, sustainTime)), releaseTime), sustainLevel)), releaseCondition = props.triggerRelease ? not(shouldSustain) : lt(phase, add(attackTime, decayTime, sustainTime, releaseTime));

  out = ifelse(
  // attack
  lt(phase, attackTime), peek(bufferData, div(phase, attackTime), { boundmode: 'clamp' }),

  // decay
  lt(phase, add(attackTime, decayTime)), peek(bufferData, sub(1, mul(div(sub(phase, attackTime), decayTime), sub(1, sustainLevel))), { boundmode: 'clamp' }),

  // sustain
  sustainCondition, peek(bufferData, sustainLevel),

  // release
  releaseCondition, //lt( phase,  attackTime +  decayTime +  sustainTime +  releaseTime ),
  peek(bufferData, releaseAccum,
  //sub(  sustainLevel, mul( div( sub( phase,  attackTime +  decayTime +  sustainTime),  releaseTime ),  sustainLevel ) ),
  { boundmode: 'clamp' }), 0);
  //}

  out.trigger = function () {
    shouldSustain.value = 1;
    envTrigger.trigger();
  };

  out.release = function () {
    shouldSustain.value = 0;
    // XXX pretty nasty... grabs accum inside of gtp and resets value manually
    // unfortunately envTrigger won't work as it's back to 0 by the time the release block is triggered...
    gen.memory.heap[releaseAccum.inputs[0].inputs[1].memory.value.idx] = 0;
  };

  return out;
};
},{"./accum.js":2,"./add.js":5,"./bang.js":11,"./data.js":18,"./div.js":23,"./env.js":24,"./gen.js":30,"./gtp.js":33,"./ifelseif.js":35,"./lt.js":38,"./mul.js":48,"./not.js":51,"./param.js":53,"./peek.js":54,"./sub.js":65}],7:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'and',

  gen: function gen() {
    var inputs = _gen.getInputs(this),
        out = void 0;

    out = '  var ' + this.name + ' = (' + inputs[0] + ' !== 0 && ' + inputs[1] + ' !== 0) | 0\n\n';

    _gen.memo[this.name] = '' + this.name;

    return ['' + this.name, out];
  }
};

module.exports = function (in1, in2) {
  var ugen = Object.create(proto);
  Object.assign(ugen, {
    uid: _gen.getUID(),
    inputs: [in1, in2]
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./gen.js":30}],8:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'asin',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add({ 'asin': Math.asin });

      out = 'gen.asin( ' + inputs[0] + ' )';
    } else {
      out = Math.asin(parseFloat(inputs[0]));
    }

    return out;
  }
};

module.exports = function (x) {
  var asin = Object.create(proto);

  asin.inputs = [x];
  asin.id = _gen.getUID();
  asin.name = asin.basename + '{asin.id}';

  return asin;
};
},{"./gen.js":30}],9:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'atan',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add({ 'atan': Math.atan });

      out = 'gen.atan( ' + inputs[0] + ' )';
    } else {
      out = Math.atan(parseFloat(inputs[0]));
    }

    return out;
  }
};

module.exports = function (x) {
  var atan = Object.create(proto);

  atan.inputs = [x];
  atan.id = _gen.getUID();
  atan.name = atan.basename + '{atan.id}';

  return atan;
};
},{"./gen.js":30}],10:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    history = require('./history.js'),
    mul = require('./mul.js'),
    sub = require('./sub.js');

module.exports = function () {
    var decayTime = arguments.length <= 0 || arguments[0] === undefined ? 44100 : arguments[0];

    var ssd = history(1),
        t60 = Math.exp(-6.907755278921 / decayTime);

    ssd.in(mul(ssd.out, t60));

    ssd.out.trigger = function () {
        ssd.value = 1;
    };

    return sub(1, ssd.out);
};
},{"./gen.js":30,"./history.js":34,"./mul.js":48,"./sub.js":65}],11:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  gen: function gen() {
    _gen.requestMemory(this.memory);

    var out = '  var ' + this.name + ' = memory[' + this.memory.value.idx + ']\n  if( ' + this.name + ' === 1 ) memory[' + this.memory.value.idx + '] = 0      \n      \n';
    _gen.memo[this.name] = this.name;

    return [this.name, out];
  }
};

module.exports = function (_props) {
  var ugen = Object.create(proto),
      props = Object.assign({}, { min: 0, max: 1 }, _props);

  ugen.name = 'bang' + _gen.getUID();

  ugen.min = props.min;
  ugen.max = props.max;

  ugen.trigger = function () {
    _gen.memory.heap[ugen.memory.value.idx] = ugen.max;
  };

  ugen.memory = {
    value: { length: 1, idx: null }
  };

  return ugen;
};
},{"./gen.js":30}],12:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'bool',

  gen: function gen() {
    var inputs = _gen.getInputs(this),
        out = void 0;

    out = inputs[0] + ' === 0 ? 0 : 1';

    //gen.memo[ this.name ] = `gen.data.${this.name}`

    //return [ `gen.data.${this.name}`, ' ' +out ]
    return out;
  }
};

module.exports = function (in1) {
  var ugen = Object.create(proto);

  Object.assign(ugen, {
    uid: _gen.getUID(),
    inputs: [in1]
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./gen.js":30}],13:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js');

var proto = {
  name: 'ceil',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add(_defineProperty({}, this.name, Math.ceil));

      out = 'gen.ceil( ' + inputs[0] + ' )';
    } else {
      out = Math.ceil(parseFloat(inputs[0]));
    }

    return out;
  }
};

module.exports = function (x) {
  var ceil = Object.create(proto);

  ceil.inputs = [x];

  return ceil;
};
},{"./gen.js":30}],14:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js'),
    floor = require('./floor.js'),
    sub = require('./sub.js'),
    memo = require('./memo.js');

var proto = {
  basename: 'clip',

  gen: function gen() {
    var code = void 0,
        inputs = _gen.getInputs(this),
        out = void 0;

    out = ' var ' + this.name + ' = ' + inputs[0] + '\n  if( ' + this.name + ' > ' + inputs[2] + ' ) ' + this.name + ' = ' + inputs[2] + '\n  else if( ' + this.name + ' < ' + inputs[1] + ' ) ' + this.name + ' = ' + inputs[1] + '\n';
    out = ' ' + out;

    _gen.memo[this.name] = this.name;

    return [this.name, out];
  }
};

module.exports = function (in1) {
  var min = arguments.length <= 1 || arguments[1] === undefined ? -1 : arguments[1];
  var max = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  var ugen = Object.create(proto);

  Object.assign(ugen, {
    min: min,
    max: max,
    uid: _gen.getUID(),
    inputs: [in1, min, max]
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./floor.js":27,"./gen.js":30,"./memo.js":42,"./sub.js":65}],15:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'cos',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add({ 'cos': Math.cos });

      out = 'gen.cos( ' + inputs[0] + ' )';
    } else {
      out = Math.cos(parseFloat(inputs[0]));
    }

    return out;
  }
};

module.exports = function (x) {
  var cos = Object.create(proto);

  cos.inputs = [x];
  cos.id = _gen.getUID();
  cos.name = cos.basename + '{cos.id}';

  return cos;
};
},{"./gen.js":30}],16:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js');

var proto = {
  basename: 'counter',

  gen: function gen() {
    var code = void 0,
        inputs = _gen.getInputs(this),
        genName = 'gen.' + this.name,
        functionBody = void 0;

    if (this.memory.value.idx === null) _gen.requestMemory(this.memory);
    functionBody = this.callback(genName, inputs[0], inputs[1], inputs[2], inputs[3], inputs[4], 'memory[' + this.memory.value.idx + ']', 'memory[' + this.memory.wrap.idx + ']');

    _gen.closures.add(_defineProperty({}, this.name, this));

    _gen.memo[this.name] = this.name + '_value';

    if (_gen.memo[this.wrap.name] === undefined) this.wrap.gen();

    return [this.name + '_value', functionBody];
  },
  callback: function callback(_name, _incr, _min, _max, _reset, loops, valueRef, wrapRef) {
    var diff = this.max - this.min,
        out = '',
        wrap = '';
    // must check for reset before storing value for output
    if (!(typeof this.inputs[3] === 'number' && this.inputs[3] < 1)) {
      out += '  if( ' + _reset + ' >= 1 ) ' + valueRef + ' = ' + _min + '\n';
    }

    out += '  var ' + this.name + '_value = ' + valueRef + ';\n  ' + valueRef + ' += ' + _incr + '\n'; // store output value before accumulating 

    if (typeof this.max === 'number' && this.max !== Infinity && typeof this.min !== 'number') {
      wrap = '  if( ' + valueRef + ' >= ' + this.max + ' &&  ' + loops + ' > 0) {\n    ' + valueRef + ' -= ' + diff + '\n    ' + wrapRef + ' = 1\n  }else{\n    ' + wrapRef + ' = 0\n  }\n';
    } else if (this.max !== Infinity && this.min !== Infinity) {
      wrap = '  if( ' + valueRef + ' >= ' + _max + ' &&  ' + loops + ' > 0) {\n    ' + valueRef + ' -= ' + _max + ' - ' + _min + '\n    ' + wrapRef + ' = 1\n  }else if( ' + valueRef + ' < ' + _min + ' &&  ' + loops + ' > 0) {\n    ' + valueRef + ' += ' + _max + ' - ' + _min + '\n    ' + wrapRef + ' = 1\n  }else{\n    ' + wrapRef + ' = 0\n  }\n';
    } else {
      out += '\n';
    }

    out = out + wrap;

    return out;
  }
};

module.exports = function () {
  var incr = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
  var min = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var max = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];
  var reset = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
  var loops = arguments.length <= 4 || arguments[4] === undefined ? 1 : arguments[4];
  var properties = arguments[5];

  var ugen = Object.create(proto),
      defaults = { initialValue: 0, shouldWrap: true };

  if (properties !== undefined) Object.assign(defaults, properties);

  Object.assign(ugen, {
    min: min,
    max: max,
    value: defaults.initialValue,
    uid: _gen.getUID(),
    inputs: [incr, min, max, reset, loops],
    memory: {
      value: { length: 1, idx: null },
      wrap: { length: 1, idx: null }
    },
    wrap: {
      gen: function gen() {
        if (ugen.memory.wrap.idx === null) {
          _gen.requestMemory(ugen.memory);
        }
        _gen.getInputs(this);
        _gen.memo[this.name] = 'memory[ ' + ugen.memory.wrap.idx + ' ]';
        return 'memory[ ' + ugen.memory.wrap.idx + ' ]';
      }
    }
  }, defaults);

  Object.defineProperty(ugen, 'value', {
    get: function get() {
      if (this.memory.value.idx !== null) {
        return _gen.memory.heap[this.memory.value.idx];
      }
    },
    set: function set(v) {
      if (this.memory.value.idx !== null) {
        _gen.memory.heap[this.memory.value.idx] = v;
      }
    }
  });

  ugen.wrap.inputs = [ugen];
  ugen.name = '' + ugen.basename + ugen.uid;
  ugen.wrap.name = ugen.name + '_wrap';
  return ugen;
};
},{"./gen.js":30}],17:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    accum = require('./phasor.js'),
    data = require('./data.js'),
    peek = require('./peek.js'),
    mul = require('./mul.js'),
    phasor = require('./phasor.js');

var proto = {
  basename: 'cycle',

  initTable: function initTable() {
    var buffer = new Float32Array(1024);

    for (var i = 0, l = buffer.length; i < l; i++) {
      buffer[i] = Math.sin(i / l * (Math.PI * 2));
    }

    gen.globals.cycle = data(buffer, 1, { immutable: true });
  }
};

module.exports = function () {
  var frequency = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
  var reset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var _props = arguments[2];

  if (typeof gen.globals.cycle === 'undefined') proto.initTable();
  var props = Object.assign({}, { min: 0 }, _props);

  var ugen = peek(gen.globals.cycle, phasor(frequency, reset, props));
  ugen.name = 'cycle' + gen.getUID();

  return ugen;
};
},{"./data.js":18,"./gen.js":30,"./mul.js":48,"./peek.js":54,"./phasor.js":55}],18:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js'),
    utilities = require('./utilities.js'),
    peek = require('./peek.js'),
    poke = require('./poke.js');

var proto = {
  basename: 'data',
  globals: {},

  gen: function gen() {
    var idx = void 0;
    if (_gen.memo[this.name] === undefined) {
      var ugen = this;
      _gen.requestMemory(this.memory, this.immutable);
      idx = this.memory.values.idx;
      try {
        _gen.memory.heap.set(this.buffer, idx);
      } catch (e) {
        console.log(e);
        throw Error('error with request. asking for ' + this.buffer.length + '. current index: ' + _gen.memoryIndex + ' of ' + _gen.memory.heap.length);
      }
      //gen.data[ this.name ] = this
      //return 'gen.memory' + this.name + '.buffer'
      _gen.memo[this.name] = idx;
    } else {
      idx = _gen.memo[this.name];
    }
    return idx;
  }
};

module.exports = function (x) {
  var y = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  var properties = arguments[2];

  var ugen = void 0,
      buffer = void 0,
      shouldLoad = false;

  if (properties !== undefined && properties.global !== undefined) {
    if (_gen.globals[properties.global]) {
      return _gen.globals[properties.global];
    }
  }

  if (typeof x === 'number') {
    if (y !== 1) {
      buffer = [];
      for (var i = 0; i < y; i++) {
        buffer[i] = new Float32Array(x);
      }
    } else {
      buffer = new Float32Array(x);
    }
  } else if (Array.isArray(x)) {
    //! (x instanceof Float32Array ) ) {
    var size = x.length;
    buffer = new Float32Array(size);
    for (var _i = 0; _i < x.length; _i++) {
      buffer[_i] = x[_i];
    }
  } else if (typeof x === 'string') {
    buffer = { length: y > 1 ? y : _gen.samplerate * 60 }; // XXX what???
    shouldLoad = true;
  } else if (x instanceof Float32Array) {
    buffer = x;
  }

  ugen = {
    buffer: buffer,
    name: proto.basename + _gen.getUID(),
    dim: buffer.length, // XXX how do we dynamically allocate this?
    channels: 1,
    gen: proto.gen,
    onload: null,
    then: function then(fnc) {
      ugen.onload = fnc;
      return ugen;
    },

    immutable: properties !== undefined && properties.immutable === true ? true : false,
    load: function load(filename) {
      var promise = utilities.loadSample(filename, ugen);
      promise.then(function (_buffer) {
        ugen.memory.values.length = ugen.dim = _buffer.length;
        ugen.onload();
      });
    }
  };

  ugen.memory = {
    values: { length: ugen.dim, idx: null }
  };

  _gen.name = 'data' + _gen.getUID();

  if (shouldLoad) ugen.load(x);

  if (properties !== undefined) {
    if (properties.global !== undefined) {
      _gen.globals[properties.global] = ugen;
    }
    if (properties.meta === true) {
      var _loop = function _loop(length, _i2) {
        Object.defineProperty(ugen, _i2, {
          get: function get() {
            return peek(ugen, _i2, { mode: 'simple', interp: 'none' });
          },
          set: function set(v) {
            return poke(ugen, v, _i2);
          }
        });
      };

      for (var _i2 = 0, length = ugen.buffer.length; _i2 < length; _i2++) {
        _loop(length, _i2);
      }
    }
  }

  return ugen;
};
},{"./gen.js":30,"./peek.js":54,"./poke.js":56,"./utilities.js":71}],19:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    history = require('./history.js'),
    sub = require('./sub.js'),
    add = require('./add.js'),
    mul = require('./mul.js'),
    memo = require('./memo.js');

module.exports = function (in1) {
    var x1 = history(),
        y1 = history(),
        filter = void 0;

    //History x1, y1; y = in1 - x1 + y1*0.9997; x1 = in1; y1 = y; out1 = y;
    filter = memo(add(sub(in1, x1.out), mul(y1.out, .9997)));
    x1.in(in1);
    y1.in(filter);

    return filter;
};
},{"./add.js":5,"./gen.js":30,"./history.js":34,"./memo.js":42,"./mul.js":48,"./sub.js":65}],20:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    history = require('./history.js'),
    mul = require('./mul.js'),
    t60 = require('./t60.js');

module.exports = function () {
    var decayTime = arguments.length <= 0 || arguments[0] === undefined ? 44100 : arguments[0];
    var props = arguments[1];

    var properties = Object.assign({}, { initValue: 1 }, props),
        ssd = history(properties.initValue);

    ssd.in(mul(ssd.out, t60(decayTime)));

    ssd.out.trigger = function () {
        ssd.value = 1;
    };

    return ssd.out;
};
},{"./gen.js":30,"./history.js":34,"./mul.js":48,"./t60.js":67}],21:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _gen = require('./gen.js'),
    data = require('./data.js'),
    poke = require('./poke.js'),
    peek = require('./peek.js'),
    sub = require('./sub.js'),
    wrap = require('./wrap.js'),
    accum = require('./accum.js');

var proto = {
  basename: 'delay',

  gen: function gen() {
    var inputs = _gen.getInputs(this);

    _gen.memo[this.name] = inputs[0];

    return inputs[0];
  }
};

var defaults = { size: 512, feedback: 0, interp: 'none' };

module.exports = function (in1, taps, properties) {
  var ugen = Object.create(proto),
      writeIdx = void 0,
      readIdx = void 0,
      delaydata = void 0;

  if (Array.isArray(taps) === false) taps = [taps];

  var props = Object.assign({}, defaults, properties);

  if (props.size < Math.max.apply(Math, _toConsumableArray(taps))) props.size = Math.max.apply(Math, _toConsumableArray(taps));

  delaydata = data(props.size);

  ugen.inputs = [];

  writeIdx = accum(1, 0, { max: props.size });

  for (var i = 0; i < taps.length; i++) {
    ugen.inputs[i] = peek(delaydata, wrap(sub(writeIdx, taps[i]), 0, props.size), { mode: 'samples', interp: props.interp });
  }

  ugen.outputs = ugen.inputs; // ugn, Ugh, UGH! but i guess it works.

  poke(delaydata, in1, writeIdx);

  ugen.name = '' + ugen.basename + _gen.getUID();

  return ugen;
};
},{"./accum.js":2,"./data.js":18,"./gen.js":30,"./peek.js":54,"./poke.js":56,"./sub.js":65,"./wrap.js":73}],22:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    history = require('./history.js'),
    sub = require('./sub.js');

module.exports = function (in1) {
  var n1 = history();

  n1.in(in1);

  var ugen = sub(in1, n1.out);
  ugen.name = 'delta' + gen.getUID();

  return ugen;
};
},{"./gen.js":30,"./history.js":34,"./sub.js":65}],23:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'div',
  gen: function gen() {
    var inputs = _gen.getInputs(this),
        out = '  var ' + this.name + ' = ',
        diff = 0,
        numCount = 0,
        lastNumber = inputs[0],
        lastNumberIsUgen = isNaN(lastNumber),
        divAtEnd = false;

    inputs.forEach(function (v, i) {
      if (i === 0) return;

      var isNumberUgen = isNaN(v),
          isFinalIdx = i === inputs.length - 1;

      if (!lastNumberIsUgen && !isNumberUgen) {
        lastNumber = lastNumber / v;
        out += lastNumber;
      } else {
        out += lastNumber + ' / ' + v;
      }

      if (!isFinalIdx) out += ' / ';
    });

    out += '\n';

    _gen.memo[this.name] = this.name;

    return [this.name, out];
  }
};

module.exports = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var div = Object.create(proto);

  Object.assign(div, {
    id: _gen.getUID(),
    inputs: args
  });

  div.name = div.basename + div.id;

  return div;
};
},{"./gen.js":30}],24:[function(require,module,exports){
'use strict';

var gen = require('./gen'),
    windows = require('./windows'),
    data = require('./data'),
    peek = require('./peek'),
    phasor = require('./phasor'),
    defaults = {
  type: 'triangular', length: 1024, alpha: .15, shift: 0, reverse: false
};

module.exports = function (props) {

  var properties = Object.assign({}, defaults, props);
  var buffer = new Float32Array(properties.length);

  var name = properties.type + '_' + properties.length + '_' + properties.shift + '_' + properties.reverse;
  if (typeof gen.globals.windows[name] === 'undefined') {

    for (var i = 0; i < properties.length; i++) {
      buffer[i] = windows[properties.type](properties.length, i, properties.alpha, properties.shift);
    }

    if (properties.reverse === true) {
      buffer.reverse();
    }
    gen.globals.windows[name] = data(buffer);
  }

  var ugen = gen.globals.windows[name];
  ugen.name = 'env' + gen.getUID();

  return ugen;
};
},{"./data":18,"./gen":30,"./peek":54,"./phasor":55,"./windows":72}],25:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'eq',

  gen: function gen() {
    var inputs = _gen.getInputs(this),
        out = void 0;

    out = this.inputs[0] === this.inputs[1] ? 1 : '  var ' + this.name + ' = (' + inputs[0] + ' === ' + inputs[1] + ') | 0\n\n';

    _gen.memo[this.name] = '' + this.name;

    return ['' + this.name, out];
  }
};

module.exports = function (in1, in2) {
  var ugen = Object.create(proto);
  Object.assign(ugen, {
    uid: _gen.getUID(),
    inputs: [in1, in2]
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./gen.js":30}],26:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js');

var proto = {
  name: 'exp',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add(_defineProperty({}, this.name, Math.exp));

      out = 'gen.exp( ' + inputs[0] + ' )';
    } else {
      out = Math.exp(parseFloat(inputs[0]));
    }

    return out;
  }
};

module.exports = function (x) {
  var exp = Object.create(proto);

  exp.inputs = [x];

  return exp;
};
},{"./gen.js":30}],27:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  name: 'floor',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      //gen.closures.add({ [ this.name ]: Math.floor })

      out = '( ' + inputs[0] + ' | 0 )';
    } else {
      out = inputs[0] | 0;
    }

    return out;
  }
};

module.exports = function (x) {
  var floor = Object.create(proto);

  floor.inputs = [x];

  return floor;
};
},{"./gen.js":30}],28:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'fold',

  gen: function gen() {
    var code = void 0,
        inputs = _gen.getInputs(this),
        out = void 0;

    out = this.createCallback(inputs[0], this.min, this.max);

    _gen.memo[this.name] = this.name + '_value';

    return [this.name + '_value', out];
  },
  createCallback: function createCallback(v, lo, hi) {
    var out = ' var ' + this.name + '_value = ' + v + ',\n      ' + this.name + '_range = ' + hi + ' - ' + lo + ',\n      ' + this.name + '_numWraps = 0\n\n  if(' + this.name + '_value >= ' + hi + '){\n    ' + this.name + '_value -= ' + this.name + '_range\n    if(' + this.name + '_value >= ' + hi + '){\n      ' + this.name + '_numWraps = ((' + this.name + '_value - ' + lo + ') / ' + this.name + '_range) | 0\n      ' + this.name + '_value -= ' + this.name + '_range * ' + this.name + '_numWraps\n    }\n    ' + this.name + '_numWraps++\n  } else if(' + this.name + '_value < ' + lo + '){\n    ' + this.name + '_value += ' + this.name + '_range\n    if(' + this.name + '_value < ' + lo + '){\n      ' + this.name + '_numWraps = ((' + this.name + '_value - ' + lo + ') / ' + this.name + '_range- 1) | 0\n      ' + this.name + '_value -= ' + this.name + '_range * ' + this.name + '_numWraps\n    }\n    ' + this.name + '_numWraps--\n  }\n  if(' + this.name + '_numWraps & 1) ' + this.name + '_value = ' + hi + ' + ' + lo + ' - ' + this.name + '_value\n';
    return ' ' + out;
  }
};

module.exports = function (in1) {
  var min = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var max = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  var ugen = Object.create(proto);

  Object.assign(ugen, {
    min: min,
    max: max,
    uid: _gen.getUID(),
    inputs: [in1]
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./gen.js":30}],29:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _gen = require('./gen.js');

var proto = {
  basename: 'gate',
  controlString: null, // insert into output codegen for determining indexing
  gen: function gen() {
    var inputs = _gen.getInputs(this),
        out = void 0;

    _gen.requestMemory(this.memory);

    var lastInputMemoryIdx = 'memory[ ' + this.memory.lastInput.idx + ' ]',
        outputMemoryStartIdx = this.memory.lastInput.idx + 1,
        inputSignal = inputs[0],
        controlSignal = inputs[1];

    /* 
     * we check to see if the current control inputs equals our last input
     * if so, we store the signal input in the memory associated with the currently
     * selected index. If not, we put 0 in the memory associated with the last selected index,
     * change the selected index, and then store the signal in put in the memery assoicated
     * with the newly selected index
     */

    out = ' if( ' + controlSignal + ' !== ' + lastInputMemoryIdx + ' ) {\n    memory[ ' + lastInputMemoryIdx + ' + ' + outputMemoryStartIdx + '  ] = 0 \n    ' + lastInputMemoryIdx + ' = ' + controlSignal + '\n  }\n  memory[ ' + outputMemoryStartIdx + ' + ' + controlSignal + ' ] = ' + inputSignal + '\n\n';
    this.controlString = inputs[1];
    this.initialized = true;

    _gen.memo[this.name] = this.name;

    this.outputs.forEach(function (v) {
      return v.gen();
    });

    return [null, ' ' + out];
  },
  childgen: function childgen() {
    if (this.parent.initialized === false) {
      _gen.getInputs(this); // parent gate is only input of a gate output, should only be gen'd once.
    }

    if (_gen.memo[this.name] === undefined) {
      _gen.requestMemory(this.memory);

      _gen.memo[this.name] = 'memory[ ' + this.memory.value.idx + ' ]';
    }

    return 'memory[ ' + this.memory.value.idx + ' ]';
  }
};

module.exports = function (control, in1, properties) {
  var ugen = Object.create(proto),
      defaults = { count: 2 };

  if ((typeof properties === 'undefined' ? 'undefined' : _typeof(properties)) !== undefined) Object.assign(defaults, properties);

  Object.assign(ugen, {
    outputs: [],
    uid: _gen.getUID(),
    inputs: [in1, control],
    memory: {
      lastInput: { length: 1, idx: null }
    },
    initialized: false
  }, defaults);

  ugen.name = '' + ugen.basename + _gen.getUID();

  for (var i = 0; i < ugen.count; i++) {
    ugen.outputs.push({
      index: i,
      gen: proto.childgen,
      parent: ugen,
      inputs: [ugen],
      memory: {
        value: { length: 1, idx: null }
      },
      initialized: false,
      name: ugen.name + '_out' + _gen.getUID()
    });
  }

  return ugen;
};
},{"./gen.js":30}],30:[function(require,module,exports){
'use strict';

/* gen.js
 *
 * low-level code generation for unit generators
 *
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var MemoryHelper = require('memory-helper');

var gen = {

  accum: 0,
  getUID: function getUID() {
    return this.accum++;
  },

  debug: false,
  samplerate: 44100, // change on audiocontext creation
  shouldLocalize: false,
  globals: {
    windows: {}
  },

  /* closures
   *
   * Functions that are included as arguments to master callback. Examples: Math.abs, Math.random etc.
   * XXX Should probably be renamed callbackProperties or something similar... closures are no longer used.
   */

  closures: new Set(),
  params: new Set(),

  parameters: [],
  endBlock: new Set(),
  histories: new Map(),

  memo: {},

  data: {},

  /* export
   *
   * place gen functions into another object for easier reference
   */

  export: function _export(obj) {},
  addToEndBlock: function addToEndBlock(v) {
    this.endBlock.add('  ' + v);
  },
  requestMemory: function requestMemory(memorySpec) {
    var immutable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    for (var key in memorySpec) {
      var request = memorySpec[key];

      request.idx = gen.memory.alloc(request.length, immutable);
    }
  },


  /* createCallback
   *
   * param ugen - Head of graph to be codegen'd
   *
   * Generate callback function for a particular ugen graph.
   * The gen.closures property stores functions that need to be
   * passed as arguments to the final function; these are prefixed
   * before any defined params the graph exposes. For example, given:
   *
   * gen.createCallback( abs( param() ) )
   *
   * ... the generated function will have a signature of ( abs, p0 ).
   */

  createCallback: function createCallback(ugen, mem) {
    var debug = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    var shouldInlineMemory = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    var isStereo = Array.isArray(ugen) && ugen.length > 1,
        callback = void 0,
        channel1 = void 0,
        channel2 = void 0;

    if (typeof mem === 'number' || mem === undefined) {
      mem = MemoryHelper.create(mem);
    }

    //console.log( 'cb memory:', mem )
    this.memory = mem;
    this.memo = {};
    this.endBlock.clear();
    this.closures.clear();
    this.params.clear();
    //this.globals = { windows:{} }

    this.parameters.length = 0;

    this.functionBody = "  'use strict'\n";
    if (shouldInlineMemory === false) this.functionBody += "  var memory = gen.memory\n\n";

    // call .gen() on the head of the graph we are generating the callback for
    //console.log( 'HEAD', ugen )
    for (var i = 0; i < 1 + isStereo; i++) {
      if (typeof ugen[i] === 'number') continue;

      //let channel = isStereo ? ugen[i].gen() : ugen.gen(),
      var channel = isStereo ? this.getInput(ugen[i]) : this.getInput(ugen),
          body = '';

      // if .gen() returns array, add ugen callback (graphOutput[1]) to our output functions body
      // and then return name of ugen. If .gen() only generates a number (for really simple graphs)
      // just return that number (graphOutput[0]).
      body += Array.isArray(channel) ? channel[1] + '\n' + channel[0] : channel;

      // split body to inject return keyword on last line
      body = body.split('\n');

      //if( debug ) console.log( 'functionBody length', body )

      // next line is to accommodate memo as graph head
      if (body[body.length - 1].trim().indexOf('let') > -1) {
        body.push('\n');
      }

      // get index of last line
      var lastidx = body.length - 1;

      // insert return keyword
      body[lastidx] = '  gen.out[' + i + ']  = ' + body[lastidx] + '\n';

      this.functionBody += body.join('\n');
    }

    this.histories.forEach(function (value) {
      if (value !== null) value.gen();
    });

    var returnStatement = isStereo ? '  return gen.out' : '  return gen.out[0]';

    this.functionBody = this.functionBody.split('\n');

    if (this.endBlock.size) {
      this.functionBody = this.functionBody.concat(Array.from(this.endBlock));
      this.functionBody.push(returnStatement);
    } else {
      this.functionBody.push(returnStatement);
    }
    // reassemble function body
    this.functionBody = this.functionBody.join('\n');

    // we can only dynamically create a named function by dynamically creating another function
    // to construct the named function! sheesh...
    //
    if (shouldInlineMemory === true) {
      this.parameters.push('memory');
    }
    var buildString = 'return function gen( ' + this.parameters.join(',') + ' ){ \n' + this.functionBody + '\n}';

    if (this.debug || debug) console.log(buildString);

    callback = new Function(buildString)();

    // assign properties to named function
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.closures.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var dict = _step.value;

        var name = Object.keys(dict)[0],
            value = dict[name];

        callback[name] = value;
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

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      var _loop = function _loop() {
        var dict = _step2.value;

        var name = Object.keys(dict)[0],
            ugen = dict[name];

        Object.defineProperty(callback, name, {
          configurable: true,
          get: function get() {
            return ugen.value;
          },
          set: function set(v) {
            ugen.value = v;
          }
        });
        //callback[ name ] = value
      };

      for (var _iterator2 = this.params.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    callback.data = this.data;
    callback.out = new Float32Array(2);
    callback.parameters = this.parameters.slice(0);

    //if( MemoryHelper.isPrototypeOf( this.memory ) )
    callback.memory = this.memory.heap;

    this.histories.clear();

    return callback;
  },


  /* getInputs
   *
   * Called by each individual ugen when their .gen() method is called to resolve their various inputs.
   * If an input is a number, return the number. If
   * it is an ugen, call .gen() on the ugen, memoize the result and return the result. If the
   * ugen has previously been memoized return the memoized value.
   *
   */
  getInputs: function getInputs(ugen) {
    return ugen.inputs.map(gen.getInput);
  },
  getInput: function getInput(input) {
    var isObject = (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object',
        processedInput = void 0;

    if (isObject) {
      // if input is a ugen...
      //console.log( input.name, gen.memo[ input.name ] )
      if (gen.memo[input.name]) {
        // if it has been memoized...
        processedInput = gen.memo[input.name];
      } else if (Array.isArray(input)) {
        gen.getInput(input[0]);
        gen.getInput(input[1]);
      } else {
        // if not memoized generate code 
        if (typeof input.gen !== 'function') {
          console.log('no gen found:', input, input.gen);
        }
        var code = input.gen();
        //if( code.indexOf( 'Object' ) > -1 ) console.log( 'bad input:', input, code )

        if (Array.isArray(code)) {
          if (!gen.shouldLocalize) {
            gen.functionBody += code[1];
          } else {
            gen.codeName = code[0];
            gen.localizedCode.push(code[1]);
          }
          //console.log( 'after GEN' , this.functionBody )
          processedInput = code[0];
        } else {
          processedInput = code;
        }
      }
    } else {
      // it input is a number
      processedInput = input;
    }

    return processedInput;
  },
  startLocalize: function startLocalize() {
    this.localizedCode = [];
    this.shouldLocalize = true;
  },
  endLocalize: function endLocalize() {
    this.shouldLocalize = false;

    return [this.codeName, this.localizedCode.slice(0)];
  },
  free: function free(graph) {
    if (Array.isArray(graph)) {
      // stereo ugen
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = graph[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var channel = _step3.value;

          this.free(channel);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    } else {
      if ((typeof graph === 'undefined' ? 'undefined' : _typeof(graph)) === 'object') {
        if (graph.memory !== undefined) {
          for (var memoryKey in graph.memory) {
            this.memory.free(graph.memory[memoryKey].idx);
          }
        }
        if (Array.isArray(graph.inputs)) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = graph.inputs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var ugen = _step4.value;

              this.free(ugen);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
      }
    }
  }
};

module.exports = gen;
},{"memory-helper":74}],31:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  name: 'gt',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    out = '  var ' + this.name + ' = ';

    if (isNaN(this.inputs[0]) || isNaN(this.inputs[1])) {
      out += '(( ' + inputs[0] + ' > ' + inputs[1] + ') | 0 )';
    } else {
      out += inputs[0] > inputs[1] ? 1 : 0;
    }
    out += '\n\n';

    _gen.memo[this.name] = this.name;

    return [this.name, out];
  }
};

module.exports = function (x, y) {
  var gt = Object.create(proto);

  gt.inputs = [x, y];
  gt.name = 'gt' + _gen.getUID();

  return gt;
};
},{"./gen.js":30}],32:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  name: 'gte',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    out = '  var ' + this.name + ' = ';

    if (isNaN(this.inputs[0]) || isNaN(this.inputs[1])) {
      out += '( ' + inputs[0] + ' >= ' + inputs[1] + ' | 0 )';
    } else {
      out += inputs[0] >= inputs[1] ? 1 : 0;
    }
    out += '\n\n';

    _gen.memo[this.name] = this.name;

    return [this.name, out];
  }
};

module.exports = function (x, y) {
  var gt = Object.create(proto);

  gt.inputs = [x, y];
  gt.name = 'gte' + _gen.getUID();

  return gt;
};
},{"./gen.js":30}],33:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  name: 'gtp',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(this.inputs[0]) || isNaN(this.inputs[1])) {
      out = '(' + inputs[0] + ' * ( ( ' + inputs[0] + ' > ' + inputs[1] + ' ) | 0 ) )';
    } else {
      out = inputs[0] * (inputs[0] > inputs[1] | 0);
    }

    return out;
  }
};

module.exports = function (x, y) {
  var gtp = Object.create(proto);

  gtp.inputs = [x, y];

  return gtp;
};
},{"./gen.js":30}],34:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

module.exports = function () {
  var in1 = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

  var ugen = {
    inputs: [in1],
    memory: { value: { length: 1, idx: null } },
    recorder: null,

    in: function _in(v) {
      if (_gen.histories.has(v)) {
        var memoHistory = _gen.histories.get(v);
        ugen.name = memoHistory.name;
        return memoHistory;
      }

      var obj = {
        gen: function gen() {
          var inputs = _gen.getInputs(ugen);

          if (ugen.memory.value.idx === null) {
            _gen.requestMemory(ugen.memory);
            _gen.memory.heap[ugen.memory.value.idx] = in1;
          }

          var idx = ugen.memory.value.idx;

          _gen.addToEndBlock('memory[ ' + idx + ' ] = ' + inputs[0]);

          // return ugen that is being recorded instead of ssd.
          // this effectively makes a call to ssd.record() transparent to the graph.
          // recording is triggered by prior call to gen.addToEndBlock.
          _gen.histories.set(v, obj);

          return inputs[0];
        },

        name: ugen.name + '_in' + _gen.getUID(),
        memory: ugen.memory
      };

      this.inputs[0] = v;

      ugen.recorder = obj;

      return obj;
    },


    out: {
      gen: function gen() {
        if (ugen.memory.value.idx === null) {
          if (_gen.histories.get(ugen.inputs[0]) === undefined) {
            _gen.histories.set(ugen.inputs[0], ugen.recorder);
          }
          _gen.requestMemory(ugen.memory);
          _gen.memory.heap[ugen.memory.value.idx] = parseFloat(in1);
        }
        var idx = ugen.memory.value.idx;

        return 'memory[ ' + idx + ' ] ';
      }
    },

    uid: _gen.getUID()
  };

  ugen.out.memory = ugen.memory;

  ugen.name = 'history' + ugen.uid;
  ugen.out.name = ugen.name + '_out';
  ugen.in._name = ugen.name = '_in';

  Object.defineProperty(ugen, 'value', {
    get: function get() {
      if (this.memory.value.idx !== null) {
        return _gen.memory.heap[this.memory.value.idx];
      }
    },
    set: function set(v) {
      if (this.memory.value.idx !== null) {
        _gen.memory.heap[this.memory.value.idx] = v;
      }
    }
  });

  return ugen;
};
},{"./gen.js":30}],35:[function(require,module,exports){
/*

 a = conditional( condition, trueBlock, falseBlock )
 b = conditional([
   condition1, block1,
   condition2, block2,
   condition3, block3,
   defaultBlock
 ])

*/
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'ifelse',

  gen: function gen() {
    var conditionals = this.inputs[0],
        defaultValue = _gen.getInput(conditionals[conditionals.length - 1]),
        out = '  var ' + this.name + '_out = ' + defaultValue + '\n';

    //console.log( 'defaultValue:', defaultValue )

    for (var i = 0; i < conditionals.length - 2; i += 2) {
      var isEndBlock = i === conditionals.length - 3,
          cond = _gen.getInput(conditionals[i]),
          preblock = conditionals[i + 1],
          block = void 0,
          blockName = void 0,
          output = void 0;

      //console.log( 'pb', preblock )

      if (typeof preblock === 'number') {
        block = preblock;
        blockName = null;
      } else {
        if (_gen.memo[preblock.name] === undefined) {
          // used to place all code dependencies in appropriate blocks
          _gen.startLocalize();

          _gen.getInput(preblock);

          block = _gen.endLocalize();
          blockName = block[0];
          block = block[1].join('');
          block = '  ' + block.replace(/\n/gi, '\n  ');
        } else {
          block = '';
          blockName = _gen.memo[preblock.name];
        }
      }

      output = blockName === null ? '  ' + this.name + '_out = ' + block : block + '  ' + this.name + '_out = ' + blockName;

      if (i === 0) out += ' ';
      out += ' if( ' + cond + ' === 1 ) {\n' + output + '\n  }';

      if (!isEndBlock) {
        out += ' else';
      } else {
        out += '\n';
      }
      /*         
       else`
            }else if( isEndBlock ) {
              out += `{\n  ${output}\n  }\n`
            }else {
      
              //if( i + 2 === conditionals.length || i === conditionals.length - 1 ) {
              //  out += `{\n  ${output}\n  }\n`
              //}else{
                out += 
      ` if( ${cond} === 1 ) {
      ${output}
        } else `
              //}
            }*/
    }

    _gen.memo[this.name] = this.name + '_out';

    return [this.name + '_out', out];
  }
};

module.exports = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var ugen = Object.create(proto),
      conditions = Array.isArray(args[0]) ? args[0] : args;

  Object.assign(ugen, {
    uid: _gen.getUID(),
    inputs: [conditions]
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./gen.js":30}],36:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'in',

  gen: function gen() {
    _gen.parameters.push(this.name);

    _gen.memo[this.name] = this.name;

    return this.name;
  }
};

module.exports = function (name) {
  var input = Object.create(proto);

  input.id = _gen.getUID();
  input.name = name !== undefined ? name : '' + input.basename + input.id;
  input[0] = {
    gen: function gen() {
      if (!_gen.parameters.includes(input.name)) _gen.parameters.push(input.name);
      return input.name + '[0]';
    }
  };
  input[1] = {
    gen: function gen() {
      if (!_gen.parameters.includes(input.name)) _gen.parameters.push(input.name);
      return input.name + '[1]';
    }
  };

  return input;
};
},{"./gen.js":30}],37:[function(require,module,exports){
'use strict';

var library = {
  export: function _export(destination) {
    if (destination === window) {
      destination.ssd = library.history; // history is window object property, so use ssd as alias
      destination.input = library.in; // in is a keyword in javascript
      destination.ternary = library.switch; // switch is a keyword in javascript

      delete library.history;
      delete library.in;
      delete library.switch;
    }

    Object.assign(destination, library);

    Object.defineProperty(library, 'samplerate', {
      get: function get() {
        return library.gen.samplerate;
      },
      set: function set(v) {}
    });

    library.in = destination.input;
    library.history = destination.ssd;
    library.switch = destination.ternary;

    destination.clip = library.clamp;
  },


  gen: require('./gen.js'),

  abs: require('./abs.js'),
  round: require('./round.js'),
  param: require('./param.js'),
  add: require('./add.js'),
  sub: require('./sub.js'),
  mul: require('./mul.js'),
  div: require('./div.js'),
  accum: require('./accum.js'),
  counter: require('./counter.js'),
  sin: require('./sin.js'),
  cos: require('./cos.js'),
  tan: require('./tan.js'),
  tanh: require('./tanh.js'),
  asin: require('./asin.js'),
  acos: require('./acos.js'),
  atan: require('./atan.js'),
  phasor: require('./phasor.js'),
  data: require('./data.js'),
  peek: require('./peek.js'),
  cycle: require('./cycle.js'),
  history: require('./history.js'),
  delta: require('./delta.js'),
  floor: require('./floor.js'),
  ceil: require('./ceil.js'),
  min: require('./min.js'),
  max: require('./max.js'),
  sign: require('./sign.js'),
  dcblock: require('./dcblock.js'),
  memo: require('./memo.js'),
  rate: require('./rate.js'),
  wrap: require('./wrap.js'),
  mix: require('./mix.js'),
  clamp: require('./clamp.js'),
  poke: require('./poke.js'),
  delay: require('./delay.js'),
  fold: require('./fold.js'),
  mod: require('./mod.js'),
  sah: require('./sah.js'),
  noise: require('./noise.js'),
  not: require('./not.js'),
  gt: require('./gt.js'),
  gte: require('./gte.js'),
  lt: require('./lt.js'),
  lte: require('./lte.js'),
  bool: require('./bool.js'),
  gate: require('./gate.js'),
  train: require('./train.js'),
  slide: require('./slide.js'),
  in: require('./in.js'),
  t60: require('./t60.js'),
  mtof: require('./mtof.js'),
  ltp: require('./ltp.js'), // TODO: test
  gtp: require('./gtp.js'), // TODO: test
  switch: require('./switch.js'),
  mstosamps: require('./mstosamps.js'), // TODO: needs test,
  selector: require('./selector.js'),
  utilities: require('./utilities.js'),
  pow: require('./pow.js'),
  attack: require('./attack.js'),
  decay: require('./decay.js'),
  windows: require('./windows.js'),
  env: require('./env.js'),
  ad: require('./ad.js'),
  adsr: require('./adsr.js'),
  ifelse: require('./ifelseif.js'),
  bang: require('./bang.js'),
  and: require('./and.js'),
  pan: require('./pan.js'),
  eq: require('./eq.js'),
  neq: require('./neq.js'),
  exp: require('./exp.js')
};

library.gen.lib = library;

module.exports = library;
},{"./abs.js":1,"./accum.js":2,"./acos.js":3,"./ad.js":4,"./add.js":5,"./adsr.js":6,"./and.js":7,"./asin.js":8,"./atan.js":9,"./attack.js":10,"./bang.js":11,"./bool.js":12,"./ceil.js":13,"./clamp.js":14,"./cos.js":15,"./counter.js":16,"./cycle.js":17,"./data.js":18,"./dcblock.js":19,"./decay.js":20,"./delay.js":21,"./delta.js":22,"./div.js":23,"./env.js":24,"./eq.js":25,"./exp.js":26,"./floor.js":27,"./fold.js":28,"./gate.js":29,"./gen.js":30,"./gt.js":31,"./gte.js":32,"./gtp.js":33,"./history.js":34,"./ifelseif.js":35,"./in.js":36,"./lt.js":38,"./lte.js":39,"./ltp.js":40,"./max.js":41,"./memo.js":42,"./min.js":43,"./mix.js":44,"./mod.js":45,"./mstosamps.js":46,"./mtof.js":47,"./mul.js":48,"./neq.js":49,"./noise.js":50,"./not.js":51,"./pan.js":52,"./param.js":53,"./peek.js":54,"./phasor.js":55,"./poke.js":56,"./pow.js":57,"./rate.js":58,"./round.js":59,"./sah.js":60,"./selector.js":61,"./sign.js":62,"./sin.js":63,"./slide.js":64,"./sub.js":65,"./switch.js":66,"./t60.js":67,"./tan.js":68,"./tanh.js":69,"./train.js":70,"./utilities.js":71,"./windows.js":72,"./wrap.js":73}],38:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  name: 'lt',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    out = '  var ' + this.name + ' = ';

    if (isNaN(this.inputs[0]) || isNaN(this.inputs[1])) {
      out += '(( ' + inputs[0] + ' < ' + inputs[1] + ') | 0  )';
    } else {
      out += inputs[0] < inputs[1] ? 1 : 0;
    }
    out += '\n';

    _gen.memo[this.name] = this.name;

    return [this.name, out];

    return out;
  }
};

module.exports = function (x, y) {
  var lt = Object.create(proto);

  lt.inputs = [x, y];
  lt.name = 'lt' + _gen.getUID();

  return lt;
};
},{"./gen.js":30}],39:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  name: 'lte',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    out = '  var ' + this.name + ' = ';

    if (isNaN(this.inputs[0]) || isNaN(this.inputs[1])) {
      out += '( ' + inputs[0] + ' <= ' + inputs[1] + ' | 0  )';
    } else {
      out += inputs[0] <= inputs[1] ? 1 : 0;
    }
    out += '\n';

    _gen.memo[this.name] = this.name;

    return [this.name, out];

    return out;
  }
};

module.exports = function (x, y) {
  var lt = Object.create(proto);

  lt.inputs = [x, y];
  lt.name = 'lte' + _gen.getUID();

  return lt;
};
},{"./gen.js":30}],40:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  name: 'ltp',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(this.inputs[0]) || isNaN(this.inputs[1])) {
      out = '(' + inputs[0] + ' * (( ' + inputs[0] + ' < ' + inputs[1] + ' ) | 0 ) )';
    } else {
      out = inputs[0] * (inputs[0] < inputs[1] | 0);
    }

    return out;
  }
};

module.exports = function (x, y) {
  var ltp = Object.create(proto);

  ltp.inputs = [x, y];

  return ltp;
};
},{"./gen.js":30}],41:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js');

var proto = {
  name: 'max',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0]) || isNaN(inputs[1])) {
      _gen.closures.add(_defineProperty({}, this.name, Math.max));

      out = 'gen.max( ' + inputs[0] + ', ' + inputs[1] + ' )';
    } else {
      out = Math.max(parseFloat(inputs[0]), parseFloat(inputs[1]));
    }

    return out;
  }
};

module.exports = function (x, y) {
  var max = Object.create(proto);

  max.inputs = [x, y];

  return max;
};
},{"./gen.js":30}],42:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'memo',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    out = '  var ' + this.name + ' = ' + inputs[0] + '\n';

    _gen.memo[this.name] = this.name;

    return [this.name, out];
  }
};

module.exports = function (in1, memoName) {
  var memo = Object.create(proto);

  memo.inputs = [in1];
  memo.id = _gen.getUID();
  memo.name = memoName !== undefined ? memoName + '_' + _gen.getUID() : '' + memo.basename + memo.id;

  return memo;
};
},{"./gen.js":30}],43:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js');

var proto = {
  name: 'min',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0]) || isNaN(inputs[1])) {
      _gen.closures.add(_defineProperty({}, this.name, Math.min));

      out = 'gen.min( ' + inputs[0] + ', ' + inputs[1] + ' )';
    } else {
      out = Math.min(parseFloat(inputs[0]), parseFloat(inputs[1]));
    }

    return out;
  }
};

module.exports = function (x, y) {
  var min = Object.create(proto);

  min.inputs = [x, y];

  return min;
};
},{"./gen.js":30}],44:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    add = require('./add.js'),
    mul = require('./mul.js'),
    sub = require('./sub.js'),
    memo = require('./memo.js');

module.exports = function (in1, in2) {
    var t = arguments.length <= 2 || arguments[2] === undefined ? .5 : arguments[2];

    var ugen = memo(add(mul(in1, sub(1, t)), mul(in2, t)));
    ugen.name = 'mix' + gen.getUID();

    return ugen;
};
},{"./add.js":5,"./gen.js":30,"./memo.js":42,"./mul.js":48,"./sub.js":65}],45:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

module.exports = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var mod = {
    id: _gen.getUID(),
    inputs: args,

    gen: function gen() {
      var inputs = _gen.getInputs(this),
          out = '(',
          diff = 0,
          numCount = 0,
          lastNumber = inputs[0],
          lastNumberIsUgen = isNaN(lastNumber),
          modAtEnd = false;

      inputs.forEach(function (v, i) {
        if (i === 0) return;

        var isNumberUgen = isNaN(v),
            isFinalIdx = i === inputs.length - 1;

        if (!lastNumberIsUgen && !isNumberUgen) {
          lastNumber = lastNumber % v;
          out += lastNumber;
        } else {
          out += lastNumber + ' % ' + v;
        }

        if (!isFinalIdx) out += ' % ';
      });

      out += ')';

      return out;
    }
  };

  return mod;
};
},{"./gen.js":30}],46:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'mstosamps',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this),
        returnValue = void 0;

    if (isNaN(inputs[0])) {
      out = '  var ' + this.name + ' = ' + _gen.samplerate + ' / 1000 * ' + inputs[0] + ' \n\n';

      _gen.memo[this.name] = out;

      returnValue = [this.name, out];
    } else {
      out = _gen.samplerate / 1000 * this.inputs[0];

      returnValue = out;
    }

    return returnValue;
  }
};

module.exports = function (x) {
  var mstosamps = Object.create(proto);

  mstosamps.inputs = [x];
  mstosamps.name = proto.basename + _gen.getUID();

  return mstosamps;
};
},{"./gen.js":30}],47:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js');

var proto = {
  name: 'mtof',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add(_defineProperty({}, this.name, Math.exp));

      out = '( ' + this.tuning + ' * gen.exp( .057762265 * (' + inputs[0] + ' - 69) ) )';
    } else {
      out = this.tuning * Math.exp(.057762265 * (inputs[0] - 69));
    }

    return out;
  }
};

module.exports = function (x, props) {
  var ugen = Object.create(proto),
      defaults = { tuning: 440 };

  if (props !== undefined) Object.assign(props.defaults);

  Object.assign(ugen, defaults);
  ugen.inputs = [x];

  return ugen;
};
},{"./gen.js":30}],48:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'mul',

  gen: function gen() {
    var inputs = _gen.getInputs(this),
        out = '  var ' + this.name + ' = ',
        sum = 1,
        numCount = 0,
        mulAtEnd = false,
        alreadyFullSummed = true;

    inputs.forEach(function (v, i) {
      if (isNaN(v)) {
        out += v;
        if (i < inputs.length - 1) {
          mulAtEnd = true;
          out += ' * ';
        }
        alreadyFullSummed = false;
      } else {
        if (i === 0) {
          sum = v;
        } else {
          sum *= parseFloat(v);
        }
        numCount++;
      }
    });

    if (numCount > 0) {
      out += mulAtEnd || alreadyFullSummed ? sum : ' * ' + sum;
    }

    out += '\n';

    _gen.memo[this.name] = this.name;

    return [this.name, out];
  }
};

module.exports = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var mul = Object.create(proto);

  Object.assign(mul, {
    id: _gen.getUID(),
    inputs: args
  });

  mul.name = mul.basename + mul.id;

  return mul;
};
},{"./gen.js":30}],49:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'neq',

  gen: function gen() {
    var inputs = _gen.getInputs(this),
        out = void 0;

    out = /*this.inputs[0] !== this.inputs[1] ? 1 :*/'  var ' + this.name + ' = (' + inputs[0] + ' !== ' + inputs[1] + ') | 0\n\n';

    _gen.memo[this.name] = this.name;

    return [this.name, out];
  }
};

module.exports = function (in1, in2) {
  var ugen = Object.create(proto);
  Object.assign(ugen, {
    uid: _gen.getUID(),
    inputs: [in1, in2]
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./gen.js":30}],50:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  name: 'noise',

  gen: function gen() {
    var out = void 0;

    _gen.closures.add({ 'noise': Math.random });

    out = '  var ' + this.name + ' = gen.noise()\n';

    _gen.memo[this.name] = this.name;

    return [this.name, out];
  }
};

module.exports = function (x) {
  var noise = Object.create(proto);
  noise.name = proto.name + _gen.getUID();

  return noise;
};
},{"./gen.js":30}],51:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  name: 'not',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(this.inputs[0])) {
      out = '( ' + inputs[0] + ' === 0 ? 1 : 0 )';
    } else {
      out = !inputs[0] === 0 ? 1 : 0;
    }

    return out;
  }
};

module.exports = function (x) {
  var not = Object.create(proto);

  not.inputs = [x];

  return not;
};
},{"./gen.js":30}],52:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    data = require('./data.js'),
    peek = require('./peek.js'),
    mul = require('./mul.js');

var proto = {
  basename: 'pan',
  initTable: function initTable() {
    var bufferL = new Float32Array(1024),
        bufferR = new Float32Array(1024);

    var sqrtTwoOverTwo = Math.sqrt(2) / 2;

    for (var i = 0; i < 1024; i++) {
      var pan = -1 + i / 1024 * 2;
      bufferL[i] = sqrtTwoOverTwo * (Math.cos(pan) - Math.sin(pan));
      bufferR[i] = sqrtTwoOverTwo * (Math.cos(pan) + Math.sin(pan));
    }

    gen.globals.panL = data(bufferL, 1, { immutable: true });
    gen.globals.panR = data(bufferR, 1, { immutable: true });
  }
};

module.exports = function (leftInput, rightInput) {
  var pan = arguments.length <= 2 || arguments[2] === undefined ? .5 : arguments[2];
  var properties = arguments[3];

  if (gen.globals.panL === undefined) proto.initTable();

  var ugen = Object.create(proto);

  Object.assign(ugen, {
    uid: gen.getUID(),
    inputs: [leftInput, rightInput],
    left: mul(leftInput, peek(gen.globals.panL, pan, { boundmode: 'clamp' })),
    right: mul(rightInput, peek(gen.globals.panR, pan, { boundmode: 'clamp' }))
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./data.js":18,"./gen.js":30,"./mul.js":48,"./peek.js":54}],53:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js');

var proto = {
  basename: 'param',

  gen: function gen() {
    _gen.requestMemory(this.memory);

    _gen.params.add(_defineProperty({}, this.name, this));

    this.value = this.initialValue;

    _gen.memo[this.name] = 'memory[' + this.memory.value.idx + ']';

    return _gen.memo[this.name];
  }
};

module.exports = function () {
  var propName = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
  var value = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  var ugen = Object.create(proto);

  if (typeof propName !== 'string') {
    ugen.name = ugen.basename + _gen.getUID();
    ugen.initialValue = propName;
  } else {
    ugen.name = propName;
    ugen.initialValue = value;
  }

  Object.defineProperty(ugen, 'value', {
    get: function get() {
      if (this.memory.value.idx !== null) {
        return _gen.memory.heap[this.memory.value.idx];
      }
    },
    set: function set(v) {
      if (this.memory.value.idx !== null) {
        _gen.memory.heap[this.memory.value.idx] = v;
      }
    }
  });

  ugen.memory = {
    value: { length: 1, idx: null }
  };

  return ugen;
};
},{"./gen.js":30}],54:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'peek',

  gen: function gen() {
    var genName = 'gen.' + this.name,
        inputs = _gen.getInputs(this),
        out = void 0,
        functionBody = void 0,
        next = void 0,
        lengthIsLog2 = void 0,
        idx = void 0;

    idx = inputs[1];
    lengthIsLog2 = (Math.log2(this.data.buffer.length) | 0) === Math.log2(this.data.buffer.length);

    if (this.mode !== 'simple') {

      functionBody = '  var ' + this.name + '_dataIdx  = ' + idx + ', \n      ' + this.name + '_phase = ' + (this.mode === 'samples' ? inputs[0] : inputs[0] + ' * ' + (this.data.buffer.length - 1)) + ', \n      ' + this.name + '_index = ' + this.name + '_phase | 0,\n';

      if (this.boundmode === 'wrap') {
        next = lengthIsLog2 ? '( ' + this.name + '_index + 1 ) & (' + this.data.buffer.length + ' - 1)' : this.name + '_index + 1 >= ' + this.data.buffer.length + ' ? ' + this.name + '_index + 1 - ' + this.data.buffer.length + ' : ' + this.name + '_index + 1';
      } else if (this.boundmode === 'clamp') {
        next = this.name + '_index + 1 >= ' + (this.data.buffer.length - 1) + ' ? ' + (this.data.buffer.length - 1) + ' : ' + this.name + '_index + 1';
      } else if (this.boundmode === 'fold' || this.boundmode === 'mirror') {
        next = this.name + '_index + 1 >= ' + (this.data.buffer.length - 1) + ' ? ' + this.name + '_index - ' + (this.data.buffer.length - 1) + ' : ' + this.name + '_index + 1';
      } else {
        next = this.name + '_index + 1';
      }

      if (this.interp === 'linear') {
        functionBody += '      ' + this.name + '_frac  = ' + this.name + '_phase - ' + this.name + '_index,\n      ' + this.name + '_base  = memory[ ' + this.name + '_dataIdx +  ' + this.name + '_index ],\n      ' + this.name + '_next  = ' + next + ',';

        if (this.boundmode === 'ignore') {
          functionBody += '\n      ' + this.name + '_out   = ' + this.name + '_index >= ' + (this.data.buffer.length - 1) + ' || ' + this.name + '_index < 0 ? 0 : ' + this.name + '_base + ' + this.name + '_frac * ( memory[ ' + this.name + '_dataIdx + ' + this.name + '_next ] - ' + this.name + '_base )\n\n';
        } else {
          functionBody += '\n      ' + this.name + '_out   = ' + this.name + '_base + ' + this.name + '_frac * ( memory[ ' + this.name + '_dataIdx + ' + this.name + '_next ] - ' + this.name + '_base )\n\n';
        }
      } else {
        functionBody += '      ' + this.name + '_out = memory[ ' + this.name + '_dataIdx + ' + this.name + '_index ]\n\n';
      }
    } else {
      // mode is simple
      functionBody = 'memory[ ' + idx + ' + ' + inputs[0] + ' ]';

      return functionBody;
    }

    _gen.memo[this.name] = this.name + '_out';

    return [this.name + '_out', functionBody];
  }
};

module.exports = function (data, index, properties) {
  var ugen = Object.create(proto),
      defaults = { channels: 1, mode: 'phase', interp: 'linear', boundmode: 'wrap' };

  if (properties !== undefined) Object.assign(defaults, properties);

  Object.assign(ugen, {
    data: data,
    dataName: data.name,
    uid: _gen.getUID(),
    inputs: [index, data]
  }, defaults);

  ugen.name = ugen.basename + ugen.uid;

  return ugen;
};
},{"./gen.js":30}],55:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    accum = require('./accum.js'),
    mul = require('./mul.js'),
    proto = { basename: 'phasor' };

var defaults = { min: -1, max: 1 };

module.exports = function () {
  var frequency = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
  var reset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var _props = arguments[2];

  var props = Object.assign({}, defaults, _props);

  var range = props.max - props.min;

  var ugen = typeof frequency === 'number' ? accum(frequency * range / gen.samplerate, reset, props) : accum(mul(frequency, 1 / gen.samplerate / (1 / range)), reset, props);

  ugen.name = proto.basename + gen.getUID();

  return ugen;
};
},{"./accum.js":2,"./gen.js":30,"./mul.js":48}],56:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js'),
    mul = require('./mul.js'),
    wrap = require('./wrap.js');

var proto = {
  basename: 'poke',

  gen: function gen() {
    var dataName = 'memory',
        inputs = _gen.getInputs(this),
        idx = void 0,
        out = void 0,
        wrapped = void 0;

    idx = this.data.gen();

    //gen.requestMemory( this.memory )
    //wrapped = wrap( this.inputs[1], 0, this.dataLength ).gen()
    //idx = wrapped[0]
    //gen.functionBody += wrapped[1]
    var outputStr = this.inputs[1] === 0 ? '  ' + dataName + '[ ' + idx + ' ] = ' + inputs[0] + '\n' : '  ' + dataName + '[ ' + idx + ' + ' + inputs[1] + ' ] = ' + inputs[0] + '\n';

    if (this.inline === undefined) {
      _gen.functionBody += outputStr;
    } else {
      return [this.inline, outputStr];
    }
  }
};
module.exports = function (data, value, index, properties) {
  var ugen = Object.create(proto),
      defaults = { channels: 1 };

  if (properties !== undefined) Object.assign(defaults, properties);

  Object.assign(ugen, {
    data: data,
    dataName: data.name,
    dataLength: data.buffer.length,
    uid: _gen.getUID(),
    inputs: [value, index]
  }, defaults);

  ugen.name = ugen.basename + ugen.uid;

  _gen.histories.set(ugen.name, ugen);

  return ugen;
};
},{"./gen.js":30,"./mul.js":48,"./wrap.js":73}],57:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'pow',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0]) || isNaN(inputs[1])) {
      _gen.closures.add({ 'pow': Math.pow });

      out = 'gen.pow( ' + inputs[0] + ', ' + inputs[1] + ' )';
    } else {
      if (typeof inputs[0] === 'string' && inputs[0][0] === '(') {
        inputs[0] = inputs[0].slice(1, -1);
      }
      if (typeof inputs[1] === 'string' && inputs[1][0] === '(') {
        inputs[1] = inputs[1].slice(1, -1);
      }

      out = Math.pow(parseFloat(inputs[0]), parseFloat(inputs[1]));
    }

    return out;
  }
};

module.exports = function (x, y) {
  var pow = Object.create(proto);

  pow.inputs = [x, y];
  pow.id = _gen.getUID();
  pow.name = pow.basename + '{pow.id}';

  return pow;
};
},{"./gen.js":30}],58:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js'),
    history = require('./history.js'),
    sub = require('./sub.js'),
    add = require('./add.js'),
    mul = require('./mul.js'),
    memo = require('./memo.js'),
    delta = require('./delta.js'),
    wrap = require('./wrap.js');

var proto = {
  basename: 'rate',

  gen: function gen() {
    var inputs = _gen.getInputs(this),
        phase = history(),
        inMinus1 = history(),
        genName = 'gen.' + this.name,
        filter = void 0,
        sum = void 0,
        out = void 0;

    _gen.closures.add(_defineProperty({}, this.name, this));

    out = ' var ' + this.name + '_diff = ' + inputs[0] + ' - ' + genName + '.lastSample\n  if( ' + this.name + '_diff < -.5 ) ' + this.name + '_diff += 1\n  ' + genName + '.phase += ' + this.name + '_diff * ' + inputs[1] + '\n  if( ' + genName + '.phase > 1 ) ' + genName + '.phase -= 1\n  ' + genName + '.lastSample = ' + inputs[0] + '\n';
    out = ' ' + out;

    return [genName + '.phase', out];
  }
};

module.exports = function (in1, rate) {
  var ugen = Object.create(proto);

  Object.assign(ugen, {
    phase: 0,
    lastSample: 0,
    uid: _gen.getUID(),
    inputs: [in1, rate]
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./add.js":5,"./delta.js":22,"./gen.js":30,"./history.js":34,"./memo.js":42,"./mul.js":48,"./sub.js":65,"./wrap.js":73}],59:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js');

var proto = {
  name: 'round',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add(_defineProperty({}, this.name, Math.round));

      out = 'gen.round( ' + inputs[0] + ' )';
    } else {
      out = Math.round(parseFloat(inputs[0]));
    }

    return out;
  }
};

module.exports = function (x) {
  var round = Object.create(proto);

  round.inputs = [x];

  return round;
};
},{"./gen.js":30}],60:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'sah',

  gen: function gen() {
    var inputs = _gen.getInputs(this),
        out = void 0;

    _gen.data[this.name] = 0;
    _gen.data[this.name + '_control'] = 0;

    out = ' var ' + this.name + ' = gen.data.' + this.name + '_control,\n      ' + this.name + '_trigger = ' + inputs[1] + ' > ' + inputs[2] + ' ? 1 : 0\n\n  if( ' + this.name + '_trigger !== ' + this.name + '  ) {\n    if( ' + this.name + '_trigger === 1 ) \n      gen.data.' + this.name + ' = ' + inputs[0] + '\n    gen.data.' + this.name + '_control = ' + this.name + '_trigger\n  }\n';

    _gen.memo[this.name] = 'gen.data.' + this.name;

    return ['gen.data.' + this.name, ' ' + out];
  }
};

module.exports = function (in1, control) {
  var threshold = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  var properties = arguments[3];

  var ugen = Object.create(proto),
      defaults = { init: 0 };

  if (properties !== undefined) Object.assign(defaults, properties);

  Object.assign(ugen, {
    lastSample: 0,
    uid: _gen.getUID(),
    inputs: [in1, control, threshold]
  }, defaults);

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./gen.js":30}],61:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'selector',

  gen: function gen() {
    var inputs = _gen.getInputs(this),
        out = void 0,
        returnValue = 0;

    switch (inputs.length) {
      case 2:
        returnValue = inputs[1];
        break;
      case 3:
        out = '  var ' + this.name + '_out = ' + inputs[0] + ' === 1 ? ' + inputs[1] + ' : ' + inputs[2] + '\n\n';
        returnValue = [this.name + '_out', out];
        break;
      default:
        out = ' var ' + this.name + '_out = 0\n  switch( ' + inputs[0] + ' + 1 ) {\n';

        for (var i = 1; i < inputs.length; i++) {
          out += '    case ' + i + ': ' + this.name + '_out = ' + inputs[i] + '; break;\n';
        }

        out += '  }\n\n';

        returnValue = [this.name + '_out', ' ' + out];
    }

    _gen.memo[this.name] = this.name + '_out';

    return returnValue;
  }
};

module.exports = function () {
  for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
    inputs[_key] = arguments[_key];
  }

  var ugen = Object.create(proto);

  Object.assign(ugen, {
    uid: _gen.getUID(),
    inputs: inputs
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./gen.js":30}],62:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js');

var proto = {
  name: 'sign',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add(_defineProperty({}, this.name, Math.sign));

      out = 'gen.sign( ' + inputs[0] + ' )';
    } else {
      out = Math.sign(parseFloat(inputs[0]));
    }

    return out;
  }
};

module.exports = function (x) {
  var sign = Object.create(proto);

  sign.inputs = [x];

  return sign;
};
},{"./gen.js":30}],63:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'sin',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add({ 'sin': Math.sin });

      out = 'gen.sin( ' + inputs[0] + ' )';
    } else {
      out = Math.sin(parseFloat(inputs[0]));
    }

    return out;
  }
};

module.exports = function (x) {
  var sin = Object.create(proto);

  sin.inputs = [x];
  sin.id = _gen.getUID();
  sin.name = sin.basename + '{sin.id}';

  return sin;
};
},{"./gen.js":30}],64:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    history = require('./history.js'),
    sub = require('./sub.js'),
    add = require('./add.js'),
    mul = require('./mul.js'),
    memo = require('./memo.js'),
    gt = require('./gt.js'),
    div = require('./div.js'),
    _switch = require('./switch.js');

module.exports = function (in1) {
    var slideUp = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
    var slideDown = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    var y1 = history(0),
        filter = void 0,
        slideAmount = void 0;

    //y (n) = y (n-1) + ((x (n) - y (n-1))/slide)
    slideAmount = _switch(gt(in1, y1.out), slideUp, slideDown);

    filter = memo(add(y1.out, div(sub(in1, y1.out), slideAmount)));

    y1.in(filter);

    return filter;
};
},{"./add.js":5,"./div.js":23,"./gen.js":30,"./gt.js":31,"./history.js":34,"./memo.js":42,"./mul.js":48,"./sub.js":65,"./switch.js":66}],65:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'sub',
  gen: function gen() {
    var inputs = _gen.getInputs(this),
        out = 0,
        diff = 0,
        needsParens = false,
        numCount = 0,
        lastNumber = inputs[0],
        lastNumberIsUgen = isNaN(lastNumber),
        subAtEnd = false,
        hasUgens = false,
        returnValue = 0;

    this.inputs.forEach(function (value) {
      if (isNaN(value)) hasUgens = true;
    });

    out = '  var ' + this.name + ' = ';

    inputs.forEach(function (v, i) {
      if (i === 0) return;

      var isNumberUgen = isNaN(v),
          isFinalIdx = i === inputs.length - 1;

      if (!lastNumberIsUgen && !isNumberUgen) {
        lastNumber = lastNumber - v;
        out += lastNumber;
        return;
      } else {
        needsParens = true;
        out += lastNumber + ' - ' + v;
      }

      if (!isFinalIdx) out += ' - ';
    });

    out += '\n';

    returnValue = [this.name, out];

    _gen.memo[this.name] = this.name;

    return returnValue;
  }
};

module.exports = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var sub = Object.create(proto);

  Object.assign(sub, {
    id: _gen.getUID(),
    inputs: args
  });

  sub.name = 'sub' + sub.id;

  return sub;
};
},{"./gen.js":30}],66:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'switch',

  gen: function gen() {
    var inputs = _gen.getInputs(this),
        out = void 0;

    if (inputs[1] === inputs[2]) return inputs[1]; // if both potential outputs are the same just return one of them

    out = '  var ' + this.name + '_out = ' + inputs[0] + ' === 1 ? ' + inputs[1] + ' : ' + inputs[2] + '\n';

    _gen.memo[this.name] = this.name + '_out';

    return [this.name + '_out', out];
  }
};

module.exports = function (control) {
  var in1 = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  var in2 = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var ugen = Object.create(proto);
  Object.assign(ugen, {
    uid: _gen.getUID(),
    inputs: [control, in1, in2]
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./gen.js":30}],67:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _gen = require('./gen.js');

var proto = {
  basename: 't60',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this),
        returnValue = void 0;

    if (isNaN(inputs[0])) {
      _gen.closures.add(_defineProperty({}, 'exp', Math.exp));

      out = '  var ' + this.name + ' = gen.exp( -6.907755278921 / ' + inputs[0] + ' )\n\n';

      _gen.memo[this.name] = out;

      returnValue = [this.name, out];
    } else {
      out = Math.exp(-6.907755278921 / inputs[0]);

      returnValue = out;
    }

    return returnValue;
  }
};

module.exports = function (x) {
  var t60 = Object.create(proto);

  t60.inputs = [x];
  t60.name = proto.basename + _gen.getUID();

  return t60;
};
},{"./gen.js":30}],68:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'tan',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add({ 'tan': Math.tan });

      out = 'gen.tan( ' + inputs[0] + ' )';
    } else {
      out = Math.tan(parseFloat(inputs[0]));
    }

    return out;
  }
};

module.exports = function (x) {
  var tan = Object.create(proto);

  tan.inputs = [x];
  tan.id = _gen.getUID();
  tan.name = tan.basename + '{tan.id}';

  return tan;
};
},{"./gen.js":30}],69:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js');

var proto = {
  basename: 'tanh',

  gen: function gen() {
    var out = void 0,
        inputs = _gen.getInputs(this);

    if (isNaN(inputs[0])) {
      _gen.closures.add({ 'tanh': Math.tanh });

      out = 'gen.tanh( ' + inputs[0] + ' )';
    } else {
      out = Math.tanh(parseFloat(inputs[0]));
    }

    return out;
  }
};

module.exports = function (x) {
  var tanh = Object.create(proto);

  tanh.inputs = [x];
  tanh.id = _gen.getUID();
  tanh.name = tanh.basename + '{tanh.id}';

  return tanh;
};
},{"./gen.js":30}],70:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    lt = require('./lt.js'),
    phasor = require('./phasor.js');

module.exports = function () {
  var frequency = arguments.length <= 0 || arguments[0] === undefined ? 440 : arguments[0];
  var pulsewidth = arguments.length <= 1 || arguments[1] === undefined ? .5 : arguments[1];

  var graph = lt(accum(div(frequency, 44100)), .5);

  graph.name = 'train' + gen.getUID();

  return graph;
};
},{"./gen.js":30,"./lt.js":38,"./phasor.js":55}],71:[function(require,module,exports){
'use strict';

var gen = require('./gen.js'),
    data = require('./data.js');

var isStereo = false;

var utilities = {
  ctx: null,

  clear: function clear() {
    this.callback = function () {
      return 0;
    };
    this.clear.callbacks.forEach(function (v) {
      return v();
    });
    this.clear.callbacks.length = 0;
  },
  createContext: function createContext() {
    var AC = typeof AudioContext === 'undefined' ? webkitAudioContext : AudioContext;
    this.ctx = new AC();
    gen.samplerate = this.ctx.sampleRate;

    var start = function start() {
      if (typeof AC !== 'undefined') {
        if (document && document.documentElement && 'ontouchstart' in document.documentElement) {
          window.removeEventListener('touchstart', start);

          if ('ontouchstart' in document.documentElement) {
            // required to start audio under iOS 6
            var mySource = utilities.ctx.createBufferSource();
            mySource.connect(utilities.ctx.destination);
            mySource.noteOn(0);
          }
        }
      }
    };

    if (document && document.documentElement && 'ontouchstart' in document.documentElement) {
      window.addEventListener('touchstart', start);
    }

    return this;
  },
  createScriptProcessor: function createScriptProcessor() {
    this.node = this.ctx.createScriptProcessor(1024, 0, 2), this.clearFunction = function () {
      return 0;
    }, this.callback = this.clearFunction;

    this.node.onaudioprocess = function (audioProcessingEvent) {
      var outputBuffer = audioProcessingEvent.outputBuffer;

      var left = outputBuffer.getChannelData(0),
          right = outputBuffer.getChannelData(1);

      for (var sample = 0; sample < left.length; sample++) {
        if (!isStereo) {
          left[sample] = right[sample] = utilities.callback();
        } else {
          var out = utilities.callback();
          left[sample] = out[0];
          right[sample] = out[1];
        }
      }
    };

    this.node.connect(this.ctx.destination);

    //this.node.connect( this.analyzer )

    return this;
  },
  playGraph: function playGraph(graph, debug) {
    var mem = arguments.length <= 2 || arguments[2] === undefined ? 44100 * 10 : arguments[2];

    utilities.clear();
    if (debug === undefined) debug = false;

    isStereo = Array.isArray(graph);

    utilities.callback = gen.createCallback(graph, mem, debug);

    if (utilities.console) utilities.console.setValue(utilities.callback.toString());

    return utilities.callback;
  },
  loadSample: function loadSample(soundFilePath, data) {
    var req = new XMLHttpRequest();
    req.open('GET', soundFilePath, true);
    req.responseType = 'arraybuffer';

    var promise = new Promise(function (resolve, reject) {
      req.onload = function () {
        var audioData = req.response;

        utilities.ctx.decodeAudioData(audioData, function (buffer) {
          data.buffer = buffer.getChannelData(0);
          resolve(data.buffer);
        });
      };
    });

    req.send();

    return promise;
  }
};

utilities.clear.callbacks = [];

module.exports = utilities;
},{"./data.js":18,"./gen.js":30}],72:[function(require,module,exports){
'use strict';

/*
 * many windows here adapted from https://github.com/corbanbrook/dsp.js/blob/master/dsp.js
 * starting at line 1427
 * taken 8/15/16
*/

var windows = module.exports = {
  bartlett: function bartlett(length, index) {
    return 2 / (length - 1) * ((length - 1) / 2 - Math.abs(index - (length - 1) / 2));
  },
  bartlettHann: function bartlettHann(length, index) {
    return 0.62 - 0.48 * Math.abs(index / (length - 1) - 0.5) - 0.38 * Math.cos(2 * Math.PI * index / (length - 1));
  },
  blackman: function blackman(length, index, alpha) {
    var a0 = (1 - alpha) / 2,
        a1 = 0.5,
        a2 = alpha / 2;

    return a0 - a1 * Math.cos(2 * Math.PI * index / (length - 1)) + a2 * Math.cos(4 * Math.PI * index / (length - 1));
  },
  cosine: function cosine(length, index) {
    return Math.cos(Math.PI * index / (length - 1) - Math.PI / 2);
  },
  gauss: function gauss(length, index, alpha) {
    return Math.pow(Math.E, -0.5 * Math.pow((index - (length - 1) / 2) / (alpha * (length - 1) / 2), 2));
  },
  hamming: function hamming(length, index) {
    return 0.54 - 0.46 * Math.cos(Math.PI * 2 * index / (length - 1));
  },
  hann: function hann(length, index) {
    return 0.5 * (1 - Math.cos(Math.PI * 2 * index / (length - 1)));
  },
  lanczos: function lanczos(length, index) {
    var x = 2 * index / (length - 1) - 1;
    return Math.sin(Math.PI * x) / (Math.PI * x);
  },
  rectangular: function rectangular(length, index) {
    return 1;
  },
  triangular: function triangular(length, index) {
    return 2 / length * (length / 2 - Math.abs(index - (length - 1) / 2));
  },


  // parabola
  welch: function welch(length, _index, ignore, shift) {
    //w[n] = 1 - Math.pow( ( n - ( (N-1) / 2 ) ) / (( N-1 ) / 2 ), 2 )
    var index = shift === 0 ? _index : (_index + Math.floor(shift * length)) % length;
    var n_1_over2 = (length - 1) / 2;

    return 1 - Math.pow((index - n_1_over2) / n_1_over2, 2);
  },
  inversewelch: function inversewelch(length, _index, ignore) {
    var shift = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

    //w[n] = 1 - Math.pow( ( n - ( (N-1) / 2 ) ) / (( N-1 ) / 2 ), 2 )
    var index = shift === 0 ? _index : (_index + Math.floor(shift * length)) % length;
    var n_1_over2 = (length - 1) / 2;

    return Math.pow((index - n_1_over2) / n_1_over2, 2);
  },
  parabola: function parabola(length, index) {
    if (index <= length / 2) {
      return windows.inversewelch(length / 2, index) - 1;
    } else {
      return 1 - windows.inversewelch(length / 2, index - length / 2);
    }
  },
  exponential: function exponential(length, index, alpha) {
    return Math.pow(index / length, alpha);
  },
  linear: function linear(length, index) {
    return index / length;
  }
};
},{}],73:[function(require,module,exports){
'use strict';

var _gen = require('./gen.js'),
    floor = require('./floor.js'),
    sub = require('./sub.js'),
    memo = require('./memo.js');

var proto = {
  basename: 'wrap',

  gen: function gen() {
    var code = void 0,
        inputs = _gen.getInputs(this),
        signal = inputs[0],
        min = inputs[1],
        max = inputs[2],
        out = void 0,
        diff = void 0;

    //out = `(((${inputs[0]} - ${this.min}) % ${diff}  + ${diff}) % ${diff} + ${this.min})`
    //const long numWraps = long((v-lo)/range) - (v < lo);
    //return v - range * double(numWraps);  

    if (this.min === 0) {
      diff = max;
    } else if (isNaN(max) || isNaN(min)) {
      diff = max + ' - ' + min;
    } else {
      diff = max - min;
    }

    out = ' var ' + this.name + ' = ' + inputs[0] + '\n  if( ' + this.name + ' < ' + this.min + ' ) ' + this.name + ' += ' + diff + '\n  else if( ' + this.name + ' > ' + this.max + ' ) ' + this.name + ' -= ' + diff + '\n\n';

    return [this.name, ' ' + out];
  }
};

module.exports = function (in1) {
  var min = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var max = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  var ugen = Object.create(proto);

  Object.assign(ugen, {
    min: min,
    max: max,
    uid: _gen.getUID(),
    inputs: [in1, min, max]
  });

  ugen.name = '' + ugen.basename + ugen.uid;

  return ugen;
};
},{"./floor.js":27,"./gen.js":30,"./memo.js":42,"./sub.js":65}],74:[function(require,module,exports){
'use strict'

let MemoryHelper = {
  create( sizeOrBuffer=4096, memtype=Float32Array ) {
    let helper = Object.create( this )

    // conveniently, buffer constructors accept either a size or an array buffer to use...
    // so, no matter which is passed to sizeOrBuffer it should work.
    Object.assign( helper, {
      heap: new memtype( sizeOrBuffer ),
      list: {},
      freeList: {}
    })

    return helper
  },

  alloc( size, immutable ) {
    let idx = -1

    if( size > this.heap.length ) {
      throw Error( 'Allocation request is larger than heap size of ' + this.heap.length )
    }

    for( let key in this.freeList ) {
      let candidate = this.freeList[ key ]

      if( candidate.size >= size ) {
        idx = key

        this.list[ idx ] = { size, immutable, references:1 }

        if( candidate.size !== size ) {
          let newIndex = idx + size,
              newFreeSize

          for( let key in this.list ) {
            if( key > newIndex ) {
              newFreeSize = key - newIndex
              this.freeList[ newIndex ] = newFreeSize
            }
          }
        }

        break
      }
    }

    if( idx !== -1 ) delete this.freeList[ idx ]

    if( idx === -1 ) {
      let keys = Object.keys( this.list ),
          lastIndex

      if( keys.length ) { // if not first allocation...
        lastIndex = parseInt( keys[ keys.length - 1 ] )

        idx = lastIndex + this.list[ lastIndex ].size
      }else{
        idx = 0
      }

      this.list[ idx ] = { size, immutable, references:1 }
    }

    if( idx + size >= this.heap.length ) {
      throw Error( 'No available blocks remain sufficient for allocation request.' )
    }
    return idx
  },

  addReference( index ) {
    if( this.list[ index ] !== undefined ) { 
      this.list[ index ].references++
    }
  },

  free( index ) {
    if( this.list[ index ] === undefined ) {
      throw Error( 'Calling free() on non-existing block.' )
    }

    let slot = this.list[ index ]
    if( slot === 0 ) return
    slot.references--

    if( slot.references === 0 && slot.immutable !== true ) {    
      this.list[ index ] = 0

      let freeBlockSize = 0
      for( let key in this.list ) {
        if( key > index ) {
          freeBlockSize = key - index
          break
        }
      }

      this.freeList[ index ] = freeBlockSize
    }
  },
}

module.exports = MemoryHelper

},{}],75:[function(require,module,exports){
let ugen = require( '../ugen.js' )

let analyzer = Object.create( ugen )

Object.assign( analyzer, {
  __type__: 'analyzer',
})

module.exports = analyzer

},{"../ugen.js":135}],76:[function(require,module,exports){
module.exports = function( Gibberish ) {

  const analyzers = {
    SSD:    require( './singlesampledelay.js'  )( Gibberish ),
    Follow: require( './follow.js'  )( Gibberish )
  }

  analyzers.export = target => {
    for( let key in analyzers ) {
      if( key !== 'export' ) {
        target[ key ] = analyzers[ key ]
      }
    }
  }

return analyzers

}

},{"./follow.js":77,"./singlesampledelay.js":78}],77:[function(require,module,exports){
const g = require('genish.js'),
      analyzer = require('./analyzer.js'),
      ugen = require('../ugen.js');

const genish = g;

module.exports = function (Gibberish) {

  const Follow = inputProps => {

    // main follow object is also the output
    const follow = Object.create(analyzer);
    follow.in = Object.create(ugen);
    follow.id = Gibberish.factory.getUID();

    const props = Object.assign({}, inputProps, Follow.defaults);
    let isStereo = props.input.isStereo !== undefined ? props.input.isStereo : true;

    // the input to the follow ugen is buffered in this ugen
    follow.buffer = g.data(props.bufferSize, 1);

    let avg; // output; make available outside jsdsp block
    const _input = g.in('input');
    const input = isStereo ? g.add(_input[0], _input[1]) : _input;

    {
      "use jsdsp";
      // phase to write to follow buffer
      const bufferPhaseOut = g.accum(1, 0, { max: props.bufferSize, min: 0 });

      // hold running sum
      const sum = g.data(1, 1, { meta: true });

      sum[0] = genish.sub(genish.add(sum[0], input), g.peek(follow.buffer, bufferPhaseOut, { mode: 'simple' }));

      avg = genish.div(sum[0], props.bufferSize);
    }

    if (!isStereo) {
      Gibberish.factory(follow, avg, 'follow_out', props);

      follow.callback.ugenName = follow.ugenName = `follow_out_${ follow.id }`;

      // have to write custom callback for input to reuse components from output,
      // specifically the memory from our buffer
      let idx = follow.buffer.memory.values.idx;
      let phase = 0;
      let abs = Math.abs;
      let callback = function (input, memory) {
        'use strict';

        memory[idx + phase] = abs(input);
        phase++;
        if (phase > props.bufferSize - 1) {
          phase = 0;
        }

        return 0;
      };

      Gibberish.factory(follow.in, input, 'follow_in', props, callback);

      // lots of nonsense to make our custom function work
      follow.in.callback.ugenName = follow.in.ugenName = `follow_in_${ follow.id }`;
      follow.in.inputNames = ['input'];
      follow.in.inputs = [input];
      follow.in.input = props.input;
      follow.in.type = 'analysis';

      if (Gibberish.analyzers.indexOf(follow.in) === -1) {
        Gibberish.analyzers.push(follow.in);
      }

      Gibberish.dirty(Gibberish.analyzers);
    }

    return follow;
  };

  Follow.defaults = {
    bufferSize: 8192
  };

  return Follow;
};
},{"../ugen.js":135,"./analyzer.js":75,"genish.js":37}],78:[function(require,module,exports){
let g = require( 'genish.js' ),
    analyzer = require( './analyzer.js' ),
    ugen = require( '../ugen.js' )

module.exports = function( Gibberish ) {
 
let Delay = inputProps => {
  let ssd = Object.create( analyzer )
  ssd.in  = Object.create( ugen )
  ssd.out = Object.create( ugen )

  ssd.id = Gibberish.factory.getUID()

  let props = Object.assign({}, inputProps )
  let isStereo = false//props.input.isStereo !== undefined ? props.input.isStereo : true 
  
  let input = g.in( 'input' )
    
  let historyL = g.history()

  if( isStereo ) {
    // right channel
    let historyR = g.history()

    Gibberish.factory( 
      ssd.out,
      [ historyL.out, historyR.out ], 
      'ssd_out', 
      props 
    )

    ssd.out.callback.ugenName = ssd.out.ugenName = 'ssd_out_' + ssd.id

    const idxL = ssd.out.graph.memory.value.idx, 
          idxR = idxL + 1,
          memory = Gibberish.genish.gen.memory.heap

    const callback = function( input ) {
      'use strict'
      memory[ idxL ] = input[0]
      memory[ idxR ] = input[1]
      return 0     
    }
    
    Gibberish.factory( ssd.in, [ input[0],input[1] ], 'ssd_in', props, callback )

    callback.ugenName = ssd.in.ugenName = 'ssd_in_' + ssd.id
    ssd.in.inputNames = [ 'input' ]
    ssd.in.inputs = [ props.input ]
    ssd.in.input = props.input
    ssd.type = 'analysis'

    ssd.in.listen = function( ugen ) {
      if( ugen !== undefined ) {
        ssd.in.input = ugen
        ssd.in.inputs = [ ugen ]
      }

      if( Gibberish.analyzers.indexOf( ssd.in ) === -1 ) {
        Gibberish.analyzers.push( ssd.in )
      }

      Gibberish.dirty( Gibberish.analyzers )
    }
  }else{
    Gibberish.factory( ssd.out, historyL.out, 'ssd_out', props )

    ssd.out.callback.ugenName = ssd.out.ugenName = 'ssd_out_' + ssd.id

    let idx = ssd.out.graph.memory.value.idx 
    let memory = Gibberish.genish.gen.memory.heap
    let callback = function( input ) {
      'use strict'
      memory[ idx ] = input
      return 0     
    }
    
    Gibberish.factory( ssd.in, input, 'ssd_in', props, callback )

    callback.ugenName = ssd.in.ugenName = 'ssd_in_' + ssd.id
    ssd.in.inputNames = [ 'input' ]
    ssd.in.inputs = [ props.input ]
    ssd.in.input = props.input
    ssd.type = 'analysis'

    ssd.in.listen = function( ugen ) {
      if( ugen !== undefined ) {
        ssd.in.input = ugen
        ssd.in.inputs = [ ugen ]
      }

      if( Gibberish.analyzers.indexOf( ssd.in ) === -1 ) {
        Gibberish.analyzers.push( ssd.in )
      }

      Gibberish.dirty( Gibberish.analyzers )
    }

  }
  
  return ssd
}

Delay.defaults = {
  input:0,
}

return Delay

}

},{"../ugen.js":135,"./analyzer.js":75,"genish.js":37}],79:[function(require,module,exports){
let ugen = require( '../ugen.js' ),
    g = require( 'genish.js' )

module.exports = function( Gibberish ) {

  let AD = function( argumentProps ) {
    let ad = Object.create( ugen ),
        attack  = g.in( 'attack' ),
        decay   = g.in( 'decay' )

    let props = Object.assign( {}, AD.defaults, argumentProps )

    let graph = g.ad( attack, decay )

    Gibberish.factory( ad, graph, 'ad', props )

    ad.trigger = graph.trigger

    return ad
  }

  AD.defaults = { attack:44100, decay:44100 } 

  return AD

}

},{"../ugen.js":135,"genish.js":37}],80:[function(require,module,exports){
let ugen = require( '../ugen.js' ),
    g = require( 'genish.js' )

module.exports = function( Gibberish ) {

  let ADSR = function( argumentProps ) {
    let adsr  = Object.create( ugen ),
        attack  = g.in( 'attack' ),
        decay   = g.in( 'decay' ),
        sustain = g.in( 'sustain' ),
        release = g.in( 'release' ),
        sustainLevel = g.in( 'sustainLevel' )

    let props = Object.assign( {}, ADSR.defaults, argumentProps )

    let graph = g.adsr( attack, decay, sustain, sustainLevel, release, { triggerRelease: props.triggerRelease } )

    Gibberish.factory( adsr, graph, 'adsr', props )

    adsr.trigger = graph.trigger
    adsr.advance = graph.release

    return adsr
  }

  ADSR.defaults = { attack:22050, decay:22050, sustain:44100, sustainLevel:.6, release: 44100, triggerRelease:false } 

  return ADSR
}

},{"../ugen.js":135,"genish.js":37}],81:[function(require,module,exports){
module.exports = function( Gibberish ) {

  const Envelopes = {
    AD     : require( './ad.js' )( Gibberish ),
    ADSR   : require( './adsr.js' )( Gibberish ),
    Ramp   : require( './ramp.js' )( Gibberish ),

    export : target => {
      for( let key in Envelopes ) {
        if( key !== 'export' ) {
          target[ key ] = Envelopes[ key ]
        }
      }
    }
  } 

  return Envelopes
}

},{"./ad.js":79,"./adsr.js":80,"./ramp.js":82}],82:[function(require,module,exports){
const ugen = require( '../ugen.js' ),
      g = require( 'genish.js' )

module.exports = function( Gibberish ) {

  const Ramp = function( argumentProps ) {
    const ramp   = Object.create( ugen ),
          length = g.in( 'length' ),
          from   = g.in( 'from' ),
          to     = g.in( 'to' )

    const props = Object.assign({}, Ramp.defaults, argumentProps )

    const reset = g.bang()

    const phase = g.accum( g.div( 1, length ), reset, { shouldWrap:props.shouldLoop, shouldClamp:true }),
          diff = g.sub( to, from ),
          graph = g.add( from, g.mul( phase, diff ) )

    Gibberish.factory( ramp, graph, 'ramp', props )

    ramp.trigger = reset.trigger

    return ramp
  }

  Ramp.defaults = { from:0, to:1, length:g.gen.samplerate, shouldLoop:false }

  return Ramp

}

},{"../ugen.js":135,"genish.js":37}],83:[function(require,module,exports){
/*
 * https://github.com/antimatter15/heapqueue.js/blob/master/heapqueue.js
 *
 * This implementation is very loosely based off js-priority-queue
 * by Adam Hooper from https://github.com/adamhooper/js-priority-queue
 *
 * The js-priority-queue implementation seemed a teensy bit bloated
 * with its require.js dependency and multiple storage strategies
 * when all but one were strongly discouraged. So here is a kind of
 * condensed version of the functionality with only the features that
 * I particularly needed.
 *
 * Using it is pretty simple, you just create an instance of HeapQueue
 * while optionally specifying a comparator as the argument:
 *
 * var heapq = new HeapQueue();
 *
 * var customq = new HeapQueue(function(a, b){
 *   // if b > a, return negative
 *   // means that it spits out the smallest item first
 *   return a - b;
 * });
 *
 * Note that in this case, the default comparator is identical to
 * the comparator which is used explicitly in the second queue.
 *
 * Once you've initialized the heapqueue, you can plop some new
 * elements into the queue with the push method (vaguely reminiscent
 * of typical javascript arays)
 *
 * heapq.push(42);
 * heapq.push("kitten");
 *
 * The push method returns the new number of elements of the queue.
 *
 * You can push anything you'd like onto the queue, so long as your
 * comparator function is capable of handling it. The default
 * comparator is really stupid so it won't be able to handle anything
 * other than an number by default.
 *
 * You can preview the smallest item by using peek.
 *
 * heapq.push(-9999);
 * heapq.peek(); // ==> -9999
 *
 * The useful complement to to the push method is the pop method,
 * which returns the smallest item and then removes it from the
 * queue.
 *
 * heapq.push(1);
 * heapq.push(2);
 * heapq.push(3);
 * heapq.pop(); // ==> 1
 * heapq.pop(); // ==> 2
 * heapq.pop(); // ==> 3
 */
let HeapQueue = function(cmp){
  this.cmp = (cmp || function(a, b){ return a - b; });
  this.length = 0;
  this.data = [];
}
HeapQueue.prototype.peek = function(){
  return this.data[0];
};
HeapQueue.prototype.push = function(value){
  this.data.push(value);

  var pos = this.data.length - 1,
  parent, x;

  while(pos > 0){
    parent = (pos - 1) >>> 1;
    if(this.cmp(this.data[pos], this.data[parent]) < 0){
      x = this.data[parent];
      this.data[parent] = this.data[pos];
      this.data[pos] = x;
      pos = parent;
    }else break;
  }
  return this.length++;
};
HeapQueue.prototype.pop = function(){
  var last_val = this.data.pop(),
  ret = this.data[0];
  if(this.data.length > 0){
    this.data[0] = last_val;
    var pos = 0,
    last = this.data.length - 1,
    left, right, minIndex, x;
    while(1){
      left = (pos << 1) + 1;
      right = left + 1;
      minIndex = pos;
      if(left <= last && this.cmp(this.data[left], this.data[minIndex]) < 0) minIndex = left;
      if(right <= last && this.cmp(this.data[right], this.data[minIndex]) < 0) minIndex = right;
      if(minIndex !== pos){
        x = this.data[minIndex];
        this.data[minIndex] = this.data[pos];
        this.data[pos] = x;
        pos = minIndex;
      }else break;
    }
  } else {
    ret = last_val;
  }
  this.length--;
  return ret;
};

module.exports = HeapQueue

},{}],84:[function(require,module,exports){
let g = require( 'genish.js' )
 
// constructor for schroeder allpass filters
let allPass = function( _input, length=500, feedback=.5 ) {
  let index  = g.counter( 1,0,length ),
      buffer = g.data( length ),
      bufferSample = g.peek( buffer, index, { interp:'none', mode:'samples' }),
      out = g.memo( g.add( g.mul( -1, _input), bufferSample ) )
                
  g.poke( buffer, g.add( _input, g.mul( bufferSample, feedback ) ), index )
 
  return out
}

module.exports = allPass

},{"genish.js":37}],85:[function(require,module,exports){
let g = require( 'genish.js' ),
    filter = require( './filter.js' )

module.exports = function( Gibberish ) {

  Gibberish.genish.biquad = ( input, cutoff, _Q, mode, isStereo ) => {
    let a0,a1,a2,c,b1,b2,
        in1a0,x1a1,x2a2,y1b1,y2b2,
        in1a0_1,x1a1_1,x2a2_1,y1b1_1,y2b2_1

    let returnValue
    
    const Q = g.memo( g.add( .5, g.mul( _Q, 22 ) ) )
    let x1 = g.history(), x2 = g.history(), y1 = g.history(), y2 = g.history()
    
    let w0 = g.memo( g.mul( 2 * Math.PI, g.div( cutoff,  g.gen.samplerate ) ) ),
        sinw0 = g.sin( w0 ),
        cosw0 = g.cos( w0 ),
        alpha = g.memo( g.div( sinw0, g.mul( 2, Q ) ) )

    let oneMinusCosW = g.sub( 1, cosw0 )

    switch( mode ) {
      case 1:
        a0 = g.memo( g.div( g.add( 1, cosw0) , 2) )
        a1 = g.mul( g.add( 1, cosw0 ), -1 )
        a2 = a0
        c  = g.add( 1, alpha )
        b1 = g.mul( -2 , cosw0 )
        b2 = g.sub( 1, alpha )
        break;
      case 2:
        a0 = g.mul( Q, alpha )
        a1 = 0
        a2 = g.mul( a0, -1 )
        c  = g.add( 1, alpha )
        b1 = g.mul( -2 , cosw0 )
        b2 = g.sub( 1, alpha )
        break;
      default: // LP
        a0 = g.memo( g.div( oneMinusCosW, 2) )
        a1 = oneMinusCosW
        a2 = a0
        c  = g.add( 1, alpha )
        b1 = g.mul( -2 , cosw0 )
        b2 = g.sub( 1, alpha )
    }

    a0 = g.div( a0, c ); a1 = g.div( a1, c ); a2 = g.div( a2, c )
    b1 = g.div( b1, c ); b2 = g.div( b2, c )

    in1a0 = g.mul( x1.in( isStereo ? input[0] : input ), a0 )
    x1a1  = g.mul( x2.in( x1.out ), a1 )
    x2a2  = g.mul( x2.out,          a2 )

    let sumLeft = g.add( in1a0, x1a1, x2a2 )

    y1b1 = g.mul( y2.in( y1.out ), b1 )
    y2b2 = g.mul( y2.out, b2 )

    let sumRight = g.add( y1b1, y2b2 )

    let diff = g.sub( sumLeft, sumRight )

    y1.in( diff )

    if( isStereo ) {
      let x1_1 = g.history(), x2_1 = g.history(), y1_1 = g.history(), y2_1 = g.history()

      in1a0_1 = g.mul( x1_1.in( input[1] ), a0 )
      x1a1_1  = g.mul( x2_1.in( x1_1.out ), a1 )
      x2a2_1  = g.mul( x2_1.out,            a2 )

      let sumLeft_1 = g.add( in1a0_1, x1a1_1, x2a2_1 )

      y1b1_1 = g.mul( y2_1.in( y1_1.out ), b1 )
      y2b2_1 = g.mul( y2_1.out, b2 )

      let sumRight_1 = g.add( y1b1_1, y2b2_1 )

      let diff_1 = g.sub( sumLeft_1, sumRight_1 )

      y1_1.in( diff_1 )
      
      returnValue = [ diff, diff_1 ]
    }else{
      returnValue = diff
    }

    return returnValue
  }

  let Biquad = inputProps => {
    let biquad = Object.create( filter )
    Object.assign( biquad, Biquad.defaults, inputProps ) 

    let isStereo = biquad.input.isStereo

    biquad.__createGraph = function() {
      biquad.graph = Gibberish.genish.biquad( g.in('input'), g.mul( g.in('cutoff'), g.gen.samplerate / 4 ),  g.in('Q'), biquad.mode, isStereo )
    }

    biquad.__createGraph()
    biquad.__requiresRecompilation = [ 'mode' ]

    Gibberish.factory(
      biquad,
      biquad.graph,
      'biquad', 
      biquad
    )

    return biquad
  }

  Biquad.defaults = {
    input:0,
    Q: .15,
    cutoff:.05,
    mode:0
  }

  return Biquad

}


},{"./filter.js":88,"genish.js":37}],86:[function(require,module,exports){
let g = require( 'genish.js' )

let combFilter = function( _input, combLength, damping=.5*.4, feedbackCoeff=.84 ) {
  let lastSample   = g.history(),
  	  readWriteIdx = g.counter( 1,0,combLength ),
      combBuffer   = g.data( combLength ),
	    out          = g.peek( combBuffer, readWriteIdx, { interp:'none', mode:'samples' }),
      storeInput   = g.memo( g.add( g.mul( out, g.sub( 1, damping)), g.mul( lastSample.out, damping ) ) )
      
  lastSample.in( storeInput )
 
  g.poke( combBuffer, g.add( _input, g.mul( storeInput, feedbackCoeff ) ), readWriteIdx )
 
  return out
}

module.exports = combFilter

},{"genish.js":37}],87:[function(require,module,exports){
const g = require( 'genish.js' ),
      filter = require( './filter.js' )

module.exports = function( Gibberish ) {
  Gibberish.genish.diodeZDF = ( input, _Q, freq, saturation, isStereo=false ) => {
    const iT = 1 / g.gen.samplerate,
          kz1 = g.history(0),
          kz2 = g.history(0),
          kz3 = g.history(0),
          kz4 = g.history(0)

    let   ka1 = 1.0,
          ka2 = 0.5,
          ka3 = 0.5,
          ka4 = 0.5,
          kindx = 0   

    const Q = g.memo( g.add( .5, g.mul( _Q, 11 ) ) )
    // kwd = 2 * $M_PI * acf[kindx]
    const kwd = g.memo( g.mul( Math.PI * 2, freq ) )

    // kwa = (2/iT) * tan(kwd * iT/2) 
    const kwa =g.memo( g.mul( 2/iT, g.tan( g.mul( kwd, iT/2 ) ) ) )

    // kG  = kwa * iT/2 
    const kg = g.memo( g.mul( kwa, iT/2 ) )
    
    const kG4 = g.memo( g.mul( .5, g.div( kg, g.add( 1, kg ) ) ) )
    const kG3 = g.memo( g.mul( .5, g.div( kg, g.sub( g.add( 1, kg ), g.mul( g.mul( .5, kg ), kG4 ) ) ) ) )
    const kG2 = g.memo( g.mul( .5, g.div( kg, g.sub( g.add( 1, kg ), g.mul( g.mul( .5, kg ), kG3 ) ) ) ) )
    const kG1 = g.memo( g.div( kg, g.sub( g.add( 1, kg ), g.mul( kg, kG2 ) ) ) )

    const kGAMMA = g.memo( g.mul( g.mul( kG4, kG3 ) , g.mul( kG2, kG1 ) ) )

    const kSG1 = g.memo( g.mul( g.mul( kG4, kG3 ), kG2 ) ) 

    const kSG2 = g.memo( g.mul( kG4, kG3) )  
    const kSG3 = kG4 
    let kSG4 = 1.0 
    // kk = 4.0*(kQ - 0.5)/(25.0 - 0.5)
    const kalpha = g.memo( g.div( kg, g.add(1.0, kg) ) )

    const kbeta1 = g.memo( g.div( 1.0, g.sub( g.add( 1, kg ), g.mul( kg, kG2 ) ) ) )
    const kbeta2 = g.memo( g.div( 1.0, g.sub( g.add( 1, kg ), g.mul( g.mul( .5, kg ), kG3 ) ) ) )
    const kbeta3 = g.memo( g.div( 1.0, g.sub( g.add( 1, kg ), g.mul( g.mul( .5, kg ), kG4 ) ) ) )
    const kbeta4 = g.memo( g.div( 1.0, g.add( 1, kg ) ) ) 

    const kgamma1 = g.memo( g.add( 1, g.mul( kG1, kG2 ) ) )
    const kgamma2 = g.memo( g.add( 1, g.mul( kG2, kG3 ) ) )
    const kgamma3 = g.memo( g.add( 1, g.mul( kG3, kG4 ) ) )

    const kdelta1 = kg
    const kdelta2 = g.memo( g.mul( 0.5, kg ) )
    const kdelta3 = g.memo( g.mul( 0.5, kg ) )

    const kepsilon1 = kG2
    const kepsilon2 = kG3
    const kepsilon3 = kG4

    const klastcut = freq

    //;; feedback inputs 
    const kfb4 = g.memo( g.mul( kbeta4 , kz4.out ) ) 
    const kfb3 = g.memo( g.mul( kbeta3, g.add( kz3.out, g.mul( kfb4, kdelta3 ) ) ) )
    const kfb2 = g.memo( g.mul( kbeta2, g.add( kz2.out, g.mul( kfb3, kdelta2 ) ) ) )

    //;; feedback process

    const kfbo1 = g.memo( g.mul( kbeta1, g.add( kz1.out, g.mul( kfb2, kdelta1 ) ) ) ) 
    const kfbo2 = g.memo( g.mul( kbeta2, g.add( kz2.out, g.mul( kfb3, kdelta2 ) ) ) ) 
    const kfbo3 = g.memo( g.mul( kbeta3, g.add( kz3.out, g.mul( kfb4, kdelta3 ) ) ) ) 
    const kfbo4 = kfb4

    const kSIGMA = g.memo( 
      g.add( 
        g.add( 
          g.mul( kSG1, kfbo1 ), 
          g.mul( kSG2, kfbo2 )
        ), 
        g.add(
          g.mul( kSG3, kfbo3 ), 
          g.mul( kSG4, kfbo4 )
        ) 
      ) 
    )

    //const kSIGMA = 1
    //;; non-linear processing
    //if (knlp == 1) then
    //  kin = (1.0 / tanh(ksaturation)) * tanh(ksaturation * kin)
    //elseif (knlp == 2) then
    //  kin = tanh(ksaturation * kin) 
    //endif
    //
    //const kin = input 
    let kin = input//g.memo( g.mul( g.div( 1, g.tanh( saturation ) ), g.tanh( g.mul( saturation, input ) ) ) )
    kin = g.tanh( g.mul( saturation, kin ) )

    const kun = g.div( g.sub( kin, g.mul( Q, kSIGMA ) ), g.add( 1, g.mul( Q, kGAMMA ) ) )
    //const kun = g.div( 1, g.add( 1, g.mul( Q, kGAMMA ) ) )
        //(kin - kk * kSIGMA) / (1.0 + kk * kGAMMA)

    //;; 1st stage
    let kxin = g.memo( g.add( g.add( g.mul( kun, kgamma1 ), kfb2), g.mul( kepsilon1, kfbo1 ) ) )
    // (kun * kgamma1 + kfb2 + kepsilon1 * kfbo1)
    let kv = g.memo( g.mul( g.sub( g.mul( ka1, kxin ), kz1.out ), kalpha ) )
    //kv = (ka1 * kxin - kz1) * kalpha 
    let klp = g.add( kv, kz1.out )
    //klp = kv + kz1
    kz1.in( g.add( klp, kv ) ) 
    //kz1 = klp + kv

        //;; 2nd stage
    //kxin = (klp * kgamma2 + kfb3 + kepsilon2 * kfbo2)
    //kv = (ka2 * kxin - kz2) * kalpha 
    //klp = kv + kz2
    //kz2 = klp + kv

    kxin = g.memo( g.add( g.add( g.mul( klp, kgamma2 ), kfb3), g.mul( kepsilon2, kfbo2 ) ) )
    // (kun * kgamma1 + kfb2 + kepsilon1 * kfbo1)
    kv = g.memo( g.mul( g.sub( g.mul( ka2, kxin ), kz2.out ), kalpha ) )
    //kv = (ka1 * kxin - kz1) * kalpha 
    klp = g.add( kv, kz2.out ) 
    //klp = kv + kz1
    kz2.in( g.add( klp, kv ) ) 
    //kz1 = klp + kv

    //;; 3rd stage
    //kxin = (klp * kgamma3 + kfb4 + kepsilon3 * kfbo3)
    //kv = (ka3 * kxin - kz3) * kalpha 
    //klp = kv + kz3
    //kz3 = klp + kv

    kxin = g.memo( g.add( g.add( g.mul( klp, kgamma3 ), kfb4), g.mul( kepsilon3, kfbo3 ) ) )
    // (kun * kgamma1 + kfb2 + kepsilon1 * kfbo1)
    kv = g.memo( g.mul( g.sub( g.mul( ka3, kxin ), kz3.out ), kalpha ) )
    //kv = (ka1 * kxin - kz1) * kalpha 
    klp = g.add( kv, kz3.out )
    //klp = kv + kz1
    kz3.in( g.add( klp, kv ) )
    //kz1 = klp + kv

    //;; 4th stage
    //kv = (ka4 * klp - kz4) * kalpha 
    //klp = kv + kz4
    //kz4 = klp + kv

    // (kun * kgamma1 + kfb2 + kepsilon1 * kfbo1)
    kv = g.memo( g.mul( g.sub( g.mul( ka4, kxin ), kz4.out ), kalpha ) )
    //kv = (ka1 * kxin - kz1) * kalpha 
    klp = g.add( kv, kz4.out )
    //klp = kv + kz1
    kz4.in( g.add( klp, kv ) )

    //kz1 = klp + kv
    if( isStereo ) {
      //let polesR = g.data([ 0,0,0,0 ], 1, { meta:true }),
      //    rezzR = g.clamp( g.mul( polesR[3], rez ) ),
      //    outputR = g.sub( input[1], rezzR )         

      //polesR[0] = g.add( polesR[0], g.mul( g.add( g.mul(-1, polesR[0] ), outputR   ), cutoff ))
      //polesR[1] = g.add( polesR[1], g.mul( g.add( g.mul(-1, polesR[1] ), polesR[0] ), cutoff ))
      //polesR[2] = g.add( polesR[2], g.mul( g.add( g.mul(-1, polesR[2] ), polesR[1] ), cutoff ))
      //polesR[3] = g.add( polesR[3], g.mul( g.add( g.mul(-1, polesR[3] ), polesR[2] ), cutoff ))

      //let right = g.switch( isLowPass, polesR[3], g.sub( outputR, polesR[3] ) )

      //returnValue = [left, right]
    }else{
     // returnValue = klp
    }
    returnValue = klp
    
    return returnValue// klp//returnValue
 }

  const DiodeZDF = inputProps => {
    const zdf      = Object.create( filter )
    const props    = Object.assign( {}, DiodeZDF.defaults, inputProps )
    const isStereo = props.input.isStereo 

    Gibberish.factory(
      zdf, 
      Gibberish.genish.diodeZDF( g.in('input'), g.in('Q'), g.in('cutoff'), g.in('saturation'), isStereo ), 
      'diodeZDF',
      props
    )

    return zdf
  }

  DiodeZDF.defaults = {
    input:0,
    Q: 5,
    saturation: 1,
    cutoff: 440,
  }

  return DiodeZDF

}

},{"./filter.js":88,"genish.js":37}],88:[function(require,module,exports){
let ugen = require( '../ugen.js' )

let filter = Object.create( ugen )

Object.assign( filter, {

})

module.exports = filter

},{"../ugen.js":135}],89:[function(require,module,exports){
let g = require( 'genish.js' ),
    filter = require( './filter.js' )

module.exports = function( Gibberish ) {

  Gibberish.genish.filter24 = ( input, _rez, _cutoff, isLowPass, isStereo=false ) => {
    let returnValue,
        polesL = g.data([ 0,0,0,0 ], 1, { meta:true }),
        peekProps = { interp:'none', mode:'simple' },
        rez = g.memo( g.mul( _rez, 5 ) ),
        cutoff = g.memo( g.div( _cutoff, 11025 ) ),
        rezzL = g.clamp( g.mul( polesL[3], rez ) ),
        outputL = g.sub( isStereo ? input[0] : input, rezzL ) 

    polesL[0] = g.add( polesL[0], g.mul( g.add( g.mul(-1, polesL[0] ), outputL   ), cutoff ))
    polesL[1] = g.add( polesL[1], g.mul( g.add( g.mul(-1, polesL[1] ), polesL[0] ), cutoff ))
    polesL[2] = g.add( polesL[2], g.mul( g.add( g.mul(-1, polesL[2] ), polesL[1] ), cutoff ))
    polesL[3] = g.add( polesL[3], g.mul( g.add( g.mul(-1, polesL[3] ), polesL[2] ), cutoff ))
    
    let left = g.switch( isLowPass, polesL[3], g.sub( outputL, polesL[3] ) )

    if( isStereo ) {
      let polesR = g.data([ 0,0,0,0 ], 1, { meta:true }),
          rezzR = g.clamp( g.mul( polesR[3], rez ) ),
          outputR = g.sub( input[1], rezzR )         

      polesR[0] = g.add( polesR[0], g.mul( g.add( g.mul(-1, polesR[0] ), outputR   ), cutoff ))
      polesR[1] = g.add( polesR[1], g.mul( g.add( g.mul(-1, polesR[1] ), polesR[0] ), cutoff ))
      polesR[2] = g.add( polesR[2], g.mul( g.add( g.mul(-1, polesR[2] ), polesR[1] ), cutoff ))
      polesR[3] = g.add( polesR[3], g.mul( g.add( g.mul(-1, polesR[3] ), polesR[2] ), cutoff ))

      let right = g.switch( isLowPass, polesR[3], g.sub( outputR, polesR[3] ) )

      returnValue = [left, right]
    }else{
      returnValue = left
    }

    return returnValue
  }

  let Filter24 = inputProps => {
    let filter24   = Object.create( filter )
    let props    = Object.assign( {}, Filter24.defaults, inputProps )
    let isStereo = props.input.isStereo 

    Gibberish.factory(
      filter24, 
      Gibberish.genish.filter24( g.in('input'), g.in('Q'), g.in('cutoff'), g.in('isLowPass'), isStereo ), 
      'filter24',
      props
    )

    return filter24
  }


  Filter24.defaults = {
    input:0,
    Q: .25,
    cutoff: 880,
    isLowPass:1
  }

  return Filter24

}


},{"./filter.js":88,"genish.js":37}],90:[function(require,module,exports){
module.exports = function( Gibberish ) {

  const g = Gibberish.genish

  const filters = {
    Filter24Classic : require( './filter24.js'  )( Gibberish ),
    Filter24Moog    : require( './ladderFilterZeroDelay.js' )( Gibberish ),
    Filter24TB303   : require( './diodeFilterZDF.js' )( Gibberish ),
    Filter12Biquad  : require( './biquad.js'    )( Gibberish ),
    Filter12SVF     : require( './svf.js'       )( Gibberish ),
    
    // not for use by end-users
    genish: {
      Comb        : require( './combfilter.js' ),
      AllPass     : require( './allpass.js' )
    },

    factory( input, cutoff, resonance, saturation = null, _props, isStereo = false ) {
      let filteredOsc 

      //if( props.filterType === 1 ) {
      //  if( typeof props.cutoff !== 'object' && props.cutoff > 1 ) {
      //    props.cutoff = .25
      //  }
      //  if( typeof props.cutoff !== 'object' && props.filterMult > .5 ) {
      //    props.filterMult = .1
      //  }
      //}
      let props = Object.assign({}, filters.defaults, _props )

      switch( props.filterType ) {
        case 1:
          isLowPass = g.param( 'lowPass', 1 ),
          filteredOsc = g.filter24( input, g.in('Q'), cutoff, props.filterMode, isStereo )
          break;
        case 2:
          filteredOsc = g.zd24( input, g.in('Q'), cutoff )
          break;
        case 3:
          filteredOsc = g.diodeZDF( input, g.in('Q'), cutoff, g.in('saturation'), isStereo ) 
          break;
        case 4:
          filteredOsc = g.svf( input, cutoff, g.sub( 1, g.in('Q')), props.filterMode, isStereo ) 
          break; 
        case 5:
          filteredOsc = g.biquad( input, cutoff,  g.in('Q'), props.filterMode, isStereo ) 
          break; 
        default:
          // return unfiltered signal
          filteredOsc = input //g.filter24( oscWithGain, g.in('resonance'), cutoff, isLowPass )
          break;
      }

      return filteredOsc
    },

    defaults: { filterMode: 0, filterType:0 }
  }

  filters.export = target => {
    for( let key in filters ) {
      if( key !== 'export' && key !== 'genish' ) {
        target[ key ] = filters[ key ]
      }
    }
  }

return filters

}

},{"./allpass.js":84,"./biquad.js":85,"./combfilter.js":86,"./diodeFilterZDF.js":87,"./filter24.js":89,"./ladderFilterZeroDelay.js":91,"./svf.js":92}],91:[function(require,module,exports){
const g = require( 'genish.js' ),
      filter = require( './filter.js' )

module.exports = function( Gibberish ) {

  Gibberish.genish.zd24 = ( input, _Q, freq, isStereo=false ) => {
    const iT = 1 / g.gen.samplerate,
          z1 = g.history(0),
          z2 = g.history(0),
          z3 = g.history(0),
          z4 = g.history(0)
    
    const Q = g.memo( g.add( .5, g.mul( _Q, 23 ) ) )
    // kwd = 2 * $M_PI * acf[kindx]
    const kwd = g.memo( g.mul( Math.PI * 2, freq ) )

    // kwa = (2/iT) * tan(kwd * iT/2) 
    const kwa =g.memo( g.mul( 2/iT, g.tan( g.mul( kwd, iT/2 ) ) ) )

    // kG  = kwa * iT/2 
    const kg = g.memo( g.mul( kwa, iT/2 ) )

    // kk = 4.0*(kQ - 0.5)/(25.0 - 0.5)
    const kk = g.memo( g.mul( 4, g.div( g.sub( Q, .5 ), 24.5 ) ) )

    // kg_plus_1 = (1.0 + kg)
    const kg_plus_1 = g.add( 1, kg )

    // kG = kg / kg_plus_1 
    const kG     = g.memo( g.div( kg, kg_plus_1 ) ),
          kG_2   = g.memo( g.mul( kG, kG ) ),
          kG_3   = g.mul( kG_2, kG ),
          kGAMMA = g.mul( kG_2, kG_2 )

    const kS1 = g.div( z1.out, kg_plus_1 ),
          kS2 = g.div( z2.out, kg_plus_1 ),
          kS3 = g.div( z3.out, kg_plus_1 ),
          kS4 = g.div( z4.out, kg_plus_1 )

    //kS = kG_3 * kS1  + kG_2 * kS2 + kG * kS3 + kS4 
    const kS = g.memo( 
      g.add(
        g.add( g.mul(kG_3, kS1), g.mul( kG_2, kS2) ),
        g.add( g.mul(kG, kS3), kS4 )
      )
    )

    //ku = (kin - kk *  kS) / (1 + kk * kGAMMA)
    const ku1 = g.sub( input, g.mul( kk, kS ) )
    const ku2 = g.memo( g.add( 1, g.mul( kk, kGAMMA ) ) )
    const ku  = g.memo( g.div( ku1, ku2 ) )

    let kv =  g.memo( g.mul( g.sub( ku, z1.out ), kG ) )
    let klp = g.memo( g.add( kv, z1.out ) )
    z1.in( g.add( klp, kv ) )

    kv  = g.memo( g.mul( g.sub( klp, z2.out ), kG ) )
    klp = g.memo( g.add( kv, z2.out ) )
    z2.in( g.add( klp, kv ) )

    kv  = g.memo( g.mul( g.sub( klp, z3.out ), kG ) )
    klp = g.memo( g.add( kv, z3.out ) )
    z3.in( g.add( klp, kv ) )

    kv  = g.memo( g.mul( g.sub( klp, z4.out ), kG ) )
    klp = g.memo( g.add( kv, z4.out ) )
    z4.in( g.add( klp, kv ) )


    if( isStereo ) {
      //let polesR = g.data([ 0,0,0,0 ], 1, { meta:true }),
      //    rezzR = g.clamp( g.mul( polesR[3], rez ) ),
      //    outputR = g.sub( input[1], rezzR )         

      //polesR[0] = g.add( polesR[0], g.mul( g.add( g.mul(-1, polesR[0] ), outputR   ), cutoff ))
      //polesR[1] = g.add( polesR[1], g.mul( g.add( g.mul(-1, polesR[1] ), polesR[0] ), cutoff ))
      //polesR[2] = g.add( polesR[2], g.mul( g.add( g.mul(-1, polesR[2] ), polesR[1] ), cutoff ))
      //polesR[3] = g.add( polesR[3], g.mul( g.add( g.mul(-1, polesR[3] ), polesR[2] ), cutoff ))

      //let right = g.switch( isLowPass, polesR[3], g.sub( outputR, polesR[3] ) )

      //returnValue = [left, right]
    }else{
      returnValue = klp
    }

    return returnValue
  }

  const Zd24 = inputProps => {
    const filter   = Object.create( filter )
    const props    = Object.assign( {}, Zd24.defaults, inputProps )
    const isStereo = props.input.isStereo 

    Gibberish.factory(
      filter, 
      Gibberish.genish.zd24( g.in('input'), g.in('Q'), g.in('cutoff'), isStereo ), 
      'zd24',
      props
    )

    return filter
  }


  Zd24.defaults = {
    input:0,
    Q: 5,
    cutoff: 440,
  }

  return Zd24

}


},{"./filter.js":88,"genish.js":37}],92:[function(require,module,exports){
const g = require( 'genish.js' ),
      filter = require( './filter.js' )

module.exports = function( Gibberish ) {
  Gibberish.genish.svf = ( input, cutoff, Q, mode, isStereo ) => {
    let d1 = g.data([0,0], 1, { meta:true }), d2 = g.data([0,0], 1, { meta:true }),
        peekProps = { mode:'simple', interp:'none' }

    let f1 = g.memo( g.mul( 2 * Math.PI, g.div( cutoff, g.gen.samplerate ) ) )
    let oneOverQ = g.memo( g.div( 1, Q ) )
    let l = g.memo( g.add( d2[0], g.mul( f1, d1[0] ) ) ),
        h = g.memo( g.sub( g.sub( isStereo ? input[0] : input, l ), g.mul( Q, d1[0] ) ) ),
        b = g.memo( g.add( g.mul( f1, h ), d1[0] ) ),
        n = g.memo( g.add( h, l ) )

    d1[0] = b
    d2[0] = l

    let out = g.selector( mode, l, h, b, n )

    let returnValue
    if( isStereo ) {
      let d12 = g.data([0,0], 1, { meta:true }), d22 = g.data([0,0], 1, { meta:true })
      let l2 = g.memo( g.add( d22[0], g.mul( f1, d12[0] ) ) ),
          h2 = g.memo( g.sub( g.sub( input[1], l2 ), g.mul( Q, d12[0] ) ) ),
          b2 = g.memo( g.add( g.mul( f1, h2 ), d12[0] ) ),
          n2 = g.memo( g.add( h2, l2 ) )

      d12[0] = b2
      d22[0] = l2

      let out2 = g.selector( mode, l2, h2, b2, n2 )

      returnValue = [ out, out2 ]
    }else{
      returnValue = out
    }

    return returnValue
  }

  let SVF = inputProps => {
    const svf = Object.create( filter )
    const props = Object.assign( {}, SVF.defaults, inputProps ) 

    const isStereo = props.input.isStereo
    
    // XXX NEEDS REFACTORING
    Gibberish.factory( 
      svf,
      Gibberish.genish.svf( g.in('input'), g.mul( g.in('cutoff'), g.gen.samplerate / 5 ), g.sub( 1, g.in('Q') ), g.in('mode'), isStereo ), 
      'svf', 
      props
    )

    return svf
  }


  SVF.defaults = {
    input:0,
    Q: .75,
    cutoff:.35,
    mode:0
  }

  return SVF

}


},{"./filter.js":88,"genish.js":37}],93:[function(require,module,exports){
let g = require( 'genish.js' ),
    effect = require( './effect.js' )

module.exports = function( Gibberish ) {
 
let BitCrusher = inputProps => {
  let props = Object.assign( { bitCrusherLength: 44100 }, BitCrusher.defaults, inputProps ),
      bitCrusher = Object.create( effect )

  let isStereo = props.input.isStereo !== undefined ? props.input.isStereo : true 
  
  let input = g.in( 'input' ),
      bitDepth = g.in( 'bitDepth' ),
      sampleRate = g.in( 'sampleRate' ),
      leftInput = isStereo ? input[ 0 ] : input,
      rightInput = isStereo ? input[ 1 ] : null
  
  let storeL = g.history(0)
  let sampleReduxCounter = g.counter( sampleRate, 0, 1 )

  let bitMult = g.pow( g.mul( bitDepth, 16 ), 2 )
  let crushedL = g.div( g.floor( g.mul( leftInput, bitMult ) ), bitMult )

  let outL = g.switch(
    sampleReduxCounter.wrap,
    crushedL,
    storeL.out
  )

  if( isStereo ) {
    let storeR = g.history(0)
    let crushedR = g.div( g.floor( g.mul( rightInput, bitMult ) ), bitMult )

    let outR = ternary( 
      sampleReduxCounter.wrap,
      crushedR,
      storeL.out
    )

    Gibberish.factory( 
      bitCrusher,
      [ outL, outR ], 
      'bitCrusher', 
      props 
    )
  }else{
    Gibberish.factory( bitCrusher, outL, 'bitCrusher', props )
  }
  
  return bitCrusher
}

BitCrusher.defaults = {
  input:0,
  bitDepth:.5,
  sampleRate: .5
}

return BitCrusher

}

},{"./effect.js":99,"genish.js":37}],94:[function(require,module,exports){
let g = require( 'genish.js' ),
    effect = require( './effect.js' )

module.exports = function( Gibberish ) {
  let proto = Object.create( effect )

  let Shuffler = inputProps => {
    let bufferShuffler = Object.create( proto ),
        bufferSize = 88200

    let props = Object.assign( {}, Shuffler.defaults, inputProps )

    let isStereo = props.input.isStereo !== undefined ? props.input.isStereo : false
    let phase = g.accum( 1,0,{ shouldWrap: false })

    let input = g.in( 'input' ),
        leftInput = isStereo ? input[ 0 ] : input,
        rightInput = isStereo ? input[ 1 ] : null,
        rateOfShuffling = g.in( 'rate' ),
        chanceOfShuffling = g.in( 'chance' ),
        reverseChance = g.in( 'reverseChance' ),
        repitchChance = g.in( 'repitchChance' ),
        repitchMin = g.in( 'repitchMin' ),
        repitchMax = g.in( 'repitchMax' )

    let pitchMemory = g.history(1)

    let shouldShuffleCheck = g.eq( g.mod( phase, rateOfShuffling ), 0 )
    let isShuffling = g.memo( g.sah( g.lt( g.noise(), chanceOfShuffling ), shouldShuffleCheck, 0 ) ) 

    // if we are shuffling and on a repeat boundary...
    let shuffleChanged = g.memo( g.and( shouldShuffleCheck, isShuffling ) )
    let shouldReverse = g.lt( g.noise(), reverseChance ),
        reverseMod = g.switch( shouldReverse, -1, 1 )

    let pitch = g.ifelse( 
      g.and( shuffleChanged, g.lt( g.noise(), repitchChance ) ),
      g.memo( g.mul( g.add( repitchMin, g.mul( g.sub( repitchMax, repitchMin ), g.noise() ) ), reverseMod ) ),
      reverseMod
    )
    
    // only switch pitches on repeat boundaries
    pitchMemory.in( g.switch( shuffleChanged, pitch, pitchMemory.out ) )

    let fadeLength = g.memo( g.div( rateOfShuffling, 100 ) ),
        fadeIncr = g.memo( g.div( 1, fadeLength ) )

    let bufferL = g.data( bufferSize ), bufferR = isStereo ? g.data( bufferSize ) : null
    let readPhase = g.accum( pitchMemory.out, 0, { shouldWrap:false }) 
    let stutter = g.wrap( g.sub( g.mod( readPhase, bufferSize ), 22050 ), 0, bufferSize )

    let normalSample = g.peek( bufferL, g.accum( 1, 0, { max:88200 }), { mode:'simple' })

    let stutterSamplePhase = g.switch( isShuffling, stutter, g.mod( readPhase, bufferSize ) )
    let stutterSample = g.memo( g.peek( 
      bufferL, 
      stutterSamplePhase,
      { mode:'samples' }
    ) )
    
    let stutterShouldFadeIn = g.and( shuffleChanged, isShuffling )
    let stutterPhase = g.accum( 1, shuffleChanged, { shouldWrap: false })

    let fadeInAmount = g.memo( g.div( stutterPhase, fadeLength ) )
    let fadeOutAmount = g.div( g.sub( rateOfShuffling, stutterPhase ), g.sub( rateOfShuffling, fadeLength ) )
    
    let fadedStutter = g.ifelse(
      g.lt( stutterPhase, fadeLength ),
      g.memo( g.mul( g.switch( g.lt( fadeInAmount, 1 ), fadeInAmount, 1 ), stutterSample ) ),
      g.gt( stutterPhase, g.sub( rateOfShuffling, fadeLength ) ),
      g.memo( g.mul( g.gtp( fadeOutAmount, 0 ), stutterSample ) ),
      stutterSample
    )
    
    let outputL = g.mix( normalSample, fadedStutter, isShuffling ) 

    let pokeL = g.poke( bufferL, leftInput, g.mod( g.add( phase, 44100 ), 88200 ) )

    let panner = g.pan( outputL, outputL, g.in( 'pan' ) )
    
    Gibberish.factory( 
      bufferShuffler,
      [panner.left, panner.right],
      'shuffler', 
      props 
    ) 

    return bufferShuffler
  }
  
  Shuffler.defaults = {
    input:0,
    rate:22050,
    chance:.25,
    reverseChance:.5,
    repitchChance:.5,
    repitchMin:.5,
    repitchMax:2,
    pan:.5,
    mix:.5
  }

  return Shuffler 
}

},{"./effect.js":99,"genish.js":37}],95:[function(require,module,exports){
let g = require( 'genish.js' ),
    effect = require( './effect.js' )

module.exports = function( Gibberish ) {
 
let Chorus = inputProps => {
  const props = Object.assign({}, Chorus.defaults, inputProps )
  
  const chorus = Object.create( Gibberish.prototypes.ugen )

  const input = g.in('input'),
        freq1 = g.in('slowFrequency'),
        freq2 = g.in('fastFrequency'),
        amp1  = g.in('slowGain'),
        amp2  = g.in('fastGain')

  const isStereo = typeof props.input.isStereo !== 'undefined' ? props.input.isStereo : true 

  const leftInput = isStereo ? input[0] : input

  const win0   = g.env( 'inversewelch', 1024 ),
        win120 = g.env( 'inversewelch', 1024, 0, .333 ),
        win240 = g.env( 'inversewelch', 1024, 0, .666 )
  
  const slowPhasor = g.phasor( freq1, 0, { min:0 }),
  		  slowPeek1  = g.mul( g.peek( win0,   slowPhasor ), amp1 ),
        slowPeek2  = g.mul( g.peek( win120, slowPhasor ), amp1 ),
        slowPeek3  = g.mul( g.peek( win240, slowPhasor ), amp1 )
  
  const fastPhasor = g.phasor( freq2, 0, { min:0 }),
  	  	fastPeek1  = g.mul( g.peek( win0,   fastPhasor ), amp2 ),
        fastPeek2  = g.mul( g.peek( win120, fastPhasor ), amp2 ),
        fastPeek3  = g.mul( g.peek( win240, fastPhasor ), amp2 )

  const ms = Gibberish.ctx.sampleRate / 1000 
  const maxDelayTime = 100 * ms

  const time1 =  g.mul( g.add( slowPeek1, fastPeek1, 5 ), ms ),
        time2 =  g.mul( g.add( slowPeek2, fastPeek2, 5 ), ms ),
        time3 =  g.mul( g.add( slowPeek3, fastPeek3, 5 ), ms )

  const delay1L = g.delay( leftInput, time1, { size:maxDelayTime }),
        delay2L = g.delay( leftInput, time2, { size:maxDelayTime }),
        delay3L = g.delay( leftInput, time3, { size:maxDelayTime })

  
  const leftOutput = g.add( delay1L, delay2L, delay3L )
  if( isStereo ) {
    const rightInput = input[1]
    const delay1R = g.delay(rightInput, time1, { size:maxDelayTime }),
          delay2R = g.delay(rightInput, time2, { size:maxDelayTime }),
          delay3R = g.delay(rightInput, time3, { size:maxDelayTime })

    // flip a couple delay lines for stereo effect?
    const rightOutput = g.add( delay1R, delay2L, delay3R )
    chorus.graph = [ g.add( delay1L, delay2R, delay3L ), rightOutput ]
  }else{
    chorus.graph = leftOutput
  }
  
  Gibberish.factory( chorus, chorus.graph, 'chorus', props )

  return chorus
}

Chorus.defaults = {
  input:0,
  slowFrequency: .18,
  slowGain:1,
  fastFrequency:6,
  fastGain:.2
}

return Chorus

}

},{"./effect.js":99,"genish.js":37}],96:[function(require,module,exports){
const g = require('genish.js'),
      effect = require('./effect.js');

const genish = g;

"use jsdsp";

const AllPassChain = (in1, in2, in3) => {
  "use jsdsp";

  /* in1 = predelay_out */
  /* in2 = indiffusion1 */
  /* in3 = indiffusion2 */

  const sub1 = genish.sub(in1, 0);
  const d1 = g.delay(sub1, 142);
  sub1.inputs[1] = genish.mul(d1, in2);
  const ap1_out = genish.add(genish.mul(sub1, in2), d1);

  const sub2 = genish.sub(ap1_out, 0);
  const d2 = g.delay(sub2, 107);
  sub2.inputs[1] = genish.mul(d2, in2);
  const ap2_out = genish.add(genish.mul(sub2, in2), d2);

  const sub3 = genish.sub(ap2_out, 0);
  const d3 = g.delay(sub3, 379);
  sub3.inputs[1] = genish.mul(d3, in3);
  const ap3_out = genish.add(genish.mul(sub3, in3), d3);

  const sub4 = genish.sub(ap3_out, 0);
  const d4 = g.delay(sub4, 277);
  sub4.inputs[1] = genish.mul(d4, in3);
  const ap4_out = genish.add(genish.mul(sub4, in3), d4);

  return ap4_out;
};

/*const tank_outs = Tank( ap_out, decaydiffusion1, decaydiffusion2, damping, decay )*/
const Tank = function (in1, in2, in3, in4, in5) {
  "use jsdsp";

  const outs = [[], [], [], [], []];

  /* LEFT CHANNEL */
  const leftStart = genish.add(in1, 0);
  const delayInput = genish.add(leftStart, 0);
  const delay1 = g.delay(delayInput, [genish.add(genish.mul(g.cycle(.1), 16), 672)], { size: 688 });
  delayInput.inputs[1] = genish.mul(delay1, in2);
  const delayOut = genish.sub(delay1, genish.mul(delayInput, in2));

  const delay2 = g.delay(delayOut, [4453, 353, 3627, 1190]);
  outs[3].push(genish.add(delay2.outputs[1], delay2.outputs[2]));
  outs[2].push(delay2.outputs[3]);

  const mz = g.history(0);
  const ml = g.mix(delay2, mz.out, in4);
  mz.in(ml);

  const mout = genish.mul(ml, in5);

  const s1 = genish.sub(mout, 0);
  const delay3 = g.delay(s1, [1800, 187, 1228]);
  outs[2].push(delay3.outputs[1]);
  outs[4].push(delay3.outputs[2]);
  s1.inputs[1] = genish.mul(delay3, in3);
  const m2 = genish.mul(s1, in3);
  const dl2_out = genish.add(delay3, m2);

  const delay4 = g.delay(dl2_out, [3720, 1066, 2673]);
  outs[2].push(delay4.outputs[1]);
  outs[3].push(delay4.outputs[2]);

  /* RIGHT CHANNEL */
  const rightStart = genish.add(genish.mul(delay4, in5), in1);
  const delayInputR = genish.add(rightStart, 0);
  const delay1R = g.delay(delayInputR, genish.add(genish.mul(g.cycle(.07), 16), 908), { size: 924 });
  delayInputR.inputs[1] = genish.mul(delay1R, in2);
  const delayOutR = genish.sub(delay1R, genish.mul(delayInputR, in2));

  const delay2R = g.delay(delayOutR, [4217, 266, 2974, 2111]);
  outs[1].push(genish.add(delay2R.outputs[1], delay2R.outputs[2]));
  outs[4].push(delay2R.outputs[3]);

  const mzR = g.history(0);
  const mlR = g.mix(delay2R, mzR.out, in4);
  mzR.in(mlR);

  const moutR = genish.mul(mlR, in5);

  const s1R = genish.sub(moutR, 0);
  const delay3R = g.delay(s1R, [2656, 335, 1913]);
  outs[4].push(delay3R.outputs[1]);
  outs[2].push(delay3R.outputs[2]);
  s1R.inputs[1] = genish.mul(delay3R, in3);
  const m2R = genish.mul(s1R, in3);
  const dl2_outR = genish.add(delay3R, m2R);

  const delay4R = g.delay(dl2_outR, [3163, 121, 1996]);
  outs[4].push(delay4.outputs[1]);
  outs[1].push(delay4.outputs[2]);

  leftStart.inputs[1] = genish.mul(delay4R, in5);

  outs[1] = g.add(...outs[1]);
  outs[2] = g.add(...outs[2]);
  outs[3] = g.add(...outs[3]);
  outs[4] = g.add(...outs[4]);
  return outs;
};

module.exports = function (Gibberish) {

  const Reverb = inputProps => {
    const props = Object.assign({}, Reverb.defaults, inputProps),
          reverb = Object.create(effect);

    const isStereo = props.input.isStereo !== undefined ? props.input.isStereo : true;

    const input = g.in('input'),
          damping = g.in('damping'),
          drywet = g.in('drywet'),
          decay = g.in('decay'),
          predelay = g.in('predelay'),
          inbandwidth = g.in('inbandwidth'),
          decaydiffusion1 = g.in('decaydiffusion1'),
          decaydiffusion2 = g.in('decaydiffusion2'),
          indiffusion1 = g.in('indiffusion1'),
          indiffusion2 = g.in('indiffusion2');

    const summedInput = isStereo === true ? g.add(input[0], input[1]) : input;

    {
      'use jsdsp';

      // calculcate predelay
      const predelay_samps = g.mstosamps(predelay);
      const predelay_delay = g.delay(summedInput, predelay_samps, { size: 4410 });
      const z_pd = g.history(0);
      const mix1 = g.mix(z_pd.out, predelay_delay, inbandwidth);
      z_pd.in(mix1);

      const predelay_out = mix1;

      // run input + predelay through all-pass chain
      const ap_out = AllPassChain(predelay_out, indiffusion1, indiffusion2);

      // run filtered signal into "tank" model
      const tank_outs = Tank(ap_out, decaydiffusion1, decaydiffusion2, damping, decay);

      const leftWet = genish.mul(genish.sub(tank_outs[1], tank_outs[2]), .6);
      const rightWet = genish.mul(genish.sub(tank_outs[3], tank_outs[4]), .6);

      // mix wet and dry signal for final output
      const left = g.mix(isStereo ? input[0] : input, leftWet, drywet);
      const right = g.mix(isStereo ? input[1] : input, rightWet, drywet);

      Gibberish.factory(reverb, [left, right], 'dattorro', props);
    }

    return reverb;
  };

  Reverb.defaults = {
    input: 0,
    damping: .5,
    drywet: .5,
    decay: .5,
    predelay: 10,
    inbandwidth: .5,
    indiffusion1: .75,
    indiffusion2: .625,
    decaydiffusion1: .7,
    decaydiffusion2: .5
  };

  return Reverb;
};
},{"./effect.js":99,"genish.js":37}],97:[function(require,module,exports){
let g = require( 'genish.js' ),
    effect = require( './effect.js' )

module.exports = function( Gibberish ) {
 
let Delay = inputProps => {
  let props = Object.assign( { delayLength: 44100 }, Delay.defaults, inputProps ),
      delay = Object.create( effect )

  let isStereo = props.input.isStereo !== undefined ? props.input.isStereo : true 
  
  let input      = g.in( 'input' ),
      delayTime  = g.in( 'delayTime' ),
      wetdry     = g.in( 'wetdry' ),
      leftInput  = isStereo ? input[ 0 ] : input,
      rightInput = isStereo ? input[ 1 ] : null
    
  let feedback = g.in( 'feedback' )

  // left channel
  let feedbackHistoryL = g.history()
  let echoL = g.delay( g.add( leftInput, g.mul( feedbackHistoryL.out, feedback ) ), delayTime, { size:props.delayLength })
  feedbackHistoryL.in( echoL )
  let left = g.mix( leftInput, echoL, wetdry )

  if( isStereo ) {
    // right channel
    let feedbackHistoryR = g.history()
    let echoR = g.delay( g.add( rightInput, g.mul( feedbackHistoryR.out, feedback ) ), delayTime, { size:props.delayLength })
    feedbackHistoryR.in( echoR )
    const right = g.mix( rightInput, echoR, wetdry )

    Gibberish.factory( 
      delay,
      [ left, right ], 
      'delay', 
      props 
    )
  }else{
    Gibberish.factory( delay, left, 'delay', props )
  }
  
  return delay
}

Delay.defaults = {
  input:0,
  feedback:.75,
  delayTime: 11025,
  wetdry: .5
}

return Delay

}

},{"./effect.js":99,"genish.js":37}],98:[function(require,module,exports){
const g = require('genish.js'),
      effect = require('./effect.js');

const genish = g;

/*

         exp(asig * (shape1 + pregain)) - exp(asig * (shape2 - pregain))
  aout = ---------------------------------------------------------------
         exp(asig * pregain)            + exp(-asig * pregain)

*/

module.exports = function (Gibberish) {

  let Distortion = inputProps => {
    let props = Object.assign({}, Distortion.defaults, inputProps),
        distortion = Object.create(effect);

    let isStereo = props.input.isStereo !== undefined ? props.input.isStereo : true;

    const input = g.in('input'),
          shape1 = g.in('shape1'),
          shape2 = g.in('shape2'),
          pregain = g.in('pregain'),
          postgain = g.in('postgain');

    let lout;
    {
      'use jsdsp';
      const linput = isStereo ? input[0] : input;
      const ltop = genish.sub(g.exp(genish.mul(linput, genish.add(shape1, pregain))), g.exp(genish.mul(linput, genish.sub(shape2, pregain))));
      const lbottom = genish.add(g.exp(genish.mul(linput, pregain)), g.exp(genish.mul(genish.mul(-1, linput), pregain)));
      lout = genish.mul(genish.div(ltop, lbottom), postgain);
    }

    if (isStereo) {
      let rout;
      {
        'use jsdsp';
        const rinput = isStereo ? input[1] : input;
        const rtop = genish.sub(g.exp(genish.mul(rinput, genish.add(shape1, pregain))), g.exp(genish.mul(rinput, genish.sub(shape2, pregain))));
        const rbottom = genish.add(g.exp(genish.mul(rinput, pregain)), g.exp(genish.mul(genish.mul(-1, rinput), pregain)));
        rout = genish.mul(genish.div(rtop, rbottom), postgain);
      }

      Gibberish.factory(distortion, [lout, rout], 'distortion', props);
    } else {
      Gibberish.factory(distortion, lout, 'distortion', props);
    }

    return distortion;
  };

  Distortion.defaults = {
    input: 0,
    shape1: .1,
    shape2: .1,
    pregain: 5,
    postgain: .5
  };

  return Distortion;
};
},{"./effect.js":99,"genish.js":37}],99:[function(require,module,exports){
let ugen = require( '../ugen.js' )

let effect = Object.create( ugen )

Object.assign( effect, {

})

module.exports = effect

},{"../ugen.js":135}],100:[function(require,module,exports){
module.exports = function( Gibberish ) {

  const effects = {
    Freeverb    : require( './freeverb.js'  )( Gibberish ),
    Plate       : require( './dattorro.js'  )( Gibberish ),
    Flanger     : require( './flanger.js'   )( Gibberish ),
    Vibrato     : require( './vibrato.js'   )( Gibberish ),
    Delay       : require( './delay.js'     )( Gibberish ),
    BitCrusher  : require( './bitCrusher.js')( Gibberish ),
    Distortion  : require( './distortion.js')( Gibberish ),
    RingMod     : require( './ringMod.js'   )( Gibberish ),
    Tremolo     : require( './tremolo.js'   )( Gibberish ),
    Chorus      : require( './chorus.js'    )( Gibberish ),
    Shuffler    : require( './bufferShuffler.js'  )( Gibberish ),
    Gate        : require( './gate.js'      )( Gibberish ),
  }

  effects.export = target => {
    for( let key in effects ) {
      if( key !== 'export' ) {
        target[ key ] = effects[ key ]
      }
    }
  }

return effects

}

},{"./bitCrusher.js":93,"./bufferShuffler.js":94,"./chorus.js":95,"./dattorro.js":96,"./delay.js":97,"./distortion.js":98,"./flanger.js":101,"./freeverb.js":102,"./gate.js":103,"./ringMod.js":104,"./tremolo.js":105,"./vibrato.js":106}],101:[function(require,module,exports){
let g = require( 'genish.js' ),
    effect = require( './effect.js' )

module.exports = function( Gibberish ) {
 
let Flanger = inputProps => {
  let props   = Object.assign( { delayLength:44100 }, Flanger.defaults, inputProps ),
      flanger = Object.create( effect )

  let isStereo = props.input.isStereo !== undefined ? props.input.isStereo : true 
  
  let input = g.in( 'input' ),
      delayLength = props.delayLength,
      feedbackCoeff = g.in( 'feedback' ),
      modAmount = g.in( 'offset' ),
      frequency = g.in( 'frequency' ),
      delayBufferL = g.data( delayLength ),
      delayBufferR

  let writeIdx = g.accum( 1,0, { min:0, max:delayLength, interp:'none', mode:'samples' })
  
  let offset = g.mul( modAmount, 500 )

  let mod = props.mod === undefined ? g.cycle( frequency ) : props.mod
  
  let readIdx = g.wrap( 
    g.add( 
      g.sub( writeIdx, offset ), 
      mod//g.mul( mod, g.sub( offset, 1 ) ) 
    ), 
	  0, 
    delayLength
  )

  let leftInput = isStereo ? input[0] : input

  let delayedOutL = g.peek( delayBufferL, readIdx, { interp:'linear', mode:'samples' })
  
  g.poke( delayBufferL, g.add( leftInput, g.mul( delayedOutL, feedbackCoeff ) ), writeIdx )

  let left = g.add( leftInput, delayedOutL ),
      right

  if( isStereo === true ) {
    rightInput = input[1]
    delayBufferR = g.data( delayLength )
    
    let delayedOutR = g.peek( delayBufferR, readIdx, { interp:'linear', mode:'samples' })

    g.poke( delayBufferR, g.add( rightInput, g.mul( delayedOutR, feedbackCoeff ) ), writeIdx )
    right = g.add( rightInput, delayedOutR )

    Gibberish.factory( 
      flanger,
      [ left, right ], 
      'flanger', 
      props 
    )

  }else{
    Gibberish.factory( flanger, left, 'flanger', props )
  }
  
  return flanger
}

Flanger.defaults = {
  input:0,
  feedback:.01,
  offset:.25,
  frequency:.5
}

return Flanger

}

},{"./effect.js":99,"genish.js":37}],102:[function(require,module,exports){
const g = require( 'genish.js' ),
      effect = require( './effect.js' )

module.exports = function( Gibberish ) {
  
const allPass = Gibberish.filters.genish.AllPass
const combFilter = Gibberish.filters.genish.Comb

const tuning = {
  combCount:	  	8,
  combTuning: 		[ 1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617 ],                    
  allPassCount: 	4,
  allPassTuning:	[ 225, 556, 441, 341 ],
  allPassFeedback:0.5,
  fixedGain: 		  0.015,
  scaleDamping: 	0.4,
  scaleRoom: 		  0.28,
  offsetRoom: 	  0.7,
  stereoSpread:   23
}

const Freeverb = inputProps => {
  let props = Object.assign( {}, Freeverb.defaults, inputProps ),
      reverb = Object.create( effect ) 
   
  let isStereo = props.input.isStereo !== undefined ? props.input.isStereo : true 
  
  let combsL = [], combsR = []

  let input = g.in( 'input' ),
      wet1 = g.in( 'wet1'), wet2 = g.in( 'wet2' ),  dry = g.in( 'dry' ), 
      roomSize = g.in( 'roomSize' ), damping = g.in( 'damping' )
  
  let summedInput = isStereo === true ? g.add( input[0], input[1] ) : input,
      attenuatedInput = g.memo( g.mul( summedInput, tuning.fixedGain ) )
  
  // create comb filters in parallel...
  for( let i = 0; i < 8; i++ ) { 
    combsL.push( 
      combFilter( attenuatedInput, tuning.combTuning[i], g.mul(damping,.4), g.mul( tuning.scaleRoom + tuning.offsetRoom, roomSize ) ) 
    )
    combsR.push( 
      combFilter( attenuatedInput, tuning.combTuning[i] + tuning.stereoSpread, g.mul(damping,.4), g.mul( tuning.scaleRoom + tuning.offsetRoom, roomSize ) ) 
    )
  }
  
  // ... and sum them with attenuated input
  let outL = g.add( attenuatedInput, ...combsL )
  let outR = g.add( attenuatedInput, ...combsR )
  
  // run through allpass filters in series
  for( let i = 0; i < 4; i++ ) { 
    outL = allPass( outL, tuning.allPassTuning[ i ] + tuning.stereoSpread )
    outR = allPass( outR, tuning.allPassTuning[ i ] + tuning.stereoSpread )
  }
  
  let outputL = g.add( g.mul( outL, wet1 ), g.mul( outR, wet2 ), g.mul( isStereo === true ? input[0] : input, dry ) ),
      outputR = g.add( g.mul( outR, wet1 ), g.mul( outL, wet2 ), g.mul( isStereo === true ? input[1] : input, dry ) )

  Gibberish.factory( reverb, [ outputL, outputR ], 'freeverb', props )

  return reverb
}


Freeverb.defaults = {
  input:0,
  wet1: 1,
  wet2: 0,
  dry: .5,
  roomSize: .84,
  damping:  .5
}

return Freeverb 

}


},{"./effect.js":99,"genish.js":37}],103:[function(require,module,exports){
let g = require('genish.js'),
    effect = require('./effect.js');

module.exports = function (Gibberish) {

  let Gate = inputProps => {
    let props = Object.assign({}, Gate.defaults, inputProps),
        gate = Object.create(effect);

    let isStereo = props.input.isStereo !== undefined ? props.input.isStereo : true;

    let input = g.in('input'),
        threshold = g.in('threshold');

    let leftInput = isStereo ? input[0] : input;

    let leftThreshold = g.gtp(g.abs(leftInput), threshold),
        left = g.switch(g.neq(leftThreshold, 0), leftInput, 0);

    if (isStereo === true) {
      let rightInput = input[1];
      let rightThreshold = g.gtp(g.abs(rightInput), threshold),
          right = g.switch(g.neq(rightThreshold, 0), rightInput, 0);

      /*right = g.add( g.mul( rightInput, g.sub( 1, mix )), g.mul( g.mul( rightInput, sine ), mix ) ) */

      Gibberish.factory(gate, [left, right], 'gate', props);
    } else {
      Gibberish.factory(gate, left, 'gate', props);
    }

    return gate;
  };

  Gate.defaults = {
    input: 0,
    threshold: .1
  };

  return Gate;
};
},{"./effect.js":99,"genish.js":37}],104:[function(require,module,exports){
let g = require( 'genish.js' ),
    effect = require( './effect.js' )

module.exports = function( Gibberish ) {
 
let RingMod = inputProps => {
  let props   = Object.assign( {}, RingMod.defaults, inputProps ),
      ringMod = Object.create( effect )

  let isStereo = props.input.isStereo !== undefined ? props.input.isStereo : true 
  
  let input = g.in( 'input' ),
      frequency = g.in( 'frequency' ),
      gain = g.in( 'gain' ),
      mix = g.in( 'mix' )
  
  let leftInput = isStereo ? input[0] : input,
      sine = g.mul( g.cycle( frequency ), gain )
 
  let left = g.add( g.mul( leftInput, g.sub( 1, mix )), g.mul( g.mul( leftInput, sine ), mix ) ), 
      right

  if( isStereo === true ) {
    let rightInput = input[1]
    right = g.add( g.mul( rightInput, g.sub( 1, mix )), g.mul( g.mul( rightInput, sine ), mix ) ) 
    
    Gibberish.factory( 
      ringMod,
      [ left, right ], 
      'ringMod', 
      props 
    )
  }else{
    Gibberish.factory( ringMod, left, 'ringMod', props )
  }
  
  return ringMod
}

RingMod.defaults = {
  input:0,
  frequency:220,
  gain: 1, 
  mix:1
}

return RingMod

}

},{"./effect.js":99,"genish.js":37}],105:[function(require,module,exports){
const g = require( 'genish.js' ),
      effect = require( './effect.js' )

module.exports = function( Gibberish ) {
 
const Tremolo = inputProps => {
  const props   = Object.assign( {}, Tremolo.defaults, inputProps ),
        tremolo = Object.create( effect )

  const isStereo = props.input.isStereo !== undefined ? props.input.isStereo : true 
  
  const input = g.in( 'input' ),
        frequency = g.in( 'frequency' ),
        amount = g.in( 'amount' )
  
  const leftInput = isStereo ? input[0] : input

  let osc
  if( props.shape === 'square' ) {
    osc = g.gt( g.phasor( frequency ), 0 )
  }else if( props.shape === 'saw' ) {
    osc = g.gtp( g.phasor( frequency ), 0 )
  }else{
    osc = g.cycle( frequency )
  }

  const mod = g.mul( osc, amount )
 
  let left = g.sub( leftInput, g.mul( leftInput, mod ) ), 
      right

  if( isStereo === true ) {
    let rightInput = input[1]
    right = g.mul( rightInput, mod )

    Gibberish.factory( 
      tremolo,
      [ left, right ], 
      'tremolo', 
      props 
    )
  }else{
    Gibberish.factory( tremolo, left, 'tremolo', props )
  }
  
  return tremolo
}

Tremolo.defaults = {
  input:0,
  frequency:2,
  amount: 1, 
  shape:'sine'
}

return Tremolo

}

},{"./effect.js":99,"genish.js":37}],106:[function(require,module,exports){
let g = require( 'genish.js' ),
    effect = require( './effect.js' )

module.exports = function( Gibberish ) {
 
let Vibrato = inputProps => {
  let props   = Object.assign( {}, Vibrato.defaults, inputProps ),
      vibrato = Object.create( effect )

  let isStereo = props.input.isStereo !== undefined ? props.input.isStereo : true 
  
  let input = g.in( 'input' ),
      delayLength = 44100,
      feedbackCoeff = .01,//g.in( 'feedback' ),
      modAmount = g.in( 'amount' ),
      frequency = g.in( 'frequency' ),
      delayBufferL = g.data( delayLength ),
      delayBufferR

  let writeIdx = g.accum( 1,0, { min:0, max:delayLength, interp:'none', mode:'samples' })
  
  let offset = g.mul( modAmount, 500 )
  
  let readIdx = g.wrap( 
    g.add( 
      g.sub( writeIdx, offset ), 
      g.mul( g.cycle( frequency ), g.sub( offset, 1 ) ) 
    ), 
	  0, 
    delayLength
  )

  let leftInput = isStereo ? input[0] : input

  let delayedOutL = g.peek( delayBufferL, readIdx, { interp:'linear', mode:'samples' })
  
  g.poke( delayBufferL, g.add( leftInput, g.mul( delayedOutL, feedbackCoeff ) ), writeIdx )

  let left = delayedOutL,
      right

  if( isStereo === true ) {
    rightInput = input[1]
    delayBufferR = g.data( delayLength )
    
    let delayedOutR = g.peek( delayBufferR, readIdx, { interp:'linear', mode:'samples' })

    g.poke( delayBufferR, g.add( rightInput, mul( delayedOutR, feedbackCoeff ) ), writeIdx )
    right = delayedOutR

    Gibberish.factory( 
      vibrato,
      [ left, right ], 
      'vibrato', 
      props 
    )
  }else{
    Gibberish.factory( vibrato, left, 'vibrato', props )
  }
  
  return vibrato
}

Vibrato.defaults = {
  input:0,
  //feedback:.01,
  amount:.5,
  frequency:4
}

return Vibrato

}

},{"./effect.js":99,"genish.js":37}],107:[function(require,module,exports){
let MemoryHelper = require( 'memory-helper' ),
    genish       = require( 'genish.js' )
    
let Gibberish = {
  blockCallbacks: [], // called every block
  dirtyUgens: [],
  callbackUgens: [],
  callbackNames: [],
  analyzers: [],
  graphIsDirty: false,
  ugens: {},
  debug: false,

  output: null,

  memory : null, // 20 minutes by default?
  factory: null, 
  genish,
  scheduler: require( './scheduling/scheduler.js' ),

  memoed: {},

  prototypes: {
    ugen: require('./ugen.js'),
    instrument: require( './instruments/instrument.js' ),
    effect: require( './fx/effect.js' ),
  },

  mixins: {
    polyinstrument: require( './instruments/polyMixin.js' )
  },

  init( memAmount ) {
    let numBytes = memAmount === undefined ? 20 * 60 * 44100 : memAmount

    this.memory = MemoryHelper.create( numBytes )

    this.load()
    
    this.output = this.Bus2()

    this.utilities.createContext()
    this.utilities.createScriptProcessor()

    this.analyzers.dirty = false

    // XXX FOR DEVELOPMENT AND TESTING ONLY... REMOVE FOR PRODUCTION
    this.export( window )
  },

  load() {
    this.factory = require( './ugenTemplate.js' )( this )

    this.PolyTemplate = require( './instruments/polytemplate.js' )( this )
    this.oscillators  = require( './oscillators/oscillators.js' )( this )
    this.filters      = require( './filters/filters.js' )( this )
    this.binops       = require( './misc/binops.js' )( this )
    this.monops       = require( './misc/monops.js' )( this )
    this.Bus          = require( './misc/bus.js' )( this )
    this.Bus2         = require( './misc/bus2.js' )( this );
    this.instruments  = require( './instruments/instruments.js' )( this )
    this.fx           = require( './fx/effects.js' )( this )
    this.Sequencer    = require( './scheduling/sequencer.js' )( this );
    this.Sequencer2   = require( './scheduling/seq2.js' )( this );
    this.envelopes    = require( './envelopes/envelopes.js' )( this );
    this.analysis     = require( './analysis/analyzers.js' )( this )
    this.time         = require( './misc/time.js' )( this )
  },

  export( target, shouldExportGenish=false ) {
    if( target === undefined ) throw Error('You must define a target object for Gibberish to export variables to.')

    if( shouldExportGenish ) this.genish.export( target )

    this.instruments.export( target )
    this.fx.export( target )
    this.filters.export( target )
    this.oscillators.export( target )
    this.binops.export( target )
    this.monops.export( target )
    this.envelopes.export( target )
    this.analysis.export( target )
    target.Sequencer = this.Sequencer
    target.Sequencer2 = this.Sequencer2
    target.Bus = this.Bus
    target.Bus2 = this.Bus2
    target.Scheduler = this.scheduler
    this.time.export( target )
  },

  print() {
    console.log( this.callback.toString() )
  },

  dirty( ugen ) {
    if( ugen === this.analyzers ) {
      this.graphIsDirty = true
      this.analyzers.dirty = true
    } else {
      this.dirtyUgens.push( ugen )
      this.graphIsDirty = true
      if( this.memoed[ ugen.ugenName ] ) {
        delete this.memoed[ ugen.ugenName ]
      }
    } 
  },

  clear() {
    this.output.inputs = [0]
    this.output.inputNames.length = 0
    this.analyzers.length = 0
    this.scheduler.clear()
    this.dirty( this.output )
  },

  generateCallback() {
    let uid = 0,
        callbackBody, lastLine, analysis=''

    this.memoed = {}

    callbackBody = this.processGraph( this.output )
    lastLine = callbackBody[ callbackBody.length - 1]
    callbackBody.unshift( "\t'use strict';" )

    this.analyzers.forEach( v=> {
      const analysisBlock = Gibberish.processUgen( v )
      const analysisLine = analysisBlock.pop()

      analysisBlock.forEach( v=> {
        callbackBody.splice( callbackBody.length - 1, 0, v )
      })

      callbackBody.push( analysisLine )
    })

    this.analyzers.forEach( v => {
      if( this.callbackUgens.indexOf( v.callback ) === -1 )
        this.callbackUgens.push( v.callback )
    })
    this.callbackNames = this.callbackUgens.map( v => v.ugenName )

    callbackBody.push( '\n\treturn ' + lastLine.split( '=' )[0].split( ' ' )[1] )

    if( this.debug ) console.log( 'callback:\n', callbackBody.join('\n') )
    this.callbackNames.push( 'memory' )
    this.callbackUgens.push( this.memory.heap )
    this.callback = Function( ...this.callbackNames, callbackBody.join( '\n' ) )
    this.callback.out = []

    if( this.oncallback ) this.oncallback( this.callback )

    return this.callback 
  },

  processGraph( output ) {
    this.callbackUgens.length = 0
    this.callbackNames.length = 0

    this.callbackUgens.push( output.callback )

    let body = this.processUgen( output )
    

    this.dirtyUgens.length = 0
    this.graphIsDirty = false

    return body
  },

  processUgen( ugen, block ) {
    if( block === undefined ) block = []

    let dirtyIdx = Gibberish.dirtyUgens.indexOf( ugen )

    //console.log( 'ugenName:', ugen.ugenName )
    let memo = Gibberish.memoed[ ugen.ugenName ]

    if( memo !== undefined ) {
      return memo
    } else if (ugen === true || ugen === false) {
      throw "Why is ugen a boolean? [true] or [false]";
    } else if( ugen.block === undefined || dirtyIndex !== -1 ) {
  
      let line = `\tvar v_${ugen.id} = ` 
      
      if( !ugen.binop ) line += `${ugen.ugenName}( `

      // must get array so we can keep track of length for comma insertion
      let keys,err
      
      //try {
      keys = ugen.binop || ugen.type === 'bus' || ugen.type === 'analysis' ? Object.keys( ugen.inputs ) : Object.keys( ugen.inputNames )

      //}catch( e ){

      //  console.log( e )
      //  err = true
      //}
      
      //if( err === true ) return

      for( let i = 0; i < keys.length; i++ ) {
        let key = keys[ i ]
        // binop.inputs is actual values, not just property names
        let input 
        if( ugen.binop || ugen.type ==='bus' ) {
          input = ugen.inputs[ key ]
        }else{
          //if( key === 'memory' ) continue;
  
          input = ugen[ ugen.inputNames[ key ] ]
        }

        if( input !== undefined ) { 
          if( typeof input === 'number' ) {
              line += input
          } else if( typeof input === 'boolean' ) {
              line += ""+input
          }else{
            //console.log( 'key:', key, 'input:', ugen.inputs, ugen.inputs[ key ] ) 

            Gibberish.processUgen( input, block )

            //if( input.callback === undefined ) continue

            if( !input.binop ) {
              // check is needed so that graphs with ssds that refer to themselves
              // don't add the ssd in more than once
              if( Gibberish.callbackUgens.indexOf( input.callback ) === -1 ) {
                Gibberish.callbackUgens.push( input.callback )
              }
            }

            line += `v_${input.id}`
          }

          if( i < keys.length - 1 ) {
            line += ugen.binop ? ' ' + ugen.op + ' ' : ', ' 
          }
        }
      }
      
      //if( ugen.type === 'bus' ) line += ', ' 
      if( ugen.type === 'analysis' ) line += ','
      if( !ugen.binop && ugen.type !== 'bus' && ugen.type !== 'seq' ) line += 'memory'
      line += ugen.binop ? '' : ' )'

      block.push( line )
      
      //console.log( 'memo:', ugen.ugenName )
      Gibberish.memoed[ ugen.ugenName ] = `v_${ugen.id}`

      if( dirtyIdx !== -1 ) {
        Gibberish.dirtyUgens.splice( dirtyIdx, 1 )
      }

    }else if( ugen.block ) {
      return ugen.block
    }

    return block
  },
    
}

Gibberish.utilities = require( './utilities.js' )( Gibberish )


module.exports = Gibberish

},{"./analysis/analyzers.js":76,"./envelopes/envelopes.js":81,"./filters/filters.js":90,"./fx/effect.js":99,"./fx/effects.js":100,"./instruments/instrument.js":112,"./instruments/instruments.js":113,"./instruments/polyMixin.js":117,"./instruments/polytemplate.js":118,"./misc/binops.js":122,"./misc/bus.js":123,"./misc/bus2.js":124,"./misc/monops.js":125,"./misc/time.js":126,"./oscillators/oscillators.js":129,"./scheduling/scheduler.js":132,"./scheduling/seq2.js":133,"./scheduling/sequencer.js":134,"./ugen.js":135,"./ugenTemplate.js":136,"./utilities.js":137,"genish.js":37,"memory-helper":74}],108:[function(require,module,exports){
let g = require( 'genish.js' ),
    instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  let Conga = argumentProps => {
    let conga = Object.create( instrument ),
        frequency = g.in( 'frequency' ),
        decay = g.in( 'decay' ),
        gain  = g.in( 'gain' )

    let props = Object.assign( {}, Conga.defaults, argumentProps )

    let trigger = g.bang(),
        impulse = g.mul( trigger, 60 ),
        _decay =  g.sub( .101, g.div( decay, 10 ) ), // create range of .001 - .099
        bpf = g.svf( impulse, frequency, _decay, 2, false ),
        out = g.mul( bpf, gain )
    
    Gibberish.factory( conga, out, 'conga', props  )
    
    conga.env = trigger

    return conga
  }
  
  Conga.defaults = {
    gain: .25,
    frequency:190,
    decay: .85
  }

  return Conga

}

},{"./instrument.js":112,"genish.js":37}],109:[function(require,module,exports){
let g = require( 'genish.js' ),
    instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  const Cowbell = argumentProps => {
    const cowbell = Object.create( instrument ),
          decay   = g.in( 'decay' ),
          gain    = g.in( 'gain' )

    const props = Object.assign( {}, Cowbell.defaults, argumentProps )

    const bpfCutoff = g.param( 'bpfc', 1000 ),
          s1 = Gibberish.oscillators.factory( 'square', 560 ),
          s2 = Gibberish.oscillators.factory( 'square', 845 ),
          eg = g.decay( g.mul( decay, g.gen.samplerate * 2 ) ), 
          bpf = g.svf( g.add( s1,s2 ), bpfCutoff, 3, 2, false ),
          envBpf = g.mul( bpf, eg ),
          out = g.mul( envBpf, gain )

    Gibberish.factory( cowbell, out, 'cowbell', props  )
    
    cowbell.env = eg 

    cowbell.isStereo = false

    return cowbell
  }
  
  Cowbell.defaults = {
    gain: 1,
    decay:.5
  }

  return Cowbell

}

},{"./instrument.js":112,"genish.js":37}],110:[function(require,module,exports){
let g = require( 'genish.js' ),
    instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  let FM = inputProps => {
    let syn = Object.create( instrument )

    let env = g.ad( g.in('attack'), g.in('decay'), { shape:'linear' }),
        frequency = g.in( 'frequency' ),
        glide = g.in( 'glide' ),
        slidingFreq = g.slide( frequency, glide, glide ),
        cmRatio = g.in( 'cmRatio' ),
        index = g.in( 'index' )

    let props = Object.assign( syn, FM.defaults, inputProps )

    syn.__createGraph = function() {
      let modOsc = Gibberish.oscillators.factory( syn.modulatorWaveform, g.mul( slidingFreq, cmRatio ), syn.antialias )
      let modOscWithIndex = g.mul( modOsc, g.mul( slidingFreq, index ) )
      let modOscWithEnv   = g.mul( modOscWithIndex, env )

      let carrierOsc = Gibberish.oscillators.factory( syn.carrierWaveform, g.add( slidingFreq, modOscWithEnv ), syn.antialias )
      let carrierOscWithEnv = g.mul( carrierOsc, env )
      
      let cutoff = g.add( g.in('cutoff'), g.mul( g.in('filterMult'), env ) )
      const filteredOsc = Gibberish.filters.factory( carrierOscWithEnv, cutoff, g.in('Q'), g.in('saturation'), syn )

      let synthWithGain = g.mul( filteredOsc, g.in( 'gain' ) ),
          panner

      if( props.panVoices === true ) { 
        panner = g.pan( synthWithGain, synthWithGain, g.in( 'pan' ) ) 
        syn.graph = [panner.left, panner.right ]
      }else{
        syn.graph = synthWithGain
      }
    }
    
    syn.__requiresRecompilation = [ 'carrierWaveform', 'modulatorWaveform', 'antialias', 'filterType', 'filterMode' ]
    syn.__createGraph()

    Gibberish.factory( syn, syn.graph , 'fm', syn )

    syn.env = env

    return syn
  }

  FM.defaults = {
    carrierWaveform:'sine',
    modulatorWaveform:'sine',
    attack: 44100,
    decay: 44100,
    gain: 1,
    cmRatio:2,
    index:5,
    pulsewidth:.25,
    frequency:220,
    pan: .5,
    antialias:false,
    panVoices:false,
    glide:1,
    saturation:1,
    filterMult:440,
    Q:.25,
    cutoff:3520,
    filterType:0,
    filterMode:0,
    isLowPass:1
  }

  let PolyFM = Gibberish.PolyTemplate( FM, ['glide','frequency','attack','decay','pulsewidth','pan','gain','cmRatio','index', 'saturation', 'filterMult', 'Q', 'cutoff', 'antialias', 'filterType', 'carrierWaveform', 'modulatorWaveform','filterMode' ] ) 

  return [ FM, PolyFM ]

}

},{"./instrument.js":112,"genish.js":37}],111:[function(require,module,exports){
let g = require( 'genish.js' ),
    instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  let Hat = argumentProps => {
    let hat = Object.create( instrument ),
        tune  = g.in( 'tune' ),
        scaledTune = g.memo( g.add( .4, tune ) ),
        decay  = g.in( 'decay' ),
        gain  = g.in( 'gain' )

    let props = Object.assign( {}, Hat.defaults, argumentProps )

    let baseFreq = g.mul( 325, scaledTune ), // range of 162.5 - 487.5
        bpfCutoff = g.mul( g.param( 'bpfc', 7000 ), scaledTune ),
        hpfCutoff = g.mul( g.param( 'hpfc', 11000 ), scaledTune ),  
        s1 = Gibberish.oscillators.factory( 'square', baseFreq, false ),
        s2 = Gibberish.oscillators.factory( 'square', g.mul( baseFreq,1.4471 ) ),
        s3 = Gibberish.oscillators.factory( 'square', g.mul( baseFreq,1.6170 ) ),
        s4 = Gibberish.oscillators.factory( 'square', g.mul( baseFreq,1.9265 ) ),
        s5 = Gibberish.oscillators.factory( 'square', g.mul( baseFreq,2.5028 ) ),
        s6 = Gibberish.oscillators.factory( 'square', g.mul( baseFreq,2.6637 ) ),
        sum = g.add( s1,s2,s3,s4,s5,s6 ),
        eg = g.decay( g.mul( decay, g.gen.samplerate * 2 ) ), 
        bpf = g.svf( sum, bpfCutoff, .5, 2, false ),
        envBpf = g.mul( bpf, eg ),
        hpf = g.filter24( envBpf, 0, hpfCutoff, 0 ),
        out = g.mul( hpf, gain )

    Gibberish.factory( hat, out, 'hat', props  )
    
    hat.env = eg 

    hat.isStereo = false
    return hat
  }
  
  Hat.defaults = {
    gain:  1,
    tune: .6,
    decay:.1,
  }

  return Hat

}

},{"./instrument.js":112,"genish.js":37}],112:[function(require,module,exports){
let ugen = require( '../ugen.js' ),
    g = require( 'genish.js' )

let instrument = Object.create( ugen )

Object.assign( instrument, {
  note( freq ) {
    this.frequency = freq
    this.env.trigger()
  },

  trigger( _gain = 1 ) {
    this.gain = _gain
    this.env.trigger()
  },

})

module.exports = instrument

},{"../ugen.js":135,"genish.js":37}],113:[function(require,module,exports){
module.exports = function( Gibberish ) {

const instruments = {
  Kick        : require( './kick.js' )( Gibberish ),
  Conga       : require( './conga.js' )( Gibberish ),
  Clave       : require( './conga.js' )( Gibberish ), // clave is same as conga with different defaults, see below
  Hat         : require( './hat.js' )( Gibberish ),
  Snare       : require( './snare.js' )( Gibberish ),
  Cowbell     : require( './cowbell.js' )( Gibberish )
}

instruments.Clave.defaults.frequency = 2500
instruments.Clave.defaults.decay = .5;

[ instruments.Synth, instruments.PolySynth ]     = require( './synth.js' )( Gibberish );
[ instruments.Monosynth, instruments.PolyMono ]  = require( './monosynth.js' )( Gibberish );
[ instruments.FM, instruments.PolyFM ]           = require( './fm.js' )( Gibberish );
[ instruments.Sampler, instruments.PolySampler ] = require( './sampler.js' )( Gibberish );
[ instruments.Karplus, instruments.PolyKarplus ] = require( './karplusstrong.js' )( Gibberish );

instruments.export = target => {
  for( let key in instruments ) {
    if( key !== 'export' ) {
      target[ key ] = instruments[ key ]
    }
  }
}

return instruments

}

},{"./conga.js":108,"./cowbell.js":109,"./fm.js":110,"./hat.js":111,"./karplusstrong.js":114,"./kick.js":115,"./monosynth.js":116,"./sampler.js":119,"./snare.js":120,"./synth.js":121}],114:[function(require,module,exports){
const g = require( 'genish.js' ),
      instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  const KPS = inputProps => {

    const props = Object.assign( {}, KPS.defaults, inputProps )
    const syn = Object.create( instrument ),
          trigger = g.bang(),
          phase = g.accum( 1, trigger, { max:Infinity } ),
          env = g.gtp( g.sub( 1, g.div( phase, 200 ) ), 0 ),
          impulse = g.mul( g.noise(), env ),
          feedback = g.history(),
          frequency = g.in('frequency'),
          glide = g.in( 'glide' ),
          slidingFrequency = g.slide( frequency, glide, glide ),
          delay = g.delay( g.add( impulse, feedback.out ), g.div( Gibberish.ctx.sampleRate, slidingFrequency ), { size:2048 }),
          decayed = g.mul( delay, g.t60( g.mul( g.in('decay'), slidingFrequency ) ) ),
          damped =  g.mix( decayed, feedback.out, g.in('damping') ),
          withGain = g.mul( damped, g.in('gain') )

    feedback.in( damped )

    const properties = Object.assign( {}, KPS.defaults, props )

    if( properties.panVoices ) {  
      const panner = g.pan( withGain, withGain, g.in( 'pan' ) )
      Gibberish.factory( syn, [panner.left, panner.right], 'karplus', props  )
    }else{
      Gibberish.factory( syn, withGain, 'karplus', props )
    }

    Object.assign( syn, {
      properties : props,

      env : trigger,
      phase,

      getPhase() {
        return Gibberish.memory.heap[ phase.memory.value.idx ]
      },
    })
    return syn
  }
  
  KPS.defaults = {
    decay: .97,
    damping:.2,
    gain: 1,
    frequency:220,
    pan: .5,
    glide:1,
    panVoices:false
  }

  let envCheckFactory = ( syn,synth ) => {
    let envCheck = ()=> {
      let phase = syn.getPhase(),
          endTime = synth.decay * Gibberish.ctx.sampleRate

      if( phase > endTime ) {
        synth.disconnectUgen( syn )
        syn.isConnected = false
        Gibberish.memory.heap[ syn.phase.memory.value.idx ] = 0 // trigger doesn't seem to reset for some reason
      }else{
        Gibberish.blockCallbacks.push( envCheck )
      }
    }
    return envCheck
  }

  let PolyKPS = Gibberish.PolyTemplate( KPS, ['frequency','decay','damping','pan','gain', 'glide'], envCheckFactory ) 

  return [ KPS, PolyKPS ]

}

},{"./instrument.js":112,"genish.js":37}],115:[function(require,module,exports){
let g = require( 'genish.js' ),
    instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  let Kick = inputProps => {
    // establish prototype chain
    let kick = Object.create( instrument )

    // define inputs
    let frequency = g.in( 'frequency' ),
        decay = g.in( 'decay' ),
        tone  = g.in( 'tone' ),
        gain  = g.in( 'gain' )
    
    // create initial property set
    let props = Object.assign( {}, Kick.defaults, inputProps )

    // create DSP graph
    let trigger = g.bang(),
        impulse = g.mul( trigger, 60 ),
        scaledDecay = g.sub( 1.005, decay ), // -> range { .005, 1.005 }
        scaledTone = g.add( 50, g.mul( tone, 4000 ) ), // -> range { 50, 4050 }
        bpf = g.svf( impulse, frequency, scaledDecay, 2, false ),
        lpf = g.svf( bpf, scaledTone, .5, 0, false ),
        graph = g.mul( lpf, gain )
    
    Gibberish.factory( kick, graph, 'kick', props  )

    kick.env = trigger

    return kick
  }
  
  Kick.defaults = {
    gain: 1,
    frequency:85,
    tone: .25,
    decay:.9
  }

  return Kick

}

},{"./instrument.js":112,"genish.js":37}],116:[function(require,module,exports){
const g = require( 'genish.js' ),
      instrument = require( './instrument.js' ),
      feedbackOsc = require( '../oscillators/fmfeedbackosc.js' )

module.exports = function( Gibberish ) {

  const Synth = argumentProps => {
    const syn = Object.create( instrument ),
          oscs = [], 
          env = g.ad( g.in( 'attack' ), g.in( 'decay' ), { shape:'linear' }),
          frequency = g.in( 'frequency' ),
          glide = g.in( 'glide' ),
          slidingFreq = g.memo( g.slide( frequency, glide, glide ) )

    let props = Object.assign( syn, Synth.defaults, argumentProps )

    syn.__createGraph = function() {
      for( let i = 0; i < 3; i++ ) {
        let osc, freq

        switch( i ) {
          case 1:
            freq = g.add( slidingFreq, g.mul( slidingFreq, g.in('detune2') ) )
            break;
          case 2:
            freq = g.add( slidingFreq, g.mul( slidingFreq, g.in('detune3') ) )
            break;
          default:
            freq = slidingFreq//frequency
        }

        osc = Gibberish.oscillators.factory( syn.waveform, freq, syn.antialias )
        
        oscs[ i ] = osc
      }

      let oscSum = g.add( ...oscs ),
          oscWithGain = g.mul( g.mul( oscSum, env ), g.in( 'gain' ) ),
          //cutoff = g.add( g.in('cutoff'), g.mul( g.in('filterMult'), env ) ),
          filteredOsc, panner

      const baseCutoffFreq = g.mul( g.in('cutoff'), frequency )
      let cutoff = g.mul( g.mul( baseCutoffFreq, g.pow( 2, g.in('filterMult') )), env )
      filteredOsc = Gibberish.filters.factory( oscWithGain, cutoff, g.in('Q'), g.in('saturation'), syn )
        
      if( props.panVoices ) {  
        panner = g.pan( filteredOsc,filteredOsc, g.in( 'pan' ) )
        syn.graph = [ panner.left, panner.right ]
      }else{
        syn.graph = filteredOsc
      }
    }

    syn.__requiresRecompilation = [ 'waveform', 'antialias', 'filterType', 'filterMode' ]
    syn.__createGraph()

    Gibberish.factory( syn, syn.graph, 'mono', props )

    syn.env = env

    return syn
  }
  
  Synth.defaults = {
    waveform: 'saw',
    attack: 44100,
    decay: 44100,
    gain: .25,
    pulsewidth:.25,
    frequency:220,
    pan: .5,
    detune2:.005,
    detune3:-.005,
    cutoff: 1,
    resonance:.25,
    Q: .5,
    panVoices:false,
    glide: 1,
    antialias:false,
    filterType: 2,
    filterMode: 0, // 0 = LP, 1 = HP, 2 = BP, 3 = Notch
    saturation:.5,
    filterMult: 4,
    isLowPass:true
  }

  let PolyMono = Gibberish.PolyTemplate( Synth, 
    ['frequency','attack','decay','cutoff','Q',
     'detune2','detune3','pulsewidth','pan','gain', 'glide', 'saturation', 'filterMult',  'antialias', 'filterType', 'waveform', 'filterMode']
  ) 

  return [ Synth, PolyMono ]
}

},{"../oscillators/fmfeedbackosc.js":128,"./instrument.js":112,"genish.js":37}],117:[function(require,module,exports){
module.exports = {
  note( freq, gain ) {
    let voice = this.__getVoice__()
    Object.assign( voice, this.properties )
    if( gain === undefined ) gain = this.gain
    voice.gain = gain
    voice.note( freq )
    this.__runVoice__( voice, this )
    this.triggerNote = freq
  },

  // XXX this is not particularly satisfying...
  // must check for both notes and chords
  trigger( gain ) {
    if( this.triggerChord !== null ) {
      this.triggerChord.forEach( v => {
        let voice = this.__getVoice__()
        Object.assign( voice, this.properties )
        voice.note( v )
        voice.gain = gain
        this.__runVoice__( voice, this )
      })
    }else if( this.triggerNote !== null ) {
      let voice = this.__getVoice__()
      Object.assign( voice, this.properties )
      voice.note( this.triggerNote )
      voice.gain = gain
      this.__runVoice__( voice, this )
    }else{
      let voice = this.__getVoice__()
      Object.assign( voice, this.properties )
      voice.trigger( gain )
      this.__runVoice__( voice, this )
    }
  },

  __runVoice__( voice, _poly ) {
    if( !voice.isConnected ) {
      voice.connect( _poly, 1 )
      voice.isConnected = true
    }

    let envCheck
    if( _poly.envCheck === undefined ) {
      envCheck = function() {
        if( voice.env.isComplete() ) {
          _poly.disconnectUgen.call( _poly, voice )
          voice.isConnected = false
        }else{
          Gibberish.blockCallbacks.push( envCheck )
        }
      }
    }else{
      envCheck = _poly.envCheck( voice, _poly )
    }

    Gibberish.blockCallbacks.push( envCheck )
  },

  __getVoice__() {
    return this.voices[ this.voiceCount++ % this.voices.length ]
  },

  chord( frequencies ) {
    frequencies.forEach( v => this.note( v ) )
    this.triggerChord = frequencies
  },

  free() {
    for( let child of this.voices ) child.free()
  }
}

},{}],118:[function(require,module,exports){
/*
 * This files creates a factory generating polysynth constructors.
 */

const g = require( 'genish.js' )

module.exports = function( Gibberish ) {

  const TemplateFactory = ( ugen, propertyList, _envCheck ) => {
    /* 
     * polysynths are basically busses that connect child synth voices.
     * We create separate prototypes for mono vs stereo instances.
     */

    const monoProto   = Object.create( Gibberish.Bus() ),
          stereoProto = Object.create( Gibberish.Bus2())

    // since there are two prototypes we can't assign directly to one of them...
    Object.assign( monoProto,   Gibberish.mixins.polyinstrument )
    Object.assign( stereoProto, Gibberish.mixins.polyinstrument )

    const Template = props => {
      const properties = Object.assign( {}, { isStereo:true }, props )

      const synth = properties.isStereo ? Object.create( stereoProto ) : Object.create( monoProto )

      Object.assign( synth, {
        voices: [],
        maxVoices: properties.maxVoices !== undefined ? properties.maxVoices : 16,
        voiceCount: 0,
        envCheck: _envCheck,
        id: Gibberish.factory.getUID(),
        dirty: true,
        type: 'bus',
        ugenName: 'poly' + ugen.name + '_' + synth.id,
        inputs: [],
        inputNames: [],
        properties
      })

      properties.panVoices = properties.isStereo
      synth.callback.ugenName = synth.ugenName

      for( let i = 0; i < synth.maxVoices; i++ ) {
        synth.voices[i] = ugen( properties )
        synth.voices[i].callback.ugenName = synth.voices[i].ugenName
        synth.voices[i].isConnected = false
      }

      let _propertyList 
      if( properties.isStereo === false ) {
        _propertyList = propertyList.slice( 0 )
        const idx =  _propertyList.indexOf( 'pan' )
        if( idx  > -1 ) _propertyList.splice( idx, 1 )
      }

      TemplateFactory.setupProperties( synth, ugen, properties.isStereo ? propertyList : _propertyList )

      return synth
    }

    return Template
  }

  TemplateFactory.setupProperties = function( synth, ugen, props ) {
    for( let property of props ) {
      Object.defineProperty( synth, property, {
        get() {
          return synth.properties[ property ] || ugen.defaults[ property ]
        },
        set( v ) {
          synth.properties[ property ] = v
          for( let child of synth.inputs ) {
            child[ property ] = v
          }
        }
      })
    }
  }

  return TemplateFactory

}

},{"genish.js":37}],119:[function(require,module,exports){
let g = require( 'genish.js' ),
    instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {
  let proto = Object.create( instrument )

  Object.assign( proto, {
    note( rate ) {
      this.rate = rate
      if( rate > 0 ) {
        this.trigger()
      }else{
        this.__phase__.value = this.data.buffer.length - 1 
      }
    }
  })

  let Sampler = inputProps => {
    let syn = Object.create( proto )

    let props = Object.assign( { onload:null }, Sampler.defaults, inputProps )

    syn.isStereo = props.isStereo !== undefined ? props.isStereo : false

    let start = g.in( 'start' ), end = g.in( 'end' ), 
        rate = g.in( 'rate' ), shouldLoop = g.in( 'loops' )
    /* create dummy ugen until data for sampler is loaded...
     * this will be overridden by a call to Gibberish.factory on load */
    syn.callback = function() { return 0 }
    syn.id = Gibberish.factory.getUID()
    syn.ugenName = syn.callback.ugenName = 'sampler_' + syn.id
    syn.inputNames = []
    /* end dummy ugen */

    syn.__bang__ = g.bang()
    syn.trigger = syn.__bang__.trigger

    if( props.filename ) {
      syn.data = g.data( props.filename )

      syn.data.onload = () => {
        syn.__phase__ = g.counter( rate, start, end, syn.__bang__, shouldLoop, { shouldWrap:false })

        Gibberish.factory( 
          syn,
          g.mul( 
          g.ifelse( 
            g.and( g.gte( syn.__phase__, start ), g.lt( syn.__phase__, end ) ),
            g.peek( 
              syn.data, 
              syn.__phase__,
              { mode:'samples' }
            ),
            0
          ), g.in('gain') ),
          'sampler', 
          props 
        ) 

        if( syn.end === -999999999 ) syn.end = syn.data.buffer.length - 1

        if( syn.onload !== null ) { syn.onload() }

        Gibberish.dirty( syn )
      }
    }

    return syn
  }
  
  Sampler.defaults = {
    gain: 1,
    pan: .5,
    rate: 1,
    panVoices:false,
    loops: 0,
    start:0,
    end:-999999999
  }

  let PolySampler = Gibberish.PolyTemplate( Sampler, ['rate','pan','gain','start','end','loops'] ) 

  return [ Sampler, PolySampler ]
}

},{"./instrument.js":112,"genish.js":37}],120:[function(require,module,exports){
let g = require( 'genish.js' ),
    instrument = require( './instrument.js' )
  
module.exports = function( Gibberish ) {

  let Snare = argumentProps => {
    let snare = Object.create( instrument ),
        decay = g.in( 'decay' ),
        scaledDecay = g.mul( decay, g.gen.samplerate * 2 ),
        snappy= g.in( 'snappy' ),
        tune  = g.in( 'tune' ),
        gain  = g.in( 'gain' )

    let props = Object.assign( {}, Snare.defaults, argumentProps )

    let eg = g.decay( scaledDecay, { initValue:0 } ), 
        check = g.memo( g.gt( eg, .0005 ) ),
        rnd = g.mul( g.noise(), eg ),
        hpf = g.svf( rnd, g.add( 1000, g.mul( g.add( 1, tune), 1000 ) ), .5, 1, false ),
        snap = g.gtp( g.mul( hpf, snappy ), 0 ), // rectify
        bpf1 = g.svf( eg, g.mul( 180, g.add( tune, 1 ) ), .05, 2, false ),
        bpf2 = g.svf( eg, g.mul( 330, g.add( tune, 1 ) ), .05, 2, false ),
        out  = g.memo( g.add( snap, bpf1, g.mul( bpf2, .8 ) ) ), //XXX why is memo needed?
        scaledOut = g.mul( out, gain )
    
    // XXX TODO : make this work with ifelse. the problem is that poke ugens put their
    // code at the bottom of the callback function, instead of at the end of the
    // associated if/else block.
    let ife = g.switch( check, scaledOut, 0 )
    //let ife = g.ifelse( g.gt( eg, .005 ), cycle(440), 0 )
    
    Gibberish.factory( snare, ife, 'snare', props  )
    
    snare.env = eg 

    return snare
  }
  
  Snare.defaults = {
    gain: 1,
    frequency:1000,
    tune:0,
    snappy: 1,
    decay:.1
  }

  return Snare

}

},{"./instrument.js":112,"genish.js":37}],121:[function(require,module,exports){
let g = require( 'genish.js' ),
    instrument = require( './instrument.js' )

module.exports = function( Gibberish ) {

  let Synth = inputProps => {
    let syn = Object.create( instrument )

    let env = g.ad( g.in('attack'), g.in('decay'), { shape:'linear' }),
        frequency = g.in( 'frequency' ),
        loudness  = g.in( 'loudness' ), 
        glide = g.in( 'glide' ),
        slidingFreq = g.slide( frequency, glide, glide )

    syn.env = env

    let props = Object.assign( syn, Synth.defaults, inputProps )

    syn.__createGraph = function() {
      let osc = Gibberish.oscillators.factory( syn.waveform, slidingFreq, syn.antialias )

      let oscWithEnv = g.mul( g.mul( osc, env, loudness ) ),
          panner
  
      const baseCutoffFreq = g.mul( g.in('cutoff'), frequency )
      let cutoff = g.mul( g.mul( baseCutoffFreq, g.pow( 2, g.in('filterMult') )), env )
      const filteredOsc = Gibberish.filters.factory( oscWithEnv, cutoff, g.in('Q'), g.in('saturation'), props )

      let synthWithGain = g.mul( filteredOsc, g.in( 'gain' ) )
  
      if( syn.panVoices === true ) { 
        panner = g.pan( synthWithGain, synthWithGain, g.in( 'pan' ) ) 
        syn.graph = [panner.left, panner.right]
      }else{
        syn.graph = synthWithGain
      }
    }
    
    syn.__requiresRecompilation = [ 'waveform', 'antialias', 'filterType','filterMode' ]
    syn.__createGraph()

    Gibberish.factory( syn, syn.graph, 'synth', props  )

    syn.env = env

    return syn
  }
  
  Synth.defaults = {
    waveform:'saw',
    attack: 44100,
    decay: 44100,
    gain: 1,
    pulsewidth:.25,
    frequency:220,
    pan: .5,
    antialias:false,
    panVoices:false,
    loudness:1,
    glide:1,
    saturation:1,
    filterMult:2,
    Q:.25,
    cutoff:.5,
    filterType:0,
    filterMode:0,
    isLowPass:1
  }

  // do not include velocity, which shoudl always be per voice
  let PolySynth = Gibberish.PolyTemplate( Synth, ['frequency','attack','decay','pulsewidth','pan','gain','glide', 'saturation', 'filterMult', 'Q', 'cutoff', 'resonance', 'antialias', 'filterType', 'waveform', 'filterMode'] ) 

  return [ Synth, PolySynth ]

}

},{"./instrument.js":112,"genish.js":37}],122:[function(require,module,exports){
module.exports = function( Gibberish ) {

  let Binops = {
    export( obj ) {
      for( let key in Binops ) {
        if( key !== 'export' ) {
          obj[ key ] = Binops[ key ]
        }
      }
    },
    
    Add( ...args ) {
      let id = Gibberish.factory.getUID()
      return { binop:true, op:'+', inputs:args, ugenName:'add' + id, id }
    },

    Sub( ...args ) {
      let id = Gibberish.factory.getUID()
      return { binop:true, op:'-', inputs:args, ugenName:'sub' + id, id }
    },

    Mul( ...args ) {
      let id = Gibberish.factory.getUID()
      return { binop:true, op:'*', inputs:args, ugenName:'mul' + id, id }
    },

    Div( ...args ) {
      let id = Gibberish.factory.getUID()
      return { binop:true, op:'/', inputs:args, ugenName:'div' + id, id }
    },

    Mod( ...args ) {
      let id = Gibberish.factory.getUID()
      return { binop:true, op:'%', inputs:args, ugenName:'mod' + id, id }
    },   
  }

  return Binops
}

},{}],123:[function(require,module,exports){
let g = require( 'genish.js' ),
    ugen = require( '../ugen.js' )

module.exports = function( Gibberish ) {

  let Bus = { 
    create() {
      let output = 0

      let bus = Object.create( ugen )

      Object.assign( bus, {
        callback() {
          output = 0

          for( let i = 0, length = arguments.length; i < length; i++ ) {
            let input = arguments[ i ],
                isArray = input instanceof Float32Array

            output += isArray ? input[ 0 ] : input

          }

          return output
        },
        id : Gibberish.factory.getUID(),
        dirty : true,
        type : 'bus',
        inputs : [],
        inputNames : [],
      })

      bus.ugenName = bus.callback.ugenName = 'bus_' + bus.id

      bus.disconnectUgen = function( ugen ) {
        let removeIdx = this.inputs.indexOf( ugen )
        
        if( removeIdx !== -1 ) {
          this.inputs.splice( removeIdx, 1 )
          Gibberish.dirty( this )
        }
      }
      
      return bus
    }
  }

  return Bus.create

}


},{"../ugen.js":135,"genish.js":37}],124:[function(require,module,exports){
let g = require( 'genish.js' ),
    ugen = require( '../ugen.js' )

module.exports = function( Gibberish ) {

  let Bus2 = { 
    create() {
      let output = new Float32Array( 2 )

      let bus = Object.create( ugen )

      Object.assign( bus, {
        callback() {
          output[ 0 ] = output[ 1 ] = 0

          for( let i = 0, length = arguments.length; i < length; i++ ) {
            let input = arguments[ i ],
                isArray = input instanceof Float32Array

            output[ 0 ] += isArray ? input[ 0 ] : input
            output[ 1 ] += isArray ? input[ 1 ] : input
          }

          return output
        },
        id : Gibberish.factory.getUID(),
        dirty : true,
        type : 'bus',
        inputs : [],
        inputNames : [],
      })

      bus.ugenName = bus.callback.ugenName = 'bus2_' + bus.id

      bus.disconnectUgen = function( ugen ) {
        let removeIdx = this.inputs.indexOf( ugen )
        
        if( removeIdx !== -1 ) {
          this.inputs.splice( removeIdx, 1 )
          Gibberish.dirty( this )
        }
      }
      
      return bus
    }
  }

  return Bus2.create

}


},{"../ugen.js":135,"genish.js":37}],125:[function(require,module,exports){
const  g    = require( 'genish.js'  ),
       ugen = require( '../ugen.js' )

module.exports = function( Gibberish ) {

  const Monops = {
    export( obj ) {
      for( let key in Monops ) {
        if( key !== 'export' ) {
          obj[ key ] = Monops[ key ]
        }
      }
    },
    
    Abs( input ) {
      const abs = Object.create( ugen )
      const graph = g.abs( g.in('input') )
      
      Gibberish.factory( abs, graph, 'abs', Object.assign({}, Monops.defaults, { input }) )

      return abs
    },

    Pow( input, exponent ) {
      const pow = Object.create( ugen )
      const graph = g.pow( g.in('input'), g.in('exponent') )
      
      Gibberish.factory( pow, graph, 'pow', Object.assign({}, Monops.defaults, { input, exponent }) )

      return pow
    },
    Clamp( input, min, max ) {
      const clamp = Object.create( ugen )
      const graph = g.clamp( g.in('input'), g.in('min'), g.in('max') )
      
      Gibberish.factory( clamp, graph, 'clamp', Object.assign({}, Monops.defaults, { input, min, max }) )

      return clamp
    },

    Merge( input ) {
      const merger = Object.create( ugen )
      const cb = function( _input ) {
        return _input[0] + _input[1]
      }

      Gibberish.factory( merger, g.in( 'input' ), 'merge', { input }, cb )
      merger.type = 'analysis'
      merger.inputNames = [ 'input' ]
      merger.inputs = [ input ]
      merger.input = input
      
      return merger
    },
  }

  Monops.defaults = { input:0 }

  return Monops
}

},{"../ugen.js":135,"genish.js":37}],126:[function(require,module,exports){
module.exports = function( Gibberish ) {

  const Time = {
    bpm: 120,

    export: function(target) {
      Object.assign( target, Time )
    },

    ms : function(val) {
      return val * Gibberish.ctx.sampleRate / 1000;
    },

    seconds : function(val) {
      return val * Gibberish.ctx.sampleRate;
    },

    beats : function(val) {
      return function() { 
        var samplesPerBeat = Gibberish.ctx.sampleRate / ( Gibberish.Time.bpm / 60 ) ;
        return samplesPerBeat * val ;
      }
    }
  }

  return Time
}

},{}],127:[function(require,module,exports){
const genish = require('genish.js'),
      ssd = genish.history,
      noise = genish.noise;

module.exports = function () {
  "use jsdsp";

  const last = ssd(0);

  const white = genish.sub(genish.mul(noise(), 2), 1);

  let out = genish.add(last.out, genish.div(genish.mul(.02, white), 1.02));

  last.in(out);

  out = genish.mul(out, 3.5);

  return out;
};
},{"genish.js":37}],128:[function(require,module,exports){
let g = require( 'genish.js' )

let feedbackOsc = function( frequency, filter, pulsewidth=.5, argumentProps ) {
  if( argumentProps === undefined ) argumentProps = { type: 0 }

  let lastSample = g.history(),
      // determine phase increment and memoize result
      w = g.memo( g.div( frequency, g.gen.samplerate ) ),
      // create scaling factor
      n = g.sub( -.5, w ),
      scaling = g.mul( g.mul( 13, filter ), g.pow( n, 5 ) ),
      // calculate dc offset and normalization factors
      DC = g.sub( .376, g.mul( w, .752 ) ),
      norm = g.sub( 1, g.mul( 2, w ) ),
      // determine phase
      osc1Phase = g.accum( w, 0, { min:-1 }),
      osc1, out

  // create current sample... from the paper:
  // osc = (osc + sin(2*pi*(phase + osc*scaling)))*0.5f;
  osc1 = g.memo( 
    g.mul(
      g.add(
        lastSample.out,
        g.sin(
          g.mul(
            Math.PI * 2,
            g.memo( g.add( osc1Phase, g.mul( lastSample.out, scaling ) ) )
          )
        )
      ),
      .5
    )
  )

  // store sample to use as modulation
  lastSample.in( osc1 )

  // if pwm / square waveform instead of sawtooth...
  if( argumentProps.type === 1 ) { 
    const lastSample2 = g.history() // for osc 2
    const lastSampleMaster = g.history() // for sum of osc1,osc2

    const osc2 = g.mul(
      g.add(
        lastSample2.out,
        g.sin(
          g.mul(
            Math.PI * 2,
            g.memo( g.add( osc1Phase, g.mul( lastSample2.out, scaling ), pulsewidth ) )
          )
        )
      ),
      .5
    )

    lastSample2.in( osc2 )
    out = g.memo( g.sub( lastSample.out, lastSample2.out ) )
    out = g.memo( g.add( g.mul( 2.5, out ), g.mul( -1.5, lastSampleMaster.out ) ) )
    
    lastSampleMaster.in( g.sub( osc1, osc2 ) )

  }else{
     // offset and normalize
    osc1 = g.add( g.mul( 2.5, osc1 ), g.mul( -1.5, lastSample.out ) )
    osc1 = g.add( osc1, DC )
 
    out = osc1
  }

  return g.mul( out, norm )
}

module.exports = feedbackOsc

},{"genish.js":37}],129:[function(require,module,exports){
const g = require( 'genish.js' ),
      ugen = require( '../ugen.js' ),
      feedbackOsc = require( './fmfeedbackosc.js' )

//  __makeOscillator__( type, frequency, antialias ) {
    
module.exports = function( Gibberish ) {
  let Oscillators = {
    export( obj ) {
      for( let key in Oscillators ) {
        if( key !== 'export' ) {
          obj[ key ] = Oscillators[ key ]
        }
      }
    },

    genish: {
      Brown: require( './brownnoise.js' ),
      Pink:  require( './pinknoise.js'  )
    },

    Wavetable: require( './wavetable.js' )( Gibberish ),
    
    Square( inputProps ) {
      const sqr   = Object.create( ugen ) 
      const props = Object.assign({ antialias:false }, Oscillators.defaults, inputProps )
      const osc   = Oscillators.factory( 'square', g.in( 'frequency' ), props.antialias )
      const graph = g.mul( osc, g.in('gain' ) )

      Gibberish.factory( sqr, graph, 'sqr', props )

      return sqr
    },

    PWM( inputProps ) {
      const pwm   = Object.create( ugen ) 
      const props = Object.assign({ antialias:false, pulsewidth:.25 }, Oscillators.defaults, inputProps )
      const osc   = Oscillators.factory( 'pwm', g.in( 'frequency' ), props.antialias )
      const graph = g.mul( osc, g.in('gain' ) )

      Gibberish.factory( pwm, graph, 'pwm', props )

      return pwm
    },

    Sine( inputProps ) {
      const sine  = Object.create( ugen )
      const props = Object.assign({}, Oscillators.defaults, inputProps )
      const graph = g.mul( g.cycle( g.in('frequency') ), g.in('gain') )

      Gibberish.factory( sine, graph, 'sine', props )
      
      return sine
    },

    Noise( inputProps ) {
      const noise = Object.create( ugen )
      const props = Object.assign( {}, { gain: 1, color:'white' }, inputProps )
      let graph 

      switch( props.color ) {
        case 'brown':
          graph = g.mul( Oscillators.genish.Brown(), g.in('gain') )
          break;
        case 'pink':
          graph = g.mul( Oscillators.genish.Pink(), g.in('gain') )
          break;
        default:
          graph = g.mul( g.noise(), g.in('gain') )
          break;
      }

      Gibberish.factory( noise, graph, 'noise', props )

      return noise
    },

    Saw( inputProps ) {
      const saw   = Object.create( ugen ) 
      const props = Object.assign({ antialias:false }, Oscillators.defaults, inputProps )
      const osc   = Oscillators.factory( 'saw', g.in( 'frequency' ), props.antialias )
      const graph = g.mul( osc, g.in('gain' ) )

      Gibberish.factory( saw, graph, 'saw', props )

      return saw
    },

    ReverseSaw( inputProps ) {
      const saw   = Object.create( ugen ) 
      const props = Object.assign({ antialias:false }, Oscillators.defaults, inputProps )
      const osc   = g.sub( 1, Oscillators.factory( 'saw', g.in( 'frequency' ), props.antialias ) )
      const graph = g.mul( osc, g.in( 'gain' ) )

      Gibberish.factory( saw, graph, 'rsaw', props )
      
      return saw
    },

    factory( type, frequency, antialias=false ) {
      let osc

      switch( type ) {
        case 'saw':
          if( antialias === false ) {
            osc = g.phasor( frequency )
          }else{
            osc = feedbackOsc( frequency, 1 )
          }
          break;
        case 'square':
          if( antialias === true ) {
            osc = feedbackOsc( frequency, 1, .5, { type:1 })
          }else{
            osc = g.wavetable( frequency, { buffer:Oscillators.Square.buffer, name:'square' } )
          }
          break;
        case 'sine':
          osc = g.cycle( frequency )
          break;
        case 'pwm':
          let pulsewidth = g.in('pulsewidth')
          if( antialias === true ) {
            osc = feedbackOsc( frequency, 1, pulsewidth, { type:1 })
          }else{
            let phase = g.phasor( frequency, 0, { min:0 } )
            osc = g.lt( phase, pulsewidth )
          }
          break;
      }

      return osc
    }
  }

  Oscillators.Square.buffer = new Float32Array( 1024 )

  for( let i = 1023; i >= 0; i-- ) { 
    Oscillators.Square.buffer [ i ] = i / 1024 > .5 ? 1 : -1
  }

  Oscillators.defaults = {
    frequency: 440,
    gain: 1
  }

  return Oscillators

}

},{"../ugen.js":135,"./brownnoise.js":127,"./fmfeedbackosc.js":128,"./pinknoise.js":130,"./wavetable.js":131,"genish.js":37}],130:[function(require,module,exports){
const genish = require('genish.js'),
      ssd = genish.history,
      noise = genish.noise;

module.exports = function () {
  "use jsdsp";

  const b0 = ssd(0),
        b1 = ssd(0),
        b2 = ssd(0),
        b3 = ssd(0),
        b4 = ssd(0),
        b5 = ssd(0),
        b6 = ssd(0);
  const white = genish.sub(genish.mul(noise(), 2), 1);

  b0.in(genish.add(genish.mul(.99886, b0.out), genish.mul(white, .0555179)));
  b1.in(genish.add(genish.mul(.99332, b1.out), genish.mul(white, .0750579)));
  b2.in(genish.add(genish.mul(.96900, b2.out), genish.mul(white, .1538520)));
  b3.in(genish.add(genish.mul(.88650, b3.out), genish.mul(white, .3104856)));
  b4.in(genish.add(genish.mul(.55000, b4.out), genish.mul(white, .5329522)));
  b5.in(genish.sub(genish.mul(-.7616, b5.out), genish.mul(white, .0168980)));

  out = genish.mul(genish.add(genish.add(genish.add(genish.add(genish.add(genish.add(genish.add(b0.out, b0.out), b0.out), b0.out), b0.out), b0.out), b0.out), genish.mul(white, .5362)), .11);

  b6.in(genish.mul(white, .115926));

  return out;
};
},{"genish.js":37}],131:[function(require,module,exports){
let g = require( 'genish.js' ),
    ugen = require( '../ugen.js' )

module.exports = function( Gibberish ) {

  const Wavetable = function( inputProps ) {
    const wavetable = Object.create( ugen )
    const props  = Object.assign({}, Gibberish.oscillators.defaults, inputProps )
    const osc = g.wavetable( g.in('frequency'), props )
    const graph = g.mul( 
      osc, 
      g.in( 'gain' )
    )

    Gibberish.factory( wavetable, graph, 'wavetable', props )

    return wavetable
  }

  g.wavetable = function( frequency, props ) {
    let dataProps = { immutable:true }

    // use global references if applicable
    if( props.name !== undefined ) dataProps.global = props.name

    const buffer = g.data( props.buffer, 1, dataProps )

    return g.peek( buffer, g.phasor( frequency, 0, { min:0 } ) )
  }

  return Wavetable
}

},{"../ugen.js":135,"genish.js":37}],132:[function(require,module,exports){
const Queue = require( '../external/priorityqueue.js' )
const Big   = require( 'big.js' )

let Scheduler = {
  phase: 0,

  queue: new Queue( ( a, b ) => {
    if( a.time === b.time ) { //a.time.eq( b.time ) ) {
      return b.priority - a.priority
    }else{
      return a.time - b.time //a.time.minus( b.time )
    }
  }),

  clear() {
    this.queue.data.length = 0
    this.queue.length = 0
  },

  add( time, func, priority = 0 ) {
    time += this.phase

    this.queue.push({ time, func, priority })
  },

  tick() {
    if( this.queue.length ) {
      let next = this.queue.peek()

      while( this.phase >= next.time ) {
        next.func()
        this.queue.pop()
        next = this.queue.peek()
      }

    }

    this.phase++
  },
}

module.exports = Scheduler

},{"../external/priorityqueue.js":83,"big.js":138}],133:[function(require,module,exports){
const g = require( 'genish.js' ),
      ugen = require( '../ugen.js' )

module.exports = function( Gibberish ) {
  const __proto__ = Object.create( ugen )

  Object.assign( __proto__, {
    start() {
      this.connect()
      return this
    },
    stop() {
      this.disconnect()
      return this
    }
  })

  const Seq2 = { 
    create( inputProps ) {
      const seq = Object.create( __proto__ ),
            props = Object.assign({}, Seq2.defaults, inputProps )

      seq.phase = 0
      seq.inputNames = [ 'rate' ]
      seq.inputs = [ 1 ]
      seq.nextTime = 0
      seq.valuesPhase = 0
      seq.timingsPhase = 0
      seq.id = Gibberish.factory.getUID()
      seq.dirty = true
      seq.type = 'seq'

      if( props.target === undefined ) {
        seq.anonFunction = true
      }else{ 
        seq.anonFunction = false
        seq.callFunction = typeof props.target[ props.key ] === 'function'
      }

      Object.assign( seq, props )

      seq.callback = function( rate ) {
        if( seq.phase >= seq.nextTime ) {
          let value = seq.values[ seq.valuesPhase++ % seq.values.length ]

          if( seq.anonFunction || typeof value === 'function' ) value = value()
          
          if( seq.anonFunction === false ) {
            if( seq.callFunction === false ) {
              seq.target[ seq.key ] = value
            }else{
              seq.target[ seq.key ]( value ) 
            }
          }

          seq.phase -= seq.nextTime

          let timing = seq.timings[ seq.timingsPhase++ % seq.timings.length ]
          if( typeof timing === 'function' ) timing = timing()

          seq.nextTime = timing
        }

        seq.phase += rate

        return 0
      }

      seq.ugenName = seq.callback.ugenName = 'seq_' + seq.id
      
      let value = seq.rate
      Object.defineProperty( seq, 'rate', {
        get() { return value },
        set( v ) {
          if( value !== v ) {
            Gibberish.dirty( seq )
            value = v
          }
        }
      })

      return seq
    }
  }

  Seq2.defaults = { rate: 1 }

  return Seq2.create

}


},{"../ugen.js":135,"genish.js":37}],134:[function(require,module,exports){
const Queue = require( '../external/priorityqueue.js' )
const Big   = require( 'big.js' )

module.exports = function( Gibberish ) {

let Sequencer = props => {
  let seq = {
    __isRunning:false,
    key: props.key, 
    target:  props.target,
    values:  props.values,
    timings: props.timings,
    __valuesPhase:  0,
    __timingsPhase: 0,
    priority: props.priority === undefined ? 0 : props.priority,

    tick() {
      let value  = seq.values[  seq.__valuesPhase++  % seq.values.length  ],
          timing = seq.timings[ seq.__timingsPhase++ % seq.timings.length ]

      if( typeof timing === 'function' ) timing = timing()

      if( typeof value === 'function' && seq.target === undefined ) {
        value()
      }else if( typeof seq.target[ seq.key ] === 'function' ) {
        if( typeof value === 'function' ) value = value()
        seq.target[ seq.key ]( value )
      }else{
        if( typeof value === 'function' ) value = value()
        seq.target[ seq.key ] = value
      }
      
      if( seq.__isRunning === true ) {
        Gibberish.scheduler.add( timing, seq.tick, seq.priority )
      }
    },

    start( delay = 0 ) {
      seq.__isRunning = true
      Gibberish.scheduler.add( delay, seq.tick, seq.priority )
      return seq
    },

    stop() {
      seq.__isRunning = false
      return seq
    }
  }

  return seq 
}

Sequencer.make = function( values, timings, target, key ) {
  return Sequencer({ values, timings, target, key })
}

return Sequencer

}

},{"../external/priorityqueue.js":83,"big.js":138}],135:[function(require,module,exports){
let ugen = {
  free() {
    Gibberish.genish.gen.free( this.graph )
  },

  print() {
    console.log( this.callback.toString() )
  },

  connect( target, level=1 ) {
    if( this.connected === undefined ) this.connected = []

    let input = level === 1 ? this : Gibberish.binops.Mul( this, level )

    if( target === undefined || target === null ) target = Gibberish.output 

    if( target.inputs )
      target.inputs.push( input )
    else
      target.input = input

    Gibberish.dirty( target )

    this.connected.push([ target, input ])
    
    return this
  },

  disconnect( target ) {
    if( target === undefined ){
      for( let connection of this.connected ) {
        connection[0].disconnectUgen( connection[1] )
      }
      this.connected.length = 0
    }else{
      const connection = this.connected.find( v => v[0] === target )
      target.disconnectUgen( connection[1] )
      const targetIdx = this.connected.indexOf( connection )
      this.connected.splice( targetIdx, 1 )
    }
  },

  chain( target, level=1 ) {
    this.connect( target,level )

    return target
  },

  __redoGraph() {
    this.__createGraph()
    this.callback = Gibberish.genish.gen.createCallback( this.graph, Gibberish.memory, false, true )
    this.inputNames = Gibberish.genish.gen.parameters.slice(0)
    this.callback.ugenName = this.ugenName
  },
}

module.exports = ugen

},{}],136:[function(require,module,exports){
module.exports = function( Gibberish ) {
  let uid = 0

  let factory = function( ugen, graph, name, values, cb ) {
    ugen.callback = cb === undefined ? Gibberish.genish.gen.createCallback( graph, Gibberish.memory, false, true ) : cb

    Object.assign( ugen, {
      type: 'ugen',
      id: factory.getUID(), 
      ugenName: name + '_',
      graph: graph,
      inputNames: Gibberish.genish.gen.parameters.slice(0),
      isStereo: Array.isArray( graph ),
      dirty: true
    })
    
    ugen.ugenName += ugen.id
    ugen.callback.ugenName = ugen.ugenName // XXX hacky

    for( let param of ugen.inputNames ) {
      if( param === 'memory' ) continue

      let value = values[ param ]

      // TODO: do we need to check for a setter?
      let desc = Object.getOwnPropertyDescriptor( ugen, param ),
          setter

      if( desc !== undefined ) {
        setter = desc.set
      }

      Object.defineProperty( ugen, param, {
        get() { return value },
        set( v ) {
          if( value !== v ) {
            Gibberish.dirty( ugen )
            if( setter !== undefined ) setter( v )
            value = v
          }
        }
      })
    }

    if( ugen.__requiresRecompilation !== undefined ) {
      ugen.__requiresRecompilation.forEach( prop => {
        let value = ugen[ prop ]
        Object.defineProperty( ugen, prop, {
          get() { return value },
          set( v ) {
            if( value !== v ) {
              value = v
              this.__redoGraph()
            }
          }
        })
      })      
    }
    return ugen
  }

  factory.getUID = () => uid++

  return factory
}

},{}],137:[function(require,module,exports){
let genish = require( 'genish.js' )

module.exports = function( Gibberish ) {

let utilities = {
  createContext() {
    let AC = typeof AudioContext === 'undefined' ? webkitAudioContext : AudioContext
    Gibberish.ctx = new AC()
    genish.gen.samplerate = Gibberish.ctx.sampleRate
    genish.utilities.ctx = Gibberish.ctx

    let start = () => {
      if( typeof AC !== 'undefined' ) {
        if( document && document.documentElement && 'ontouchstart' in document.documentElement ) {
          window.removeEventListener( 'touchstart', start )

          if( 'ontouchstart' in document.documentElement ){ // required to start audio under iOS 6
            let mySource = utilities.ctx.createBufferSource()
            mySource.connect( utilities.ctx.destination )
            mySource.noteOn( 0 )
          }
         }
      }
    }

    if( document && document.documentElement && 'ontouchstart' in document.documentElement ) {
      window.addEventListener( 'touchstart', start )
    }

    return Gibberish.ctx
  },

  createScriptProcessor() {
    Gibberish.node = Gibberish.ctx.createScriptProcessor( 1024, 0, 2 ),
    Gibberish.clearFunction = function() { return 0 },
    Gibberish.callback = Gibberish.clearFunction

    Gibberish.node.onaudioprocess = function( audioProcessingEvent ) {
      let gibberish = Gibberish,
          callback  = gibberish.callback,
          outputBuffer = audioProcessingEvent.outputBuffer,
          scheduler = Gibberish.scheduler,
          //objs = gibberish.callbackUgens.slice( 0 ),
          length

      let left = outputBuffer.getChannelData( 0 ),
          right= outputBuffer.getChannelData( 1 )

      let callbacklength = Gibberish.blockCallbacks.length
      
      if( callbacklength !== 0 ) {
        for( let i=0; i< callbacklength; i++ ) {
          Gibberish.blockCallbacks[ i ]()
        }

        // can't just set length to 0 as callbacks might be added during for loop, so splice pre-existing functions
        Gibberish.blockCallbacks.splice( 0, callbacklength )
      }

      for (let sample = 0, length = left.length; sample < length; sample++) {
        scheduler.tick()

        if( gibberish.graphIsDirty ) { 
          callback = gibberish.generateCallback()
        }
        
        // XXX cant use destructuring, babel makes it something inefficient...
        let out = callback.apply( null, gibberish.callbackUgens )

        left[ sample  ] = out[0]
        right[ sample ] = out[1]
      }
    }

    Gibberish.node.connect( Gibberish.ctx.destination )

    return Gibberish.node
  }, 
}

return utilities
}

},{"genish.js":37}],138:[function(require,module,exports){
/* big.js v3.1.3 https://github.com/MikeMcl/big.js/LICENCE */
;(function (global) {
    'use strict';

/*
  big.js v3.1.3
  A small, fast, easy-to-use library for arbitrary-precision decimal arithmetic.
  https://github.com/MikeMcl/big.js/
  Copyright (c) 2014 Michael Mclaughlin <M8ch88l@gmail.com>
  MIT Expat Licence
*/

/***************************** EDITABLE DEFAULTS ******************************/

    // The default values below must be integers within the stated ranges.

    /*
     * The maximum number of decimal places of the results of operations
     * involving division: div and sqrt, and pow with negative exponents.
     */
    var DP = 20,                           // 0 to MAX_DP

        /*
         * The rounding mode used when rounding to the above decimal places.
         *
         * 0 Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
         * 1 To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
         * 2 To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
         * 3 Away from zero.                                  (ROUND_UP)
         */
        RM = 1,                            // 0, 1, 2 or 3

        // The maximum value of DP and Big.DP.
        MAX_DP = 1E6,                      // 0 to 1000000

        // The maximum magnitude of the exponent argument to the pow method.
        MAX_POWER = 1E6,                   // 1 to 1000000

        /*
         * The exponent value at and beneath which toString returns exponential
         * notation.
         * JavaScript's Number type: -7
         * -1000000 is the minimum recommended exponent value of a Big.
         */
        E_NEG = -7,                   // 0 to -1000000

        /*
         * The exponent value at and above which toString returns exponential
         * notation.
         * JavaScript's Number type: 21
         * 1000000 is the maximum recommended exponent value of a Big.
         * (This limit is not enforced or checked.)
         */
        E_POS = 21,                   // 0 to 1000000

/******************************************************************************/

        // The shared prototype object.
        P = {},
        isValid = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
        Big;


    /*
     * Create and return a Big constructor.
     *
     */
    function bigFactory() {

        /*
         * The Big constructor and exported function.
         * Create and return a new instance of a Big number object.
         *
         * n {number|string|Big} A numeric value.
         */
        function Big(n) {
            var x = this;

            // Enable constructor usage without new.
            if (!(x instanceof Big)) {
                return n === void 0 ? bigFactory() : new Big(n);
            }

            // Duplicate.
            if (n instanceof Big) {
                x.s = n.s;
                x.e = n.e;
                x.c = n.c.slice();
            } else {
                parse(x, n);
            }

            /*
             * Retain a reference to this Big constructor, and shadow
             * Big.prototype.constructor which points to Object.
             */
            x.constructor = Big;
        }

        Big.prototype = P;
        Big.DP = DP;
        Big.RM = RM;
        Big.E_NEG = E_NEG;
        Big.E_POS = E_POS;

        return Big;
    }


    // Private functions


    /*
     * Return a string representing the value of Big x in normal or exponential
     * notation to dp fixed decimal places or significant digits.
     *
     * x {Big} The Big to format.
     * dp {number} Integer, 0 to MAX_DP inclusive.
     * toE {number} 1 (toExponential), 2 (toPrecision) or undefined (toFixed).
     */
    function format(x, dp, toE) {
        var Big = x.constructor,

            // The index (normal notation) of the digit that may be rounded up.
            i = dp - (x = new Big(x)).e,
            c = x.c;

        // Round?
        if (c.length > ++dp) {
            rnd(x, i, Big.RM);
        }

        if (!c[0]) {
            ++i;
        } else if (toE) {
            i = dp;

        // toFixed
        } else {
            c = x.c;

            // Recalculate i as x.e may have changed if value rounded up.
            i = x.e + i + 1;
        }

        // Append zeros?
        for (; c.length < i; c.push(0)) {
        }
        i = x.e;

        /*
         * toPrecision returns exponential notation if the number of
         * significant digits specified is less than the number of digits
         * necessary to represent the integer part of the value in normal
         * notation.
         */
        return toE === 1 || toE && (dp <= i || i <= Big.E_NEG) ?

          // Exponential notation.
          (x.s < 0 && c[0] ? '-' : '') +
            (c.length > 1 ? c[0] + '.' + c.join('').slice(1) : c[0]) +
              (i < 0 ? 'e' : 'e+') + i

          // Normal notation.
          : x.toString();
    }


    /*
     * Parse the number or string value passed to a Big constructor.
     *
     * x {Big} A Big number instance.
     * n {number|string} A numeric value.
     */
    function parse(x, n) {
        var e, i, nL;

        // Minus zero?
        if (n === 0 && 1 / n < 0) {
            n = '-0';

        // Ensure n is string and check validity.
        } else if (!isValid.test(n += '')) {
            throwErr(NaN);
        }

        // Determine sign.
        x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

        // Decimal point?
        if ((e = n.indexOf('.')) > -1) {
            n = n.replace('.', '');
        }

        // Exponential form?
        if ((i = n.search(/e/i)) > 0) {

            // Determine exponent.
            if (e < 0) {
                e = i;
            }
            e += +n.slice(i + 1);
            n = n.substring(0, i);

        } else if (e < 0) {

            // Integer.
            e = n.length;
        }

        // Determine leading zeros.
        for (i = 0; n.charAt(i) == '0'; i++) {
        }

        if (i == (nL = n.length)) {

            // Zero.
            x.c = [ x.e = 0 ];
        } else {

            // Determine trailing zeros.
            for (; n.charAt(--nL) == '0';) {
            }

            x.e = e - i - 1;
            x.c = [];

            // Convert string to array of digits without leading/trailing zeros.
            for (e = 0; i <= nL; x.c[e++] = +n.charAt(i++)) {
            }
        }

        return x;
    }


    /*
     * Round Big x to a maximum of dp decimal places using rounding mode rm.
     * Called by div, sqrt and round.
     *
     * x {Big} The Big to round.
     * dp {number} Integer, 0 to MAX_DP inclusive.
     * rm {number} 0, 1, 2 or 3 (DOWN, HALF_UP, HALF_EVEN, UP)
     * [more] {boolean} Whether the result of division was truncated.
     */
    function rnd(x, dp, rm, more) {
        var u,
            xc = x.c,
            i = x.e + dp + 1;

        if (rm === 1) {

            // xc[i] is the digit after the digit that may be rounded up.
            more = xc[i] >= 5;
        } else if (rm === 2) {
            more = xc[i] > 5 || xc[i] == 5 &&
              (more || i < 0 || xc[i + 1] !== u || xc[i - 1] & 1);
        } else if (rm === 3) {
            more = more || xc[i] !== u || i < 0;
        } else {
            more = false;

            if (rm !== 0) {
                throwErr('!Big.RM!');
            }
        }

        if (i < 1 || !xc[0]) {

            if (more) {

                // 1, 0.1, 0.01, 0.001, 0.0001 etc.
                x.e = -dp;
                x.c = [1];
            } else {

                // Zero.
                x.c = [x.e = 0];
            }
        } else {

            // Remove any digits after the required decimal places.
            xc.length = i--;

            // Round up?
            if (more) {

                // Rounding up may mean the previous digit has to be rounded up.
                for (; ++xc[i] > 9;) {
                    xc[i] = 0;

                    if (!i--) {
                        ++x.e;
                        xc.unshift(1);
                    }
                }
            }

            // Remove trailing zeros.
            for (i = xc.length; !xc[--i]; xc.pop()) {
            }
        }

        return x;
    }


    /*
     * Throw a BigError.
     *
     * message {string} The error message.
     */
    function throwErr(message) {
        var err = new Error(message);
        err.name = 'BigError';

        throw err;
    }


    // Prototype/instance methods


    /*
     * Return a new Big whose value is the absolute value of this Big.
     */
    P.abs = function () {
        var x = new this.constructor(this);
        x.s = 1;

        return x;
    };


    /*
     * Return
     * 1 if the value of this Big is greater than the value of Big y,
     * -1 if the value of this Big is less than the value of Big y, or
     * 0 if they have the same value.
    */
    P.cmp = function (y) {
        var xNeg,
            x = this,
            xc = x.c,
            yc = (y = new x.constructor(y)).c,
            i = x.s,
            j = y.s,
            k = x.e,
            l = y.e;

        // Either zero?
        if (!xc[0] || !yc[0]) {
            return !xc[0] ? !yc[0] ? 0 : -j : i;
        }

        // Signs differ?
        if (i != j) {
            return i;
        }
        xNeg = i < 0;

        // Compare exponents.
        if (k != l) {
            return k > l ^ xNeg ? 1 : -1;
        }

        i = -1;
        j = (k = xc.length) < (l = yc.length) ? k : l;

        // Compare digit by digit.
        for (; ++i < j;) {

            if (xc[i] != yc[i]) {
                return xc[i] > yc[i] ^ xNeg ? 1 : -1;
            }
        }

        // Compare lengths.
        return k == l ? 0 : k > l ^ xNeg ? 1 : -1;
    };


    /*
     * Return a new Big whose value is the value of this Big divided by the
     * value of Big y, rounded, if necessary, to a maximum of Big.DP decimal
     * places using rounding mode Big.RM.
     */
    P.div = function (y) {
        var x = this,
            Big = x.constructor,
            // dividend
            dvd = x.c,
            //divisor
            dvs = (y = new Big(y)).c,
            s = x.s == y.s ? 1 : -1,
            dp = Big.DP;

        if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throwErr('!Big.DP!');
        }

        // Either 0?
        if (!dvd[0] || !dvs[0]) {

            // If both are 0, throw NaN
            if (dvd[0] == dvs[0]) {
                throwErr(NaN);
            }

            // If dvs is 0, throw +-Infinity.
            if (!dvs[0]) {
                throwErr(s / 0);
            }

            // dvd is 0, return +-0.
            return new Big(s * 0);
        }

        var dvsL, dvsT, next, cmp, remI, u,
            dvsZ = dvs.slice(),
            dvdI = dvsL = dvs.length,
            dvdL = dvd.length,
            // remainder
            rem = dvd.slice(0, dvsL),
            remL = rem.length,
            // quotient
            q = y,
            qc = q.c = [],
            qi = 0,
            digits = dp + (q.e = x.e - y.e) + 1;

        q.s = s;
        s = digits < 0 ? 0 : digits;

        // Create version of divisor with leading zero.
        dvsZ.unshift(0);

        // Add zeros to make remainder as long as divisor.
        for (; remL++ < dvsL; rem.push(0)) {
        }

        do {

            // 'next' is how many times the divisor goes into current remainder.
            for (next = 0; next < 10; next++) {

                // Compare divisor and remainder.
                if (dvsL != (remL = rem.length)) {
                    cmp = dvsL > remL ? 1 : -1;
                } else {

                    for (remI = -1, cmp = 0; ++remI < dvsL;) {

                        if (dvs[remI] != rem[remI]) {
                            cmp = dvs[remI] > rem[remI] ? 1 : -1;
                            break;
                        }
                    }
                }

                // If divisor < remainder, subtract divisor from remainder.
                if (cmp < 0) {

                    // Remainder can't be more than 1 digit longer than divisor.
                    // Equalise lengths using divisor with extra leading zero?
                    for (dvsT = remL == dvsL ? dvs : dvsZ; remL;) {

                        if (rem[--remL] < dvsT[remL]) {
                            remI = remL;

                            for (; remI && !rem[--remI]; rem[remI] = 9) {
                            }
                            --rem[remI];
                            rem[remL] += 10;
                        }
                        rem[remL] -= dvsT[remL];
                    }
                    for (; !rem[0]; rem.shift()) {
                    }
                } else {
                    break;
                }
            }

            // Add the 'next' digit to the result array.
            qc[qi++] = cmp ? next : ++next;

            // Update the remainder.
            if (rem[0] && cmp) {
                rem[remL] = dvd[dvdI] || 0;
            } else {
                rem = [ dvd[dvdI] ];
            }

        } while ((dvdI++ < dvdL || rem[0] !== u) && s--);

        // Leading zero? Do not remove if result is simply zero (qi == 1).
        if (!qc[0] && qi != 1) {

            // There can't be more than one zero.
            qc.shift();
            q.e--;
        }

        // Round?
        if (qi > digits) {
            rnd(q, dp, Big.RM, rem[0] !== u);
        }

        return q;
    };


    /*
     * Return true if the value of this Big is equal to the value of Big y,
     * otherwise returns false.
     */
    P.eq = function (y) {
        return !this.cmp(y);
    };


    /*
     * Return true if the value of this Big is greater than the value of Big y,
     * otherwise returns false.
     */
    P.gt = function (y) {
        return this.cmp(y) > 0;
    };


    /*
     * Return true if the value of this Big is greater than or equal to the
     * value of Big y, otherwise returns false.
     */
    P.gte = function (y) {
        return this.cmp(y) > -1;
    };


    /*
     * Return true if the value of this Big is less than the value of Big y,
     * otherwise returns false.
     */
    P.lt = function (y) {
        return this.cmp(y) < 0;
    };


    /*
     * Return true if the value of this Big is less than or equal to the value
     * of Big y, otherwise returns false.
     */
    P.lte = function (y) {
         return this.cmp(y) < 1;
    };


    /*
     * Return a new Big whose value is the value of this Big minus the value
     * of Big y.
     */
    P.sub = P.minus = function (y) {
        var i, j, t, xLTy,
            x = this,
            Big = x.constructor,
            a = x.s,
            b = (y = new Big(y)).s;

        // Signs differ?
        if (a != b) {
            y.s = -b;
            return x.plus(y);
        }

        var xc = x.c.slice(),
            xe = x.e,
            yc = y.c,
            ye = y.e;

        // Either zero?
        if (!xc[0] || !yc[0]) {

            // y is non-zero? x is non-zero? Or both are zero.
            return yc[0] ? (y.s = -b, y) : new Big(xc[0] ? x : 0);
        }

        // Determine which is the bigger number.
        // Prepend zeros to equalise exponents.
        if (a = xe - ye) {

            if (xLTy = a < 0) {
                a = -a;
                t = xc;
            } else {
                ye = xe;
                t = yc;
            }

            t.reverse();
            for (b = a; b--; t.push(0)) {
            }
            t.reverse();
        } else {

            // Exponents equal. Check digit by digit.
            j = ((xLTy = xc.length < yc.length) ? xc : yc).length;

            for (a = b = 0; b < j; b++) {

                if (xc[b] != yc[b]) {
                    xLTy = xc[b] < yc[b];
                    break;
                }
            }
        }

        // x < y? Point xc to the array of the bigger number.
        if (xLTy) {
            t = xc;
            xc = yc;
            yc = t;
            y.s = -y.s;
        }

        /*
         * Append zeros to xc if shorter. No need to add zeros to yc if shorter
         * as subtraction only needs to start at yc.length.
         */
        if (( b = (j = yc.length) - (i = xc.length) ) > 0) {

            for (; b--; xc[i++] = 0) {
            }
        }

        // Subtract yc from xc.
        for (b = i; j > a;){

            if (xc[--j] < yc[j]) {

                for (i = j; i && !xc[--i]; xc[i] = 9) {
                }
                --xc[i];
                xc[j] += 10;
            }
            xc[j] -= yc[j];
        }

        // Remove trailing zeros.
        for (; xc[--b] === 0; xc.pop()) {
        }

        // Remove leading zeros and adjust exponent accordingly.
        for (; xc[0] === 0;) {
            xc.shift();
            --ye;
        }

        if (!xc[0]) {

            // n - n = +0
            y.s = 1;

            // Result must be zero.
            xc = [ye = 0];
        }

        y.c = xc;
        y.e = ye;

        return y;
    };


    /*
     * Return a new Big whose value is the value of this Big modulo the
     * value of Big y.
     */
    P.mod = function (y) {
        var yGTx,
            x = this,
            Big = x.constructor,
            a = x.s,
            b = (y = new Big(y)).s;

        if (!y.c[0]) {
            throwErr(NaN);
        }

        x.s = y.s = 1;
        yGTx = y.cmp(x) == 1;
        x.s = a;
        y.s = b;

        if (yGTx) {
            return new Big(x);
        }

        a = Big.DP;
        b = Big.RM;
        Big.DP = Big.RM = 0;
        x = x.div(y);
        Big.DP = a;
        Big.RM = b;

        return this.minus( x.times(y) );
    };


    /*
     * Return a new Big whose value is the value of this Big plus the value
     * of Big y.
     */
    P.add = P.plus = function (y) {
        var t,
            x = this,
            Big = x.constructor,
            a = x.s,
            b = (y = new Big(y)).s;

        // Signs differ?
        if (a != b) {
            y.s = -b;
            return x.minus(y);
        }

        var xe = x.e,
            xc = x.c,
            ye = y.e,
            yc = y.c;

        // Either zero?
        if (!xc[0] || !yc[0]) {

            // y is non-zero? x is non-zero? Or both are zero.
            return yc[0] ? y : new Big(xc[0] ? x : a * 0);
        }
        xc = xc.slice();

        // Prepend zeros to equalise exponents.
        // Note: Faster to use reverse then do unshifts.
        if (a = xe - ye) {

            if (a > 0) {
                ye = xe;
                t = yc;
            } else {
                a = -a;
                t = xc;
            }

            t.reverse();
            for (; a--; t.push(0)) {
            }
            t.reverse();
        }

        // Point xc to the longer array.
        if (xc.length - yc.length < 0) {
            t = yc;
            yc = xc;
            xc = t;
        }
        a = yc.length;

        /*
         * Only start adding at yc.length - 1 as the further digits of xc can be
         * left as they are.
         */
        for (b = 0; a;) {
            b = (xc[--a] = xc[a] + yc[a] + b) / 10 | 0;
            xc[a] %= 10;
        }

        // No need to check for zero, as +x + +y != 0 && -x + -y != 0

        if (b) {
            xc.unshift(b);
            ++ye;
        }

         // Remove trailing zeros.
        for (a = xc.length; xc[--a] === 0; xc.pop()) {
        }

        y.c = xc;
        y.e = ye;

        return y;
    };


    /*
     * Return a Big whose value is the value of this Big raised to the power n.
     * If n is negative, round, if necessary, to a maximum of Big.DP decimal
     * places using rounding mode Big.RM.
     *
     * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
     */
    P.pow = function (n) {
        var x = this,
            one = new x.constructor(1),
            y = one,
            isNeg = n < 0;

        if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
            throwErr('!pow!');
        }

        n = isNeg ? -n : n;

        for (;;) {

            if (n & 1) {
                y = y.times(x);
            }
            n >>= 1;

            if (!n) {
                break;
            }
            x = x.times(x);
        }

        return isNeg ? one.div(y) : y;
    };


    /*
     * Return a new Big whose value is the value of this Big rounded to a
     * maximum of dp decimal places using rounding mode rm.
     * If dp is not specified, round to 0 decimal places.
     * If rm is not specified, use Big.RM.
     *
     * [dp] {number} Integer, 0 to MAX_DP inclusive.
     * [rm] 0, 1, 2 or 3 (ROUND_DOWN, ROUND_HALF_UP, ROUND_HALF_EVEN, ROUND_UP)
     */
    P.round = function (dp, rm) {
        var x = this,
            Big = x.constructor;

        if (dp == null) {
            dp = 0;
        } else if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throwErr('!round!');
        }
        rnd(x = new Big(x), dp, rm == null ? Big.RM : rm);

        return x;
    };


    /*
     * Return a new Big whose value is the square root of the value of this Big,
     * rounded, if necessary, to a maximum of Big.DP decimal places using
     * rounding mode Big.RM.
     */
    P.sqrt = function () {
        var estimate, r, approx,
            x = this,
            Big = x.constructor,
            xc = x.c,
            i = x.s,
            e = x.e,
            half = new Big('0.5');

        // Zero?
        if (!xc[0]) {
            return new Big(x);
        }

        // If negative, throw NaN.
        if (i < 0) {
            throwErr(NaN);
        }

        // Estimate.
        i = Math.sqrt(x.toString());

        // Math.sqrt underflow/overflow?
        // Pass x to Math.sqrt as integer, then adjust the result exponent.
        if (i === 0 || i === 1 / 0) {
            estimate = xc.join('');

            if (!(estimate.length + e & 1)) {
                estimate += '0';
            }

            r = new Big( Math.sqrt(estimate).toString() );
            r.e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
        } else {
            r = new Big(i.toString());
        }

        i = r.e + (Big.DP += 4);

        // Newton-Raphson iteration.
        do {
            approx = r;
            r = half.times( approx.plus( x.div(approx) ) );
        } while ( approx.c.slice(0, i).join('') !==
                       r.c.slice(0, i).join('') );

        rnd(r, Big.DP -= 4, Big.RM);

        return r;
    };


    /*
     * Return a new Big whose value is the value of this Big times the value of
     * Big y.
     */
    P.mul = P.times = function (y) {
        var c,
            x = this,
            Big = x.constructor,
            xc = x.c,
            yc = (y = new Big(y)).c,
            a = xc.length,
            b = yc.length,
            i = x.e,
            j = y.e;

        // Determine sign of result.
        y.s = x.s == y.s ? 1 : -1;

        // Return signed 0 if either 0.
        if (!xc[0] || !yc[0]) {
            return new Big(y.s * 0);
        }

        // Initialise exponent of result as x.e + y.e.
        y.e = i + j;

        // If array xc has fewer digits than yc, swap xc and yc, and lengths.
        if (a < b) {
            c = xc;
            xc = yc;
            yc = c;
            j = a;
            a = b;
            b = j;
        }

        // Initialise coefficient array of result with zeros.
        for (c = new Array(j = a + b); j--; c[j] = 0) {
        }

        // Multiply.

        // i is initially xc.length.
        for (i = b; i--;) {
            b = 0;

            // a is yc.length.
            for (j = a + i; j > i;) {

                // Current sum of products at this digit position, plus carry.
                b = c[j] + yc[i] * xc[j - i - 1] + b;
                c[j--] = b % 10;

                // carry
                b = b / 10 | 0;
            }
            c[j] = (c[j] + b) % 10;
        }

        // Increment result exponent if there is a final carry.
        if (b) {
            ++y.e;
        }

        // Remove any leading zero.
        if (!c[0]) {
            c.shift();
        }

        // Remove trailing zeros.
        for (i = c.length; !c[--i]; c.pop()) {
        }
        y.c = c;

        return y;
    };


    /*
     * Return a string representing the value of this Big.
     * Return exponential notation if this Big has a positive exponent equal to
     * or greater than Big.E_POS, or a negative exponent equal to or less than
     * Big.E_NEG.
     */
    P.toString = P.valueOf = P.toJSON = function () {
        var x = this,
            Big = x.constructor,
            e = x.e,
            str = x.c.join(''),
            strL = str.length;

        // Exponential notation?
        if (e <= Big.E_NEG || e >= Big.E_POS) {
            str = str.charAt(0) + (strL > 1 ? '.' + str.slice(1) : '') +
              (e < 0 ? 'e' : 'e+') + e;

        // Negative exponent?
        } else if (e < 0) {

            // Prepend zeros.
            for (; ++e; str = '0' + str) {
            }
            str = '0.' + str;

        // Positive exponent?
        } else if (e > 0) {

            if (++e > strL) {

                // Append zeros.
                for (e -= strL; e-- ; str += '0') {
                }
            } else if (e < strL) {
                str = str.slice(0, e) + '.' + str.slice(e);
            }

        // Exponent zero.
        } else if (strL > 1) {
            str = str.charAt(0) + '.' + str.slice(1);
        }

        // Avoid '-0'
        return x.s < 0 && x.c[0] ? '-' + str : str;
    };


    /*
     ***************************************************************************
     * If toExponential, toFixed, toPrecision and format are not required they
     * can safely be commented-out or deleted. No redundant code will be left.
     * format is used only by toExponential, toFixed and toPrecision.
     ***************************************************************************
     */


    /*
     * Return a string representing the value of this Big in exponential
     * notation to dp fixed decimal places and rounded, if necessary, using
     * Big.RM.
     *
     * [dp] {number} Integer, 0 to MAX_DP inclusive.
     */
    P.toExponential = function (dp) {

        if (dp == null) {
            dp = this.c.length - 1;
        } else if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throwErr('!toExp!');
        }

        return format(this, dp, 1);
    };


    /*
     * Return a string representing the value of this Big in normal notation
     * to dp fixed decimal places and rounded, if necessary, using Big.RM.
     *
     * [dp] {number} Integer, 0 to MAX_DP inclusive.
     */
    P.toFixed = function (dp) {
        var str,
            x = this,
            Big = x.constructor,
            neg = Big.E_NEG,
            pos = Big.E_POS;

        // Prevent the possibility of exponential notation.
        Big.E_NEG = -(Big.E_POS = 1 / 0);

        if (dp == null) {
            str = x.toString();
        } else if (dp === ~~dp && dp >= 0 && dp <= MAX_DP) {
            str = format(x, x.e + dp);

            // (-0).toFixed() is '0', but (-0.1).toFixed() is '-0'.
            // (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
            if (x.s < 0 && x.c[0] && str.indexOf('-') < 0) {
        //E.g. -0.5 if rounded to -0 will cause toString to omit the minus sign.
                str = '-' + str;
            }
        }
        Big.E_NEG = neg;
        Big.E_POS = pos;

        if (!str) {
            throwErr('!toFix!');
        }

        return str;
    };


    /*
     * Return a string representing the value of this Big rounded to sd
     * significant digits using Big.RM. Use exponential notation if sd is less
     * than the number of digits necessary to represent the integer part of the
     * value in normal notation.
     *
     * sd {number} Integer, 1 to MAX_DP inclusive.
     */
    P.toPrecision = function (sd) {

        if (sd == null) {
            return this.toString();
        } else if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
            throwErr('!toPre!');
        }

        return format(this, sd - 1, 2);
    };


    // Export


    Big = bigFactory();

    //AMD.
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Big;
        });

    // Node and other CommonJS-like environments that support module.exports.
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Big;

    //Browser.
    } else {
        global.Big = Big;
    }
})(this);

},{}]},{},[107])(107)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L2Ficy5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvYWNjdW0uanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L2Fjb3MuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L2FkLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9hZGQuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L2Fkc3IuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L2FuZC5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvYXNpbi5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvYXRhbi5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvYXR0YWNrLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9iYW5nLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9ib29sLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9jZWlsLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9jbGFtcC5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvY29zLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9jb3VudGVyLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9jeWNsZS5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvZGF0YS5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvZGNibG9jay5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvZGVjYXkuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L2RlbGF5LmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9kZWx0YS5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvZGl2LmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9lbnYuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L2VxLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9leHAuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L2Zsb29yLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9mb2xkLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9nYXRlLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9nZW4uanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L2d0LmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9ndGUuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L2d0cC5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvaGlzdG9yeS5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvaWZlbHNlaWYuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L2luLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9pbmRleC5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvbHQuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L2x0ZS5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvbHRwLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9tYXguanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L21lbW8uanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L21pbi5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvbWl4LmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9tb2QuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L21zdG9zYW1wcy5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvbXRvZi5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvbXVsLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9uZXEuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L25vaXNlLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9ub3QuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L3Bhbi5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvcGFyYW0uanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L3BlZWsuanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L3BoYXNvci5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvcG9rZS5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvcG93LmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9yYXRlLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9yb3VuZC5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3Qvc2FoLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9zZWxlY3Rvci5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3Qvc2lnbi5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3Qvc2luLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9zbGlkZS5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3Qvc3ViLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC9zd2l0Y2guanMiLCIuLi8uLi9jb2RlL2dlbmlzaC5qcy9kaXN0L3Q2MC5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvdGFuLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC90YW5oLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC90cmFpbi5qcyIsIi4uLy4uL2NvZGUvZ2VuaXNoLmpzL2Rpc3QvdXRpbGl0aWVzLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC93aW5kb3dzLmpzIiwiLi4vLi4vY29kZS9nZW5pc2guanMvZGlzdC93cmFwLmpzIiwiLi4vLi4vY29kZS9tZW1vcnktaGVscGVyL2luZGV4LmpzIiwianMvYW5hbHlzaXMvYW5hbHl6ZXIuanMiLCJqcy9hbmFseXNpcy9hbmFseXplcnMuanMiLCJqcy9hbmFseXNpcy9mb2xsb3cuanMiLCJqcy9hbmFseXNpcy9zaW5nbGVzYW1wbGVkZWxheS5qcyIsImpzL2VudmVsb3Blcy9hZC5qcyIsImpzL2VudmVsb3Blcy9hZHNyLmpzIiwianMvZW52ZWxvcGVzL2VudmVsb3Blcy5qcyIsImpzL2VudmVsb3Blcy9yYW1wLmpzIiwianMvZXh0ZXJuYWwvcHJpb3JpdHlxdWV1ZS5qcyIsImpzL2ZpbHRlcnMvYWxscGFzcy5qcyIsImpzL2ZpbHRlcnMvYmlxdWFkLmpzIiwianMvZmlsdGVycy9jb21iZmlsdGVyLmpzIiwianMvZmlsdGVycy9kaW9kZUZpbHRlclpERi5qcyIsImpzL2ZpbHRlcnMvZmlsdGVyLmpzIiwianMvZmlsdGVycy9maWx0ZXIyNC5qcyIsImpzL2ZpbHRlcnMvZmlsdGVycy5qcyIsImpzL2ZpbHRlcnMvbGFkZGVyRmlsdGVyWmVyb0RlbGF5LmpzIiwianMvZmlsdGVycy9zdmYuanMiLCJqcy9meC9iaXRDcnVzaGVyLmpzIiwianMvZngvYnVmZmVyU2h1ZmZsZXIuanMiLCJqcy9meC9jaG9ydXMuanMiLCJqcy9meC9kYXR0b3Jyby5qcyIsImpzL2Z4L2RlbGF5LmpzIiwianMvZngvZGlzdG9ydGlvbi5qcyIsImpzL2Z4L2VmZmVjdC5qcyIsImpzL2Z4L2VmZmVjdHMuanMiLCJqcy9meC9mbGFuZ2VyLmpzIiwianMvZngvZnJlZXZlcmIuanMiLCJqcy9meC9nYXRlLmpzIiwianMvZngvcmluZ01vZC5qcyIsImpzL2Z4L3RyZW1vbG8uanMiLCJqcy9meC92aWJyYXRvLmpzIiwianMvaW5kZXguanMiLCJqcy9pbnN0cnVtZW50cy9jb25nYS5qcyIsImpzL2luc3RydW1lbnRzL2Nvd2JlbGwuanMiLCJqcy9pbnN0cnVtZW50cy9mbS5qcyIsImpzL2luc3RydW1lbnRzL2hhdC5qcyIsImpzL2luc3RydW1lbnRzL2luc3RydW1lbnQuanMiLCJqcy9pbnN0cnVtZW50cy9pbnN0cnVtZW50cy5qcyIsImpzL2luc3RydW1lbnRzL2thcnBsdXNzdHJvbmcuanMiLCJqcy9pbnN0cnVtZW50cy9raWNrLmpzIiwianMvaW5zdHJ1bWVudHMvbW9ub3N5bnRoLmpzIiwianMvaW5zdHJ1bWVudHMvcG9seU1peGluLmpzIiwianMvaW5zdHJ1bWVudHMvcG9seXRlbXBsYXRlLmpzIiwianMvaW5zdHJ1bWVudHMvc2FtcGxlci5qcyIsImpzL2luc3RydW1lbnRzL3NuYXJlLmpzIiwianMvaW5zdHJ1bWVudHMvc3ludGguanMiLCJqcy9taXNjL2Jpbm9wcy5qcyIsImpzL21pc2MvYnVzLmpzIiwianMvbWlzYy9idXMyLmpzIiwianMvbWlzYy9tb25vcHMuanMiLCJqcy9taXNjL3RpbWUuanMiLCJqcy9vc2NpbGxhdG9ycy9icm93bm5vaXNlLmpzIiwianMvb3NjaWxsYXRvcnMvZm1mZWVkYmFja29zYy5qcyIsImpzL29zY2lsbGF0b3JzL29zY2lsbGF0b3JzLmpzIiwianMvb3NjaWxsYXRvcnMvcGlua25vaXNlLmpzIiwianMvb3NjaWxsYXRvcnMvd2F2ZXRhYmxlLmpzIiwianMvc2NoZWR1bGluZy9zY2hlZHVsZXIuanMiLCJqcy9zY2hlZHVsaW5nL3NlcTIuanMiLCJqcy9zY2hlZHVsaW5nL3NlcXVlbmNlci5qcyIsImpzL3VnZW4uanMiLCJqcy91Z2VuVGVtcGxhdGUuanMiLCJqcy91dGlsaXRpZXMuanMiLCJub2RlX21vZHVsZXMvYmlnLmpzL2JpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBuYW1lOiAnYWJzJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIGlmIChpc05hTihpbnB1dHNbMF0pKSB7XG4gICAgICBfZ2VuLmNsb3N1cmVzLmFkZChfZGVmaW5lUHJvcGVydHkoe30sIHRoaXMubmFtZSwgTWF0aC5hYnMpKTtcblxuICAgICAgb3V0ID0gJ2dlbi5hYnMoICcgKyBpbnB1dHNbMF0gKyAnICknO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgPSBNYXRoLmFicyhwYXJzZUZsb2F0KGlucHV0c1swXSkpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgpIHtcbiAgdmFyIGFicyA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIGFicy5pbnB1dHMgPSBbeF07XG5cbiAgcmV0dXJuIGFicztcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgYmFzZW5hbWU6ICdhY2N1bScsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIGNvZGUgPSB2b2lkIDAsXG4gICAgICAgIGlucHV0cyA9IF9nZW4uZ2V0SW5wdXRzKHRoaXMpLFxuICAgICAgICBnZW5OYW1lID0gJ2dlbi4nICsgdGhpcy5uYW1lLFxuICAgICAgICBmdW5jdGlvbkJvZHkgPSB2b2lkIDA7XG5cbiAgICBfZ2VuLnJlcXVlc3RNZW1vcnkodGhpcy5tZW1vcnkpO1xuXG4gICAgX2dlbi5tZW1vcnkuaGVhcFt0aGlzLm1lbW9yeS52YWx1ZS5pZHhdID0gdGhpcy5pbml0aWFsVmFsdWU7XG5cbiAgICBmdW5jdGlvbkJvZHkgPSB0aGlzLmNhbGxiYWNrKGdlbk5hbWUsIGlucHV0c1swXSwgaW5wdXRzWzFdLCAnbWVtb3J5WycgKyB0aGlzLm1lbW9yeS52YWx1ZS5pZHggKyAnXScpO1xuXG4gICAgX2dlbi5jbG9zdXJlcy5hZGQoX2RlZmluZVByb3BlcnR5KHt9LCB0aGlzLm5hbWUsIHRoaXMpKTtcblxuICAgIF9nZW4ubWVtb1t0aGlzLm5hbWVdID0gdGhpcy5uYW1lICsgJ192YWx1ZSc7XG5cbiAgICByZXR1cm4gW3RoaXMubmFtZSArICdfdmFsdWUnLCBmdW5jdGlvbkJvZHldO1xuICB9LFxuICBjYWxsYmFjazogZnVuY3Rpb24gY2FsbGJhY2soX25hbWUsIF9pbmNyLCBfcmVzZXQsIHZhbHVlUmVmKSB7XG4gICAgdmFyIGRpZmYgPSB0aGlzLm1heCAtIHRoaXMubWluLFxuICAgICAgICBvdXQgPSAnJyxcbiAgICAgICAgd3JhcCA9ICcnO1xuXG4gICAgLyogdGhyZWUgZGlmZmVyZW50IG1ldGhvZHMgb2Ygd3JhcHBpbmcsIHRoaXJkIGlzIG1vc3QgZXhwZW5zaXZlOlxuICAgICAqXG4gICAgICogMTogcmFuZ2UgezAsMX06IHkgPSB4IC0gKHggfCAwKVxuICAgICAqIDI6IGxvZzIodGhpcy5tYXgpID09IGludGVnZXI6IHkgPSB4ICYgKHRoaXMubWF4IC0gMSlcbiAgICAgKiAzOiBhbGwgb3RoZXJzOiBpZiggeCA+PSB0aGlzLm1heCApIHkgPSB0aGlzLm1heCAteFxuICAgICAqXG4gICAgICovXG5cbiAgICAvLyBtdXN0IGNoZWNrIGZvciByZXNldCBiZWZvcmUgc3RvcmluZyB2YWx1ZSBmb3Igb3V0cHV0XG4gICAgaWYgKCEodHlwZW9mIHRoaXMuaW5wdXRzWzFdID09PSAnbnVtYmVyJyAmJiB0aGlzLmlucHV0c1sxXSA8IDEpKSB7XG4gICAgICBpZiAodGhpcy5pbml0aWFsVmFsdWUgIT09IHRoaXMubWluKSB7XG4gICAgICAgIG91dCArPSAnICBpZiggJyArIF9yZXNldCArICcgPj0xICkgJyArIHZhbHVlUmVmICsgJyA9ICcgKyB0aGlzLm1pbiArICdcXG5cXG4nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0ICs9ICcgIGlmKCAnICsgX3Jlc2V0ICsgJyA+PTEgKSAnICsgdmFsdWVSZWYgKyAnID0gJyArIHRoaXMuaW5pdGlhbFZhbHVlICsgJ1xcblxcbic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgb3V0ICs9ICcgIHZhciAnICsgdGhpcy5uYW1lICsgJ192YWx1ZSA9ICcgKyB2YWx1ZVJlZiArICc7XFxuJztcblxuICAgIGlmICh0aGlzLnNob3VsZFdyYXAgPT09IGZhbHNlICYmIHRoaXMuc2hvdWxkQ2xhbXAgPT09IHRydWUpIHtcbiAgICAgIG91dCArPSAnICBpZiggJyArIHZhbHVlUmVmICsgJyA8ICcgKyB0aGlzLm1heCArICcgKSAnICsgdmFsdWVSZWYgKyAnICs9ICcgKyBfaW5jciArICdcXG4nO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gJyAgJyArIHZhbHVlUmVmICsgJyArPSAnICsgX2luY3IgKyAnXFxuJzsgLy8gc3RvcmUgb3V0cHV0IHZhbHVlIGJlZm9yZSBhY2N1bXVsYXRpbmdcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tYXggIT09IEluZmluaXR5ICYmIHRoaXMuc2hvdWxkV3JhcCkgd3JhcCArPSAnICBpZiggJyArIHZhbHVlUmVmICsgJyA+PSAnICsgdGhpcy5tYXggKyAnICkgJyArIHZhbHVlUmVmICsgJyAtPSAnICsgZGlmZiArICdcXG4nO1xuICAgIGlmICh0aGlzLm1pbiAhPT0gLUluZmluaXR5ICYmIHRoaXMuc2hvdWxkV3JhcCkgd3JhcCArPSAnICBpZiggJyArIHZhbHVlUmVmICsgJyA8ICcgKyB0aGlzLm1pbiArICcgKSAnICsgdmFsdWVSZWYgKyAnICs9ICcgKyBkaWZmICsgJ1xcblxcbic7XG5cbiAgICAvL2lmKCB0aGlzLm1pbiA9PT0gMCAmJiB0aGlzLm1heCA9PT0gMSApIHtcbiAgICAvLyAgd3JhcCA9ICBgICAke3ZhbHVlUmVmfSA9ICR7dmFsdWVSZWZ9IC0gKCR7dmFsdWVSZWZ9IHwgMClcXG5cXG5gXG4gICAgLy99IGVsc2UgaWYoIHRoaXMubWluID09PSAwICYmICggTWF0aC5sb2cyKCB0aGlzLm1heCApIHwgMCApID09PSBNYXRoLmxvZzIoIHRoaXMubWF4ICkgKSB7XG4gICAgLy8gIHdyYXAgPSAgYCAgJHt2YWx1ZVJlZn0gPSAke3ZhbHVlUmVmfSAmICgke3RoaXMubWF4fSAtIDEpXFxuXFxuYFxuICAgIC8vfSBlbHNlIGlmKCB0aGlzLm1heCAhPT0gSW5maW5pdHkgKXtcbiAgICAvLyAgd3JhcCA9IGAgIGlmKCAke3ZhbHVlUmVmfSA+PSAke3RoaXMubWF4fSApICR7dmFsdWVSZWZ9IC09ICR7ZGlmZn1cXG5cXG5gXG4gICAgLy99XG5cbiAgICBvdXQgPSBvdXQgKyB3cmFwO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5jcikge1xuICB2YXIgcmVzZXQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzFdO1xuICB2YXIgcHJvcGVydGllcyA9IGFyZ3VtZW50c1syXTtcblxuICB2YXIgdWdlbiA9IE9iamVjdC5jcmVhdGUocHJvdG8pLFxuICAgICAgZGVmYXVsdHMgPSB7IG1pbjogMCwgbWF4OiAxLCBzaG91bGRXcmFwOiB0cnVlLCBzaG91bGRDbGFtcDogZmFsc2UgfTtcblxuICBpZiAocHJvcGVydGllcyAhPT0gdW5kZWZpbmVkKSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBwcm9wZXJ0aWVzKTtcblxuICBpZiAoZGVmYXVsdHMuaW5pdGlhbFZhbHVlID09PSB1bmRlZmluZWQpIGRlZmF1bHRzLmluaXRpYWxWYWx1ZSA9IGRlZmF1bHRzLm1pbjtcblxuICBPYmplY3QuYXNzaWduKHVnZW4sIHtcbiAgICBtaW46IGRlZmF1bHRzLm1pbixcbiAgICBtYXg6IGRlZmF1bHRzLm1heCxcbiAgICBpbml0aWFsOiBkZWZhdWx0cy5pbml0aWFsVmFsdWUsXG4gICAgdWlkOiBfZ2VuLmdldFVJRCgpLFxuICAgIGlucHV0czogW2luY3IsIHJlc2V0XSxcbiAgICBtZW1vcnk6IHtcbiAgICAgIHZhbHVlOiB7IGxlbmd0aDogMSwgaWR4OiBudWxsIH1cbiAgICB9XG4gIH0sIGRlZmF1bHRzKTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodWdlbiwgJ3ZhbHVlJywge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF9nZW4ubWVtb3J5LmhlYXBbdGhpcy5tZW1vcnkudmFsdWUuaWR4XTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0KHYpIHtcbiAgICAgIF9nZW4ubWVtb3J5LmhlYXBbdGhpcy5tZW1vcnkudmFsdWUuaWR4XSA9IHY7XG4gICAgfVxuICB9KTtcblxuICB1Z2VuLm5hbWUgPSAnJyArIHVnZW4uYmFzZW5hbWUgKyB1Z2VuLnVpZDtcblxuICByZXR1cm4gdWdlbjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgYmFzZW5hbWU6ICdhY29zJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIGlmIChpc05hTihpbnB1dHNbMF0pKSB7XG4gICAgICBfZ2VuLmNsb3N1cmVzLmFkZCh7ICdhY29zJzogTWF0aC5hY29zIH0pO1xuXG4gICAgICBvdXQgPSAnZ2VuLmFjb3MoICcgKyBpbnB1dHNbMF0gKyAnICknO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgPSBNYXRoLmFjb3MocGFyc2VGbG9hdChpbnB1dHNbMF0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh4KSB7XG4gIHZhciBhY29zID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgYWNvcy5pbnB1dHMgPSBbeF07XG4gIGFjb3MuaWQgPSBfZ2VuLmdldFVJRCgpO1xuICBhY29zLm5hbWUgPSBhY29zLmJhc2VuYW1lICsgJ3thY29zLmlkfSc7XG5cbiAgcmV0dXJuIGFjb3M7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyksXG4gICAgbXVsID0gcmVxdWlyZSgnLi9tdWwuanMnKSxcbiAgICBzdWIgPSByZXF1aXJlKCcuL3N1Yi5qcycpLFxuICAgIGRpdiA9IHJlcXVpcmUoJy4vZGl2LmpzJyksXG4gICAgZGF0YSA9IHJlcXVpcmUoJy4vZGF0YS5qcycpLFxuICAgIHBlZWsgPSByZXF1aXJlKCcuL3BlZWsuanMnKSxcbiAgICBhY2N1bSA9IHJlcXVpcmUoJy4vYWNjdW0uanMnKSxcbiAgICBpZmVsc2UgPSByZXF1aXJlKCcuL2lmZWxzZWlmLmpzJyksXG4gICAgbHQgPSByZXF1aXJlKCcuL2x0LmpzJyksXG4gICAgYmFuZyA9IHJlcXVpcmUoJy4vYmFuZy5qcycpLFxuICAgIGVudiA9IHJlcXVpcmUoJy4vZW52LmpzJyksXG4gICAgYWRkID0gcmVxdWlyZSgnLi9hZGQuanMnKSxcbiAgICBwb2tlID0gcmVxdWlyZSgnLi9wb2tlLmpzJyksXG4gICAgbmVxID0gcmVxdWlyZSgnLi9uZXEuanMnKSxcbiAgICBhbmQgPSByZXF1aXJlKCcuL2FuZC5qcycpLFxuICAgIGd0ZSA9IHJlcXVpcmUoJy4vZ3RlLmpzJyksXG4gICAgbWVtbyA9IHJlcXVpcmUoJy4vbWVtby5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGF0dGFja1RpbWUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyA0NDEwMCA6IGFyZ3VtZW50c1swXTtcbiAgdmFyIGRlY2F5VGltZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IDQ0MTAwIDogYXJndW1lbnRzWzFdO1xuICB2YXIgX3Byb3BzID0gYXJndW1lbnRzWzJdO1xuXG4gIHZhciBfYmFuZyA9IGJhbmcoKSxcbiAgICAgIHBoYXNlID0gYWNjdW0oMSwgX2JhbmcsIHsgbWluOiAwLCBtYXg6IEluZmluaXR5LCBpbml0aWFsVmFsdWU6IC1JbmZpbml0eSwgc2hvdWxkV3JhcDogZmFsc2UgfSksXG4gICAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHsgc2hhcGU6ICdleHBvbmVudGlhbCcsIGFscGhhOiA1IH0sIF9wcm9wcyksXG4gICAgICBidWZmZXJEYXRhID0gdm9pZCAwLFxuICAgICAgYnVmZmVyRGF0YVJldmVyc2UgPSB2b2lkIDAsXG4gICAgICBkZWNheURhdGEgPSB2b2lkIDAsXG4gICAgICBvdXQgPSB2b2lkIDAsXG4gICAgICBidWZmZXIgPSB2b2lkIDA7XG5cbiAgLy9jb25zb2xlLmxvZyggJ3NoYXBlOicsIHByb3BzLnNoYXBlLCAnYXR0YWNrIHRpbWU6JywgYXR0YWNrVGltZSwgJ2RlY2F5IHRpbWU6JywgZGVjYXlUaW1lIClcbiAgdmFyIGNvbXBsZXRlRmxhZyA9IGRhdGEoWzBdKTtcblxuICAvLyBzbGlnaHRseSBtb3JlIGVmZmljaWVudCB0byB1c2UgZXhpc3RpbmcgcGhhc2UgYWNjdW11bGF0b3IgZm9yIGxpbmVhciBlbnZlbG9wZXNcbiAgaWYgKHByb3BzLnNoYXBlID09PSAnbGluZWFyJykge1xuICAgIG91dCA9IGlmZWxzZShhbmQoZ3RlKHBoYXNlLCAwKSwgbHQocGhhc2UsIGF0dGFja1RpbWUpKSwgZGl2KHBoYXNlLCBhdHRhY2tUaW1lKSwgYW5kKGd0ZShwaGFzZSwgMCksIGx0KHBoYXNlLCBhZGQoYXR0YWNrVGltZSwgZGVjYXlUaW1lKSkpLCBzdWIoMSwgZGl2KHN1YihwaGFzZSwgYXR0YWNrVGltZSksIGRlY2F5VGltZSkpLCBuZXEocGhhc2UsIC1JbmZpbml0eSksIHBva2UoY29tcGxldGVGbGFnLCAxLCAwLCB7IGlubGluZTogMCB9KSwgMCk7XG4gIH0gZWxzZSB7XG4gICAgYnVmZmVyRGF0YSA9IGVudih7IGxlbmd0aDogMTAyNCwgdHlwZTogcHJvcHMuc2hhcGUsIGFscGhhOiBwcm9wcy5hbHBoYSB9KTtcbiAgICBidWZmZXJEYXRhUmV2ZXJzZSA9IGVudih7IGxlbmd0aDogMTAyNCwgdHlwZTogcHJvcHMuc2hhcGUsIGFscGhhOiBwcm9wcy5hbHBoYSwgcmV2ZXJzZTogdHJ1ZSB9KTtcblxuICAgIG91dCA9IGlmZWxzZShhbmQoZ3RlKHBoYXNlLCAwKSwgbHQocGhhc2UsIGF0dGFja1RpbWUpKSwgcGVlayhidWZmZXJEYXRhLCBkaXYocGhhc2UsIGF0dGFja1RpbWUpLCB7IGJvdW5kbW9kZTogJ2NsYW1wJyB9KSwgYW5kKGd0ZShwaGFzZSwgMCksIGx0KHBoYXNlLCBhZGQoYXR0YWNrVGltZSwgZGVjYXlUaW1lKSkpLCBwZWVrKGJ1ZmZlckRhdGFSZXZlcnNlLCBkaXYoc3ViKHBoYXNlLCBhdHRhY2tUaW1lKSwgZGVjYXlUaW1lKSwgeyBib3VuZG1vZGU6ICdjbGFtcCcgfSksIG5lcShwaGFzZSwgLUluZmluaXR5KSwgcG9rZShjb21wbGV0ZUZsYWcsIDEsIDAsIHsgaW5saW5lOiAwIH0pLCAwKTtcbiAgfVxuXG4gIG91dC5pc0NvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBnZW4ubWVtb3J5LmhlYXBbY29tcGxldGVGbGFnLm1lbW9yeS52YWx1ZXMuaWR4XTtcbiAgfTtcblxuICBvdXQudHJpZ2dlciA9IGZ1bmN0aW9uICgpIHtcbiAgICBnZW4ubWVtb3J5LmhlYXBbY29tcGxldGVGbGFnLm1lbW9yeS52YWx1ZXMuaWR4XSA9IDA7XG4gICAgX2JhbmcudHJpZ2dlcigpO1xuICB9O1xuXG4gIHJldHVybiBvdXQ7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAnYWRkJyxcbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIGlucHV0cyA9IF9nZW4uZ2V0SW5wdXRzKHRoaXMpLFxuICAgICAgICBvdXQgPSAnJyxcbiAgICAgICAgc3VtID0gMCxcbiAgICAgICAgbnVtQ291bnQgPSAwLFxuICAgICAgICBhZGRlckF0RW5kID0gZmFsc2UsXG4gICAgICAgIGFscmVhZHlGdWxsU3VtbWVkID0gdHJ1ZTtcblxuICAgIG91dCA9ICcgIHZhciAnICsgdGhpcy5uYW1lICsgJyA9ICc7XG5cbiAgICBpbnB1dHMuZm9yRWFjaChmdW5jdGlvbiAodiwgaSkge1xuICAgICAgaWYgKGlzTmFOKHYpKSB7XG4gICAgICAgIG91dCArPSB2O1xuICAgICAgICBpZiAoaSA8IGlucHV0cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgYWRkZXJBdEVuZCA9IHRydWU7XG4gICAgICAgICAgb3V0ICs9ICcgKyAnO1xuICAgICAgICB9XG4gICAgICAgIGFscmVhZHlGdWxsU3VtbWVkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdW0gKz0gcGFyc2VGbG9hdCh2KTtcbiAgICAgICAgbnVtQ291bnQrKztcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChudW1Db3VudCA+IDApIHtcbiAgICAgIG91dCArPSBhZGRlckF0RW5kIHx8IGFscmVhZHlGdWxsU3VtbWVkID8gc3VtIDogJyArICcgKyBzdW07XG4gICAgfVxuXG4gICAgb3V0ICs9ICdcXG4nO1xuXG4gICAgX2dlbi5tZW1vW3RoaXMubmFtZV0gPSB0aGlzLm5hbWU7XG5cbiAgICByZXR1cm4gW3RoaXMubmFtZSwgb3V0XTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciBhZGQgPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcbiAgYWRkLmlkID0gX2dlbi5nZXRVSUQoKTtcbiAgYWRkLm5hbWUgPSBhZGQuYmFzZW5hbWUgKyBhZGQuaWQ7XG4gIGFkZC5pbnB1dHMgPSBhcmdzO1xuXG4gIHJldHVybiBhZGQ7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyksXG4gICAgbXVsID0gcmVxdWlyZSgnLi9tdWwuanMnKSxcbiAgICBzdWIgPSByZXF1aXJlKCcuL3N1Yi5qcycpLFxuICAgIGRpdiA9IHJlcXVpcmUoJy4vZGl2LmpzJyksXG4gICAgZGF0YSA9IHJlcXVpcmUoJy4vZGF0YS5qcycpLFxuICAgIHBlZWsgPSByZXF1aXJlKCcuL3BlZWsuanMnKSxcbiAgICBhY2N1bSA9IHJlcXVpcmUoJy4vYWNjdW0uanMnKSxcbiAgICBpZmVsc2UgPSByZXF1aXJlKCcuL2lmZWxzZWlmLmpzJyksXG4gICAgbHQgPSByZXF1aXJlKCcuL2x0LmpzJyksXG4gICAgYmFuZyA9IHJlcXVpcmUoJy4vYmFuZy5qcycpLFxuICAgIGVudiA9IHJlcXVpcmUoJy4vZW52LmpzJyksXG4gICAgcGFyYW0gPSByZXF1aXJlKCcuL3BhcmFtLmpzJyksXG4gICAgYWRkID0gcmVxdWlyZSgnLi9hZGQuanMnKSxcbiAgICBndHAgPSByZXF1aXJlKCcuL2d0cC5qcycpLFxuICAgIG5vdCA9IHJlcXVpcmUoJy4vbm90LmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYXR0YWNrVGltZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IDQ0IDogYXJndW1lbnRzWzBdO1xuICB2YXIgZGVjYXlUaW1lID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gMjIwNTAgOiBhcmd1bWVudHNbMV07XG4gIHZhciBzdXN0YWluVGltZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IDQ0MTAwIDogYXJndW1lbnRzWzJdO1xuICB2YXIgc3VzdGFpbkxldmVsID0gYXJndW1lbnRzLmxlbmd0aCA8PSAzIHx8IGFyZ3VtZW50c1szXSA9PT0gdW5kZWZpbmVkID8gLjYgOiBhcmd1bWVudHNbM107XG4gIHZhciByZWxlYXNlVGltZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gNCB8fCBhcmd1bWVudHNbNF0gPT09IHVuZGVmaW5lZCA/IDQ0MTAwIDogYXJndW1lbnRzWzRdO1xuICB2YXIgX3Byb3BzID0gYXJndW1lbnRzWzVdO1xuXG4gIHZhciBlbnZUcmlnZ2VyID0gYmFuZygpLFxuICAgICAgcGhhc2UgPSBhY2N1bSgxLCBlbnZUcmlnZ2VyLCB7IG1heDogSW5maW5pdHksIHNob3VsZFdyYXA6IGZhbHNlIH0pLFxuICAgICAgc2hvdWxkU3VzdGFpbiA9IHBhcmFtKDEpLFxuICAgICAgZGVmYXVsdHMgPSB7XG4gICAgc2hhcGU6ICdleHBvbmVudGlhbCcsXG4gICAgYWxwaGE6IDUsXG4gICAgdHJpZ2dlclJlbGVhc2U6IGZhbHNlXG4gIH0sXG4gICAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBfcHJvcHMpLFxuICAgICAgYnVmZmVyRGF0YSA9IHZvaWQgMCxcbiAgICAgIGRlY2F5RGF0YSA9IHZvaWQgMCxcbiAgICAgIG91dCA9IHZvaWQgMCxcbiAgICAgIGJ1ZmZlciA9IHZvaWQgMCxcbiAgICAgIHN1c3RhaW5Db25kaXRpb24gPSB2b2lkIDAsXG4gICAgICByZWxlYXNlQWNjdW0gPSB2b2lkIDAsXG4gICAgICByZWxlYXNlQ29uZGl0aW9uID0gdm9pZCAwO1xuXG4gIC8vIHNsaWdodGx5IG1vcmUgZWZmaWNpZW50IHRvIHVzZSBleGlzdGluZyBwaGFzZSBhY2N1bXVsYXRvciBmb3IgbGluZWFyIGVudmVsb3Blc1xuICAvL2lmKCBwcm9wcy5zaGFwZSA9PT0gJ2xpbmVhcicgKSB7XG4gIC8vICBvdXQgPSBpZmVsc2UoXG4gIC8vICAgIGx0KCBwaGFzZSwgcHJvcHMuYXR0YWNrVGltZSApLCBtZW1vKCBkaXYoIHBoYXNlLCBwcm9wcy5hdHRhY2tUaW1lICkgKSxcbiAgLy8gICAgbHQoIHBoYXNlLCBwcm9wcy5hdHRhY2tUaW1lICsgcHJvcHMuZGVjYXlUaW1lICksIHN1YiggMSwgbXVsKCBkaXYoIHN1YiggcGhhc2UsIHByb3BzLmF0dGFja1RpbWUgKSwgcHJvcHMuZGVjYXlUaW1lICksIDEtcHJvcHMuc3VzdGFpbkxldmVsICkgKSxcbiAgLy8gICAgbHQoIHBoYXNlLCBwcm9wcy5hdHRhY2tUaW1lICsgcHJvcHMuZGVjYXlUaW1lICsgcHJvcHMuc3VzdGFpblRpbWUgKSxcbiAgLy8gICAgICBwcm9wcy5zdXN0YWluTGV2ZWwsXG4gIC8vICAgIGx0KCBwaGFzZSwgcHJvcHMuYXR0YWNrVGltZSArIHByb3BzLmRlY2F5VGltZSArIHByb3BzLnN1c3RhaW5UaW1lICsgcHJvcHMucmVsZWFzZVRpbWUgKSxcbiAgLy8gICAgICBzdWIoIHByb3BzLnN1c3RhaW5MZXZlbCwgbXVsKCBkaXYoIHN1YiggcGhhc2UsIHByb3BzLmF0dGFja1RpbWUgKyBwcm9wcy5kZWNheVRpbWUgKyBwcm9wcy5zdXN0YWluVGltZSApLCBwcm9wcy5yZWxlYXNlVGltZSApLCBwcm9wcy5zdXN0YWluTGV2ZWwpICksXG4gIC8vICAgIDBcbiAgLy8gIClcbiAgLy99IGVsc2UgeyAgICBcbiAgYnVmZmVyRGF0YSA9IGVudih7IGxlbmd0aDogMTAyNCwgYWxwaGE6IHByb3BzLmFscGhhLCBzaGlmdDogMCwgdHlwZTogcHJvcHMuc2hhcGUgfSk7XG5cbiAgY29uc29sZS5sb2coYnVmZmVyRGF0YSk7XG5cbiAgc3VzdGFpbkNvbmRpdGlvbiA9IHByb3BzLnRyaWdnZXJSZWxlYXNlID8gc2hvdWxkU3VzdGFpbiA6IGx0KHBoYXNlLCBhZGQoYXR0YWNrVGltZSwgZGVjYXlUaW1lLCBzdXN0YWluVGltZSkpO1xuXG4gIHJlbGVhc2VBY2N1bSA9IHByb3BzLnRyaWdnZXJSZWxlYXNlID8gZ3RwKHN1YihzdXN0YWluTGV2ZWwsIGFjY3VtKGRpdihzdXN0YWluTGV2ZWwsIHJlbGVhc2VUaW1lKSwgMCwgeyBzaG91bGRXcmFwOiBmYWxzZSB9KSksIDApIDogc3ViKHN1c3RhaW5MZXZlbCwgbXVsKGRpdihzdWIocGhhc2UsIGFkZChhdHRhY2tUaW1lLCBkZWNheVRpbWUsIHN1c3RhaW5UaW1lKSksIHJlbGVhc2VUaW1lKSwgc3VzdGFpbkxldmVsKSksIHJlbGVhc2VDb25kaXRpb24gPSBwcm9wcy50cmlnZ2VyUmVsZWFzZSA/IG5vdChzaG91bGRTdXN0YWluKSA6IGx0KHBoYXNlLCBhZGQoYXR0YWNrVGltZSwgZGVjYXlUaW1lLCBzdXN0YWluVGltZSwgcmVsZWFzZVRpbWUpKTtcblxuICBvdXQgPSBpZmVsc2UoXG4gIC8vIGF0dGFja1xuICBsdChwaGFzZSwgYXR0YWNrVGltZSksIHBlZWsoYnVmZmVyRGF0YSwgZGl2KHBoYXNlLCBhdHRhY2tUaW1lKSwgeyBib3VuZG1vZGU6ICdjbGFtcCcgfSksXG5cbiAgLy8gZGVjYXlcbiAgbHQocGhhc2UsIGFkZChhdHRhY2tUaW1lLCBkZWNheVRpbWUpKSwgcGVlayhidWZmZXJEYXRhLCBzdWIoMSwgbXVsKGRpdihzdWIocGhhc2UsIGF0dGFja1RpbWUpLCBkZWNheVRpbWUpLCBzdWIoMSwgc3VzdGFpbkxldmVsKSkpLCB7IGJvdW5kbW9kZTogJ2NsYW1wJyB9KSxcblxuICAvLyBzdXN0YWluXG4gIHN1c3RhaW5Db25kaXRpb24sIHBlZWsoYnVmZmVyRGF0YSwgc3VzdGFpbkxldmVsKSxcblxuICAvLyByZWxlYXNlXG4gIHJlbGVhc2VDb25kaXRpb24sIC8vbHQoIHBoYXNlLCAgYXR0YWNrVGltZSArICBkZWNheVRpbWUgKyAgc3VzdGFpblRpbWUgKyAgcmVsZWFzZVRpbWUgKSxcbiAgcGVlayhidWZmZXJEYXRhLCByZWxlYXNlQWNjdW0sXG4gIC8vc3ViKCAgc3VzdGFpbkxldmVsLCBtdWwoIGRpdiggc3ViKCBwaGFzZSwgIGF0dGFja1RpbWUgKyAgZGVjYXlUaW1lICsgIHN1c3RhaW5UaW1lKSwgIHJlbGVhc2VUaW1lICksICBzdXN0YWluTGV2ZWwgKSApLFxuICB7IGJvdW5kbW9kZTogJ2NsYW1wJyB9KSwgMCk7XG4gIC8vfVxuXG4gIG91dC50cmlnZ2VyID0gZnVuY3Rpb24gKCkge1xuICAgIHNob3VsZFN1c3RhaW4udmFsdWUgPSAxO1xuICAgIGVudlRyaWdnZXIudHJpZ2dlcigpO1xuICB9O1xuXG4gIG91dC5yZWxlYXNlID0gZnVuY3Rpb24gKCkge1xuICAgIHNob3VsZFN1c3RhaW4udmFsdWUgPSAwO1xuICAgIC8vIFhYWCBwcmV0dHkgbmFzdHkuLi4gZ3JhYnMgYWNjdW0gaW5zaWRlIG9mIGd0cCBhbmQgcmVzZXRzIHZhbHVlIG1hbnVhbGx5XG4gICAgLy8gdW5mb3J0dW5hdGVseSBlbnZUcmlnZ2VyIHdvbid0IHdvcmsgYXMgaXQncyBiYWNrIHRvIDAgYnkgdGhlIHRpbWUgdGhlIHJlbGVhc2UgYmxvY2sgaXMgdHJpZ2dlcmVkLi4uXG4gICAgZ2VuLm1lbW9yeS5oZWFwW3JlbGVhc2VBY2N1bS5pbnB1dHNbMF0uaW5wdXRzWzFdLm1lbW9yeS52YWx1ZS5pZHhdID0gMDtcbiAgfTtcblxuICByZXR1cm4gb3V0O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ2FuZCcsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIGlucHV0cyA9IF9nZW4uZ2V0SW5wdXRzKHRoaXMpLFxuICAgICAgICBvdXQgPSB2b2lkIDA7XG5cbiAgICBvdXQgPSAnICB2YXIgJyArIHRoaXMubmFtZSArICcgPSAoJyArIGlucHV0c1swXSArICcgIT09IDAgJiYgJyArIGlucHV0c1sxXSArICcgIT09IDApIHwgMFxcblxcbic7XG5cbiAgICBfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9ICcnICsgdGhpcy5uYW1lO1xuXG4gICAgcmV0dXJuIFsnJyArIHRoaXMubmFtZSwgb3V0XTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW4xLCBpbjIpIHtcbiAgdmFyIHVnZW4gPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcbiAgT2JqZWN0LmFzc2lnbih1Z2VuLCB7XG4gICAgdWlkOiBfZ2VuLmdldFVJRCgpLFxuICAgIGlucHV0czogW2luMSwgaW4yXVxuICB9KTtcblxuICB1Z2VuLm5hbWUgPSAnJyArIHVnZW4uYmFzZW5hbWUgKyB1Z2VuLnVpZDtcblxuICByZXR1cm4gdWdlbjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgYmFzZW5hbWU6ICdhc2luJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIGlmIChpc05hTihpbnB1dHNbMF0pKSB7XG4gICAgICBfZ2VuLmNsb3N1cmVzLmFkZCh7ICdhc2luJzogTWF0aC5hc2luIH0pO1xuXG4gICAgICBvdXQgPSAnZ2VuLmFzaW4oICcgKyBpbnB1dHNbMF0gKyAnICknO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgPSBNYXRoLmFzaW4ocGFyc2VGbG9hdChpbnB1dHNbMF0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh4KSB7XG4gIHZhciBhc2luID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgYXNpbi5pbnB1dHMgPSBbeF07XG4gIGFzaW4uaWQgPSBfZ2VuLmdldFVJRCgpO1xuICBhc2luLm5hbWUgPSBhc2luLmJhc2VuYW1lICsgJ3thc2luLmlkfSc7XG5cbiAgcmV0dXJuIGFzaW47XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAnYXRhbicsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIG91dCA9IHZvaWQgMCxcbiAgICAgICAgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyk7XG5cbiAgICBpZiAoaXNOYU4oaW5wdXRzWzBdKSkge1xuICAgICAgX2dlbi5jbG9zdXJlcy5hZGQoeyAnYXRhbic6IE1hdGguYXRhbiB9KTtcblxuICAgICAgb3V0ID0gJ2dlbi5hdGFuKCAnICsgaW5wdXRzWzBdICsgJyApJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ID0gTWF0aC5hdGFuKHBhcnNlRmxvYXQoaW5wdXRzWzBdKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeCkge1xuICB2YXIgYXRhbiA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIGF0YW4uaW5wdXRzID0gW3hdO1xuICBhdGFuLmlkID0gX2dlbi5nZXRVSUQoKTtcbiAgYXRhbi5uYW1lID0gYXRhbi5iYXNlbmFtZSArICd7YXRhbi5pZH0nO1xuXG4gIHJldHVybiBhdGFuO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBnZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpLFxuICAgIGhpc3RvcnkgPSByZXF1aXJlKCcuL2hpc3RvcnkuanMnKSxcbiAgICBtdWwgPSByZXF1aXJlKCcuL211bC5qcycpLFxuICAgIHN1YiA9IHJlcXVpcmUoJy4vc3ViLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWNheVRpbWUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyA0NDEwMCA6IGFyZ3VtZW50c1swXTtcblxuICAgIHZhciBzc2QgPSBoaXN0b3J5KDEpLFxuICAgICAgICB0NjAgPSBNYXRoLmV4cCgtNi45MDc3NTUyNzg5MjEgLyBkZWNheVRpbWUpO1xuXG4gICAgc3NkLmluKG11bChzc2Qub3V0LCB0NjApKTtcblxuICAgIHNzZC5vdXQudHJpZ2dlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3NkLnZhbHVlID0gMTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHN1YigxLCBzc2Qub3V0KTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgX2dlbi5yZXF1ZXN0TWVtb3J5KHRoaXMubWVtb3J5KTtcblxuICAgIHZhciBvdXQgPSAnICB2YXIgJyArIHRoaXMubmFtZSArICcgPSBtZW1vcnlbJyArIHRoaXMubWVtb3J5LnZhbHVlLmlkeCArICddXFxuICBpZiggJyArIHRoaXMubmFtZSArICcgPT09IDEgKSBtZW1vcnlbJyArIHRoaXMubWVtb3J5LnZhbHVlLmlkeCArICddID0gMCAgICAgIFxcbiAgICAgIFxcbic7XG4gICAgX2dlbi5tZW1vW3RoaXMubmFtZV0gPSB0aGlzLm5hbWU7XG5cbiAgICByZXR1cm4gW3RoaXMubmFtZSwgb3V0XTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoX3Byb3BzKSB7XG4gIHZhciB1Z2VuID0gT2JqZWN0LmNyZWF0ZShwcm90byksXG4gICAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHsgbWluOiAwLCBtYXg6IDEgfSwgX3Byb3BzKTtcblxuICB1Z2VuLm5hbWUgPSAnYmFuZycgKyBfZ2VuLmdldFVJRCgpO1xuXG4gIHVnZW4ubWluID0gcHJvcHMubWluO1xuICB1Z2VuLm1heCA9IHByb3BzLm1heDtcblxuICB1Z2VuLnRyaWdnZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgX2dlbi5tZW1vcnkuaGVhcFt1Z2VuLm1lbW9yeS52YWx1ZS5pZHhdID0gdWdlbi5tYXg7XG4gIH07XG5cbiAgdWdlbi5tZW1vcnkgPSB7XG4gICAgdmFsdWU6IHsgbGVuZ3RoOiAxLCBpZHg6IG51bGwgfVxuICB9O1xuXG4gIHJldHVybiB1Z2VuO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ2Jvb2wnLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKSxcbiAgICAgICAgb3V0ID0gdm9pZCAwO1xuXG4gICAgb3V0ID0gaW5wdXRzWzBdICsgJyA9PT0gMCA/IDAgOiAxJztcblxuICAgIC8vZ2VuLm1lbW9bIHRoaXMubmFtZSBdID0gYGdlbi5kYXRhLiR7dGhpcy5uYW1lfWBcblxuICAgIC8vcmV0dXJuIFsgYGdlbi5kYXRhLiR7dGhpcy5uYW1lfWAsICcgJyArb3V0IF1cbiAgICByZXR1cm4gb3V0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbjEpIHtcbiAgdmFyIHVnZW4gPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcblxuICBPYmplY3QuYXNzaWduKHVnZW4sIHtcbiAgICB1aWQ6IF9nZW4uZ2V0VUlEKCksXG4gICAgaW5wdXRzOiBbaW4xXVxuICB9KTtcblxuICB1Z2VuLm5hbWUgPSAnJyArIHVnZW4uYmFzZW5hbWUgKyB1Z2VuLnVpZDtcblxuICByZXR1cm4gdWdlbjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgbmFtZTogJ2NlaWwnLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBvdXQgPSB2b2lkIDAsXG4gICAgICAgIGlucHV0cyA9IF9nZW4uZ2V0SW5wdXRzKHRoaXMpO1xuXG4gICAgaWYgKGlzTmFOKGlucHV0c1swXSkpIHtcbiAgICAgIF9nZW4uY2xvc3VyZXMuYWRkKF9kZWZpbmVQcm9wZXJ0eSh7fSwgdGhpcy5uYW1lLCBNYXRoLmNlaWwpKTtcblxuICAgICAgb3V0ID0gJ2dlbi5jZWlsKCAnICsgaW5wdXRzWzBdICsgJyApJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ID0gTWF0aC5jZWlsKHBhcnNlRmxvYXQoaW5wdXRzWzBdKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeCkge1xuICB2YXIgY2VpbCA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIGNlaWwuaW5wdXRzID0gW3hdO1xuXG4gIHJldHVybiBjZWlsO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKSxcbiAgICBmbG9vciA9IHJlcXVpcmUoJy4vZmxvb3IuanMnKSxcbiAgICBzdWIgPSByZXF1aXJlKCcuL3N1Yi5qcycpLFxuICAgIG1lbW8gPSByZXF1aXJlKCcuL21lbW8uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ2NsaXAnLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBjb2RlID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKSxcbiAgICAgICAgb3V0ID0gdm9pZCAwO1xuXG4gICAgb3V0ID0gJyB2YXIgJyArIHRoaXMubmFtZSArICcgPSAnICsgaW5wdXRzWzBdICsgJ1xcbiAgaWYoICcgKyB0aGlzLm5hbWUgKyAnID4gJyArIGlucHV0c1syXSArICcgKSAnICsgdGhpcy5uYW1lICsgJyA9ICcgKyBpbnB1dHNbMl0gKyAnXFxuICBlbHNlIGlmKCAnICsgdGhpcy5uYW1lICsgJyA8ICcgKyBpbnB1dHNbMV0gKyAnICkgJyArIHRoaXMubmFtZSArICcgPSAnICsgaW5wdXRzWzFdICsgJ1xcbic7XG4gICAgb3V0ID0gJyAnICsgb3V0O1xuXG4gICAgX2dlbi5tZW1vW3RoaXMubmFtZV0gPSB0aGlzLm5hbWU7XG5cbiAgICByZXR1cm4gW3RoaXMubmFtZSwgb3V0XTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW4xKSB7XG4gIHZhciBtaW4gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAtMSA6IGFyZ3VtZW50c1sxXTtcbiAgdmFyIG1heCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IDEgOiBhcmd1bWVudHNbMl07XG5cbiAgdmFyIHVnZW4gPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcblxuICBPYmplY3QuYXNzaWduKHVnZW4sIHtcbiAgICBtaW46IG1pbixcbiAgICBtYXg6IG1heCxcbiAgICB1aWQ6IF9nZW4uZ2V0VUlEKCksXG4gICAgaW5wdXRzOiBbaW4xLCBtaW4sIG1heF1cbiAgfSk7XG5cbiAgdWdlbi5uYW1lID0gJycgKyB1Z2VuLmJhc2VuYW1lICsgdWdlbi51aWQ7XG5cbiAgcmV0dXJuIHVnZW47XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAnY29zJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIGlmIChpc05hTihpbnB1dHNbMF0pKSB7XG4gICAgICBfZ2VuLmNsb3N1cmVzLmFkZCh7ICdjb3MnOiBNYXRoLmNvcyB9KTtcblxuICAgICAgb3V0ID0gJ2dlbi5jb3MoICcgKyBpbnB1dHNbMF0gKyAnICknO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgPSBNYXRoLmNvcyhwYXJzZUZsb2F0KGlucHV0c1swXSkpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgpIHtcbiAgdmFyIGNvcyA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIGNvcy5pbnB1dHMgPSBbeF07XG4gIGNvcy5pZCA9IF9nZW4uZ2V0VUlEKCk7XG4gIGNvcy5uYW1lID0gY29zLmJhc2VuYW1lICsgJ3tjb3MuaWR9JztcblxuICByZXR1cm4gY29zO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ2NvdW50ZXInLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBjb2RlID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKSxcbiAgICAgICAgZ2VuTmFtZSA9ICdnZW4uJyArIHRoaXMubmFtZSxcbiAgICAgICAgZnVuY3Rpb25Cb2R5ID0gdm9pZCAwO1xuXG4gICAgaWYgKHRoaXMubWVtb3J5LnZhbHVlLmlkeCA9PT0gbnVsbCkgX2dlbi5yZXF1ZXN0TWVtb3J5KHRoaXMubWVtb3J5KTtcbiAgICBmdW5jdGlvbkJvZHkgPSB0aGlzLmNhbGxiYWNrKGdlbk5hbWUsIGlucHV0c1swXSwgaW5wdXRzWzFdLCBpbnB1dHNbMl0sIGlucHV0c1szXSwgaW5wdXRzWzRdLCAnbWVtb3J5WycgKyB0aGlzLm1lbW9yeS52YWx1ZS5pZHggKyAnXScsICdtZW1vcnlbJyArIHRoaXMubWVtb3J5LndyYXAuaWR4ICsgJ10nKTtcblxuICAgIF9nZW4uY2xvc3VyZXMuYWRkKF9kZWZpbmVQcm9wZXJ0eSh7fSwgdGhpcy5uYW1lLCB0aGlzKSk7XG5cbiAgICBfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9IHRoaXMubmFtZSArICdfdmFsdWUnO1xuXG4gICAgaWYgKF9nZW4ubWVtb1t0aGlzLndyYXAubmFtZV0gPT09IHVuZGVmaW5lZCkgdGhpcy53cmFwLmdlbigpO1xuXG4gICAgcmV0dXJuIFt0aGlzLm5hbWUgKyAnX3ZhbHVlJywgZnVuY3Rpb25Cb2R5XTtcbiAgfSxcbiAgY2FsbGJhY2s6IGZ1bmN0aW9uIGNhbGxiYWNrKF9uYW1lLCBfaW5jciwgX21pbiwgX21heCwgX3Jlc2V0LCBsb29wcywgdmFsdWVSZWYsIHdyYXBSZWYpIHtcbiAgICB2YXIgZGlmZiA9IHRoaXMubWF4IC0gdGhpcy5taW4sXG4gICAgICAgIG91dCA9ICcnLFxuICAgICAgICB3cmFwID0gJyc7XG4gICAgLy8gbXVzdCBjaGVjayBmb3IgcmVzZXQgYmVmb3JlIHN0b3JpbmcgdmFsdWUgZm9yIG91dHB1dFxuICAgIGlmICghKHR5cGVvZiB0aGlzLmlucHV0c1szXSA9PT0gJ251bWJlcicgJiYgdGhpcy5pbnB1dHNbM10gPCAxKSkge1xuICAgICAgb3V0ICs9ICcgIGlmKCAnICsgX3Jlc2V0ICsgJyA+PSAxICkgJyArIHZhbHVlUmVmICsgJyA9ICcgKyBfbWluICsgJ1xcbic7XG4gICAgfVxuXG4gICAgb3V0ICs9ICcgIHZhciAnICsgdGhpcy5uYW1lICsgJ192YWx1ZSA9ICcgKyB2YWx1ZVJlZiArICc7XFxuICAnICsgdmFsdWVSZWYgKyAnICs9ICcgKyBfaW5jciArICdcXG4nOyAvLyBzdG9yZSBvdXRwdXQgdmFsdWUgYmVmb3JlIGFjY3VtdWxhdGluZyBcblxuICAgIGlmICh0eXBlb2YgdGhpcy5tYXggPT09ICdudW1iZXInICYmIHRoaXMubWF4ICE9PSBJbmZpbml0eSAmJiB0eXBlb2YgdGhpcy5taW4gIT09ICdudW1iZXInKSB7XG4gICAgICB3cmFwID0gJyAgaWYoICcgKyB2YWx1ZVJlZiArICcgPj0gJyArIHRoaXMubWF4ICsgJyAmJiAgJyArIGxvb3BzICsgJyA+IDApIHtcXG4gICAgJyArIHZhbHVlUmVmICsgJyAtPSAnICsgZGlmZiArICdcXG4gICAgJyArIHdyYXBSZWYgKyAnID0gMVxcbiAgfWVsc2V7XFxuICAgICcgKyB3cmFwUmVmICsgJyA9IDBcXG4gIH1cXG4nO1xuICAgIH0gZWxzZSBpZiAodGhpcy5tYXggIT09IEluZmluaXR5ICYmIHRoaXMubWluICE9PSBJbmZpbml0eSkge1xuICAgICAgd3JhcCA9ICcgIGlmKCAnICsgdmFsdWVSZWYgKyAnID49ICcgKyBfbWF4ICsgJyAmJiAgJyArIGxvb3BzICsgJyA+IDApIHtcXG4gICAgJyArIHZhbHVlUmVmICsgJyAtPSAnICsgX21heCArICcgLSAnICsgX21pbiArICdcXG4gICAgJyArIHdyYXBSZWYgKyAnID0gMVxcbiAgfWVsc2UgaWYoICcgKyB2YWx1ZVJlZiArICcgPCAnICsgX21pbiArICcgJiYgICcgKyBsb29wcyArICcgPiAwKSB7XFxuICAgICcgKyB2YWx1ZVJlZiArICcgKz0gJyArIF9tYXggKyAnIC0gJyArIF9taW4gKyAnXFxuICAgICcgKyB3cmFwUmVmICsgJyA9IDFcXG4gIH1lbHNle1xcbiAgICAnICsgd3JhcFJlZiArICcgPSAwXFxuICB9XFxuJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9ICdcXG4nO1xuICAgIH1cblxuICAgIG91dCA9IG91dCArIHdyYXA7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGluY3IgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyAxIDogYXJndW1lbnRzWzBdO1xuICB2YXIgbWluID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gMCA6IGFyZ3VtZW50c1sxXTtcbiAgdmFyIG1heCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IEluZmluaXR5IDogYXJndW1lbnRzWzJdO1xuICB2YXIgcmVzZXQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDMgfHwgYXJndW1lbnRzWzNdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzNdO1xuICB2YXIgbG9vcHMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDQgfHwgYXJndW1lbnRzWzRdID09PSB1bmRlZmluZWQgPyAxIDogYXJndW1lbnRzWzRdO1xuICB2YXIgcHJvcGVydGllcyA9IGFyZ3VtZW50c1s1XTtcblxuICB2YXIgdWdlbiA9IE9iamVjdC5jcmVhdGUocHJvdG8pLFxuICAgICAgZGVmYXVsdHMgPSB7IGluaXRpYWxWYWx1ZTogMCwgc2hvdWxkV3JhcDogdHJ1ZSB9O1xuXG4gIGlmIChwcm9wZXJ0aWVzICE9PSB1bmRlZmluZWQpIE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIHByb3BlcnRpZXMpO1xuXG4gIE9iamVjdC5hc3NpZ24odWdlbiwge1xuICAgIG1pbjogbWluLFxuICAgIG1heDogbWF4LFxuICAgIHZhbHVlOiBkZWZhdWx0cy5pbml0aWFsVmFsdWUsXG4gICAgdWlkOiBfZ2VuLmdldFVJRCgpLFxuICAgIGlucHV0czogW2luY3IsIG1pbiwgbWF4LCByZXNldCwgbG9vcHNdLFxuICAgIG1lbW9yeToge1xuICAgICAgdmFsdWU6IHsgbGVuZ3RoOiAxLCBpZHg6IG51bGwgfSxcbiAgICAgIHdyYXA6IHsgbGVuZ3RoOiAxLCBpZHg6IG51bGwgfVxuICAgIH0sXG4gICAgd3JhcDoge1xuICAgICAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgICAgIGlmICh1Z2VuLm1lbW9yeS53cmFwLmlkeCA9PT0gbnVsbCkge1xuICAgICAgICAgIF9nZW4ucmVxdWVzdE1lbW9yeSh1Z2VuLm1lbW9yeSk7XG4gICAgICAgIH1cbiAgICAgICAgX2dlbi5nZXRJbnB1dHModGhpcyk7XG4gICAgICAgIF9nZW4ubWVtb1t0aGlzLm5hbWVdID0gJ21lbW9yeVsgJyArIHVnZW4ubWVtb3J5LndyYXAuaWR4ICsgJyBdJztcbiAgICAgICAgcmV0dXJuICdtZW1vcnlbICcgKyB1Z2VuLm1lbW9yeS53cmFwLmlkeCArICcgXSc7XG4gICAgICB9XG4gICAgfVxuICB9LCBkZWZhdWx0cyk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHVnZW4sICd2YWx1ZScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIGlmICh0aGlzLm1lbW9yeS52YWx1ZS5pZHggIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIF9nZW4ubWVtb3J5LmhlYXBbdGhpcy5tZW1vcnkudmFsdWUuaWR4XTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0KHYpIHtcbiAgICAgIGlmICh0aGlzLm1lbW9yeS52YWx1ZS5pZHggIT09IG51bGwpIHtcbiAgICAgICAgX2dlbi5tZW1vcnkuaGVhcFt0aGlzLm1lbW9yeS52YWx1ZS5pZHhdID0gdjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHVnZW4ud3JhcC5pbnB1dHMgPSBbdWdlbl07XG4gIHVnZW4ubmFtZSA9ICcnICsgdWdlbi5iYXNlbmFtZSArIHVnZW4udWlkO1xuICB1Z2VuLndyYXAubmFtZSA9IHVnZW4ubmFtZSArICdfd3JhcCc7XG4gIHJldHVybiB1Z2VuO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBnZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpLFxuICAgIGFjY3VtID0gcmVxdWlyZSgnLi9waGFzb3IuanMnKSxcbiAgICBkYXRhID0gcmVxdWlyZSgnLi9kYXRhLmpzJyksXG4gICAgcGVlayA9IHJlcXVpcmUoJy4vcGVlay5qcycpLFxuICAgIG11bCA9IHJlcXVpcmUoJy4vbXVsLmpzJyksXG4gICAgcGhhc29yID0gcmVxdWlyZSgnLi9waGFzb3IuanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ2N5Y2xlJyxcblxuICBpbml0VGFibGU6IGZ1bmN0aW9uIGluaXRUYWJsZSgpIHtcbiAgICB2YXIgYnVmZmVyID0gbmV3IEZsb2F0MzJBcnJheSgxMDI0KTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYnVmZmVyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgYnVmZmVyW2ldID0gTWF0aC5zaW4oaSAvIGwgKiAoTWF0aC5QSSAqIDIpKTtcbiAgICB9XG5cbiAgICBnZW4uZ2xvYmFscy5jeWNsZSA9IGRhdGEoYnVmZmVyLCAxLCB7IGltbXV0YWJsZTogdHJ1ZSB9KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBmcmVxdWVuY3kgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyAxIDogYXJndW1lbnRzWzBdO1xuICB2YXIgcmVzZXQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzFdO1xuICB2YXIgX3Byb3BzID0gYXJndW1lbnRzWzJdO1xuXG4gIGlmICh0eXBlb2YgZ2VuLmdsb2JhbHMuY3ljbGUgPT09ICd1bmRlZmluZWQnKSBwcm90by5pbml0VGFibGUoKTtcbiAgdmFyIHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgeyBtaW46IDAgfSwgX3Byb3BzKTtcblxuICB2YXIgdWdlbiA9IHBlZWsoZ2VuLmdsb2JhbHMuY3ljbGUsIHBoYXNvcihmcmVxdWVuY3ksIHJlc2V0LCBwcm9wcykpO1xuICB1Z2VuLm5hbWUgPSAnY3ljbGUnICsgZ2VuLmdldFVJRCgpO1xuXG4gIHJldHVybiB1Z2VuO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKSxcbiAgICB1dGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy5qcycpLFxuICAgIHBlZWsgPSByZXF1aXJlKCcuL3BlZWsuanMnKSxcbiAgICBwb2tlID0gcmVxdWlyZSgnLi9wb2tlLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgYmFzZW5hbWU6ICdkYXRhJyxcbiAgZ2xvYmFsczoge30sXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIGlkeCA9IHZvaWQgMDtcbiAgICBpZiAoX2dlbi5tZW1vW3RoaXMubmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHVnZW4gPSB0aGlzO1xuICAgICAgX2dlbi5yZXF1ZXN0TWVtb3J5KHRoaXMubWVtb3J5LCB0aGlzLmltbXV0YWJsZSk7XG4gICAgICBpZHggPSB0aGlzLm1lbW9yeS52YWx1ZXMuaWR4O1xuICAgICAgdHJ5IHtcbiAgICAgICAgX2dlbi5tZW1vcnkuaGVhcC5zZXQodGhpcy5idWZmZXIsIGlkeCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB0aHJvdyBFcnJvcignZXJyb3Igd2l0aCByZXF1ZXN0LiBhc2tpbmcgZm9yICcgKyB0aGlzLmJ1ZmZlci5sZW5ndGggKyAnLiBjdXJyZW50IGluZGV4OiAnICsgX2dlbi5tZW1vcnlJbmRleCArICcgb2YgJyArIF9nZW4ubWVtb3J5LmhlYXAubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIC8vZ2VuLmRhdGFbIHRoaXMubmFtZSBdID0gdGhpc1xuICAgICAgLy9yZXR1cm4gJ2dlbi5tZW1vcnknICsgdGhpcy5uYW1lICsgJy5idWZmZXInXG4gICAgICBfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9IGlkeDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWR4ID0gX2dlbi5tZW1vW3RoaXMubmFtZV07XG4gICAgfVxuICAgIHJldHVybiBpZHg7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgpIHtcbiAgdmFyIHkgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAxIDogYXJndW1lbnRzWzFdO1xuICB2YXIgcHJvcGVydGllcyA9IGFyZ3VtZW50c1syXTtcblxuICB2YXIgdWdlbiA9IHZvaWQgMCxcbiAgICAgIGJ1ZmZlciA9IHZvaWQgMCxcbiAgICAgIHNob3VsZExvYWQgPSBmYWxzZTtcblxuICBpZiAocHJvcGVydGllcyAhPT0gdW5kZWZpbmVkICYmIHByb3BlcnRpZXMuZ2xvYmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoX2dlbi5nbG9iYWxzW3Byb3BlcnRpZXMuZ2xvYmFsXSkge1xuICAgICAgcmV0dXJuIF9nZW4uZ2xvYmFsc1twcm9wZXJ0aWVzLmdsb2JhbF07XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGVvZiB4ID09PSAnbnVtYmVyJykge1xuICAgIGlmICh5ICE9PSAxKSB7XG4gICAgICBidWZmZXIgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeTsgaSsrKSB7XG4gICAgICAgIGJ1ZmZlcltpXSA9IG5ldyBGbG9hdDMyQXJyYXkoeCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoeCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoeCkpIHtcbiAgICAvLyEgKHggaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgKSApIHtcbiAgICB2YXIgc2l6ZSA9IHgubGVuZ3RoO1xuICAgIGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoc2l6ZSk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IHgubGVuZ3RoOyBfaSsrKSB7XG4gICAgICBidWZmZXJbX2ldID0geFtfaV07XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykge1xuICAgIGJ1ZmZlciA9IHsgbGVuZ3RoOiB5ID4gMSA/IHkgOiBfZ2VuLnNhbXBsZXJhdGUgKiA2MCB9OyAvLyBYWFggd2hhdD8/P1xuICAgIHNob3VsZExvYWQgPSB0cnVlO1xuICB9IGVsc2UgaWYgKHggaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkpIHtcbiAgICBidWZmZXIgPSB4O1xuICB9XG5cbiAgdWdlbiA9IHtcbiAgICBidWZmZXI6IGJ1ZmZlcixcbiAgICBuYW1lOiBwcm90by5iYXNlbmFtZSArIF9nZW4uZ2V0VUlEKCksXG4gICAgZGltOiBidWZmZXIubGVuZ3RoLCAvLyBYWFggaG93IGRvIHdlIGR5bmFtaWNhbGx5IGFsbG9jYXRlIHRoaXM/XG4gICAgY2hhbm5lbHM6IDEsXG4gICAgZ2VuOiBwcm90by5nZW4sXG4gICAgb25sb2FkOiBudWxsLFxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZm5jKSB7XG4gICAgICB1Z2VuLm9ubG9hZCA9IGZuYztcbiAgICAgIHJldHVybiB1Z2VuO1xuICAgIH0sXG5cbiAgICBpbW11dGFibGU6IHByb3BlcnRpZXMgIT09IHVuZGVmaW5lZCAmJiBwcm9wZXJ0aWVzLmltbXV0YWJsZSA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZSxcbiAgICBsb2FkOiBmdW5jdGlvbiBsb2FkKGZpbGVuYW1lKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IHV0aWxpdGllcy5sb2FkU2FtcGxlKGZpbGVuYW1lLCB1Z2VuKTtcbiAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAoX2J1ZmZlcikge1xuICAgICAgICB1Z2VuLm1lbW9yeS52YWx1ZXMubGVuZ3RoID0gdWdlbi5kaW0gPSBfYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgdWdlbi5vbmxvYWQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICB1Z2VuLm1lbW9yeSA9IHtcbiAgICB2YWx1ZXM6IHsgbGVuZ3RoOiB1Z2VuLmRpbSwgaWR4OiBudWxsIH1cbiAgfTtcblxuICBfZ2VuLm5hbWUgPSAnZGF0YScgKyBfZ2VuLmdldFVJRCgpO1xuXG4gIGlmIChzaG91bGRMb2FkKSB1Z2VuLmxvYWQoeCk7XG5cbiAgaWYgKHByb3BlcnRpZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChwcm9wZXJ0aWVzLmdsb2JhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBfZ2VuLmdsb2JhbHNbcHJvcGVydGllcy5nbG9iYWxdID0gdWdlbjtcbiAgICB9XG4gICAgaWYgKHByb3BlcnRpZXMubWV0YSA9PT0gdHJ1ZSkge1xuICAgICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AobGVuZ3RoLCBfaTIpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHVnZW4sIF9pMiwge1xuICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHBlZWsodWdlbiwgX2kyLCB7IG1vZGU6ICdzaW1wbGUnLCBpbnRlcnA6ICdub25lJyB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHYpIHtcbiAgICAgICAgICAgIHJldHVybiBwb2tlKHVnZW4sIHYsIF9pMik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIF9pMiA9IDAsIGxlbmd0aCA9IHVnZW4uYnVmZmVyLmxlbmd0aDsgX2kyIDwgbGVuZ3RoOyBfaTIrKykge1xuICAgICAgICBfbG9vcChsZW5ndGgsIF9pMik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHVnZW47XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyksXG4gICAgaGlzdG9yeSA9IHJlcXVpcmUoJy4vaGlzdG9yeS5qcycpLFxuICAgIHN1YiA9IHJlcXVpcmUoJy4vc3ViLmpzJyksXG4gICAgYWRkID0gcmVxdWlyZSgnLi9hZGQuanMnKSxcbiAgICBtdWwgPSByZXF1aXJlKCcuL211bC5qcycpLFxuICAgIG1lbW8gPSByZXF1aXJlKCcuL21lbW8uanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW4xKSB7XG4gICAgdmFyIHgxID0gaGlzdG9yeSgpLFxuICAgICAgICB5MSA9IGhpc3RvcnkoKSxcbiAgICAgICAgZmlsdGVyID0gdm9pZCAwO1xuXG4gICAgLy9IaXN0b3J5IHgxLCB5MTsgeSA9IGluMSAtIHgxICsgeTEqMC45OTk3OyB4MSA9IGluMTsgeTEgPSB5OyBvdXQxID0geTtcbiAgICBmaWx0ZXIgPSBtZW1vKGFkZChzdWIoaW4xLCB4MS5vdXQpLCBtdWwoeTEub3V0LCAuOTk5NykpKTtcbiAgICB4MS5pbihpbjEpO1xuICAgIHkxLmluKGZpbHRlcik7XG5cbiAgICByZXR1cm4gZmlsdGVyO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBnZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpLFxuICAgIGhpc3RvcnkgPSByZXF1aXJlKCcuL2hpc3RvcnkuanMnKSxcbiAgICBtdWwgPSByZXF1aXJlKCcuL211bC5qcycpLFxuICAgIHQ2MCA9IHJlcXVpcmUoJy4vdDYwLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWNheVRpbWUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyA0NDEwMCA6IGFyZ3VtZW50c1swXTtcbiAgICB2YXIgcHJvcHMgPSBhcmd1bWVudHNbMV07XG5cbiAgICB2YXIgcHJvcGVydGllcyA9IE9iamVjdC5hc3NpZ24oe30sIHsgaW5pdFZhbHVlOiAxIH0sIHByb3BzKSxcbiAgICAgICAgc3NkID0gaGlzdG9yeShwcm9wZXJ0aWVzLmluaXRWYWx1ZSk7XG5cbiAgICBzc2QuaW4obXVsKHNzZC5vdXQsIHQ2MChkZWNheVRpbWUpKSk7XG5cbiAgICBzc2Qub3V0LnRyaWdnZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNzZC52YWx1ZSA9IDE7XG4gICAgfTtcblxuICAgIHJldHVybiBzc2Qub3V0O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkgeyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gZWxzZSB7IHJldHVybiBBcnJheS5mcm9tKGFycik7IH0gfVxuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyksXG4gICAgZGF0YSA9IHJlcXVpcmUoJy4vZGF0YS5qcycpLFxuICAgIHBva2UgPSByZXF1aXJlKCcuL3Bva2UuanMnKSxcbiAgICBwZWVrID0gcmVxdWlyZSgnLi9wZWVrLmpzJyksXG4gICAgc3ViID0gcmVxdWlyZSgnLi9zdWIuanMnKSxcbiAgICB3cmFwID0gcmVxdWlyZSgnLi93cmFwLmpzJyksXG4gICAgYWNjdW0gPSByZXF1aXJlKCcuL2FjY3VtLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgYmFzZW5hbWU6ICdkZWxheScsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIGlucHV0cyA9IF9nZW4uZ2V0SW5wdXRzKHRoaXMpO1xuXG4gICAgX2dlbi5tZW1vW3RoaXMubmFtZV0gPSBpbnB1dHNbMF07XG5cbiAgICByZXR1cm4gaW5wdXRzWzBdO1xuICB9XG59O1xuXG52YXIgZGVmYXVsdHMgPSB7IHNpemU6IDUxMiwgZmVlZGJhY2s6IDAsIGludGVycDogJ25vbmUnIH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluMSwgdGFwcywgcHJvcGVydGllcykge1xuICB2YXIgdWdlbiA9IE9iamVjdC5jcmVhdGUocHJvdG8pLFxuICAgICAgd3JpdGVJZHggPSB2b2lkIDAsXG4gICAgICByZWFkSWR4ID0gdm9pZCAwLFxuICAgICAgZGVsYXlkYXRhID0gdm9pZCAwO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KHRhcHMpID09PSBmYWxzZSkgdGFwcyA9IFt0YXBzXTtcblxuICB2YXIgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgcHJvcGVydGllcyk7XG5cbiAgaWYgKHByb3BzLnNpemUgPCBNYXRoLm1heC5hcHBseShNYXRoLCBfdG9Db25zdW1hYmxlQXJyYXkodGFwcykpKSBwcm9wcy5zaXplID0gTWF0aC5tYXguYXBwbHkoTWF0aCwgX3RvQ29uc3VtYWJsZUFycmF5KHRhcHMpKTtcblxuICBkZWxheWRhdGEgPSBkYXRhKHByb3BzLnNpemUpO1xuXG4gIHVnZW4uaW5wdXRzID0gW107XG5cbiAgd3JpdGVJZHggPSBhY2N1bSgxLCAwLCB7IG1heDogcHJvcHMuc2l6ZSB9KTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcHMubGVuZ3RoOyBpKyspIHtcbiAgICB1Z2VuLmlucHV0c1tpXSA9IHBlZWsoZGVsYXlkYXRhLCB3cmFwKHN1Yih3cml0ZUlkeCwgdGFwc1tpXSksIDAsIHByb3BzLnNpemUpLCB7IG1vZGU6ICdzYW1wbGVzJywgaW50ZXJwOiBwcm9wcy5pbnRlcnAgfSk7XG4gIH1cblxuICB1Z2VuLm91dHB1dHMgPSB1Z2VuLmlucHV0czsgLy8gdWduLCBVZ2gsIFVHSCEgYnV0IGkgZ3Vlc3MgaXQgd29ya3MuXG5cbiAgcG9rZShkZWxheWRhdGEsIGluMSwgd3JpdGVJZHgpO1xuXG4gIHVnZW4ubmFtZSA9ICcnICsgdWdlbi5iYXNlbmFtZSArIF9nZW4uZ2V0VUlEKCk7XG5cbiAgcmV0dXJuIHVnZW47XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyksXG4gICAgaGlzdG9yeSA9IHJlcXVpcmUoJy4vaGlzdG9yeS5qcycpLFxuICAgIHN1YiA9IHJlcXVpcmUoJy4vc3ViLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluMSkge1xuICB2YXIgbjEgPSBoaXN0b3J5KCk7XG5cbiAgbjEuaW4oaW4xKTtcblxuICB2YXIgdWdlbiA9IHN1YihpbjEsIG4xLm91dCk7XG4gIHVnZW4ubmFtZSA9ICdkZWx0YScgKyBnZW4uZ2V0VUlEKCk7XG5cbiAgcmV0dXJuIHVnZW47XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAnZGl2JyxcbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIGlucHV0cyA9IF9nZW4uZ2V0SW5wdXRzKHRoaXMpLFxuICAgICAgICBvdXQgPSAnICB2YXIgJyArIHRoaXMubmFtZSArICcgPSAnLFxuICAgICAgICBkaWZmID0gMCxcbiAgICAgICAgbnVtQ291bnQgPSAwLFxuICAgICAgICBsYXN0TnVtYmVyID0gaW5wdXRzWzBdLFxuICAgICAgICBsYXN0TnVtYmVySXNVZ2VuID0gaXNOYU4obGFzdE51bWJlciksXG4gICAgICAgIGRpdkF0RW5kID0gZmFsc2U7XG5cbiAgICBpbnB1dHMuZm9yRWFjaChmdW5jdGlvbiAodiwgaSkge1xuICAgICAgaWYgKGkgPT09IDApIHJldHVybjtcblxuICAgICAgdmFyIGlzTnVtYmVyVWdlbiA9IGlzTmFOKHYpLFxuICAgICAgICAgIGlzRmluYWxJZHggPSBpID09PSBpbnB1dHMubGVuZ3RoIC0gMTtcblxuICAgICAgaWYgKCFsYXN0TnVtYmVySXNVZ2VuICYmICFpc051bWJlclVnZW4pIHtcbiAgICAgICAgbGFzdE51bWJlciA9IGxhc3ROdW1iZXIgLyB2O1xuICAgICAgICBvdXQgKz0gbGFzdE51bWJlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSBsYXN0TnVtYmVyICsgJyAvICcgKyB2O1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzRmluYWxJZHgpIG91dCArPSAnIC8gJztcbiAgICB9KTtcblxuICAgIG91dCArPSAnXFxuJztcblxuICAgIF9nZW4ubWVtb1t0aGlzLm5hbWVdID0gdGhpcy5uYW1lO1xuXG4gICAgcmV0dXJuIFt0aGlzLm5hbWUsIG91dF07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGFyZ3NbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gIH1cblxuICB2YXIgZGl2ID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgT2JqZWN0LmFzc2lnbihkaXYsIHtcbiAgICBpZDogX2dlbi5nZXRVSUQoKSxcbiAgICBpbnB1dHM6IGFyZ3NcbiAgfSk7XG5cbiAgZGl2Lm5hbWUgPSBkaXYuYmFzZW5hbWUgKyBkaXYuaWQ7XG5cbiAgcmV0dXJuIGRpdjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2VuID0gcmVxdWlyZSgnLi9nZW4nKSxcbiAgICB3aW5kb3dzID0gcmVxdWlyZSgnLi93aW5kb3dzJyksXG4gICAgZGF0YSA9IHJlcXVpcmUoJy4vZGF0YScpLFxuICAgIHBlZWsgPSByZXF1aXJlKCcuL3BlZWsnKSxcbiAgICBwaGFzb3IgPSByZXF1aXJlKCcuL3BoYXNvcicpLFxuICAgIGRlZmF1bHRzID0ge1xuICB0eXBlOiAndHJpYW5ndWxhcicsIGxlbmd0aDogMTAyNCwgYWxwaGE6IC4xNSwgc2hpZnQ6IDAsIHJldmVyc2U6IGZhbHNlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwcm9wcykge1xuXG4gIHZhciBwcm9wZXJ0aWVzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIHByb3BzKTtcbiAgdmFyIGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkocHJvcGVydGllcy5sZW5ndGgpO1xuXG4gIHZhciBuYW1lID0gcHJvcGVydGllcy50eXBlICsgJ18nICsgcHJvcGVydGllcy5sZW5ndGggKyAnXycgKyBwcm9wZXJ0aWVzLnNoaWZ0ICsgJ18nICsgcHJvcGVydGllcy5yZXZlcnNlO1xuICBpZiAodHlwZW9mIGdlbi5nbG9iYWxzLndpbmRvd3NbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZmZlcltpXSA9IHdpbmRvd3NbcHJvcGVydGllcy50eXBlXShwcm9wZXJ0aWVzLmxlbmd0aCwgaSwgcHJvcGVydGllcy5hbHBoYSwgcHJvcGVydGllcy5zaGlmdCk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMucmV2ZXJzZSA9PT0gdHJ1ZSkge1xuICAgICAgYnVmZmVyLnJldmVyc2UoKTtcbiAgICB9XG4gICAgZ2VuLmdsb2JhbHMud2luZG93c1tuYW1lXSA9IGRhdGEoYnVmZmVyKTtcbiAgfVxuXG4gIHZhciB1Z2VuID0gZ2VuLmdsb2JhbHMud2luZG93c1tuYW1lXTtcbiAgdWdlbi5uYW1lID0gJ2VudicgKyBnZW4uZ2V0VUlEKCk7XG5cbiAgcmV0dXJuIHVnZW47XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAnZXEnLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKSxcbiAgICAgICAgb3V0ID0gdm9pZCAwO1xuXG4gICAgb3V0ID0gdGhpcy5pbnB1dHNbMF0gPT09IHRoaXMuaW5wdXRzWzFdID8gMSA6ICcgIHZhciAnICsgdGhpcy5uYW1lICsgJyA9ICgnICsgaW5wdXRzWzBdICsgJyA9PT0gJyArIGlucHV0c1sxXSArICcpIHwgMFxcblxcbic7XG5cbiAgICBfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9ICcnICsgdGhpcy5uYW1lO1xuXG4gICAgcmV0dXJuIFsnJyArIHRoaXMubmFtZSwgb3V0XTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW4xLCBpbjIpIHtcbiAgdmFyIHVnZW4gPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcbiAgT2JqZWN0LmFzc2lnbih1Z2VuLCB7XG4gICAgdWlkOiBfZ2VuLmdldFVJRCgpLFxuICAgIGlucHV0czogW2luMSwgaW4yXVxuICB9KTtcblxuICB1Z2VuLm5hbWUgPSAnJyArIHVnZW4uYmFzZW5hbWUgKyB1Z2VuLnVpZDtcblxuICByZXR1cm4gdWdlbjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgbmFtZTogJ2V4cCcsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIG91dCA9IHZvaWQgMCxcbiAgICAgICAgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyk7XG5cbiAgICBpZiAoaXNOYU4oaW5wdXRzWzBdKSkge1xuICAgICAgX2dlbi5jbG9zdXJlcy5hZGQoX2RlZmluZVByb3BlcnR5KHt9LCB0aGlzLm5hbWUsIE1hdGguZXhwKSk7XG5cbiAgICAgIG91dCA9ICdnZW4uZXhwKCAnICsgaW5wdXRzWzBdICsgJyApJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ID0gTWF0aC5leHAocGFyc2VGbG9hdChpbnB1dHNbMF0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh4KSB7XG4gIHZhciBleHAgPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcblxuICBleHAuaW5wdXRzID0gW3hdO1xuXG4gIHJldHVybiBleHA7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIG5hbWU6ICdmbG9vcicsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIG91dCA9IHZvaWQgMCxcbiAgICAgICAgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyk7XG5cbiAgICBpZiAoaXNOYU4oaW5wdXRzWzBdKSkge1xuICAgICAgLy9nZW4uY2xvc3VyZXMuYWRkKHsgWyB0aGlzLm5hbWUgXTogTWF0aC5mbG9vciB9KVxuXG4gICAgICBvdXQgPSAnKCAnICsgaW5wdXRzWzBdICsgJyB8IDAgKSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCA9IGlucHV0c1swXSB8IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeCkge1xuICB2YXIgZmxvb3IgPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcblxuICBmbG9vci5pbnB1dHMgPSBbeF07XG5cbiAgcmV0dXJuIGZsb29yO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ2ZvbGQnLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBjb2RlID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKSxcbiAgICAgICAgb3V0ID0gdm9pZCAwO1xuXG4gICAgb3V0ID0gdGhpcy5jcmVhdGVDYWxsYmFjayhpbnB1dHNbMF0sIHRoaXMubWluLCB0aGlzLm1heCk7XG5cbiAgICBfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9IHRoaXMubmFtZSArICdfdmFsdWUnO1xuXG4gICAgcmV0dXJuIFt0aGlzLm5hbWUgKyAnX3ZhbHVlJywgb3V0XTtcbiAgfSxcbiAgY3JlYXRlQ2FsbGJhY2s6IGZ1bmN0aW9uIGNyZWF0ZUNhbGxiYWNrKHYsIGxvLCBoaSkge1xuICAgIHZhciBvdXQgPSAnIHZhciAnICsgdGhpcy5uYW1lICsgJ192YWx1ZSA9ICcgKyB2ICsgJyxcXG4gICAgICAnICsgdGhpcy5uYW1lICsgJ19yYW5nZSA9ICcgKyBoaSArICcgLSAnICsgbG8gKyAnLFxcbiAgICAgICcgKyB0aGlzLm5hbWUgKyAnX251bVdyYXBzID0gMFxcblxcbiAgaWYoJyArIHRoaXMubmFtZSArICdfdmFsdWUgPj0gJyArIGhpICsgJyl7XFxuICAgICcgKyB0aGlzLm5hbWUgKyAnX3ZhbHVlIC09ICcgKyB0aGlzLm5hbWUgKyAnX3JhbmdlXFxuICAgIGlmKCcgKyB0aGlzLm5hbWUgKyAnX3ZhbHVlID49ICcgKyBoaSArICcpe1xcbiAgICAgICcgKyB0aGlzLm5hbWUgKyAnX251bVdyYXBzID0gKCgnICsgdGhpcy5uYW1lICsgJ192YWx1ZSAtICcgKyBsbyArICcpIC8gJyArIHRoaXMubmFtZSArICdfcmFuZ2UpIHwgMFxcbiAgICAgICcgKyB0aGlzLm5hbWUgKyAnX3ZhbHVlIC09ICcgKyB0aGlzLm5hbWUgKyAnX3JhbmdlICogJyArIHRoaXMubmFtZSArICdfbnVtV3JhcHNcXG4gICAgfVxcbiAgICAnICsgdGhpcy5uYW1lICsgJ19udW1XcmFwcysrXFxuICB9IGVsc2UgaWYoJyArIHRoaXMubmFtZSArICdfdmFsdWUgPCAnICsgbG8gKyAnKXtcXG4gICAgJyArIHRoaXMubmFtZSArICdfdmFsdWUgKz0gJyArIHRoaXMubmFtZSArICdfcmFuZ2VcXG4gICAgaWYoJyArIHRoaXMubmFtZSArICdfdmFsdWUgPCAnICsgbG8gKyAnKXtcXG4gICAgICAnICsgdGhpcy5uYW1lICsgJ19udW1XcmFwcyA9ICgoJyArIHRoaXMubmFtZSArICdfdmFsdWUgLSAnICsgbG8gKyAnKSAvICcgKyB0aGlzLm5hbWUgKyAnX3JhbmdlLSAxKSB8IDBcXG4gICAgICAnICsgdGhpcy5uYW1lICsgJ192YWx1ZSAtPSAnICsgdGhpcy5uYW1lICsgJ19yYW5nZSAqICcgKyB0aGlzLm5hbWUgKyAnX251bVdyYXBzXFxuICAgIH1cXG4gICAgJyArIHRoaXMubmFtZSArICdfbnVtV3JhcHMtLVxcbiAgfVxcbiAgaWYoJyArIHRoaXMubmFtZSArICdfbnVtV3JhcHMgJiAxKSAnICsgdGhpcy5uYW1lICsgJ192YWx1ZSA9ICcgKyBoaSArICcgKyAnICsgbG8gKyAnIC0gJyArIHRoaXMubmFtZSArICdfdmFsdWVcXG4nO1xuICAgIHJldHVybiAnICcgKyBvdXQ7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluMSkge1xuICB2YXIgbWluID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gMCA6IGFyZ3VtZW50c1sxXTtcbiAgdmFyIG1heCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IDEgOiBhcmd1bWVudHNbMl07XG5cbiAgdmFyIHVnZW4gPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcblxuICBPYmplY3QuYXNzaWduKHVnZW4sIHtcbiAgICBtaW46IG1pbixcbiAgICBtYXg6IG1heCxcbiAgICB1aWQ6IF9nZW4uZ2V0VUlEKCksXG4gICAgaW5wdXRzOiBbaW4xXVxuICB9KTtcblxuICB1Z2VuLm5hbWUgPSAnJyArIHVnZW4uYmFzZW5hbWUgKyB1Z2VuLnVpZDtcblxuICByZXR1cm4gdWdlbjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAnZ2F0ZScsXG4gIGNvbnRyb2xTdHJpbmc6IG51bGwsIC8vIGluc2VydCBpbnRvIG91dHB1dCBjb2RlZ2VuIGZvciBkZXRlcm1pbmluZyBpbmRleGluZ1xuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyksXG4gICAgICAgIG91dCA9IHZvaWQgMDtcblxuICAgIF9nZW4ucmVxdWVzdE1lbW9yeSh0aGlzLm1lbW9yeSk7XG5cbiAgICB2YXIgbGFzdElucHV0TWVtb3J5SWR4ID0gJ21lbW9yeVsgJyArIHRoaXMubWVtb3J5Lmxhc3RJbnB1dC5pZHggKyAnIF0nLFxuICAgICAgICBvdXRwdXRNZW1vcnlTdGFydElkeCA9IHRoaXMubWVtb3J5Lmxhc3RJbnB1dC5pZHggKyAxLFxuICAgICAgICBpbnB1dFNpZ25hbCA9IGlucHV0c1swXSxcbiAgICAgICAgY29udHJvbFNpZ25hbCA9IGlucHV0c1sxXTtcblxuICAgIC8qIFxuICAgICAqIHdlIGNoZWNrIHRvIHNlZSBpZiB0aGUgY3VycmVudCBjb250cm9sIGlucHV0cyBlcXVhbHMgb3VyIGxhc3QgaW5wdXRcbiAgICAgKiBpZiBzbywgd2Ugc3RvcmUgdGhlIHNpZ25hbCBpbnB1dCBpbiB0aGUgbWVtb3J5IGFzc29jaWF0ZWQgd2l0aCB0aGUgY3VycmVudGx5XG4gICAgICogc2VsZWN0ZWQgaW5kZXguIElmIG5vdCwgd2UgcHV0IDAgaW4gdGhlIG1lbW9yeSBhc3NvY2lhdGVkIHdpdGggdGhlIGxhc3Qgc2VsZWN0ZWQgaW5kZXgsXG4gICAgICogY2hhbmdlIHRoZSBzZWxlY3RlZCBpbmRleCwgYW5kIHRoZW4gc3RvcmUgdGhlIHNpZ25hbCBpbiBwdXQgaW4gdGhlIG1lbWVyeSBhc3NvaWNhdGVkXG4gICAgICogd2l0aCB0aGUgbmV3bHkgc2VsZWN0ZWQgaW5kZXhcbiAgICAgKi9cblxuICAgIG91dCA9ICcgaWYoICcgKyBjb250cm9sU2lnbmFsICsgJyAhPT0gJyArIGxhc3RJbnB1dE1lbW9yeUlkeCArICcgKSB7XFxuICAgIG1lbW9yeVsgJyArIGxhc3RJbnB1dE1lbW9yeUlkeCArICcgKyAnICsgb3V0cHV0TWVtb3J5U3RhcnRJZHggKyAnICBdID0gMCBcXG4gICAgJyArIGxhc3RJbnB1dE1lbW9yeUlkeCArICcgPSAnICsgY29udHJvbFNpZ25hbCArICdcXG4gIH1cXG4gIG1lbW9yeVsgJyArIG91dHB1dE1lbW9yeVN0YXJ0SWR4ICsgJyArICcgKyBjb250cm9sU2lnbmFsICsgJyBdID0gJyArIGlucHV0U2lnbmFsICsgJ1xcblxcbic7XG4gICAgdGhpcy5jb250cm9sU3RyaW5nID0gaW5wdXRzWzFdO1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgX2dlbi5tZW1vW3RoaXMubmFtZV0gPSB0aGlzLm5hbWU7XG5cbiAgICB0aGlzLm91dHB1dHMuZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgICAgcmV0dXJuIHYuZ2VuKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gW251bGwsICcgJyArIG91dF07XG4gIH0sXG4gIGNoaWxkZ2VuOiBmdW5jdGlvbiBjaGlsZGdlbigpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQuaW5pdGlhbGl6ZWQgPT09IGZhbHNlKSB7XG4gICAgICBfZ2VuLmdldElucHV0cyh0aGlzKTsgLy8gcGFyZW50IGdhdGUgaXMgb25seSBpbnB1dCBvZiBhIGdhdGUgb3V0cHV0LCBzaG91bGQgb25seSBiZSBnZW4nZCBvbmNlLlxuICAgIH1cblxuICAgIGlmIChfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBfZ2VuLnJlcXVlc3RNZW1vcnkodGhpcy5tZW1vcnkpO1xuXG4gICAgICBfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9ICdtZW1vcnlbICcgKyB0aGlzLm1lbW9yeS52YWx1ZS5pZHggKyAnIF0nO1xuICAgIH1cblxuICAgIHJldHVybiAnbWVtb3J5WyAnICsgdGhpcy5tZW1vcnkudmFsdWUuaWR4ICsgJyBdJztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udHJvbCwgaW4xLCBwcm9wZXJ0aWVzKSB7XG4gIHZhciB1Z2VuID0gT2JqZWN0LmNyZWF0ZShwcm90byksXG4gICAgICBkZWZhdWx0cyA9IHsgY291bnQ6IDIgfTtcblxuICBpZiAoKHR5cGVvZiBwcm9wZXJ0aWVzID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihwcm9wZXJ0aWVzKSkgIT09IHVuZGVmaW5lZCkgT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgcHJvcGVydGllcyk7XG5cbiAgT2JqZWN0LmFzc2lnbih1Z2VuLCB7XG4gICAgb3V0cHV0czogW10sXG4gICAgdWlkOiBfZ2VuLmdldFVJRCgpLFxuICAgIGlucHV0czogW2luMSwgY29udHJvbF0sXG4gICAgbWVtb3J5OiB7XG4gICAgICBsYXN0SW5wdXQ6IHsgbGVuZ3RoOiAxLCBpZHg6IG51bGwgfVxuICAgIH0sXG4gICAgaW5pdGlhbGl6ZWQ6IGZhbHNlXG4gIH0sIGRlZmF1bHRzKTtcblxuICB1Z2VuLm5hbWUgPSAnJyArIHVnZW4uYmFzZW5hbWUgKyBfZ2VuLmdldFVJRCgpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdWdlbi5jb3VudDsgaSsrKSB7XG4gICAgdWdlbi5vdXRwdXRzLnB1c2goe1xuICAgICAgaW5kZXg6IGksXG4gICAgICBnZW46IHByb3RvLmNoaWxkZ2VuLFxuICAgICAgcGFyZW50OiB1Z2VuLFxuICAgICAgaW5wdXRzOiBbdWdlbl0sXG4gICAgICBtZW1vcnk6IHtcbiAgICAgICAgdmFsdWU6IHsgbGVuZ3RoOiAxLCBpZHg6IG51bGwgfVxuICAgICAgfSxcbiAgICAgIGluaXRpYWxpemVkOiBmYWxzZSxcbiAgICAgIG5hbWU6IHVnZW4ubmFtZSArICdfb3V0JyArIF9nZW4uZ2V0VUlEKClcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB1Z2VuO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qIGdlbi5qc1xuICpcbiAqIGxvdy1sZXZlbCBjb2RlIGdlbmVyYXRpb24gZm9yIHVuaXQgZ2VuZXJhdG9yc1xuICpcbiAqL1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIE1lbW9yeUhlbHBlciA9IHJlcXVpcmUoJ21lbW9yeS1oZWxwZXInKTtcblxudmFyIGdlbiA9IHtcblxuICBhY2N1bTogMCxcbiAgZ2V0VUlEOiBmdW5jdGlvbiBnZXRVSUQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjdW0rKztcbiAgfSxcblxuICBkZWJ1ZzogZmFsc2UsXG4gIHNhbXBsZXJhdGU6IDQ0MTAwLCAvLyBjaGFuZ2Ugb24gYXVkaW9jb250ZXh0IGNyZWF0aW9uXG4gIHNob3VsZExvY2FsaXplOiBmYWxzZSxcbiAgZ2xvYmFsczoge1xuICAgIHdpbmRvd3M6IHt9XG4gIH0sXG5cbiAgLyogY2xvc3VyZXNcbiAgICpcbiAgICogRnVuY3Rpb25zIHRoYXQgYXJlIGluY2x1ZGVkIGFzIGFyZ3VtZW50cyB0byBtYXN0ZXIgY2FsbGJhY2suIEV4YW1wbGVzOiBNYXRoLmFicywgTWF0aC5yYW5kb20gZXRjLlxuICAgKiBYWFggU2hvdWxkIHByb2JhYmx5IGJlIHJlbmFtZWQgY2FsbGJhY2tQcm9wZXJ0aWVzIG9yIHNvbWV0aGluZyBzaW1pbGFyLi4uIGNsb3N1cmVzIGFyZSBubyBsb25nZXIgdXNlZC5cbiAgICovXG5cbiAgY2xvc3VyZXM6IG5ldyBTZXQoKSxcbiAgcGFyYW1zOiBuZXcgU2V0KCksXG5cbiAgcGFyYW1ldGVyczogW10sXG4gIGVuZEJsb2NrOiBuZXcgU2V0KCksXG4gIGhpc3RvcmllczogbmV3IE1hcCgpLFxuXG4gIG1lbW86IHt9LFxuXG4gIGRhdGE6IHt9LFxuXG4gIC8qIGV4cG9ydFxuICAgKlxuICAgKiBwbGFjZSBnZW4gZnVuY3Rpb25zIGludG8gYW5vdGhlciBvYmplY3QgZm9yIGVhc2llciByZWZlcmVuY2VcbiAgICovXG5cbiAgZXhwb3J0OiBmdW5jdGlvbiBfZXhwb3J0KG9iaikge30sXG4gIGFkZFRvRW5kQmxvY2s6IGZ1bmN0aW9uIGFkZFRvRW5kQmxvY2sodikge1xuICAgIHRoaXMuZW5kQmxvY2suYWRkKCcgICcgKyB2KTtcbiAgfSxcbiAgcmVxdWVzdE1lbW9yeTogZnVuY3Rpb24gcmVxdWVzdE1lbW9yeShtZW1vcnlTcGVjKSB7XG4gICAgdmFyIGltbXV0YWJsZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzFdO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG1lbW9yeVNwZWMpIHtcbiAgICAgIHZhciByZXF1ZXN0ID0gbWVtb3J5U3BlY1trZXldO1xuXG4gICAgICByZXF1ZXN0LmlkeCA9IGdlbi5tZW1vcnkuYWxsb2MocmVxdWVzdC5sZW5ndGgsIGltbXV0YWJsZSk7XG4gICAgfVxuICB9LFxuXG5cbiAgLyogY3JlYXRlQ2FsbGJhY2tcbiAgICpcbiAgICogcGFyYW0gdWdlbiAtIEhlYWQgb2YgZ3JhcGggdG8gYmUgY29kZWdlbidkXG4gICAqXG4gICAqIEdlbmVyYXRlIGNhbGxiYWNrIGZ1bmN0aW9uIGZvciBhIHBhcnRpY3VsYXIgdWdlbiBncmFwaC5cbiAgICogVGhlIGdlbi5jbG9zdXJlcyBwcm9wZXJ0eSBzdG9yZXMgZnVuY3Rpb25zIHRoYXQgbmVlZCB0byBiZVxuICAgKiBwYXNzZWQgYXMgYXJndW1lbnRzIHRvIHRoZSBmaW5hbCBmdW5jdGlvbjsgdGhlc2UgYXJlIHByZWZpeGVkXG4gICAqIGJlZm9yZSBhbnkgZGVmaW5lZCBwYXJhbXMgdGhlIGdyYXBoIGV4cG9zZXMuIEZvciBleGFtcGxlLCBnaXZlbjpcbiAgICpcbiAgICogZ2VuLmNyZWF0ZUNhbGxiYWNrKCBhYnMoIHBhcmFtKCkgKSApXG4gICAqXG4gICAqIC4uLiB0aGUgZ2VuZXJhdGVkIGZ1bmN0aW9uIHdpbGwgaGF2ZSBhIHNpZ25hdHVyZSBvZiAoIGFicywgcDAgKS5cbiAgICovXG5cbiAgY3JlYXRlQ2FsbGJhY2s6IGZ1bmN0aW9uIGNyZWF0ZUNhbGxiYWNrKHVnZW4sIG1lbSkge1xuICAgIHZhciBkZWJ1ZyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXJndW1lbnRzWzJdO1xuICAgIHZhciBzaG91bGRJbmxpbmVNZW1vcnkgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDMgfHwgYXJndW1lbnRzWzNdID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGFyZ3VtZW50c1szXTtcblxuICAgIHZhciBpc1N0ZXJlbyA9IEFycmF5LmlzQXJyYXkodWdlbikgJiYgdWdlbi5sZW5ndGggPiAxLFxuICAgICAgICBjYWxsYmFjayA9IHZvaWQgMCxcbiAgICAgICAgY2hhbm5lbDEgPSB2b2lkIDAsXG4gICAgICAgIGNoYW5uZWwyID0gdm9pZCAwO1xuXG4gICAgaWYgKHR5cGVvZiBtZW0gPT09ICdudW1iZXInIHx8IG1lbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBtZW0gPSBNZW1vcnlIZWxwZXIuY3JlYXRlKG1lbSk7XG4gICAgfVxuXG4gICAgLy9jb25zb2xlLmxvZyggJ2NiIG1lbW9yeTonLCBtZW0gKVxuICAgIHRoaXMubWVtb3J5ID0gbWVtO1xuICAgIHRoaXMubWVtbyA9IHt9O1xuICAgIHRoaXMuZW5kQmxvY2suY2xlYXIoKTtcbiAgICB0aGlzLmNsb3N1cmVzLmNsZWFyKCk7XG4gICAgdGhpcy5wYXJhbXMuY2xlYXIoKTtcbiAgICAvL3RoaXMuZ2xvYmFscyA9IHsgd2luZG93czp7fSB9XG5cbiAgICB0aGlzLnBhcmFtZXRlcnMubGVuZ3RoID0gMDtcblxuICAgIHRoaXMuZnVuY3Rpb25Cb2R5ID0gXCIgICd1c2Ugc3RyaWN0J1xcblwiO1xuICAgIGlmIChzaG91bGRJbmxpbmVNZW1vcnkgPT09IGZhbHNlKSB0aGlzLmZ1bmN0aW9uQm9keSArPSBcIiAgdmFyIG1lbW9yeSA9IGdlbi5tZW1vcnlcXG5cXG5cIjtcblxuICAgIC8vIGNhbGwgLmdlbigpIG9uIHRoZSBoZWFkIG9mIHRoZSBncmFwaCB3ZSBhcmUgZ2VuZXJhdGluZyB0aGUgY2FsbGJhY2sgZm9yXG4gICAgLy9jb25zb2xlLmxvZyggJ0hFQUQnLCB1Z2VuIClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEgKyBpc1N0ZXJlbzsgaSsrKSB7XG4gICAgICBpZiAodHlwZW9mIHVnZW5baV0gPT09ICdudW1iZXInKSBjb250aW51ZTtcblxuICAgICAgLy9sZXQgY2hhbm5lbCA9IGlzU3RlcmVvID8gdWdlbltpXS5nZW4oKSA6IHVnZW4uZ2VuKCksXG4gICAgICB2YXIgY2hhbm5lbCA9IGlzU3RlcmVvID8gdGhpcy5nZXRJbnB1dCh1Z2VuW2ldKSA6IHRoaXMuZ2V0SW5wdXQodWdlbiksXG4gICAgICAgICAgYm9keSA9ICcnO1xuXG4gICAgICAvLyBpZiAuZ2VuKCkgcmV0dXJucyBhcnJheSwgYWRkIHVnZW4gY2FsbGJhY2sgKGdyYXBoT3V0cHV0WzFdKSB0byBvdXIgb3V0cHV0IGZ1bmN0aW9ucyBib2R5XG4gICAgICAvLyBhbmQgdGhlbiByZXR1cm4gbmFtZSBvZiB1Z2VuLiBJZiAuZ2VuKCkgb25seSBnZW5lcmF0ZXMgYSBudW1iZXIgKGZvciByZWFsbHkgc2ltcGxlIGdyYXBocylcbiAgICAgIC8vIGp1c3QgcmV0dXJuIHRoYXQgbnVtYmVyIChncmFwaE91dHB1dFswXSkuXG4gICAgICBib2R5ICs9IEFycmF5LmlzQXJyYXkoY2hhbm5lbCkgPyBjaGFubmVsWzFdICsgJ1xcbicgKyBjaGFubmVsWzBdIDogY2hhbm5lbDtcblxuICAgICAgLy8gc3BsaXQgYm9keSB0byBpbmplY3QgcmV0dXJuIGtleXdvcmQgb24gbGFzdCBsaW5lXG4gICAgICBib2R5ID0gYm9keS5zcGxpdCgnXFxuJyk7XG5cbiAgICAgIC8vaWYoIGRlYnVnICkgY29uc29sZS5sb2coICdmdW5jdGlvbkJvZHkgbGVuZ3RoJywgYm9keSApXG5cbiAgICAgIC8vIG5leHQgbGluZSBpcyB0byBhY2NvbW1vZGF0ZSBtZW1vIGFzIGdyYXBoIGhlYWRcbiAgICAgIGlmIChib2R5W2JvZHkubGVuZ3RoIC0gMV0udHJpbSgpLmluZGV4T2YoJ2xldCcpID4gLTEpIHtcbiAgICAgICAgYm9keS5wdXNoKCdcXG4nKTtcbiAgICAgIH1cblxuICAgICAgLy8gZ2V0IGluZGV4IG9mIGxhc3QgbGluZVxuICAgICAgdmFyIGxhc3RpZHggPSBib2R5Lmxlbmd0aCAtIDE7XG5cbiAgICAgIC8vIGluc2VydCByZXR1cm4ga2V5d29yZFxuICAgICAgYm9keVtsYXN0aWR4XSA9ICcgIGdlbi5vdXRbJyArIGkgKyAnXSAgPSAnICsgYm9keVtsYXN0aWR4XSArICdcXG4nO1xuXG4gICAgICB0aGlzLmZ1bmN0aW9uQm9keSArPSBib2R5LmpvaW4oJ1xcbicpO1xuICAgIH1cblxuICAgIHRoaXMuaGlzdG9yaWVzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUgIT09IG51bGwpIHZhbHVlLmdlbigpO1xuICAgIH0pO1xuXG4gICAgdmFyIHJldHVyblN0YXRlbWVudCA9IGlzU3RlcmVvID8gJyAgcmV0dXJuIGdlbi5vdXQnIDogJyAgcmV0dXJuIGdlbi5vdXRbMF0nO1xuXG4gICAgdGhpcy5mdW5jdGlvbkJvZHkgPSB0aGlzLmZ1bmN0aW9uQm9keS5zcGxpdCgnXFxuJyk7XG5cbiAgICBpZiAodGhpcy5lbmRCbG9jay5zaXplKSB7XG4gICAgICB0aGlzLmZ1bmN0aW9uQm9keSA9IHRoaXMuZnVuY3Rpb25Cb2R5LmNvbmNhdChBcnJheS5mcm9tKHRoaXMuZW5kQmxvY2spKTtcbiAgICAgIHRoaXMuZnVuY3Rpb25Cb2R5LnB1c2gocmV0dXJuU3RhdGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mdW5jdGlvbkJvZHkucHVzaChyZXR1cm5TdGF0ZW1lbnQpO1xuICAgIH1cbiAgICAvLyByZWFzc2VtYmxlIGZ1bmN0aW9uIGJvZHlcbiAgICB0aGlzLmZ1bmN0aW9uQm9keSA9IHRoaXMuZnVuY3Rpb25Cb2R5LmpvaW4oJ1xcbicpO1xuXG4gICAgLy8gd2UgY2FuIG9ubHkgZHluYW1pY2FsbHkgY3JlYXRlIGEgbmFtZWQgZnVuY3Rpb24gYnkgZHluYW1pY2FsbHkgY3JlYXRpbmcgYW5vdGhlciBmdW5jdGlvblxuICAgIC8vIHRvIGNvbnN0cnVjdCB0aGUgbmFtZWQgZnVuY3Rpb24hIHNoZWVzaC4uLlxuICAgIC8vXG4gICAgaWYgKHNob3VsZElubGluZU1lbW9yeSA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5wYXJhbWV0ZXJzLnB1c2goJ21lbW9yeScpO1xuICAgIH1cbiAgICB2YXIgYnVpbGRTdHJpbmcgPSAncmV0dXJuIGZ1bmN0aW9uIGdlbiggJyArIHRoaXMucGFyYW1ldGVycy5qb2luKCcsJykgKyAnICl7IFxcbicgKyB0aGlzLmZ1bmN0aW9uQm9keSArICdcXG59JztcblxuICAgIGlmICh0aGlzLmRlYnVnIHx8IGRlYnVnKSBjb25zb2xlLmxvZyhidWlsZFN0cmluZyk7XG5cbiAgICBjYWxsYmFjayA9IG5ldyBGdW5jdGlvbihidWlsZFN0cmluZykoKTtcblxuICAgIC8vIGFzc2lnbiBwcm9wZXJ0aWVzIHRvIG5hbWVkIGZ1bmN0aW9uXG4gICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gPSB0cnVlO1xuICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvciA9IGZhbHNlO1xuICAgIHZhciBfaXRlcmF0b3JFcnJvciA9IHVuZGVmaW5lZDtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSB0aGlzLmNsb3N1cmVzLnZhbHVlcygpW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbiA9IChfc3RlcCA9IF9pdGVyYXRvci5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uID0gdHJ1ZSkge1xuICAgICAgICB2YXIgZGljdCA9IF9zdGVwLnZhbHVlO1xuXG4gICAgICAgIHZhciBuYW1lID0gT2JqZWN0LmtleXMoZGljdClbMF0sXG4gICAgICAgICAgICB2YWx1ZSA9IGRpY3RbbmFtZV07XG5cbiAgICAgICAgY2FsbGJhY2tbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIF9kaWRJdGVyYXRvckVycm9yID0gdHJ1ZTtcbiAgICAgIF9pdGVyYXRvckVycm9yID0gZXJyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24gJiYgX2l0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgIF9pdGVyYXRvci5yZXR1cm4oKTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIgPSB0cnVlO1xuICAgIHZhciBfZGlkSXRlcmF0b3JFcnJvcjIgPSBmYWxzZTtcbiAgICB2YXIgX2l0ZXJhdG9yRXJyb3IyID0gdW5kZWZpbmVkO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKCkge1xuICAgICAgICB2YXIgZGljdCA9IF9zdGVwMi52YWx1ZTtcblxuICAgICAgICB2YXIgbmFtZSA9IE9iamVjdC5rZXlzKGRpY3QpWzBdLFxuICAgICAgICAgICAgdWdlbiA9IGRpY3RbbmFtZV07XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNhbGxiYWNrLCBuYW1lLCB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHVnZW4udmFsdWU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2KSB7XG4gICAgICAgICAgICB1Z2VuLnZhbHVlID0gdjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvL2NhbGxiYWNrWyBuYW1lIF0gPSB2YWx1ZVxuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMiA9IHRoaXMucGFyYW1zLnZhbHVlcygpW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXAyOyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yID0gKF9zdGVwMiA9IF9pdGVyYXRvcjIubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjIgPSB0cnVlKSB7XG4gICAgICAgIF9sb29wKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBfZGlkSXRlcmF0b3JFcnJvcjIgPSB0cnVlO1xuICAgICAgX2l0ZXJhdG9yRXJyb3IyID0gZXJyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIV9pdGVyYXRvck5vcm1hbENvbXBsZXRpb24yICYmIF9pdGVyYXRvcjIucmV0dXJuKSB7XG4gICAgICAgICAgX2l0ZXJhdG9yMi5yZXR1cm4oKTtcbiAgICAgICAgfVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yMikge1xuICAgICAgICAgIHRocm93IF9pdGVyYXRvckVycm9yMjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNhbGxiYWNrLmRhdGEgPSB0aGlzLmRhdGE7XG4gICAgY2FsbGJhY2sub3V0ID0gbmV3IEZsb2F0MzJBcnJheSgyKTtcbiAgICBjYWxsYmFjay5wYXJhbWV0ZXJzID0gdGhpcy5wYXJhbWV0ZXJzLnNsaWNlKDApO1xuXG4gICAgLy9pZiggTWVtb3J5SGVscGVyLmlzUHJvdG90eXBlT2YoIHRoaXMubWVtb3J5ICkgKVxuICAgIGNhbGxiYWNrLm1lbW9yeSA9IHRoaXMubWVtb3J5LmhlYXA7XG5cbiAgICB0aGlzLmhpc3Rvcmllcy5jbGVhcigpO1xuXG4gICAgcmV0dXJuIGNhbGxiYWNrO1xuICB9LFxuXG5cbiAgLyogZ2V0SW5wdXRzXG4gICAqXG4gICAqIENhbGxlZCBieSBlYWNoIGluZGl2aWR1YWwgdWdlbiB3aGVuIHRoZWlyIC5nZW4oKSBtZXRob2QgaXMgY2FsbGVkIHRvIHJlc29sdmUgdGhlaXIgdmFyaW91cyBpbnB1dHMuXG4gICAqIElmIGFuIGlucHV0IGlzIGEgbnVtYmVyLCByZXR1cm4gdGhlIG51bWJlci4gSWZcbiAgICogaXQgaXMgYW4gdWdlbiwgY2FsbCAuZ2VuKCkgb24gdGhlIHVnZW4sIG1lbW9pemUgdGhlIHJlc3VsdCBhbmQgcmV0dXJuIHRoZSByZXN1bHQuIElmIHRoZVxuICAgKiB1Z2VuIGhhcyBwcmV2aW91c2x5IGJlZW4gbWVtb2l6ZWQgcmV0dXJuIHRoZSBtZW1vaXplZCB2YWx1ZS5cbiAgICpcbiAgICovXG4gIGdldElucHV0czogZnVuY3Rpb24gZ2V0SW5wdXRzKHVnZW4pIHtcbiAgICByZXR1cm4gdWdlbi5pbnB1dHMubWFwKGdlbi5nZXRJbnB1dCk7XG4gIH0sXG4gIGdldElucHV0OiBmdW5jdGlvbiBnZXRJbnB1dChpbnB1dCkge1xuICAgIHZhciBpc09iamVjdCA9ICh0eXBlb2YgaW5wdXQgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGlucHV0KSkgPT09ICdvYmplY3QnLFxuICAgICAgICBwcm9jZXNzZWRJbnB1dCA9IHZvaWQgMDtcblxuICAgIGlmIChpc09iamVjdCkge1xuICAgICAgLy8gaWYgaW5wdXQgaXMgYSB1Z2VuLi4uXG4gICAgICAvL2NvbnNvbGUubG9nKCBpbnB1dC5uYW1lLCBnZW4ubWVtb1sgaW5wdXQubmFtZSBdIClcbiAgICAgIGlmIChnZW4ubWVtb1tpbnB1dC5uYW1lXSkge1xuICAgICAgICAvLyBpZiBpdCBoYXMgYmVlbiBtZW1vaXplZC4uLlxuICAgICAgICBwcm9jZXNzZWRJbnB1dCA9IGdlbi5tZW1vW2lucHV0Lm5hbWVdO1xuICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGlucHV0KSkge1xuICAgICAgICBnZW4uZ2V0SW5wdXQoaW5wdXRbMF0pO1xuICAgICAgICBnZW4uZ2V0SW5wdXQoaW5wdXRbMV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgbm90IG1lbW9pemVkIGdlbmVyYXRlIGNvZGUgXG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQuZ2VuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ25vIGdlbiBmb3VuZDonLCBpbnB1dCwgaW5wdXQuZ2VuKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY29kZSA9IGlucHV0LmdlbigpO1xuICAgICAgICAvL2lmKCBjb2RlLmluZGV4T2YoICdPYmplY3QnICkgPiAtMSApIGNvbnNvbGUubG9nKCAnYmFkIGlucHV0OicsIGlucHV0LCBjb2RlIClcblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjb2RlKSkge1xuICAgICAgICAgIGlmICghZ2VuLnNob3VsZExvY2FsaXplKSB7XG4gICAgICAgICAgICBnZW4uZnVuY3Rpb25Cb2R5ICs9IGNvZGVbMV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdlbi5jb2RlTmFtZSA9IGNvZGVbMF07XG4gICAgICAgICAgICBnZW4ubG9jYWxpemVkQ29kZS5wdXNoKGNvZGVbMV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCAnYWZ0ZXIgR0VOJyAsIHRoaXMuZnVuY3Rpb25Cb2R5IClcbiAgICAgICAgICBwcm9jZXNzZWRJbnB1dCA9IGNvZGVbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvY2Vzc2VkSW5wdXQgPSBjb2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGl0IGlucHV0IGlzIGEgbnVtYmVyXG4gICAgICBwcm9jZXNzZWRJbnB1dCA9IGlucHV0O1xuICAgIH1cblxuICAgIHJldHVybiBwcm9jZXNzZWRJbnB1dDtcbiAgfSxcbiAgc3RhcnRMb2NhbGl6ZTogZnVuY3Rpb24gc3RhcnRMb2NhbGl6ZSgpIHtcbiAgICB0aGlzLmxvY2FsaXplZENvZGUgPSBbXTtcbiAgICB0aGlzLnNob3VsZExvY2FsaXplID0gdHJ1ZTtcbiAgfSxcbiAgZW5kTG9jYWxpemU6IGZ1bmN0aW9uIGVuZExvY2FsaXplKCkge1xuICAgIHRoaXMuc2hvdWxkTG9jYWxpemUgPSBmYWxzZTtcblxuICAgIHJldHVybiBbdGhpcy5jb2RlTmFtZSwgdGhpcy5sb2NhbGl6ZWRDb2RlLnNsaWNlKDApXTtcbiAgfSxcbiAgZnJlZTogZnVuY3Rpb24gZnJlZShncmFwaCkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGdyYXBoKSkge1xuICAgICAgLy8gc3RlcmVvIHVnZW5cbiAgICAgIHZhciBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMyA9IHRydWU7XG4gICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3IzID0gZmFsc2U7XG4gICAgICB2YXIgX2l0ZXJhdG9yRXJyb3IzID0gdW5kZWZpbmVkO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IzID0gZ3JhcGhbU3ltYm9sLml0ZXJhdG9yXSgpLCBfc3RlcDM7ICEoX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjMgPSAoX3N0ZXAzID0gX2l0ZXJhdG9yMy5uZXh0KCkpLmRvbmUpOyBfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMyA9IHRydWUpIHtcbiAgICAgICAgICB2YXIgY2hhbm5lbCA9IF9zdGVwMy52YWx1ZTtcblxuICAgICAgICAgIHRoaXMuZnJlZShjaGFubmVsKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9kaWRJdGVyYXRvckVycm9yMyA9IHRydWU7XG4gICAgICAgIF9pdGVyYXRvckVycm9yMyA9IGVycjtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKCFfaXRlcmF0b3JOb3JtYWxDb21wbGV0aW9uMyAmJiBfaXRlcmF0b3IzLnJldHVybikge1xuICAgICAgICAgICAgX2l0ZXJhdG9yMy5yZXR1cm4oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKF9kaWRJdGVyYXRvckVycm9yMykge1xuICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3IzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoKHR5cGVvZiBncmFwaCA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoZ3JhcGgpKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgaWYgKGdyYXBoLm1lbW9yeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZm9yICh2YXIgbWVtb3J5S2V5IGluIGdyYXBoLm1lbW9yeSkge1xuICAgICAgICAgICAgdGhpcy5tZW1vcnkuZnJlZShncmFwaC5tZW1vcnlbbWVtb3J5S2V5XS5pZHgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShncmFwaC5pbnB1dHMpKSB7XG4gICAgICAgICAgdmFyIF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb240ID0gdHJ1ZTtcbiAgICAgICAgICB2YXIgX2RpZEl0ZXJhdG9yRXJyb3I0ID0gZmFsc2U7XG4gICAgICAgICAgdmFyIF9pdGVyYXRvckVycm9yNCA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3I0ID0gZ3JhcGguaW5wdXRzW1N5bWJvbC5pdGVyYXRvcl0oKSwgX3N0ZXA0OyAhKF9pdGVyYXRvck5vcm1hbENvbXBsZXRpb240ID0gKF9zdGVwNCA9IF9pdGVyYXRvcjQubmV4dCgpKS5kb25lKTsgX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjQgPSB0cnVlKSB7XG4gICAgICAgICAgICAgIHZhciB1Z2VuID0gX3N0ZXA0LnZhbHVlO1xuXG4gICAgICAgICAgICAgIHRoaXMuZnJlZSh1Z2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9kaWRJdGVyYXRvckVycm9yNCA9IHRydWU7XG4gICAgICAgICAgICBfaXRlcmF0b3JFcnJvcjQgPSBlcnI7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmICghX2l0ZXJhdG9yTm9ybWFsQ29tcGxldGlvbjQgJiYgX2l0ZXJhdG9yNC5yZXR1cm4pIHtcbiAgICAgICAgICAgICAgICBfaXRlcmF0b3I0LnJldHVybigpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICBpZiAoX2RpZEl0ZXJhdG9yRXJyb3I0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgX2l0ZXJhdG9yRXJyb3I0O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdlbjsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBuYW1lOiAnZ3QnLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBvdXQgPSB2b2lkIDAsXG4gICAgICAgIGlucHV0cyA9IF9nZW4uZ2V0SW5wdXRzKHRoaXMpO1xuXG4gICAgb3V0ID0gJyAgdmFyICcgKyB0aGlzLm5hbWUgKyAnID0gJztcblxuICAgIGlmIChpc05hTih0aGlzLmlucHV0c1swXSkgfHwgaXNOYU4odGhpcy5pbnB1dHNbMV0pKSB7XG4gICAgICBvdXQgKz0gJygoICcgKyBpbnB1dHNbMF0gKyAnID4gJyArIGlucHV0c1sxXSArICcpIHwgMCApJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9IGlucHV0c1swXSA+IGlucHV0c1sxXSA/IDEgOiAwO1xuICAgIH1cbiAgICBvdXQgKz0gJ1xcblxcbic7XG5cbiAgICBfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9IHRoaXMubmFtZTtcblxuICAgIHJldHVybiBbdGhpcy5uYW1lLCBvdXRdO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gIHZhciBndCA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIGd0LmlucHV0cyA9IFt4LCB5XTtcbiAgZ3QubmFtZSA9ICdndCcgKyBfZ2VuLmdldFVJRCgpO1xuXG4gIHJldHVybiBndDtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgbmFtZTogJ2d0ZScsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIG91dCA9IHZvaWQgMCxcbiAgICAgICAgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyk7XG5cbiAgICBvdXQgPSAnICB2YXIgJyArIHRoaXMubmFtZSArICcgPSAnO1xuXG4gICAgaWYgKGlzTmFOKHRoaXMuaW5wdXRzWzBdKSB8fCBpc05hTih0aGlzLmlucHV0c1sxXSkpIHtcbiAgICAgIG91dCArPSAnKCAnICsgaW5wdXRzWzBdICsgJyA+PSAnICsgaW5wdXRzWzFdICsgJyB8IDAgKSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCArPSBpbnB1dHNbMF0gPj0gaW5wdXRzWzFdID8gMSA6IDA7XG4gICAgfVxuICAgIG91dCArPSAnXFxuXFxuJztcblxuICAgIF9nZW4ubWVtb1t0aGlzLm5hbWVdID0gdGhpcy5uYW1lO1xuXG4gICAgcmV0dXJuIFt0aGlzLm5hbWUsIG91dF07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgdmFyIGd0ID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgZ3QuaW5wdXRzID0gW3gsIHldO1xuICBndC5uYW1lID0gJ2d0ZScgKyBfZ2VuLmdldFVJRCgpO1xuXG4gIHJldHVybiBndDtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgbmFtZTogJ2d0cCcsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIG91dCA9IHZvaWQgMCxcbiAgICAgICAgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyk7XG5cbiAgICBpZiAoaXNOYU4odGhpcy5pbnB1dHNbMF0pIHx8IGlzTmFOKHRoaXMuaW5wdXRzWzFdKSkge1xuICAgICAgb3V0ID0gJygnICsgaW5wdXRzWzBdICsgJyAqICggKCAnICsgaW5wdXRzWzBdICsgJyA+ICcgKyBpbnB1dHNbMV0gKyAnICkgfCAwICkgKSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCA9IGlucHV0c1swXSAqIChpbnB1dHNbMF0gPiBpbnB1dHNbMV0gfCAwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gIHZhciBndHAgPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcblxuICBndHAuaW5wdXRzID0gW3gsIHldO1xuXG4gIHJldHVybiBndHA7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGluMSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IDAgOiBhcmd1bWVudHNbMF07XG5cbiAgdmFyIHVnZW4gPSB7XG4gICAgaW5wdXRzOiBbaW4xXSxcbiAgICBtZW1vcnk6IHsgdmFsdWU6IHsgbGVuZ3RoOiAxLCBpZHg6IG51bGwgfSB9LFxuICAgIHJlY29yZGVyOiBudWxsLFxuXG4gICAgaW46IGZ1bmN0aW9uIF9pbih2KSB7XG4gICAgICBpZiAoX2dlbi5oaXN0b3JpZXMuaGFzKHYpKSB7XG4gICAgICAgIHZhciBtZW1vSGlzdG9yeSA9IF9nZW4uaGlzdG9yaWVzLmdldCh2KTtcbiAgICAgICAgdWdlbi5uYW1lID0gbWVtb0hpc3RvcnkubmFtZTtcbiAgICAgICAgcmV0dXJuIG1lbW9IaXN0b3J5O1xuICAgICAgfVxuXG4gICAgICB2YXIgb2JqID0ge1xuICAgICAgICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICAgICAgICB2YXIgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModWdlbik7XG5cbiAgICAgICAgICBpZiAodWdlbi5tZW1vcnkudmFsdWUuaWR4ID09PSBudWxsKSB7XG4gICAgICAgICAgICBfZ2VuLnJlcXVlc3RNZW1vcnkodWdlbi5tZW1vcnkpO1xuICAgICAgICAgICAgX2dlbi5tZW1vcnkuaGVhcFt1Z2VuLm1lbW9yeS52YWx1ZS5pZHhdID0gaW4xO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBpZHggPSB1Z2VuLm1lbW9yeS52YWx1ZS5pZHg7XG5cbiAgICAgICAgICBfZ2VuLmFkZFRvRW5kQmxvY2soJ21lbW9yeVsgJyArIGlkeCArICcgXSA9ICcgKyBpbnB1dHNbMF0pO1xuXG4gICAgICAgICAgLy8gcmV0dXJuIHVnZW4gdGhhdCBpcyBiZWluZyByZWNvcmRlZCBpbnN0ZWFkIG9mIHNzZC5cbiAgICAgICAgICAvLyB0aGlzIGVmZmVjdGl2ZWx5IG1ha2VzIGEgY2FsbCB0byBzc2QucmVjb3JkKCkgdHJhbnNwYXJlbnQgdG8gdGhlIGdyYXBoLlxuICAgICAgICAgIC8vIHJlY29yZGluZyBpcyB0cmlnZ2VyZWQgYnkgcHJpb3IgY2FsbCB0byBnZW4uYWRkVG9FbmRCbG9jay5cbiAgICAgICAgICBfZ2VuLmhpc3Rvcmllcy5zZXQodiwgb2JqKTtcblxuICAgICAgICAgIHJldHVybiBpbnB1dHNbMF07XG4gICAgICAgIH0sXG5cbiAgICAgICAgbmFtZTogdWdlbi5uYW1lICsgJ19pbicgKyBfZ2VuLmdldFVJRCgpLFxuICAgICAgICBtZW1vcnk6IHVnZW4ubWVtb3J5XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmlucHV0c1swXSA9IHY7XG5cbiAgICAgIHVnZW4ucmVjb3JkZXIgPSBvYmo7XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSxcblxuXG4gICAgb3V0OiB7XG4gICAgICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICAgICAgaWYgKHVnZW4ubWVtb3J5LnZhbHVlLmlkeCA9PT0gbnVsbCkge1xuICAgICAgICAgIGlmIChfZ2VuLmhpc3Rvcmllcy5nZXQodWdlbi5pbnB1dHNbMF0pID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIF9nZW4uaGlzdG9yaWVzLnNldCh1Z2VuLmlucHV0c1swXSwgdWdlbi5yZWNvcmRlcik7XG4gICAgICAgICAgfVxuICAgICAgICAgIF9nZW4ucmVxdWVzdE1lbW9yeSh1Z2VuLm1lbW9yeSk7XG4gICAgICAgICAgX2dlbi5tZW1vcnkuaGVhcFt1Z2VuLm1lbW9yeS52YWx1ZS5pZHhdID0gcGFyc2VGbG9hdChpbjEpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpZHggPSB1Z2VuLm1lbW9yeS52YWx1ZS5pZHg7XG5cbiAgICAgICAgcmV0dXJuICdtZW1vcnlbICcgKyBpZHggKyAnIF0gJztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgdWlkOiBfZ2VuLmdldFVJRCgpXG4gIH07XG5cbiAgdWdlbi5vdXQubWVtb3J5ID0gdWdlbi5tZW1vcnk7XG5cbiAgdWdlbi5uYW1lID0gJ2hpc3RvcnknICsgdWdlbi51aWQ7XG4gIHVnZW4ub3V0Lm5hbWUgPSB1Z2VuLm5hbWUgKyAnX291dCc7XG4gIHVnZW4uaW4uX25hbWUgPSB1Z2VuLm5hbWUgPSAnX2luJztcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodWdlbiwgJ3ZhbHVlJywge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgaWYgKHRoaXMubWVtb3J5LnZhbHVlLmlkeCAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gX2dlbi5tZW1vcnkuaGVhcFt0aGlzLm1lbW9yeS52YWx1ZS5pZHhdO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodikge1xuICAgICAgaWYgKHRoaXMubWVtb3J5LnZhbHVlLmlkeCAhPT0gbnVsbCkge1xuICAgICAgICBfZ2VuLm1lbW9yeS5oZWFwW3RoaXMubWVtb3J5LnZhbHVlLmlkeF0gPSB2O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHVnZW47XG59OyIsIi8qXG5cbiBhID0gY29uZGl0aW9uYWwoIGNvbmRpdGlvbiwgdHJ1ZUJsb2NrLCBmYWxzZUJsb2NrIClcbiBiID0gY29uZGl0aW9uYWwoW1xuICAgY29uZGl0aW9uMSwgYmxvY2sxLFxuICAgY29uZGl0aW9uMiwgYmxvY2syLFxuICAgY29uZGl0aW9uMywgYmxvY2szLFxuICAgZGVmYXVsdEJsb2NrXG4gXSlcblxuKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAnaWZlbHNlJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgY29uZGl0aW9uYWxzID0gdGhpcy5pbnB1dHNbMF0sXG4gICAgICAgIGRlZmF1bHRWYWx1ZSA9IF9nZW4uZ2V0SW5wdXQoY29uZGl0aW9uYWxzW2NvbmRpdGlvbmFscy5sZW5ndGggLSAxXSksXG4gICAgICAgIG91dCA9ICcgIHZhciAnICsgdGhpcy5uYW1lICsgJ19vdXQgPSAnICsgZGVmYXVsdFZhbHVlICsgJ1xcbic7XG5cbiAgICAvL2NvbnNvbGUubG9nKCAnZGVmYXVsdFZhbHVlOicsIGRlZmF1bHRWYWx1ZSApXG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmRpdGlvbmFscy5sZW5ndGggLSAyOyBpICs9IDIpIHtcbiAgICAgIHZhciBpc0VuZEJsb2NrID0gaSA9PT0gY29uZGl0aW9uYWxzLmxlbmd0aCAtIDMsXG4gICAgICAgICAgY29uZCA9IF9nZW4uZ2V0SW5wdXQoY29uZGl0aW9uYWxzW2ldKSxcbiAgICAgICAgICBwcmVibG9jayA9IGNvbmRpdGlvbmFsc1tpICsgMV0sXG4gICAgICAgICAgYmxvY2sgPSB2b2lkIDAsXG4gICAgICAgICAgYmxvY2tOYW1lID0gdm9pZCAwLFxuICAgICAgICAgIG91dHB1dCA9IHZvaWQgMDtcblxuICAgICAgLy9jb25zb2xlLmxvZyggJ3BiJywgcHJlYmxvY2sgKVxuXG4gICAgICBpZiAodHlwZW9mIHByZWJsb2NrID09PSAnbnVtYmVyJykge1xuICAgICAgICBibG9jayA9IHByZWJsb2NrO1xuICAgICAgICBibG9ja05hbWUgPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKF9nZW4ubWVtb1twcmVibG9jay5uYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gdXNlZCB0byBwbGFjZSBhbGwgY29kZSBkZXBlbmRlbmNpZXMgaW4gYXBwcm9wcmlhdGUgYmxvY2tzXG4gICAgICAgICAgX2dlbi5zdGFydExvY2FsaXplKCk7XG5cbiAgICAgICAgICBfZ2VuLmdldElucHV0KHByZWJsb2NrKTtcblxuICAgICAgICAgIGJsb2NrID0gX2dlbi5lbmRMb2NhbGl6ZSgpO1xuICAgICAgICAgIGJsb2NrTmFtZSA9IGJsb2NrWzBdO1xuICAgICAgICAgIGJsb2NrID0gYmxvY2tbMV0uam9pbignJyk7XG4gICAgICAgICAgYmxvY2sgPSAnICAnICsgYmxvY2sucmVwbGFjZSgvXFxuL2dpLCAnXFxuICAnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBibG9jayA9ICcnO1xuICAgICAgICAgIGJsb2NrTmFtZSA9IF9nZW4ubWVtb1twcmVibG9jay5uYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBvdXRwdXQgPSBibG9ja05hbWUgPT09IG51bGwgPyAnICAnICsgdGhpcy5uYW1lICsgJ19vdXQgPSAnICsgYmxvY2sgOiBibG9jayArICcgICcgKyB0aGlzLm5hbWUgKyAnX291dCA9ICcgKyBibG9ja05hbWU7XG5cbiAgICAgIGlmIChpID09PSAwKSBvdXQgKz0gJyAnO1xuICAgICAgb3V0ICs9ICcgaWYoICcgKyBjb25kICsgJyA9PT0gMSApIHtcXG4nICsgb3V0cHV0ICsgJ1xcbiAgfSc7XG5cbiAgICAgIGlmICghaXNFbmRCbG9jaykge1xuICAgICAgICBvdXQgKz0gJyBlbHNlJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dCArPSAnXFxuJztcbiAgICAgIH1cbiAgICAgIC8qICAgICAgICAgXG4gICAgICAgZWxzZWBcbiAgICAgICAgICAgIH1lbHNlIGlmKCBpc0VuZEJsb2NrICkge1xuICAgICAgICAgICAgICBvdXQgKz0gYHtcXG4gICR7b3V0cHV0fVxcbiAgfVxcbmBcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgIFxuICAgICAgICAgICAgICAvL2lmKCBpICsgMiA9PT0gY29uZGl0aW9uYWxzLmxlbmd0aCB8fCBpID09PSBjb25kaXRpb25hbHMubGVuZ3RoIC0gMSApIHtcbiAgICAgICAgICAgICAgLy8gIG91dCArPSBge1xcbiAgJHtvdXRwdXR9XFxuICB9XFxuYFxuICAgICAgICAgICAgICAvL31lbHNle1xuICAgICAgICAgICAgICAgIG91dCArPSBcbiAgICAgIGAgaWYoICR7Y29uZH0gPT09IDEgKSB7XG4gICAgICAke291dHB1dH1cbiAgICAgICAgfSBlbHNlIGBcbiAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICB9Ki9cbiAgICB9XG5cbiAgICBfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9IHRoaXMubmFtZSArICdfb3V0JztcblxuICAgIHJldHVybiBbdGhpcy5uYW1lICsgJ19vdXQnLCBvdXRdO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIHVnZW4gPSBPYmplY3QuY3JlYXRlKHByb3RvKSxcbiAgICAgIGNvbmRpdGlvbnMgPSBBcnJheS5pc0FycmF5KGFyZ3NbMF0pID8gYXJnc1swXSA6IGFyZ3M7XG5cbiAgT2JqZWN0LmFzc2lnbih1Z2VuLCB7XG4gICAgdWlkOiBfZ2VuLmdldFVJRCgpLFxuICAgIGlucHV0czogW2NvbmRpdGlvbnNdXG4gIH0pO1xuXG4gIHVnZW4ubmFtZSA9ICcnICsgdWdlbi5iYXNlbmFtZSArIHVnZW4udWlkO1xuXG4gIHJldHVybiB1Z2VuO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ2luJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICBfZ2VuLnBhcmFtZXRlcnMucHVzaCh0aGlzLm5hbWUpO1xuXG4gICAgX2dlbi5tZW1vW3RoaXMubmFtZV0gPSB0aGlzLm5hbWU7XG5cbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciBpbnB1dCA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIGlucHV0LmlkID0gX2dlbi5nZXRVSUQoKTtcbiAgaW5wdXQubmFtZSA9IG5hbWUgIT09IHVuZGVmaW5lZCA/IG5hbWUgOiAnJyArIGlucHV0LmJhc2VuYW1lICsgaW5wdXQuaWQ7XG4gIGlucHV0WzBdID0ge1xuICAgIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgICAgaWYgKCFfZ2VuLnBhcmFtZXRlcnMuaW5jbHVkZXMoaW5wdXQubmFtZSkpIF9nZW4ucGFyYW1ldGVycy5wdXNoKGlucHV0Lm5hbWUpO1xuICAgICAgcmV0dXJuIGlucHV0Lm5hbWUgKyAnWzBdJztcbiAgICB9XG4gIH07XG4gIGlucHV0WzFdID0ge1xuICAgIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgICAgaWYgKCFfZ2VuLnBhcmFtZXRlcnMuaW5jbHVkZXMoaW5wdXQubmFtZSkpIF9nZW4ucGFyYW1ldGVycy5wdXNoKGlucHV0Lm5hbWUpO1xuICAgICAgcmV0dXJuIGlucHV0Lm5hbWUgKyAnWzFdJztcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGlucHV0O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBsaWJyYXJ5ID0ge1xuICBleHBvcnQ6IGZ1bmN0aW9uIF9leHBvcnQoZGVzdGluYXRpb24pIHtcbiAgICBpZiAoZGVzdGluYXRpb24gPT09IHdpbmRvdykge1xuICAgICAgZGVzdGluYXRpb24uc3NkID0gbGlicmFyeS5oaXN0b3J5OyAvLyBoaXN0b3J5IGlzIHdpbmRvdyBvYmplY3QgcHJvcGVydHksIHNvIHVzZSBzc2QgYXMgYWxpYXNcbiAgICAgIGRlc3RpbmF0aW9uLmlucHV0ID0gbGlicmFyeS5pbjsgLy8gaW4gaXMgYSBrZXl3b3JkIGluIGphdmFzY3JpcHRcbiAgICAgIGRlc3RpbmF0aW9uLnRlcm5hcnkgPSBsaWJyYXJ5LnN3aXRjaDsgLy8gc3dpdGNoIGlzIGEga2V5d29yZCBpbiBqYXZhc2NyaXB0XG5cbiAgICAgIGRlbGV0ZSBsaWJyYXJ5Lmhpc3Rvcnk7XG4gICAgICBkZWxldGUgbGlicmFyeS5pbjtcbiAgICAgIGRlbGV0ZSBsaWJyYXJ5LnN3aXRjaDtcbiAgICB9XG5cbiAgICBPYmplY3QuYXNzaWduKGRlc3RpbmF0aW9uLCBsaWJyYXJ5KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsaWJyYXJ5LCAnc2FtcGxlcmF0ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICByZXR1cm4gbGlicmFyeS5nZW4uc2FtcGxlcmF0ZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2KSB7fVxuICAgIH0pO1xuXG4gICAgbGlicmFyeS5pbiA9IGRlc3RpbmF0aW9uLmlucHV0O1xuICAgIGxpYnJhcnkuaGlzdG9yeSA9IGRlc3RpbmF0aW9uLnNzZDtcbiAgICBsaWJyYXJ5LnN3aXRjaCA9IGRlc3RpbmF0aW9uLnRlcm5hcnk7XG5cbiAgICBkZXN0aW5hdGlvbi5jbGlwID0gbGlicmFyeS5jbGFtcDtcbiAgfSxcblxuXG4gIGdlbjogcmVxdWlyZSgnLi9nZW4uanMnKSxcblxuICBhYnM6IHJlcXVpcmUoJy4vYWJzLmpzJyksXG4gIHJvdW5kOiByZXF1aXJlKCcuL3JvdW5kLmpzJyksXG4gIHBhcmFtOiByZXF1aXJlKCcuL3BhcmFtLmpzJyksXG4gIGFkZDogcmVxdWlyZSgnLi9hZGQuanMnKSxcbiAgc3ViOiByZXF1aXJlKCcuL3N1Yi5qcycpLFxuICBtdWw6IHJlcXVpcmUoJy4vbXVsLmpzJyksXG4gIGRpdjogcmVxdWlyZSgnLi9kaXYuanMnKSxcbiAgYWNjdW06IHJlcXVpcmUoJy4vYWNjdW0uanMnKSxcbiAgY291bnRlcjogcmVxdWlyZSgnLi9jb3VudGVyLmpzJyksXG4gIHNpbjogcmVxdWlyZSgnLi9zaW4uanMnKSxcbiAgY29zOiByZXF1aXJlKCcuL2Nvcy5qcycpLFxuICB0YW46IHJlcXVpcmUoJy4vdGFuLmpzJyksXG4gIHRhbmg6IHJlcXVpcmUoJy4vdGFuaC5qcycpLFxuICBhc2luOiByZXF1aXJlKCcuL2FzaW4uanMnKSxcbiAgYWNvczogcmVxdWlyZSgnLi9hY29zLmpzJyksXG4gIGF0YW46IHJlcXVpcmUoJy4vYXRhbi5qcycpLFxuICBwaGFzb3I6IHJlcXVpcmUoJy4vcGhhc29yLmpzJyksXG4gIGRhdGE6IHJlcXVpcmUoJy4vZGF0YS5qcycpLFxuICBwZWVrOiByZXF1aXJlKCcuL3BlZWsuanMnKSxcbiAgY3ljbGU6IHJlcXVpcmUoJy4vY3ljbGUuanMnKSxcbiAgaGlzdG9yeTogcmVxdWlyZSgnLi9oaXN0b3J5LmpzJyksXG4gIGRlbHRhOiByZXF1aXJlKCcuL2RlbHRhLmpzJyksXG4gIGZsb29yOiByZXF1aXJlKCcuL2Zsb29yLmpzJyksXG4gIGNlaWw6IHJlcXVpcmUoJy4vY2VpbC5qcycpLFxuICBtaW46IHJlcXVpcmUoJy4vbWluLmpzJyksXG4gIG1heDogcmVxdWlyZSgnLi9tYXguanMnKSxcbiAgc2lnbjogcmVxdWlyZSgnLi9zaWduLmpzJyksXG4gIGRjYmxvY2s6IHJlcXVpcmUoJy4vZGNibG9jay5qcycpLFxuICBtZW1vOiByZXF1aXJlKCcuL21lbW8uanMnKSxcbiAgcmF0ZTogcmVxdWlyZSgnLi9yYXRlLmpzJyksXG4gIHdyYXA6IHJlcXVpcmUoJy4vd3JhcC5qcycpLFxuICBtaXg6IHJlcXVpcmUoJy4vbWl4LmpzJyksXG4gIGNsYW1wOiByZXF1aXJlKCcuL2NsYW1wLmpzJyksXG4gIHBva2U6IHJlcXVpcmUoJy4vcG9rZS5qcycpLFxuICBkZWxheTogcmVxdWlyZSgnLi9kZWxheS5qcycpLFxuICBmb2xkOiByZXF1aXJlKCcuL2ZvbGQuanMnKSxcbiAgbW9kOiByZXF1aXJlKCcuL21vZC5qcycpLFxuICBzYWg6IHJlcXVpcmUoJy4vc2FoLmpzJyksXG4gIG5vaXNlOiByZXF1aXJlKCcuL25vaXNlLmpzJyksXG4gIG5vdDogcmVxdWlyZSgnLi9ub3QuanMnKSxcbiAgZ3Q6IHJlcXVpcmUoJy4vZ3QuanMnKSxcbiAgZ3RlOiByZXF1aXJlKCcuL2d0ZS5qcycpLFxuICBsdDogcmVxdWlyZSgnLi9sdC5qcycpLFxuICBsdGU6IHJlcXVpcmUoJy4vbHRlLmpzJyksXG4gIGJvb2w6IHJlcXVpcmUoJy4vYm9vbC5qcycpLFxuICBnYXRlOiByZXF1aXJlKCcuL2dhdGUuanMnKSxcbiAgdHJhaW46IHJlcXVpcmUoJy4vdHJhaW4uanMnKSxcbiAgc2xpZGU6IHJlcXVpcmUoJy4vc2xpZGUuanMnKSxcbiAgaW46IHJlcXVpcmUoJy4vaW4uanMnKSxcbiAgdDYwOiByZXF1aXJlKCcuL3Q2MC5qcycpLFxuICBtdG9mOiByZXF1aXJlKCcuL210b2YuanMnKSxcbiAgbHRwOiByZXF1aXJlKCcuL2x0cC5qcycpLCAvLyBUT0RPOiB0ZXN0XG4gIGd0cDogcmVxdWlyZSgnLi9ndHAuanMnKSwgLy8gVE9ETzogdGVzdFxuICBzd2l0Y2g6IHJlcXVpcmUoJy4vc3dpdGNoLmpzJyksXG4gIG1zdG9zYW1wczogcmVxdWlyZSgnLi9tc3Rvc2FtcHMuanMnKSwgLy8gVE9ETzogbmVlZHMgdGVzdCxcbiAgc2VsZWN0b3I6IHJlcXVpcmUoJy4vc2VsZWN0b3IuanMnKSxcbiAgdXRpbGl0aWVzOiByZXF1aXJlKCcuL3V0aWxpdGllcy5qcycpLFxuICBwb3c6IHJlcXVpcmUoJy4vcG93LmpzJyksXG4gIGF0dGFjazogcmVxdWlyZSgnLi9hdHRhY2suanMnKSxcbiAgZGVjYXk6IHJlcXVpcmUoJy4vZGVjYXkuanMnKSxcbiAgd2luZG93czogcmVxdWlyZSgnLi93aW5kb3dzLmpzJyksXG4gIGVudjogcmVxdWlyZSgnLi9lbnYuanMnKSxcbiAgYWQ6IHJlcXVpcmUoJy4vYWQuanMnKSxcbiAgYWRzcjogcmVxdWlyZSgnLi9hZHNyLmpzJyksXG4gIGlmZWxzZTogcmVxdWlyZSgnLi9pZmVsc2VpZi5qcycpLFxuICBiYW5nOiByZXF1aXJlKCcuL2JhbmcuanMnKSxcbiAgYW5kOiByZXF1aXJlKCcuL2FuZC5qcycpLFxuICBwYW46IHJlcXVpcmUoJy4vcGFuLmpzJyksXG4gIGVxOiByZXF1aXJlKCcuL2VxLmpzJyksXG4gIG5lcTogcmVxdWlyZSgnLi9uZXEuanMnKSxcbiAgZXhwOiByZXF1aXJlKCcuL2V4cC5qcycpXG59O1xuXG5saWJyYXJ5Lmdlbi5saWIgPSBsaWJyYXJ5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxpYnJhcnk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgbmFtZTogJ2x0JyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIG91dCA9ICcgIHZhciAnICsgdGhpcy5uYW1lICsgJyA9ICc7XG5cbiAgICBpZiAoaXNOYU4odGhpcy5pbnB1dHNbMF0pIHx8IGlzTmFOKHRoaXMuaW5wdXRzWzFdKSkge1xuICAgICAgb3V0ICs9ICcoKCAnICsgaW5wdXRzWzBdICsgJyA8ICcgKyBpbnB1dHNbMV0gKyAnKSB8IDAgICknO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gaW5wdXRzWzBdIDwgaW5wdXRzWzFdID8gMSA6IDA7XG4gICAgfVxuICAgIG91dCArPSAnXFxuJztcblxuICAgIF9nZW4ubWVtb1t0aGlzLm5hbWVdID0gdGhpcy5uYW1lO1xuXG4gICAgcmV0dXJuIFt0aGlzLm5hbWUsIG91dF07XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gIHZhciBsdCA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIGx0LmlucHV0cyA9IFt4LCB5XTtcbiAgbHQubmFtZSA9ICdsdCcgKyBfZ2VuLmdldFVJRCgpO1xuXG4gIHJldHVybiBsdDtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgbmFtZTogJ2x0ZScsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIG91dCA9IHZvaWQgMCxcbiAgICAgICAgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyk7XG5cbiAgICBvdXQgPSAnICB2YXIgJyArIHRoaXMubmFtZSArICcgPSAnO1xuXG4gICAgaWYgKGlzTmFOKHRoaXMuaW5wdXRzWzBdKSB8fCBpc05hTih0aGlzLmlucHV0c1sxXSkpIHtcbiAgICAgIG91dCArPSAnKCAnICsgaW5wdXRzWzBdICsgJyA8PSAnICsgaW5wdXRzWzFdICsgJyB8IDAgICknO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgKz0gaW5wdXRzWzBdIDw9IGlucHV0c1sxXSA/IDEgOiAwO1xuICAgIH1cbiAgICBvdXQgKz0gJ1xcbic7XG5cbiAgICBfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9IHRoaXMubmFtZTtcblxuICAgIHJldHVybiBbdGhpcy5uYW1lLCBvdXRdO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeCwgeSkge1xuICB2YXIgbHQgPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcblxuICBsdC5pbnB1dHMgPSBbeCwgeV07XG4gIGx0Lm5hbWUgPSAnbHRlJyArIF9nZW4uZ2V0VUlEKCk7XG5cbiAgcmV0dXJuIGx0O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBuYW1lOiAnbHRwJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIGlmIChpc05hTih0aGlzLmlucHV0c1swXSkgfHwgaXNOYU4odGhpcy5pbnB1dHNbMV0pKSB7XG4gICAgICBvdXQgPSAnKCcgKyBpbnB1dHNbMF0gKyAnICogKCggJyArIGlucHV0c1swXSArICcgPCAnICsgaW5wdXRzWzFdICsgJyApIHwgMCApICknO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgPSBpbnB1dHNbMF0gKiAoaW5wdXRzWzBdIDwgaW5wdXRzWzFdIHwgMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeCwgeSkge1xuICB2YXIgbHRwID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgbHRwLmlucHV0cyA9IFt4LCB5XTtcblxuICByZXR1cm4gbHRwO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBuYW1lOiAnbWF4JyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIGlmIChpc05hTihpbnB1dHNbMF0pIHx8IGlzTmFOKGlucHV0c1sxXSkpIHtcbiAgICAgIF9nZW4uY2xvc3VyZXMuYWRkKF9kZWZpbmVQcm9wZXJ0eSh7fSwgdGhpcy5uYW1lLCBNYXRoLm1heCkpO1xuXG4gICAgICBvdXQgPSAnZ2VuLm1heCggJyArIGlucHV0c1swXSArICcsICcgKyBpbnB1dHNbMV0gKyAnICknO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgPSBNYXRoLm1heChwYXJzZUZsb2F0KGlucHV0c1swXSksIHBhcnNlRmxvYXQoaW5wdXRzWzFdKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeCwgeSkge1xuICB2YXIgbWF4ID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgbWF4LmlucHV0cyA9IFt4LCB5XTtcblxuICByZXR1cm4gbWF4O1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ21lbW8nLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBvdXQgPSB2b2lkIDAsXG4gICAgICAgIGlucHV0cyA9IF9nZW4uZ2V0SW5wdXRzKHRoaXMpO1xuXG4gICAgb3V0ID0gJyAgdmFyICcgKyB0aGlzLm5hbWUgKyAnID0gJyArIGlucHV0c1swXSArICdcXG4nO1xuXG4gICAgX2dlbi5tZW1vW3RoaXMubmFtZV0gPSB0aGlzLm5hbWU7XG5cbiAgICByZXR1cm4gW3RoaXMubmFtZSwgb3V0XTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW4xLCBtZW1vTmFtZSkge1xuICB2YXIgbWVtbyA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIG1lbW8uaW5wdXRzID0gW2luMV07XG4gIG1lbW8uaWQgPSBfZ2VuLmdldFVJRCgpO1xuICBtZW1vLm5hbWUgPSBtZW1vTmFtZSAhPT0gdW5kZWZpbmVkID8gbWVtb05hbWUgKyAnXycgKyBfZ2VuLmdldFVJRCgpIDogJycgKyBtZW1vLmJhc2VuYW1lICsgbWVtby5pZDtcblxuICByZXR1cm4gbWVtbztcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgbmFtZTogJ21pbicsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIG91dCA9IHZvaWQgMCxcbiAgICAgICAgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyk7XG5cbiAgICBpZiAoaXNOYU4oaW5wdXRzWzBdKSB8fCBpc05hTihpbnB1dHNbMV0pKSB7XG4gICAgICBfZ2VuLmNsb3N1cmVzLmFkZChfZGVmaW5lUHJvcGVydHkoe30sIHRoaXMubmFtZSwgTWF0aC5taW4pKTtcblxuICAgICAgb3V0ID0gJ2dlbi5taW4oICcgKyBpbnB1dHNbMF0gKyAnLCAnICsgaW5wdXRzWzFdICsgJyApJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ID0gTWF0aC5taW4ocGFyc2VGbG9hdChpbnB1dHNbMF0pLCBwYXJzZUZsb2F0KGlucHV0c1sxXSkpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgdmFyIG1pbiA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIG1pbi5pbnB1dHMgPSBbeCwgeV07XG5cbiAgcmV0dXJuIG1pbjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKSxcbiAgICBhZGQgPSByZXF1aXJlKCcuL2FkZC5qcycpLFxuICAgIG11bCA9IHJlcXVpcmUoJy4vbXVsLmpzJyksXG4gICAgc3ViID0gcmVxdWlyZSgnLi9zdWIuanMnKSxcbiAgICBtZW1vID0gcmVxdWlyZSgnLi9tZW1vLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluMSwgaW4yKSB7XG4gICAgdmFyIHQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDIgfHwgYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyAuNSA6IGFyZ3VtZW50c1syXTtcblxuICAgIHZhciB1Z2VuID0gbWVtbyhhZGQobXVsKGluMSwgc3ViKDEsIHQpKSwgbXVsKGluMiwgdCkpKTtcbiAgICB1Z2VuLm5hbWUgPSAnbWl4JyArIGdlbi5nZXRVSUQoKTtcblxuICAgIHJldHVybiB1Z2VuO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciBtb2QgPSB7XG4gICAgaWQ6IF9nZW4uZ2V0VUlEKCksXG4gICAgaW5wdXRzOiBhcmdzLFxuXG4gICAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgICB2YXIgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyksXG4gICAgICAgICAgb3V0ID0gJygnLFxuICAgICAgICAgIGRpZmYgPSAwLFxuICAgICAgICAgIG51bUNvdW50ID0gMCxcbiAgICAgICAgICBsYXN0TnVtYmVyID0gaW5wdXRzWzBdLFxuICAgICAgICAgIGxhc3ROdW1iZXJJc1VnZW4gPSBpc05hTihsYXN0TnVtYmVyKSxcbiAgICAgICAgICBtb2RBdEVuZCA9IGZhbHNlO1xuXG4gICAgICBpbnB1dHMuZm9yRWFjaChmdW5jdGlvbiAodiwgaSkge1xuICAgICAgICBpZiAoaSA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBpc051bWJlclVnZW4gPSBpc05hTih2KSxcbiAgICAgICAgICAgIGlzRmluYWxJZHggPSBpID09PSBpbnB1dHMubGVuZ3RoIC0gMTtcblxuICAgICAgICBpZiAoIWxhc3ROdW1iZXJJc1VnZW4gJiYgIWlzTnVtYmVyVWdlbikge1xuICAgICAgICAgIGxhc3ROdW1iZXIgPSBsYXN0TnVtYmVyICUgdjtcbiAgICAgICAgICBvdXQgKz0gbGFzdE51bWJlcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXQgKz0gbGFzdE51bWJlciArICcgJSAnICsgdjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNGaW5hbElkeCkgb3V0ICs9ICcgJSAnO1xuICAgICAgfSk7XG5cbiAgICAgIG91dCArPSAnKSc7XG5cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBtb2Q7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAnbXN0b3NhbXBzJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKSxcbiAgICAgICAgcmV0dXJuVmFsdWUgPSB2b2lkIDA7XG5cbiAgICBpZiAoaXNOYU4oaW5wdXRzWzBdKSkge1xuICAgICAgb3V0ID0gJyAgdmFyICcgKyB0aGlzLm5hbWUgKyAnID0gJyArIF9nZW4uc2FtcGxlcmF0ZSArICcgLyAxMDAwICogJyArIGlucHV0c1swXSArICcgXFxuXFxuJztcblxuICAgICAgX2dlbi5tZW1vW3RoaXMubmFtZV0gPSBvdXQ7XG5cbiAgICAgIHJldHVyblZhbHVlID0gW3RoaXMubmFtZSwgb3V0XTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ID0gX2dlbi5zYW1wbGVyYXRlIC8gMTAwMCAqIHRoaXMuaW5wdXRzWzBdO1xuXG4gICAgICByZXR1cm5WYWx1ZSA9IG91dDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgpIHtcbiAgdmFyIG1zdG9zYW1wcyA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIG1zdG9zYW1wcy5pbnB1dHMgPSBbeF07XG4gIG1zdG9zYW1wcy5uYW1lID0gcHJvdG8uYmFzZW5hbWUgKyBfZ2VuLmdldFVJRCgpO1xuXG4gIHJldHVybiBtc3Rvc2FtcHM7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIG5hbWU6ICdtdG9mJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIGlmIChpc05hTihpbnB1dHNbMF0pKSB7XG4gICAgICBfZ2VuLmNsb3N1cmVzLmFkZChfZGVmaW5lUHJvcGVydHkoe30sIHRoaXMubmFtZSwgTWF0aC5leHApKTtcblxuICAgICAgb3V0ID0gJyggJyArIHRoaXMudHVuaW5nICsgJyAqIGdlbi5leHAoIC4wNTc3NjIyNjUgKiAoJyArIGlucHV0c1swXSArICcgLSA2OSkgKSApJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ID0gdGhpcy50dW5pbmcgKiBNYXRoLmV4cCguMDU3NzYyMjY1ICogKGlucHV0c1swXSAtIDY5KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeCwgcHJvcHMpIHtcbiAgdmFyIHVnZW4gPSBPYmplY3QuY3JlYXRlKHByb3RvKSxcbiAgICAgIGRlZmF1bHRzID0geyB0dW5pbmc6IDQ0MCB9O1xuXG4gIGlmIChwcm9wcyAhPT0gdW5kZWZpbmVkKSBPYmplY3QuYXNzaWduKHByb3BzLmRlZmF1bHRzKTtcblxuICBPYmplY3QuYXNzaWduKHVnZW4sIGRlZmF1bHRzKTtcbiAgdWdlbi5pbnB1dHMgPSBbeF07XG5cbiAgcmV0dXJuIHVnZW47XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAnbXVsJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyksXG4gICAgICAgIG91dCA9ICcgIHZhciAnICsgdGhpcy5uYW1lICsgJyA9ICcsXG4gICAgICAgIHN1bSA9IDEsXG4gICAgICAgIG51bUNvdW50ID0gMCxcbiAgICAgICAgbXVsQXRFbmQgPSBmYWxzZSxcbiAgICAgICAgYWxyZWFkeUZ1bGxTdW1tZWQgPSB0cnVlO1xuXG4gICAgaW5wdXRzLmZvckVhY2goZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgIGlmIChpc05hTih2KSkge1xuICAgICAgICBvdXQgKz0gdjtcbiAgICAgICAgaWYgKGkgPCBpbnB1dHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIG11bEF0RW5kID0gdHJ1ZTtcbiAgICAgICAgICBvdXQgKz0gJyAqICc7XG4gICAgICAgIH1cbiAgICAgICAgYWxyZWFkeUZ1bGxTdW1tZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgc3VtID0gdjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdW0gKj0gcGFyc2VGbG9hdCh2KTtcbiAgICAgICAgfVxuICAgICAgICBudW1Db3VudCsrO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG51bUNvdW50ID4gMCkge1xuICAgICAgb3V0ICs9IG11bEF0RW5kIHx8IGFscmVhZHlGdWxsU3VtbWVkID8gc3VtIDogJyAqICcgKyBzdW07XG4gICAgfVxuXG4gICAgb3V0ICs9ICdcXG4nO1xuXG4gICAgX2dlbi5tZW1vW3RoaXMubmFtZV0gPSB0aGlzLm5hbWU7XG5cbiAgICByZXR1cm4gW3RoaXMubmFtZSwgb3V0XTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciBtdWwgPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcblxuICBPYmplY3QuYXNzaWduKG11bCwge1xuICAgIGlkOiBfZ2VuLmdldFVJRCgpLFxuICAgIGlucHV0czogYXJnc1xuICB9KTtcblxuICBtdWwubmFtZSA9IG11bC5iYXNlbmFtZSArIG11bC5pZDtcblxuICByZXR1cm4gbXVsO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ25lcScsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIGlucHV0cyA9IF9nZW4uZ2V0SW5wdXRzKHRoaXMpLFxuICAgICAgICBvdXQgPSB2b2lkIDA7XG5cbiAgICBvdXQgPSAvKnRoaXMuaW5wdXRzWzBdICE9PSB0aGlzLmlucHV0c1sxXSA/IDEgOiovJyAgdmFyICcgKyB0aGlzLm5hbWUgKyAnID0gKCcgKyBpbnB1dHNbMF0gKyAnICE9PSAnICsgaW5wdXRzWzFdICsgJykgfCAwXFxuXFxuJztcblxuICAgIF9nZW4ubWVtb1t0aGlzLm5hbWVdID0gdGhpcy5uYW1lO1xuXG4gICAgcmV0dXJuIFt0aGlzLm5hbWUsIG91dF07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluMSwgaW4yKSB7XG4gIHZhciB1Z2VuID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG4gIE9iamVjdC5hc3NpZ24odWdlbiwge1xuICAgIHVpZDogX2dlbi5nZXRVSUQoKSxcbiAgICBpbnB1dHM6IFtpbjEsIGluMl1cbiAgfSk7XG5cbiAgdWdlbi5uYW1lID0gJycgKyB1Z2VuLmJhc2VuYW1lICsgdWdlbi51aWQ7XG5cbiAgcmV0dXJuIHVnZW47XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIG5hbWU6ICdub2lzZScsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIG91dCA9IHZvaWQgMDtcblxuICAgIF9nZW4uY2xvc3VyZXMuYWRkKHsgJ25vaXNlJzogTWF0aC5yYW5kb20gfSk7XG5cbiAgICBvdXQgPSAnICB2YXIgJyArIHRoaXMubmFtZSArICcgPSBnZW4ubm9pc2UoKVxcbic7XG5cbiAgICBfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9IHRoaXMubmFtZTtcblxuICAgIHJldHVybiBbdGhpcy5uYW1lLCBvdXRdO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh4KSB7XG4gIHZhciBub2lzZSA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuICBub2lzZS5uYW1lID0gcHJvdG8ubmFtZSArIF9nZW4uZ2V0VUlEKCk7XG5cbiAgcmV0dXJuIG5vaXNlO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBuYW1lOiAnbm90JyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIGlmIChpc05hTih0aGlzLmlucHV0c1swXSkpIHtcbiAgICAgIG91dCA9ICcoICcgKyBpbnB1dHNbMF0gKyAnID09PSAwID8gMSA6IDAgKSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCA9ICFpbnB1dHNbMF0gPT09IDAgPyAxIDogMDtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh4KSB7XG4gIHZhciBub3QgPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcblxuICBub3QuaW5wdXRzID0gW3hdO1xuXG4gIHJldHVybiBub3Q7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyksXG4gICAgZGF0YSA9IHJlcXVpcmUoJy4vZGF0YS5qcycpLFxuICAgIHBlZWsgPSByZXF1aXJlKCcuL3BlZWsuanMnKSxcbiAgICBtdWwgPSByZXF1aXJlKCcuL211bC5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAncGFuJyxcbiAgaW5pdFRhYmxlOiBmdW5jdGlvbiBpbml0VGFibGUoKSB7XG4gICAgdmFyIGJ1ZmZlckwgPSBuZXcgRmxvYXQzMkFycmF5KDEwMjQpLFxuICAgICAgICBidWZmZXJSID0gbmV3IEZsb2F0MzJBcnJheSgxMDI0KTtcblxuICAgIHZhciBzcXJ0VHdvT3ZlclR3byA9IE1hdGguc3FydCgyKSAvIDI7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwMjQ7IGkrKykge1xuICAgICAgdmFyIHBhbiA9IC0xICsgaSAvIDEwMjQgKiAyO1xuICAgICAgYnVmZmVyTFtpXSA9IHNxcnRUd29PdmVyVHdvICogKE1hdGguY29zKHBhbikgLSBNYXRoLnNpbihwYW4pKTtcbiAgICAgIGJ1ZmZlclJbaV0gPSBzcXJ0VHdvT3ZlclR3byAqIChNYXRoLmNvcyhwYW4pICsgTWF0aC5zaW4ocGFuKSk7XG4gICAgfVxuXG4gICAgZ2VuLmdsb2JhbHMucGFuTCA9IGRhdGEoYnVmZmVyTCwgMSwgeyBpbW11dGFibGU6IHRydWUgfSk7XG4gICAgZ2VuLmdsb2JhbHMucGFuUiA9IGRhdGEoYnVmZmVyUiwgMSwgeyBpbW11dGFibGU6IHRydWUgfSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxlZnRJbnB1dCwgcmlnaHRJbnB1dCkge1xuICB2YXIgcGFuID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gLjUgOiBhcmd1bWVudHNbMl07XG4gIHZhciBwcm9wZXJ0aWVzID0gYXJndW1lbnRzWzNdO1xuXG4gIGlmIChnZW4uZ2xvYmFscy5wYW5MID09PSB1bmRlZmluZWQpIHByb3RvLmluaXRUYWJsZSgpO1xuXG4gIHZhciB1Z2VuID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgT2JqZWN0LmFzc2lnbih1Z2VuLCB7XG4gICAgdWlkOiBnZW4uZ2V0VUlEKCksXG4gICAgaW5wdXRzOiBbbGVmdElucHV0LCByaWdodElucHV0XSxcbiAgICBsZWZ0OiBtdWwobGVmdElucHV0LCBwZWVrKGdlbi5nbG9iYWxzLnBhbkwsIHBhbiwgeyBib3VuZG1vZGU6ICdjbGFtcCcgfSkpLFxuICAgIHJpZ2h0OiBtdWwocmlnaHRJbnB1dCwgcGVlayhnZW4uZ2xvYmFscy5wYW5SLCBwYW4sIHsgYm91bmRtb2RlOiAnY2xhbXAnIH0pKVxuICB9KTtcblxuICB1Z2VuLm5hbWUgPSAnJyArIHVnZW4uYmFzZW5hbWUgKyB1Z2VuLnVpZDtcblxuICByZXR1cm4gdWdlbjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgYmFzZW5hbWU6ICdwYXJhbScsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgX2dlbi5yZXF1ZXN0TWVtb3J5KHRoaXMubWVtb3J5KTtcblxuICAgIF9nZW4ucGFyYW1zLmFkZChfZGVmaW5lUHJvcGVydHkoe30sIHRoaXMubmFtZSwgdGhpcykpO1xuXG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuaW5pdGlhbFZhbHVlO1xuXG4gICAgX2dlbi5tZW1vW3RoaXMubmFtZV0gPSAnbWVtb3J5WycgKyB0aGlzLm1lbW9yeS52YWx1ZS5pZHggKyAnXSc7XG5cbiAgICByZXR1cm4gX2dlbi5tZW1vW3RoaXMubmFtZV07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcHJvcE5hbWUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzBdO1xuICB2YXIgdmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzFdO1xuXG4gIHZhciB1Z2VuID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgaWYgKHR5cGVvZiBwcm9wTmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICB1Z2VuLm5hbWUgPSB1Z2VuLmJhc2VuYW1lICsgX2dlbi5nZXRVSUQoKTtcbiAgICB1Z2VuLmluaXRpYWxWYWx1ZSA9IHByb3BOYW1lO1xuICB9IGVsc2Uge1xuICAgIHVnZW4ubmFtZSA9IHByb3BOYW1lO1xuICAgIHVnZW4uaW5pdGlhbFZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodWdlbiwgJ3ZhbHVlJywge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgaWYgKHRoaXMubWVtb3J5LnZhbHVlLmlkeCAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gX2dlbi5tZW1vcnkuaGVhcFt0aGlzLm1lbW9yeS52YWx1ZS5pZHhdO1xuICAgICAgfVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodikge1xuICAgICAgaWYgKHRoaXMubWVtb3J5LnZhbHVlLmlkeCAhPT0gbnVsbCkge1xuICAgICAgICBfZ2VuLm1lbW9yeS5oZWFwW3RoaXMubWVtb3J5LnZhbHVlLmlkeF0gPSB2O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdWdlbi5tZW1vcnkgPSB7XG4gICAgdmFsdWU6IHsgbGVuZ3RoOiAxLCBpZHg6IG51bGwgfVxuICB9O1xuXG4gIHJldHVybiB1Z2VuO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ3BlZWsnLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBnZW5OYW1lID0gJ2dlbi4nICsgdGhpcy5uYW1lLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKSxcbiAgICAgICAgb3V0ID0gdm9pZCAwLFxuICAgICAgICBmdW5jdGlvbkJvZHkgPSB2b2lkIDAsXG4gICAgICAgIG5leHQgPSB2b2lkIDAsXG4gICAgICAgIGxlbmd0aElzTG9nMiA9IHZvaWQgMCxcbiAgICAgICAgaWR4ID0gdm9pZCAwO1xuXG4gICAgaWR4ID0gaW5wdXRzWzFdO1xuICAgIGxlbmd0aElzTG9nMiA9IChNYXRoLmxvZzIodGhpcy5kYXRhLmJ1ZmZlci5sZW5ndGgpIHwgMCkgPT09IE1hdGgubG9nMih0aGlzLmRhdGEuYnVmZmVyLmxlbmd0aCk7XG5cbiAgICBpZiAodGhpcy5tb2RlICE9PSAnc2ltcGxlJykge1xuXG4gICAgICBmdW5jdGlvbkJvZHkgPSAnICB2YXIgJyArIHRoaXMubmFtZSArICdfZGF0YUlkeCAgPSAnICsgaWR4ICsgJywgXFxuICAgICAgJyArIHRoaXMubmFtZSArICdfcGhhc2UgPSAnICsgKHRoaXMubW9kZSA9PT0gJ3NhbXBsZXMnID8gaW5wdXRzWzBdIDogaW5wdXRzWzBdICsgJyAqICcgKyAodGhpcy5kYXRhLmJ1ZmZlci5sZW5ndGggLSAxKSkgKyAnLCBcXG4gICAgICAnICsgdGhpcy5uYW1lICsgJ19pbmRleCA9ICcgKyB0aGlzLm5hbWUgKyAnX3BoYXNlIHwgMCxcXG4nO1xuXG4gICAgICBpZiAodGhpcy5ib3VuZG1vZGUgPT09ICd3cmFwJykge1xuICAgICAgICBuZXh0ID0gbGVuZ3RoSXNMb2cyID8gJyggJyArIHRoaXMubmFtZSArICdfaW5kZXggKyAxICkgJiAoJyArIHRoaXMuZGF0YS5idWZmZXIubGVuZ3RoICsgJyAtIDEpJyA6IHRoaXMubmFtZSArICdfaW5kZXggKyAxID49ICcgKyB0aGlzLmRhdGEuYnVmZmVyLmxlbmd0aCArICcgPyAnICsgdGhpcy5uYW1lICsgJ19pbmRleCArIDEgLSAnICsgdGhpcy5kYXRhLmJ1ZmZlci5sZW5ndGggKyAnIDogJyArIHRoaXMubmFtZSArICdfaW5kZXggKyAxJztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5ib3VuZG1vZGUgPT09ICdjbGFtcCcpIHtcbiAgICAgICAgbmV4dCA9IHRoaXMubmFtZSArICdfaW5kZXggKyAxID49ICcgKyAodGhpcy5kYXRhLmJ1ZmZlci5sZW5ndGggLSAxKSArICcgPyAnICsgKHRoaXMuZGF0YS5idWZmZXIubGVuZ3RoIC0gMSkgKyAnIDogJyArIHRoaXMubmFtZSArICdfaW5kZXggKyAxJztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5ib3VuZG1vZGUgPT09ICdmb2xkJyB8fCB0aGlzLmJvdW5kbW9kZSA9PT0gJ21pcnJvcicpIHtcbiAgICAgICAgbmV4dCA9IHRoaXMubmFtZSArICdfaW5kZXggKyAxID49ICcgKyAodGhpcy5kYXRhLmJ1ZmZlci5sZW5ndGggLSAxKSArICcgPyAnICsgdGhpcy5uYW1lICsgJ19pbmRleCAtICcgKyAodGhpcy5kYXRhLmJ1ZmZlci5sZW5ndGggLSAxKSArICcgOiAnICsgdGhpcy5uYW1lICsgJ19pbmRleCArIDEnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dCA9IHRoaXMubmFtZSArICdfaW5kZXggKyAxJztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaW50ZXJwID09PSAnbGluZWFyJykge1xuICAgICAgICBmdW5jdGlvbkJvZHkgKz0gJyAgICAgICcgKyB0aGlzLm5hbWUgKyAnX2ZyYWMgID0gJyArIHRoaXMubmFtZSArICdfcGhhc2UgLSAnICsgdGhpcy5uYW1lICsgJ19pbmRleCxcXG4gICAgICAnICsgdGhpcy5uYW1lICsgJ19iYXNlICA9IG1lbW9yeVsgJyArIHRoaXMubmFtZSArICdfZGF0YUlkeCArICAnICsgdGhpcy5uYW1lICsgJ19pbmRleCBdLFxcbiAgICAgICcgKyB0aGlzLm5hbWUgKyAnX25leHQgID0gJyArIG5leHQgKyAnLCc7XG5cbiAgICAgICAgaWYgKHRoaXMuYm91bmRtb2RlID09PSAnaWdub3JlJykge1xuICAgICAgICAgIGZ1bmN0aW9uQm9keSArPSAnXFxuICAgICAgJyArIHRoaXMubmFtZSArICdfb3V0ICAgPSAnICsgdGhpcy5uYW1lICsgJ19pbmRleCA+PSAnICsgKHRoaXMuZGF0YS5idWZmZXIubGVuZ3RoIC0gMSkgKyAnIHx8ICcgKyB0aGlzLm5hbWUgKyAnX2luZGV4IDwgMCA/IDAgOiAnICsgdGhpcy5uYW1lICsgJ19iYXNlICsgJyArIHRoaXMubmFtZSArICdfZnJhYyAqICggbWVtb3J5WyAnICsgdGhpcy5uYW1lICsgJ19kYXRhSWR4ICsgJyArIHRoaXMubmFtZSArICdfbmV4dCBdIC0gJyArIHRoaXMubmFtZSArICdfYmFzZSApXFxuXFxuJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmdW5jdGlvbkJvZHkgKz0gJ1xcbiAgICAgICcgKyB0aGlzLm5hbWUgKyAnX291dCAgID0gJyArIHRoaXMubmFtZSArICdfYmFzZSArICcgKyB0aGlzLm5hbWUgKyAnX2ZyYWMgKiAoIG1lbW9yeVsgJyArIHRoaXMubmFtZSArICdfZGF0YUlkeCArICcgKyB0aGlzLm5hbWUgKyAnX25leHQgXSAtICcgKyB0aGlzLm5hbWUgKyAnX2Jhc2UgKVxcblxcbic7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZ1bmN0aW9uQm9keSArPSAnICAgICAgJyArIHRoaXMubmFtZSArICdfb3V0ID0gbWVtb3J5WyAnICsgdGhpcy5uYW1lICsgJ19kYXRhSWR4ICsgJyArIHRoaXMubmFtZSArICdfaW5kZXggXVxcblxcbic7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG1vZGUgaXMgc2ltcGxlXG4gICAgICBmdW5jdGlvbkJvZHkgPSAnbWVtb3J5WyAnICsgaWR4ICsgJyArICcgKyBpbnB1dHNbMF0gKyAnIF0nO1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb25Cb2R5O1xuICAgIH1cblxuICAgIF9nZW4ubWVtb1t0aGlzLm5hbWVdID0gdGhpcy5uYW1lICsgJ19vdXQnO1xuXG4gICAgcmV0dXJuIFt0aGlzLm5hbWUgKyAnX291dCcsIGZ1bmN0aW9uQm9keV07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRhdGEsIGluZGV4LCBwcm9wZXJ0aWVzKSB7XG4gIHZhciB1Z2VuID0gT2JqZWN0LmNyZWF0ZShwcm90byksXG4gICAgICBkZWZhdWx0cyA9IHsgY2hhbm5lbHM6IDEsIG1vZGU6ICdwaGFzZScsIGludGVycDogJ2xpbmVhcicsIGJvdW5kbW9kZTogJ3dyYXAnIH07XG5cbiAgaWYgKHByb3BlcnRpZXMgIT09IHVuZGVmaW5lZCkgT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgcHJvcGVydGllcyk7XG5cbiAgT2JqZWN0LmFzc2lnbih1Z2VuLCB7XG4gICAgZGF0YTogZGF0YSxcbiAgICBkYXRhTmFtZTogZGF0YS5uYW1lLFxuICAgIHVpZDogX2dlbi5nZXRVSUQoKSxcbiAgICBpbnB1dHM6IFtpbmRleCwgZGF0YV1cbiAgfSwgZGVmYXVsdHMpO1xuXG4gIHVnZW4ubmFtZSA9IHVnZW4uYmFzZW5hbWUgKyB1Z2VuLnVpZDtcblxuICByZXR1cm4gdWdlbjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKSxcbiAgICBhY2N1bSA9IHJlcXVpcmUoJy4vYWNjdW0uanMnKSxcbiAgICBtdWwgPSByZXF1aXJlKCcuL211bC5qcycpLFxuICAgIHByb3RvID0geyBiYXNlbmFtZTogJ3BoYXNvcicgfTtcblxudmFyIGRlZmF1bHRzID0geyBtaW46IC0xLCBtYXg6IDEgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBmcmVxdWVuY3kgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyAxIDogYXJndW1lbnRzWzBdO1xuICB2YXIgcmVzZXQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzFdO1xuICB2YXIgX3Byb3BzID0gYXJndW1lbnRzWzJdO1xuXG4gIHZhciBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBfcHJvcHMpO1xuXG4gIHZhciByYW5nZSA9IHByb3BzLm1heCAtIHByb3BzLm1pbjtcblxuICB2YXIgdWdlbiA9IHR5cGVvZiBmcmVxdWVuY3kgPT09ICdudW1iZXInID8gYWNjdW0oZnJlcXVlbmN5ICogcmFuZ2UgLyBnZW4uc2FtcGxlcmF0ZSwgcmVzZXQsIHByb3BzKSA6IGFjY3VtKG11bChmcmVxdWVuY3ksIDEgLyBnZW4uc2FtcGxlcmF0ZSAvICgxIC8gcmFuZ2UpKSwgcmVzZXQsIHByb3BzKTtcblxuICB1Z2VuLm5hbWUgPSBwcm90by5iYXNlbmFtZSArIGdlbi5nZXRVSUQoKTtcblxuICByZXR1cm4gdWdlbjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyksXG4gICAgbXVsID0gcmVxdWlyZSgnLi9tdWwuanMnKSxcbiAgICB3cmFwID0gcmVxdWlyZSgnLi93cmFwLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgYmFzZW5hbWU6ICdwb2tlJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgZGF0YU5hbWUgPSAnbWVtb3J5JyxcbiAgICAgICAgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyksXG4gICAgICAgIGlkeCA9IHZvaWQgMCxcbiAgICAgICAgb3V0ID0gdm9pZCAwLFxuICAgICAgICB3cmFwcGVkID0gdm9pZCAwO1xuXG4gICAgaWR4ID0gdGhpcy5kYXRhLmdlbigpO1xuXG4gICAgLy9nZW4ucmVxdWVzdE1lbW9yeSggdGhpcy5tZW1vcnkgKVxuICAgIC8vd3JhcHBlZCA9IHdyYXAoIHRoaXMuaW5wdXRzWzFdLCAwLCB0aGlzLmRhdGFMZW5ndGggKS5nZW4oKVxuICAgIC8vaWR4ID0gd3JhcHBlZFswXVxuICAgIC8vZ2VuLmZ1bmN0aW9uQm9keSArPSB3cmFwcGVkWzFdXG4gICAgdmFyIG91dHB1dFN0ciA9IHRoaXMuaW5wdXRzWzFdID09PSAwID8gJyAgJyArIGRhdGFOYW1lICsgJ1sgJyArIGlkeCArICcgXSA9ICcgKyBpbnB1dHNbMF0gKyAnXFxuJyA6ICcgICcgKyBkYXRhTmFtZSArICdbICcgKyBpZHggKyAnICsgJyArIGlucHV0c1sxXSArICcgXSA9ICcgKyBpbnB1dHNbMF0gKyAnXFxuJztcblxuICAgIGlmICh0aGlzLmlubGluZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBfZ2VuLmZ1bmN0aW9uQm9keSArPSBvdXRwdXRTdHI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbdGhpcy5pbmxpbmUsIG91dHB1dFN0cl07XG4gICAgfVxuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZGF0YSwgdmFsdWUsIGluZGV4LCBwcm9wZXJ0aWVzKSB7XG4gIHZhciB1Z2VuID0gT2JqZWN0LmNyZWF0ZShwcm90byksXG4gICAgICBkZWZhdWx0cyA9IHsgY2hhbm5lbHM6IDEgfTtcblxuICBpZiAocHJvcGVydGllcyAhPT0gdW5kZWZpbmVkKSBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBwcm9wZXJ0aWVzKTtcblxuICBPYmplY3QuYXNzaWduKHVnZW4sIHtcbiAgICBkYXRhOiBkYXRhLFxuICAgIGRhdGFOYW1lOiBkYXRhLm5hbWUsXG4gICAgZGF0YUxlbmd0aDogZGF0YS5idWZmZXIubGVuZ3RoLFxuICAgIHVpZDogX2dlbi5nZXRVSUQoKSxcbiAgICBpbnB1dHM6IFt2YWx1ZSwgaW5kZXhdXG4gIH0sIGRlZmF1bHRzKTtcblxuICB1Z2VuLm5hbWUgPSB1Z2VuLmJhc2VuYW1lICsgdWdlbi51aWQ7XG5cbiAgX2dlbi5oaXN0b3JpZXMuc2V0KHVnZW4ubmFtZSwgdWdlbik7XG5cbiAgcmV0dXJuIHVnZW47XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAncG93JyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIGlmIChpc05hTihpbnB1dHNbMF0pIHx8IGlzTmFOKGlucHV0c1sxXSkpIHtcbiAgICAgIF9nZW4uY2xvc3VyZXMuYWRkKHsgJ3Bvdyc6IE1hdGgucG93IH0pO1xuXG4gICAgICBvdXQgPSAnZ2VuLnBvdyggJyArIGlucHV0c1swXSArICcsICcgKyBpbnB1dHNbMV0gKyAnICknO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIGlucHV0c1swXSA9PT0gJ3N0cmluZycgJiYgaW5wdXRzWzBdWzBdID09PSAnKCcpIHtcbiAgICAgICAgaW5wdXRzWzBdID0gaW5wdXRzWzBdLnNsaWNlKDEsIC0xKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgaW5wdXRzWzFdID09PSAnc3RyaW5nJyAmJiBpbnB1dHNbMV1bMF0gPT09ICcoJykge1xuICAgICAgICBpbnB1dHNbMV0gPSBpbnB1dHNbMV0uc2xpY2UoMSwgLTEpO1xuICAgICAgfVxuXG4gICAgICBvdXQgPSBNYXRoLnBvdyhwYXJzZUZsb2F0KGlucHV0c1swXSksIHBhcnNlRmxvYXQoaW5wdXRzWzFdKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeCwgeSkge1xuICB2YXIgcG93ID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgcG93LmlucHV0cyA9IFt4LCB5XTtcbiAgcG93LmlkID0gX2dlbi5nZXRVSUQoKTtcbiAgcG93Lm5hbWUgPSBwb3cuYmFzZW5hbWUgKyAne3Bvdy5pZH0nO1xuXG4gIHJldHVybiBwb3c7XG59OyIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpLFxuICAgIGhpc3RvcnkgPSByZXF1aXJlKCcuL2hpc3RvcnkuanMnKSxcbiAgICBzdWIgPSByZXF1aXJlKCcuL3N1Yi5qcycpLFxuICAgIGFkZCA9IHJlcXVpcmUoJy4vYWRkLmpzJyksXG4gICAgbXVsID0gcmVxdWlyZSgnLi9tdWwuanMnKSxcbiAgICBtZW1vID0gcmVxdWlyZSgnLi9tZW1vLmpzJyksXG4gICAgZGVsdGEgPSByZXF1aXJlKCcuL2RlbHRhLmpzJyksXG4gICAgd3JhcCA9IHJlcXVpcmUoJy4vd3JhcC5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAncmF0ZScsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIGlucHV0cyA9IF9nZW4uZ2V0SW5wdXRzKHRoaXMpLFxuICAgICAgICBwaGFzZSA9IGhpc3RvcnkoKSxcbiAgICAgICAgaW5NaW51czEgPSBoaXN0b3J5KCksXG4gICAgICAgIGdlbk5hbWUgPSAnZ2VuLicgKyB0aGlzLm5hbWUsXG4gICAgICAgIGZpbHRlciA9IHZvaWQgMCxcbiAgICAgICAgc3VtID0gdm9pZCAwLFxuICAgICAgICBvdXQgPSB2b2lkIDA7XG5cbiAgICBfZ2VuLmNsb3N1cmVzLmFkZChfZGVmaW5lUHJvcGVydHkoe30sIHRoaXMubmFtZSwgdGhpcykpO1xuXG4gICAgb3V0ID0gJyB2YXIgJyArIHRoaXMubmFtZSArICdfZGlmZiA9ICcgKyBpbnB1dHNbMF0gKyAnIC0gJyArIGdlbk5hbWUgKyAnLmxhc3RTYW1wbGVcXG4gIGlmKCAnICsgdGhpcy5uYW1lICsgJ19kaWZmIDwgLS41ICkgJyArIHRoaXMubmFtZSArICdfZGlmZiArPSAxXFxuICAnICsgZ2VuTmFtZSArICcucGhhc2UgKz0gJyArIHRoaXMubmFtZSArICdfZGlmZiAqICcgKyBpbnB1dHNbMV0gKyAnXFxuICBpZiggJyArIGdlbk5hbWUgKyAnLnBoYXNlID4gMSApICcgKyBnZW5OYW1lICsgJy5waGFzZSAtPSAxXFxuICAnICsgZ2VuTmFtZSArICcubGFzdFNhbXBsZSA9ICcgKyBpbnB1dHNbMF0gKyAnXFxuJztcbiAgICBvdXQgPSAnICcgKyBvdXQ7XG5cbiAgICByZXR1cm4gW2dlbk5hbWUgKyAnLnBoYXNlJywgb3V0XTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW4xLCByYXRlKSB7XG4gIHZhciB1Z2VuID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgT2JqZWN0LmFzc2lnbih1Z2VuLCB7XG4gICAgcGhhc2U6IDAsXG4gICAgbGFzdFNhbXBsZTogMCxcbiAgICB1aWQ6IF9nZW4uZ2V0VUlEKCksXG4gICAgaW5wdXRzOiBbaW4xLCByYXRlXVxuICB9KTtcblxuICB1Z2VuLm5hbWUgPSAnJyArIHVnZW4uYmFzZW5hbWUgKyB1Z2VuLnVpZDtcblxuICByZXR1cm4gdWdlbjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgbmFtZTogJ3JvdW5kJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIGlmIChpc05hTihpbnB1dHNbMF0pKSB7XG4gICAgICBfZ2VuLmNsb3N1cmVzLmFkZChfZGVmaW5lUHJvcGVydHkoe30sIHRoaXMubmFtZSwgTWF0aC5yb3VuZCkpO1xuXG4gICAgICBvdXQgPSAnZ2VuLnJvdW5kKCAnICsgaW5wdXRzWzBdICsgJyApJztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ID0gTWF0aC5yb3VuZChwYXJzZUZsb2F0KGlucHV0c1swXSkpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgpIHtcbiAgdmFyIHJvdW5kID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgcm91bmQuaW5wdXRzID0gW3hdO1xuXG4gIHJldHVybiByb3VuZDtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgYmFzZW5hbWU6ICdzYWgnLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKSxcbiAgICAgICAgb3V0ID0gdm9pZCAwO1xuXG4gICAgX2dlbi5kYXRhW3RoaXMubmFtZV0gPSAwO1xuICAgIF9nZW4uZGF0YVt0aGlzLm5hbWUgKyAnX2NvbnRyb2wnXSA9IDA7XG5cbiAgICBvdXQgPSAnIHZhciAnICsgdGhpcy5uYW1lICsgJyA9IGdlbi5kYXRhLicgKyB0aGlzLm5hbWUgKyAnX2NvbnRyb2wsXFxuICAgICAgJyArIHRoaXMubmFtZSArICdfdHJpZ2dlciA9ICcgKyBpbnB1dHNbMV0gKyAnID4gJyArIGlucHV0c1syXSArICcgPyAxIDogMFxcblxcbiAgaWYoICcgKyB0aGlzLm5hbWUgKyAnX3RyaWdnZXIgIT09ICcgKyB0aGlzLm5hbWUgKyAnICApIHtcXG4gICAgaWYoICcgKyB0aGlzLm5hbWUgKyAnX3RyaWdnZXIgPT09IDEgKSBcXG4gICAgICBnZW4uZGF0YS4nICsgdGhpcy5uYW1lICsgJyA9ICcgKyBpbnB1dHNbMF0gKyAnXFxuICAgIGdlbi5kYXRhLicgKyB0aGlzLm5hbWUgKyAnX2NvbnRyb2wgPSAnICsgdGhpcy5uYW1lICsgJ190cmlnZ2VyXFxuICB9XFxuJztcblxuICAgIF9nZW4ubWVtb1t0aGlzLm5hbWVdID0gJ2dlbi5kYXRhLicgKyB0aGlzLm5hbWU7XG5cbiAgICByZXR1cm4gWydnZW4uZGF0YS4nICsgdGhpcy5uYW1lLCAnICcgKyBvdXRdO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbjEsIGNvbnRyb2wpIHtcbiAgdmFyIHRocmVzaG9sZCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IDAgOiBhcmd1bWVudHNbMl07XG4gIHZhciBwcm9wZXJ0aWVzID0gYXJndW1lbnRzWzNdO1xuXG4gIHZhciB1Z2VuID0gT2JqZWN0LmNyZWF0ZShwcm90byksXG4gICAgICBkZWZhdWx0cyA9IHsgaW5pdDogMCB9O1xuXG4gIGlmIChwcm9wZXJ0aWVzICE9PSB1bmRlZmluZWQpIE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIHByb3BlcnRpZXMpO1xuXG4gIE9iamVjdC5hc3NpZ24odWdlbiwge1xuICAgIGxhc3RTYW1wbGU6IDAsXG4gICAgdWlkOiBfZ2VuLmdldFVJRCgpLFxuICAgIGlucHV0czogW2luMSwgY29udHJvbCwgdGhyZXNob2xkXVxuICB9LCBkZWZhdWx0cyk7XG5cbiAgdWdlbi5uYW1lID0gJycgKyB1Z2VuLmJhc2VuYW1lICsgdWdlbi51aWQ7XG5cbiAgcmV0dXJuIHVnZW47XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAnc2VsZWN0b3InLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKSxcbiAgICAgICAgb3V0ID0gdm9pZCAwLFxuICAgICAgICByZXR1cm5WYWx1ZSA9IDA7XG5cbiAgICBzd2l0Y2ggKGlucHV0cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuVmFsdWUgPSBpbnB1dHNbMV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBvdXQgPSAnICB2YXIgJyArIHRoaXMubmFtZSArICdfb3V0ID0gJyArIGlucHV0c1swXSArICcgPT09IDEgPyAnICsgaW5wdXRzWzFdICsgJyA6ICcgKyBpbnB1dHNbMl0gKyAnXFxuXFxuJztcbiAgICAgICAgcmV0dXJuVmFsdWUgPSBbdGhpcy5uYW1lICsgJ19vdXQnLCBvdXRdO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIG91dCA9ICcgdmFyICcgKyB0aGlzLm5hbWUgKyAnX291dCA9IDBcXG4gIHN3aXRjaCggJyArIGlucHV0c1swXSArICcgKyAxICkge1xcbic7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBvdXQgKz0gJyAgICBjYXNlICcgKyBpICsgJzogJyArIHRoaXMubmFtZSArICdfb3V0ID0gJyArIGlucHV0c1tpXSArICc7IGJyZWFrO1xcbic7XG4gICAgICAgIH1cblxuICAgICAgICBvdXQgKz0gJyAgfVxcblxcbic7XG5cbiAgICAgICAgcmV0dXJuVmFsdWUgPSBbdGhpcy5uYW1lICsgJ19vdXQnLCAnICcgKyBvdXRdO1xuICAgIH1cblxuICAgIF9nZW4ubWVtb1t0aGlzLm5hbWVdID0gdGhpcy5uYW1lICsgJ19vdXQnO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGlucHV0cyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgIGlucHV0c1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuXG4gIHZhciB1Z2VuID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgT2JqZWN0LmFzc2lnbih1Z2VuLCB7XG4gICAgdWlkOiBfZ2VuLmdldFVJRCgpLFxuICAgIGlucHV0czogaW5wdXRzXG4gIH0pO1xuXG4gIHVnZW4ubmFtZSA9ICcnICsgdWdlbi5iYXNlbmFtZSArIHVnZW4udWlkO1xuXG4gIHJldHVybiB1Z2VuO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBuYW1lOiAnc2lnbicsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIG91dCA9IHZvaWQgMCxcbiAgICAgICAgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyk7XG5cbiAgICBpZiAoaXNOYU4oaW5wdXRzWzBdKSkge1xuICAgICAgX2dlbi5jbG9zdXJlcy5hZGQoX2RlZmluZVByb3BlcnR5KHt9LCB0aGlzLm5hbWUsIE1hdGguc2lnbikpO1xuXG4gICAgICBvdXQgPSAnZ2VuLnNpZ24oICcgKyBpbnB1dHNbMF0gKyAnICknO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgPSBNYXRoLnNpZ24ocGFyc2VGbG9hdChpbnB1dHNbMF0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh4KSB7XG4gIHZhciBzaWduID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG5cbiAgc2lnbi5pbnB1dHMgPSBbeF07XG5cbiAgcmV0dXJuIHNpZ247XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAnc2luJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIGlmIChpc05hTihpbnB1dHNbMF0pKSB7XG4gICAgICBfZ2VuLmNsb3N1cmVzLmFkZCh7ICdzaW4nOiBNYXRoLnNpbiB9KTtcblxuICAgICAgb3V0ID0gJ2dlbi5zaW4oICcgKyBpbnB1dHNbMF0gKyAnICknO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgPSBNYXRoLnNpbihwYXJzZUZsb2F0KGlucHV0c1swXSkpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgpIHtcbiAgdmFyIHNpbiA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIHNpbi5pbnB1dHMgPSBbeF07XG4gIHNpbi5pZCA9IF9nZW4uZ2V0VUlEKCk7XG4gIHNpbi5uYW1lID0gc2luLmJhc2VuYW1lICsgJ3tzaW4uaWR9JztcblxuICByZXR1cm4gc2luO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBnZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpLFxuICAgIGhpc3RvcnkgPSByZXF1aXJlKCcuL2hpc3RvcnkuanMnKSxcbiAgICBzdWIgPSByZXF1aXJlKCcuL3N1Yi5qcycpLFxuICAgIGFkZCA9IHJlcXVpcmUoJy4vYWRkLmpzJyksXG4gICAgbXVsID0gcmVxdWlyZSgnLi9tdWwuanMnKSxcbiAgICBtZW1vID0gcmVxdWlyZSgnLi9tZW1vLmpzJyksXG4gICAgZ3QgPSByZXF1aXJlKCcuL2d0LmpzJyksXG4gICAgZGl2ID0gcmVxdWlyZSgnLi9kaXYuanMnKSxcbiAgICBfc3dpdGNoID0gcmVxdWlyZSgnLi9zd2l0Y2guanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW4xKSB7XG4gICAgdmFyIHNsaWRlVXAgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAxIDogYXJndW1lbnRzWzFdO1xuICAgIHZhciBzbGlkZURvd24gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDIgfHwgYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyAxIDogYXJndW1lbnRzWzJdO1xuXG4gICAgdmFyIHkxID0gaGlzdG9yeSgwKSxcbiAgICAgICAgZmlsdGVyID0gdm9pZCAwLFxuICAgICAgICBzbGlkZUFtb3VudCA9IHZvaWQgMDtcblxuICAgIC8veSAobikgPSB5IChuLTEpICsgKCh4IChuKSAtIHkgKG4tMSkpL3NsaWRlKVxuICAgIHNsaWRlQW1vdW50ID0gX3N3aXRjaChndChpbjEsIHkxLm91dCksIHNsaWRlVXAsIHNsaWRlRG93bik7XG5cbiAgICBmaWx0ZXIgPSBtZW1vKGFkZCh5MS5vdXQsIGRpdihzdWIoaW4xLCB5MS5vdXQpLCBzbGlkZUFtb3VudCkpKTtcblxuICAgIHkxLmluKGZpbHRlcik7XG5cbiAgICByZXR1cm4gZmlsdGVyO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ3N1YicsXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKSxcbiAgICAgICAgb3V0ID0gMCxcbiAgICAgICAgZGlmZiA9IDAsXG4gICAgICAgIG5lZWRzUGFyZW5zID0gZmFsc2UsXG4gICAgICAgIG51bUNvdW50ID0gMCxcbiAgICAgICAgbGFzdE51bWJlciA9IGlucHV0c1swXSxcbiAgICAgICAgbGFzdE51bWJlcklzVWdlbiA9IGlzTmFOKGxhc3ROdW1iZXIpLFxuICAgICAgICBzdWJBdEVuZCA9IGZhbHNlLFxuICAgICAgICBoYXNVZ2VucyA9IGZhbHNlLFxuICAgICAgICByZXR1cm5WYWx1ZSA9IDA7XG5cbiAgICB0aGlzLmlucHV0cy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKGlzTmFOKHZhbHVlKSkgaGFzVWdlbnMgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgb3V0ID0gJyAgdmFyICcgKyB0aGlzLm5hbWUgKyAnID0gJztcblxuICAgIGlucHV0cy5mb3JFYWNoKGZ1bmN0aW9uICh2LCBpKSB7XG4gICAgICBpZiAoaSA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICB2YXIgaXNOdW1iZXJVZ2VuID0gaXNOYU4odiksXG4gICAgICAgICAgaXNGaW5hbElkeCA9IGkgPT09IGlucHV0cy5sZW5ndGggLSAxO1xuXG4gICAgICBpZiAoIWxhc3ROdW1iZXJJc1VnZW4gJiYgIWlzTnVtYmVyVWdlbikge1xuICAgICAgICBsYXN0TnVtYmVyID0gbGFzdE51bWJlciAtIHY7XG4gICAgICAgIG91dCArPSBsYXN0TnVtYmVyO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZWVkc1BhcmVucyA9IHRydWU7XG4gICAgICAgIG91dCArPSBsYXN0TnVtYmVyICsgJyAtICcgKyB2O1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzRmluYWxJZHgpIG91dCArPSAnIC0gJztcbiAgICB9KTtcblxuICAgIG91dCArPSAnXFxuJztcblxuICAgIHJldHVyblZhbHVlID0gW3RoaXMubmFtZSwgb3V0XTtcblxuICAgIF9nZW4ubWVtb1t0aGlzLm5hbWVdID0gdGhpcy5uYW1lO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIHN1YiA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIE9iamVjdC5hc3NpZ24oc3ViLCB7XG4gICAgaWQ6IF9nZW4uZ2V0VUlEKCksXG4gICAgaW5wdXRzOiBhcmdzXG4gIH0pO1xuXG4gIHN1Yi5uYW1lID0gJ3N1YicgKyBzdWIuaWQ7XG5cbiAgcmV0dXJuIHN1Yjtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgYmFzZW5hbWU6ICdzd2l0Y2gnLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKSxcbiAgICAgICAgb3V0ID0gdm9pZCAwO1xuXG4gICAgaWYgKGlucHV0c1sxXSA9PT0gaW5wdXRzWzJdKSByZXR1cm4gaW5wdXRzWzFdOyAvLyBpZiBib3RoIHBvdGVudGlhbCBvdXRwdXRzIGFyZSB0aGUgc2FtZSBqdXN0IHJldHVybiBvbmUgb2YgdGhlbVxuXG4gICAgb3V0ID0gJyAgdmFyICcgKyB0aGlzLm5hbWUgKyAnX291dCA9ICcgKyBpbnB1dHNbMF0gKyAnID09PSAxID8gJyArIGlucHV0c1sxXSArICcgOiAnICsgaW5wdXRzWzJdICsgJ1xcbic7XG5cbiAgICBfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9IHRoaXMubmFtZSArICdfb3V0JztcblxuICAgIHJldHVybiBbdGhpcy5uYW1lICsgJ19vdXQnLCBvdXRdO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb250cm9sKSB7XG4gIHZhciBpbjEgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAxIDogYXJndW1lbnRzWzFdO1xuICB2YXIgaW4yID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gMCA6IGFyZ3VtZW50c1syXTtcblxuICB2YXIgdWdlbiA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuICBPYmplY3QuYXNzaWduKHVnZW4sIHtcbiAgICB1aWQ6IF9nZW4uZ2V0VUlEKCksXG4gICAgaW5wdXRzOiBbY29udHJvbCwgaW4xLCBpbjJdXG4gIH0pO1xuXG4gIHVnZW4ubmFtZSA9ICcnICsgdWdlbi5iYXNlbmFtZSArIHVnZW4udWlkO1xuXG4gIHJldHVybiB1Z2VuO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ3Q2MCcsXG5cbiAgZ2VuOiBmdW5jdGlvbiBnZW4oKSB7XG4gICAgdmFyIG91dCA9IHZvaWQgMCxcbiAgICAgICAgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyksXG4gICAgICAgIHJldHVyblZhbHVlID0gdm9pZCAwO1xuXG4gICAgaWYgKGlzTmFOKGlucHV0c1swXSkpIHtcbiAgICAgIF9nZW4uY2xvc3VyZXMuYWRkKF9kZWZpbmVQcm9wZXJ0eSh7fSwgJ2V4cCcsIE1hdGguZXhwKSk7XG5cbiAgICAgIG91dCA9ICcgIHZhciAnICsgdGhpcy5uYW1lICsgJyA9IGdlbi5leHAoIC02LjkwNzc1NTI3ODkyMSAvICcgKyBpbnB1dHNbMF0gKyAnIClcXG5cXG4nO1xuXG4gICAgICBfZ2VuLm1lbW9bdGhpcy5uYW1lXSA9IG91dDtcblxuICAgICAgcmV0dXJuVmFsdWUgPSBbdGhpcy5uYW1lLCBvdXRdO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgPSBNYXRoLmV4cCgtNi45MDc3NTUyNzg5MjEgLyBpbnB1dHNbMF0pO1xuXG4gICAgICByZXR1cm5WYWx1ZSA9IG91dDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgpIHtcbiAgdmFyIHQ2MCA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIHQ2MC5pbnB1dHMgPSBbeF07XG4gIHQ2MC5uYW1lID0gcHJvdG8uYmFzZW5hbWUgKyBfZ2VuLmdldFVJRCgpO1xuXG4gIHJldHVybiB0NjA7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9nZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpO1xuXG52YXIgcHJvdG8gPSB7XG4gIGJhc2VuYW1lOiAndGFuJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgb3V0ID0gdm9pZCAwLFxuICAgICAgICBpbnB1dHMgPSBfZ2VuLmdldElucHV0cyh0aGlzKTtcblxuICAgIGlmIChpc05hTihpbnB1dHNbMF0pKSB7XG4gICAgICBfZ2VuLmNsb3N1cmVzLmFkZCh7ICd0YW4nOiBNYXRoLnRhbiB9KTtcblxuICAgICAgb3V0ID0gJ2dlbi50YW4oICcgKyBpbnB1dHNbMF0gKyAnICknO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXQgPSBNYXRoLnRhbihwYXJzZUZsb2F0KGlucHV0c1swXSkpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgpIHtcbiAgdmFyIHRhbiA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIHRhbi5pbnB1dHMgPSBbeF07XG4gIHRhbi5pZCA9IF9nZW4uZ2V0VUlEKCk7XG4gIHRhbi5uYW1lID0gdGFuLmJhc2VuYW1lICsgJ3t0YW4uaWR9JztcblxuICByZXR1cm4gdGFuO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKTtcblxudmFyIHByb3RvID0ge1xuICBiYXNlbmFtZTogJ3RhbmgnLFxuXG4gIGdlbjogZnVuY3Rpb24gZ2VuKCkge1xuICAgIHZhciBvdXQgPSB2b2lkIDAsXG4gICAgICAgIGlucHV0cyA9IF9nZW4uZ2V0SW5wdXRzKHRoaXMpO1xuXG4gICAgaWYgKGlzTmFOKGlucHV0c1swXSkpIHtcbiAgICAgIF9nZW4uY2xvc3VyZXMuYWRkKHsgJ3RhbmgnOiBNYXRoLnRhbmggfSk7XG5cbiAgICAgIG91dCA9ICdnZW4udGFuaCggJyArIGlucHV0c1swXSArICcgKSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dCA9IE1hdGgudGFuaChwYXJzZUZsb2F0KGlucHV0c1swXSkpO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgpIHtcbiAgdmFyIHRhbmggPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcblxuICB0YW5oLmlucHV0cyA9IFt4XTtcbiAgdGFuaC5pZCA9IF9nZW4uZ2V0VUlEKCk7XG4gIHRhbmgubmFtZSA9IHRhbmguYmFzZW5hbWUgKyAne3RhbmguaWR9JztcblxuICByZXR1cm4gdGFuaDtcbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2VuID0gcmVxdWlyZSgnLi9nZW4uanMnKSxcbiAgICBsdCA9IHJlcXVpcmUoJy4vbHQuanMnKSxcbiAgICBwaGFzb3IgPSByZXF1aXJlKCcuL3BoYXNvci5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZyZXF1ZW5jeSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IDQ0MCA6IGFyZ3VtZW50c1swXTtcbiAgdmFyIHB1bHNld2lkdGggPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAuNSA6IGFyZ3VtZW50c1sxXTtcblxuICB2YXIgZ3JhcGggPSBsdChhY2N1bShkaXYoZnJlcXVlbmN5LCA0NDEwMCkpLCAuNSk7XG5cbiAgZ3JhcGgubmFtZSA9ICd0cmFpbicgKyBnZW4uZ2V0VUlEKCk7XG5cbiAgcmV0dXJuIGdyYXBoO1xufTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBnZW4gPSByZXF1aXJlKCcuL2dlbi5qcycpLFxuICAgIGRhdGEgPSByZXF1aXJlKCcuL2RhdGEuanMnKTtcblxudmFyIGlzU3RlcmVvID0gZmFsc2U7XG5cbnZhciB1dGlsaXRpZXMgPSB7XG4gIGN0eDogbnVsbCxcblxuICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgdGhpcy5jYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH07XG4gICAgdGhpcy5jbGVhci5jYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgICAgcmV0dXJuIHYoKTtcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyLmNhbGxiYWNrcy5sZW5ndGggPSAwO1xuICB9LFxuICBjcmVhdGVDb250ZXh0OiBmdW5jdGlvbiBjcmVhdGVDb250ZXh0KCkge1xuICAgIHZhciBBQyA9IHR5cGVvZiBBdWRpb0NvbnRleHQgPT09ICd1bmRlZmluZWQnID8gd2Via2l0QXVkaW9Db250ZXh0IDogQXVkaW9Db250ZXh0O1xuICAgIHRoaXMuY3R4ID0gbmV3IEFDKCk7XG4gICAgZ2VuLnNhbXBsZXJhdGUgPSB0aGlzLmN0eC5zYW1wbGVSYXRlO1xuXG4gICAgdmFyIHN0YXJ0ID0gZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICBpZiAodHlwZW9mIEFDICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAoZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgc3RhcnQpO1xuXG4gICAgICAgICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgICAgICAgICAgLy8gcmVxdWlyZWQgdG8gc3RhcnQgYXVkaW8gdW5kZXIgaU9TIDZcbiAgICAgICAgICAgIHZhciBteVNvdXJjZSA9IHV0aWxpdGllcy5jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgICAgICBteVNvdXJjZS5jb25uZWN0KHV0aWxpdGllcy5jdHguZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgbXlTb3VyY2Uubm90ZU9uKDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBzdGFydCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGNyZWF0ZVNjcmlwdFByb2Nlc3NvcjogZnVuY3Rpb24gY3JlYXRlU2NyaXB0UHJvY2Vzc29yKCkge1xuICAgIHRoaXMubm9kZSA9IHRoaXMuY3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcigxMDI0LCAwLCAyKSwgdGhpcy5jbGVhckZ1bmN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSwgdGhpcy5jYWxsYmFjayA9IHRoaXMuY2xlYXJGdW5jdGlvbjtcblxuICAgIHRoaXMubm9kZS5vbmF1ZGlvcHJvY2VzcyA9IGZ1bmN0aW9uIChhdWRpb1Byb2Nlc3NpbmdFdmVudCkge1xuICAgICAgdmFyIG91dHB1dEJ1ZmZlciA9IGF1ZGlvUHJvY2Vzc2luZ0V2ZW50Lm91dHB1dEJ1ZmZlcjtcblxuICAgICAgdmFyIGxlZnQgPSBvdXRwdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCksXG4gICAgICAgICAgcmlnaHQgPSBvdXRwdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMSk7XG5cbiAgICAgIGZvciAodmFyIHNhbXBsZSA9IDA7IHNhbXBsZSA8IGxlZnQubGVuZ3RoOyBzYW1wbGUrKykge1xuICAgICAgICBpZiAoIWlzU3RlcmVvKSB7XG4gICAgICAgICAgbGVmdFtzYW1wbGVdID0gcmlnaHRbc2FtcGxlXSA9IHV0aWxpdGllcy5jYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBvdXQgPSB1dGlsaXRpZXMuY2FsbGJhY2soKTtcbiAgICAgICAgICBsZWZ0W3NhbXBsZV0gPSBvdXRbMF07XG4gICAgICAgICAgcmlnaHRbc2FtcGxlXSA9IG91dFsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLm5vZGUuY29ubmVjdCh0aGlzLmN0eC5kZXN0aW5hdGlvbik7XG5cbiAgICAvL3RoaXMubm9kZS5jb25uZWN0KCB0aGlzLmFuYWx5emVyIClcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBwbGF5R3JhcGg6IGZ1bmN0aW9uIHBsYXlHcmFwaChncmFwaCwgZGVidWcpIHtcbiAgICB2YXIgbWVtID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gNDQxMDAgKiAxMCA6IGFyZ3VtZW50c1syXTtcblxuICAgIHV0aWxpdGllcy5jbGVhcigpO1xuICAgIGlmIChkZWJ1ZyA9PT0gdW5kZWZpbmVkKSBkZWJ1ZyA9IGZhbHNlO1xuXG4gICAgaXNTdGVyZW8gPSBBcnJheS5pc0FycmF5KGdyYXBoKTtcblxuICAgIHV0aWxpdGllcy5jYWxsYmFjayA9IGdlbi5jcmVhdGVDYWxsYmFjayhncmFwaCwgbWVtLCBkZWJ1Zyk7XG5cbiAgICBpZiAodXRpbGl0aWVzLmNvbnNvbGUpIHV0aWxpdGllcy5jb25zb2xlLnNldFZhbHVlKHV0aWxpdGllcy5jYWxsYmFjay50b1N0cmluZygpKTtcblxuICAgIHJldHVybiB1dGlsaXRpZXMuY2FsbGJhY2s7XG4gIH0sXG4gIGxvYWRTYW1wbGU6IGZ1bmN0aW9uIGxvYWRTYW1wbGUoc291bmRGaWxlUGF0aCwgZGF0YSkge1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbignR0VUJywgc291bmRGaWxlUGF0aCwgdHJ1ZSk7XG4gICAgcmVxLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlcS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhdWRpb0RhdGEgPSByZXEucmVzcG9uc2U7XG5cbiAgICAgICAgdXRpbGl0aWVzLmN0eC5kZWNvZGVBdWRpb0RhdGEoYXVkaW9EYXRhLCBmdW5jdGlvbiAoYnVmZmVyKSB7XG4gICAgICAgICAgZGF0YS5idWZmZXIgPSBidWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG4gICAgICAgICAgcmVzb2x2ZShkYXRhLmJ1ZmZlcik7XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJlcS5zZW5kKCk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxufTtcblxudXRpbGl0aWVzLmNsZWFyLmNhbGxiYWNrcyA9IFtdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHV0aWxpdGllczsiLCIndXNlIHN0cmljdCc7XG5cbi8qXG4gKiBtYW55IHdpbmRvd3MgaGVyZSBhZGFwdGVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2NvcmJhbmJyb29rL2RzcC5qcy9ibG9iL21hc3Rlci9kc3AuanNcbiAqIHN0YXJ0aW5nIGF0IGxpbmUgMTQyN1xuICogdGFrZW4gOC8xNS8xNlxuKi9cblxudmFyIHdpbmRvd3MgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgYmFydGxldHQ6IGZ1bmN0aW9uIGJhcnRsZXR0KGxlbmd0aCwgaW5kZXgpIHtcbiAgICByZXR1cm4gMiAvIChsZW5ndGggLSAxKSAqICgobGVuZ3RoIC0gMSkgLyAyIC0gTWF0aC5hYnMoaW5kZXggLSAobGVuZ3RoIC0gMSkgLyAyKSk7XG4gIH0sXG4gIGJhcnRsZXR0SGFubjogZnVuY3Rpb24gYmFydGxldHRIYW5uKGxlbmd0aCwgaW5kZXgpIHtcbiAgICByZXR1cm4gMC42MiAtIDAuNDggKiBNYXRoLmFicyhpbmRleCAvIChsZW5ndGggLSAxKSAtIDAuNSkgLSAwLjM4ICogTWF0aC5jb3MoMiAqIE1hdGguUEkgKiBpbmRleCAvIChsZW5ndGggLSAxKSk7XG4gIH0sXG4gIGJsYWNrbWFuOiBmdW5jdGlvbiBibGFja21hbihsZW5ndGgsIGluZGV4LCBhbHBoYSkge1xuICAgIHZhciBhMCA9ICgxIC0gYWxwaGEpIC8gMixcbiAgICAgICAgYTEgPSAwLjUsXG4gICAgICAgIGEyID0gYWxwaGEgLyAyO1xuXG4gICAgcmV0dXJuIGEwIC0gYTEgKiBNYXRoLmNvcygyICogTWF0aC5QSSAqIGluZGV4IC8gKGxlbmd0aCAtIDEpKSArIGEyICogTWF0aC5jb3MoNCAqIE1hdGguUEkgKiBpbmRleCAvIChsZW5ndGggLSAxKSk7XG4gIH0sXG4gIGNvc2luZTogZnVuY3Rpb24gY29zaW5lKGxlbmd0aCwgaW5kZXgpIHtcbiAgICByZXR1cm4gTWF0aC5jb3MoTWF0aC5QSSAqIGluZGV4IC8gKGxlbmd0aCAtIDEpIC0gTWF0aC5QSSAvIDIpO1xuICB9LFxuICBnYXVzczogZnVuY3Rpb24gZ2F1c3MobGVuZ3RoLCBpbmRleCwgYWxwaGEpIHtcbiAgICByZXR1cm4gTWF0aC5wb3coTWF0aC5FLCAtMC41ICogTWF0aC5wb3coKGluZGV4IC0gKGxlbmd0aCAtIDEpIC8gMikgLyAoYWxwaGEgKiAobGVuZ3RoIC0gMSkgLyAyKSwgMikpO1xuICB9LFxuICBoYW1taW5nOiBmdW5jdGlvbiBoYW1taW5nKGxlbmd0aCwgaW5kZXgpIHtcbiAgICByZXR1cm4gMC41NCAtIDAuNDYgKiBNYXRoLmNvcyhNYXRoLlBJICogMiAqIGluZGV4IC8gKGxlbmd0aCAtIDEpKTtcbiAgfSxcbiAgaGFubjogZnVuY3Rpb24gaGFubihsZW5ndGgsIGluZGV4KSB7XG4gICAgcmV0dXJuIDAuNSAqICgxIC0gTWF0aC5jb3MoTWF0aC5QSSAqIDIgKiBpbmRleCAvIChsZW5ndGggLSAxKSkpO1xuICB9LFxuICBsYW5jem9zOiBmdW5jdGlvbiBsYW5jem9zKGxlbmd0aCwgaW5kZXgpIHtcbiAgICB2YXIgeCA9IDIgKiBpbmRleCAvIChsZW5ndGggLSAxKSAtIDE7XG4gICAgcmV0dXJuIE1hdGguc2luKE1hdGguUEkgKiB4KSAvIChNYXRoLlBJICogeCk7XG4gIH0sXG4gIHJlY3Rhbmd1bGFyOiBmdW5jdGlvbiByZWN0YW5ndWxhcihsZW5ndGgsIGluZGV4KSB7XG4gICAgcmV0dXJuIDE7XG4gIH0sXG4gIHRyaWFuZ3VsYXI6IGZ1bmN0aW9uIHRyaWFuZ3VsYXIobGVuZ3RoLCBpbmRleCkge1xuICAgIHJldHVybiAyIC8gbGVuZ3RoICogKGxlbmd0aCAvIDIgLSBNYXRoLmFicyhpbmRleCAtIChsZW5ndGggLSAxKSAvIDIpKTtcbiAgfSxcblxuXG4gIC8vIHBhcmFib2xhXG4gIHdlbGNoOiBmdW5jdGlvbiB3ZWxjaChsZW5ndGgsIF9pbmRleCwgaWdub3JlLCBzaGlmdCkge1xuICAgIC8vd1tuXSA9IDEgLSBNYXRoLnBvdyggKCBuIC0gKCAoTi0xKSAvIDIgKSApIC8gKCggTi0xICkgLyAyICksIDIgKVxuICAgIHZhciBpbmRleCA9IHNoaWZ0ID09PSAwID8gX2luZGV4IDogKF9pbmRleCArIE1hdGguZmxvb3Ioc2hpZnQgKiBsZW5ndGgpKSAlIGxlbmd0aDtcbiAgICB2YXIgbl8xX292ZXIyID0gKGxlbmd0aCAtIDEpIC8gMjtcblxuICAgIHJldHVybiAxIC0gTWF0aC5wb3coKGluZGV4IC0gbl8xX292ZXIyKSAvIG5fMV9vdmVyMiwgMik7XG4gIH0sXG4gIGludmVyc2V3ZWxjaDogZnVuY3Rpb24gaW52ZXJzZXdlbGNoKGxlbmd0aCwgX2luZGV4LCBpZ25vcmUpIHtcbiAgICB2YXIgc2hpZnQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDMgfHwgYXJndW1lbnRzWzNdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzNdO1xuXG4gICAgLy93W25dID0gMSAtIE1hdGgucG93KCAoIG4gLSAoIChOLTEpIC8gMiApICkgLyAoKCBOLTEgKSAvIDIgKSwgMiApXG4gICAgdmFyIGluZGV4ID0gc2hpZnQgPT09IDAgPyBfaW5kZXggOiAoX2luZGV4ICsgTWF0aC5mbG9vcihzaGlmdCAqIGxlbmd0aCkpICUgbGVuZ3RoO1xuICAgIHZhciBuXzFfb3ZlcjIgPSAobGVuZ3RoIC0gMSkgLyAyO1xuXG4gICAgcmV0dXJuIE1hdGgucG93KChpbmRleCAtIG5fMV9vdmVyMikgLyBuXzFfb3ZlcjIsIDIpO1xuICB9LFxuICBwYXJhYm9sYTogZnVuY3Rpb24gcGFyYWJvbGEobGVuZ3RoLCBpbmRleCkge1xuICAgIGlmIChpbmRleCA8PSBsZW5ndGggLyAyKSB7XG4gICAgICByZXR1cm4gd2luZG93cy5pbnZlcnNld2VsY2gobGVuZ3RoIC8gMiwgaW5kZXgpIC0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDEgLSB3aW5kb3dzLmludmVyc2V3ZWxjaChsZW5ndGggLyAyLCBpbmRleCAtIGxlbmd0aCAvIDIpO1xuICAgIH1cbiAgfSxcbiAgZXhwb25lbnRpYWw6IGZ1bmN0aW9uIGV4cG9uZW50aWFsKGxlbmd0aCwgaW5kZXgsIGFscGhhKSB7XG4gICAgcmV0dXJuIE1hdGgucG93KGluZGV4IC8gbGVuZ3RoLCBhbHBoYSk7XG4gIH0sXG4gIGxpbmVhcjogZnVuY3Rpb24gbGluZWFyKGxlbmd0aCwgaW5kZXgpIHtcbiAgICByZXR1cm4gaW5kZXggLyBsZW5ndGg7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2dlbiA9IHJlcXVpcmUoJy4vZ2VuLmpzJyksXG4gICAgZmxvb3IgPSByZXF1aXJlKCcuL2Zsb29yLmpzJyksXG4gICAgc3ViID0gcmVxdWlyZSgnLi9zdWIuanMnKSxcbiAgICBtZW1vID0gcmVxdWlyZSgnLi9tZW1vLmpzJyk7XG5cbnZhciBwcm90byA9IHtcbiAgYmFzZW5hbWU6ICd3cmFwJyxcblxuICBnZW46IGZ1bmN0aW9uIGdlbigpIHtcbiAgICB2YXIgY29kZSA9IHZvaWQgMCxcbiAgICAgICAgaW5wdXRzID0gX2dlbi5nZXRJbnB1dHModGhpcyksXG4gICAgICAgIHNpZ25hbCA9IGlucHV0c1swXSxcbiAgICAgICAgbWluID0gaW5wdXRzWzFdLFxuICAgICAgICBtYXggPSBpbnB1dHNbMl0sXG4gICAgICAgIG91dCA9IHZvaWQgMCxcbiAgICAgICAgZGlmZiA9IHZvaWQgMDtcblxuICAgIC8vb3V0ID0gYCgoKCR7aW5wdXRzWzBdfSAtICR7dGhpcy5taW59KSAlICR7ZGlmZn0gICsgJHtkaWZmfSkgJSAke2RpZmZ9ICsgJHt0aGlzLm1pbn0pYFxuICAgIC8vY29uc3QgbG9uZyBudW1XcmFwcyA9IGxvbmcoKHYtbG8pL3JhbmdlKSAtICh2IDwgbG8pO1xuICAgIC8vcmV0dXJuIHYgLSByYW5nZSAqIGRvdWJsZShudW1XcmFwcyk7ICBcblxuICAgIGlmICh0aGlzLm1pbiA9PT0gMCkge1xuICAgICAgZGlmZiA9IG1heDtcbiAgICB9IGVsc2UgaWYgKGlzTmFOKG1heCkgfHwgaXNOYU4obWluKSkge1xuICAgICAgZGlmZiA9IG1heCArICcgLSAnICsgbWluO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaWZmID0gbWF4IC0gbWluO1xuICAgIH1cblxuICAgIG91dCA9ICcgdmFyICcgKyB0aGlzLm5hbWUgKyAnID0gJyArIGlucHV0c1swXSArICdcXG4gIGlmKCAnICsgdGhpcy5uYW1lICsgJyA8ICcgKyB0aGlzLm1pbiArICcgKSAnICsgdGhpcy5uYW1lICsgJyArPSAnICsgZGlmZiArICdcXG4gIGVsc2UgaWYoICcgKyB0aGlzLm5hbWUgKyAnID4gJyArIHRoaXMubWF4ICsgJyApICcgKyB0aGlzLm5hbWUgKyAnIC09ICcgKyBkaWZmICsgJ1xcblxcbic7XG5cbiAgICByZXR1cm4gW3RoaXMubmFtZSwgJyAnICsgb3V0XTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW4xKSB7XG4gIHZhciBtaW4gPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyAwIDogYXJndW1lbnRzWzFdO1xuICB2YXIgbWF4ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gMSA6IGFyZ3VtZW50c1syXTtcblxuICB2YXIgdWdlbiA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuXG4gIE9iamVjdC5hc3NpZ24odWdlbiwge1xuICAgIG1pbjogbWluLFxuICAgIG1heDogbWF4LFxuICAgIHVpZDogX2dlbi5nZXRVSUQoKSxcbiAgICBpbnB1dHM6IFtpbjEsIG1pbiwgbWF4XVxuICB9KTtcblxuICB1Z2VuLm5hbWUgPSAnJyArIHVnZW4uYmFzZW5hbWUgKyB1Z2VuLnVpZDtcblxuICByZXR1cm4gdWdlbjtcbn07IiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBNZW1vcnlIZWxwZXIgPSB7XG4gIGNyZWF0ZSggc2l6ZU9yQnVmZmVyPTQwOTYsIG1lbXR5cGU9RmxvYXQzMkFycmF5ICkge1xuICAgIGxldCBoZWxwZXIgPSBPYmplY3QuY3JlYXRlKCB0aGlzIClcblxuICAgIC8vIGNvbnZlbmllbnRseSwgYnVmZmVyIGNvbnN0cnVjdG9ycyBhY2NlcHQgZWl0aGVyIGEgc2l6ZSBvciBhbiBhcnJheSBidWZmZXIgdG8gdXNlLi4uXG4gICAgLy8gc28sIG5vIG1hdHRlciB3aGljaCBpcyBwYXNzZWQgdG8gc2l6ZU9yQnVmZmVyIGl0IHNob3VsZCB3b3JrLlxuICAgIE9iamVjdC5hc3NpZ24oIGhlbHBlciwge1xuICAgICAgaGVhcDogbmV3IG1lbXR5cGUoIHNpemVPckJ1ZmZlciApLFxuICAgICAgbGlzdDoge30sXG4gICAgICBmcmVlTGlzdDoge31cbiAgICB9KVxuXG4gICAgcmV0dXJuIGhlbHBlclxuICB9LFxuXG4gIGFsbG9jKCBzaXplLCBpbW11dGFibGUgKSB7XG4gICAgbGV0IGlkeCA9IC0xXG5cbiAgICBpZiggc2l6ZSA+IHRoaXMuaGVhcC5sZW5ndGggKSB7XG4gICAgICB0aHJvdyBFcnJvciggJ0FsbG9jYXRpb24gcmVxdWVzdCBpcyBsYXJnZXIgdGhhbiBoZWFwIHNpemUgb2YgJyArIHRoaXMuaGVhcC5sZW5ndGggKVxuICAgIH1cblxuICAgIGZvciggbGV0IGtleSBpbiB0aGlzLmZyZWVMaXN0ICkge1xuICAgICAgbGV0IGNhbmRpZGF0ZSA9IHRoaXMuZnJlZUxpc3RbIGtleSBdXG5cbiAgICAgIGlmKCBjYW5kaWRhdGUuc2l6ZSA+PSBzaXplICkge1xuICAgICAgICBpZHggPSBrZXlcblxuICAgICAgICB0aGlzLmxpc3RbIGlkeCBdID0geyBzaXplLCBpbW11dGFibGUsIHJlZmVyZW5jZXM6MSB9XG5cbiAgICAgICAgaWYoIGNhbmRpZGF0ZS5zaXplICE9PSBzaXplICkge1xuICAgICAgICAgIGxldCBuZXdJbmRleCA9IGlkeCArIHNpemUsXG4gICAgICAgICAgICAgIG5ld0ZyZWVTaXplXG5cbiAgICAgICAgICBmb3IoIGxldCBrZXkgaW4gdGhpcy5saXN0ICkge1xuICAgICAgICAgICAgaWYoIGtleSA+IG5ld0luZGV4ICkge1xuICAgICAgICAgICAgICBuZXdGcmVlU2l6ZSA9IGtleSAtIG5ld0luZGV4XG4gICAgICAgICAgICAgIHRoaXMuZnJlZUxpc3RbIG5ld0luZGV4IF0gPSBuZXdGcmVlU2l6ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoIGlkeCAhPT0gLTEgKSBkZWxldGUgdGhpcy5mcmVlTGlzdFsgaWR4IF1cblxuICAgIGlmKCBpZHggPT09IC0xICkge1xuICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyggdGhpcy5saXN0ICksXG4gICAgICAgICAgbGFzdEluZGV4XG5cbiAgICAgIGlmKCBrZXlzLmxlbmd0aCApIHsgLy8gaWYgbm90IGZpcnN0IGFsbG9jYXRpb24uLi5cbiAgICAgICAgbGFzdEluZGV4ID0gcGFyc2VJbnQoIGtleXNbIGtleXMubGVuZ3RoIC0gMSBdIClcblxuICAgICAgICBpZHggPSBsYXN0SW5kZXggKyB0aGlzLmxpc3RbIGxhc3RJbmRleCBdLnNpemVcbiAgICAgIH1lbHNle1xuICAgICAgICBpZHggPSAwXG4gICAgICB9XG5cbiAgICAgIHRoaXMubGlzdFsgaWR4IF0gPSB7IHNpemUsIGltbXV0YWJsZSwgcmVmZXJlbmNlczoxIH1cbiAgICB9XG5cbiAgICBpZiggaWR4ICsgc2l6ZSA+PSB0aGlzLmhlYXAubGVuZ3RoICkge1xuICAgICAgdGhyb3cgRXJyb3IoICdObyBhdmFpbGFibGUgYmxvY2tzIHJlbWFpbiBzdWZmaWNpZW50IGZvciBhbGxvY2F0aW9uIHJlcXVlc3QuJyApXG4gICAgfVxuICAgIHJldHVybiBpZHhcbiAgfSxcblxuICBhZGRSZWZlcmVuY2UoIGluZGV4ICkge1xuICAgIGlmKCB0aGlzLmxpc3RbIGluZGV4IF0gIT09IHVuZGVmaW5lZCApIHsgXG4gICAgICB0aGlzLmxpc3RbIGluZGV4IF0ucmVmZXJlbmNlcysrXG4gICAgfVxuICB9LFxuXG4gIGZyZWUoIGluZGV4ICkge1xuICAgIGlmKCB0aGlzLmxpc3RbIGluZGV4IF0gPT09IHVuZGVmaW5lZCApIHtcbiAgICAgIHRocm93IEVycm9yKCAnQ2FsbGluZyBmcmVlKCkgb24gbm9uLWV4aXN0aW5nIGJsb2NrLicgKVxuICAgIH1cblxuICAgIGxldCBzbG90ID0gdGhpcy5saXN0WyBpbmRleCBdXG4gICAgaWYoIHNsb3QgPT09IDAgKSByZXR1cm5cbiAgICBzbG90LnJlZmVyZW5jZXMtLVxuXG4gICAgaWYoIHNsb3QucmVmZXJlbmNlcyA9PT0gMCAmJiBzbG90LmltbXV0YWJsZSAhPT0gdHJ1ZSApIHsgICAgXG4gICAgICB0aGlzLmxpc3RbIGluZGV4IF0gPSAwXG5cbiAgICAgIGxldCBmcmVlQmxvY2tTaXplID0gMFxuICAgICAgZm9yKCBsZXQga2V5IGluIHRoaXMubGlzdCApIHtcbiAgICAgICAgaWYoIGtleSA+IGluZGV4ICkge1xuICAgICAgICAgIGZyZWVCbG9ja1NpemUgPSBrZXkgLSBpbmRleFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5mcmVlTGlzdFsgaW5kZXggXSA9IGZyZWVCbG9ja1NpemVcbiAgICB9XG4gIH0sXG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVtb3J5SGVscGVyXG4iLCJsZXQgdWdlbiA9IHJlcXVpcmUoICcuLi91Z2VuLmpzJyApXG5cbmxldCBhbmFseXplciA9IE9iamVjdC5jcmVhdGUoIHVnZW4gKVxuXG5PYmplY3QuYXNzaWduKCBhbmFseXplciwge1xuICBfX3R5cGVfXzogJ2FuYWx5emVyJyxcbn0pXG5cbm1vZHVsZS5leHBvcnRzID0gYW5hbHl6ZXJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBjb25zdCBhbmFseXplcnMgPSB7XG4gICAgU1NEOiAgICByZXF1aXJlKCAnLi9zaW5nbGVzYW1wbGVkZWxheS5qcycgICkoIEdpYmJlcmlzaCApLFxuICAgIEZvbGxvdzogcmVxdWlyZSggJy4vZm9sbG93LmpzJyAgKSggR2liYmVyaXNoIClcbiAgfVxuXG4gIGFuYWx5emVycy5leHBvcnQgPSB0YXJnZXQgPT4ge1xuICAgIGZvciggbGV0IGtleSBpbiBhbmFseXplcnMgKSB7XG4gICAgICBpZigga2V5ICE9PSAnZXhwb3J0JyApIHtcbiAgICAgICAgdGFyZ2V0WyBrZXkgXSA9IGFuYWx5emVyc1sga2V5IF1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxucmV0dXJuIGFuYWx5emVyc1xuXG59XG4iLCJjb25zdCBnID0gcmVxdWlyZSgnZ2VuaXNoLmpzJyksXG4gICAgICBhbmFseXplciA9IHJlcXVpcmUoJy4vYW5hbHl6ZXIuanMnKSxcbiAgICAgIHVnZW4gPSByZXF1aXJlKCcuLi91Z2VuLmpzJyk7XG5cbmNvbnN0IGdlbmlzaCA9IGc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEdpYmJlcmlzaCkge1xuXG4gIGNvbnN0IEZvbGxvdyA9IGlucHV0UHJvcHMgPT4ge1xuXG4gICAgLy8gbWFpbiBmb2xsb3cgb2JqZWN0IGlzIGFsc28gdGhlIG91dHB1dFxuICAgIGNvbnN0IGZvbGxvdyA9IE9iamVjdC5jcmVhdGUoYW5hbHl6ZXIpO1xuICAgIGZvbGxvdy5pbiA9IE9iamVjdC5jcmVhdGUodWdlbik7XG4gICAgZm9sbG93LmlkID0gR2liYmVyaXNoLmZhY3RvcnkuZ2V0VUlEKCk7XG5cbiAgICBjb25zdCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIGlucHV0UHJvcHMsIEZvbGxvdy5kZWZhdWx0cyk7XG4gICAgbGV0IGlzU3RlcmVvID0gcHJvcHMuaW5wdXQuaXNTdGVyZW8gIT09IHVuZGVmaW5lZCA/IHByb3BzLmlucHV0LmlzU3RlcmVvIDogdHJ1ZTtcblxuICAgIC8vIHRoZSBpbnB1dCB0byB0aGUgZm9sbG93IHVnZW4gaXMgYnVmZmVyZWQgaW4gdGhpcyB1Z2VuXG4gICAgZm9sbG93LmJ1ZmZlciA9IGcuZGF0YShwcm9wcy5idWZmZXJTaXplLCAxKTtcblxuICAgIGxldCBhdmc7IC8vIG91dHB1dDsgbWFrZSBhdmFpbGFibGUgb3V0c2lkZSBqc2RzcCBibG9ja1xuICAgIGNvbnN0IF9pbnB1dCA9IGcuaW4oJ2lucHV0Jyk7XG4gICAgY29uc3QgaW5wdXQgPSBpc1N0ZXJlbyA/IGcuYWRkKF9pbnB1dFswXSwgX2lucHV0WzFdKSA6IF9pbnB1dDtcblxuICAgIHtcbiAgICAgIFwidXNlIGpzZHNwXCI7XG4gICAgICAvLyBwaGFzZSB0byB3cml0ZSB0byBmb2xsb3cgYnVmZmVyXG4gICAgICBjb25zdCBidWZmZXJQaGFzZU91dCA9IGcuYWNjdW0oMSwgMCwgeyBtYXg6IHByb3BzLmJ1ZmZlclNpemUsIG1pbjogMCB9KTtcblxuICAgICAgLy8gaG9sZCBydW5uaW5nIHN1bVxuICAgICAgY29uc3Qgc3VtID0gZy5kYXRhKDEsIDEsIHsgbWV0YTogdHJ1ZSB9KTtcblxuICAgICAgc3VtWzBdID0gZ2VuaXNoLnN1YihnZW5pc2guYWRkKHN1bVswXSwgaW5wdXQpLCBnLnBlZWsoZm9sbG93LmJ1ZmZlciwgYnVmZmVyUGhhc2VPdXQsIHsgbW9kZTogJ3NpbXBsZScgfSkpO1xuXG4gICAgICBhdmcgPSBnZW5pc2guZGl2KHN1bVswXSwgcHJvcHMuYnVmZmVyU2l6ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFpc1N0ZXJlbykge1xuICAgICAgR2liYmVyaXNoLmZhY3RvcnkoZm9sbG93LCBhdmcsICdmb2xsb3dfb3V0JywgcHJvcHMpO1xuXG4gICAgICBmb2xsb3cuY2FsbGJhY2sudWdlbk5hbWUgPSBmb2xsb3cudWdlbk5hbWUgPSBgZm9sbG93X291dF8keyBmb2xsb3cuaWQgfWA7XG5cbiAgICAgIC8vIGhhdmUgdG8gd3JpdGUgY3VzdG9tIGNhbGxiYWNrIGZvciBpbnB1dCB0byByZXVzZSBjb21wb25lbnRzIGZyb20gb3V0cHV0LFxuICAgICAgLy8gc3BlY2lmaWNhbGx5IHRoZSBtZW1vcnkgZnJvbSBvdXIgYnVmZmVyXG4gICAgICBsZXQgaWR4ID0gZm9sbG93LmJ1ZmZlci5tZW1vcnkudmFsdWVzLmlkeDtcbiAgICAgIGxldCBwaGFzZSA9IDA7XG4gICAgICBsZXQgYWJzID0gTWF0aC5hYnM7XG4gICAgICBsZXQgY2FsbGJhY2sgPSBmdW5jdGlvbiAoaW5wdXQsIG1lbW9yeSkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG5cbiAgICAgICAgbWVtb3J5W2lkeCArIHBoYXNlXSA9IGFicyhpbnB1dCk7XG4gICAgICAgIHBoYXNlKys7XG4gICAgICAgIGlmIChwaGFzZSA+IHByb3BzLmJ1ZmZlclNpemUgLSAxKSB7XG4gICAgICAgICAgcGhhc2UgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9O1xuXG4gICAgICBHaWJiZXJpc2guZmFjdG9yeShmb2xsb3cuaW4sIGlucHV0LCAnZm9sbG93X2luJywgcHJvcHMsIGNhbGxiYWNrKTtcblxuICAgICAgLy8gbG90cyBvZiBub25zZW5zZSB0byBtYWtlIG91ciBjdXN0b20gZnVuY3Rpb24gd29ya1xuICAgICAgZm9sbG93LmluLmNhbGxiYWNrLnVnZW5OYW1lID0gZm9sbG93LmluLnVnZW5OYW1lID0gYGZvbGxvd19pbl8keyBmb2xsb3cuaWQgfWA7XG4gICAgICBmb2xsb3cuaW4uaW5wdXROYW1lcyA9IFsnaW5wdXQnXTtcbiAgICAgIGZvbGxvdy5pbi5pbnB1dHMgPSBbaW5wdXRdO1xuICAgICAgZm9sbG93LmluLmlucHV0ID0gcHJvcHMuaW5wdXQ7XG4gICAgICBmb2xsb3cuaW4udHlwZSA9ICdhbmFseXNpcyc7XG5cbiAgICAgIGlmIChHaWJiZXJpc2guYW5hbHl6ZXJzLmluZGV4T2YoZm9sbG93LmluKSA9PT0gLTEpIHtcbiAgICAgICAgR2liYmVyaXNoLmFuYWx5emVycy5wdXNoKGZvbGxvdy5pbik7XG4gICAgICB9XG5cbiAgICAgIEdpYmJlcmlzaC5kaXJ0eShHaWJiZXJpc2guYW5hbHl6ZXJzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm9sbG93O1xuICB9O1xuXG4gIEZvbGxvdy5kZWZhdWx0cyA9IHtcbiAgICBidWZmZXJTaXplOiA4MTkyXG4gIH07XG5cbiAgcmV0dXJuIEZvbGxvdztcbn07IiwibGV0IGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApLFxuICAgIGFuYWx5emVyID0gcmVxdWlyZSggJy4vYW5hbHl6ZXIuanMnICksXG4gICAgdWdlbiA9IHJlcXVpcmUoICcuLi91Z2VuLmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcbiBcbmxldCBEZWxheSA9IGlucHV0UHJvcHMgPT4ge1xuICBsZXQgc3NkID0gT2JqZWN0LmNyZWF0ZSggYW5hbHl6ZXIgKVxuICBzc2QuaW4gID0gT2JqZWN0LmNyZWF0ZSggdWdlbiApXG4gIHNzZC5vdXQgPSBPYmplY3QuY3JlYXRlKCB1Z2VuIClcblxuICBzc2QuaWQgPSBHaWJiZXJpc2guZmFjdG9yeS5nZXRVSUQoKVxuXG4gIGxldCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIGlucHV0UHJvcHMgKVxuICBsZXQgaXNTdGVyZW8gPSBmYWxzZS8vcHJvcHMuaW5wdXQuaXNTdGVyZW8gIT09IHVuZGVmaW5lZCA/IHByb3BzLmlucHV0LmlzU3RlcmVvIDogdHJ1ZSBcbiAgXG4gIGxldCBpbnB1dCA9IGcuaW4oICdpbnB1dCcgKVxuICAgIFxuICBsZXQgaGlzdG9yeUwgPSBnLmhpc3RvcnkoKVxuXG4gIGlmKCBpc1N0ZXJlbyApIHtcbiAgICAvLyByaWdodCBjaGFubmVsXG4gICAgbGV0IGhpc3RvcnlSID0gZy5oaXN0b3J5KClcblxuICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBcbiAgICAgIHNzZC5vdXQsXG4gICAgICBbIGhpc3RvcnlMLm91dCwgaGlzdG9yeVIub3V0IF0sIFxuICAgICAgJ3NzZF9vdXQnLCBcbiAgICAgIHByb3BzIFxuICAgIClcblxuICAgIHNzZC5vdXQuY2FsbGJhY2sudWdlbk5hbWUgPSBzc2Qub3V0LnVnZW5OYW1lID0gJ3NzZF9vdXRfJyArIHNzZC5pZFxuXG4gICAgY29uc3QgaWR4TCA9IHNzZC5vdXQuZ3JhcGgubWVtb3J5LnZhbHVlLmlkeCwgXG4gICAgICAgICAgaWR4UiA9IGlkeEwgKyAxLFxuICAgICAgICAgIG1lbW9yeSA9IEdpYmJlcmlzaC5nZW5pc2guZ2VuLm1lbW9yeS5oZWFwXG5cbiAgICBjb25zdCBjYWxsYmFjayA9IGZ1bmN0aW9uKCBpbnB1dCApIHtcbiAgICAgICd1c2Ugc3RyaWN0J1xuICAgICAgbWVtb3J5WyBpZHhMIF0gPSBpbnB1dFswXVxuICAgICAgbWVtb3J5WyBpZHhSIF0gPSBpbnB1dFsxXVxuICAgICAgcmV0dXJuIDAgICAgIFxuICAgIH1cbiAgICBcbiAgICBHaWJiZXJpc2guZmFjdG9yeSggc3NkLmluLCBbIGlucHV0WzBdLGlucHV0WzFdIF0sICdzc2RfaW4nLCBwcm9wcywgY2FsbGJhY2sgKVxuXG4gICAgY2FsbGJhY2sudWdlbk5hbWUgPSBzc2QuaW4udWdlbk5hbWUgPSAnc3NkX2luXycgKyBzc2QuaWRcbiAgICBzc2QuaW4uaW5wdXROYW1lcyA9IFsgJ2lucHV0JyBdXG4gICAgc3NkLmluLmlucHV0cyA9IFsgcHJvcHMuaW5wdXQgXVxuICAgIHNzZC5pbi5pbnB1dCA9IHByb3BzLmlucHV0XG4gICAgc3NkLnR5cGUgPSAnYW5hbHlzaXMnXG5cbiAgICBzc2QuaW4ubGlzdGVuID0gZnVuY3Rpb24oIHVnZW4gKSB7XG4gICAgICBpZiggdWdlbiAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICBzc2QuaW4uaW5wdXQgPSB1Z2VuXG4gICAgICAgIHNzZC5pbi5pbnB1dHMgPSBbIHVnZW4gXVxuICAgICAgfVxuXG4gICAgICBpZiggR2liYmVyaXNoLmFuYWx5emVycy5pbmRleE9mKCBzc2QuaW4gKSA9PT0gLTEgKSB7XG4gICAgICAgIEdpYmJlcmlzaC5hbmFseXplcnMucHVzaCggc3NkLmluIClcbiAgICAgIH1cblxuICAgICAgR2liYmVyaXNoLmRpcnR5KCBHaWJiZXJpc2guYW5hbHl6ZXJzIClcbiAgICB9XG4gIH1lbHNle1xuICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBzc2Qub3V0LCBoaXN0b3J5TC5vdXQsICdzc2Rfb3V0JywgcHJvcHMgKVxuXG4gICAgc3NkLm91dC5jYWxsYmFjay51Z2VuTmFtZSA9IHNzZC5vdXQudWdlbk5hbWUgPSAnc3NkX291dF8nICsgc3NkLmlkXG5cbiAgICBsZXQgaWR4ID0gc3NkLm91dC5ncmFwaC5tZW1vcnkudmFsdWUuaWR4IFxuICAgIGxldCBtZW1vcnkgPSBHaWJiZXJpc2guZ2VuaXNoLmdlbi5tZW1vcnkuaGVhcFxuICAgIGxldCBjYWxsYmFjayA9IGZ1bmN0aW9uKCBpbnB1dCApIHtcbiAgICAgICd1c2Ugc3RyaWN0J1xuICAgICAgbWVtb3J5WyBpZHggXSA9IGlucHV0XG4gICAgICByZXR1cm4gMCAgICAgXG4gICAgfVxuICAgIFxuICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBzc2QuaW4sIGlucHV0LCAnc3NkX2luJywgcHJvcHMsIGNhbGxiYWNrIClcblxuICAgIGNhbGxiYWNrLnVnZW5OYW1lID0gc3NkLmluLnVnZW5OYW1lID0gJ3NzZF9pbl8nICsgc3NkLmlkXG4gICAgc3NkLmluLmlucHV0TmFtZXMgPSBbICdpbnB1dCcgXVxuICAgIHNzZC5pbi5pbnB1dHMgPSBbIHByb3BzLmlucHV0IF1cbiAgICBzc2QuaW4uaW5wdXQgPSBwcm9wcy5pbnB1dFxuICAgIHNzZC50eXBlID0gJ2FuYWx5c2lzJ1xuXG4gICAgc3NkLmluLmxpc3RlbiA9IGZ1bmN0aW9uKCB1Z2VuICkge1xuICAgICAgaWYoIHVnZW4gIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgc3NkLmluLmlucHV0ID0gdWdlblxuICAgICAgICBzc2QuaW4uaW5wdXRzID0gWyB1Z2VuIF1cbiAgICAgIH1cblxuICAgICAgaWYoIEdpYmJlcmlzaC5hbmFseXplcnMuaW5kZXhPZiggc3NkLmluICkgPT09IC0xICkge1xuICAgICAgICBHaWJiZXJpc2guYW5hbHl6ZXJzLnB1c2goIHNzZC5pbiApXG4gICAgICB9XG5cbiAgICAgIEdpYmJlcmlzaC5kaXJ0eSggR2liYmVyaXNoLmFuYWx5emVycyApXG4gICAgfVxuXG4gIH1cbiAgXG4gIHJldHVybiBzc2Rcbn1cblxuRGVsYXkuZGVmYXVsdHMgPSB7XG4gIGlucHV0OjAsXG59XG5cbnJldHVybiBEZWxheVxuXG59XG4iLCJsZXQgdWdlbiA9IHJlcXVpcmUoICcuLi91Z2VuLmpzJyApLFxuICAgIGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBsZXQgQUQgPSBmdW5jdGlvbiggYXJndW1lbnRQcm9wcyApIHtcbiAgICBsZXQgYWQgPSBPYmplY3QuY3JlYXRlKCB1Z2VuICksXG4gICAgICAgIGF0dGFjayAgPSBnLmluKCAnYXR0YWNrJyApLFxuICAgICAgICBkZWNheSAgID0gZy5pbiggJ2RlY2F5JyApXG5cbiAgICBsZXQgcHJvcHMgPSBPYmplY3QuYXNzaWduKCB7fSwgQUQuZGVmYXVsdHMsIGFyZ3VtZW50UHJvcHMgKVxuXG4gICAgbGV0IGdyYXBoID0gZy5hZCggYXR0YWNrLCBkZWNheSApXG5cbiAgICBHaWJiZXJpc2guZmFjdG9yeSggYWQsIGdyYXBoLCAnYWQnLCBwcm9wcyApXG5cbiAgICBhZC50cmlnZ2VyID0gZ3JhcGgudHJpZ2dlclxuXG4gICAgcmV0dXJuIGFkXG4gIH1cblxuICBBRC5kZWZhdWx0cyA9IHsgYXR0YWNrOjQ0MTAwLCBkZWNheTo0NDEwMCB9IFxuXG4gIHJldHVybiBBRFxuXG59XG4iLCJsZXQgdWdlbiA9IHJlcXVpcmUoICcuLi91Z2VuLmpzJyApLFxuICAgIGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBsZXQgQURTUiA9IGZ1bmN0aW9uKCBhcmd1bWVudFByb3BzICkge1xuICAgIGxldCBhZHNyICA9IE9iamVjdC5jcmVhdGUoIHVnZW4gKSxcbiAgICAgICAgYXR0YWNrICA9IGcuaW4oICdhdHRhY2snICksXG4gICAgICAgIGRlY2F5ICAgPSBnLmluKCAnZGVjYXknICksXG4gICAgICAgIHN1c3RhaW4gPSBnLmluKCAnc3VzdGFpbicgKSxcbiAgICAgICAgcmVsZWFzZSA9IGcuaW4oICdyZWxlYXNlJyApLFxuICAgICAgICBzdXN0YWluTGV2ZWwgPSBnLmluKCAnc3VzdGFpbkxldmVsJyApXG5cbiAgICBsZXQgcHJvcHMgPSBPYmplY3QuYXNzaWduKCB7fSwgQURTUi5kZWZhdWx0cywgYXJndW1lbnRQcm9wcyApXG5cbiAgICBsZXQgZ3JhcGggPSBnLmFkc3IoIGF0dGFjaywgZGVjYXksIHN1c3RhaW4sIHN1c3RhaW5MZXZlbCwgcmVsZWFzZSwgeyB0cmlnZ2VyUmVsZWFzZTogcHJvcHMudHJpZ2dlclJlbGVhc2UgfSApXG5cbiAgICBHaWJiZXJpc2guZmFjdG9yeSggYWRzciwgZ3JhcGgsICdhZHNyJywgcHJvcHMgKVxuXG4gICAgYWRzci50cmlnZ2VyID0gZ3JhcGgudHJpZ2dlclxuICAgIGFkc3IuYWR2YW5jZSA9IGdyYXBoLnJlbGVhc2VcblxuICAgIHJldHVybiBhZHNyXG4gIH1cblxuICBBRFNSLmRlZmF1bHRzID0geyBhdHRhY2s6MjIwNTAsIGRlY2F5OjIyMDUwLCBzdXN0YWluOjQ0MTAwLCBzdXN0YWluTGV2ZWw6LjYsIHJlbGVhc2U6IDQ0MTAwLCB0cmlnZ2VyUmVsZWFzZTpmYWxzZSB9IFxuXG4gIHJldHVybiBBRFNSXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG5cbiAgY29uc3QgRW52ZWxvcGVzID0ge1xuICAgIEFEICAgICA6IHJlcXVpcmUoICcuL2FkLmpzJyApKCBHaWJiZXJpc2ggKSxcbiAgICBBRFNSICAgOiByZXF1aXJlKCAnLi9hZHNyLmpzJyApKCBHaWJiZXJpc2ggKSxcbiAgICBSYW1wICAgOiByZXF1aXJlKCAnLi9yYW1wLmpzJyApKCBHaWJiZXJpc2ggKSxcblxuICAgIGV4cG9ydCA6IHRhcmdldCA9PiB7XG4gICAgICBmb3IoIGxldCBrZXkgaW4gRW52ZWxvcGVzICkge1xuICAgICAgICBpZigga2V5ICE9PSAnZXhwb3J0JyApIHtcbiAgICAgICAgICB0YXJnZXRbIGtleSBdID0gRW52ZWxvcGVzWyBrZXkgXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IFxuXG4gIHJldHVybiBFbnZlbG9wZXNcbn1cbiIsImNvbnN0IHVnZW4gPSByZXF1aXJlKCAnLi4vdWdlbi5qcycgKSxcbiAgICAgIGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBjb25zdCBSYW1wID0gZnVuY3Rpb24oIGFyZ3VtZW50UHJvcHMgKSB7XG4gICAgY29uc3QgcmFtcCAgID0gT2JqZWN0LmNyZWF0ZSggdWdlbiApLFxuICAgICAgICAgIGxlbmd0aCA9IGcuaW4oICdsZW5ndGgnICksXG4gICAgICAgICAgZnJvbSAgID0gZy5pbiggJ2Zyb20nICksXG4gICAgICAgICAgdG8gICAgID0gZy5pbiggJ3RvJyApXG5cbiAgICBjb25zdCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIFJhbXAuZGVmYXVsdHMsIGFyZ3VtZW50UHJvcHMgKVxuXG4gICAgY29uc3QgcmVzZXQgPSBnLmJhbmcoKVxuXG4gICAgY29uc3QgcGhhc2UgPSBnLmFjY3VtKCBnLmRpdiggMSwgbGVuZ3RoICksIHJlc2V0LCB7IHNob3VsZFdyYXA6cHJvcHMuc2hvdWxkTG9vcCwgc2hvdWxkQ2xhbXA6dHJ1ZSB9KSxcbiAgICAgICAgICBkaWZmID0gZy5zdWIoIHRvLCBmcm9tICksXG4gICAgICAgICAgZ3JhcGggPSBnLmFkZCggZnJvbSwgZy5tdWwoIHBoYXNlLCBkaWZmICkgKVxuXG4gICAgR2liYmVyaXNoLmZhY3RvcnkoIHJhbXAsIGdyYXBoLCAncmFtcCcsIHByb3BzIClcblxuICAgIHJhbXAudHJpZ2dlciA9IHJlc2V0LnRyaWdnZXJcblxuICAgIHJldHVybiByYW1wXG4gIH1cblxuICBSYW1wLmRlZmF1bHRzID0geyBmcm9tOjAsIHRvOjEsIGxlbmd0aDpnLmdlbi5zYW1wbGVyYXRlLCBzaG91bGRMb29wOmZhbHNlIH1cblxuICByZXR1cm4gUmFtcFxuXG59XG4iLCIvKlxuICogaHR0cHM6Ly9naXRodWIuY29tL2FudGltYXR0ZXIxNS9oZWFwcXVldWUuanMvYmxvYi9tYXN0ZXIvaGVhcHF1ZXVlLmpzXG4gKlxuICogVGhpcyBpbXBsZW1lbnRhdGlvbiBpcyB2ZXJ5IGxvb3NlbHkgYmFzZWQgb2ZmIGpzLXByaW9yaXR5LXF1ZXVlXG4gKiBieSBBZGFtIEhvb3BlciBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9hZGFtaG9vcGVyL2pzLXByaW9yaXR5LXF1ZXVlXG4gKlxuICogVGhlIGpzLXByaW9yaXR5LXF1ZXVlIGltcGxlbWVudGF0aW9uIHNlZW1lZCBhIHRlZW5zeSBiaXQgYmxvYXRlZFxuICogd2l0aCBpdHMgcmVxdWlyZS5qcyBkZXBlbmRlbmN5IGFuZCBtdWx0aXBsZSBzdG9yYWdlIHN0cmF0ZWdpZXNcbiAqIHdoZW4gYWxsIGJ1dCBvbmUgd2VyZSBzdHJvbmdseSBkaXNjb3VyYWdlZC4gU28gaGVyZSBpcyBhIGtpbmQgb2ZcbiAqIGNvbmRlbnNlZCB2ZXJzaW9uIG9mIHRoZSBmdW5jdGlvbmFsaXR5IHdpdGggb25seSB0aGUgZmVhdHVyZXMgdGhhdFxuICogSSBwYXJ0aWN1bGFybHkgbmVlZGVkLlxuICpcbiAqIFVzaW5nIGl0IGlzIHByZXR0eSBzaW1wbGUsIHlvdSBqdXN0IGNyZWF0ZSBhbiBpbnN0YW5jZSBvZiBIZWFwUXVldWVcbiAqIHdoaWxlIG9wdGlvbmFsbHkgc3BlY2lmeWluZyBhIGNvbXBhcmF0b3IgYXMgdGhlIGFyZ3VtZW50OlxuICpcbiAqIHZhciBoZWFwcSA9IG5ldyBIZWFwUXVldWUoKTtcbiAqXG4gKiB2YXIgY3VzdG9tcSA9IG5ldyBIZWFwUXVldWUoZnVuY3Rpb24oYSwgYil7XG4gKiAgIC8vIGlmIGIgPiBhLCByZXR1cm4gbmVnYXRpdmVcbiAqICAgLy8gbWVhbnMgdGhhdCBpdCBzcGl0cyBvdXQgdGhlIHNtYWxsZXN0IGl0ZW0gZmlyc3RcbiAqICAgcmV0dXJuIGEgLSBiO1xuICogfSk7XG4gKlxuICogTm90ZSB0aGF0IGluIHRoaXMgY2FzZSwgdGhlIGRlZmF1bHQgY29tcGFyYXRvciBpcyBpZGVudGljYWwgdG9cbiAqIHRoZSBjb21wYXJhdG9yIHdoaWNoIGlzIHVzZWQgZXhwbGljaXRseSBpbiB0aGUgc2Vjb25kIHF1ZXVlLlxuICpcbiAqIE9uY2UgeW91J3ZlIGluaXRpYWxpemVkIHRoZSBoZWFwcXVldWUsIHlvdSBjYW4gcGxvcCBzb21lIG5ld1xuICogZWxlbWVudHMgaW50byB0aGUgcXVldWUgd2l0aCB0aGUgcHVzaCBtZXRob2QgKHZhZ3VlbHkgcmVtaW5pc2NlbnRcbiAqIG9mIHR5cGljYWwgamF2YXNjcmlwdCBhcmF5cylcbiAqXG4gKiBoZWFwcS5wdXNoKDQyKTtcbiAqIGhlYXBxLnB1c2goXCJraXR0ZW5cIik7XG4gKlxuICogVGhlIHB1c2ggbWV0aG9kIHJldHVybnMgdGhlIG5ldyBudW1iZXIgb2YgZWxlbWVudHMgb2YgdGhlIHF1ZXVlLlxuICpcbiAqIFlvdSBjYW4gcHVzaCBhbnl0aGluZyB5b3UnZCBsaWtlIG9udG8gdGhlIHF1ZXVlLCBzbyBsb25nIGFzIHlvdXJcbiAqIGNvbXBhcmF0b3IgZnVuY3Rpb24gaXMgY2FwYWJsZSBvZiBoYW5kbGluZyBpdC4gVGhlIGRlZmF1bHRcbiAqIGNvbXBhcmF0b3IgaXMgcmVhbGx5IHN0dXBpZCBzbyBpdCB3b24ndCBiZSBhYmxlIHRvIGhhbmRsZSBhbnl0aGluZ1xuICogb3RoZXIgdGhhbiBhbiBudW1iZXIgYnkgZGVmYXVsdC5cbiAqXG4gKiBZb3UgY2FuIHByZXZpZXcgdGhlIHNtYWxsZXN0IGl0ZW0gYnkgdXNpbmcgcGVlay5cbiAqXG4gKiBoZWFwcS5wdXNoKC05OTk5KTtcbiAqIGhlYXBxLnBlZWsoKTsgLy8gPT0+IC05OTk5XG4gKlxuICogVGhlIHVzZWZ1bCBjb21wbGVtZW50IHRvIHRvIHRoZSBwdXNoIG1ldGhvZCBpcyB0aGUgcG9wIG1ldGhvZCxcbiAqIHdoaWNoIHJldHVybnMgdGhlIHNtYWxsZXN0IGl0ZW0gYW5kIHRoZW4gcmVtb3ZlcyBpdCBmcm9tIHRoZVxuICogcXVldWUuXG4gKlxuICogaGVhcHEucHVzaCgxKTtcbiAqIGhlYXBxLnB1c2goMik7XG4gKiBoZWFwcS5wdXNoKDMpO1xuICogaGVhcHEucG9wKCk7IC8vID09PiAxXG4gKiBoZWFwcS5wb3AoKTsgLy8gPT0+IDJcbiAqIGhlYXBxLnBvcCgpOyAvLyA9PT4gM1xuICovXG5sZXQgSGVhcFF1ZXVlID0gZnVuY3Rpb24oY21wKXtcbiAgdGhpcy5jbXAgPSAoY21wIHx8IGZ1bmN0aW9uKGEsIGIpeyByZXR1cm4gYSAtIGI7IH0pO1xuICB0aGlzLmxlbmd0aCA9IDA7XG4gIHRoaXMuZGF0YSA9IFtdO1xufVxuSGVhcFF1ZXVlLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHRoaXMuZGF0YVswXTtcbn07XG5IZWFwUXVldWUucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHRoaXMuZGF0YS5wdXNoKHZhbHVlKTtcblxuICB2YXIgcG9zID0gdGhpcy5kYXRhLmxlbmd0aCAtIDEsXG4gIHBhcmVudCwgeDtcblxuICB3aGlsZShwb3MgPiAwKXtcbiAgICBwYXJlbnQgPSAocG9zIC0gMSkgPj4+IDE7XG4gICAgaWYodGhpcy5jbXAodGhpcy5kYXRhW3Bvc10sIHRoaXMuZGF0YVtwYXJlbnRdKSA8IDApe1xuICAgICAgeCA9IHRoaXMuZGF0YVtwYXJlbnRdO1xuICAgICAgdGhpcy5kYXRhW3BhcmVudF0gPSB0aGlzLmRhdGFbcG9zXTtcbiAgICAgIHRoaXMuZGF0YVtwb3NdID0geDtcbiAgICAgIHBvcyA9IHBhcmVudDtcbiAgICB9ZWxzZSBicmVhaztcbiAgfVxuICByZXR1cm4gdGhpcy5sZW5ndGgrKztcbn07XG5IZWFwUXVldWUucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCl7XG4gIHZhciBsYXN0X3ZhbCA9IHRoaXMuZGF0YS5wb3AoKSxcbiAgcmV0ID0gdGhpcy5kYXRhWzBdO1xuICBpZih0aGlzLmRhdGEubGVuZ3RoID4gMCl7XG4gICAgdGhpcy5kYXRhWzBdID0gbGFzdF92YWw7XG4gICAgdmFyIHBvcyA9IDAsXG4gICAgbGFzdCA9IHRoaXMuZGF0YS5sZW5ndGggLSAxLFxuICAgIGxlZnQsIHJpZ2h0LCBtaW5JbmRleCwgeDtcbiAgICB3aGlsZSgxKXtcbiAgICAgIGxlZnQgPSAocG9zIDw8IDEpICsgMTtcbiAgICAgIHJpZ2h0ID0gbGVmdCArIDE7XG4gICAgICBtaW5JbmRleCA9IHBvcztcbiAgICAgIGlmKGxlZnQgPD0gbGFzdCAmJiB0aGlzLmNtcCh0aGlzLmRhdGFbbGVmdF0sIHRoaXMuZGF0YVttaW5JbmRleF0pIDwgMCkgbWluSW5kZXggPSBsZWZ0O1xuICAgICAgaWYocmlnaHQgPD0gbGFzdCAmJiB0aGlzLmNtcCh0aGlzLmRhdGFbcmlnaHRdLCB0aGlzLmRhdGFbbWluSW5kZXhdKSA8IDApIG1pbkluZGV4ID0gcmlnaHQ7XG4gICAgICBpZihtaW5JbmRleCAhPT0gcG9zKXtcbiAgICAgICAgeCA9IHRoaXMuZGF0YVttaW5JbmRleF07XG4gICAgICAgIHRoaXMuZGF0YVttaW5JbmRleF0gPSB0aGlzLmRhdGFbcG9zXTtcbiAgICAgICAgdGhpcy5kYXRhW3Bvc10gPSB4O1xuICAgICAgICBwb3MgPSBtaW5JbmRleDtcbiAgICAgIH1lbHNlIGJyZWFrO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXQgPSBsYXN0X3ZhbDtcbiAgfVxuICB0aGlzLmxlbmd0aC0tO1xuICByZXR1cm4gcmV0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIZWFwUXVldWVcbiIsImxldCBnID0gcmVxdWlyZSggJ2dlbmlzaC5qcycgKVxuIFxuLy8gY29uc3RydWN0b3IgZm9yIHNjaHJvZWRlciBhbGxwYXNzIGZpbHRlcnNcbmxldCBhbGxQYXNzID0gZnVuY3Rpb24oIF9pbnB1dCwgbGVuZ3RoPTUwMCwgZmVlZGJhY2s9LjUgKSB7XG4gIGxldCBpbmRleCAgPSBnLmNvdW50ZXIoIDEsMCxsZW5ndGggKSxcbiAgICAgIGJ1ZmZlciA9IGcuZGF0YSggbGVuZ3RoICksXG4gICAgICBidWZmZXJTYW1wbGUgPSBnLnBlZWsoIGJ1ZmZlciwgaW5kZXgsIHsgaW50ZXJwOidub25lJywgbW9kZTonc2FtcGxlcycgfSksXG4gICAgICBvdXQgPSBnLm1lbW8oIGcuYWRkKCBnLm11bCggLTEsIF9pbnB1dCksIGJ1ZmZlclNhbXBsZSApIClcbiAgICAgICAgICAgICAgICBcbiAgZy5wb2tlKCBidWZmZXIsIGcuYWRkKCBfaW5wdXQsIGcubXVsKCBidWZmZXJTYW1wbGUsIGZlZWRiYWNrICkgKSwgaW5kZXggKVxuIFxuICByZXR1cm4gb3V0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWxsUGFzc1xuIiwibGV0IGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApLFxuICAgIGZpbHRlciA9IHJlcXVpcmUoICcuL2ZpbHRlci5qcycgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG5cbiAgR2liYmVyaXNoLmdlbmlzaC5iaXF1YWQgPSAoIGlucHV0LCBjdXRvZmYsIF9RLCBtb2RlLCBpc1N0ZXJlbyApID0+IHtcbiAgICBsZXQgYTAsYTEsYTIsYyxiMSxiMixcbiAgICAgICAgaW4xYTAseDFhMSx4MmEyLHkxYjEseTJiMixcbiAgICAgICAgaW4xYTBfMSx4MWExXzEseDJhMl8xLHkxYjFfMSx5MmIyXzFcblxuICAgIGxldCByZXR1cm5WYWx1ZVxuICAgIFxuICAgIGNvbnN0IFEgPSBnLm1lbW8oIGcuYWRkKCAuNSwgZy5tdWwoIF9RLCAyMiApICkgKVxuICAgIGxldCB4MSA9IGcuaGlzdG9yeSgpLCB4MiA9IGcuaGlzdG9yeSgpLCB5MSA9IGcuaGlzdG9yeSgpLCB5MiA9IGcuaGlzdG9yeSgpXG4gICAgXG4gICAgbGV0IHcwID0gZy5tZW1vKCBnLm11bCggMiAqIE1hdGguUEksIGcuZGl2KCBjdXRvZmYsICBnLmdlbi5zYW1wbGVyYXRlICkgKSApLFxuICAgICAgICBzaW53MCA9IGcuc2luKCB3MCApLFxuICAgICAgICBjb3N3MCA9IGcuY29zKCB3MCApLFxuICAgICAgICBhbHBoYSA9IGcubWVtbyggZy5kaXYoIHNpbncwLCBnLm11bCggMiwgUSApICkgKVxuXG4gICAgbGV0IG9uZU1pbnVzQ29zVyA9IGcuc3ViKCAxLCBjb3N3MCApXG5cbiAgICBzd2l0Y2goIG1vZGUgKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGEwID0gZy5tZW1vKCBnLmRpdiggZy5hZGQoIDEsIGNvc3cwKSAsIDIpIClcbiAgICAgICAgYTEgPSBnLm11bCggZy5hZGQoIDEsIGNvc3cwICksIC0xIClcbiAgICAgICAgYTIgPSBhMFxuICAgICAgICBjICA9IGcuYWRkKCAxLCBhbHBoYSApXG4gICAgICAgIGIxID0gZy5tdWwoIC0yICwgY29zdzAgKVxuICAgICAgICBiMiA9IGcuc3ViKCAxLCBhbHBoYSApXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBhMCA9IGcubXVsKCBRLCBhbHBoYSApXG4gICAgICAgIGExID0gMFxuICAgICAgICBhMiA9IGcubXVsKCBhMCwgLTEgKVxuICAgICAgICBjICA9IGcuYWRkKCAxLCBhbHBoYSApXG4gICAgICAgIGIxID0gZy5tdWwoIC0yICwgY29zdzAgKVxuICAgICAgICBiMiA9IGcuc3ViKCAxLCBhbHBoYSApXG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDogLy8gTFBcbiAgICAgICAgYTAgPSBnLm1lbW8oIGcuZGl2KCBvbmVNaW51c0Nvc1csIDIpIClcbiAgICAgICAgYTEgPSBvbmVNaW51c0Nvc1dcbiAgICAgICAgYTIgPSBhMFxuICAgICAgICBjICA9IGcuYWRkKCAxLCBhbHBoYSApXG4gICAgICAgIGIxID0gZy5tdWwoIC0yICwgY29zdzAgKVxuICAgICAgICBiMiA9IGcuc3ViKCAxLCBhbHBoYSApXG4gICAgfVxuXG4gICAgYTAgPSBnLmRpdiggYTAsIGMgKTsgYTEgPSBnLmRpdiggYTEsIGMgKTsgYTIgPSBnLmRpdiggYTIsIGMgKVxuICAgIGIxID0gZy5kaXYoIGIxLCBjICk7IGIyID0gZy5kaXYoIGIyLCBjIClcblxuICAgIGluMWEwID0gZy5tdWwoIHgxLmluKCBpc1N0ZXJlbyA/IGlucHV0WzBdIDogaW5wdXQgKSwgYTAgKVxuICAgIHgxYTEgID0gZy5tdWwoIHgyLmluKCB4MS5vdXQgKSwgYTEgKVxuICAgIHgyYTIgID0gZy5tdWwoIHgyLm91dCwgICAgICAgICAgYTIgKVxuXG4gICAgbGV0IHN1bUxlZnQgPSBnLmFkZCggaW4xYTAsIHgxYTEsIHgyYTIgKVxuXG4gICAgeTFiMSA9IGcubXVsKCB5Mi5pbiggeTEub3V0ICksIGIxIClcbiAgICB5MmIyID0gZy5tdWwoIHkyLm91dCwgYjIgKVxuXG4gICAgbGV0IHN1bVJpZ2h0ID0gZy5hZGQoIHkxYjEsIHkyYjIgKVxuXG4gICAgbGV0IGRpZmYgPSBnLnN1Yiggc3VtTGVmdCwgc3VtUmlnaHQgKVxuXG4gICAgeTEuaW4oIGRpZmYgKVxuXG4gICAgaWYoIGlzU3RlcmVvICkge1xuICAgICAgbGV0IHgxXzEgPSBnLmhpc3RvcnkoKSwgeDJfMSA9IGcuaGlzdG9yeSgpLCB5MV8xID0gZy5oaXN0b3J5KCksIHkyXzEgPSBnLmhpc3RvcnkoKVxuXG4gICAgICBpbjFhMF8xID0gZy5tdWwoIHgxXzEuaW4oIGlucHV0WzFdICksIGEwIClcbiAgICAgIHgxYTFfMSAgPSBnLm11bCggeDJfMS5pbiggeDFfMS5vdXQgKSwgYTEgKVxuICAgICAgeDJhMl8xICA9IGcubXVsKCB4Ml8xLm91dCwgICAgICAgICAgICBhMiApXG5cbiAgICAgIGxldCBzdW1MZWZ0XzEgPSBnLmFkZCggaW4xYTBfMSwgeDFhMV8xLCB4MmEyXzEgKVxuXG4gICAgICB5MWIxXzEgPSBnLm11bCggeTJfMS5pbiggeTFfMS5vdXQgKSwgYjEgKVxuICAgICAgeTJiMl8xID0gZy5tdWwoIHkyXzEub3V0LCBiMiApXG5cbiAgICAgIGxldCBzdW1SaWdodF8xID0gZy5hZGQoIHkxYjFfMSwgeTJiMl8xIClcblxuICAgICAgbGV0IGRpZmZfMSA9IGcuc3ViKCBzdW1MZWZ0XzEsIHN1bVJpZ2h0XzEgKVxuXG4gICAgICB5MV8xLmluKCBkaWZmXzEgKVxuICAgICAgXG4gICAgICByZXR1cm5WYWx1ZSA9IFsgZGlmZiwgZGlmZl8xIF1cbiAgICB9ZWxzZXtcbiAgICAgIHJldHVyblZhbHVlID0gZGlmZlxuICAgIH1cblxuICAgIHJldHVybiByZXR1cm5WYWx1ZVxuICB9XG5cbiAgbGV0IEJpcXVhZCA9IGlucHV0UHJvcHMgPT4ge1xuICAgIGxldCBiaXF1YWQgPSBPYmplY3QuY3JlYXRlKCBmaWx0ZXIgKVxuICAgIE9iamVjdC5hc3NpZ24oIGJpcXVhZCwgQmlxdWFkLmRlZmF1bHRzLCBpbnB1dFByb3BzICkgXG5cbiAgICBsZXQgaXNTdGVyZW8gPSBiaXF1YWQuaW5wdXQuaXNTdGVyZW9cblxuICAgIGJpcXVhZC5fX2NyZWF0ZUdyYXBoID0gZnVuY3Rpb24oKSB7XG4gICAgICBiaXF1YWQuZ3JhcGggPSBHaWJiZXJpc2guZ2VuaXNoLmJpcXVhZCggZy5pbignaW5wdXQnKSwgZy5tdWwoIGcuaW4oJ2N1dG9mZicpLCBnLmdlbi5zYW1wbGVyYXRlIC8gNCApLCAgZy5pbignUScpLCBiaXF1YWQubW9kZSwgaXNTdGVyZW8gKVxuICAgIH1cblxuICAgIGJpcXVhZC5fX2NyZWF0ZUdyYXBoKClcbiAgICBiaXF1YWQuX19yZXF1aXJlc1JlY29tcGlsYXRpb24gPSBbICdtb2RlJyBdXG5cbiAgICBHaWJiZXJpc2guZmFjdG9yeShcbiAgICAgIGJpcXVhZCxcbiAgICAgIGJpcXVhZC5ncmFwaCxcbiAgICAgICdiaXF1YWQnLCBcbiAgICAgIGJpcXVhZFxuICAgIClcblxuICAgIHJldHVybiBiaXF1YWRcbiAgfVxuXG4gIEJpcXVhZC5kZWZhdWx0cyA9IHtcbiAgICBpbnB1dDowLFxuICAgIFE6IC4xNSxcbiAgICBjdXRvZmY6LjA1LFxuICAgIG1vZGU6MFxuICB9XG5cbiAgcmV0dXJuIEJpcXVhZFxuXG59XG5cbiIsImxldCBnID0gcmVxdWlyZSggJ2dlbmlzaC5qcycgKVxuXG5sZXQgY29tYkZpbHRlciA9IGZ1bmN0aW9uKCBfaW5wdXQsIGNvbWJMZW5ndGgsIGRhbXBpbmc9LjUqLjQsIGZlZWRiYWNrQ29lZmY9Ljg0ICkge1xuICBsZXQgbGFzdFNhbXBsZSAgID0gZy5oaXN0b3J5KCksXG4gIFx0ICByZWFkV3JpdGVJZHggPSBnLmNvdW50ZXIoIDEsMCxjb21iTGVuZ3RoICksXG4gICAgICBjb21iQnVmZmVyICAgPSBnLmRhdGEoIGNvbWJMZW5ndGggKSxcblx0ICAgIG91dCAgICAgICAgICA9IGcucGVlayggY29tYkJ1ZmZlciwgcmVhZFdyaXRlSWR4LCB7IGludGVycDonbm9uZScsIG1vZGU6J3NhbXBsZXMnIH0pLFxuICAgICAgc3RvcmVJbnB1dCAgID0gZy5tZW1vKCBnLmFkZCggZy5tdWwoIG91dCwgZy5zdWIoIDEsIGRhbXBpbmcpKSwgZy5tdWwoIGxhc3RTYW1wbGUub3V0LCBkYW1waW5nICkgKSApXG4gICAgICBcbiAgbGFzdFNhbXBsZS5pbiggc3RvcmVJbnB1dCApXG4gXG4gIGcucG9rZSggY29tYkJ1ZmZlciwgZy5hZGQoIF9pbnB1dCwgZy5tdWwoIHN0b3JlSW5wdXQsIGZlZWRiYWNrQ29lZmYgKSApLCByZWFkV3JpdGVJZHggKVxuIFxuICByZXR1cm4gb3V0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29tYkZpbHRlclxuIiwiY29uc3QgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnICksXG4gICAgICBmaWx0ZXIgPSByZXF1aXJlKCAnLi9maWx0ZXIuanMnIClcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggR2liYmVyaXNoICkge1xuICBHaWJiZXJpc2guZ2VuaXNoLmRpb2RlWkRGID0gKCBpbnB1dCwgX1EsIGZyZXEsIHNhdHVyYXRpb24sIGlzU3RlcmVvPWZhbHNlICkgPT4ge1xuICAgIGNvbnN0IGlUID0gMSAvIGcuZ2VuLnNhbXBsZXJhdGUsXG4gICAgICAgICAga3oxID0gZy5oaXN0b3J5KDApLFxuICAgICAgICAgIGt6MiA9IGcuaGlzdG9yeSgwKSxcbiAgICAgICAgICBrejMgPSBnLmhpc3RvcnkoMCksXG4gICAgICAgICAga3o0ID0gZy5oaXN0b3J5KDApXG5cbiAgICBsZXQgICBrYTEgPSAxLjAsXG4gICAgICAgICAga2EyID0gMC41LFxuICAgICAgICAgIGthMyA9IDAuNSxcbiAgICAgICAgICBrYTQgPSAwLjUsXG4gICAgICAgICAga2luZHggPSAwICAgXG5cbiAgICBjb25zdCBRID0gZy5tZW1vKCBnLmFkZCggLjUsIGcubXVsKCBfUSwgMTEgKSApIClcbiAgICAvLyBrd2QgPSAyICogJE1fUEkgKiBhY2Zba2luZHhdXG4gICAgY29uc3Qga3dkID0gZy5tZW1vKCBnLm11bCggTWF0aC5QSSAqIDIsIGZyZXEgKSApXG5cbiAgICAvLyBrd2EgPSAoMi9pVCkgKiB0YW4oa3dkICogaVQvMikgXG4gICAgY29uc3Qga3dhID1nLm1lbW8oIGcubXVsKCAyL2lULCBnLnRhbiggZy5tdWwoIGt3ZCwgaVQvMiApICkgKSApXG5cbiAgICAvLyBrRyAgPSBrd2EgKiBpVC8yIFxuICAgIGNvbnN0IGtnID0gZy5tZW1vKCBnLm11bCgga3dhLCBpVC8yICkgKVxuICAgIFxuICAgIGNvbnN0IGtHNCA9IGcubWVtbyggZy5tdWwoIC41LCBnLmRpdigga2csIGcuYWRkKCAxLCBrZyApICkgKSApXG4gICAgY29uc3Qga0czID0gZy5tZW1vKCBnLm11bCggLjUsIGcuZGl2KCBrZywgZy5zdWIoIGcuYWRkKCAxLCBrZyApLCBnLm11bCggZy5tdWwoIC41LCBrZyApLCBrRzQgKSApICkgKSApXG4gICAgY29uc3Qga0cyID0gZy5tZW1vKCBnLm11bCggLjUsIGcuZGl2KCBrZywgZy5zdWIoIGcuYWRkKCAxLCBrZyApLCBnLm11bCggZy5tdWwoIC41LCBrZyApLCBrRzMgKSApICkgKSApXG4gICAgY29uc3Qga0cxID0gZy5tZW1vKCBnLmRpdigga2csIGcuc3ViKCBnLmFkZCggMSwga2cgKSwgZy5tdWwoIGtnLCBrRzIgKSApICkgKVxuXG4gICAgY29uc3Qga0dBTU1BID0gZy5tZW1vKCBnLm11bCggZy5tdWwoIGtHNCwga0czICkgLCBnLm11bCgga0cyLCBrRzEgKSApIClcblxuICAgIGNvbnN0IGtTRzEgPSBnLm1lbW8oIGcubXVsKCBnLm11bCgga0c0LCBrRzMgKSwga0cyICkgKSBcblxuICAgIGNvbnN0IGtTRzIgPSBnLm1lbW8oIGcubXVsKCBrRzQsIGtHMykgKSAgXG4gICAgY29uc3Qga1NHMyA9IGtHNCBcbiAgICBsZXQga1NHNCA9IDEuMCBcbiAgICAvLyBrayA9IDQuMCooa1EgLSAwLjUpLygyNS4wIC0gMC41KVxuICAgIGNvbnN0IGthbHBoYSA9IGcubWVtbyggZy5kaXYoIGtnLCBnLmFkZCgxLjAsIGtnKSApIClcblxuICAgIGNvbnN0IGtiZXRhMSA9IGcubWVtbyggZy5kaXYoIDEuMCwgZy5zdWIoIGcuYWRkKCAxLCBrZyApLCBnLm11bCgga2csIGtHMiApICkgKSApXG4gICAgY29uc3Qga2JldGEyID0gZy5tZW1vKCBnLmRpdiggMS4wLCBnLnN1YiggZy5hZGQoIDEsIGtnICksIGcubXVsKCBnLm11bCggLjUsIGtnICksIGtHMyApICkgKSApXG4gICAgY29uc3Qga2JldGEzID0gZy5tZW1vKCBnLmRpdiggMS4wLCBnLnN1YiggZy5hZGQoIDEsIGtnICksIGcubXVsKCBnLm11bCggLjUsIGtnICksIGtHNCApICkgKSApXG4gICAgY29uc3Qga2JldGE0ID0gZy5tZW1vKCBnLmRpdiggMS4wLCBnLmFkZCggMSwga2cgKSApICkgXG5cbiAgICBjb25zdCBrZ2FtbWExID0gZy5tZW1vKCBnLmFkZCggMSwgZy5tdWwoIGtHMSwga0cyICkgKSApXG4gICAgY29uc3Qga2dhbW1hMiA9IGcubWVtbyggZy5hZGQoIDEsIGcubXVsKCBrRzIsIGtHMyApICkgKVxuICAgIGNvbnN0IGtnYW1tYTMgPSBnLm1lbW8oIGcuYWRkKCAxLCBnLm11bCgga0czLCBrRzQgKSApIClcblxuICAgIGNvbnN0IGtkZWx0YTEgPSBrZ1xuICAgIGNvbnN0IGtkZWx0YTIgPSBnLm1lbW8oIGcubXVsKCAwLjUsIGtnICkgKVxuICAgIGNvbnN0IGtkZWx0YTMgPSBnLm1lbW8oIGcubXVsKCAwLjUsIGtnICkgKVxuXG4gICAgY29uc3Qga2Vwc2lsb24xID0ga0cyXG4gICAgY29uc3Qga2Vwc2lsb24yID0ga0czXG4gICAgY29uc3Qga2Vwc2lsb24zID0ga0c0XG5cbiAgICBjb25zdCBrbGFzdGN1dCA9IGZyZXFcblxuICAgIC8vOzsgZmVlZGJhY2sgaW5wdXRzIFxuICAgIGNvbnN0IGtmYjQgPSBnLm1lbW8oIGcubXVsKCBrYmV0YTQgLCBrejQub3V0ICkgKSBcbiAgICBjb25zdCBrZmIzID0gZy5tZW1vKCBnLm11bCgga2JldGEzLCBnLmFkZCgga3ozLm91dCwgZy5tdWwoIGtmYjQsIGtkZWx0YTMgKSApICkgKVxuICAgIGNvbnN0IGtmYjIgPSBnLm1lbW8oIGcubXVsKCBrYmV0YTIsIGcuYWRkKCBrejIub3V0LCBnLm11bCgga2ZiMywga2RlbHRhMiApICkgKSApXG5cbiAgICAvLzs7IGZlZWRiYWNrIHByb2Nlc3NcblxuICAgIGNvbnN0IGtmYm8xID0gZy5tZW1vKCBnLm11bCgga2JldGExLCBnLmFkZCgga3oxLm91dCwgZy5tdWwoIGtmYjIsIGtkZWx0YTEgKSApICkgKSBcbiAgICBjb25zdCBrZmJvMiA9IGcubWVtbyggZy5tdWwoIGtiZXRhMiwgZy5hZGQoIGt6Mi5vdXQsIGcubXVsKCBrZmIzLCBrZGVsdGEyICkgKSApICkgXG4gICAgY29uc3Qga2ZibzMgPSBnLm1lbW8oIGcubXVsKCBrYmV0YTMsIGcuYWRkKCBrejMub3V0LCBnLm11bCgga2ZiNCwga2RlbHRhMyApICkgKSApIFxuICAgIGNvbnN0IGtmYm80ID0ga2ZiNFxuXG4gICAgY29uc3Qga1NJR01BID0gZy5tZW1vKCBcbiAgICAgIGcuYWRkKCBcbiAgICAgICAgZy5hZGQoIFxuICAgICAgICAgIGcubXVsKCBrU0cxLCBrZmJvMSApLCBcbiAgICAgICAgICBnLm11bCgga1NHMiwga2ZibzIgKVxuICAgICAgICApLCBcbiAgICAgICAgZy5hZGQoXG4gICAgICAgICAgZy5tdWwoIGtTRzMsIGtmYm8zICksIFxuICAgICAgICAgIGcubXVsKCBrU0c0LCBrZmJvNCApXG4gICAgICAgICkgXG4gICAgICApIFxuICAgIClcblxuICAgIC8vY29uc3Qga1NJR01BID0gMVxuICAgIC8vOzsgbm9uLWxpbmVhciBwcm9jZXNzaW5nXG4gICAgLy9pZiAoa25scCA9PSAxKSB0aGVuXG4gICAgLy8gIGtpbiA9ICgxLjAgLyB0YW5oKGtzYXR1cmF0aW9uKSkgKiB0YW5oKGtzYXR1cmF0aW9uICoga2luKVxuICAgIC8vZWxzZWlmIChrbmxwID09IDIpIHRoZW5cbiAgICAvLyAga2luID0gdGFuaChrc2F0dXJhdGlvbiAqIGtpbikgXG4gICAgLy9lbmRpZlxuICAgIC8vXG4gICAgLy9jb25zdCBraW4gPSBpbnB1dCBcbiAgICBsZXQga2luID0gaW5wdXQvL2cubWVtbyggZy5tdWwoIGcuZGl2KCAxLCBnLnRhbmgoIHNhdHVyYXRpb24gKSApLCBnLnRhbmgoIGcubXVsKCBzYXR1cmF0aW9uLCBpbnB1dCApICkgKSApXG4gICAga2luID0gZy50YW5oKCBnLm11bCggc2F0dXJhdGlvbiwga2luICkgKVxuXG4gICAgY29uc3Qga3VuID0gZy5kaXYoIGcuc3ViKCBraW4sIGcubXVsKCBRLCBrU0lHTUEgKSApLCBnLmFkZCggMSwgZy5tdWwoIFEsIGtHQU1NQSApICkgKVxuICAgIC8vY29uc3Qga3VuID0gZy5kaXYoIDEsIGcuYWRkKCAxLCBnLm11bCggUSwga0dBTU1BICkgKSApXG4gICAgICAgIC8vKGtpbiAtIGtrICoga1NJR01BKSAvICgxLjAgKyBrayAqIGtHQU1NQSlcblxuICAgIC8vOzsgMXN0IHN0YWdlXG4gICAgbGV0IGt4aW4gPSBnLm1lbW8oIGcuYWRkKCBnLmFkZCggZy5tdWwoIGt1biwga2dhbW1hMSApLCBrZmIyKSwgZy5tdWwoIGtlcHNpbG9uMSwga2ZibzEgKSApIClcbiAgICAvLyAoa3VuICoga2dhbW1hMSArIGtmYjIgKyBrZXBzaWxvbjEgKiBrZmJvMSlcbiAgICBsZXQga3YgPSBnLm1lbW8oIGcubXVsKCBnLnN1YiggZy5tdWwoIGthMSwga3hpbiApLCBrejEub3V0ICksIGthbHBoYSApIClcbiAgICAvL2t2ID0gKGthMSAqIGt4aW4gLSBrejEpICoga2FscGhhIFxuICAgIGxldCBrbHAgPSBnLmFkZCgga3YsIGt6MS5vdXQgKVxuICAgIC8va2xwID0ga3YgKyBrejFcbiAgICBrejEuaW4oIGcuYWRkKCBrbHAsIGt2ICkgKSBcbiAgICAvL2t6MSA9IGtscCArIGt2XG5cbiAgICAgICAgLy87OyAybmQgc3RhZ2VcbiAgICAvL2t4aW4gPSAoa2xwICoga2dhbW1hMiArIGtmYjMgKyBrZXBzaWxvbjIgKiBrZmJvMilcbiAgICAvL2t2ID0gKGthMiAqIGt4aW4gLSBrejIpICoga2FscGhhIFxuICAgIC8va2xwID0ga3YgKyBrejJcbiAgICAvL2t6MiA9IGtscCArIGt2XG5cbiAgICBreGluID0gZy5tZW1vKCBnLmFkZCggZy5hZGQoIGcubXVsKCBrbHAsIGtnYW1tYTIgKSwga2ZiMyksIGcubXVsKCBrZXBzaWxvbjIsIGtmYm8yICkgKSApXG4gICAgLy8gKGt1biAqIGtnYW1tYTEgKyBrZmIyICsga2Vwc2lsb24xICoga2ZibzEpXG4gICAga3YgPSBnLm1lbW8oIGcubXVsKCBnLnN1YiggZy5tdWwoIGthMiwga3hpbiApLCBrejIub3V0ICksIGthbHBoYSApIClcbiAgICAvL2t2ID0gKGthMSAqIGt4aW4gLSBrejEpICoga2FscGhhIFxuICAgIGtscCA9IGcuYWRkKCBrdiwga3oyLm91dCApIFxuICAgIC8va2xwID0ga3YgKyBrejFcbiAgICBrejIuaW4oIGcuYWRkKCBrbHAsIGt2ICkgKSBcbiAgICAvL2t6MSA9IGtscCArIGt2XG5cbiAgICAvLzs7IDNyZCBzdGFnZVxuICAgIC8va3hpbiA9IChrbHAgKiBrZ2FtbWEzICsga2ZiNCArIGtlcHNpbG9uMyAqIGtmYm8zKVxuICAgIC8va3YgPSAoa2EzICoga3hpbiAtIGt6MykgKiBrYWxwaGEgXG4gICAgLy9rbHAgPSBrdiArIGt6M1xuICAgIC8va3ozID0ga2xwICsga3ZcblxuICAgIGt4aW4gPSBnLm1lbW8oIGcuYWRkKCBnLmFkZCggZy5tdWwoIGtscCwga2dhbW1hMyApLCBrZmI0KSwgZy5tdWwoIGtlcHNpbG9uMywga2ZibzMgKSApIClcbiAgICAvLyAoa3VuICoga2dhbW1hMSArIGtmYjIgKyBrZXBzaWxvbjEgKiBrZmJvMSlcbiAgICBrdiA9IGcubWVtbyggZy5tdWwoIGcuc3ViKCBnLm11bCgga2EzLCBreGluICksIGt6My5vdXQgKSwga2FscGhhICkgKVxuICAgIC8va3YgPSAoa2ExICoga3hpbiAtIGt6MSkgKiBrYWxwaGEgXG4gICAga2xwID0gZy5hZGQoIGt2LCBrejMub3V0IClcbiAgICAvL2tscCA9IGt2ICsga3oxXG4gICAga3ozLmluKCBnLmFkZCgga2xwLCBrdiApIClcbiAgICAvL2t6MSA9IGtscCArIGt2XG5cbiAgICAvLzs7IDR0aCBzdGFnZVxuICAgIC8va3YgPSAoa2E0ICoga2xwIC0ga3o0KSAqIGthbHBoYSBcbiAgICAvL2tscCA9IGt2ICsga3o0XG4gICAgLy9rejQgPSBrbHAgKyBrdlxuXG4gICAgLy8gKGt1biAqIGtnYW1tYTEgKyBrZmIyICsga2Vwc2lsb24xICoga2ZibzEpXG4gICAga3YgPSBnLm1lbW8oIGcubXVsKCBnLnN1YiggZy5tdWwoIGthNCwga3hpbiApLCBrejQub3V0ICksIGthbHBoYSApIClcbiAgICAvL2t2ID0gKGthMSAqIGt4aW4gLSBrejEpICoga2FscGhhIFxuICAgIGtscCA9IGcuYWRkKCBrdiwga3o0Lm91dCApXG4gICAgLy9rbHAgPSBrdiArIGt6MVxuICAgIGt6NC5pbiggZy5hZGQoIGtscCwga3YgKSApXG5cbiAgICAvL2t6MSA9IGtscCArIGt2XG4gICAgaWYoIGlzU3RlcmVvICkge1xuICAgICAgLy9sZXQgcG9sZXNSID0gZy5kYXRhKFsgMCwwLDAsMCBdLCAxLCB7IG1ldGE6dHJ1ZSB9KSxcbiAgICAgIC8vICAgIHJlenpSID0gZy5jbGFtcCggZy5tdWwoIHBvbGVzUlszXSwgcmV6ICkgKSxcbiAgICAgIC8vICAgIG91dHB1dFIgPSBnLnN1YiggaW5wdXRbMV0sIHJlenpSICkgICAgICAgICBcblxuICAgICAgLy9wb2xlc1JbMF0gPSBnLmFkZCggcG9sZXNSWzBdLCBnLm11bCggZy5hZGQoIGcubXVsKC0xLCBwb2xlc1JbMF0gKSwgb3V0cHV0UiAgICksIGN1dG9mZiApKVxuICAgICAgLy9wb2xlc1JbMV0gPSBnLmFkZCggcG9sZXNSWzFdLCBnLm11bCggZy5hZGQoIGcubXVsKC0xLCBwb2xlc1JbMV0gKSwgcG9sZXNSWzBdICksIGN1dG9mZiApKVxuICAgICAgLy9wb2xlc1JbMl0gPSBnLmFkZCggcG9sZXNSWzJdLCBnLm11bCggZy5hZGQoIGcubXVsKC0xLCBwb2xlc1JbMl0gKSwgcG9sZXNSWzFdICksIGN1dG9mZiApKVxuICAgICAgLy9wb2xlc1JbM10gPSBnLmFkZCggcG9sZXNSWzNdLCBnLm11bCggZy5hZGQoIGcubXVsKC0xLCBwb2xlc1JbM10gKSwgcG9sZXNSWzJdICksIGN1dG9mZiApKVxuXG4gICAgICAvL2xldCByaWdodCA9IGcuc3dpdGNoKCBpc0xvd1Bhc3MsIHBvbGVzUlszXSwgZy5zdWIoIG91dHB1dFIsIHBvbGVzUlszXSApIClcblxuICAgICAgLy9yZXR1cm5WYWx1ZSA9IFtsZWZ0LCByaWdodF1cbiAgICB9ZWxzZXtcbiAgICAgLy8gcmV0dXJuVmFsdWUgPSBrbHBcbiAgICB9XG4gICAgcmV0dXJuVmFsdWUgPSBrbHBcbiAgICBcbiAgICByZXR1cm4gcmV0dXJuVmFsdWUvLyBrbHAvL3JldHVyblZhbHVlXG4gfVxuXG4gIGNvbnN0IERpb2RlWkRGID0gaW5wdXRQcm9wcyA9PiB7XG4gICAgY29uc3QgemRmICAgICAgPSBPYmplY3QuY3JlYXRlKCBmaWx0ZXIgKVxuICAgIGNvbnN0IHByb3BzICAgID0gT2JqZWN0LmFzc2lnbigge30sIERpb2RlWkRGLmRlZmF1bHRzLCBpbnB1dFByb3BzIClcbiAgICBjb25zdCBpc1N0ZXJlbyA9IHByb3BzLmlucHV0LmlzU3RlcmVvIFxuXG4gICAgR2liYmVyaXNoLmZhY3RvcnkoXG4gICAgICB6ZGYsIFxuICAgICAgR2liYmVyaXNoLmdlbmlzaC5kaW9kZVpERiggZy5pbignaW5wdXQnKSwgZy5pbignUScpLCBnLmluKCdjdXRvZmYnKSwgZy5pbignc2F0dXJhdGlvbicpLCBpc1N0ZXJlbyApLCBcbiAgICAgICdkaW9kZVpERicsXG4gICAgICBwcm9wc1xuICAgIClcblxuICAgIHJldHVybiB6ZGZcbiAgfVxuXG4gIERpb2RlWkRGLmRlZmF1bHRzID0ge1xuICAgIGlucHV0OjAsXG4gICAgUTogNSxcbiAgICBzYXR1cmF0aW9uOiAxLFxuICAgIGN1dG9mZjogNDQwLFxuICB9XG5cbiAgcmV0dXJuIERpb2RlWkRGXG5cbn1cbiIsImxldCB1Z2VuID0gcmVxdWlyZSggJy4uL3VnZW4uanMnIClcblxubGV0IGZpbHRlciA9IE9iamVjdC5jcmVhdGUoIHVnZW4gKVxuXG5PYmplY3QuYXNzaWduKCBmaWx0ZXIsIHtcblxufSlcblxubW9kdWxlLmV4cG9ydHMgPSBmaWx0ZXJcbiIsImxldCBnID0gcmVxdWlyZSggJ2dlbmlzaC5qcycgKSxcbiAgICBmaWx0ZXIgPSByZXF1aXJlKCAnLi9maWx0ZXIuanMnIClcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggR2liYmVyaXNoICkge1xuXG4gIEdpYmJlcmlzaC5nZW5pc2guZmlsdGVyMjQgPSAoIGlucHV0LCBfcmV6LCBfY3V0b2ZmLCBpc0xvd1Bhc3MsIGlzU3RlcmVvPWZhbHNlICkgPT4ge1xuICAgIGxldCByZXR1cm5WYWx1ZSxcbiAgICAgICAgcG9sZXNMID0gZy5kYXRhKFsgMCwwLDAsMCBdLCAxLCB7IG1ldGE6dHJ1ZSB9KSxcbiAgICAgICAgcGVla1Byb3BzID0geyBpbnRlcnA6J25vbmUnLCBtb2RlOidzaW1wbGUnIH0sXG4gICAgICAgIHJleiA9IGcubWVtbyggZy5tdWwoIF9yZXosIDUgKSApLFxuICAgICAgICBjdXRvZmYgPSBnLm1lbW8oIGcuZGl2KCBfY3V0b2ZmLCAxMTAyNSApICksXG4gICAgICAgIHJlenpMID0gZy5jbGFtcCggZy5tdWwoIHBvbGVzTFszXSwgcmV6ICkgKSxcbiAgICAgICAgb3V0cHV0TCA9IGcuc3ViKCBpc1N0ZXJlbyA/IGlucHV0WzBdIDogaW5wdXQsIHJlenpMICkgXG5cbiAgICBwb2xlc0xbMF0gPSBnLmFkZCggcG9sZXNMWzBdLCBnLm11bCggZy5hZGQoIGcubXVsKC0xLCBwb2xlc0xbMF0gKSwgb3V0cHV0TCAgICksIGN1dG9mZiApKVxuICAgIHBvbGVzTFsxXSA9IGcuYWRkKCBwb2xlc0xbMV0sIGcubXVsKCBnLmFkZCggZy5tdWwoLTEsIHBvbGVzTFsxXSApLCBwb2xlc0xbMF0gKSwgY3V0b2ZmICkpXG4gICAgcG9sZXNMWzJdID0gZy5hZGQoIHBvbGVzTFsyXSwgZy5tdWwoIGcuYWRkKCBnLm11bCgtMSwgcG9sZXNMWzJdICksIHBvbGVzTFsxXSApLCBjdXRvZmYgKSlcbiAgICBwb2xlc0xbM10gPSBnLmFkZCggcG9sZXNMWzNdLCBnLm11bCggZy5hZGQoIGcubXVsKC0xLCBwb2xlc0xbM10gKSwgcG9sZXNMWzJdICksIGN1dG9mZiApKVxuICAgIFxuICAgIGxldCBsZWZ0ID0gZy5zd2l0Y2goIGlzTG93UGFzcywgcG9sZXNMWzNdLCBnLnN1Yiggb3V0cHV0TCwgcG9sZXNMWzNdICkgKVxuXG4gICAgaWYoIGlzU3RlcmVvICkge1xuICAgICAgbGV0IHBvbGVzUiA9IGcuZGF0YShbIDAsMCwwLDAgXSwgMSwgeyBtZXRhOnRydWUgfSksXG4gICAgICAgICAgcmV6elIgPSBnLmNsYW1wKCBnLm11bCggcG9sZXNSWzNdLCByZXogKSApLFxuICAgICAgICAgIG91dHB1dFIgPSBnLnN1YiggaW5wdXRbMV0sIHJlenpSICkgICAgICAgICBcblxuICAgICAgcG9sZXNSWzBdID0gZy5hZGQoIHBvbGVzUlswXSwgZy5tdWwoIGcuYWRkKCBnLm11bCgtMSwgcG9sZXNSWzBdICksIG91dHB1dFIgICApLCBjdXRvZmYgKSlcbiAgICAgIHBvbGVzUlsxXSA9IGcuYWRkKCBwb2xlc1JbMV0sIGcubXVsKCBnLmFkZCggZy5tdWwoLTEsIHBvbGVzUlsxXSApLCBwb2xlc1JbMF0gKSwgY3V0b2ZmICkpXG4gICAgICBwb2xlc1JbMl0gPSBnLmFkZCggcG9sZXNSWzJdLCBnLm11bCggZy5hZGQoIGcubXVsKC0xLCBwb2xlc1JbMl0gKSwgcG9sZXNSWzFdICksIGN1dG9mZiApKVxuICAgICAgcG9sZXNSWzNdID0gZy5hZGQoIHBvbGVzUlszXSwgZy5tdWwoIGcuYWRkKCBnLm11bCgtMSwgcG9sZXNSWzNdICksIHBvbGVzUlsyXSApLCBjdXRvZmYgKSlcblxuICAgICAgbGV0IHJpZ2h0ID0gZy5zd2l0Y2goIGlzTG93UGFzcywgcG9sZXNSWzNdLCBnLnN1Yiggb3V0cHV0UiwgcG9sZXNSWzNdICkgKVxuXG4gICAgICByZXR1cm5WYWx1ZSA9IFtsZWZ0LCByaWdodF1cbiAgICB9ZWxzZXtcbiAgICAgIHJldHVyblZhbHVlID0gbGVmdFxuICAgIH1cblxuICAgIHJldHVybiByZXR1cm5WYWx1ZVxuICB9XG5cbiAgbGV0IEZpbHRlcjI0ID0gaW5wdXRQcm9wcyA9PiB7XG4gICAgbGV0IGZpbHRlcjI0ICAgPSBPYmplY3QuY3JlYXRlKCBmaWx0ZXIgKVxuICAgIGxldCBwcm9wcyAgICA9IE9iamVjdC5hc3NpZ24oIHt9LCBGaWx0ZXIyNC5kZWZhdWx0cywgaW5wdXRQcm9wcyApXG4gICAgbGV0IGlzU3RlcmVvID0gcHJvcHMuaW5wdXQuaXNTdGVyZW8gXG5cbiAgICBHaWJiZXJpc2guZmFjdG9yeShcbiAgICAgIGZpbHRlcjI0LCBcbiAgICAgIEdpYmJlcmlzaC5nZW5pc2guZmlsdGVyMjQoIGcuaW4oJ2lucHV0JyksIGcuaW4oJ1EnKSwgZy5pbignY3V0b2ZmJyksIGcuaW4oJ2lzTG93UGFzcycpLCBpc1N0ZXJlbyApLCBcbiAgICAgICdmaWx0ZXIyNCcsXG4gICAgICBwcm9wc1xuICAgIClcblxuICAgIHJldHVybiBmaWx0ZXIyNFxuICB9XG5cblxuICBGaWx0ZXIyNC5kZWZhdWx0cyA9IHtcbiAgICBpbnB1dDowLFxuICAgIFE6IC4yNSxcbiAgICBjdXRvZmY6IDg4MCxcbiAgICBpc0xvd1Bhc3M6MVxuICB9XG5cbiAgcmV0dXJuIEZpbHRlcjI0XG5cbn1cblxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggR2liYmVyaXNoICkge1xuXG4gIGNvbnN0IGcgPSBHaWJiZXJpc2guZ2VuaXNoXG5cbiAgY29uc3QgZmlsdGVycyA9IHtcbiAgICBGaWx0ZXIyNENsYXNzaWMgOiByZXF1aXJlKCAnLi9maWx0ZXIyNC5qcycgICkoIEdpYmJlcmlzaCApLFxuICAgIEZpbHRlcjI0TW9vZyAgICA6IHJlcXVpcmUoICcuL2xhZGRlckZpbHRlclplcm9EZWxheS5qcycgKSggR2liYmVyaXNoICksXG4gICAgRmlsdGVyMjRUQjMwMyAgIDogcmVxdWlyZSggJy4vZGlvZGVGaWx0ZXJaREYuanMnICkoIEdpYmJlcmlzaCApLFxuICAgIEZpbHRlcjEyQmlxdWFkICA6IHJlcXVpcmUoICcuL2JpcXVhZC5qcycgICAgKSggR2liYmVyaXNoICksXG4gICAgRmlsdGVyMTJTVkYgICAgIDogcmVxdWlyZSggJy4vc3ZmLmpzJyAgICAgICApKCBHaWJiZXJpc2ggKSxcbiAgICBcbiAgICAvLyBub3QgZm9yIHVzZSBieSBlbmQtdXNlcnNcbiAgICBnZW5pc2g6IHtcbiAgICAgIENvbWIgICAgICAgIDogcmVxdWlyZSggJy4vY29tYmZpbHRlci5qcycgKSxcbiAgICAgIEFsbFBhc3MgICAgIDogcmVxdWlyZSggJy4vYWxscGFzcy5qcycgKVxuICAgIH0sXG5cbiAgICBmYWN0b3J5KCBpbnB1dCwgY3V0b2ZmLCByZXNvbmFuY2UsIHNhdHVyYXRpb24gPSBudWxsLCBfcHJvcHMsIGlzU3RlcmVvID0gZmFsc2UgKSB7XG4gICAgICBsZXQgZmlsdGVyZWRPc2MgXG5cbiAgICAgIC8vaWYoIHByb3BzLmZpbHRlclR5cGUgPT09IDEgKSB7XG4gICAgICAvLyAgaWYoIHR5cGVvZiBwcm9wcy5jdXRvZmYgIT09ICdvYmplY3QnICYmIHByb3BzLmN1dG9mZiA+IDEgKSB7XG4gICAgICAvLyAgICBwcm9wcy5jdXRvZmYgPSAuMjVcbiAgICAgIC8vICB9XG4gICAgICAvLyAgaWYoIHR5cGVvZiBwcm9wcy5jdXRvZmYgIT09ICdvYmplY3QnICYmIHByb3BzLmZpbHRlck11bHQgPiAuNSApIHtcbiAgICAgIC8vICAgIHByb3BzLmZpbHRlck11bHQgPSAuMVxuICAgICAgLy8gIH1cbiAgICAgIC8vfVxuICAgICAgbGV0IHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgZmlsdGVycy5kZWZhdWx0cywgX3Byb3BzIClcblxuICAgICAgc3dpdGNoKCBwcm9wcy5maWx0ZXJUeXBlICkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgaXNMb3dQYXNzID0gZy5wYXJhbSggJ2xvd1Bhc3MnLCAxICksXG4gICAgICAgICAgZmlsdGVyZWRPc2MgPSBnLmZpbHRlcjI0KCBpbnB1dCwgZy5pbignUScpLCBjdXRvZmYsIHByb3BzLmZpbHRlck1vZGUsIGlzU3RlcmVvIClcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIGZpbHRlcmVkT3NjID0gZy56ZDI0KCBpbnB1dCwgZy5pbignUScpLCBjdXRvZmYgKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgZmlsdGVyZWRPc2MgPSBnLmRpb2RlWkRGKCBpbnB1dCwgZy5pbignUScpLCBjdXRvZmYsIGcuaW4oJ3NhdHVyYXRpb24nKSwgaXNTdGVyZW8gKSBcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIGZpbHRlcmVkT3NjID0gZy5zdmYoIGlucHV0LCBjdXRvZmYsIGcuc3ViKCAxLCBnLmluKCdRJykpLCBwcm9wcy5maWx0ZXJNb2RlLCBpc1N0ZXJlbyApIFxuICAgICAgICAgIGJyZWFrOyBcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgIGZpbHRlcmVkT3NjID0gZy5iaXF1YWQoIGlucHV0LCBjdXRvZmYsICBnLmluKCdRJyksIHByb3BzLmZpbHRlck1vZGUsIGlzU3RlcmVvICkgXG4gICAgICAgICAgYnJlYWs7IFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIHJldHVybiB1bmZpbHRlcmVkIHNpZ25hbFxuICAgICAgICAgIGZpbHRlcmVkT3NjID0gaW5wdXQgLy9nLmZpbHRlcjI0KCBvc2NXaXRoR2FpbiwgZy5pbigncmVzb25hbmNlJyksIGN1dG9mZiwgaXNMb3dQYXNzIClcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZpbHRlcmVkT3NjXG4gICAgfSxcblxuICAgIGRlZmF1bHRzOiB7IGZpbHRlck1vZGU6IDAsIGZpbHRlclR5cGU6MCB9XG4gIH1cblxuICBmaWx0ZXJzLmV4cG9ydCA9IHRhcmdldCA9PiB7XG4gICAgZm9yKCBsZXQga2V5IGluIGZpbHRlcnMgKSB7XG4gICAgICBpZigga2V5ICE9PSAnZXhwb3J0JyAmJiBrZXkgIT09ICdnZW5pc2gnICkge1xuICAgICAgICB0YXJnZXRbIGtleSBdID0gZmlsdGVyc1sga2V5IF1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxucmV0dXJuIGZpbHRlcnNcblxufVxuIiwiY29uc3QgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnICksXG4gICAgICBmaWx0ZXIgPSByZXF1aXJlKCAnLi9maWx0ZXIuanMnIClcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggR2liYmVyaXNoICkge1xuXG4gIEdpYmJlcmlzaC5nZW5pc2guemQyNCA9ICggaW5wdXQsIF9RLCBmcmVxLCBpc1N0ZXJlbz1mYWxzZSApID0+IHtcbiAgICBjb25zdCBpVCA9IDEgLyBnLmdlbi5zYW1wbGVyYXRlLFxuICAgICAgICAgIHoxID0gZy5oaXN0b3J5KDApLFxuICAgICAgICAgIHoyID0gZy5oaXN0b3J5KDApLFxuICAgICAgICAgIHozID0gZy5oaXN0b3J5KDApLFxuICAgICAgICAgIHo0ID0gZy5oaXN0b3J5KDApXG4gICAgXG4gICAgY29uc3QgUSA9IGcubWVtbyggZy5hZGQoIC41LCBnLm11bCggX1EsIDIzICkgKSApXG4gICAgLy8ga3dkID0gMiAqICRNX1BJICogYWNmW2tpbmR4XVxuICAgIGNvbnN0IGt3ZCA9IGcubWVtbyggZy5tdWwoIE1hdGguUEkgKiAyLCBmcmVxICkgKVxuXG4gICAgLy8ga3dhID0gKDIvaVQpICogdGFuKGt3ZCAqIGlULzIpIFxuICAgIGNvbnN0IGt3YSA9Zy5tZW1vKCBnLm11bCggMi9pVCwgZy50YW4oIGcubXVsKCBrd2QsIGlULzIgKSApICkgKVxuXG4gICAgLy8ga0cgID0ga3dhICogaVQvMiBcbiAgICBjb25zdCBrZyA9IGcubWVtbyggZy5tdWwoIGt3YSwgaVQvMiApIClcblxuICAgIC8vIGtrID0gNC4wKihrUSAtIDAuNSkvKDI1LjAgLSAwLjUpXG4gICAgY29uc3Qga2sgPSBnLm1lbW8oIGcubXVsKCA0LCBnLmRpdiggZy5zdWIoIFEsIC41ICksIDI0LjUgKSApIClcblxuICAgIC8vIGtnX3BsdXNfMSA9ICgxLjAgKyBrZylcbiAgICBjb25zdCBrZ19wbHVzXzEgPSBnLmFkZCggMSwga2cgKVxuXG4gICAgLy8ga0cgPSBrZyAvIGtnX3BsdXNfMSBcbiAgICBjb25zdCBrRyAgICAgPSBnLm1lbW8oIGcuZGl2KCBrZywga2dfcGx1c18xICkgKSxcbiAgICAgICAgICBrR18yICAgPSBnLm1lbW8oIGcubXVsKCBrRywga0cgKSApLFxuICAgICAgICAgIGtHXzMgICA9IGcubXVsKCBrR18yLCBrRyApLFxuICAgICAgICAgIGtHQU1NQSA9IGcubXVsKCBrR18yLCBrR18yIClcblxuICAgIGNvbnN0IGtTMSA9IGcuZGl2KCB6MS5vdXQsIGtnX3BsdXNfMSApLFxuICAgICAgICAgIGtTMiA9IGcuZGl2KCB6Mi5vdXQsIGtnX3BsdXNfMSApLFxuICAgICAgICAgIGtTMyA9IGcuZGl2KCB6My5vdXQsIGtnX3BsdXNfMSApLFxuICAgICAgICAgIGtTNCA9IGcuZGl2KCB6NC5vdXQsIGtnX3BsdXNfMSApXG5cbiAgICAvL2tTID0ga0dfMyAqIGtTMSAgKyBrR18yICoga1MyICsga0cgKiBrUzMgKyBrUzQgXG4gICAgY29uc3Qga1MgPSBnLm1lbW8oIFxuICAgICAgZy5hZGQoXG4gICAgICAgIGcuYWRkKCBnLm11bChrR18zLCBrUzEpLCBnLm11bCgga0dfMiwga1MyKSApLFxuICAgICAgICBnLmFkZCggZy5tdWwoa0csIGtTMyksIGtTNCApXG4gICAgICApXG4gICAgKVxuXG4gICAgLy9rdSA9IChraW4gLSBrayAqICBrUykgLyAoMSArIGtrICoga0dBTU1BKVxuICAgIGNvbnN0IGt1MSA9IGcuc3ViKCBpbnB1dCwgZy5tdWwoIGtrLCBrUyApIClcbiAgICBjb25zdCBrdTIgPSBnLm1lbW8oIGcuYWRkKCAxLCBnLm11bCgga2ssIGtHQU1NQSApICkgKVxuICAgIGNvbnN0IGt1ICA9IGcubWVtbyggZy5kaXYoIGt1MSwga3UyICkgKVxuXG4gICAgbGV0IGt2ID0gIGcubWVtbyggZy5tdWwoIGcuc3ViKCBrdSwgejEub3V0ICksIGtHICkgKVxuICAgIGxldCBrbHAgPSBnLm1lbW8oIGcuYWRkKCBrdiwgejEub3V0ICkgKVxuICAgIHoxLmluKCBnLmFkZCgga2xwLCBrdiApIClcblxuICAgIGt2ICA9IGcubWVtbyggZy5tdWwoIGcuc3ViKCBrbHAsIHoyLm91dCApLCBrRyApIClcbiAgICBrbHAgPSBnLm1lbW8oIGcuYWRkKCBrdiwgejIub3V0ICkgKVxuICAgIHoyLmluKCBnLmFkZCgga2xwLCBrdiApIClcblxuICAgIGt2ICA9IGcubWVtbyggZy5tdWwoIGcuc3ViKCBrbHAsIHozLm91dCApLCBrRyApIClcbiAgICBrbHAgPSBnLm1lbW8oIGcuYWRkKCBrdiwgejMub3V0ICkgKVxuICAgIHozLmluKCBnLmFkZCgga2xwLCBrdiApIClcblxuICAgIGt2ICA9IGcubWVtbyggZy5tdWwoIGcuc3ViKCBrbHAsIHo0Lm91dCApLCBrRyApIClcbiAgICBrbHAgPSBnLm1lbW8oIGcuYWRkKCBrdiwgejQub3V0ICkgKVxuICAgIHo0LmluKCBnLmFkZCgga2xwLCBrdiApIClcblxuXG4gICAgaWYoIGlzU3RlcmVvICkge1xuICAgICAgLy9sZXQgcG9sZXNSID0gZy5kYXRhKFsgMCwwLDAsMCBdLCAxLCB7IG1ldGE6dHJ1ZSB9KSxcbiAgICAgIC8vICAgIHJlenpSID0gZy5jbGFtcCggZy5tdWwoIHBvbGVzUlszXSwgcmV6ICkgKSxcbiAgICAgIC8vICAgIG91dHB1dFIgPSBnLnN1YiggaW5wdXRbMV0sIHJlenpSICkgICAgICAgICBcblxuICAgICAgLy9wb2xlc1JbMF0gPSBnLmFkZCggcG9sZXNSWzBdLCBnLm11bCggZy5hZGQoIGcubXVsKC0xLCBwb2xlc1JbMF0gKSwgb3V0cHV0UiAgICksIGN1dG9mZiApKVxuICAgICAgLy9wb2xlc1JbMV0gPSBnLmFkZCggcG9sZXNSWzFdLCBnLm11bCggZy5hZGQoIGcubXVsKC0xLCBwb2xlc1JbMV0gKSwgcG9sZXNSWzBdICksIGN1dG9mZiApKVxuICAgICAgLy9wb2xlc1JbMl0gPSBnLmFkZCggcG9sZXNSWzJdLCBnLm11bCggZy5hZGQoIGcubXVsKC0xLCBwb2xlc1JbMl0gKSwgcG9sZXNSWzFdICksIGN1dG9mZiApKVxuICAgICAgLy9wb2xlc1JbM10gPSBnLmFkZCggcG9sZXNSWzNdLCBnLm11bCggZy5hZGQoIGcubXVsKC0xLCBwb2xlc1JbM10gKSwgcG9sZXNSWzJdICksIGN1dG9mZiApKVxuXG4gICAgICAvL2xldCByaWdodCA9IGcuc3dpdGNoKCBpc0xvd1Bhc3MsIHBvbGVzUlszXSwgZy5zdWIoIG91dHB1dFIsIHBvbGVzUlszXSApIClcblxuICAgICAgLy9yZXR1cm5WYWx1ZSA9IFtsZWZ0LCByaWdodF1cbiAgICB9ZWxzZXtcbiAgICAgIHJldHVyblZhbHVlID0ga2xwXG4gICAgfVxuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlXG4gIH1cblxuICBjb25zdCBaZDI0ID0gaW5wdXRQcm9wcyA9PiB7XG4gICAgY29uc3QgZmlsdGVyICAgPSBPYmplY3QuY3JlYXRlKCBmaWx0ZXIgKVxuICAgIGNvbnN0IHByb3BzICAgID0gT2JqZWN0LmFzc2lnbigge30sIFpkMjQuZGVmYXVsdHMsIGlucHV0UHJvcHMgKVxuICAgIGNvbnN0IGlzU3RlcmVvID0gcHJvcHMuaW5wdXQuaXNTdGVyZW8gXG5cbiAgICBHaWJiZXJpc2guZmFjdG9yeShcbiAgICAgIGZpbHRlciwgXG4gICAgICBHaWJiZXJpc2guZ2VuaXNoLnpkMjQoIGcuaW4oJ2lucHV0JyksIGcuaW4oJ1EnKSwgZy5pbignY3V0b2ZmJyksIGlzU3RlcmVvICksIFxuICAgICAgJ3pkMjQnLFxuICAgICAgcHJvcHNcbiAgICApXG5cbiAgICByZXR1cm4gZmlsdGVyXG4gIH1cblxuXG4gIFpkMjQuZGVmYXVsdHMgPSB7XG4gICAgaW5wdXQ6MCxcbiAgICBROiA1LFxuICAgIGN1dG9mZjogNDQwLFxuICB9XG5cbiAgcmV0dXJuIFpkMjRcblxufVxuXG4iLCJjb25zdCBnID0gcmVxdWlyZSggJ2dlbmlzaC5qcycgKSxcbiAgICAgIGZpbHRlciA9IHJlcXVpcmUoICcuL2ZpbHRlci5qcycgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG4gIEdpYmJlcmlzaC5nZW5pc2guc3ZmID0gKCBpbnB1dCwgY3V0b2ZmLCBRLCBtb2RlLCBpc1N0ZXJlbyApID0+IHtcbiAgICBsZXQgZDEgPSBnLmRhdGEoWzAsMF0sIDEsIHsgbWV0YTp0cnVlIH0pLCBkMiA9IGcuZGF0YShbMCwwXSwgMSwgeyBtZXRhOnRydWUgfSksXG4gICAgICAgIHBlZWtQcm9wcyA9IHsgbW9kZTonc2ltcGxlJywgaW50ZXJwOidub25lJyB9XG5cbiAgICBsZXQgZjEgPSBnLm1lbW8oIGcubXVsKCAyICogTWF0aC5QSSwgZy5kaXYoIGN1dG9mZiwgZy5nZW4uc2FtcGxlcmF0ZSApICkgKVxuICAgIGxldCBvbmVPdmVyUSA9IGcubWVtbyggZy5kaXYoIDEsIFEgKSApXG4gICAgbGV0IGwgPSBnLm1lbW8oIGcuYWRkKCBkMlswXSwgZy5tdWwoIGYxLCBkMVswXSApICkgKSxcbiAgICAgICAgaCA9IGcubWVtbyggZy5zdWIoIGcuc3ViKCBpc1N0ZXJlbyA/IGlucHV0WzBdIDogaW5wdXQsIGwgKSwgZy5tdWwoIFEsIGQxWzBdICkgKSApLFxuICAgICAgICBiID0gZy5tZW1vKCBnLmFkZCggZy5tdWwoIGYxLCBoICksIGQxWzBdICkgKSxcbiAgICAgICAgbiA9IGcubWVtbyggZy5hZGQoIGgsIGwgKSApXG5cbiAgICBkMVswXSA9IGJcbiAgICBkMlswXSA9IGxcblxuICAgIGxldCBvdXQgPSBnLnNlbGVjdG9yKCBtb2RlLCBsLCBoLCBiLCBuIClcblxuICAgIGxldCByZXR1cm5WYWx1ZVxuICAgIGlmKCBpc1N0ZXJlbyApIHtcbiAgICAgIGxldCBkMTIgPSBnLmRhdGEoWzAsMF0sIDEsIHsgbWV0YTp0cnVlIH0pLCBkMjIgPSBnLmRhdGEoWzAsMF0sIDEsIHsgbWV0YTp0cnVlIH0pXG4gICAgICBsZXQgbDIgPSBnLm1lbW8oIGcuYWRkKCBkMjJbMF0sIGcubXVsKCBmMSwgZDEyWzBdICkgKSApLFxuICAgICAgICAgIGgyID0gZy5tZW1vKCBnLnN1YiggZy5zdWIoIGlucHV0WzFdLCBsMiApLCBnLm11bCggUSwgZDEyWzBdICkgKSApLFxuICAgICAgICAgIGIyID0gZy5tZW1vKCBnLmFkZCggZy5tdWwoIGYxLCBoMiApLCBkMTJbMF0gKSApLFxuICAgICAgICAgIG4yID0gZy5tZW1vKCBnLmFkZCggaDIsIGwyICkgKVxuXG4gICAgICBkMTJbMF0gPSBiMlxuICAgICAgZDIyWzBdID0gbDJcblxuICAgICAgbGV0IG91dDIgPSBnLnNlbGVjdG9yKCBtb2RlLCBsMiwgaDIsIGIyLCBuMiApXG5cbiAgICAgIHJldHVyblZhbHVlID0gWyBvdXQsIG91dDIgXVxuICAgIH1lbHNle1xuICAgICAgcmV0dXJuVmFsdWUgPSBvdXRcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWVcbiAgfVxuXG4gIGxldCBTVkYgPSBpbnB1dFByb3BzID0+IHtcbiAgICBjb25zdCBzdmYgPSBPYmplY3QuY3JlYXRlKCBmaWx0ZXIgKVxuICAgIGNvbnN0IHByb3BzID0gT2JqZWN0LmFzc2lnbigge30sIFNWRi5kZWZhdWx0cywgaW5wdXRQcm9wcyApIFxuXG4gICAgY29uc3QgaXNTdGVyZW8gPSBwcm9wcy5pbnB1dC5pc1N0ZXJlb1xuICAgIFxuICAgIC8vIFhYWCBORUVEUyBSRUZBQ1RPUklOR1xuICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBcbiAgICAgIHN2ZixcbiAgICAgIEdpYmJlcmlzaC5nZW5pc2guc3ZmKCBnLmluKCdpbnB1dCcpLCBnLm11bCggZy5pbignY3V0b2ZmJyksIGcuZ2VuLnNhbXBsZXJhdGUgLyA1ICksIGcuc3ViKCAxLCBnLmluKCdRJykgKSwgZy5pbignbW9kZScpLCBpc1N0ZXJlbyApLCBcbiAgICAgICdzdmYnLCBcbiAgICAgIHByb3BzXG4gICAgKVxuXG4gICAgcmV0dXJuIHN2ZlxuICB9XG5cblxuICBTVkYuZGVmYXVsdHMgPSB7XG4gICAgaW5wdXQ6MCxcbiAgICBROiAuNzUsXG4gICAgY3V0b2ZmOi4zNSxcbiAgICBtb2RlOjBcbiAgfVxuXG4gIHJldHVybiBTVkZcblxufVxuXG4iLCJsZXQgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnICksXG4gICAgZWZmZWN0ID0gcmVxdWlyZSggJy4vZWZmZWN0LmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcbiBcbmxldCBCaXRDcnVzaGVyID0gaW5wdXRQcm9wcyA9PiB7XG4gIGxldCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oIHsgYml0Q3J1c2hlckxlbmd0aDogNDQxMDAgfSwgQml0Q3J1c2hlci5kZWZhdWx0cywgaW5wdXRQcm9wcyApLFxuICAgICAgYml0Q3J1c2hlciA9IE9iamVjdC5jcmVhdGUoIGVmZmVjdCApXG5cbiAgbGV0IGlzU3RlcmVvID0gcHJvcHMuaW5wdXQuaXNTdGVyZW8gIT09IHVuZGVmaW5lZCA/IHByb3BzLmlucHV0LmlzU3RlcmVvIDogdHJ1ZSBcbiAgXG4gIGxldCBpbnB1dCA9IGcuaW4oICdpbnB1dCcgKSxcbiAgICAgIGJpdERlcHRoID0gZy5pbiggJ2JpdERlcHRoJyApLFxuICAgICAgc2FtcGxlUmF0ZSA9IGcuaW4oICdzYW1wbGVSYXRlJyApLFxuICAgICAgbGVmdElucHV0ID0gaXNTdGVyZW8gPyBpbnB1dFsgMCBdIDogaW5wdXQsXG4gICAgICByaWdodElucHV0ID0gaXNTdGVyZW8gPyBpbnB1dFsgMSBdIDogbnVsbFxuICBcbiAgbGV0IHN0b3JlTCA9IGcuaGlzdG9yeSgwKVxuICBsZXQgc2FtcGxlUmVkdXhDb3VudGVyID0gZy5jb3VudGVyKCBzYW1wbGVSYXRlLCAwLCAxIClcblxuICBsZXQgYml0TXVsdCA9IGcucG93KCBnLm11bCggYml0RGVwdGgsIDE2ICksIDIgKVxuICBsZXQgY3J1c2hlZEwgPSBnLmRpdiggZy5mbG9vciggZy5tdWwoIGxlZnRJbnB1dCwgYml0TXVsdCApICksIGJpdE11bHQgKVxuXG4gIGxldCBvdXRMID0gZy5zd2l0Y2goXG4gICAgc2FtcGxlUmVkdXhDb3VudGVyLndyYXAsXG4gICAgY3J1c2hlZEwsXG4gICAgc3RvcmVMLm91dFxuICApXG5cbiAgaWYoIGlzU3RlcmVvICkge1xuICAgIGxldCBzdG9yZVIgPSBnLmhpc3RvcnkoMClcbiAgICBsZXQgY3J1c2hlZFIgPSBnLmRpdiggZy5mbG9vciggZy5tdWwoIHJpZ2h0SW5wdXQsIGJpdE11bHQgKSApLCBiaXRNdWx0IClcblxuICAgIGxldCBvdXRSID0gdGVybmFyeSggXG4gICAgICBzYW1wbGVSZWR1eENvdW50ZXIud3JhcCxcbiAgICAgIGNydXNoZWRSLFxuICAgICAgc3RvcmVMLm91dFxuICAgIClcblxuICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBcbiAgICAgIGJpdENydXNoZXIsXG4gICAgICBbIG91dEwsIG91dFIgXSwgXG4gICAgICAnYml0Q3J1c2hlcicsIFxuICAgICAgcHJvcHMgXG4gICAgKVxuICB9ZWxzZXtcbiAgICBHaWJiZXJpc2guZmFjdG9yeSggYml0Q3J1c2hlciwgb3V0TCwgJ2JpdENydXNoZXInLCBwcm9wcyApXG4gIH1cbiAgXG4gIHJldHVybiBiaXRDcnVzaGVyXG59XG5cbkJpdENydXNoZXIuZGVmYXVsdHMgPSB7XG4gIGlucHV0OjAsXG4gIGJpdERlcHRoOi41LFxuICBzYW1wbGVSYXRlOiAuNVxufVxuXG5yZXR1cm4gQml0Q3J1c2hlclxuXG59XG4iLCJsZXQgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnICksXG4gICAgZWZmZWN0ID0gcmVxdWlyZSggJy4vZWZmZWN0LmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcbiAgbGV0IHByb3RvID0gT2JqZWN0LmNyZWF0ZSggZWZmZWN0IClcblxuICBsZXQgU2h1ZmZsZXIgPSBpbnB1dFByb3BzID0+IHtcbiAgICBsZXQgYnVmZmVyU2h1ZmZsZXIgPSBPYmplY3QuY3JlYXRlKCBwcm90byApLFxuICAgICAgICBidWZmZXJTaXplID0gODgyMDBcblxuICAgIGxldCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oIHt9LCBTaHVmZmxlci5kZWZhdWx0cywgaW5wdXRQcm9wcyApXG5cbiAgICBsZXQgaXNTdGVyZW8gPSBwcm9wcy5pbnB1dC5pc1N0ZXJlbyAhPT0gdW5kZWZpbmVkID8gcHJvcHMuaW5wdXQuaXNTdGVyZW8gOiBmYWxzZVxuICAgIGxldCBwaGFzZSA9IGcuYWNjdW0oIDEsMCx7IHNob3VsZFdyYXA6IGZhbHNlIH0pXG5cbiAgICBsZXQgaW5wdXQgPSBnLmluKCAnaW5wdXQnICksXG4gICAgICAgIGxlZnRJbnB1dCA9IGlzU3RlcmVvID8gaW5wdXRbIDAgXSA6IGlucHV0LFxuICAgICAgICByaWdodElucHV0ID0gaXNTdGVyZW8gPyBpbnB1dFsgMSBdIDogbnVsbCxcbiAgICAgICAgcmF0ZU9mU2h1ZmZsaW5nID0gZy5pbiggJ3JhdGUnICksXG4gICAgICAgIGNoYW5jZU9mU2h1ZmZsaW5nID0gZy5pbiggJ2NoYW5jZScgKSxcbiAgICAgICAgcmV2ZXJzZUNoYW5jZSA9IGcuaW4oICdyZXZlcnNlQ2hhbmNlJyApLFxuICAgICAgICByZXBpdGNoQ2hhbmNlID0gZy5pbiggJ3JlcGl0Y2hDaGFuY2UnICksXG4gICAgICAgIHJlcGl0Y2hNaW4gPSBnLmluKCAncmVwaXRjaE1pbicgKSxcbiAgICAgICAgcmVwaXRjaE1heCA9IGcuaW4oICdyZXBpdGNoTWF4JyApXG5cbiAgICBsZXQgcGl0Y2hNZW1vcnkgPSBnLmhpc3RvcnkoMSlcblxuICAgIGxldCBzaG91bGRTaHVmZmxlQ2hlY2sgPSBnLmVxKCBnLm1vZCggcGhhc2UsIHJhdGVPZlNodWZmbGluZyApLCAwIClcbiAgICBsZXQgaXNTaHVmZmxpbmcgPSBnLm1lbW8oIGcuc2FoKCBnLmx0KCBnLm5vaXNlKCksIGNoYW5jZU9mU2h1ZmZsaW5nICksIHNob3VsZFNodWZmbGVDaGVjaywgMCApICkgXG5cbiAgICAvLyBpZiB3ZSBhcmUgc2h1ZmZsaW5nIGFuZCBvbiBhIHJlcGVhdCBib3VuZGFyeS4uLlxuICAgIGxldCBzaHVmZmxlQ2hhbmdlZCA9IGcubWVtbyggZy5hbmQoIHNob3VsZFNodWZmbGVDaGVjaywgaXNTaHVmZmxpbmcgKSApXG4gICAgbGV0IHNob3VsZFJldmVyc2UgPSBnLmx0KCBnLm5vaXNlKCksIHJldmVyc2VDaGFuY2UgKSxcbiAgICAgICAgcmV2ZXJzZU1vZCA9IGcuc3dpdGNoKCBzaG91bGRSZXZlcnNlLCAtMSwgMSApXG5cbiAgICBsZXQgcGl0Y2ggPSBnLmlmZWxzZSggXG4gICAgICBnLmFuZCggc2h1ZmZsZUNoYW5nZWQsIGcubHQoIGcubm9pc2UoKSwgcmVwaXRjaENoYW5jZSApICksXG4gICAgICBnLm1lbW8oIGcubXVsKCBnLmFkZCggcmVwaXRjaE1pbiwgZy5tdWwoIGcuc3ViKCByZXBpdGNoTWF4LCByZXBpdGNoTWluICksIGcubm9pc2UoKSApICksIHJldmVyc2VNb2QgKSApLFxuICAgICAgcmV2ZXJzZU1vZFxuICAgIClcbiAgICBcbiAgICAvLyBvbmx5IHN3aXRjaCBwaXRjaGVzIG9uIHJlcGVhdCBib3VuZGFyaWVzXG4gICAgcGl0Y2hNZW1vcnkuaW4oIGcuc3dpdGNoKCBzaHVmZmxlQ2hhbmdlZCwgcGl0Y2gsIHBpdGNoTWVtb3J5Lm91dCApIClcblxuICAgIGxldCBmYWRlTGVuZ3RoID0gZy5tZW1vKCBnLmRpdiggcmF0ZU9mU2h1ZmZsaW5nLCAxMDAgKSApLFxuICAgICAgICBmYWRlSW5jciA9IGcubWVtbyggZy5kaXYoIDEsIGZhZGVMZW5ndGggKSApXG5cbiAgICBsZXQgYnVmZmVyTCA9IGcuZGF0YSggYnVmZmVyU2l6ZSApLCBidWZmZXJSID0gaXNTdGVyZW8gPyBnLmRhdGEoIGJ1ZmZlclNpemUgKSA6IG51bGxcbiAgICBsZXQgcmVhZFBoYXNlID0gZy5hY2N1bSggcGl0Y2hNZW1vcnkub3V0LCAwLCB7IHNob3VsZFdyYXA6ZmFsc2UgfSkgXG4gICAgbGV0IHN0dXR0ZXIgPSBnLndyYXAoIGcuc3ViKCBnLm1vZCggcmVhZFBoYXNlLCBidWZmZXJTaXplICksIDIyMDUwICksIDAsIGJ1ZmZlclNpemUgKVxuXG4gICAgbGV0IG5vcm1hbFNhbXBsZSA9IGcucGVlayggYnVmZmVyTCwgZy5hY2N1bSggMSwgMCwgeyBtYXg6ODgyMDAgfSksIHsgbW9kZTonc2ltcGxlJyB9KVxuXG4gICAgbGV0IHN0dXR0ZXJTYW1wbGVQaGFzZSA9IGcuc3dpdGNoKCBpc1NodWZmbGluZywgc3R1dHRlciwgZy5tb2QoIHJlYWRQaGFzZSwgYnVmZmVyU2l6ZSApIClcbiAgICBsZXQgc3R1dHRlclNhbXBsZSA9IGcubWVtbyggZy5wZWVrKCBcbiAgICAgIGJ1ZmZlckwsIFxuICAgICAgc3R1dHRlclNhbXBsZVBoYXNlLFxuICAgICAgeyBtb2RlOidzYW1wbGVzJyB9XG4gICAgKSApXG4gICAgXG4gICAgbGV0IHN0dXR0ZXJTaG91bGRGYWRlSW4gPSBnLmFuZCggc2h1ZmZsZUNoYW5nZWQsIGlzU2h1ZmZsaW5nIClcbiAgICBsZXQgc3R1dHRlclBoYXNlID0gZy5hY2N1bSggMSwgc2h1ZmZsZUNoYW5nZWQsIHsgc2hvdWxkV3JhcDogZmFsc2UgfSlcblxuICAgIGxldCBmYWRlSW5BbW91bnQgPSBnLm1lbW8oIGcuZGl2KCBzdHV0dGVyUGhhc2UsIGZhZGVMZW5ndGggKSApXG4gICAgbGV0IGZhZGVPdXRBbW91bnQgPSBnLmRpdiggZy5zdWIoIHJhdGVPZlNodWZmbGluZywgc3R1dHRlclBoYXNlICksIGcuc3ViKCByYXRlT2ZTaHVmZmxpbmcsIGZhZGVMZW5ndGggKSApXG4gICAgXG4gICAgbGV0IGZhZGVkU3R1dHRlciA9IGcuaWZlbHNlKFxuICAgICAgZy5sdCggc3R1dHRlclBoYXNlLCBmYWRlTGVuZ3RoICksXG4gICAgICBnLm1lbW8oIGcubXVsKCBnLnN3aXRjaCggZy5sdCggZmFkZUluQW1vdW50LCAxICksIGZhZGVJbkFtb3VudCwgMSApLCBzdHV0dGVyU2FtcGxlICkgKSxcbiAgICAgIGcuZ3QoIHN0dXR0ZXJQaGFzZSwgZy5zdWIoIHJhdGVPZlNodWZmbGluZywgZmFkZUxlbmd0aCApICksXG4gICAgICBnLm1lbW8oIGcubXVsKCBnLmd0cCggZmFkZU91dEFtb3VudCwgMCApLCBzdHV0dGVyU2FtcGxlICkgKSxcbiAgICAgIHN0dXR0ZXJTYW1wbGVcbiAgICApXG4gICAgXG4gICAgbGV0IG91dHB1dEwgPSBnLm1peCggbm9ybWFsU2FtcGxlLCBmYWRlZFN0dXR0ZXIsIGlzU2h1ZmZsaW5nICkgXG5cbiAgICBsZXQgcG9rZUwgPSBnLnBva2UoIGJ1ZmZlckwsIGxlZnRJbnB1dCwgZy5tb2QoIGcuYWRkKCBwaGFzZSwgNDQxMDAgKSwgODgyMDAgKSApXG5cbiAgICBsZXQgcGFubmVyID0gZy5wYW4oIG91dHB1dEwsIG91dHB1dEwsIGcuaW4oICdwYW4nICkgKVxuICAgIFxuICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBcbiAgICAgIGJ1ZmZlclNodWZmbGVyLFxuICAgICAgW3Bhbm5lci5sZWZ0LCBwYW5uZXIucmlnaHRdLFxuICAgICAgJ3NodWZmbGVyJywgXG4gICAgICBwcm9wcyBcbiAgICApIFxuXG4gICAgcmV0dXJuIGJ1ZmZlclNodWZmbGVyXG4gIH1cbiAgXG4gIFNodWZmbGVyLmRlZmF1bHRzID0ge1xuICAgIGlucHV0OjAsXG4gICAgcmF0ZToyMjA1MCxcbiAgICBjaGFuY2U6LjI1LFxuICAgIHJldmVyc2VDaGFuY2U6LjUsXG4gICAgcmVwaXRjaENoYW5jZTouNSxcbiAgICByZXBpdGNoTWluOi41LFxuICAgIHJlcGl0Y2hNYXg6MixcbiAgICBwYW46LjUsXG4gICAgbWl4Oi41XG4gIH1cblxuICByZXR1cm4gU2h1ZmZsZXIgXG59XG4iLCJsZXQgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnICksXG4gICAgZWZmZWN0ID0gcmVxdWlyZSggJy4vZWZmZWN0LmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcbiBcbmxldCBDaG9ydXMgPSBpbnB1dFByb3BzID0+IHtcbiAgY29uc3QgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBDaG9ydXMuZGVmYXVsdHMsIGlucHV0UHJvcHMgKVxuICBcbiAgY29uc3QgY2hvcnVzID0gT2JqZWN0LmNyZWF0ZSggR2liYmVyaXNoLnByb3RvdHlwZXMudWdlbiApXG5cbiAgY29uc3QgaW5wdXQgPSBnLmluKCdpbnB1dCcpLFxuICAgICAgICBmcmVxMSA9IGcuaW4oJ3Nsb3dGcmVxdWVuY3knKSxcbiAgICAgICAgZnJlcTIgPSBnLmluKCdmYXN0RnJlcXVlbmN5JyksXG4gICAgICAgIGFtcDEgID0gZy5pbignc2xvd0dhaW4nKSxcbiAgICAgICAgYW1wMiAgPSBnLmluKCdmYXN0R2FpbicpXG5cbiAgY29uc3QgaXNTdGVyZW8gPSB0eXBlb2YgcHJvcHMuaW5wdXQuaXNTdGVyZW8gIT09ICd1bmRlZmluZWQnID8gcHJvcHMuaW5wdXQuaXNTdGVyZW8gOiB0cnVlIFxuXG4gIGNvbnN0IGxlZnRJbnB1dCA9IGlzU3RlcmVvID8gaW5wdXRbMF0gOiBpbnB1dFxuXG4gIGNvbnN0IHdpbjAgICA9IGcuZW52KCAnaW52ZXJzZXdlbGNoJywgMTAyNCApLFxuICAgICAgICB3aW4xMjAgPSBnLmVudiggJ2ludmVyc2V3ZWxjaCcsIDEwMjQsIDAsIC4zMzMgKSxcbiAgICAgICAgd2luMjQwID0gZy5lbnYoICdpbnZlcnNld2VsY2gnLCAxMDI0LCAwLCAuNjY2IClcbiAgXG4gIGNvbnN0IHNsb3dQaGFzb3IgPSBnLnBoYXNvciggZnJlcTEsIDAsIHsgbWluOjAgfSksXG4gIFx0XHQgIHNsb3dQZWVrMSAgPSBnLm11bCggZy5wZWVrKCB3aW4wLCAgIHNsb3dQaGFzb3IgKSwgYW1wMSApLFxuICAgICAgICBzbG93UGVlazIgID0gZy5tdWwoIGcucGVlayggd2luMTIwLCBzbG93UGhhc29yICksIGFtcDEgKSxcbiAgICAgICAgc2xvd1BlZWszICA9IGcubXVsKCBnLnBlZWsoIHdpbjI0MCwgc2xvd1BoYXNvciApLCBhbXAxIClcbiAgXG4gIGNvbnN0IGZhc3RQaGFzb3IgPSBnLnBoYXNvciggZnJlcTIsIDAsIHsgbWluOjAgfSksXG4gIFx0ICBcdGZhc3RQZWVrMSAgPSBnLm11bCggZy5wZWVrKCB3aW4wLCAgIGZhc3RQaGFzb3IgKSwgYW1wMiApLFxuICAgICAgICBmYXN0UGVlazIgID0gZy5tdWwoIGcucGVlayggd2luMTIwLCBmYXN0UGhhc29yICksIGFtcDIgKSxcbiAgICAgICAgZmFzdFBlZWszICA9IGcubXVsKCBnLnBlZWsoIHdpbjI0MCwgZmFzdFBoYXNvciApLCBhbXAyIClcblxuICBjb25zdCBtcyA9IEdpYmJlcmlzaC5jdHguc2FtcGxlUmF0ZSAvIDEwMDAgXG4gIGNvbnN0IG1heERlbGF5VGltZSA9IDEwMCAqIG1zXG5cbiAgY29uc3QgdGltZTEgPSAgZy5tdWwoIGcuYWRkKCBzbG93UGVlazEsIGZhc3RQZWVrMSwgNSApLCBtcyApLFxuICAgICAgICB0aW1lMiA9ICBnLm11bCggZy5hZGQoIHNsb3dQZWVrMiwgZmFzdFBlZWsyLCA1ICksIG1zICksXG4gICAgICAgIHRpbWUzID0gIGcubXVsKCBnLmFkZCggc2xvd1BlZWszLCBmYXN0UGVlazMsIDUgKSwgbXMgKVxuXG4gIGNvbnN0IGRlbGF5MUwgPSBnLmRlbGF5KCBsZWZ0SW5wdXQsIHRpbWUxLCB7IHNpemU6bWF4RGVsYXlUaW1lIH0pLFxuICAgICAgICBkZWxheTJMID0gZy5kZWxheSggbGVmdElucHV0LCB0aW1lMiwgeyBzaXplOm1heERlbGF5VGltZSB9KSxcbiAgICAgICAgZGVsYXkzTCA9IGcuZGVsYXkoIGxlZnRJbnB1dCwgdGltZTMsIHsgc2l6ZTptYXhEZWxheVRpbWUgfSlcblxuICBcbiAgY29uc3QgbGVmdE91dHB1dCA9IGcuYWRkKCBkZWxheTFMLCBkZWxheTJMLCBkZWxheTNMIClcbiAgaWYoIGlzU3RlcmVvICkge1xuICAgIGNvbnN0IHJpZ2h0SW5wdXQgPSBpbnB1dFsxXVxuICAgIGNvbnN0IGRlbGF5MVIgPSBnLmRlbGF5KHJpZ2h0SW5wdXQsIHRpbWUxLCB7IHNpemU6bWF4RGVsYXlUaW1lIH0pLFxuICAgICAgICAgIGRlbGF5MlIgPSBnLmRlbGF5KHJpZ2h0SW5wdXQsIHRpbWUyLCB7IHNpemU6bWF4RGVsYXlUaW1lIH0pLFxuICAgICAgICAgIGRlbGF5M1IgPSBnLmRlbGF5KHJpZ2h0SW5wdXQsIHRpbWUzLCB7IHNpemU6bWF4RGVsYXlUaW1lIH0pXG5cbiAgICAvLyBmbGlwIGEgY291cGxlIGRlbGF5IGxpbmVzIGZvciBzdGVyZW8gZWZmZWN0P1xuICAgIGNvbnN0IHJpZ2h0T3V0cHV0ID0gZy5hZGQoIGRlbGF5MVIsIGRlbGF5MkwsIGRlbGF5M1IgKVxuICAgIGNob3J1cy5ncmFwaCA9IFsgZy5hZGQoIGRlbGF5MUwsIGRlbGF5MlIsIGRlbGF5M0wgKSwgcmlnaHRPdXRwdXQgXVxuICB9ZWxzZXtcbiAgICBjaG9ydXMuZ3JhcGggPSBsZWZ0T3V0cHV0XG4gIH1cbiAgXG4gIEdpYmJlcmlzaC5mYWN0b3J5KCBjaG9ydXMsIGNob3J1cy5ncmFwaCwgJ2Nob3J1cycsIHByb3BzIClcblxuICByZXR1cm4gY2hvcnVzXG59XG5cbkNob3J1cy5kZWZhdWx0cyA9IHtcbiAgaW5wdXQ6MCxcbiAgc2xvd0ZyZXF1ZW5jeTogLjE4LFxuICBzbG93R2FpbjoxLFxuICBmYXN0RnJlcXVlbmN5OjYsXG4gIGZhc3RHYWluOi4yXG59XG5cbnJldHVybiBDaG9ydXNcblxufVxuIiwiY29uc3QgZyA9IHJlcXVpcmUoJ2dlbmlzaC5qcycpLFxuICAgICAgZWZmZWN0ID0gcmVxdWlyZSgnLi9lZmZlY3QuanMnKTtcblxuY29uc3QgZ2VuaXNoID0gZztcblxuXCJ1c2UganNkc3BcIjtcblxuY29uc3QgQWxsUGFzc0NoYWluID0gKGluMSwgaW4yLCBpbjMpID0+IHtcbiAgXCJ1c2UganNkc3BcIjtcblxuICAvKiBpbjEgPSBwcmVkZWxheV9vdXQgKi9cbiAgLyogaW4yID0gaW5kaWZmdXNpb24xICovXG4gIC8qIGluMyA9IGluZGlmZnVzaW9uMiAqL1xuXG4gIGNvbnN0IHN1YjEgPSBnZW5pc2guc3ViKGluMSwgMCk7XG4gIGNvbnN0IGQxID0gZy5kZWxheShzdWIxLCAxNDIpO1xuICBzdWIxLmlucHV0c1sxXSA9IGdlbmlzaC5tdWwoZDEsIGluMik7XG4gIGNvbnN0IGFwMV9vdXQgPSBnZW5pc2guYWRkKGdlbmlzaC5tdWwoc3ViMSwgaW4yKSwgZDEpO1xuXG4gIGNvbnN0IHN1YjIgPSBnZW5pc2guc3ViKGFwMV9vdXQsIDApO1xuICBjb25zdCBkMiA9IGcuZGVsYXkoc3ViMiwgMTA3KTtcbiAgc3ViMi5pbnB1dHNbMV0gPSBnZW5pc2gubXVsKGQyLCBpbjIpO1xuICBjb25zdCBhcDJfb3V0ID0gZ2VuaXNoLmFkZChnZW5pc2gubXVsKHN1YjIsIGluMiksIGQyKTtcblxuICBjb25zdCBzdWIzID0gZ2VuaXNoLnN1YihhcDJfb3V0LCAwKTtcbiAgY29uc3QgZDMgPSBnLmRlbGF5KHN1YjMsIDM3OSk7XG4gIHN1YjMuaW5wdXRzWzFdID0gZ2VuaXNoLm11bChkMywgaW4zKTtcbiAgY29uc3QgYXAzX291dCA9IGdlbmlzaC5hZGQoZ2VuaXNoLm11bChzdWIzLCBpbjMpLCBkMyk7XG5cbiAgY29uc3Qgc3ViNCA9IGdlbmlzaC5zdWIoYXAzX291dCwgMCk7XG4gIGNvbnN0IGQ0ID0gZy5kZWxheShzdWI0LCAyNzcpO1xuICBzdWI0LmlucHV0c1sxXSA9IGdlbmlzaC5tdWwoZDQsIGluMyk7XG4gIGNvbnN0IGFwNF9vdXQgPSBnZW5pc2guYWRkKGdlbmlzaC5tdWwoc3ViNCwgaW4zKSwgZDQpO1xuXG4gIHJldHVybiBhcDRfb3V0O1xufTtcblxuLypjb25zdCB0YW5rX291dHMgPSBUYW5rKCBhcF9vdXQsIGRlY2F5ZGlmZnVzaW9uMSwgZGVjYXlkaWZmdXNpb24yLCBkYW1waW5nLCBkZWNheSApKi9cbmNvbnN0IFRhbmsgPSBmdW5jdGlvbiAoaW4xLCBpbjIsIGluMywgaW40LCBpbjUpIHtcbiAgXCJ1c2UganNkc3BcIjtcblxuICBjb25zdCBvdXRzID0gW1tdLCBbXSwgW10sIFtdLCBbXV07XG5cbiAgLyogTEVGVCBDSEFOTkVMICovXG4gIGNvbnN0IGxlZnRTdGFydCA9IGdlbmlzaC5hZGQoaW4xLCAwKTtcbiAgY29uc3QgZGVsYXlJbnB1dCA9IGdlbmlzaC5hZGQobGVmdFN0YXJ0LCAwKTtcbiAgY29uc3QgZGVsYXkxID0gZy5kZWxheShkZWxheUlucHV0LCBbZ2VuaXNoLmFkZChnZW5pc2gubXVsKGcuY3ljbGUoLjEpLCAxNiksIDY3MildLCB7IHNpemU6IDY4OCB9KTtcbiAgZGVsYXlJbnB1dC5pbnB1dHNbMV0gPSBnZW5pc2gubXVsKGRlbGF5MSwgaW4yKTtcbiAgY29uc3QgZGVsYXlPdXQgPSBnZW5pc2guc3ViKGRlbGF5MSwgZ2VuaXNoLm11bChkZWxheUlucHV0LCBpbjIpKTtcblxuICBjb25zdCBkZWxheTIgPSBnLmRlbGF5KGRlbGF5T3V0LCBbNDQ1MywgMzUzLCAzNjI3LCAxMTkwXSk7XG4gIG91dHNbM10ucHVzaChnZW5pc2guYWRkKGRlbGF5Mi5vdXRwdXRzWzFdLCBkZWxheTIub3V0cHV0c1syXSkpO1xuICBvdXRzWzJdLnB1c2goZGVsYXkyLm91dHB1dHNbM10pO1xuXG4gIGNvbnN0IG16ID0gZy5oaXN0b3J5KDApO1xuICBjb25zdCBtbCA9IGcubWl4KGRlbGF5MiwgbXoub3V0LCBpbjQpO1xuICBtei5pbihtbCk7XG5cbiAgY29uc3QgbW91dCA9IGdlbmlzaC5tdWwobWwsIGluNSk7XG5cbiAgY29uc3QgczEgPSBnZW5pc2guc3ViKG1vdXQsIDApO1xuICBjb25zdCBkZWxheTMgPSBnLmRlbGF5KHMxLCBbMTgwMCwgMTg3LCAxMjI4XSk7XG4gIG91dHNbMl0ucHVzaChkZWxheTMub3V0cHV0c1sxXSk7XG4gIG91dHNbNF0ucHVzaChkZWxheTMub3V0cHV0c1syXSk7XG4gIHMxLmlucHV0c1sxXSA9IGdlbmlzaC5tdWwoZGVsYXkzLCBpbjMpO1xuICBjb25zdCBtMiA9IGdlbmlzaC5tdWwoczEsIGluMyk7XG4gIGNvbnN0IGRsMl9vdXQgPSBnZW5pc2guYWRkKGRlbGF5MywgbTIpO1xuXG4gIGNvbnN0IGRlbGF5NCA9IGcuZGVsYXkoZGwyX291dCwgWzM3MjAsIDEwNjYsIDI2NzNdKTtcbiAgb3V0c1syXS5wdXNoKGRlbGF5NC5vdXRwdXRzWzFdKTtcbiAgb3V0c1szXS5wdXNoKGRlbGF5NC5vdXRwdXRzWzJdKTtcblxuICAvKiBSSUdIVCBDSEFOTkVMICovXG4gIGNvbnN0IHJpZ2h0U3RhcnQgPSBnZW5pc2guYWRkKGdlbmlzaC5tdWwoZGVsYXk0LCBpbjUpLCBpbjEpO1xuICBjb25zdCBkZWxheUlucHV0UiA9IGdlbmlzaC5hZGQocmlnaHRTdGFydCwgMCk7XG4gIGNvbnN0IGRlbGF5MVIgPSBnLmRlbGF5KGRlbGF5SW5wdXRSLCBnZW5pc2guYWRkKGdlbmlzaC5tdWwoZy5jeWNsZSguMDcpLCAxNiksIDkwOCksIHsgc2l6ZTogOTI0IH0pO1xuICBkZWxheUlucHV0Ui5pbnB1dHNbMV0gPSBnZW5pc2gubXVsKGRlbGF5MVIsIGluMik7XG4gIGNvbnN0IGRlbGF5T3V0UiA9IGdlbmlzaC5zdWIoZGVsYXkxUiwgZ2VuaXNoLm11bChkZWxheUlucHV0UiwgaW4yKSk7XG5cbiAgY29uc3QgZGVsYXkyUiA9IGcuZGVsYXkoZGVsYXlPdXRSLCBbNDIxNywgMjY2LCAyOTc0LCAyMTExXSk7XG4gIG91dHNbMV0ucHVzaChnZW5pc2guYWRkKGRlbGF5MlIub3V0cHV0c1sxXSwgZGVsYXkyUi5vdXRwdXRzWzJdKSk7XG4gIG91dHNbNF0ucHVzaChkZWxheTJSLm91dHB1dHNbM10pO1xuXG4gIGNvbnN0IG16UiA9IGcuaGlzdG9yeSgwKTtcbiAgY29uc3QgbWxSID0gZy5taXgoZGVsYXkyUiwgbXpSLm91dCwgaW40KTtcbiAgbXpSLmluKG1sUik7XG5cbiAgY29uc3QgbW91dFIgPSBnZW5pc2gubXVsKG1sUiwgaW41KTtcblxuICBjb25zdCBzMVIgPSBnZW5pc2guc3ViKG1vdXRSLCAwKTtcbiAgY29uc3QgZGVsYXkzUiA9IGcuZGVsYXkoczFSLCBbMjY1NiwgMzM1LCAxOTEzXSk7XG4gIG91dHNbNF0ucHVzaChkZWxheTNSLm91dHB1dHNbMV0pO1xuICBvdXRzWzJdLnB1c2goZGVsYXkzUi5vdXRwdXRzWzJdKTtcbiAgczFSLmlucHV0c1sxXSA9IGdlbmlzaC5tdWwoZGVsYXkzUiwgaW4zKTtcbiAgY29uc3QgbTJSID0gZ2VuaXNoLm11bChzMVIsIGluMyk7XG4gIGNvbnN0IGRsMl9vdXRSID0gZ2VuaXNoLmFkZChkZWxheTNSLCBtMlIpO1xuXG4gIGNvbnN0IGRlbGF5NFIgPSBnLmRlbGF5KGRsMl9vdXRSLCBbMzE2MywgMTIxLCAxOTk2XSk7XG4gIG91dHNbNF0ucHVzaChkZWxheTQub3V0cHV0c1sxXSk7XG4gIG91dHNbMV0ucHVzaChkZWxheTQub3V0cHV0c1syXSk7XG5cbiAgbGVmdFN0YXJ0LmlucHV0c1sxXSA9IGdlbmlzaC5tdWwoZGVsYXk0UiwgaW41KTtcblxuICBvdXRzWzFdID0gZy5hZGQoLi4ub3V0c1sxXSk7XG4gIG91dHNbMl0gPSBnLmFkZCguLi5vdXRzWzJdKTtcbiAgb3V0c1szXSA9IGcuYWRkKC4uLm91dHNbM10pO1xuICBvdXRzWzRdID0gZy5hZGQoLi4ub3V0c1s0XSk7XG4gIHJldHVybiBvdXRzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoR2liYmVyaXNoKSB7XG5cbiAgY29uc3QgUmV2ZXJiID0gaW5wdXRQcm9wcyA9PiB7XG4gICAgY29uc3QgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBSZXZlcmIuZGVmYXVsdHMsIGlucHV0UHJvcHMpLFxuICAgICAgICAgIHJldmVyYiA9IE9iamVjdC5jcmVhdGUoZWZmZWN0KTtcblxuICAgIGNvbnN0IGlzU3RlcmVvID0gcHJvcHMuaW5wdXQuaXNTdGVyZW8gIT09IHVuZGVmaW5lZCA/IHByb3BzLmlucHV0LmlzU3RlcmVvIDogdHJ1ZTtcblxuICAgIGNvbnN0IGlucHV0ID0gZy5pbignaW5wdXQnKSxcbiAgICAgICAgICBkYW1waW5nID0gZy5pbignZGFtcGluZycpLFxuICAgICAgICAgIGRyeXdldCA9IGcuaW4oJ2RyeXdldCcpLFxuICAgICAgICAgIGRlY2F5ID0gZy5pbignZGVjYXknKSxcbiAgICAgICAgICBwcmVkZWxheSA9IGcuaW4oJ3ByZWRlbGF5JyksXG4gICAgICAgICAgaW5iYW5kd2lkdGggPSBnLmluKCdpbmJhbmR3aWR0aCcpLFxuICAgICAgICAgIGRlY2F5ZGlmZnVzaW9uMSA9IGcuaW4oJ2RlY2F5ZGlmZnVzaW9uMScpLFxuICAgICAgICAgIGRlY2F5ZGlmZnVzaW9uMiA9IGcuaW4oJ2RlY2F5ZGlmZnVzaW9uMicpLFxuICAgICAgICAgIGluZGlmZnVzaW9uMSA9IGcuaW4oJ2luZGlmZnVzaW9uMScpLFxuICAgICAgICAgIGluZGlmZnVzaW9uMiA9IGcuaW4oJ2luZGlmZnVzaW9uMicpO1xuXG4gICAgY29uc3Qgc3VtbWVkSW5wdXQgPSBpc1N0ZXJlbyA9PT0gdHJ1ZSA/IGcuYWRkKGlucHV0WzBdLCBpbnB1dFsxXSkgOiBpbnB1dDtcblxuICAgIHtcbiAgICAgICd1c2UganNkc3AnO1xuXG4gICAgICAvLyBjYWxjdWxjYXRlIHByZWRlbGF5XG4gICAgICBjb25zdCBwcmVkZWxheV9zYW1wcyA9IGcubXN0b3NhbXBzKHByZWRlbGF5KTtcbiAgICAgIGNvbnN0IHByZWRlbGF5X2RlbGF5ID0gZy5kZWxheShzdW1tZWRJbnB1dCwgcHJlZGVsYXlfc2FtcHMsIHsgc2l6ZTogNDQxMCB9KTtcbiAgICAgIGNvbnN0IHpfcGQgPSBnLmhpc3RvcnkoMCk7XG4gICAgICBjb25zdCBtaXgxID0gZy5taXgoel9wZC5vdXQsIHByZWRlbGF5X2RlbGF5LCBpbmJhbmR3aWR0aCk7XG4gICAgICB6X3BkLmluKG1peDEpO1xuXG4gICAgICBjb25zdCBwcmVkZWxheV9vdXQgPSBtaXgxO1xuXG4gICAgICAvLyBydW4gaW5wdXQgKyBwcmVkZWxheSB0aHJvdWdoIGFsbC1wYXNzIGNoYWluXG4gICAgICBjb25zdCBhcF9vdXQgPSBBbGxQYXNzQ2hhaW4ocHJlZGVsYXlfb3V0LCBpbmRpZmZ1c2lvbjEsIGluZGlmZnVzaW9uMik7XG5cbiAgICAgIC8vIHJ1biBmaWx0ZXJlZCBzaWduYWwgaW50byBcInRhbmtcIiBtb2RlbFxuICAgICAgY29uc3QgdGFua19vdXRzID0gVGFuayhhcF9vdXQsIGRlY2F5ZGlmZnVzaW9uMSwgZGVjYXlkaWZmdXNpb24yLCBkYW1waW5nLCBkZWNheSk7XG5cbiAgICAgIGNvbnN0IGxlZnRXZXQgPSBnZW5pc2gubXVsKGdlbmlzaC5zdWIodGFua19vdXRzWzFdLCB0YW5rX291dHNbMl0pLCAuNik7XG4gICAgICBjb25zdCByaWdodFdldCA9IGdlbmlzaC5tdWwoZ2VuaXNoLnN1Yih0YW5rX291dHNbM10sIHRhbmtfb3V0c1s0XSksIC42KTtcblxuICAgICAgLy8gbWl4IHdldCBhbmQgZHJ5IHNpZ25hbCBmb3IgZmluYWwgb3V0cHV0XG4gICAgICBjb25zdCBsZWZ0ID0gZy5taXgoaXNTdGVyZW8gPyBpbnB1dFswXSA6IGlucHV0LCBsZWZ0V2V0LCBkcnl3ZXQpO1xuICAgICAgY29uc3QgcmlnaHQgPSBnLm1peChpc1N0ZXJlbyA/IGlucHV0WzFdIDogaW5wdXQsIHJpZ2h0V2V0LCBkcnl3ZXQpO1xuXG4gICAgICBHaWJiZXJpc2guZmFjdG9yeShyZXZlcmIsIFtsZWZ0LCByaWdodF0sICdkYXR0b3JybycsIHByb3BzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV2ZXJiO1xuICB9O1xuXG4gIFJldmVyYi5kZWZhdWx0cyA9IHtcbiAgICBpbnB1dDogMCxcbiAgICBkYW1waW5nOiAuNSxcbiAgICBkcnl3ZXQ6IC41LFxuICAgIGRlY2F5OiAuNSxcbiAgICBwcmVkZWxheTogMTAsXG4gICAgaW5iYW5kd2lkdGg6IC41LFxuICAgIGluZGlmZnVzaW9uMTogLjc1LFxuICAgIGluZGlmZnVzaW9uMjogLjYyNSxcbiAgICBkZWNheWRpZmZ1c2lvbjE6IC43LFxuICAgIGRlY2F5ZGlmZnVzaW9uMjogLjVcbiAgfTtcblxuICByZXR1cm4gUmV2ZXJiO1xufTsiLCJsZXQgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnICksXG4gICAgZWZmZWN0ID0gcmVxdWlyZSggJy4vZWZmZWN0LmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcbiBcbmxldCBEZWxheSA9IGlucHV0UHJvcHMgPT4ge1xuICBsZXQgcHJvcHMgPSBPYmplY3QuYXNzaWduKCB7IGRlbGF5TGVuZ3RoOiA0NDEwMCB9LCBEZWxheS5kZWZhdWx0cywgaW5wdXRQcm9wcyApLFxuICAgICAgZGVsYXkgPSBPYmplY3QuY3JlYXRlKCBlZmZlY3QgKVxuXG4gIGxldCBpc1N0ZXJlbyA9IHByb3BzLmlucHV0LmlzU3RlcmVvICE9PSB1bmRlZmluZWQgPyBwcm9wcy5pbnB1dC5pc1N0ZXJlbyA6IHRydWUgXG4gIFxuICBsZXQgaW5wdXQgICAgICA9IGcuaW4oICdpbnB1dCcgKSxcbiAgICAgIGRlbGF5VGltZSAgPSBnLmluKCAnZGVsYXlUaW1lJyApLFxuICAgICAgd2V0ZHJ5ICAgICA9IGcuaW4oICd3ZXRkcnknICksXG4gICAgICBsZWZ0SW5wdXQgID0gaXNTdGVyZW8gPyBpbnB1dFsgMCBdIDogaW5wdXQsXG4gICAgICByaWdodElucHV0ID0gaXNTdGVyZW8gPyBpbnB1dFsgMSBdIDogbnVsbFxuICAgIFxuICBsZXQgZmVlZGJhY2sgPSBnLmluKCAnZmVlZGJhY2snIClcblxuICAvLyBsZWZ0IGNoYW5uZWxcbiAgbGV0IGZlZWRiYWNrSGlzdG9yeUwgPSBnLmhpc3RvcnkoKVxuICBsZXQgZWNob0wgPSBnLmRlbGF5KCBnLmFkZCggbGVmdElucHV0LCBnLm11bCggZmVlZGJhY2tIaXN0b3J5TC5vdXQsIGZlZWRiYWNrICkgKSwgZGVsYXlUaW1lLCB7IHNpemU6cHJvcHMuZGVsYXlMZW5ndGggfSlcbiAgZmVlZGJhY2tIaXN0b3J5TC5pbiggZWNob0wgKVxuICBsZXQgbGVmdCA9IGcubWl4KCBsZWZ0SW5wdXQsIGVjaG9MLCB3ZXRkcnkgKVxuXG4gIGlmKCBpc1N0ZXJlbyApIHtcbiAgICAvLyByaWdodCBjaGFubmVsXG4gICAgbGV0IGZlZWRiYWNrSGlzdG9yeVIgPSBnLmhpc3RvcnkoKVxuICAgIGxldCBlY2hvUiA9IGcuZGVsYXkoIGcuYWRkKCByaWdodElucHV0LCBnLm11bCggZmVlZGJhY2tIaXN0b3J5Ui5vdXQsIGZlZWRiYWNrICkgKSwgZGVsYXlUaW1lLCB7IHNpemU6cHJvcHMuZGVsYXlMZW5ndGggfSlcbiAgICBmZWVkYmFja0hpc3RvcnlSLmluKCBlY2hvUiApXG4gICAgY29uc3QgcmlnaHQgPSBnLm1peCggcmlnaHRJbnB1dCwgZWNob1IsIHdldGRyeSApXG5cbiAgICBHaWJiZXJpc2guZmFjdG9yeSggXG4gICAgICBkZWxheSxcbiAgICAgIFsgbGVmdCwgcmlnaHQgXSwgXG4gICAgICAnZGVsYXknLCBcbiAgICAgIHByb3BzIFxuICAgIClcbiAgfWVsc2V7XG4gICAgR2liYmVyaXNoLmZhY3RvcnkoIGRlbGF5LCBsZWZ0LCAnZGVsYXknLCBwcm9wcyApXG4gIH1cbiAgXG4gIHJldHVybiBkZWxheVxufVxuXG5EZWxheS5kZWZhdWx0cyA9IHtcbiAgaW5wdXQ6MCxcbiAgZmVlZGJhY2s6Ljc1LFxuICBkZWxheVRpbWU6IDExMDI1LFxuICB3ZXRkcnk6IC41XG59XG5cbnJldHVybiBEZWxheVxuXG59XG4iLCJjb25zdCBnID0gcmVxdWlyZSgnZ2VuaXNoLmpzJyksXG4gICAgICBlZmZlY3QgPSByZXF1aXJlKCcuL2VmZmVjdC5qcycpO1xuXG5jb25zdCBnZW5pc2ggPSBnO1xuXG4vKlxuXG4gICAgICAgICBleHAoYXNpZyAqIChzaGFwZTEgKyBwcmVnYWluKSkgLSBleHAoYXNpZyAqIChzaGFwZTIgLSBwcmVnYWluKSlcbiAgYW91dCA9IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgZXhwKGFzaWcgKiBwcmVnYWluKSAgICAgICAgICAgICsgZXhwKC1hc2lnICogcHJlZ2FpbilcblxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoR2liYmVyaXNoKSB7XG5cbiAgbGV0IERpc3RvcnRpb24gPSBpbnB1dFByb3BzID0+IHtcbiAgICBsZXQgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBEaXN0b3J0aW9uLmRlZmF1bHRzLCBpbnB1dFByb3BzKSxcbiAgICAgICAgZGlzdG9ydGlvbiA9IE9iamVjdC5jcmVhdGUoZWZmZWN0KTtcblxuICAgIGxldCBpc1N0ZXJlbyA9IHByb3BzLmlucHV0LmlzU3RlcmVvICE9PSB1bmRlZmluZWQgPyBwcm9wcy5pbnB1dC5pc1N0ZXJlbyA6IHRydWU7XG5cbiAgICBjb25zdCBpbnB1dCA9IGcuaW4oJ2lucHV0JyksXG4gICAgICAgICAgc2hhcGUxID0gZy5pbignc2hhcGUxJyksXG4gICAgICAgICAgc2hhcGUyID0gZy5pbignc2hhcGUyJyksXG4gICAgICAgICAgcHJlZ2FpbiA9IGcuaW4oJ3ByZWdhaW4nKSxcbiAgICAgICAgICBwb3N0Z2FpbiA9IGcuaW4oJ3Bvc3RnYWluJyk7XG5cbiAgICBsZXQgbG91dDtcbiAgICB7XG4gICAgICAndXNlIGpzZHNwJztcbiAgICAgIGNvbnN0IGxpbnB1dCA9IGlzU3RlcmVvID8gaW5wdXRbMF0gOiBpbnB1dDtcbiAgICAgIGNvbnN0IGx0b3AgPSBnZW5pc2guc3ViKGcuZXhwKGdlbmlzaC5tdWwobGlucHV0LCBnZW5pc2guYWRkKHNoYXBlMSwgcHJlZ2FpbikpKSwgZy5leHAoZ2VuaXNoLm11bChsaW5wdXQsIGdlbmlzaC5zdWIoc2hhcGUyLCBwcmVnYWluKSkpKTtcbiAgICAgIGNvbnN0IGxib3R0b20gPSBnZW5pc2guYWRkKGcuZXhwKGdlbmlzaC5tdWwobGlucHV0LCBwcmVnYWluKSksIGcuZXhwKGdlbmlzaC5tdWwoZ2VuaXNoLm11bCgtMSwgbGlucHV0KSwgcHJlZ2FpbikpKTtcbiAgICAgIGxvdXQgPSBnZW5pc2gubXVsKGdlbmlzaC5kaXYobHRvcCwgbGJvdHRvbSksIHBvc3RnYWluKTtcbiAgICB9XG5cbiAgICBpZiAoaXNTdGVyZW8pIHtcbiAgICAgIGxldCByb3V0O1xuICAgICAge1xuICAgICAgICAndXNlIGpzZHNwJztcbiAgICAgICAgY29uc3QgcmlucHV0ID0gaXNTdGVyZW8gPyBpbnB1dFsxXSA6IGlucHV0O1xuICAgICAgICBjb25zdCBydG9wID0gZ2VuaXNoLnN1YihnLmV4cChnZW5pc2gubXVsKHJpbnB1dCwgZ2VuaXNoLmFkZChzaGFwZTEsIHByZWdhaW4pKSksIGcuZXhwKGdlbmlzaC5tdWwocmlucHV0LCBnZW5pc2guc3ViKHNoYXBlMiwgcHJlZ2FpbikpKSk7XG4gICAgICAgIGNvbnN0IHJib3R0b20gPSBnZW5pc2guYWRkKGcuZXhwKGdlbmlzaC5tdWwocmlucHV0LCBwcmVnYWluKSksIGcuZXhwKGdlbmlzaC5tdWwoZ2VuaXNoLm11bCgtMSwgcmlucHV0KSwgcHJlZ2FpbikpKTtcbiAgICAgICAgcm91dCA9IGdlbmlzaC5tdWwoZ2VuaXNoLmRpdihydG9wLCByYm90dG9tKSwgcG9zdGdhaW4pO1xuICAgICAgfVxuXG4gICAgICBHaWJiZXJpc2guZmFjdG9yeShkaXN0b3J0aW9uLCBbbG91dCwgcm91dF0sICdkaXN0b3J0aW9uJywgcHJvcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBHaWJiZXJpc2guZmFjdG9yeShkaXN0b3J0aW9uLCBsb3V0LCAnZGlzdG9ydGlvbicsIHByb3BzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlzdG9ydGlvbjtcbiAgfTtcblxuICBEaXN0b3J0aW9uLmRlZmF1bHRzID0ge1xuICAgIGlucHV0OiAwLFxuICAgIHNoYXBlMTogLjEsXG4gICAgc2hhcGUyOiAuMSxcbiAgICBwcmVnYWluOiA1LFxuICAgIHBvc3RnYWluOiAuNVxuICB9O1xuXG4gIHJldHVybiBEaXN0b3J0aW9uO1xufTsiLCJsZXQgdWdlbiA9IHJlcXVpcmUoICcuLi91Z2VuLmpzJyApXG5cbmxldCBlZmZlY3QgPSBPYmplY3QuY3JlYXRlKCB1Z2VuIClcblxuT2JqZWN0LmFzc2lnbiggZWZmZWN0LCB7XG5cbn0pXG5cbm1vZHVsZS5leHBvcnRzID0gZWZmZWN0XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG5cbiAgY29uc3QgZWZmZWN0cyA9IHtcbiAgICBGcmVldmVyYiAgICA6IHJlcXVpcmUoICcuL2ZyZWV2ZXJiLmpzJyAgKSggR2liYmVyaXNoICksXG4gICAgUGxhdGUgICAgICAgOiByZXF1aXJlKCAnLi9kYXR0b3Jyby5qcycgICkoIEdpYmJlcmlzaCApLFxuICAgIEZsYW5nZXIgICAgIDogcmVxdWlyZSggJy4vZmxhbmdlci5qcycgICApKCBHaWJiZXJpc2ggKSxcbiAgICBWaWJyYXRvICAgICA6IHJlcXVpcmUoICcuL3ZpYnJhdG8uanMnICAgKSggR2liYmVyaXNoICksXG4gICAgRGVsYXkgICAgICAgOiByZXF1aXJlKCAnLi9kZWxheS5qcycgICAgICkoIEdpYmJlcmlzaCApLFxuICAgIEJpdENydXNoZXIgIDogcmVxdWlyZSggJy4vYml0Q3J1c2hlci5qcycpKCBHaWJiZXJpc2ggKSxcbiAgICBEaXN0b3J0aW9uICA6IHJlcXVpcmUoICcuL2Rpc3RvcnRpb24uanMnKSggR2liYmVyaXNoICksXG4gICAgUmluZ01vZCAgICAgOiByZXF1aXJlKCAnLi9yaW5nTW9kLmpzJyAgICkoIEdpYmJlcmlzaCApLFxuICAgIFRyZW1vbG8gICAgIDogcmVxdWlyZSggJy4vdHJlbW9sby5qcycgICApKCBHaWJiZXJpc2ggKSxcbiAgICBDaG9ydXMgICAgICA6IHJlcXVpcmUoICcuL2Nob3J1cy5qcycgICAgKSggR2liYmVyaXNoICksXG4gICAgU2h1ZmZsZXIgICAgOiByZXF1aXJlKCAnLi9idWZmZXJTaHVmZmxlci5qcycgICkoIEdpYmJlcmlzaCApLFxuICAgIEdhdGUgICAgICAgIDogcmVxdWlyZSggJy4vZ2F0ZS5qcycgICAgICApKCBHaWJiZXJpc2ggKSxcbiAgfVxuXG4gIGVmZmVjdHMuZXhwb3J0ID0gdGFyZ2V0ID0+IHtcbiAgICBmb3IoIGxldCBrZXkgaW4gZWZmZWN0cyApIHtcbiAgICAgIGlmKCBrZXkgIT09ICdleHBvcnQnICkge1xuICAgICAgICB0YXJnZXRbIGtleSBdID0gZWZmZWN0c1sga2V5IF1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxucmV0dXJuIGVmZmVjdHNcblxufVxuIiwibGV0IGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApLFxuICAgIGVmZmVjdCA9IHJlcXVpcmUoICcuL2VmZmVjdC5qcycgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG4gXG5sZXQgRmxhbmdlciA9IGlucHV0UHJvcHMgPT4ge1xuICBsZXQgcHJvcHMgICA9IE9iamVjdC5hc3NpZ24oIHsgZGVsYXlMZW5ndGg6NDQxMDAgfSwgRmxhbmdlci5kZWZhdWx0cywgaW5wdXRQcm9wcyApLFxuICAgICAgZmxhbmdlciA9IE9iamVjdC5jcmVhdGUoIGVmZmVjdCApXG5cbiAgbGV0IGlzU3RlcmVvID0gcHJvcHMuaW5wdXQuaXNTdGVyZW8gIT09IHVuZGVmaW5lZCA/IHByb3BzLmlucHV0LmlzU3RlcmVvIDogdHJ1ZSBcbiAgXG4gIGxldCBpbnB1dCA9IGcuaW4oICdpbnB1dCcgKSxcbiAgICAgIGRlbGF5TGVuZ3RoID0gcHJvcHMuZGVsYXlMZW5ndGgsXG4gICAgICBmZWVkYmFja0NvZWZmID0gZy5pbiggJ2ZlZWRiYWNrJyApLFxuICAgICAgbW9kQW1vdW50ID0gZy5pbiggJ29mZnNldCcgKSxcbiAgICAgIGZyZXF1ZW5jeSA9IGcuaW4oICdmcmVxdWVuY3knICksXG4gICAgICBkZWxheUJ1ZmZlckwgPSBnLmRhdGEoIGRlbGF5TGVuZ3RoICksXG4gICAgICBkZWxheUJ1ZmZlclJcblxuICBsZXQgd3JpdGVJZHggPSBnLmFjY3VtKCAxLDAsIHsgbWluOjAsIG1heDpkZWxheUxlbmd0aCwgaW50ZXJwOidub25lJywgbW9kZTonc2FtcGxlcycgfSlcbiAgXG4gIGxldCBvZmZzZXQgPSBnLm11bCggbW9kQW1vdW50LCA1MDAgKVxuXG4gIGxldCBtb2QgPSBwcm9wcy5tb2QgPT09IHVuZGVmaW5lZCA/IGcuY3ljbGUoIGZyZXF1ZW5jeSApIDogcHJvcHMubW9kXG4gIFxuICBsZXQgcmVhZElkeCA9IGcud3JhcCggXG4gICAgZy5hZGQoIFxuICAgICAgZy5zdWIoIHdyaXRlSWR4LCBvZmZzZXQgKSwgXG4gICAgICBtb2QvL2cubXVsKCBtb2QsIGcuc3ViKCBvZmZzZXQsIDEgKSApIFxuICAgICksIFxuXHQgIDAsIFxuICAgIGRlbGF5TGVuZ3RoXG4gIClcblxuICBsZXQgbGVmdElucHV0ID0gaXNTdGVyZW8gPyBpbnB1dFswXSA6IGlucHV0XG5cbiAgbGV0IGRlbGF5ZWRPdXRMID0gZy5wZWVrKCBkZWxheUJ1ZmZlckwsIHJlYWRJZHgsIHsgaW50ZXJwOidsaW5lYXInLCBtb2RlOidzYW1wbGVzJyB9KVxuICBcbiAgZy5wb2tlKCBkZWxheUJ1ZmZlckwsIGcuYWRkKCBsZWZ0SW5wdXQsIGcubXVsKCBkZWxheWVkT3V0TCwgZmVlZGJhY2tDb2VmZiApICksIHdyaXRlSWR4IClcblxuICBsZXQgbGVmdCA9IGcuYWRkKCBsZWZ0SW5wdXQsIGRlbGF5ZWRPdXRMICksXG4gICAgICByaWdodFxuXG4gIGlmKCBpc1N0ZXJlbyA9PT0gdHJ1ZSApIHtcbiAgICByaWdodElucHV0ID0gaW5wdXRbMV1cbiAgICBkZWxheUJ1ZmZlclIgPSBnLmRhdGEoIGRlbGF5TGVuZ3RoIClcbiAgICBcbiAgICBsZXQgZGVsYXllZE91dFIgPSBnLnBlZWsoIGRlbGF5QnVmZmVyUiwgcmVhZElkeCwgeyBpbnRlcnA6J2xpbmVhcicsIG1vZGU6J3NhbXBsZXMnIH0pXG5cbiAgICBnLnBva2UoIGRlbGF5QnVmZmVyUiwgZy5hZGQoIHJpZ2h0SW5wdXQsIGcubXVsKCBkZWxheWVkT3V0UiwgZmVlZGJhY2tDb2VmZiApICksIHdyaXRlSWR4IClcbiAgICByaWdodCA9IGcuYWRkKCByaWdodElucHV0LCBkZWxheWVkT3V0UiApXG5cbiAgICBHaWJiZXJpc2guZmFjdG9yeSggXG4gICAgICBmbGFuZ2VyLFxuICAgICAgWyBsZWZ0LCByaWdodCBdLCBcbiAgICAgICdmbGFuZ2VyJywgXG4gICAgICBwcm9wcyBcbiAgICApXG5cbiAgfWVsc2V7XG4gICAgR2liYmVyaXNoLmZhY3RvcnkoIGZsYW5nZXIsIGxlZnQsICdmbGFuZ2VyJywgcHJvcHMgKVxuICB9XG4gIFxuICByZXR1cm4gZmxhbmdlclxufVxuXG5GbGFuZ2VyLmRlZmF1bHRzID0ge1xuICBpbnB1dDowLFxuICBmZWVkYmFjazouMDEsXG4gIG9mZnNldDouMjUsXG4gIGZyZXF1ZW5jeTouNVxufVxuXG5yZXR1cm4gRmxhbmdlclxuXG59XG4iLCJjb25zdCBnID0gcmVxdWlyZSggJ2dlbmlzaC5qcycgKSxcbiAgICAgIGVmZmVjdCA9IHJlcXVpcmUoICcuL2VmZmVjdC5qcycgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG4gIFxuY29uc3QgYWxsUGFzcyA9IEdpYmJlcmlzaC5maWx0ZXJzLmdlbmlzaC5BbGxQYXNzXG5jb25zdCBjb21iRmlsdGVyID0gR2liYmVyaXNoLmZpbHRlcnMuZ2VuaXNoLkNvbWJcblxuY29uc3QgdHVuaW5nID0ge1xuICBjb21iQ291bnQ6XHQgIFx0OCxcbiAgY29tYlR1bmluZzogXHRcdFsgMTExNiwgMTE4OCwgMTI3NywgMTM1NiwgMTQyMiwgMTQ5MSwgMTU1NywgMTYxNyBdLCAgICAgICAgICAgICAgICAgICAgXG4gIGFsbFBhc3NDb3VudDogXHQ0LFxuICBhbGxQYXNzVHVuaW5nOlx0WyAyMjUsIDU1NiwgNDQxLCAzNDEgXSxcbiAgYWxsUGFzc0ZlZWRiYWNrOjAuNSxcbiAgZml4ZWRHYWluOiBcdFx0ICAwLjAxNSxcbiAgc2NhbGVEYW1waW5nOiBcdDAuNCxcbiAgc2NhbGVSb29tOiBcdFx0ICAwLjI4LFxuICBvZmZzZXRSb29tOiBcdCAgMC43LFxuICBzdGVyZW9TcHJlYWQ6ICAgMjNcbn1cblxuY29uc3QgRnJlZXZlcmIgPSBpbnB1dFByb3BzID0+IHtcbiAgbGV0IHByb3BzID0gT2JqZWN0LmFzc2lnbigge30sIEZyZWV2ZXJiLmRlZmF1bHRzLCBpbnB1dFByb3BzICksXG4gICAgICByZXZlcmIgPSBPYmplY3QuY3JlYXRlKCBlZmZlY3QgKSBcbiAgIFxuICBsZXQgaXNTdGVyZW8gPSBwcm9wcy5pbnB1dC5pc1N0ZXJlbyAhPT0gdW5kZWZpbmVkID8gcHJvcHMuaW5wdXQuaXNTdGVyZW8gOiB0cnVlIFxuICBcbiAgbGV0IGNvbWJzTCA9IFtdLCBjb21ic1IgPSBbXVxuXG4gIGxldCBpbnB1dCA9IGcuaW4oICdpbnB1dCcgKSxcbiAgICAgIHdldDEgPSBnLmluKCAnd2V0MScpLCB3ZXQyID0gZy5pbiggJ3dldDInICksICBkcnkgPSBnLmluKCAnZHJ5JyApLCBcbiAgICAgIHJvb21TaXplID0gZy5pbiggJ3Jvb21TaXplJyApLCBkYW1waW5nID0gZy5pbiggJ2RhbXBpbmcnIClcbiAgXG4gIGxldCBzdW1tZWRJbnB1dCA9IGlzU3RlcmVvID09PSB0cnVlID8gZy5hZGQoIGlucHV0WzBdLCBpbnB1dFsxXSApIDogaW5wdXQsXG4gICAgICBhdHRlbnVhdGVkSW5wdXQgPSBnLm1lbW8oIGcubXVsKCBzdW1tZWRJbnB1dCwgdHVuaW5nLmZpeGVkR2FpbiApIClcbiAgXG4gIC8vIGNyZWF0ZSBjb21iIGZpbHRlcnMgaW4gcGFyYWxsZWwuLi5cbiAgZm9yKCBsZXQgaSA9IDA7IGkgPCA4OyBpKysgKSB7IFxuICAgIGNvbWJzTC5wdXNoKCBcbiAgICAgIGNvbWJGaWx0ZXIoIGF0dGVudWF0ZWRJbnB1dCwgdHVuaW5nLmNvbWJUdW5pbmdbaV0sIGcubXVsKGRhbXBpbmcsLjQpLCBnLm11bCggdHVuaW5nLnNjYWxlUm9vbSArIHR1bmluZy5vZmZzZXRSb29tLCByb29tU2l6ZSApICkgXG4gICAgKVxuICAgIGNvbWJzUi5wdXNoKCBcbiAgICAgIGNvbWJGaWx0ZXIoIGF0dGVudWF0ZWRJbnB1dCwgdHVuaW5nLmNvbWJUdW5pbmdbaV0gKyB0dW5pbmcuc3RlcmVvU3ByZWFkLCBnLm11bChkYW1waW5nLC40KSwgZy5tdWwoIHR1bmluZy5zY2FsZVJvb20gKyB0dW5pbmcub2Zmc2V0Um9vbSwgcm9vbVNpemUgKSApIFxuICAgIClcbiAgfVxuICBcbiAgLy8gLi4uIGFuZCBzdW0gdGhlbSB3aXRoIGF0dGVudWF0ZWQgaW5wdXRcbiAgbGV0IG91dEwgPSBnLmFkZCggYXR0ZW51YXRlZElucHV0LCAuLi5jb21ic0wgKVxuICBsZXQgb3V0UiA9IGcuYWRkKCBhdHRlbnVhdGVkSW5wdXQsIC4uLmNvbWJzUiApXG4gIFxuICAvLyBydW4gdGhyb3VnaCBhbGxwYXNzIGZpbHRlcnMgaW4gc2VyaWVzXG4gIGZvciggbGV0IGkgPSAwOyBpIDwgNDsgaSsrICkgeyBcbiAgICBvdXRMID0gYWxsUGFzcyggb3V0TCwgdHVuaW5nLmFsbFBhc3NUdW5pbmdbIGkgXSArIHR1bmluZy5zdGVyZW9TcHJlYWQgKVxuICAgIG91dFIgPSBhbGxQYXNzKCBvdXRSLCB0dW5pbmcuYWxsUGFzc1R1bmluZ1sgaSBdICsgdHVuaW5nLnN0ZXJlb1NwcmVhZCApXG4gIH1cbiAgXG4gIGxldCBvdXRwdXRMID0gZy5hZGQoIGcubXVsKCBvdXRMLCB3ZXQxICksIGcubXVsKCBvdXRSLCB3ZXQyICksIGcubXVsKCBpc1N0ZXJlbyA9PT0gdHJ1ZSA/IGlucHV0WzBdIDogaW5wdXQsIGRyeSApICksXG4gICAgICBvdXRwdXRSID0gZy5hZGQoIGcubXVsKCBvdXRSLCB3ZXQxICksIGcubXVsKCBvdXRMLCB3ZXQyICksIGcubXVsKCBpc1N0ZXJlbyA9PT0gdHJ1ZSA/IGlucHV0WzFdIDogaW5wdXQsIGRyeSApIClcblxuICBHaWJiZXJpc2guZmFjdG9yeSggcmV2ZXJiLCBbIG91dHB1dEwsIG91dHB1dFIgXSwgJ2ZyZWV2ZXJiJywgcHJvcHMgKVxuXG4gIHJldHVybiByZXZlcmJcbn1cblxuXG5GcmVldmVyYi5kZWZhdWx0cyA9IHtcbiAgaW5wdXQ6MCxcbiAgd2V0MTogMSxcbiAgd2V0MjogMCxcbiAgZHJ5OiAuNSxcbiAgcm9vbVNpemU6IC44NCxcbiAgZGFtcGluZzogIC41XG59XG5cbnJldHVybiBGcmVldmVyYiBcblxufVxuXG4iLCJsZXQgZyA9IHJlcXVpcmUoJ2dlbmlzaC5qcycpLFxuICAgIGVmZmVjdCA9IHJlcXVpcmUoJy4vZWZmZWN0LmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEdpYmJlcmlzaCkge1xuXG4gIGxldCBHYXRlID0gaW5wdXRQcm9wcyA9PiB7XG4gICAgbGV0IHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgR2F0ZS5kZWZhdWx0cywgaW5wdXRQcm9wcyksXG4gICAgICAgIGdhdGUgPSBPYmplY3QuY3JlYXRlKGVmZmVjdCk7XG5cbiAgICBsZXQgaXNTdGVyZW8gPSBwcm9wcy5pbnB1dC5pc1N0ZXJlbyAhPT0gdW5kZWZpbmVkID8gcHJvcHMuaW5wdXQuaXNTdGVyZW8gOiB0cnVlO1xuXG4gICAgbGV0IGlucHV0ID0gZy5pbignaW5wdXQnKSxcbiAgICAgICAgdGhyZXNob2xkID0gZy5pbigndGhyZXNob2xkJyk7XG5cbiAgICBsZXQgbGVmdElucHV0ID0gaXNTdGVyZW8gPyBpbnB1dFswXSA6IGlucHV0O1xuXG4gICAgbGV0IGxlZnRUaHJlc2hvbGQgPSBnLmd0cChnLmFicyhsZWZ0SW5wdXQpLCB0aHJlc2hvbGQpLFxuICAgICAgICBsZWZ0ID0gZy5zd2l0Y2goZy5uZXEobGVmdFRocmVzaG9sZCwgMCksIGxlZnRJbnB1dCwgMCk7XG5cbiAgICBpZiAoaXNTdGVyZW8gPT09IHRydWUpIHtcbiAgICAgIGxldCByaWdodElucHV0ID0gaW5wdXRbMV07XG4gICAgICBsZXQgcmlnaHRUaHJlc2hvbGQgPSBnLmd0cChnLmFicyhyaWdodElucHV0KSwgdGhyZXNob2xkKSxcbiAgICAgICAgICByaWdodCA9IGcuc3dpdGNoKGcubmVxKHJpZ2h0VGhyZXNob2xkLCAwKSwgcmlnaHRJbnB1dCwgMCk7XG5cbiAgICAgIC8qcmlnaHQgPSBnLmFkZCggZy5tdWwoIHJpZ2h0SW5wdXQsIGcuc3ViKCAxLCBtaXggKSksIGcubXVsKCBnLm11bCggcmlnaHRJbnB1dCwgc2luZSApLCBtaXggKSApICovXG5cbiAgICAgIEdpYmJlcmlzaC5mYWN0b3J5KGdhdGUsIFtsZWZ0LCByaWdodF0sICdnYXRlJywgcHJvcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBHaWJiZXJpc2guZmFjdG9yeShnYXRlLCBsZWZ0LCAnZ2F0ZScsIHByb3BzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2F0ZTtcbiAgfTtcblxuICBHYXRlLmRlZmF1bHRzID0ge1xuICAgIGlucHV0OiAwLFxuICAgIHRocmVzaG9sZDogLjFcbiAgfTtcblxuICByZXR1cm4gR2F0ZTtcbn07IiwibGV0IGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApLFxuICAgIGVmZmVjdCA9IHJlcXVpcmUoICcuL2VmZmVjdC5qcycgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG4gXG5sZXQgUmluZ01vZCA9IGlucHV0UHJvcHMgPT4ge1xuICBsZXQgcHJvcHMgICA9IE9iamVjdC5hc3NpZ24oIHt9LCBSaW5nTW9kLmRlZmF1bHRzLCBpbnB1dFByb3BzICksXG4gICAgICByaW5nTW9kID0gT2JqZWN0LmNyZWF0ZSggZWZmZWN0IClcblxuICBsZXQgaXNTdGVyZW8gPSBwcm9wcy5pbnB1dC5pc1N0ZXJlbyAhPT0gdW5kZWZpbmVkID8gcHJvcHMuaW5wdXQuaXNTdGVyZW8gOiB0cnVlIFxuICBcbiAgbGV0IGlucHV0ID0gZy5pbiggJ2lucHV0JyApLFxuICAgICAgZnJlcXVlbmN5ID0gZy5pbiggJ2ZyZXF1ZW5jeScgKSxcbiAgICAgIGdhaW4gPSBnLmluKCAnZ2FpbicgKSxcbiAgICAgIG1peCA9IGcuaW4oICdtaXgnIClcbiAgXG4gIGxldCBsZWZ0SW5wdXQgPSBpc1N0ZXJlbyA/IGlucHV0WzBdIDogaW5wdXQsXG4gICAgICBzaW5lID0gZy5tdWwoIGcuY3ljbGUoIGZyZXF1ZW5jeSApLCBnYWluIClcbiBcbiAgbGV0IGxlZnQgPSBnLmFkZCggZy5tdWwoIGxlZnRJbnB1dCwgZy5zdWIoIDEsIG1peCApKSwgZy5tdWwoIGcubXVsKCBsZWZ0SW5wdXQsIHNpbmUgKSwgbWl4ICkgKSwgXG4gICAgICByaWdodFxuXG4gIGlmKCBpc1N0ZXJlbyA9PT0gdHJ1ZSApIHtcbiAgICBsZXQgcmlnaHRJbnB1dCA9IGlucHV0WzFdXG4gICAgcmlnaHQgPSBnLmFkZCggZy5tdWwoIHJpZ2h0SW5wdXQsIGcuc3ViKCAxLCBtaXggKSksIGcubXVsKCBnLm11bCggcmlnaHRJbnB1dCwgc2luZSApLCBtaXggKSApIFxuICAgIFxuICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBcbiAgICAgIHJpbmdNb2QsXG4gICAgICBbIGxlZnQsIHJpZ2h0IF0sIFxuICAgICAgJ3JpbmdNb2QnLCBcbiAgICAgIHByb3BzIFxuICAgIClcbiAgfWVsc2V7XG4gICAgR2liYmVyaXNoLmZhY3RvcnkoIHJpbmdNb2QsIGxlZnQsICdyaW5nTW9kJywgcHJvcHMgKVxuICB9XG4gIFxuICByZXR1cm4gcmluZ01vZFxufVxuXG5SaW5nTW9kLmRlZmF1bHRzID0ge1xuICBpbnB1dDowLFxuICBmcmVxdWVuY3k6MjIwLFxuICBnYWluOiAxLCBcbiAgbWl4OjFcbn1cblxucmV0dXJuIFJpbmdNb2RcblxufVxuIiwiY29uc3QgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnICksXG4gICAgICBlZmZlY3QgPSByZXF1aXJlKCAnLi9lZmZlY3QuanMnIClcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggR2liYmVyaXNoICkge1xuIFxuY29uc3QgVHJlbW9sbyA9IGlucHV0UHJvcHMgPT4ge1xuICBjb25zdCBwcm9wcyAgID0gT2JqZWN0LmFzc2lnbigge30sIFRyZW1vbG8uZGVmYXVsdHMsIGlucHV0UHJvcHMgKSxcbiAgICAgICAgdHJlbW9sbyA9IE9iamVjdC5jcmVhdGUoIGVmZmVjdCApXG5cbiAgY29uc3QgaXNTdGVyZW8gPSBwcm9wcy5pbnB1dC5pc1N0ZXJlbyAhPT0gdW5kZWZpbmVkID8gcHJvcHMuaW5wdXQuaXNTdGVyZW8gOiB0cnVlIFxuICBcbiAgY29uc3QgaW5wdXQgPSBnLmluKCAnaW5wdXQnICksXG4gICAgICAgIGZyZXF1ZW5jeSA9IGcuaW4oICdmcmVxdWVuY3knICksXG4gICAgICAgIGFtb3VudCA9IGcuaW4oICdhbW91bnQnIClcbiAgXG4gIGNvbnN0IGxlZnRJbnB1dCA9IGlzU3RlcmVvID8gaW5wdXRbMF0gOiBpbnB1dFxuXG4gIGxldCBvc2NcbiAgaWYoIHByb3BzLnNoYXBlID09PSAnc3F1YXJlJyApIHtcbiAgICBvc2MgPSBnLmd0KCBnLnBoYXNvciggZnJlcXVlbmN5ICksIDAgKVxuICB9ZWxzZSBpZiggcHJvcHMuc2hhcGUgPT09ICdzYXcnICkge1xuICAgIG9zYyA9IGcuZ3RwKCBnLnBoYXNvciggZnJlcXVlbmN5ICksIDAgKVxuICB9ZWxzZXtcbiAgICBvc2MgPSBnLmN5Y2xlKCBmcmVxdWVuY3kgKVxuICB9XG5cbiAgY29uc3QgbW9kID0gZy5tdWwoIG9zYywgYW1vdW50IClcbiBcbiAgbGV0IGxlZnQgPSBnLnN1YiggbGVmdElucHV0LCBnLm11bCggbGVmdElucHV0LCBtb2QgKSApLCBcbiAgICAgIHJpZ2h0XG5cbiAgaWYoIGlzU3RlcmVvID09PSB0cnVlICkge1xuICAgIGxldCByaWdodElucHV0ID0gaW5wdXRbMV1cbiAgICByaWdodCA9IGcubXVsKCByaWdodElucHV0LCBtb2QgKVxuXG4gICAgR2liYmVyaXNoLmZhY3RvcnkoIFxuICAgICAgdHJlbW9sbyxcbiAgICAgIFsgbGVmdCwgcmlnaHQgXSwgXG4gICAgICAndHJlbW9sbycsIFxuICAgICAgcHJvcHMgXG4gICAgKVxuICB9ZWxzZXtcbiAgICBHaWJiZXJpc2guZmFjdG9yeSggdHJlbW9sbywgbGVmdCwgJ3RyZW1vbG8nLCBwcm9wcyApXG4gIH1cbiAgXG4gIHJldHVybiB0cmVtb2xvXG59XG5cblRyZW1vbG8uZGVmYXVsdHMgPSB7XG4gIGlucHV0OjAsXG4gIGZyZXF1ZW5jeToyLFxuICBhbW91bnQ6IDEsIFxuICBzaGFwZTonc2luZSdcbn1cblxucmV0dXJuIFRyZW1vbG9cblxufVxuIiwibGV0IGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApLFxuICAgIGVmZmVjdCA9IHJlcXVpcmUoICcuL2VmZmVjdC5qcycgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG4gXG5sZXQgVmlicmF0byA9IGlucHV0UHJvcHMgPT4ge1xuICBsZXQgcHJvcHMgICA9IE9iamVjdC5hc3NpZ24oIHt9LCBWaWJyYXRvLmRlZmF1bHRzLCBpbnB1dFByb3BzICksXG4gICAgICB2aWJyYXRvID0gT2JqZWN0LmNyZWF0ZSggZWZmZWN0IClcblxuICBsZXQgaXNTdGVyZW8gPSBwcm9wcy5pbnB1dC5pc1N0ZXJlbyAhPT0gdW5kZWZpbmVkID8gcHJvcHMuaW5wdXQuaXNTdGVyZW8gOiB0cnVlIFxuICBcbiAgbGV0IGlucHV0ID0gZy5pbiggJ2lucHV0JyApLFxuICAgICAgZGVsYXlMZW5ndGggPSA0NDEwMCxcbiAgICAgIGZlZWRiYWNrQ29lZmYgPSAuMDEsLy9nLmluKCAnZmVlZGJhY2snICksXG4gICAgICBtb2RBbW91bnQgPSBnLmluKCAnYW1vdW50JyApLFxuICAgICAgZnJlcXVlbmN5ID0gZy5pbiggJ2ZyZXF1ZW5jeScgKSxcbiAgICAgIGRlbGF5QnVmZmVyTCA9IGcuZGF0YSggZGVsYXlMZW5ndGggKSxcbiAgICAgIGRlbGF5QnVmZmVyUlxuXG4gIGxldCB3cml0ZUlkeCA9IGcuYWNjdW0oIDEsMCwgeyBtaW46MCwgbWF4OmRlbGF5TGVuZ3RoLCBpbnRlcnA6J25vbmUnLCBtb2RlOidzYW1wbGVzJyB9KVxuICBcbiAgbGV0IG9mZnNldCA9IGcubXVsKCBtb2RBbW91bnQsIDUwMCApXG4gIFxuICBsZXQgcmVhZElkeCA9IGcud3JhcCggXG4gICAgZy5hZGQoIFxuICAgICAgZy5zdWIoIHdyaXRlSWR4LCBvZmZzZXQgKSwgXG4gICAgICBnLm11bCggZy5jeWNsZSggZnJlcXVlbmN5ICksIGcuc3ViKCBvZmZzZXQsIDEgKSApIFxuICAgICksIFxuXHQgIDAsIFxuICAgIGRlbGF5TGVuZ3RoXG4gIClcblxuICBsZXQgbGVmdElucHV0ID0gaXNTdGVyZW8gPyBpbnB1dFswXSA6IGlucHV0XG5cbiAgbGV0IGRlbGF5ZWRPdXRMID0gZy5wZWVrKCBkZWxheUJ1ZmZlckwsIHJlYWRJZHgsIHsgaW50ZXJwOidsaW5lYXInLCBtb2RlOidzYW1wbGVzJyB9KVxuICBcbiAgZy5wb2tlKCBkZWxheUJ1ZmZlckwsIGcuYWRkKCBsZWZ0SW5wdXQsIGcubXVsKCBkZWxheWVkT3V0TCwgZmVlZGJhY2tDb2VmZiApICksIHdyaXRlSWR4IClcblxuICBsZXQgbGVmdCA9IGRlbGF5ZWRPdXRMLFxuICAgICAgcmlnaHRcblxuICBpZiggaXNTdGVyZW8gPT09IHRydWUgKSB7XG4gICAgcmlnaHRJbnB1dCA9IGlucHV0WzFdXG4gICAgZGVsYXlCdWZmZXJSID0gZy5kYXRhKCBkZWxheUxlbmd0aCApXG4gICAgXG4gICAgbGV0IGRlbGF5ZWRPdXRSID0gZy5wZWVrKCBkZWxheUJ1ZmZlclIsIHJlYWRJZHgsIHsgaW50ZXJwOidsaW5lYXInLCBtb2RlOidzYW1wbGVzJyB9KVxuXG4gICAgZy5wb2tlKCBkZWxheUJ1ZmZlclIsIGcuYWRkKCByaWdodElucHV0LCBtdWwoIGRlbGF5ZWRPdXRSLCBmZWVkYmFja0NvZWZmICkgKSwgd3JpdGVJZHggKVxuICAgIHJpZ2h0ID0gZGVsYXllZE91dFJcblxuICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBcbiAgICAgIHZpYnJhdG8sXG4gICAgICBbIGxlZnQsIHJpZ2h0IF0sIFxuICAgICAgJ3ZpYnJhdG8nLCBcbiAgICAgIHByb3BzIFxuICAgIClcbiAgfWVsc2V7XG4gICAgR2liYmVyaXNoLmZhY3RvcnkoIHZpYnJhdG8sIGxlZnQsICd2aWJyYXRvJywgcHJvcHMgKVxuICB9XG4gIFxuICByZXR1cm4gdmlicmF0b1xufVxuXG5WaWJyYXRvLmRlZmF1bHRzID0ge1xuICBpbnB1dDowLFxuICAvL2ZlZWRiYWNrOi4wMSxcbiAgYW1vdW50Oi41LFxuICBmcmVxdWVuY3k6NFxufVxuXG5yZXR1cm4gVmlicmF0b1xuXG59XG4iLCJsZXQgTWVtb3J5SGVscGVyID0gcmVxdWlyZSggJ21lbW9yeS1oZWxwZXInICksXG4gICAgZ2VuaXNoICAgICAgID0gcmVxdWlyZSggJ2dlbmlzaC5qcycgKVxuICAgIFxubGV0IEdpYmJlcmlzaCA9IHtcbiAgYmxvY2tDYWxsYmFja3M6IFtdLCAvLyBjYWxsZWQgZXZlcnkgYmxvY2tcbiAgZGlydHlVZ2VuczogW10sXG4gIGNhbGxiYWNrVWdlbnM6IFtdLFxuICBjYWxsYmFja05hbWVzOiBbXSxcbiAgYW5hbHl6ZXJzOiBbXSxcbiAgZ3JhcGhJc0RpcnR5OiBmYWxzZSxcbiAgdWdlbnM6IHt9LFxuICBkZWJ1ZzogZmFsc2UsXG5cbiAgb3V0cHV0OiBudWxsLFxuXG4gIG1lbW9yeSA6IG51bGwsIC8vIDIwIG1pbnV0ZXMgYnkgZGVmYXVsdD9cbiAgZmFjdG9yeTogbnVsbCwgXG4gIGdlbmlzaCxcbiAgc2NoZWR1bGVyOiByZXF1aXJlKCAnLi9zY2hlZHVsaW5nL3NjaGVkdWxlci5qcycgKSxcblxuICBtZW1vZWQ6IHt9LFxuXG4gIHByb3RvdHlwZXM6IHtcbiAgICB1Z2VuOiByZXF1aXJlKCcuL3VnZW4uanMnKSxcbiAgICBpbnN0cnVtZW50OiByZXF1aXJlKCAnLi9pbnN0cnVtZW50cy9pbnN0cnVtZW50LmpzJyApLFxuICAgIGVmZmVjdDogcmVxdWlyZSggJy4vZngvZWZmZWN0LmpzJyApLFxuICB9LFxuXG4gIG1peGluczoge1xuICAgIHBvbHlpbnN0cnVtZW50OiByZXF1aXJlKCAnLi9pbnN0cnVtZW50cy9wb2x5TWl4aW4uanMnIClcbiAgfSxcblxuICBpbml0KCBtZW1BbW91bnQgKSB7XG4gICAgbGV0IG51bUJ5dGVzID0gbWVtQW1vdW50ID09PSB1bmRlZmluZWQgPyAyMCAqIDYwICogNDQxMDAgOiBtZW1BbW91bnRcblxuICAgIHRoaXMubWVtb3J5ID0gTWVtb3J5SGVscGVyLmNyZWF0ZSggbnVtQnl0ZXMgKVxuXG4gICAgdGhpcy5sb2FkKClcbiAgICBcbiAgICB0aGlzLm91dHB1dCA9IHRoaXMuQnVzMigpXG5cbiAgICB0aGlzLnV0aWxpdGllcy5jcmVhdGVDb250ZXh0KClcbiAgICB0aGlzLnV0aWxpdGllcy5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoKVxuXG4gICAgdGhpcy5hbmFseXplcnMuZGlydHkgPSBmYWxzZVxuXG4gICAgLy8gWFhYIEZPUiBERVZFTE9QTUVOVCBBTkQgVEVTVElORyBPTkxZLi4uIFJFTU9WRSBGT1IgUFJPRFVDVElPTlxuICAgIHRoaXMuZXhwb3J0KCB3aW5kb3cgKVxuICB9LFxuXG4gIGxvYWQoKSB7XG4gICAgdGhpcy5mYWN0b3J5ID0gcmVxdWlyZSggJy4vdWdlblRlbXBsYXRlLmpzJyApKCB0aGlzIClcblxuICAgIHRoaXMuUG9seVRlbXBsYXRlID0gcmVxdWlyZSggJy4vaW5zdHJ1bWVudHMvcG9seXRlbXBsYXRlLmpzJyApKCB0aGlzIClcbiAgICB0aGlzLm9zY2lsbGF0b3JzICA9IHJlcXVpcmUoICcuL29zY2lsbGF0b3JzL29zY2lsbGF0b3JzLmpzJyApKCB0aGlzIClcbiAgICB0aGlzLmZpbHRlcnMgICAgICA9IHJlcXVpcmUoICcuL2ZpbHRlcnMvZmlsdGVycy5qcycgKSggdGhpcyApXG4gICAgdGhpcy5iaW5vcHMgICAgICAgPSByZXF1aXJlKCAnLi9taXNjL2Jpbm9wcy5qcycgKSggdGhpcyApXG4gICAgdGhpcy5tb25vcHMgICAgICAgPSByZXF1aXJlKCAnLi9taXNjL21vbm9wcy5qcycgKSggdGhpcyApXG4gICAgdGhpcy5CdXMgICAgICAgICAgPSByZXF1aXJlKCAnLi9taXNjL2J1cy5qcycgKSggdGhpcyApXG4gICAgdGhpcy5CdXMyICAgICAgICAgPSByZXF1aXJlKCAnLi9taXNjL2J1czIuanMnICkoIHRoaXMgKTtcbiAgICB0aGlzLmluc3RydW1lbnRzICA9IHJlcXVpcmUoICcuL2luc3RydW1lbnRzL2luc3RydW1lbnRzLmpzJyApKCB0aGlzIClcbiAgICB0aGlzLmZ4ICAgICAgICAgICA9IHJlcXVpcmUoICcuL2Z4L2VmZmVjdHMuanMnICkoIHRoaXMgKVxuICAgIHRoaXMuU2VxdWVuY2VyICAgID0gcmVxdWlyZSggJy4vc2NoZWR1bGluZy9zZXF1ZW5jZXIuanMnICkoIHRoaXMgKTtcbiAgICB0aGlzLlNlcXVlbmNlcjIgICA9IHJlcXVpcmUoICcuL3NjaGVkdWxpbmcvc2VxMi5qcycgKSggdGhpcyApO1xuICAgIHRoaXMuZW52ZWxvcGVzICAgID0gcmVxdWlyZSggJy4vZW52ZWxvcGVzL2VudmVsb3Blcy5qcycgKSggdGhpcyApO1xuICAgIHRoaXMuYW5hbHlzaXMgICAgID0gcmVxdWlyZSggJy4vYW5hbHlzaXMvYW5hbHl6ZXJzLmpzJyApKCB0aGlzIClcbiAgICB0aGlzLnRpbWUgICAgICAgICA9IHJlcXVpcmUoICcuL21pc2MvdGltZS5qcycgKSggdGhpcyApXG4gIH0sXG5cbiAgZXhwb3J0KCB0YXJnZXQsIHNob3VsZEV4cG9ydEdlbmlzaD1mYWxzZSApIHtcbiAgICBpZiggdGFyZ2V0ID09PSB1bmRlZmluZWQgKSB0aHJvdyBFcnJvcignWW91IG11c3QgZGVmaW5lIGEgdGFyZ2V0IG9iamVjdCBmb3IgR2liYmVyaXNoIHRvIGV4cG9ydCB2YXJpYWJsZXMgdG8uJylcblxuICAgIGlmKCBzaG91bGRFeHBvcnRHZW5pc2ggKSB0aGlzLmdlbmlzaC5leHBvcnQoIHRhcmdldCApXG5cbiAgICB0aGlzLmluc3RydW1lbnRzLmV4cG9ydCggdGFyZ2V0IClcbiAgICB0aGlzLmZ4LmV4cG9ydCggdGFyZ2V0IClcbiAgICB0aGlzLmZpbHRlcnMuZXhwb3J0KCB0YXJnZXQgKVxuICAgIHRoaXMub3NjaWxsYXRvcnMuZXhwb3J0KCB0YXJnZXQgKVxuICAgIHRoaXMuYmlub3BzLmV4cG9ydCggdGFyZ2V0IClcbiAgICB0aGlzLm1vbm9wcy5leHBvcnQoIHRhcmdldCApXG4gICAgdGhpcy5lbnZlbG9wZXMuZXhwb3J0KCB0YXJnZXQgKVxuICAgIHRoaXMuYW5hbHlzaXMuZXhwb3J0KCB0YXJnZXQgKVxuICAgIHRhcmdldC5TZXF1ZW5jZXIgPSB0aGlzLlNlcXVlbmNlclxuICAgIHRhcmdldC5TZXF1ZW5jZXIyID0gdGhpcy5TZXF1ZW5jZXIyXG4gICAgdGFyZ2V0LkJ1cyA9IHRoaXMuQnVzXG4gICAgdGFyZ2V0LkJ1czIgPSB0aGlzLkJ1czJcbiAgICB0YXJnZXQuU2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXJcbiAgICB0aGlzLnRpbWUuZXhwb3J0KCB0YXJnZXQgKVxuICB9LFxuXG4gIHByaW50KCkge1xuICAgIGNvbnNvbGUubG9nKCB0aGlzLmNhbGxiYWNrLnRvU3RyaW5nKCkgKVxuICB9LFxuXG4gIGRpcnR5KCB1Z2VuICkge1xuICAgIGlmKCB1Z2VuID09PSB0aGlzLmFuYWx5emVycyApIHtcbiAgICAgIHRoaXMuZ3JhcGhJc0RpcnR5ID0gdHJ1ZVxuICAgICAgdGhpcy5hbmFseXplcnMuZGlydHkgPSB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlydHlVZ2Vucy5wdXNoKCB1Z2VuIClcbiAgICAgIHRoaXMuZ3JhcGhJc0RpcnR5ID0gdHJ1ZVxuICAgICAgaWYoIHRoaXMubWVtb2VkWyB1Z2VuLnVnZW5OYW1lIF0gKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLm1lbW9lZFsgdWdlbi51Z2VuTmFtZSBdXG4gICAgICB9XG4gICAgfSBcbiAgfSxcblxuICBjbGVhcigpIHtcbiAgICB0aGlzLm91dHB1dC5pbnB1dHMgPSBbMF1cbiAgICB0aGlzLm91dHB1dC5pbnB1dE5hbWVzLmxlbmd0aCA9IDBcbiAgICB0aGlzLmFuYWx5emVycy5sZW5ndGggPSAwXG4gICAgdGhpcy5zY2hlZHVsZXIuY2xlYXIoKVxuICAgIHRoaXMuZGlydHkoIHRoaXMub3V0cHV0IClcbiAgfSxcblxuICBnZW5lcmF0ZUNhbGxiYWNrKCkge1xuICAgIGxldCB1aWQgPSAwLFxuICAgICAgICBjYWxsYmFja0JvZHksIGxhc3RMaW5lLCBhbmFseXNpcz0nJ1xuXG4gICAgdGhpcy5tZW1vZWQgPSB7fVxuXG4gICAgY2FsbGJhY2tCb2R5ID0gdGhpcy5wcm9jZXNzR3JhcGgoIHRoaXMub3V0cHV0IClcbiAgICBsYXN0TGluZSA9IGNhbGxiYWNrQm9keVsgY2FsbGJhY2tCb2R5Lmxlbmd0aCAtIDFdXG4gICAgY2FsbGJhY2tCb2R5LnVuc2hpZnQoIFwiXFx0J3VzZSBzdHJpY3QnO1wiIClcblxuICAgIHRoaXMuYW5hbHl6ZXJzLmZvckVhY2goIHY9PiB7XG4gICAgICBjb25zdCBhbmFseXNpc0Jsb2NrID0gR2liYmVyaXNoLnByb2Nlc3NVZ2VuKCB2IClcbiAgICAgIGNvbnN0IGFuYWx5c2lzTGluZSA9IGFuYWx5c2lzQmxvY2sucG9wKClcblxuICAgICAgYW5hbHlzaXNCbG9jay5mb3JFYWNoKCB2PT4ge1xuICAgICAgICBjYWxsYmFja0JvZHkuc3BsaWNlKCBjYWxsYmFja0JvZHkubGVuZ3RoIC0gMSwgMCwgdiApXG4gICAgICB9KVxuXG4gICAgICBjYWxsYmFja0JvZHkucHVzaCggYW5hbHlzaXNMaW5lIClcbiAgICB9KVxuXG4gICAgdGhpcy5hbmFseXplcnMuZm9yRWFjaCggdiA9PiB7XG4gICAgICBpZiggdGhpcy5jYWxsYmFja1VnZW5zLmluZGV4T2YoIHYuY2FsbGJhY2sgKSA9PT0gLTEgKVxuICAgICAgICB0aGlzLmNhbGxiYWNrVWdlbnMucHVzaCggdi5jYWxsYmFjayApXG4gICAgfSlcbiAgICB0aGlzLmNhbGxiYWNrTmFtZXMgPSB0aGlzLmNhbGxiYWNrVWdlbnMubWFwKCB2ID0+IHYudWdlbk5hbWUgKVxuXG4gICAgY2FsbGJhY2tCb2R5LnB1c2goICdcXG5cXHRyZXR1cm4gJyArIGxhc3RMaW5lLnNwbGl0KCAnPScgKVswXS5zcGxpdCggJyAnIClbMV0gKVxuXG4gICAgaWYoIHRoaXMuZGVidWcgKSBjb25zb2xlLmxvZyggJ2NhbGxiYWNrOlxcbicsIGNhbGxiYWNrQm9keS5qb2luKCdcXG4nKSApXG4gICAgdGhpcy5jYWxsYmFja05hbWVzLnB1c2goICdtZW1vcnknIClcbiAgICB0aGlzLmNhbGxiYWNrVWdlbnMucHVzaCggdGhpcy5tZW1vcnkuaGVhcCApXG4gICAgdGhpcy5jYWxsYmFjayA9IEZ1bmN0aW9uKCAuLi50aGlzLmNhbGxiYWNrTmFtZXMsIGNhbGxiYWNrQm9keS5qb2luKCAnXFxuJyApIClcbiAgICB0aGlzLmNhbGxiYWNrLm91dCA9IFtdXG5cbiAgICBpZiggdGhpcy5vbmNhbGxiYWNrICkgdGhpcy5vbmNhbGxiYWNrKCB0aGlzLmNhbGxiYWNrIClcblxuICAgIHJldHVybiB0aGlzLmNhbGxiYWNrIFxuICB9LFxuXG4gIHByb2Nlc3NHcmFwaCggb3V0cHV0ICkge1xuICAgIHRoaXMuY2FsbGJhY2tVZ2Vucy5sZW5ndGggPSAwXG4gICAgdGhpcy5jYWxsYmFja05hbWVzLmxlbmd0aCA9IDBcblxuICAgIHRoaXMuY2FsbGJhY2tVZ2Vucy5wdXNoKCBvdXRwdXQuY2FsbGJhY2sgKVxuXG4gICAgbGV0IGJvZHkgPSB0aGlzLnByb2Nlc3NVZ2VuKCBvdXRwdXQgKVxuICAgIFxuXG4gICAgdGhpcy5kaXJ0eVVnZW5zLmxlbmd0aCA9IDBcbiAgICB0aGlzLmdyYXBoSXNEaXJ0eSA9IGZhbHNlXG5cbiAgICByZXR1cm4gYm9keVxuICB9LFxuXG4gIHByb2Nlc3NVZ2VuKCB1Z2VuLCBibG9jayApIHtcbiAgICBpZiggYmxvY2sgPT09IHVuZGVmaW5lZCApIGJsb2NrID0gW11cblxuICAgIGxldCBkaXJ0eUlkeCA9IEdpYmJlcmlzaC5kaXJ0eVVnZW5zLmluZGV4T2YoIHVnZW4gKVxuXG4gICAgLy9jb25zb2xlLmxvZyggJ3VnZW5OYW1lOicsIHVnZW4udWdlbk5hbWUgKVxuICAgIGxldCBtZW1vID0gR2liYmVyaXNoLm1lbW9lZFsgdWdlbi51Z2VuTmFtZSBdXG5cbiAgICBpZiggbWVtbyAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgcmV0dXJuIG1lbW9cbiAgICB9IGVsc2UgaWYgKHVnZW4gPT09IHRydWUgfHwgdWdlbiA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IFwiV2h5IGlzIHVnZW4gYSBib29sZWFuPyBbdHJ1ZV0gb3IgW2ZhbHNlXVwiO1xuICAgIH0gZWxzZSBpZiggdWdlbi5ibG9jayA9PT0gdW5kZWZpbmVkIHx8IGRpcnR5SW5kZXggIT09IC0xICkge1xuICBcbiAgICAgIGxldCBsaW5lID0gYFxcdHZhciB2XyR7dWdlbi5pZH0gPSBgIFxuICAgICAgXG4gICAgICBpZiggIXVnZW4uYmlub3AgKSBsaW5lICs9IGAke3VnZW4udWdlbk5hbWV9KCBgXG5cbiAgICAgIC8vIG11c3QgZ2V0IGFycmF5IHNvIHdlIGNhbiBrZWVwIHRyYWNrIG9mIGxlbmd0aCBmb3IgY29tbWEgaW5zZXJ0aW9uXG4gICAgICBsZXQga2V5cyxlcnJcbiAgICAgIFxuICAgICAgLy90cnkge1xuICAgICAga2V5cyA9IHVnZW4uYmlub3AgfHwgdWdlbi50eXBlID09PSAnYnVzJyB8fCB1Z2VuLnR5cGUgPT09ICdhbmFseXNpcycgPyBPYmplY3Qua2V5cyggdWdlbi5pbnB1dHMgKSA6IE9iamVjdC5rZXlzKCB1Z2VuLmlucHV0TmFtZXMgKVxuXG4gICAgICAvL31jYXRjaCggZSApe1xuXG4gICAgICAvLyAgY29uc29sZS5sb2coIGUgKVxuICAgICAgLy8gIGVyciA9IHRydWVcbiAgICAgIC8vfVxuICAgICAgXG4gICAgICAvL2lmKCBlcnIgPT09IHRydWUgKSByZXR1cm5cblxuICAgICAgZm9yKCBsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICBsZXQga2V5ID0ga2V5c1sgaSBdXG4gICAgICAgIC8vIGJpbm9wLmlucHV0cyBpcyBhY3R1YWwgdmFsdWVzLCBub3QganVzdCBwcm9wZXJ0eSBuYW1lc1xuICAgICAgICBsZXQgaW5wdXQgXG4gICAgICAgIGlmKCB1Z2VuLmJpbm9wIHx8IHVnZW4udHlwZSA9PT0nYnVzJyApIHtcbiAgICAgICAgICBpbnB1dCA9IHVnZW4uaW5wdXRzWyBrZXkgXVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAvL2lmKCBrZXkgPT09ICdtZW1vcnknICkgY29udGludWU7XG4gIFxuICAgICAgICAgIGlucHV0ID0gdWdlblsgdWdlbi5pbnB1dE5hbWVzWyBrZXkgXSBdXG4gICAgICAgIH1cblxuICAgICAgICBpZiggaW5wdXQgIT09IHVuZGVmaW5lZCApIHsgXG4gICAgICAgICAgaWYoIHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgICAgIGxpbmUgKz0gaW5wdXRcbiAgICAgICAgICB9IGVsc2UgaWYoIHR5cGVvZiBpbnB1dCA9PT0gJ2Jvb2xlYW4nICkge1xuICAgICAgICAgICAgICBsaW5lICs9IFwiXCIraW5wdXRcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coICdrZXk6Jywga2V5LCAnaW5wdXQ6JywgdWdlbi5pbnB1dHMsIHVnZW4uaW5wdXRzWyBrZXkgXSApIFxuXG4gICAgICAgICAgICBHaWJiZXJpc2gucHJvY2Vzc1VnZW4oIGlucHV0LCBibG9jayApXG5cbiAgICAgICAgICAgIC8vaWYoIGlucHV0LmNhbGxiYWNrID09PSB1bmRlZmluZWQgKSBjb250aW51ZVxuXG4gICAgICAgICAgICBpZiggIWlucHV0LmJpbm9wICkge1xuICAgICAgICAgICAgICAvLyBjaGVjayBpcyBuZWVkZWQgc28gdGhhdCBncmFwaHMgd2l0aCBzc2RzIHRoYXQgcmVmZXIgdG8gdGhlbXNlbHZlc1xuICAgICAgICAgICAgICAvLyBkb24ndCBhZGQgdGhlIHNzZCBpbiBtb3JlIHRoYW4gb25jZVxuICAgICAgICAgICAgICBpZiggR2liYmVyaXNoLmNhbGxiYWNrVWdlbnMuaW5kZXhPZiggaW5wdXQuY2FsbGJhY2sgKSA9PT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgR2liYmVyaXNoLmNhbGxiYWNrVWdlbnMucHVzaCggaW5wdXQuY2FsbGJhY2sgKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpbmUgKz0gYHZfJHtpbnB1dC5pZH1gXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYoIGkgPCBrZXlzLmxlbmd0aCAtIDEgKSB7XG4gICAgICAgICAgICBsaW5lICs9IHVnZW4uYmlub3AgPyAnICcgKyB1Z2VuLm9wICsgJyAnIDogJywgJyBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy9pZiggdWdlbi50eXBlID09PSAnYnVzJyApIGxpbmUgKz0gJywgJyBcbiAgICAgIGlmKCB1Z2VuLnR5cGUgPT09ICdhbmFseXNpcycgKSBsaW5lICs9ICcsJ1xuICAgICAgaWYoICF1Z2VuLmJpbm9wICYmIHVnZW4udHlwZSAhPT0gJ2J1cycgJiYgdWdlbi50eXBlICE9PSAnc2VxJyApIGxpbmUgKz0gJ21lbW9yeSdcbiAgICAgIGxpbmUgKz0gdWdlbi5iaW5vcCA/ICcnIDogJyApJ1xuXG4gICAgICBibG9jay5wdXNoKCBsaW5lIClcbiAgICAgIFxuICAgICAgLy9jb25zb2xlLmxvZyggJ21lbW86JywgdWdlbi51Z2VuTmFtZSApXG4gICAgICBHaWJiZXJpc2gubWVtb2VkWyB1Z2VuLnVnZW5OYW1lIF0gPSBgdl8ke3VnZW4uaWR9YFxuXG4gICAgICBpZiggZGlydHlJZHggIT09IC0xICkge1xuICAgICAgICBHaWJiZXJpc2guZGlydHlVZ2Vucy5zcGxpY2UoIGRpcnR5SWR4LCAxIClcbiAgICAgIH1cblxuICAgIH1lbHNlIGlmKCB1Z2VuLmJsb2NrICkge1xuICAgICAgcmV0dXJuIHVnZW4uYmxvY2tcbiAgICB9XG5cbiAgICByZXR1cm4gYmxvY2tcbiAgfSxcbiAgICBcbn1cblxuR2liYmVyaXNoLnV0aWxpdGllcyA9IHJlcXVpcmUoICcuL3V0aWxpdGllcy5qcycgKSggR2liYmVyaXNoIClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEdpYmJlcmlzaFxuIiwibGV0IGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApLFxuICAgIGluc3RydW1lbnQgPSByZXF1aXJlKCAnLi9pbnN0cnVtZW50LmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBsZXQgQ29uZ2EgPSBhcmd1bWVudFByb3BzID0+IHtcbiAgICBsZXQgY29uZ2EgPSBPYmplY3QuY3JlYXRlKCBpbnN0cnVtZW50ICksXG4gICAgICAgIGZyZXF1ZW5jeSA9IGcuaW4oICdmcmVxdWVuY3knICksXG4gICAgICAgIGRlY2F5ID0gZy5pbiggJ2RlY2F5JyApLFxuICAgICAgICBnYWluICA9IGcuaW4oICdnYWluJyApXG5cbiAgICBsZXQgcHJvcHMgPSBPYmplY3QuYXNzaWduKCB7fSwgQ29uZ2EuZGVmYXVsdHMsIGFyZ3VtZW50UHJvcHMgKVxuXG4gICAgbGV0IHRyaWdnZXIgPSBnLmJhbmcoKSxcbiAgICAgICAgaW1wdWxzZSA9IGcubXVsKCB0cmlnZ2VyLCA2MCApLFxuICAgICAgICBfZGVjYXkgPSAgZy5zdWIoIC4xMDEsIGcuZGl2KCBkZWNheSwgMTAgKSApLCAvLyBjcmVhdGUgcmFuZ2Ugb2YgLjAwMSAtIC4wOTlcbiAgICAgICAgYnBmID0gZy5zdmYoIGltcHVsc2UsIGZyZXF1ZW5jeSwgX2RlY2F5LCAyLCBmYWxzZSApLFxuICAgICAgICBvdXQgPSBnLm11bCggYnBmLCBnYWluIClcbiAgICBcbiAgICBHaWJiZXJpc2guZmFjdG9yeSggY29uZ2EsIG91dCwgJ2NvbmdhJywgcHJvcHMgIClcbiAgICBcbiAgICBjb25nYS5lbnYgPSB0cmlnZ2VyXG5cbiAgICByZXR1cm4gY29uZ2FcbiAgfVxuICBcbiAgQ29uZ2EuZGVmYXVsdHMgPSB7XG4gICAgZ2FpbjogLjI1LFxuICAgIGZyZXF1ZW5jeToxOTAsXG4gICAgZGVjYXk6IC44NVxuICB9XG5cbiAgcmV0dXJuIENvbmdhXG5cbn1cbiIsImxldCBnID0gcmVxdWlyZSggJ2dlbmlzaC5qcycgKSxcbiAgICBpbnN0cnVtZW50ID0gcmVxdWlyZSggJy4vaW5zdHJ1bWVudC5qcycgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG5cbiAgY29uc3QgQ293YmVsbCA9IGFyZ3VtZW50UHJvcHMgPT4ge1xuICAgIGNvbnN0IGNvd2JlbGwgPSBPYmplY3QuY3JlYXRlKCBpbnN0cnVtZW50ICksXG4gICAgICAgICAgZGVjYXkgICA9IGcuaW4oICdkZWNheScgKSxcbiAgICAgICAgICBnYWluICAgID0gZy5pbiggJ2dhaW4nIClcblxuICAgIGNvbnN0IHByb3BzID0gT2JqZWN0LmFzc2lnbigge30sIENvd2JlbGwuZGVmYXVsdHMsIGFyZ3VtZW50UHJvcHMgKVxuXG4gICAgY29uc3QgYnBmQ3V0b2ZmID0gZy5wYXJhbSggJ2JwZmMnLCAxMDAwICksXG4gICAgICAgICAgczEgPSBHaWJiZXJpc2gub3NjaWxsYXRvcnMuZmFjdG9yeSggJ3NxdWFyZScsIDU2MCApLFxuICAgICAgICAgIHMyID0gR2liYmVyaXNoLm9zY2lsbGF0b3JzLmZhY3RvcnkoICdzcXVhcmUnLCA4NDUgKSxcbiAgICAgICAgICBlZyA9IGcuZGVjYXkoIGcubXVsKCBkZWNheSwgZy5nZW4uc2FtcGxlcmF0ZSAqIDIgKSApLCBcbiAgICAgICAgICBicGYgPSBnLnN2ZiggZy5hZGQoIHMxLHMyICksIGJwZkN1dG9mZiwgMywgMiwgZmFsc2UgKSxcbiAgICAgICAgICBlbnZCcGYgPSBnLm11bCggYnBmLCBlZyApLFxuICAgICAgICAgIG91dCA9IGcubXVsKCBlbnZCcGYsIGdhaW4gKVxuXG4gICAgR2liYmVyaXNoLmZhY3RvcnkoIGNvd2JlbGwsIG91dCwgJ2Nvd2JlbGwnLCBwcm9wcyAgKVxuICAgIFxuICAgIGNvd2JlbGwuZW52ID0gZWcgXG5cbiAgICBjb3diZWxsLmlzU3RlcmVvID0gZmFsc2VcblxuICAgIHJldHVybiBjb3diZWxsXG4gIH1cbiAgXG4gIENvd2JlbGwuZGVmYXVsdHMgPSB7XG4gICAgZ2FpbjogMSxcbiAgICBkZWNheTouNVxuICB9XG5cbiAgcmV0dXJuIENvd2JlbGxcblxufVxuIiwibGV0IGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApLFxuICAgIGluc3RydW1lbnQgPSByZXF1aXJlKCAnLi9pbnN0cnVtZW50LmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBsZXQgRk0gPSBpbnB1dFByb3BzID0+IHtcbiAgICBsZXQgc3luID0gT2JqZWN0LmNyZWF0ZSggaW5zdHJ1bWVudCApXG5cbiAgICBsZXQgZW52ID0gZy5hZCggZy5pbignYXR0YWNrJyksIGcuaW4oJ2RlY2F5JyksIHsgc2hhcGU6J2xpbmVhcicgfSksXG4gICAgICAgIGZyZXF1ZW5jeSA9IGcuaW4oICdmcmVxdWVuY3knICksXG4gICAgICAgIGdsaWRlID0gZy5pbiggJ2dsaWRlJyApLFxuICAgICAgICBzbGlkaW5nRnJlcSA9IGcuc2xpZGUoIGZyZXF1ZW5jeSwgZ2xpZGUsIGdsaWRlICksXG4gICAgICAgIGNtUmF0aW8gPSBnLmluKCAnY21SYXRpbycgKSxcbiAgICAgICAgaW5kZXggPSBnLmluKCAnaW5kZXgnIClcblxuICAgIGxldCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oIHN5biwgRk0uZGVmYXVsdHMsIGlucHV0UHJvcHMgKVxuXG4gICAgc3luLl9fY3JlYXRlR3JhcGggPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBtb2RPc2MgPSBHaWJiZXJpc2gub3NjaWxsYXRvcnMuZmFjdG9yeSggc3luLm1vZHVsYXRvcldhdmVmb3JtLCBnLm11bCggc2xpZGluZ0ZyZXEsIGNtUmF0aW8gKSwgc3luLmFudGlhbGlhcyApXG4gICAgICBsZXQgbW9kT3NjV2l0aEluZGV4ID0gZy5tdWwoIG1vZE9zYywgZy5tdWwoIHNsaWRpbmdGcmVxLCBpbmRleCApIClcbiAgICAgIGxldCBtb2RPc2NXaXRoRW52ICAgPSBnLm11bCggbW9kT3NjV2l0aEluZGV4LCBlbnYgKVxuXG4gICAgICBsZXQgY2Fycmllck9zYyA9IEdpYmJlcmlzaC5vc2NpbGxhdG9ycy5mYWN0b3J5KCBzeW4uY2FycmllcldhdmVmb3JtLCBnLmFkZCggc2xpZGluZ0ZyZXEsIG1vZE9zY1dpdGhFbnYgKSwgc3luLmFudGlhbGlhcyApXG4gICAgICBsZXQgY2Fycmllck9zY1dpdGhFbnYgPSBnLm11bCggY2Fycmllck9zYywgZW52IClcbiAgICAgIFxuICAgICAgbGV0IGN1dG9mZiA9IGcuYWRkKCBnLmluKCdjdXRvZmYnKSwgZy5tdWwoIGcuaW4oJ2ZpbHRlck11bHQnKSwgZW52ICkgKVxuICAgICAgY29uc3QgZmlsdGVyZWRPc2MgPSBHaWJiZXJpc2guZmlsdGVycy5mYWN0b3J5KCBjYXJyaWVyT3NjV2l0aEVudiwgY3V0b2ZmLCBnLmluKCdRJyksIGcuaW4oJ3NhdHVyYXRpb24nKSwgc3luIClcblxuICAgICAgbGV0IHN5bnRoV2l0aEdhaW4gPSBnLm11bCggZmlsdGVyZWRPc2MsIGcuaW4oICdnYWluJyApICksXG4gICAgICAgICAgcGFubmVyXG5cbiAgICAgIGlmKCBwcm9wcy5wYW5Wb2ljZXMgPT09IHRydWUgKSB7IFxuICAgICAgICBwYW5uZXIgPSBnLnBhbiggc3ludGhXaXRoR2Fpbiwgc3ludGhXaXRoR2FpbiwgZy5pbiggJ3BhbicgKSApIFxuICAgICAgICBzeW4uZ3JhcGggPSBbcGFubmVyLmxlZnQsIHBhbm5lci5yaWdodCBdXG4gICAgICB9ZWxzZXtcbiAgICAgICAgc3luLmdyYXBoID0gc3ludGhXaXRoR2FpblxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBzeW4uX19yZXF1aXJlc1JlY29tcGlsYXRpb24gPSBbICdjYXJyaWVyV2F2ZWZvcm0nLCAnbW9kdWxhdG9yV2F2ZWZvcm0nLCAnYW50aWFsaWFzJywgJ2ZpbHRlclR5cGUnLCAnZmlsdGVyTW9kZScgXVxuICAgIHN5bi5fX2NyZWF0ZUdyYXBoKClcblxuICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBzeW4sIHN5bi5ncmFwaCAsICdmbScsIHN5biApXG5cbiAgICBzeW4uZW52ID0gZW52XG5cbiAgICByZXR1cm4gc3luXG4gIH1cblxuICBGTS5kZWZhdWx0cyA9IHtcbiAgICBjYXJyaWVyV2F2ZWZvcm06J3NpbmUnLFxuICAgIG1vZHVsYXRvcldhdmVmb3JtOidzaW5lJyxcbiAgICBhdHRhY2s6IDQ0MTAwLFxuICAgIGRlY2F5OiA0NDEwMCxcbiAgICBnYWluOiAxLFxuICAgIGNtUmF0aW86MixcbiAgICBpbmRleDo1LFxuICAgIHB1bHNld2lkdGg6LjI1LFxuICAgIGZyZXF1ZW5jeToyMjAsXG4gICAgcGFuOiAuNSxcbiAgICBhbnRpYWxpYXM6ZmFsc2UsXG4gICAgcGFuVm9pY2VzOmZhbHNlLFxuICAgIGdsaWRlOjEsXG4gICAgc2F0dXJhdGlvbjoxLFxuICAgIGZpbHRlck11bHQ6NDQwLFxuICAgIFE6LjI1LFxuICAgIGN1dG9mZjozNTIwLFxuICAgIGZpbHRlclR5cGU6MCxcbiAgICBmaWx0ZXJNb2RlOjAsXG4gICAgaXNMb3dQYXNzOjFcbiAgfVxuXG4gIGxldCBQb2x5Rk0gPSBHaWJiZXJpc2guUG9seVRlbXBsYXRlKCBGTSwgWydnbGlkZScsJ2ZyZXF1ZW5jeScsJ2F0dGFjaycsJ2RlY2F5JywncHVsc2V3aWR0aCcsJ3BhbicsJ2dhaW4nLCdjbVJhdGlvJywnaW5kZXgnLCAnc2F0dXJhdGlvbicsICdmaWx0ZXJNdWx0JywgJ1EnLCAnY3V0b2ZmJywgJ2FudGlhbGlhcycsICdmaWx0ZXJUeXBlJywgJ2NhcnJpZXJXYXZlZm9ybScsICdtb2R1bGF0b3JXYXZlZm9ybScsJ2ZpbHRlck1vZGUnIF0gKSBcblxuICByZXR1cm4gWyBGTSwgUG9seUZNIF1cblxufVxuIiwibGV0IGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApLFxuICAgIGluc3RydW1lbnQgPSByZXF1aXJlKCAnLi9pbnN0cnVtZW50LmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBsZXQgSGF0ID0gYXJndW1lbnRQcm9wcyA9PiB7XG4gICAgbGV0IGhhdCA9IE9iamVjdC5jcmVhdGUoIGluc3RydW1lbnQgKSxcbiAgICAgICAgdHVuZSAgPSBnLmluKCAndHVuZScgKSxcbiAgICAgICAgc2NhbGVkVHVuZSA9IGcubWVtbyggZy5hZGQoIC40LCB0dW5lICkgKSxcbiAgICAgICAgZGVjYXkgID0gZy5pbiggJ2RlY2F5JyApLFxuICAgICAgICBnYWluICA9IGcuaW4oICdnYWluJyApXG5cbiAgICBsZXQgcHJvcHMgPSBPYmplY3QuYXNzaWduKCB7fSwgSGF0LmRlZmF1bHRzLCBhcmd1bWVudFByb3BzIClcblxuICAgIGxldCBiYXNlRnJlcSA9IGcubXVsKCAzMjUsIHNjYWxlZFR1bmUgKSwgLy8gcmFuZ2Ugb2YgMTYyLjUgLSA0ODcuNVxuICAgICAgICBicGZDdXRvZmYgPSBnLm11bCggZy5wYXJhbSggJ2JwZmMnLCA3MDAwICksIHNjYWxlZFR1bmUgKSxcbiAgICAgICAgaHBmQ3V0b2ZmID0gZy5tdWwoIGcucGFyYW0oICdocGZjJywgMTEwMDAgKSwgc2NhbGVkVHVuZSApLCAgXG4gICAgICAgIHMxID0gR2liYmVyaXNoLm9zY2lsbGF0b3JzLmZhY3RvcnkoICdzcXVhcmUnLCBiYXNlRnJlcSwgZmFsc2UgKSxcbiAgICAgICAgczIgPSBHaWJiZXJpc2gub3NjaWxsYXRvcnMuZmFjdG9yeSggJ3NxdWFyZScsIGcubXVsKCBiYXNlRnJlcSwxLjQ0NzEgKSApLFxuICAgICAgICBzMyA9IEdpYmJlcmlzaC5vc2NpbGxhdG9ycy5mYWN0b3J5KCAnc3F1YXJlJywgZy5tdWwoIGJhc2VGcmVxLDEuNjE3MCApICksXG4gICAgICAgIHM0ID0gR2liYmVyaXNoLm9zY2lsbGF0b3JzLmZhY3RvcnkoICdzcXVhcmUnLCBnLm11bCggYmFzZUZyZXEsMS45MjY1ICkgKSxcbiAgICAgICAgczUgPSBHaWJiZXJpc2gub3NjaWxsYXRvcnMuZmFjdG9yeSggJ3NxdWFyZScsIGcubXVsKCBiYXNlRnJlcSwyLjUwMjggKSApLFxuICAgICAgICBzNiA9IEdpYmJlcmlzaC5vc2NpbGxhdG9ycy5mYWN0b3J5KCAnc3F1YXJlJywgZy5tdWwoIGJhc2VGcmVxLDIuNjYzNyApICksXG4gICAgICAgIHN1bSA9IGcuYWRkKCBzMSxzMixzMyxzNCxzNSxzNiApLFxuICAgICAgICBlZyA9IGcuZGVjYXkoIGcubXVsKCBkZWNheSwgZy5nZW4uc2FtcGxlcmF0ZSAqIDIgKSApLCBcbiAgICAgICAgYnBmID0gZy5zdmYoIHN1bSwgYnBmQ3V0b2ZmLCAuNSwgMiwgZmFsc2UgKSxcbiAgICAgICAgZW52QnBmID0gZy5tdWwoIGJwZiwgZWcgKSxcbiAgICAgICAgaHBmID0gZy5maWx0ZXIyNCggZW52QnBmLCAwLCBocGZDdXRvZmYsIDAgKSxcbiAgICAgICAgb3V0ID0gZy5tdWwoIGhwZiwgZ2FpbiApXG5cbiAgICBHaWJiZXJpc2guZmFjdG9yeSggaGF0LCBvdXQsICdoYXQnLCBwcm9wcyAgKVxuICAgIFxuICAgIGhhdC5lbnYgPSBlZyBcblxuICAgIGhhdC5pc1N0ZXJlbyA9IGZhbHNlXG4gICAgcmV0dXJuIGhhdFxuICB9XG4gIFxuICBIYXQuZGVmYXVsdHMgPSB7XG4gICAgZ2FpbjogIDEsXG4gICAgdHVuZTogLjYsXG4gICAgZGVjYXk6LjEsXG4gIH1cblxuICByZXR1cm4gSGF0XG5cbn1cbiIsImxldCB1Z2VuID0gcmVxdWlyZSggJy4uL3VnZW4uanMnICksXG4gICAgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnIClcblxubGV0IGluc3RydW1lbnQgPSBPYmplY3QuY3JlYXRlKCB1Z2VuIClcblxuT2JqZWN0LmFzc2lnbiggaW5zdHJ1bWVudCwge1xuICBub3RlKCBmcmVxICkge1xuICAgIHRoaXMuZnJlcXVlbmN5ID0gZnJlcVxuICAgIHRoaXMuZW52LnRyaWdnZXIoKVxuICB9LFxuXG4gIHRyaWdnZXIoIF9nYWluID0gMSApIHtcbiAgICB0aGlzLmdhaW4gPSBfZ2FpblxuICAgIHRoaXMuZW52LnRyaWdnZXIoKVxuICB9LFxuXG59KVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc3RydW1lbnRcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuY29uc3QgaW5zdHJ1bWVudHMgPSB7XG4gIEtpY2sgICAgICAgIDogcmVxdWlyZSggJy4va2ljay5qcycgKSggR2liYmVyaXNoICksXG4gIENvbmdhICAgICAgIDogcmVxdWlyZSggJy4vY29uZ2EuanMnICkoIEdpYmJlcmlzaCApLFxuICBDbGF2ZSAgICAgICA6IHJlcXVpcmUoICcuL2NvbmdhLmpzJyApKCBHaWJiZXJpc2ggKSwgLy8gY2xhdmUgaXMgc2FtZSBhcyBjb25nYSB3aXRoIGRpZmZlcmVudCBkZWZhdWx0cywgc2VlIGJlbG93XG4gIEhhdCAgICAgICAgIDogcmVxdWlyZSggJy4vaGF0LmpzJyApKCBHaWJiZXJpc2ggKSxcbiAgU25hcmUgICAgICAgOiByZXF1aXJlKCAnLi9zbmFyZS5qcycgKSggR2liYmVyaXNoICksXG4gIENvd2JlbGwgICAgIDogcmVxdWlyZSggJy4vY293YmVsbC5qcycgKSggR2liYmVyaXNoIClcbn1cblxuaW5zdHJ1bWVudHMuQ2xhdmUuZGVmYXVsdHMuZnJlcXVlbmN5ID0gMjUwMFxuaW5zdHJ1bWVudHMuQ2xhdmUuZGVmYXVsdHMuZGVjYXkgPSAuNTtcblxuWyBpbnN0cnVtZW50cy5TeW50aCwgaW5zdHJ1bWVudHMuUG9seVN5bnRoIF0gICAgID0gcmVxdWlyZSggJy4vc3ludGguanMnICkoIEdpYmJlcmlzaCApO1xuWyBpbnN0cnVtZW50cy5Nb25vc3ludGgsIGluc3RydW1lbnRzLlBvbHlNb25vIF0gID0gcmVxdWlyZSggJy4vbW9ub3N5bnRoLmpzJyApKCBHaWJiZXJpc2ggKTtcblsgaW5zdHJ1bWVudHMuRk0sIGluc3RydW1lbnRzLlBvbHlGTSBdICAgICAgICAgICA9IHJlcXVpcmUoICcuL2ZtLmpzJyApKCBHaWJiZXJpc2ggKTtcblsgaW5zdHJ1bWVudHMuU2FtcGxlciwgaW5zdHJ1bWVudHMuUG9seVNhbXBsZXIgXSA9IHJlcXVpcmUoICcuL3NhbXBsZXIuanMnICkoIEdpYmJlcmlzaCApO1xuWyBpbnN0cnVtZW50cy5LYXJwbHVzLCBpbnN0cnVtZW50cy5Qb2x5S2FycGx1cyBdID0gcmVxdWlyZSggJy4va2FycGx1c3N0cm9uZy5qcycgKSggR2liYmVyaXNoICk7XG5cbmluc3RydW1lbnRzLmV4cG9ydCA9IHRhcmdldCA9PiB7XG4gIGZvciggbGV0IGtleSBpbiBpbnN0cnVtZW50cyApIHtcbiAgICBpZigga2V5ICE9PSAnZXhwb3J0JyApIHtcbiAgICAgIHRhcmdldFsga2V5IF0gPSBpbnN0cnVtZW50c1sga2V5IF1cbiAgICB9XG4gIH1cbn1cblxucmV0dXJuIGluc3RydW1lbnRzXG5cbn1cbiIsImNvbnN0IGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApLFxuICAgICAgaW5zdHJ1bWVudCA9IHJlcXVpcmUoICcuL2luc3RydW1lbnQuanMnIClcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggR2liYmVyaXNoICkge1xuXG4gIGNvbnN0IEtQUyA9IGlucHV0UHJvcHMgPT4ge1xuXG4gICAgY29uc3QgcHJvcHMgPSBPYmplY3QuYXNzaWduKCB7fSwgS1BTLmRlZmF1bHRzLCBpbnB1dFByb3BzIClcbiAgICBjb25zdCBzeW4gPSBPYmplY3QuY3JlYXRlKCBpbnN0cnVtZW50ICksXG4gICAgICAgICAgdHJpZ2dlciA9IGcuYmFuZygpLFxuICAgICAgICAgIHBoYXNlID0gZy5hY2N1bSggMSwgdHJpZ2dlciwgeyBtYXg6SW5maW5pdHkgfSApLFxuICAgICAgICAgIGVudiA9IGcuZ3RwKCBnLnN1YiggMSwgZy5kaXYoIHBoYXNlLCAyMDAgKSApLCAwICksXG4gICAgICAgICAgaW1wdWxzZSA9IGcubXVsKCBnLm5vaXNlKCksIGVudiApLFxuICAgICAgICAgIGZlZWRiYWNrID0gZy5oaXN0b3J5KCksXG4gICAgICAgICAgZnJlcXVlbmN5ID0gZy5pbignZnJlcXVlbmN5JyksXG4gICAgICAgICAgZ2xpZGUgPSBnLmluKCAnZ2xpZGUnICksXG4gICAgICAgICAgc2xpZGluZ0ZyZXF1ZW5jeSA9IGcuc2xpZGUoIGZyZXF1ZW5jeSwgZ2xpZGUsIGdsaWRlICksXG4gICAgICAgICAgZGVsYXkgPSBnLmRlbGF5KCBnLmFkZCggaW1wdWxzZSwgZmVlZGJhY2sub3V0ICksIGcuZGl2KCBHaWJiZXJpc2guY3R4LnNhbXBsZVJhdGUsIHNsaWRpbmdGcmVxdWVuY3kgKSwgeyBzaXplOjIwNDggfSksXG4gICAgICAgICAgZGVjYXllZCA9IGcubXVsKCBkZWxheSwgZy50NjAoIGcubXVsKCBnLmluKCdkZWNheScpLCBzbGlkaW5nRnJlcXVlbmN5ICkgKSApLFxuICAgICAgICAgIGRhbXBlZCA9ICBnLm1peCggZGVjYXllZCwgZmVlZGJhY2sub3V0LCBnLmluKCdkYW1waW5nJykgKSxcbiAgICAgICAgICB3aXRoR2FpbiA9IGcubXVsKCBkYW1wZWQsIGcuaW4oJ2dhaW4nKSApXG5cbiAgICBmZWVkYmFjay5pbiggZGFtcGVkIClcblxuICAgIGNvbnN0IHByb3BlcnRpZXMgPSBPYmplY3QuYXNzaWduKCB7fSwgS1BTLmRlZmF1bHRzLCBwcm9wcyApXG5cbiAgICBpZiggcHJvcGVydGllcy5wYW5Wb2ljZXMgKSB7ICBcbiAgICAgIGNvbnN0IHBhbm5lciA9IGcucGFuKCB3aXRoR2Fpbiwgd2l0aEdhaW4sIGcuaW4oICdwYW4nICkgKVxuICAgICAgR2liYmVyaXNoLmZhY3RvcnkoIHN5biwgW3Bhbm5lci5sZWZ0LCBwYW5uZXIucmlnaHRdLCAna2FycGx1cycsIHByb3BzICApXG4gICAgfWVsc2V7XG4gICAgICBHaWJiZXJpc2guZmFjdG9yeSggc3luLCB3aXRoR2FpbiwgJ2thcnBsdXMnLCBwcm9wcyApXG4gICAgfVxuXG4gICAgT2JqZWN0LmFzc2lnbiggc3luLCB7XG4gICAgICBwcm9wZXJ0aWVzIDogcHJvcHMsXG5cbiAgICAgIGVudiA6IHRyaWdnZXIsXG4gICAgICBwaGFzZSxcblxuICAgICAgZ2V0UGhhc2UoKSB7XG4gICAgICAgIHJldHVybiBHaWJiZXJpc2gubWVtb3J5LmhlYXBbIHBoYXNlLm1lbW9yeS52YWx1ZS5pZHggXVxuICAgICAgfSxcbiAgICB9KVxuICAgIHJldHVybiBzeW5cbiAgfVxuICBcbiAgS1BTLmRlZmF1bHRzID0ge1xuICAgIGRlY2F5OiAuOTcsXG4gICAgZGFtcGluZzouMixcbiAgICBnYWluOiAxLFxuICAgIGZyZXF1ZW5jeToyMjAsXG4gICAgcGFuOiAuNSxcbiAgICBnbGlkZToxLFxuICAgIHBhblZvaWNlczpmYWxzZVxuICB9XG5cbiAgbGV0IGVudkNoZWNrRmFjdG9yeSA9ICggc3luLHN5bnRoICkgPT4ge1xuICAgIGxldCBlbnZDaGVjayA9ICgpPT4ge1xuICAgICAgbGV0IHBoYXNlID0gc3luLmdldFBoYXNlKCksXG4gICAgICAgICAgZW5kVGltZSA9IHN5bnRoLmRlY2F5ICogR2liYmVyaXNoLmN0eC5zYW1wbGVSYXRlXG5cbiAgICAgIGlmKCBwaGFzZSA+IGVuZFRpbWUgKSB7XG4gICAgICAgIHN5bnRoLmRpc2Nvbm5lY3RVZ2VuKCBzeW4gKVxuICAgICAgICBzeW4uaXNDb25uZWN0ZWQgPSBmYWxzZVxuICAgICAgICBHaWJiZXJpc2gubWVtb3J5LmhlYXBbIHN5bi5waGFzZS5tZW1vcnkudmFsdWUuaWR4IF0gPSAwIC8vIHRyaWdnZXIgZG9lc24ndCBzZWVtIHRvIHJlc2V0IGZvciBzb21lIHJlYXNvblxuICAgICAgfWVsc2V7XG4gICAgICAgIEdpYmJlcmlzaC5ibG9ja0NhbGxiYWNrcy5wdXNoKCBlbnZDaGVjayApXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbnZDaGVja1xuICB9XG5cbiAgbGV0IFBvbHlLUFMgPSBHaWJiZXJpc2guUG9seVRlbXBsYXRlKCBLUFMsIFsnZnJlcXVlbmN5JywnZGVjYXknLCdkYW1waW5nJywncGFuJywnZ2FpbicsICdnbGlkZSddLCBlbnZDaGVja0ZhY3RvcnkgKSBcblxuICByZXR1cm4gWyBLUFMsIFBvbHlLUFMgXVxuXG59XG4iLCJsZXQgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnICksXG4gICAgaW5zdHJ1bWVudCA9IHJlcXVpcmUoICcuL2luc3RydW1lbnQuanMnIClcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggR2liYmVyaXNoICkge1xuXG4gIGxldCBLaWNrID0gaW5wdXRQcm9wcyA9PiB7XG4gICAgLy8gZXN0YWJsaXNoIHByb3RvdHlwZSBjaGFpblxuICAgIGxldCBraWNrID0gT2JqZWN0LmNyZWF0ZSggaW5zdHJ1bWVudCApXG5cbiAgICAvLyBkZWZpbmUgaW5wdXRzXG4gICAgbGV0IGZyZXF1ZW5jeSA9IGcuaW4oICdmcmVxdWVuY3knICksXG4gICAgICAgIGRlY2F5ID0gZy5pbiggJ2RlY2F5JyApLFxuICAgICAgICB0b25lICA9IGcuaW4oICd0b25lJyApLFxuICAgICAgICBnYWluICA9IGcuaW4oICdnYWluJyApXG4gICAgXG4gICAgLy8gY3JlYXRlIGluaXRpYWwgcHJvcGVydHkgc2V0XG4gICAgbGV0IHByb3BzID0gT2JqZWN0LmFzc2lnbigge30sIEtpY2suZGVmYXVsdHMsIGlucHV0UHJvcHMgKVxuXG4gICAgLy8gY3JlYXRlIERTUCBncmFwaFxuICAgIGxldCB0cmlnZ2VyID0gZy5iYW5nKCksXG4gICAgICAgIGltcHVsc2UgPSBnLm11bCggdHJpZ2dlciwgNjAgKSxcbiAgICAgICAgc2NhbGVkRGVjYXkgPSBnLnN1YiggMS4wMDUsIGRlY2F5ICksIC8vIC0+IHJhbmdlIHsgLjAwNSwgMS4wMDUgfVxuICAgICAgICBzY2FsZWRUb25lID0gZy5hZGQoIDUwLCBnLm11bCggdG9uZSwgNDAwMCApICksIC8vIC0+IHJhbmdlIHsgNTAsIDQwNTAgfVxuICAgICAgICBicGYgPSBnLnN2ZiggaW1wdWxzZSwgZnJlcXVlbmN5LCBzY2FsZWREZWNheSwgMiwgZmFsc2UgKSxcbiAgICAgICAgbHBmID0gZy5zdmYoIGJwZiwgc2NhbGVkVG9uZSwgLjUsIDAsIGZhbHNlICksXG4gICAgICAgIGdyYXBoID0gZy5tdWwoIGxwZiwgZ2FpbiApXG4gICAgXG4gICAgR2liYmVyaXNoLmZhY3RvcnkoIGtpY2ssIGdyYXBoLCAna2ljaycsIHByb3BzICApXG5cbiAgICBraWNrLmVudiA9IHRyaWdnZXJcblxuICAgIHJldHVybiBraWNrXG4gIH1cbiAgXG4gIEtpY2suZGVmYXVsdHMgPSB7XG4gICAgZ2FpbjogMSxcbiAgICBmcmVxdWVuY3k6ODUsXG4gICAgdG9uZTogLjI1LFxuICAgIGRlY2F5Oi45XG4gIH1cblxuICByZXR1cm4gS2lja1xuXG59XG4iLCJjb25zdCBnID0gcmVxdWlyZSggJ2dlbmlzaC5qcycgKSxcbiAgICAgIGluc3RydW1lbnQgPSByZXF1aXJlKCAnLi9pbnN0cnVtZW50LmpzJyApLFxuICAgICAgZmVlZGJhY2tPc2MgPSByZXF1aXJlKCAnLi4vb3NjaWxsYXRvcnMvZm1mZWVkYmFja29zYy5qcycgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG5cbiAgY29uc3QgU3ludGggPSBhcmd1bWVudFByb3BzID0+IHtcbiAgICBjb25zdCBzeW4gPSBPYmplY3QuY3JlYXRlKCBpbnN0cnVtZW50ICksXG4gICAgICAgICAgb3NjcyA9IFtdLCBcbiAgICAgICAgICBlbnYgPSBnLmFkKCBnLmluKCAnYXR0YWNrJyApLCBnLmluKCAnZGVjYXknICksIHsgc2hhcGU6J2xpbmVhcicgfSksXG4gICAgICAgICAgZnJlcXVlbmN5ID0gZy5pbiggJ2ZyZXF1ZW5jeScgKSxcbiAgICAgICAgICBnbGlkZSA9IGcuaW4oICdnbGlkZScgKSxcbiAgICAgICAgICBzbGlkaW5nRnJlcSA9IGcubWVtbyggZy5zbGlkZSggZnJlcXVlbmN5LCBnbGlkZSwgZ2xpZGUgKSApXG5cbiAgICBsZXQgcHJvcHMgPSBPYmplY3QuYXNzaWduKCBzeW4sIFN5bnRoLmRlZmF1bHRzLCBhcmd1bWVudFByb3BzIClcblxuICAgIHN5bi5fX2NyZWF0ZUdyYXBoID0gZnVuY3Rpb24oKSB7XG4gICAgICBmb3IoIGxldCBpID0gMDsgaSA8IDM7IGkrKyApIHtcbiAgICAgICAgbGV0IG9zYywgZnJlcVxuXG4gICAgICAgIHN3aXRjaCggaSApIHtcbiAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBmcmVxID0gZy5hZGQoIHNsaWRpbmdGcmVxLCBnLm11bCggc2xpZGluZ0ZyZXEsIGcuaW4oJ2RldHVuZTInKSApIClcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGZyZXEgPSBnLmFkZCggc2xpZGluZ0ZyZXEsIGcubXVsKCBzbGlkaW5nRnJlcSwgZy5pbignZGV0dW5lMycpICkgKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGZyZXEgPSBzbGlkaW5nRnJlcS8vZnJlcXVlbmN5XG4gICAgICAgIH1cblxuICAgICAgICBvc2MgPSBHaWJiZXJpc2gub3NjaWxsYXRvcnMuZmFjdG9yeSggc3luLndhdmVmb3JtLCBmcmVxLCBzeW4uYW50aWFsaWFzIClcbiAgICAgICAgXG4gICAgICAgIG9zY3NbIGkgXSA9IG9zY1xuICAgICAgfVxuXG4gICAgICBsZXQgb3NjU3VtID0gZy5hZGQoIC4uLm9zY3MgKSxcbiAgICAgICAgICBvc2NXaXRoR2FpbiA9IGcubXVsKCBnLm11bCggb3NjU3VtLCBlbnYgKSwgZy5pbiggJ2dhaW4nICkgKSxcbiAgICAgICAgICAvL2N1dG9mZiA9IGcuYWRkKCBnLmluKCdjdXRvZmYnKSwgZy5tdWwoIGcuaW4oJ2ZpbHRlck11bHQnKSwgZW52ICkgKSxcbiAgICAgICAgICBmaWx0ZXJlZE9zYywgcGFubmVyXG5cbiAgICAgIGNvbnN0IGJhc2VDdXRvZmZGcmVxID0gZy5tdWwoIGcuaW4oJ2N1dG9mZicpLCBmcmVxdWVuY3kgKVxuICAgICAgbGV0IGN1dG9mZiA9IGcubXVsKCBnLm11bCggYmFzZUN1dG9mZkZyZXEsIGcucG93KCAyLCBnLmluKCdmaWx0ZXJNdWx0JykgKSksIGVudiApXG4gICAgICBmaWx0ZXJlZE9zYyA9IEdpYmJlcmlzaC5maWx0ZXJzLmZhY3RvcnkoIG9zY1dpdGhHYWluLCBjdXRvZmYsIGcuaW4oJ1EnKSwgZy5pbignc2F0dXJhdGlvbicpLCBzeW4gKVxuICAgICAgICBcbiAgICAgIGlmKCBwcm9wcy5wYW5Wb2ljZXMgKSB7ICBcbiAgICAgICAgcGFubmVyID0gZy5wYW4oIGZpbHRlcmVkT3NjLGZpbHRlcmVkT3NjLCBnLmluKCAncGFuJyApIClcbiAgICAgICAgc3luLmdyYXBoID0gWyBwYW5uZXIubGVmdCwgcGFubmVyLnJpZ2h0IF1cbiAgICAgIH1lbHNle1xuICAgICAgICBzeW4uZ3JhcGggPSBmaWx0ZXJlZE9zY1xuICAgICAgfVxuICAgIH1cblxuICAgIHN5bi5fX3JlcXVpcmVzUmVjb21waWxhdGlvbiA9IFsgJ3dhdmVmb3JtJywgJ2FudGlhbGlhcycsICdmaWx0ZXJUeXBlJywgJ2ZpbHRlck1vZGUnIF1cbiAgICBzeW4uX19jcmVhdGVHcmFwaCgpXG5cbiAgICBHaWJiZXJpc2guZmFjdG9yeSggc3luLCBzeW4uZ3JhcGgsICdtb25vJywgcHJvcHMgKVxuXG4gICAgc3luLmVudiA9IGVudlxuXG4gICAgcmV0dXJuIHN5blxuICB9XG4gIFxuICBTeW50aC5kZWZhdWx0cyA9IHtcbiAgICB3YXZlZm9ybTogJ3NhdycsXG4gICAgYXR0YWNrOiA0NDEwMCxcbiAgICBkZWNheTogNDQxMDAsXG4gICAgZ2FpbjogLjI1LFxuICAgIHB1bHNld2lkdGg6LjI1LFxuICAgIGZyZXF1ZW5jeToyMjAsXG4gICAgcGFuOiAuNSxcbiAgICBkZXR1bmUyOi4wMDUsXG4gICAgZGV0dW5lMzotLjAwNSxcbiAgICBjdXRvZmY6IDEsXG4gICAgcmVzb25hbmNlOi4yNSxcbiAgICBROiAuNSxcbiAgICBwYW5Wb2ljZXM6ZmFsc2UsXG4gICAgZ2xpZGU6IDEsXG4gICAgYW50aWFsaWFzOmZhbHNlLFxuICAgIGZpbHRlclR5cGU6IDIsXG4gICAgZmlsdGVyTW9kZTogMCwgLy8gMCA9IExQLCAxID0gSFAsIDIgPSBCUCwgMyA9IE5vdGNoXG4gICAgc2F0dXJhdGlvbjouNSxcbiAgICBmaWx0ZXJNdWx0OiA0LFxuICAgIGlzTG93UGFzczp0cnVlXG4gIH1cblxuICBsZXQgUG9seU1vbm8gPSBHaWJiZXJpc2guUG9seVRlbXBsYXRlKCBTeW50aCwgXG4gICAgWydmcmVxdWVuY3knLCdhdHRhY2snLCdkZWNheScsJ2N1dG9mZicsJ1EnLFxuICAgICAnZGV0dW5lMicsJ2RldHVuZTMnLCdwdWxzZXdpZHRoJywncGFuJywnZ2FpbicsICdnbGlkZScsICdzYXR1cmF0aW9uJywgJ2ZpbHRlck11bHQnLCAgJ2FudGlhbGlhcycsICdmaWx0ZXJUeXBlJywgJ3dhdmVmb3JtJywgJ2ZpbHRlck1vZGUnXVxuICApIFxuXG4gIHJldHVybiBbIFN5bnRoLCBQb2x5TW9ubyBdXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgbm90ZSggZnJlcSwgZ2FpbiApIHtcbiAgICBsZXQgdm9pY2UgPSB0aGlzLl9fZ2V0Vm9pY2VfXygpXG4gICAgT2JqZWN0LmFzc2lnbiggdm9pY2UsIHRoaXMucHJvcGVydGllcyApXG4gICAgaWYoIGdhaW4gPT09IHVuZGVmaW5lZCApIGdhaW4gPSB0aGlzLmdhaW5cbiAgICB2b2ljZS5nYWluID0gZ2FpblxuICAgIHZvaWNlLm5vdGUoIGZyZXEgKVxuICAgIHRoaXMuX19ydW5Wb2ljZV9fKCB2b2ljZSwgdGhpcyApXG4gICAgdGhpcy50cmlnZ2VyTm90ZSA9IGZyZXFcbiAgfSxcblxuICAvLyBYWFggdGhpcyBpcyBub3QgcGFydGljdWxhcmx5IHNhdGlzZnlpbmcuLi5cbiAgLy8gbXVzdCBjaGVjayBmb3IgYm90aCBub3RlcyBhbmQgY2hvcmRzXG4gIHRyaWdnZXIoIGdhaW4gKSB7XG4gICAgaWYoIHRoaXMudHJpZ2dlckNob3JkICE9PSBudWxsICkge1xuICAgICAgdGhpcy50cmlnZ2VyQ2hvcmQuZm9yRWFjaCggdiA9PiB7XG4gICAgICAgIGxldCB2b2ljZSA9IHRoaXMuX19nZXRWb2ljZV9fKClcbiAgICAgICAgT2JqZWN0LmFzc2lnbiggdm9pY2UsIHRoaXMucHJvcGVydGllcyApXG4gICAgICAgIHZvaWNlLm5vdGUoIHYgKVxuICAgICAgICB2b2ljZS5nYWluID0gZ2FpblxuICAgICAgICB0aGlzLl9fcnVuVm9pY2VfXyggdm9pY2UsIHRoaXMgKVxuICAgICAgfSlcbiAgICB9ZWxzZSBpZiggdGhpcy50cmlnZ2VyTm90ZSAhPT0gbnVsbCApIHtcbiAgICAgIGxldCB2b2ljZSA9IHRoaXMuX19nZXRWb2ljZV9fKClcbiAgICAgIE9iamVjdC5hc3NpZ24oIHZvaWNlLCB0aGlzLnByb3BlcnRpZXMgKVxuICAgICAgdm9pY2Uubm90ZSggdGhpcy50cmlnZ2VyTm90ZSApXG4gICAgICB2b2ljZS5nYWluID0gZ2FpblxuICAgICAgdGhpcy5fX3J1blZvaWNlX18oIHZvaWNlLCB0aGlzIClcbiAgICB9ZWxzZXtcbiAgICAgIGxldCB2b2ljZSA9IHRoaXMuX19nZXRWb2ljZV9fKClcbiAgICAgIE9iamVjdC5hc3NpZ24oIHZvaWNlLCB0aGlzLnByb3BlcnRpZXMgKVxuICAgICAgdm9pY2UudHJpZ2dlciggZ2FpbiApXG4gICAgICB0aGlzLl9fcnVuVm9pY2VfXyggdm9pY2UsIHRoaXMgKVxuICAgIH1cbiAgfSxcblxuICBfX3J1blZvaWNlX18oIHZvaWNlLCBfcG9seSApIHtcbiAgICBpZiggIXZvaWNlLmlzQ29ubmVjdGVkICkge1xuICAgICAgdm9pY2UuY29ubmVjdCggX3BvbHksIDEgKVxuICAgICAgdm9pY2UuaXNDb25uZWN0ZWQgPSB0cnVlXG4gICAgfVxuXG4gICAgbGV0IGVudkNoZWNrXG4gICAgaWYoIF9wb2x5LmVudkNoZWNrID09PSB1bmRlZmluZWQgKSB7XG4gICAgICBlbnZDaGVjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiggdm9pY2UuZW52LmlzQ29tcGxldGUoKSApIHtcbiAgICAgICAgICBfcG9seS5kaXNjb25uZWN0VWdlbi5jYWxsKCBfcG9seSwgdm9pY2UgKVxuICAgICAgICAgIHZvaWNlLmlzQ29ubmVjdGVkID0gZmFsc2VcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgR2liYmVyaXNoLmJsb2NrQ2FsbGJhY2tzLnB1c2goIGVudkNoZWNrIClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgZW52Q2hlY2sgPSBfcG9seS5lbnZDaGVjayggdm9pY2UsIF9wb2x5IClcbiAgICB9XG5cbiAgICBHaWJiZXJpc2guYmxvY2tDYWxsYmFja3MucHVzaCggZW52Q2hlY2sgKVxuICB9LFxuXG4gIF9fZ2V0Vm9pY2VfXygpIHtcbiAgICByZXR1cm4gdGhpcy52b2ljZXNbIHRoaXMudm9pY2VDb3VudCsrICUgdGhpcy52b2ljZXMubGVuZ3RoIF1cbiAgfSxcblxuICBjaG9yZCggZnJlcXVlbmNpZXMgKSB7XG4gICAgZnJlcXVlbmNpZXMuZm9yRWFjaCggdiA9PiB0aGlzLm5vdGUoIHYgKSApXG4gICAgdGhpcy50cmlnZ2VyQ2hvcmQgPSBmcmVxdWVuY2llc1xuICB9LFxuXG4gIGZyZWUoKSB7XG4gICAgZm9yKCBsZXQgY2hpbGQgb2YgdGhpcy52b2ljZXMgKSBjaGlsZC5mcmVlKClcbiAgfVxufVxuIiwiLypcbiAqIFRoaXMgZmlsZXMgY3JlYXRlcyBhIGZhY3RvcnkgZ2VuZXJhdGluZyBwb2x5c3ludGggY29uc3RydWN0b3JzLlxuICovXG5cbmNvbnN0IGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBjb25zdCBUZW1wbGF0ZUZhY3RvcnkgPSAoIHVnZW4sIHByb3BlcnR5TGlzdCwgX2VudkNoZWNrICkgPT4ge1xuICAgIC8qIFxuICAgICAqIHBvbHlzeW50aHMgYXJlIGJhc2ljYWxseSBidXNzZXMgdGhhdCBjb25uZWN0IGNoaWxkIHN5bnRoIHZvaWNlcy5cbiAgICAgKiBXZSBjcmVhdGUgc2VwYXJhdGUgcHJvdG90eXBlcyBmb3IgbW9ubyB2cyBzdGVyZW8gaW5zdGFuY2VzLlxuICAgICAqL1xuXG4gICAgY29uc3QgbW9ub1Byb3RvICAgPSBPYmplY3QuY3JlYXRlKCBHaWJiZXJpc2guQnVzKCkgKSxcbiAgICAgICAgICBzdGVyZW9Qcm90byA9IE9iamVjdC5jcmVhdGUoIEdpYmJlcmlzaC5CdXMyKCkpXG5cbiAgICAvLyBzaW5jZSB0aGVyZSBhcmUgdHdvIHByb3RvdHlwZXMgd2UgY2FuJ3QgYXNzaWduIGRpcmVjdGx5IHRvIG9uZSBvZiB0aGVtLi4uXG4gICAgT2JqZWN0LmFzc2lnbiggbW9ub1Byb3RvLCAgIEdpYmJlcmlzaC5taXhpbnMucG9seWluc3RydW1lbnQgKVxuICAgIE9iamVjdC5hc3NpZ24oIHN0ZXJlb1Byb3RvLCBHaWJiZXJpc2gubWl4aW5zLnBvbHlpbnN0cnVtZW50IClcblxuICAgIGNvbnN0IFRlbXBsYXRlID0gcHJvcHMgPT4ge1xuICAgICAgY29uc3QgcHJvcGVydGllcyA9IE9iamVjdC5hc3NpZ24oIHt9LCB7IGlzU3RlcmVvOnRydWUgfSwgcHJvcHMgKVxuXG4gICAgICBjb25zdCBzeW50aCA9IHByb3BlcnRpZXMuaXNTdGVyZW8gPyBPYmplY3QuY3JlYXRlKCBzdGVyZW9Qcm90byApIDogT2JqZWN0LmNyZWF0ZSggbW9ub1Byb3RvIClcblxuICAgICAgT2JqZWN0LmFzc2lnbiggc3ludGgsIHtcbiAgICAgICAgdm9pY2VzOiBbXSxcbiAgICAgICAgbWF4Vm9pY2VzOiBwcm9wZXJ0aWVzLm1heFZvaWNlcyAhPT0gdW5kZWZpbmVkID8gcHJvcGVydGllcy5tYXhWb2ljZXMgOiAxNixcbiAgICAgICAgdm9pY2VDb3VudDogMCxcbiAgICAgICAgZW52Q2hlY2s6IF9lbnZDaGVjayxcbiAgICAgICAgaWQ6IEdpYmJlcmlzaC5mYWN0b3J5LmdldFVJRCgpLFxuICAgICAgICBkaXJ0eTogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ2J1cycsXG4gICAgICAgIHVnZW5OYW1lOiAncG9seScgKyB1Z2VuLm5hbWUgKyAnXycgKyBzeW50aC5pZCxcbiAgICAgICAgaW5wdXRzOiBbXSxcbiAgICAgICAgaW5wdXROYW1lczogW10sXG4gICAgICAgIHByb3BlcnRpZXNcbiAgICAgIH0pXG5cbiAgICAgIHByb3BlcnRpZXMucGFuVm9pY2VzID0gcHJvcGVydGllcy5pc1N0ZXJlb1xuICAgICAgc3ludGguY2FsbGJhY2sudWdlbk5hbWUgPSBzeW50aC51Z2VuTmFtZVxuXG4gICAgICBmb3IoIGxldCBpID0gMDsgaSA8IHN5bnRoLm1heFZvaWNlczsgaSsrICkge1xuICAgICAgICBzeW50aC52b2ljZXNbaV0gPSB1Z2VuKCBwcm9wZXJ0aWVzIClcbiAgICAgICAgc3ludGgudm9pY2VzW2ldLmNhbGxiYWNrLnVnZW5OYW1lID0gc3ludGgudm9pY2VzW2ldLnVnZW5OYW1lXG4gICAgICAgIHN5bnRoLnZvaWNlc1tpXS5pc0Nvbm5lY3RlZCA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGxldCBfcHJvcGVydHlMaXN0IFxuICAgICAgaWYoIHByb3BlcnRpZXMuaXNTdGVyZW8gPT09IGZhbHNlICkge1xuICAgICAgICBfcHJvcGVydHlMaXN0ID0gcHJvcGVydHlMaXN0LnNsaWNlKCAwIClcbiAgICAgICAgY29uc3QgaWR4ID0gIF9wcm9wZXJ0eUxpc3QuaW5kZXhPZiggJ3BhbicgKVxuICAgICAgICBpZiggaWR4ICA+IC0xICkgX3Byb3BlcnR5TGlzdC5zcGxpY2UoIGlkeCwgMSApXG4gICAgICB9XG5cbiAgICAgIFRlbXBsYXRlRmFjdG9yeS5zZXR1cFByb3BlcnRpZXMoIHN5bnRoLCB1Z2VuLCBwcm9wZXJ0aWVzLmlzU3RlcmVvID8gcHJvcGVydHlMaXN0IDogX3Byb3BlcnR5TGlzdCApXG5cbiAgICAgIHJldHVybiBzeW50aFxuICAgIH1cblxuICAgIHJldHVybiBUZW1wbGF0ZVxuICB9XG5cbiAgVGVtcGxhdGVGYWN0b3J5LnNldHVwUHJvcGVydGllcyA9IGZ1bmN0aW9uKCBzeW50aCwgdWdlbiwgcHJvcHMgKSB7XG4gICAgZm9yKCBsZXQgcHJvcGVydHkgb2YgcHJvcHMgKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHN5bnRoLCBwcm9wZXJ0eSwge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgcmV0dXJuIHN5bnRoLnByb3BlcnRpZXNbIHByb3BlcnR5IF0gfHwgdWdlbi5kZWZhdWx0c1sgcHJvcGVydHkgXVxuICAgICAgICB9LFxuICAgICAgICBzZXQoIHYgKSB7XG4gICAgICAgICAgc3ludGgucHJvcGVydGllc1sgcHJvcGVydHkgXSA9IHZcbiAgICAgICAgICBmb3IoIGxldCBjaGlsZCBvZiBzeW50aC5pbnB1dHMgKSB7XG4gICAgICAgICAgICBjaGlsZFsgcHJvcGVydHkgXSA9IHZcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFRlbXBsYXRlRmFjdG9yeVxuXG59XG4iLCJsZXQgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnICksXG4gICAgaW5zdHJ1bWVudCA9IHJlcXVpcmUoICcuL2luc3RydW1lbnQuanMnIClcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggR2liYmVyaXNoICkge1xuICBsZXQgcHJvdG8gPSBPYmplY3QuY3JlYXRlKCBpbnN0cnVtZW50IClcblxuICBPYmplY3QuYXNzaWduKCBwcm90bywge1xuICAgIG5vdGUoIHJhdGUgKSB7XG4gICAgICB0aGlzLnJhdGUgPSByYXRlXG4gICAgICBpZiggcmF0ZSA+IDAgKSB7XG4gICAgICAgIHRoaXMudHJpZ2dlcigpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5fX3BoYXNlX18udmFsdWUgPSB0aGlzLmRhdGEuYnVmZmVyLmxlbmd0aCAtIDEgXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIGxldCBTYW1wbGVyID0gaW5wdXRQcm9wcyA9PiB7XG4gICAgbGV0IHN5biA9IE9iamVjdC5jcmVhdGUoIHByb3RvIClcblxuICAgIGxldCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oIHsgb25sb2FkOm51bGwgfSwgU2FtcGxlci5kZWZhdWx0cywgaW5wdXRQcm9wcyApXG5cbiAgICBzeW4uaXNTdGVyZW8gPSBwcm9wcy5pc1N0ZXJlbyAhPT0gdW5kZWZpbmVkID8gcHJvcHMuaXNTdGVyZW8gOiBmYWxzZVxuXG4gICAgbGV0IHN0YXJ0ID0gZy5pbiggJ3N0YXJ0JyApLCBlbmQgPSBnLmluKCAnZW5kJyApLCBcbiAgICAgICAgcmF0ZSA9IGcuaW4oICdyYXRlJyApLCBzaG91bGRMb29wID0gZy5pbiggJ2xvb3BzJyApXG4gICAgLyogY3JlYXRlIGR1bW15IHVnZW4gdW50aWwgZGF0YSBmb3Igc2FtcGxlciBpcyBsb2FkZWQuLi5cbiAgICAgKiB0aGlzIHdpbGwgYmUgb3ZlcnJpZGRlbiBieSBhIGNhbGwgdG8gR2liYmVyaXNoLmZhY3Rvcnkgb24gbG9hZCAqL1xuICAgIHN5bi5jYWxsYmFjayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMCB9XG4gICAgc3luLmlkID0gR2liYmVyaXNoLmZhY3RvcnkuZ2V0VUlEKClcbiAgICBzeW4udWdlbk5hbWUgPSBzeW4uY2FsbGJhY2sudWdlbk5hbWUgPSAnc2FtcGxlcl8nICsgc3luLmlkXG4gICAgc3luLmlucHV0TmFtZXMgPSBbXVxuICAgIC8qIGVuZCBkdW1teSB1Z2VuICovXG5cbiAgICBzeW4uX19iYW5nX18gPSBnLmJhbmcoKVxuICAgIHN5bi50cmlnZ2VyID0gc3luLl9fYmFuZ19fLnRyaWdnZXJcblxuICAgIGlmKCBwcm9wcy5maWxlbmFtZSApIHtcbiAgICAgIHN5bi5kYXRhID0gZy5kYXRhKCBwcm9wcy5maWxlbmFtZSApXG5cbiAgICAgIHN5bi5kYXRhLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgc3luLl9fcGhhc2VfXyA9IGcuY291bnRlciggcmF0ZSwgc3RhcnQsIGVuZCwgc3luLl9fYmFuZ19fLCBzaG91bGRMb29wLCB7IHNob3VsZFdyYXA6ZmFsc2UgfSlcblxuICAgICAgICBHaWJiZXJpc2guZmFjdG9yeSggXG4gICAgICAgICAgc3luLFxuICAgICAgICAgIGcubXVsKCBcbiAgICAgICAgICBnLmlmZWxzZSggXG4gICAgICAgICAgICBnLmFuZCggZy5ndGUoIHN5bi5fX3BoYXNlX18sIHN0YXJ0ICksIGcubHQoIHN5bi5fX3BoYXNlX18sIGVuZCApICksXG4gICAgICAgICAgICBnLnBlZWsoIFxuICAgICAgICAgICAgICBzeW4uZGF0YSwgXG4gICAgICAgICAgICAgIHN5bi5fX3BoYXNlX18sXG4gICAgICAgICAgICAgIHsgbW9kZTonc2FtcGxlcycgfVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIDBcbiAgICAgICAgICApLCBnLmluKCdnYWluJykgKSxcbiAgICAgICAgICAnc2FtcGxlcicsIFxuICAgICAgICAgIHByb3BzIFxuICAgICAgICApIFxuXG4gICAgICAgIGlmKCBzeW4uZW5kID09PSAtOTk5OTk5OTk5ICkgc3luLmVuZCA9IHN5bi5kYXRhLmJ1ZmZlci5sZW5ndGggLSAxXG5cbiAgICAgICAgaWYoIHN5bi5vbmxvYWQgIT09IG51bGwgKSB7IHN5bi5vbmxvYWQoKSB9XG5cbiAgICAgICAgR2liYmVyaXNoLmRpcnR5KCBzeW4gKVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzeW5cbiAgfVxuICBcbiAgU2FtcGxlci5kZWZhdWx0cyA9IHtcbiAgICBnYWluOiAxLFxuICAgIHBhbjogLjUsXG4gICAgcmF0ZTogMSxcbiAgICBwYW5Wb2ljZXM6ZmFsc2UsXG4gICAgbG9vcHM6IDAsXG4gICAgc3RhcnQ6MCxcbiAgICBlbmQ6LTk5OTk5OTk5OVxuICB9XG5cbiAgbGV0IFBvbHlTYW1wbGVyID0gR2liYmVyaXNoLlBvbHlUZW1wbGF0ZSggU2FtcGxlciwgWydyYXRlJywncGFuJywnZ2FpbicsJ3N0YXJ0JywnZW5kJywnbG9vcHMnXSApIFxuXG4gIHJldHVybiBbIFNhbXBsZXIsIFBvbHlTYW1wbGVyIF1cbn1cbiIsImxldCBnID0gcmVxdWlyZSggJ2dlbmlzaC5qcycgKSxcbiAgICBpbnN0cnVtZW50ID0gcmVxdWlyZSggJy4vaW5zdHJ1bWVudC5qcycgKVxuICBcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBsZXQgU25hcmUgPSBhcmd1bWVudFByb3BzID0+IHtcbiAgICBsZXQgc25hcmUgPSBPYmplY3QuY3JlYXRlKCBpbnN0cnVtZW50ICksXG4gICAgICAgIGRlY2F5ID0gZy5pbiggJ2RlY2F5JyApLFxuICAgICAgICBzY2FsZWREZWNheSA9IGcubXVsKCBkZWNheSwgZy5nZW4uc2FtcGxlcmF0ZSAqIDIgKSxcbiAgICAgICAgc25hcHB5PSBnLmluKCAnc25hcHB5JyApLFxuICAgICAgICB0dW5lICA9IGcuaW4oICd0dW5lJyApLFxuICAgICAgICBnYWluICA9IGcuaW4oICdnYWluJyApXG5cbiAgICBsZXQgcHJvcHMgPSBPYmplY3QuYXNzaWduKCB7fSwgU25hcmUuZGVmYXVsdHMsIGFyZ3VtZW50UHJvcHMgKVxuXG4gICAgbGV0IGVnID0gZy5kZWNheSggc2NhbGVkRGVjYXksIHsgaW5pdFZhbHVlOjAgfSApLCBcbiAgICAgICAgY2hlY2sgPSBnLm1lbW8oIGcuZ3QoIGVnLCAuMDAwNSApICksXG4gICAgICAgIHJuZCA9IGcubXVsKCBnLm5vaXNlKCksIGVnICksXG4gICAgICAgIGhwZiA9IGcuc3ZmKCBybmQsIGcuYWRkKCAxMDAwLCBnLm11bCggZy5hZGQoIDEsIHR1bmUpLCAxMDAwICkgKSwgLjUsIDEsIGZhbHNlICksXG4gICAgICAgIHNuYXAgPSBnLmd0cCggZy5tdWwoIGhwZiwgc25hcHB5ICksIDAgKSwgLy8gcmVjdGlmeVxuICAgICAgICBicGYxID0gZy5zdmYoIGVnLCBnLm11bCggMTgwLCBnLmFkZCggdHVuZSwgMSApICksIC4wNSwgMiwgZmFsc2UgKSxcbiAgICAgICAgYnBmMiA9IGcuc3ZmKCBlZywgZy5tdWwoIDMzMCwgZy5hZGQoIHR1bmUsIDEgKSApLCAuMDUsIDIsIGZhbHNlICksXG4gICAgICAgIG91dCAgPSBnLm1lbW8oIGcuYWRkKCBzbmFwLCBicGYxLCBnLm11bCggYnBmMiwgLjggKSApICksIC8vWFhYIHdoeSBpcyBtZW1vIG5lZWRlZD9cbiAgICAgICAgc2NhbGVkT3V0ID0gZy5tdWwoIG91dCwgZ2FpbiApXG4gICAgXG4gICAgLy8gWFhYIFRPRE8gOiBtYWtlIHRoaXMgd29yayB3aXRoIGlmZWxzZS4gdGhlIHByb2JsZW0gaXMgdGhhdCBwb2tlIHVnZW5zIHB1dCB0aGVpclxuICAgIC8vIGNvZGUgYXQgdGhlIGJvdHRvbSBvZiB0aGUgY2FsbGJhY2sgZnVuY3Rpb24sIGluc3RlYWQgb2YgYXQgdGhlIGVuZCBvZiB0aGVcbiAgICAvLyBhc3NvY2lhdGVkIGlmL2Vsc2UgYmxvY2suXG4gICAgbGV0IGlmZSA9IGcuc3dpdGNoKCBjaGVjaywgc2NhbGVkT3V0LCAwIClcbiAgICAvL2xldCBpZmUgPSBnLmlmZWxzZSggZy5ndCggZWcsIC4wMDUgKSwgY3ljbGUoNDQwKSwgMCApXG4gICAgXG4gICAgR2liYmVyaXNoLmZhY3RvcnkoIHNuYXJlLCBpZmUsICdzbmFyZScsIHByb3BzICApXG4gICAgXG4gICAgc25hcmUuZW52ID0gZWcgXG5cbiAgICByZXR1cm4gc25hcmVcbiAgfVxuICBcbiAgU25hcmUuZGVmYXVsdHMgPSB7XG4gICAgZ2FpbjogMSxcbiAgICBmcmVxdWVuY3k6MTAwMCxcbiAgICB0dW5lOjAsXG4gICAgc25hcHB5OiAxLFxuICAgIGRlY2F5Oi4xXG4gIH1cblxuICByZXR1cm4gU25hcmVcblxufVxuIiwibGV0IGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApLFxuICAgIGluc3RydW1lbnQgPSByZXF1aXJlKCAnLi9pbnN0cnVtZW50LmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBsZXQgU3ludGggPSBpbnB1dFByb3BzID0+IHtcbiAgICBsZXQgc3luID0gT2JqZWN0LmNyZWF0ZSggaW5zdHJ1bWVudCApXG5cbiAgICBsZXQgZW52ID0gZy5hZCggZy5pbignYXR0YWNrJyksIGcuaW4oJ2RlY2F5JyksIHsgc2hhcGU6J2xpbmVhcicgfSksXG4gICAgICAgIGZyZXF1ZW5jeSA9IGcuaW4oICdmcmVxdWVuY3knICksXG4gICAgICAgIGxvdWRuZXNzICA9IGcuaW4oICdsb3VkbmVzcycgKSwgXG4gICAgICAgIGdsaWRlID0gZy5pbiggJ2dsaWRlJyApLFxuICAgICAgICBzbGlkaW5nRnJlcSA9IGcuc2xpZGUoIGZyZXF1ZW5jeSwgZ2xpZGUsIGdsaWRlIClcblxuICAgIHN5bi5lbnYgPSBlbnZcblxuICAgIGxldCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oIHN5biwgU3ludGguZGVmYXVsdHMsIGlucHV0UHJvcHMgKVxuXG4gICAgc3luLl9fY3JlYXRlR3JhcGggPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBvc2MgPSBHaWJiZXJpc2gub3NjaWxsYXRvcnMuZmFjdG9yeSggc3luLndhdmVmb3JtLCBzbGlkaW5nRnJlcSwgc3luLmFudGlhbGlhcyApXG5cbiAgICAgIGxldCBvc2NXaXRoRW52ID0gZy5tdWwoIGcubXVsKCBvc2MsIGVudiwgbG91ZG5lc3MgKSApLFxuICAgICAgICAgIHBhbm5lclxuICBcbiAgICAgIGNvbnN0IGJhc2VDdXRvZmZGcmVxID0gZy5tdWwoIGcuaW4oJ2N1dG9mZicpLCBmcmVxdWVuY3kgKVxuICAgICAgbGV0IGN1dG9mZiA9IGcubXVsKCBnLm11bCggYmFzZUN1dG9mZkZyZXEsIGcucG93KCAyLCBnLmluKCdmaWx0ZXJNdWx0JykgKSksIGVudiApXG4gICAgICBjb25zdCBmaWx0ZXJlZE9zYyA9IEdpYmJlcmlzaC5maWx0ZXJzLmZhY3RvcnkoIG9zY1dpdGhFbnYsIGN1dG9mZiwgZy5pbignUScpLCBnLmluKCdzYXR1cmF0aW9uJyksIHByb3BzIClcblxuICAgICAgbGV0IHN5bnRoV2l0aEdhaW4gPSBnLm11bCggZmlsdGVyZWRPc2MsIGcuaW4oICdnYWluJyApIClcbiAgXG4gICAgICBpZiggc3luLnBhblZvaWNlcyA9PT0gdHJ1ZSApIHsgXG4gICAgICAgIHBhbm5lciA9IGcucGFuKCBzeW50aFdpdGhHYWluLCBzeW50aFdpdGhHYWluLCBnLmluKCAncGFuJyApICkgXG4gICAgICAgIHN5bi5ncmFwaCA9IFtwYW5uZXIubGVmdCwgcGFubmVyLnJpZ2h0XVxuICAgICAgfWVsc2V7XG4gICAgICAgIHN5bi5ncmFwaCA9IHN5bnRoV2l0aEdhaW5cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgc3luLl9fcmVxdWlyZXNSZWNvbXBpbGF0aW9uID0gWyAnd2F2ZWZvcm0nLCAnYW50aWFsaWFzJywgJ2ZpbHRlclR5cGUnLCdmaWx0ZXJNb2RlJyBdXG4gICAgc3luLl9fY3JlYXRlR3JhcGgoKVxuXG4gICAgR2liYmVyaXNoLmZhY3RvcnkoIHN5biwgc3luLmdyYXBoLCAnc3ludGgnLCBwcm9wcyAgKVxuXG4gICAgc3luLmVudiA9IGVudlxuXG4gICAgcmV0dXJuIHN5blxuICB9XG4gIFxuICBTeW50aC5kZWZhdWx0cyA9IHtcbiAgICB3YXZlZm9ybTonc2F3JyxcbiAgICBhdHRhY2s6IDQ0MTAwLFxuICAgIGRlY2F5OiA0NDEwMCxcbiAgICBnYWluOiAxLFxuICAgIHB1bHNld2lkdGg6LjI1LFxuICAgIGZyZXF1ZW5jeToyMjAsXG4gICAgcGFuOiAuNSxcbiAgICBhbnRpYWxpYXM6ZmFsc2UsXG4gICAgcGFuVm9pY2VzOmZhbHNlLFxuICAgIGxvdWRuZXNzOjEsXG4gICAgZ2xpZGU6MSxcbiAgICBzYXR1cmF0aW9uOjEsXG4gICAgZmlsdGVyTXVsdDoyLFxuICAgIFE6LjI1LFxuICAgIGN1dG9mZjouNSxcbiAgICBmaWx0ZXJUeXBlOjAsXG4gICAgZmlsdGVyTW9kZTowLFxuICAgIGlzTG93UGFzczoxXG4gIH1cblxuICAvLyBkbyBub3QgaW5jbHVkZSB2ZWxvY2l0eSwgd2hpY2ggc2hvdWRsIGFsd2F5cyBiZSBwZXIgdm9pY2VcbiAgbGV0IFBvbHlTeW50aCA9IEdpYmJlcmlzaC5Qb2x5VGVtcGxhdGUoIFN5bnRoLCBbJ2ZyZXF1ZW5jeScsJ2F0dGFjaycsJ2RlY2F5JywncHVsc2V3aWR0aCcsJ3BhbicsJ2dhaW4nLCdnbGlkZScsICdzYXR1cmF0aW9uJywgJ2ZpbHRlck11bHQnLCAnUScsICdjdXRvZmYnLCAncmVzb25hbmNlJywgJ2FudGlhbGlhcycsICdmaWx0ZXJUeXBlJywgJ3dhdmVmb3JtJywgJ2ZpbHRlck1vZGUnXSApIFxuXG4gIHJldHVybiBbIFN5bnRoLCBQb2x5U3ludGggXVxuXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG5cbiAgbGV0IEJpbm9wcyA9IHtcbiAgICBleHBvcnQoIG9iaiApIHtcbiAgICAgIGZvciggbGV0IGtleSBpbiBCaW5vcHMgKSB7XG4gICAgICAgIGlmKCBrZXkgIT09ICdleHBvcnQnICkge1xuICAgICAgICAgIG9ialsga2V5IF0gPSBCaW5vcHNbIGtleSBdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIFxuICAgIEFkZCggLi4uYXJncyApIHtcbiAgICAgIGxldCBpZCA9IEdpYmJlcmlzaC5mYWN0b3J5LmdldFVJRCgpXG4gICAgICByZXR1cm4geyBiaW5vcDp0cnVlLCBvcDonKycsIGlucHV0czphcmdzLCB1Z2VuTmFtZTonYWRkJyArIGlkLCBpZCB9XG4gICAgfSxcblxuICAgIFN1YiggLi4uYXJncyApIHtcbiAgICAgIGxldCBpZCA9IEdpYmJlcmlzaC5mYWN0b3J5LmdldFVJRCgpXG4gICAgICByZXR1cm4geyBiaW5vcDp0cnVlLCBvcDonLScsIGlucHV0czphcmdzLCB1Z2VuTmFtZTonc3ViJyArIGlkLCBpZCB9XG4gICAgfSxcblxuICAgIE11bCggLi4uYXJncyApIHtcbiAgICAgIGxldCBpZCA9IEdpYmJlcmlzaC5mYWN0b3J5LmdldFVJRCgpXG4gICAgICByZXR1cm4geyBiaW5vcDp0cnVlLCBvcDonKicsIGlucHV0czphcmdzLCB1Z2VuTmFtZTonbXVsJyArIGlkLCBpZCB9XG4gICAgfSxcblxuICAgIERpdiggLi4uYXJncyApIHtcbiAgICAgIGxldCBpZCA9IEdpYmJlcmlzaC5mYWN0b3J5LmdldFVJRCgpXG4gICAgICByZXR1cm4geyBiaW5vcDp0cnVlLCBvcDonLycsIGlucHV0czphcmdzLCB1Z2VuTmFtZTonZGl2JyArIGlkLCBpZCB9XG4gICAgfSxcblxuICAgIE1vZCggLi4uYXJncyApIHtcbiAgICAgIGxldCBpZCA9IEdpYmJlcmlzaC5mYWN0b3J5LmdldFVJRCgpXG4gICAgICByZXR1cm4geyBiaW5vcDp0cnVlLCBvcDonJScsIGlucHV0czphcmdzLCB1Z2VuTmFtZTonbW9kJyArIGlkLCBpZCB9XG4gICAgfSwgICBcbiAgfVxuXG4gIHJldHVybiBCaW5vcHNcbn1cbiIsImxldCBnID0gcmVxdWlyZSggJ2dlbmlzaC5qcycgKSxcbiAgICB1Z2VuID0gcmVxdWlyZSggJy4uL3VnZW4uanMnIClcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggR2liYmVyaXNoICkge1xuXG4gIGxldCBCdXMgPSB7IFxuICAgIGNyZWF0ZSgpIHtcbiAgICAgIGxldCBvdXRwdXQgPSAwXG5cbiAgICAgIGxldCBidXMgPSBPYmplY3QuY3JlYXRlKCB1Z2VuIClcblxuICAgICAgT2JqZWN0LmFzc2lnbiggYnVzLCB7XG4gICAgICAgIGNhbGxiYWNrKCkge1xuICAgICAgICAgIG91dHB1dCA9IDBcblxuICAgICAgICAgIGZvciggbGV0IGkgPSAwLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICBsZXQgaW5wdXQgPSBhcmd1bWVudHNbIGkgXSxcbiAgICAgICAgICAgICAgICBpc0FycmF5ID0gaW5wdXQgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXlcblxuICAgICAgICAgICAgb3V0cHV0ICs9IGlzQXJyYXkgPyBpbnB1dFsgMCBdIDogaW5wdXRcblxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBvdXRwdXRcbiAgICAgICAgfSxcbiAgICAgICAgaWQgOiBHaWJiZXJpc2guZmFjdG9yeS5nZXRVSUQoKSxcbiAgICAgICAgZGlydHkgOiB0cnVlLFxuICAgICAgICB0eXBlIDogJ2J1cycsXG4gICAgICAgIGlucHV0cyA6IFtdLFxuICAgICAgICBpbnB1dE5hbWVzIDogW10sXG4gICAgICB9KVxuXG4gICAgICBidXMudWdlbk5hbWUgPSBidXMuY2FsbGJhY2sudWdlbk5hbWUgPSAnYnVzXycgKyBidXMuaWRcblxuICAgICAgYnVzLmRpc2Nvbm5lY3RVZ2VuID0gZnVuY3Rpb24oIHVnZW4gKSB7XG4gICAgICAgIGxldCByZW1vdmVJZHggPSB0aGlzLmlucHV0cy5pbmRleE9mKCB1Z2VuIClcbiAgICAgICAgXG4gICAgICAgIGlmKCByZW1vdmVJZHggIT09IC0xICkge1xuICAgICAgICAgIHRoaXMuaW5wdXRzLnNwbGljZSggcmVtb3ZlSWR4LCAxIClcbiAgICAgICAgICBHaWJiZXJpc2guZGlydHkoIHRoaXMgKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiBidXNcbiAgICB9XG4gIH1cblxuICByZXR1cm4gQnVzLmNyZWF0ZVxuXG59XG5cbiIsImxldCBnID0gcmVxdWlyZSggJ2dlbmlzaC5qcycgKSxcbiAgICB1Z2VuID0gcmVxdWlyZSggJy4uL3VnZW4uanMnIClcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggR2liYmVyaXNoICkge1xuXG4gIGxldCBCdXMyID0geyBcbiAgICBjcmVhdGUoKSB7XG4gICAgICBsZXQgb3V0cHV0ID0gbmV3IEZsb2F0MzJBcnJheSggMiApXG5cbiAgICAgIGxldCBidXMgPSBPYmplY3QuY3JlYXRlKCB1Z2VuIClcblxuICAgICAgT2JqZWN0LmFzc2lnbiggYnVzLCB7XG4gICAgICAgIGNhbGxiYWNrKCkge1xuICAgICAgICAgIG91dHB1dFsgMCBdID0gb3V0cHV0WyAxIF0gPSAwXG5cbiAgICAgICAgICBmb3IoIGxldCBpID0gMCwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgbGV0IGlucHV0ID0gYXJndW1lbnRzWyBpIF0sXG4gICAgICAgICAgICAgICAgaXNBcnJheSA9IGlucHV0IGluc3RhbmNlb2YgRmxvYXQzMkFycmF5XG5cbiAgICAgICAgICAgIG91dHB1dFsgMCBdICs9IGlzQXJyYXkgPyBpbnB1dFsgMCBdIDogaW5wdXRcbiAgICAgICAgICAgIG91dHB1dFsgMSBdICs9IGlzQXJyYXkgPyBpbnB1dFsgMSBdIDogaW5wdXRcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gb3V0cHV0XG4gICAgICAgIH0sXG4gICAgICAgIGlkIDogR2liYmVyaXNoLmZhY3RvcnkuZ2V0VUlEKCksXG4gICAgICAgIGRpcnR5IDogdHJ1ZSxcbiAgICAgICAgdHlwZSA6ICdidXMnLFxuICAgICAgICBpbnB1dHMgOiBbXSxcbiAgICAgICAgaW5wdXROYW1lcyA6IFtdLFxuICAgICAgfSlcblxuICAgICAgYnVzLnVnZW5OYW1lID0gYnVzLmNhbGxiYWNrLnVnZW5OYW1lID0gJ2J1czJfJyArIGJ1cy5pZFxuXG4gICAgICBidXMuZGlzY29ubmVjdFVnZW4gPSBmdW5jdGlvbiggdWdlbiApIHtcbiAgICAgICAgbGV0IHJlbW92ZUlkeCA9IHRoaXMuaW5wdXRzLmluZGV4T2YoIHVnZW4gKVxuICAgICAgICBcbiAgICAgICAgaWYoIHJlbW92ZUlkeCAhPT0gLTEgKSB7XG4gICAgICAgICAgdGhpcy5pbnB1dHMuc3BsaWNlKCByZW1vdmVJZHgsIDEgKVxuICAgICAgICAgIEdpYmJlcmlzaC5kaXJ0eSggdGhpcyApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIGJ1c1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBCdXMyLmNyZWF0ZVxuXG59XG5cbiIsImNvbnN0ICBnICAgID0gcmVxdWlyZSggJ2dlbmlzaC5qcycgICksXG4gICAgICAgdWdlbiA9IHJlcXVpcmUoICcuLi91Z2VuLmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBjb25zdCBNb25vcHMgPSB7XG4gICAgZXhwb3J0KCBvYmogKSB7XG4gICAgICBmb3IoIGxldCBrZXkgaW4gTW9ub3BzICkge1xuICAgICAgICBpZigga2V5ICE9PSAnZXhwb3J0JyApIHtcbiAgICAgICAgICBvYmpbIGtleSBdID0gTW9ub3BzWyBrZXkgXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBcbiAgICBBYnMoIGlucHV0ICkge1xuICAgICAgY29uc3QgYWJzID0gT2JqZWN0LmNyZWF0ZSggdWdlbiApXG4gICAgICBjb25zdCBncmFwaCA9IGcuYWJzKCBnLmluKCdpbnB1dCcpIClcbiAgICAgIFxuICAgICAgR2liYmVyaXNoLmZhY3RvcnkoIGFicywgZ3JhcGgsICdhYnMnLCBPYmplY3QuYXNzaWduKHt9LCBNb25vcHMuZGVmYXVsdHMsIHsgaW5wdXQgfSkgKVxuXG4gICAgICByZXR1cm4gYWJzXG4gICAgfSxcblxuICAgIFBvdyggaW5wdXQsIGV4cG9uZW50ICkge1xuICAgICAgY29uc3QgcG93ID0gT2JqZWN0LmNyZWF0ZSggdWdlbiApXG4gICAgICBjb25zdCBncmFwaCA9IGcucG93KCBnLmluKCdpbnB1dCcpLCBnLmluKCdleHBvbmVudCcpIClcbiAgICAgIFxuICAgICAgR2liYmVyaXNoLmZhY3RvcnkoIHBvdywgZ3JhcGgsICdwb3cnLCBPYmplY3QuYXNzaWduKHt9LCBNb25vcHMuZGVmYXVsdHMsIHsgaW5wdXQsIGV4cG9uZW50IH0pIClcblxuICAgICAgcmV0dXJuIHBvd1xuICAgIH0sXG4gICAgQ2xhbXAoIGlucHV0LCBtaW4sIG1heCApIHtcbiAgICAgIGNvbnN0IGNsYW1wID0gT2JqZWN0LmNyZWF0ZSggdWdlbiApXG4gICAgICBjb25zdCBncmFwaCA9IGcuY2xhbXAoIGcuaW4oJ2lucHV0JyksIGcuaW4oJ21pbicpLCBnLmluKCdtYXgnKSApXG4gICAgICBcbiAgICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBjbGFtcCwgZ3JhcGgsICdjbGFtcCcsIE9iamVjdC5hc3NpZ24oe30sIE1vbm9wcy5kZWZhdWx0cywgeyBpbnB1dCwgbWluLCBtYXggfSkgKVxuXG4gICAgICByZXR1cm4gY2xhbXBcbiAgICB9LFxuXG4gICAgTWVyZ2UoIGlucHV0ICkge1xuICAgICAgY29uc3QgbWVyZ2VyID0gT2JqZWN0LmNyZWF0ZSggdWdlbiApXG4gICAgICBjb25zdCBjYiA9IGZ1bmN0aW9uKCBfaW5wdXQgKSB7XG4gICAgICAgIHJldHVybiBfaW5wdXRbMF0gKyBfaW5wdXRbMV1cbiAgICAgIH1cblxuICAgICAgR2liYmVyaXNoLmZhY3RvcnkoIG1lcmdlciwgZy5pbiggJ2lucHV0JyApLCAnbWVyZ2UnLCB7IGlucHV0IH0sIGNiIClcbiAgICAgIG1lcmdlci50eXBlID0gJ2FuYWx5c2lzJ1xuICAgICAgbWVyZ2VyLmlucHV0TmFtZXMgPSBbICdpbnB1dCcgXVxuICAgICAgbWVyZ2VyLmlucHV0cyA9IFsgaW5wdXQgXVxuICAgICAgbWVyZ2VyLmlucHV0ID0gaW5wdXRcbiAgICAgIFxuICAgICAgcmV0dXJuIG1lcmdlclxuICAgIH0sXG4gIH1cblxuICBNb25vcHMuZGVmYXVsdHMgPSB7IGlucHV0OjAgfVxuXG4gIHJldHVybiBNb25vcHNcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBjb25zdCBUaW1lID0ge1xuICAgIGJwbTogMTIwLFxuXG4gICAgZXhwb3J0OiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgIE9iamVjdC5hc3NpZ24oIHRhcmdldCwgVGltZSApXG4gICAgfSxcblxuICAgIG1zIDogZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4gdmFsICogR2liYmVyaXNoLmN0eC5zYW1wbGVSYXRlIC8gMTAwMDtcbiAgICB9LFxuXG4gICAgc2Vjb25kcyA6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgcmV0dXJuIHZhbCAqIEdpYmJlcmlzaC5jdHguc2FtcGxlUmF0ZTtcbiAgICB9LFxuXG4gICAgYmVhdHMgOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHsgXG4gICAgICAgIHZhciBzYW1wbGVzUGVyQmVhdCA9IEdpYmJlcmlzaC5jdHguc2FtcGxlUmF0ZSAvICggR2liYmVyaXNoLlRpbWUuYnBtIC8gNjAgKSA7XG4gICAgICAgIHJldHVybiBzYW1wbGVzUGVyQmVhdCAqIHZhbCA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFRpbWVcbn1cbiIsImNvbnN0IGdlbmlzaCA9IHJlcXVpcmUoJ2dlbmlzaC5qcycpLFxuICAgICAgc3NkID0gZ2VuaXNoLmhpc3RvcnksXG4gICAgICBub2lzZSA9IGdlbmlzaC5ub2lzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIFwidXNlIGpzZHNwXCI7XG5cbiAgY29uc3QgbGFzdCA9IHNzZCgwKTtcblxuICBjb25zdCB3aGl0ZSA9IGdlbmlzaC5zdWIoZ2VuaXNoLm11bChub2lzZSgpLCAyKSwgMSk7XG5cbiAgbGV0IG91dCA9IGdlbmlzaC5hZGQobGFzdC5vdXQsIGdlbmlzaC5kaXYoZ2VuaXNoLm11bCguMDIsIHdoaXRlKSwgMS4wMikpO1xuXG4gIGxhc3QuaW4ob3V0KTtcblxuICBvdXQgPSBnZW5pc2gubXVsKG91dCwgMy41KTtcblxuICByZXR1cm4gb3V0O1xufTsiLCJsZXQgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnIClcblxubGV0IGZlZWRiYWNrT3NjID0gZnVuY3Rpb24oIGZyZXF1ZW5jeSwgZmlsdGVyLCBwdWxzZXdpZHRoPS41LCBhcmd1bWVudFByb3BzICkge1xuICBpZiggYXJndW1lbnRQcm9wcyA9PT0gdW5kZWZpbmVkICkgYXJndW1lbnRQcm9wcyA9IHsgdHlwZTogMCB9XG5cbiAgbGV0IGxhc3RTYW1wbGUgPSBnLmhpc3RvcnkoKSxcbiAgICAgIC8vIGRldGVybWluZSBwaGFzZSBpbmNyZW1lbnQgYW5kIG1lbW9pemUgcmVzdWx0XG4gICAgICB3ID0gZy5tZW1vKCBnLmRpdiggZnJlcXVlbmN5LCBnLmdlbi5zYW1wbGVyYXRlICkgKSxcbiAgICAgIC8vIGNyZWF0ZSBzY2FsaW5nIGZhY3RvclxuICAgICAgbiA9IGcuc3ViKCAtLjUsIHcgKSxcbiAgICAgIHNjYWxpbmcgPSBnLm11bCggZy5tdWwoIDEzLCBmaWx0ZXIgKSwgZy5wb3coIG4sIDUgKSApLFxuICAgICAgLy8gY2FsY3VsYXRlIGRjIG9mZnNldCBhbmQgbm9ybWFsaXphdGlvbiBmYWN0b3JzXG4gICAgICBEQyA9IGcuc3ViKCAuMzc2LCBnLm11bCggdywgLjc1MiApICksXG4gICAgICBub3JtID0gZy5zdWIoIDEsIGcubXVsKCAyLCB3ICkgKSxcbiAgICAgIC8vIGRldGVybWluZSBwaGFzZVxuICAgICAgb3NjMVBoYXNlID0gZy5hY2N1bSggdywgMCwgeyBtaW46LTEgfSksXG4gICAgICBvc2MxLCBvdXRcblxuICAvLyBjcmVhdGUgY3VycmVudCBzYW1wbGUuLi4gZnJvbSB0aGUgcGFwZXI6XG4gIC8vIG9zYyA9IChvc2MgKyBzaW4oMipwaSoocGhhc2UgKyBvc2Mqc2NhbGluZykpKSowLjVmO1xuICBvc2MxID0gZy5tZW1vKCBcbiAgICBnLm11bChcbiAgICAgIGcuYWRkKFxuICAgICAgICBsYXN0U2FtcGxlLm91dCxcbiAgICAgICAgZy5zaW4oXG4gICAgICAgICAgZy5tdWwoXG4gICAgICAgICAgICBNYXRoLlBJICogMixcbiAgICAgICAgICAgIGcubWVtbyggZy5hZGQoIG9zYzFQaGFzZSwgZy5tdWwoIGxhc3RTYW1wbGUub3V0LCBzY2FsaW5nICkgKSApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgLjVcbiAgICApXG4gIClcblxuICAvLyBzdG9yZSBzYW1wbGUgdG8gdXNlIGFzIG1vZHVsYXRpb25cbiAgbGFzdFNhbXBsZS5pbiggb3NjMSApXG5cbiAgLy8gaWYgcHdtIC8gc3F1YXJlIHdhdmVmb3JtIGluc3RlYWQgb2Ygc2F3dG9vdGguLi5cbiAgaWYoIGFyZ3VtZW50UHJvcHMudHlwZSA9PT0gMSApIHsgXG4gICAgY29uc3QgbGFzdFNhbXBsZTIgPSBnLmhpc3RvcnkoKSAvLyBmb3Igb3NjIDJcbiAgICBjb25zdCBsYXN0U2FtcGxlTWFzdGVyID0gZy5oaXN0b3J5KCkgLy8gZm9yIHN1bSBvZiBvc2MxLG9zYzJcblxuICAgIGNvbnN0IG9zYzIgPSBnLm11bChcbiAgICAgIGcuYWRkKFxuICAgICAgICBsYXN0U2FtcGxlMi5vdXQsXG4gICAgICAgIGcuc2luKFxuICAgICAgICAgIGcubXVsKFxuICAgICAgICAgICAgTWF0aC5QSSAqIDIsXG4gICAgICAgICAgICBnLm1lbW8oIGcuYWRkKCBvc2MxUGhhc2UsIGcubXVsKCBsYXN0U2FtcGxlMi5vdXQsIHNjYWxpbmcgKSwgcHVsc2V3aWR0aCApIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICksXG4gICAgICAuNVxuICAgIClcblxuICAgIGxhc3RTYW1wbGUyLmluKCBvc2MyIClcbiAgICBvdXQgPSBnLm1lbW8oIGcuc3ViKCBsYXN0U2FtcGxlLm91dCwgbGFzdFNhbXBsZTIub3V0ICkgKVxuICAgIG91dCA9IGcubWVtbyggZy5hZGQoIGcubXVsKCAyLjUsIG91dCApLCBnLm11bCggLTEuNSwgbGFzdFNhbXBsZU1hc3Rlci5vdXQgKSApIClcbiAgICBcbiAgICBsYXN0U2FtcGxlTWFzdGVyLmluKCBnLnN1Yiggb3NjMSwgb3NjMiApIClcblxuICB9ZWxzZXtcbiAgICAgLy8gb2Zmc2V0IGFuZCBub3JtYWxpemVcbiAgICBvc2MxID0gZy5hZGQoIGcubXVsKCAyLjUsIG9zYzEgKSwgZy5tdWwoIC0xLjUsIGxhc3RTYW1wbGUub3V0ICkgKVxuICAgIG9zYzEgPSBnLmFkZCggb3NjMSwgREMgKVxuIFxuICAgIG91dCA9IG9zYzFcbiAgfVxuXG4gIHJldHVybiBnLm11bCggb3V0LCBub3JtIClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmZWVkYmFja09zY1xuIiwiY29uc3QgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnICksXG4gICAgICB1Z2VuID0gcmVxdWlyZSggJy4uL3VnZW4uanMnICksXG4gICAgICBmZWVkYmFja09zYyA9IHJlcXVpcmUoICcuL2ZtZmVlZGJhY2tvc2MuanMnIClcblxuLy8gIF9fbWFrZU9zY2lsbGF0b3JfXyggdHlwZSwgZnJlcXVlbmN5LCBhbnRpYWxpYXMgKSB7XG4gICAgXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG4gIGxldCBPc2NpbGxhdG9ycyA9IHtcbiAgICBleHBvcnQoIG9iaiApIHtcbiAgICAgIGZvciggbGV0IGtleSBpbiBPc2NpbGxhdG9ycyApIHtcbiAgICAgICAgaWYoIGtleSAhPT0gJ2V4cG9ydCcgKSB7XG4gICAgICAgICAgb2JqWyBrZXkgXSA9IE9zY2lsbGF0b3JzWyBrZXkgXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGdlbmlzaDoge1xuICAgICAgQnJvd246IHJlcXVpcmUoICcuL2Jyb3dubm9pc2UuanMnICksXG4gICAgICBQaW5rOiAgcmVxdWlyZSggJy4vcGlua25vaXNlLmpzJyAgKVxuICAgIH0sXG5cbiAgICBXYXZldGFibGU6IHJlcXVpcmUoICcuL3dhdmV0YWJsZS5qcycgKSggR2liYmVyaXNoICksXG4gICAgXG4gICAgU3F1YXJlKCBpbnB1dFByb3BzICkge1xuICAgICAgY29uc3Qgc3FyICAgPSBPYmplY3QuY3JlYXRlKCB1Z2VuICkgXG4gICAgICBjb25zdCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oeyBhbnRpYWxpYXM6ZmFsc2UgfSwgT3NjaWxsYXRvcnMuZGVmYXVsdHMsIGlucHV0UHJvcHMgKVxuICAgICAgY29uc3Qgb3NjICAgPSBPc2NpbGxhdG9ycy5mYWN0b3J5KCAnc3F1YXJlJywgZy5pbiggJ2ZyZXF1ZW5jeScgKSwgcHJvcHMuYW50aWFsaWFzIClcbiAgICAgIGNvbnN0IGdyYXBoID0gZy5tdWwoIG9zYywgZy5pbignZ2FpbicgKSApXG5cbiAgICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBzcXIsIGdyYXBoLCAnc3FyJywgcHJvcHMgKVxuXG4gICAgICByZXR1cm4gc3FyXG4gICAgfSxcblxuICAgIFBXTSggaW5wdXRQcm9wcyApIHtcbiAgICAgIGNvbnN0IHB3bSAgID0gT2JqZWN0LmNyZWF0ZSggdWdlbiApIFxuICAgICAgY29uc3QgcHJvcHMgPSBPYmplY3QuYXNzaWduKHsgYW50aWFsaWFzOmZhbHNlLCBwdWxzZXdpZHRoOi4yNSB9LCBPc2NpbGxhdG9ycy5kZWZhdWx0cywgaW5wdXRQcm9wcyApXG4gICAgICBjb25zdCBvc2MgICA9IE9zY2lsbGF0b3JzLmZhY3RvcnkoICdwd20nLCBnLmluKCAnZnJlcXVlbmN5JyApLCBwcm9wcy5hbnRpYWxpYXMgKVxuICAgICAgY29uc3QgZ3JhcGggPSBnLm11bCggb3NjLCBnLmluKCdnYWluJyApIClcblxuICAgICAgR2liYmVyaXNoLmZhY3RvcnkoIHB3bSwgZ3JhcGgsICdwd20nLCBwcm9wcyApXG5cbiAgICAgIHJldHVybiBwd21cbiAgICB9LFxuXG4gICAgU2luZSggaW5wdXRQcm9wcyApIHtcbiAgICAgIGNvbnN0IHNpbmUgID0gT2JqZWN0LmNyZWF0ZSggdWdlbiApXG4gICAgICBjb25zdCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIE9zY2lsbGF0b3JzLmRlZmF1bHRzLCBpbnB1dFByb3BzIClcbiAgICAgIGNvbnN0IGdyYXBoID0gZy5tdWwoIGcuY3ljbGUoIGcuaW4oJ2ZyZXF1ZW5jeScpICksIGcuaW4oJ2dhaW4nKSApXG5cbiAgICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBzaW5lLCBncmFwaCwgJ3NpbmUnLCBwcm9wcyApXG4gICAgICBcbiAgICAgIHJldHVybiBzaW5lXG4gICAgfSxcblxuICAgIE5vaXNlKCBpbnB1dFByb3BzICkge1xuICAgICAgY29uc3Qgbm9pc2UgPSBPYmplY3QuY3JlYXRlKCB1Z2VuIClcbiAgICAgIGNvbnN0IHByb3BzID0gT2JqZWN0LmFzc2lnbigge30sIHsgZ2FpbjogMSwgY29sb3I6J3doaXRlJyB9LCBpbnB1dFByb3BzIClcbiAgICAgIGxldCBncmFwaCBcblxuICAgICAgc3dpdGNoKCBwcm9wcy5jb2xvciApIHtcbiAgICAgICAgY2FzZSAnYnJvd24nOlxuICAgICAgICAgIGdyYXBoID0gZy5tdWwoIE9zY2lsbGF0b3JzLmdlbmlzaC5Ccm93bigpLCBnLmluKCdnYWluJykgKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdwaW5rJzpcbiAgICAgICAgICBncmFwaCA9IGcubXVsKCBPc2NpbGxhdG9ycy5nZW5pc2guUGluaygpLCBnLmluKCdnYWluJykgKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGdyYXBoID0gZy5tdWwoIGcubm9pc2UoKSwgZy5pbignZ2FpbicpIClcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgR2liYmVyaXNoLmZhY3RvcnkoIG5vaXNlLCBncmFwaCwgJ25vaXNlJywgcHJvcHMgKVxuXG4gICAgICByZXR1cm4gbm9pc2VcbiAgICB9LFxuXG4gICAgU2F3KCBpbnB1dFByb3BzICkge1xuICAgICAgY29uc3Qgc2F3ICAgPSBPYmplY3QuY3JlYXRlKCB1Z2VuICkgXG4gICAgICBjb25zdCBwcm9wcyA9IE9iamVjdC5hc3NpZ24oeyBhbnRpYWxpYXM6ZmFsc2UgfSwgT3NjaWxsYXRvcnMuZGVmYXVsdHMsIGlucHV0UHJvcHMgKVxuICAgICAgY29uc3Qgb3NjICAgPSBPc2NpbGxhdG9ycy5mYWN0b3J5KCAnc2F3JywgZy5pbiggJ2ZyZXF1ZW5jeScgKSwgcHJvcHMuYW50aWFsaWFzIClcbiAgICAgIGNvbnN0IGdyYXBoID0gZy5tdWwoIG9zYywgZy5pbignZ2FpbicgKSApXG5cbiAgICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBzYXcsIGdyYXBoLCAnc2F3JywgcHJvcHMgKVxuXG4gICAgICByZXR1cm4gc2F3XG4gICAgfSxcblxuICAgIFJldmVyc2VTYXcoIGlucHV0UHJvcHMgKSB7XG4gICAgICBjb25zdCBzYXcgICA9IE9iamVjdC5jcmVhdGUoIHVnZW4gKSBcbiAgICAgIGNvbnN0IHByb3BzID0gT2JqZWN0LmFzc2lnbih7IGFudGlhbGlhczpmYWxzZSB9LCBPc2NpbGxhdG9ycy5kZWZhdWx0cywgaW5wdXRQcm9wcyApXG4gICAgICBjb25zdCBvc2MgICA9IGcuc3ViKCAxLCBPc2NpbGxhdG9ycy5mYWN0b3J5KCAnc2F3JywgZy5pbiggJ2ZyZXF1ZW5jeScgKSwgcHJvcHMuYW50aWFsaWFzICkgKVxuICAgICAgY29uc3QgZ3JhcGggPSBnLm11bCggb3NjLCBnLmluKCAnZ2FpbicgKSApXG5cbiAgICAgIEdpYmJlcmlzaC5mYWN0b3J5KCBzYXcsIGdyYXBoLCAncnNhdycsIHByb3BzIClcbiAgICAgIFxuICAgICAgcmV0dXJuIHNhd1xuICAgIH0sXG5cbiAgICBmYWN0b3J5KCB0eXBlLCBmcmVxdWVuY3ksIGFudGlhbGlhcz1mYWxzZSApIHtcbiAgICAgIGxldCBvc2NcblxuICAgICAgc3dpdGNoKCB0eXBlICkge1xuICAgICAgICBjYXNlICdzYXcnOlxuICAgICAgICAgIGlmKCBhbnRpYWxpYXMgPT09IGZhbHNlICkge1xuICAgICAgICAgICAgb3NjID0gZy5waGFzb3IoIGZyZXF1ZW5jeSApXG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBvc2MgPSBmZWVkYmFja09zYyggZnJlcXVlbmN5LCAxIClcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3NxdWFyZSc6XG4gICAgICAgICAgaWYoIGFudGlhbGlhcyA9PT0gdHJ1ZSApIHtcbiAgICAgICAgICAgIG9zYyA9IGZlZWRiYWNrT3NjKCBmcmVxdWVuY3ksIDEsIC41LCB7IHR5cGU6MSB9KVxuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgb3NjID0gZy53YXZldGFibGUoIGZyZXF1ZW5jeSwgeyBidWZmZXI6T3NjaWxsYXRvcnMuU3F1YXJlLmJ1ZmZlciwgbmFtZTonc3F1YXJlJyB9IClcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3NpbmUnOlxuICAgICAgICAgIG9zYyA9IGcuY3ljbGUoIGZyZXF1ZW5jeSApXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3B3bSc6XG4gICAgICAgICAgbGV0IHB1bHNld2lkdGggPSBnLmluKCdwdWxzZXdpZHRoJylcbiAgICAgICAgICBpZiggYW50aWFsaWFzID09PSB0cnVlICkge1xuICAgICAgICAgICAgb3NjID0gZmVlZGJhY2tPc2MoIGZyZXF1ZW5jeSwgMSwgcHVsc2V3aWR0aCwgeyB0eXBlOjEgfSlcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxldCBwaGFzZSA9IGcucGhhc29yKCBmcmVxdWVuY3ksIDAsIHsgbWluOjAgfSApXG4gICAgICAgICAgICBvc2MgPSBnLmx0KCBwaGFzZSwgcHVsc2V3aWR0aCApXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3NjXG4gICAgfVxuICB9XG5cbiAgT3NjaWxsYXRvcnMuU3F1YXJlLmJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoIDEwMjQgKVxuXG4gIGZvciggbGV0IGkgPSAxMDIzOyBpID49IDA7IGktLSApIHsgXG4gICAgT3NjaWxsYXRvcnMuU3F1YXJlLmJ1ZmZlciBbIGkgXSA9IGkgLyAxMDI0ID4gLjUgPyAxIDogLTFcbiAgfVxuXG4gIE9zY2lsbGF0b3JzLmRlZmF1bHRzID0ge1xuICAgIGZyZXF1ZW5jeTogNDQwLFxuICAgIGdhaW46IDFcbiAgfVxuXG4gIHJldHVybiBPc2NpbGxhdG9yc1xuXG59XG4iLCJjb25zdCBnZW5pc2ggPSByZXF1aXJlKCdnZW5pc2guanMnKSxcbiAgICAgIHNzZCA9IGdlbmlzaC5oaXN0b3J5LFxuICAgICAgbm9pc2UgPSBnZW5pc2gubm9pc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICBcInVzZSBqc2RzcFwiO1xuXG4gIGNvbnN0IGIwID0gc3NkKDApLFxuICAgICAgICBiMSA9IHNzZCgwKSxcbiAgICAgICAgYjIgPSBzc2QoMCksXG4gICAgICAgIGIzID0gc3NkKDApLFxuICAgICAgICBiNCA9IHNzZCgwKSxcbiAgICAgICAgYjUgPSBzc2QoMCksXG4gICAgICAgIGI2ID0gc3NkKDApO1xuICBjb25zdCB3aGl0ZSA9IGdlbmlzaC5zdWIoZ2VuaXNoLm11bChub2lzZSgpLCAyKSwgMSk7XG5cbiAgYjAuaW4oZ2VuaXNoLmFkZChnZW5pc2gubXVsKC45OTg4NiwgYjAub3V0KSwgZ2VuaXNoLm11bCh3aGl0ZSwgLjA1NTUxNzkpKSk7XG4gIGIxLmluKGdlbmlzaC5hZGQoZ2VuaXNoLm11bCguOTkzMzIsIGIxLm91dCksIGdlbmlzaC5tdWwod2hpdGUsIC4wNzUwNTc5KSkpO1xuICBiMi5pbihnZW5pc2guYWRkKGdlbmlzaC5tdWwoLjk2OTAwLCBiMi5vdXQpLCBnZW5pc2gubXVsKHdoaXRlLCAuMTUzODUyMCkpKTtcbiAgYjMuaW4oZ2VuaXNoLmFkZChnZW5pc2gubXVsKC44ODY1MCwgYjMub3V0KSwgZ2VuaXNoLm11bCh3aGl0ZSwgLjMxMDQ4NTYpKSk7XG4gIGI0LmluKGdlbmlzaC5hZGQoZ2VuaXNoLm11bCguNTUwMDAsIGI0Lm91dCksIGdlbmlzaC5tdWwod2hpdGUsIC41MzI5NTIyKSkpO1xuICBiNS5pbihnZW5pc2guc3ViKGdlbmlzaC5tdWwoLS43NjE2LCBiNS5vdXQpLCBnZW5pc2gubXVsKHdoaXRlLCAuMDE2ODk4MCkpKTtcblxuICBvdXQgPSBnZW5pc2gubXVsKGdlbmlzaC5hZGQoZ2VuaXNoLmFkZChnZW5pc2guYWRkKGdlbmlzaC5hZGQoZ2VuaXNoLmFkZChnZW5pc2guYWRkKGdlbmlzaC5hZGQoYjAub3V0LCBiMC5vdXQpLCBiMC5vdXQpLCBiMC5vdXQpLCBiMC5vdXQpLCBiMC5vdXQpLCBiMC5vdXQpLCBnZW5pc2gubXVsKHdoaXRlLCAuNTM2MikpLCAuMTEpO1xuXG4gIGI2LmluKGdlbmlzaC5tdWwod2hpdGUsIC4xMTU5MjYpKTtcblxuICByZXR1cm4gb3V0O1xufTsiLCJsZXQgZyA9IHJlcXVpcmUoICdnZW5pc2guanMnICksXG4gICAgdWdlbiA9IHJlcXVpcmUoICcuLi91Z2VuLmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxuICBjb25zdCBXYXZldGFibGUgPSBmdW5jdGlvbiggaW5wdXRQcm9wcyApIHtcbiAgICBjb25zdCB3YXZldGFibGUgPSBPYmplY3QuY3JlYXRlKCB1Z2VuIClcbiAgICBjb25zdCBwcm9wcyAgPSBPYmplY3QuYXNzaWduKHt9LCBHaWJiZXJpc2gub3NjaWxsYXRvcnMuZGVmYXVsdHMsIGlucHV0UHJvcHMgKVxuICAgIGNvbnN0IG9zYyA9IGcud2F2ZXRhYmxlKCBnLmluKCdmcmVxdWVuY3knKSwgcHJvcHMgKVxuICAgIGNvbnN0IGdyYXBoID0gZy5tdWwoIFxuICAgICAgb3NjLCBcbiAgICAgIGcuaW4oICdnYWluJyApXG4gICAgKVxuXG4gICAgR2liYmVyaXNoLmZhY3RvcnkoIHdhdmV0YWJsZSwgZ3JhcGgsICd3YXZldGFibGUnLCBwcm9wcyApXG5cbiAgICByZXR1cm4gd2F2ZXRhYmxlXG4gIH1cblxuICBnLndhdmV0YWJsZSA9IGZ1bmN0aW9uKCBmcmVxdWVuY3ksIHByb3BzICkge1xuICAgIGxldCBkYXRhUHJvcHMgPSB7IGltbXV0YWJsZTp0cnVlIH1cblxuICAgIC8vIHVzZSBnbG9iYWwgcmVmZXJlbmNlcyBpZiBhcHBsaWNhYmxlXG4gICAgaWYoIHByb3BzLm5hbWUgIT09IHVuZGVmaW5lZCApIGRhdGFQcm9wcy5nbG9iYWwgPSBwcm9wcy5uYW1lXG5cbiAgICBjb25zdCBidWZmZXIgPSBnLmRhdGEoIHByb3BzLmJ1ZmZlciwgMSwgZGF0YVByb3BzIClcblxuICAgIHJldHVybiBnLnBlZWsoIGJ1ZmZlciwgZy5waGFzb3IoIGZyZXF1ZW5jeSwgMCwgeyBtaW46MCB9ICkgKVxuICB9XG5cbiAgcmV0dXJuIFdhdmV0YWJsZVxufVxuIiwiY29uc3QgUXVldWUgPSByZXF1aXJlKCAnLi4vZXh0ZXJuYWwvcHJpb3JpdHlxdWV1ZS5qcycgKVxuY29uc3QgQmlnICAgPSByZXF1aXJlKCAnYmlnLmpzJyApXG5cbmxldCBTY2hlZHVsZXIgPSB7XG4gIHBoYXNlOiAwLFxuXG4gIHF1ZXVlOiBuZXcgUXVldWUoICggYSwgYiApID0+IHtcbiAgICBpZiggYS50aW1lID09PSBiLnRpbWUgKSB7IC8vYS50aW1lLmVxKCBiLnRpbWUgKSApIHtcbiAgICAgIHJldHVybiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eVxuICAgIH1lbHNle1xuICAgICAgcmV0dXJuIGEudGltZSAtIGIudGltZSAvL2EudGltZS5taW51cyggYi50aW1lIClcbiAgICB9XG4gIH0pLFxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucXVldWUuZGF0YS5sZW5ndGggPSAwXG4gICAgdGhpcy5xdWV1ZS5sZW5ndGggPSAwXG4gIH0sXG5cbiAgYWRkKCB0aW1lLCBmdW5jLCBwcmlvcml0eSA9IDAgKSB7XG4gICAgdGltZSArPSB0aGlzLnBoYXNlXG5cbiAgICB0aGlzLnF1ZXVlLnB1c2goeyB0aW1lLCBmdW5jLCBwcmlvcml0eSB9KVxuICB9LFxuXG4gIHRpY2soKSB7XG4gICAgaWYoIHRoaXMucXVldWUubGVuZ3RoICkge1xuICAgICAgbGV0IG5leHQgPSB0aGlzLnF1ZXVlLnBlZWsoKVxuXG4gICAgICB3aGlsZSggdGhpcy5waGFzZSA+PSBuZXh0LnRpbWUgKSB7XG4gICAgICAgIG5leHQuZnVuYygpXG4gICAgICAgIHRoaXMucXVldWUucG9wKClcbiAgICAgICAgbmV4dCA9IHRoaXMucXVldWUucGVlaygpXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICB0aGlzLnBoYXNlKytcbiAgfSxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTY2hlZHVsZXJcbiIsImNvbnN0IGcgPSByZXF1aXJlKCAnZ2VuaXNoLmpzJyApLFxuICAgICAgdWdlbiA9IHJlcXVpcmUoICcuLi91Z2VuLmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcbiAgY29uc3QgX19wcm90b19fID0gT2JqZWN0LmNyZWF0ZSggdWdlbiApXG5cbiAgT2JqZWN0LmFzc2lnbiggX19wcm90b19fLCB7XG4gICAgc3RhcnQoKSB7XG4gICAgICB0aGlzLmNvbm5lY3QoKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuICAgIHN0b3AoKSB7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3QoKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH0pXG5cbiAgY29uc3QgU2VxMiA9IHsgXG4gICAgY3JlYXRlKCBpbnB1dFByb3BzICkge1xuICAgICAgY29uc3Qgc2VxID0gT2JqZWN0LmNyZWF0ZSggX19wcm90b19fICksXG4gICAgICAgICAgICBwcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIFNlcTIuZGVmYXVsdHMsIGlucHV0UHJvcHMgKVxuXG4gICAgICBzZXEucGhhc2UgPSAwXG4gICAgICBzZXEuaW5wdXROYW1lcyA9IFsgJ3JhdGUnIF1cbiAgICAgIHNlcS5pbnB1dHMgPSBbIDEgXVxuICAgICAgc2VxLm5leHRUaW1lID0gMFxuICAgICAgc2VxLnZhbHVlc1BoYXNlID0gMFxuICAgICAgc2VxLnRpbWluZ3NQaGFzZSA9IDBcbiAgICAgIHNlcS5pZCA9IEdpYmJlcmlzaC5mYWN0b3J5LmdldFVJRCgpXG4gICAgICBzZXEuZGlydHkgPSB0cnVlXG4gICAgICBzZXEudHlwZSA9ICdzZXEnXG5cbiAgICAgIGlmKCBwcm9wcy50YXJnZXQgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgc2VxLmFub25GdW5jdGlvbiA9IHRydWVcbiAgICAgIH1lbHNleyBcbiAgICAgICAgc2VxLmFub25GdW5jdGlvbiA9IGZhbHNlXG4gICAgICAgIHNlcS5jYWxsRnVuY3Rpb24gPSB0eXBlb2YgcHJvcHMudGFyZ2V0WyBwcm9wcy5rZXkgXSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgfVxuXG4gICAgICBPYmplY3QuYXNzaWduKCBzZXEsIHByb3BzIClcblxuICAgICAgc2VxLmNhbGxiYWNrID0gZnVuY3Rpb24oIHJhdGUgKSB7XG4gICAgICAgIGlmKCBzZXEucGhhc2UgPj0gc2VxLm5leHRUaW1lICkge1xuICAgICAgICAgIGxldCB2YWx1ZSA9IHNlcS52YWx1ZXNbIHNlcS52YWx1ZXNQaGFzZSsrICUgc2VxLnZhbHVlcy5sZW5ndGggXVxuXG4gICAgICAgICAgaWYoIHNlcS5hbm9uRnVuY3Rpb24gfHwgdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICkgdmFsdWUgPSB2YWx1ZSgpXG4gICAgICAgICAgXG4gICAgICAgICAgaWYoIHNlcS5hbm9uRnVuY3Rpb24gPT09IGZhbHNlICkge1xuICAgICAgICAgICAgaWYoIHNlcS5jYWxsRnVuY3Rpb24gPT09IGZhbHNlICkge1xuICAgICAgICAgICAgICBzZXEudGFyZ2V0WyBzZXEua2V5IF0gPSB2YWx1ZVxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIHNlcS50YXJnZXRbIHNlcS5rZXkgXSggdmFsdWUgKSBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZXEucGhhc2UgLT0gc2VxLm5leHRUaW1lXG5cbiAgICAgICAgICBsZXQgdGltaW5nID0gc2VxLnRpbWluZ3NbIHNlcS50aW1pbmdzUGhhc2UrKyAlIHNlcS50aW1pbmdzLmxlbmd0aCBdXG4gICAgICAgICAgaWYoIHR5cGVvZiB0aW1pbmcgPT09ICdmdW5jdGlvbicgKSB0aW1pbmcgPSB0aW1pbmcoKVxuXG4gICAgICAgICAgc2VxLm5leHRUaW1lID0gdGltaW5nXG4gICAgICAgIH1cblxuICAgICAgICBzZXEucGhhc2UgKz0gcmF0ZVxuXG4gICAgICAgIHJldHVybiAwXG4gICAgICB9XG5cbiAgICAgIHNlcS51Z2VuTmFtZSA9IHNlcS5jYWxsYmFjay51Z2VuTmFtZSA9ICdzZXFfJyArIHNlcS5pZFxuICAgICAgXG4gICAgICBsZXQgdmFsdWUgPSBzZXEucmF0ZVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KCBzZXEsICdyYXRlJywge1xuICAgICAgICBnZXQoKSB7IHJldHVybiB2YWx1ZSB9LFxuICAgICAgICBzZXQoIHYgKSB7XG4gICAgICAgICAgaWYoIHZhbHVlICE9PSB2ICkge1xuICAgICAgICAgICAgR2liYmVyaXNoLmRpcnR5KCBzZXEgKVxuICAgICAgICAgICAgdmFsdWUgPSB2XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gc2VxXG4gICAgfVxuICB9XG5cbiAgU2VxMi5kZWZhdWx0cyA9IHsgcmF0ZTogMSB9XG5cbiAgcmV0dXJuIFNlcTIuY3JlYXRlXG5cbn1cblxuIiwiY29uc3QgUXVldWUgPSByZXF1aXJlKCAnLi4vZXh0ZXJuYWwvcHJpb3JpdHlxdWV1ZS5qcycgKVxuY29uc3QgQmlnICAgPSByZXF1aXJlKCAnYmlnLmpzJyApXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIEdpYmJlcmlzaCApIHtcblxubGV0IFNlcXVlbmNlciA9IHByb3BzID0+IHtcbiAgbGV0IHNlcSA9IHtcbiAgICBfX2lzUnVubmluZzpmYWxzZSxcbiAgICBrZXk6IHByb3BzLmtleSwgXG4gICAgdGFyZ2V0OiAgcHJvcHMudGFyZ2V0LFxuICAgIHZhbHVlczogIHByb3BzLnZhbHVlcyxcbiAgICB0aW1pbmdzOiBwcm9wcy50aW1pbmdzLFxuICAgIF9fdmFsdWVzUGhhc2U6ICAwLFxuICAgIF9fdGltaW5nc1BoYXNlOiAwLFxuICAgIHByaW9yaXR5OiBwcm9wcy5wcmlvcml0eSA9PT0gdW5kZWZpbmVkID8gMCA6IHByb3BzLnByaW9yaXR5LFxuXG4gICAgdGljaygpIHtcbiAgICAgIGxldCB2YWx1ZSAgPSBzZXEudmFsdWVzWyAgc2VxLl9fdmFsdWVzUGhhc2UrKyAgJSBzZXEudmFsdWVzLmxlbmd0aCAgXSxcbiAgICAgICAgICB0aW1pbmcgPSBzZXEudGltaW5nc1sgc2VxLl9fdGltaW5nc1BoYXNlKysgJSBzZXEudGltaW5ncy5sZW5ndGggXVxuXG4gICAgICBpZiggdHlwZW9mIHRpbWluZyA9PT0gJ2Z1bmN0aW9uJyApIHRpbWluZyA9IHRpbWluZygpXG5cbiAgICAgIGlmKCB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYgc2VxLnRhcmdldCA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICB2YWx1ZSgpXG4gICAgICB9ZWxzZSBpZiggdHlwZW9mIHNlcS50YXJnZXRbIHNlcS5rZXkgXSA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgICAgaWYoIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyApIHZhbHVlID0gdmFsdWUoKVxuICAgICAgICBzZXEudGFyZ2V0WyBzZXEua2V5IF0oIHZhbHVlIClcbiAgICAgIH1lbHNle1xuICAgICAgICBpZiggdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICkgdmFsdWUgPSB2YWx1ZSgpXG4gICAgICAgIHNlcS50YXJnZXRbIHNlcS5rZXkgXSA9IHZhbHVlXG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmKCBzZXEuX19pc1J1bm5pbmcgPT09IHRydWUgKSB7XG4gICAgICAgIEdpYmJlcmlzaC5zY2hlZHVsZXIuYWRkKCB0aW1pbmcsIHNlcS50aWNrLCBzZXEucHJpb3JpdHkgKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGFydCggZGVsYXkgPSAwICkge1xuICAgICAgc2VxLl9faXNSdW5uaW5nID0gdHJ1ZVxuICAgICAgR2liYmVyaXNoLnNjaGVkdWxlci5hZGQoIGRlbGF5LCBzZXEudGljaywgc2VxLnByaW9yaXR5IClcbiAgICAgIHJldHVybiBzZXFcbiAgICB9LFxuXG4gICAgc3RvcCgpIHtcbiAgICAgIHNlcS5fX2lzUnVubmluZyA9IGZhbHNlXG4gICAgICByZXR1cm4gc2VxXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNlcSBcbn1cblxuU2VxdWVuY2VyLm1ha2UgPSBmdW5jdGlvbiggdmFsdWVzLCB0aW1pbmdzLCB0YXJnZXQsIGtleSApIHtcbiAgcmV0dXJuIFNlcXVlbmNlcih7IHZhbHVlcywgdGltaW5ncywgdGFyZ2V0LCBrZXkgfSlcbn1cblxucmV0dXJuIFNlcXVlbmNlclxuXG59XG4iLCJsZXQgdWdlbiA9IHtcbiAgZnJlZSgpIHtcbiAgICBHaWJiZXJpc2guZ2VuaXNoLmdlbi5mcmVlKCB0aGlzLmdyYXBoIClcbiAgfSxcblxuICBwcmludCgpIHtcbiAgICBjb25zb2xlLmxvZyggdGhpcy5jYWxsYmFjay50b1N0cmluZygpIClcbiAgfSxcblxuICBjb25uZWN0KCB0YXJnZXQsIGxldmVsPTEgKSB7XG4gICAgaWYoIHRoaXMuY29ubmVjdGVkID09PSB1bmRlZmluZWQgKSB0aGlzLmNvbm5lY3RlZCA9IFtdXG5cbiAgICBsZXQgaW5wdXQgPSBsZXZlbCA9PT0gMSA/IHRoaXMgOiBHaWJiZXJpc2guYmlub3BzLk11bCggdGhpcywgbGV2ZWwgKVxuXG4gICAgaWYoIHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbCApIHRhcmdldCA9IEdpYmJlcmlzaC5vdXRwdXQgXG5cbiAgICBpZiggdGFyZ2V0LmlucHV0cyApXG4gICAgICB0YXJnZXQuaW5wdXRzLnB1c2goIGlucHV0IClcbiAgICBlbHNlXG4gICAgICB0YXJnZXQuaW5wdXQgPSBpbnB1dFxuXG4gICAgR2liYmVyaXNoLmRpcnR5KCB0YXJnZXQgKVxuXG4gICAgdGhpcy5jb25uZWN0ZWQucHVzaChbIHRhcmdldCwgaW5wdXQgXSlcbiAgICBcbiAgICByZXR1cm4gdGhpc1xuICB9LFxuXG4gIGRpc2Nvbm5lY3QoIHRhcmdldCApIHtcbiAgICBpZiggdGFyZ2V0ID09PSB1bmRlZmluZWQgKXtcbiAgICAgIGZvciggbGV0IGNvbm5lY3Rpb24gb2YgdGhpcy5jb25uZWN0ZWQgKSB7XG4gICAgICAgIGNvbm5lY3Rpb25bMF0uZGlzY29ubmVjdFVnZW4oIGNvbm5lY3Rpb25bMV0gKVxuICAgICAgfVxuICAgICAgdGhpcy5jb25uZWN0ZWQubGVuZ3RoID0gMFxuICAgIH1lbHNle1xuICAgICAgY29uc3QgY29ubmVjdGlvbiA9IHRoaXMuY29ubmVjdGVkLmZpbmQoIHYgPT4gdlswXSA9PT0gdGFyZ2V0IClcbiAgICAgIHRhcmdldC5kaXNjb25uZWN0VWdlbiggY29ubmVjdGlvblsxXSApXG4gICAgICBjb25zdCB0YXJnZXRJZHggPSB0aGlzLmNvbm5lY3RlZC5pbmRleE9mKCBjb25uZWN0aW9uIClcbiAgICAgIHRoaXMuY29ubmVjdGVkLnNwbGljZSggdGFyZ2V0SWR4LCAxIClcbiAgICB9XG4gIH0sXG5cbiAgY2hhaW4oIHRhcmdldCwgbGV2ZWw9MSApIHtcbiAgICB0aGlzLmNvbm5lY3QoIHRhcmdldCxsZXZlbCApXG5cbiAgICByZXR1cm4gdGFyZ2V0XG4gIH0sXG5cbiAgX19yZWRvR3JhcGgoKSB7XG4gICAgdGhpcy5fX2NyZWF0ZUdyYXBoKClcbiAgICB0aGlzLmNhbGxiYWNrID0gR2liYmVyaXNoLmdlbmlzaC5nZW4uY3JlYXRlQ2FsbGJhY2soIHRoaXMuZ3JhcGgsIEdpYmJlcmlzaC5tZW1vcnksIGZhbHNlLCB0cnVlIClcbiAgICB0aGlzLmlucHV0TmFtZXMgPSBHaWJiZXJpc2guZ2VuaXNoLmdlbi5wYXJhbWV0ZXJzLnNsaWNlKDApXG4gICAgdGhpcy5jYWxsYmFjay51Z2VuTmFtZSA9IHRoaXMudWdlbk5hbWVcbiAgfSxcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1Z2VuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBHaWJiZXJpc2ggKSB7XG4gIGxldCB1aWQgPSAwXG5cbiAgbGV0IGZhY3RvcnkgPSBmdW5jdGlvbiggdWdlbiwgZ3JhcGgsIG5hbWUsIHZhbHVlcywgY2IgKSB7XG4gICAgdWdlbi5jYWxsYmFjayA9IGNiID09PSB1bmRlZmluZWQgPyBHaWJiZXJpc2guZ2VuaXNoLmdlbi5jcmVhdGVDYWxsYmFjayggZ3JhcGgsIEdpYmJlcmlzaC5tZW1vcnksIGZhbHNlLCB0cnVlICkgOiBjYlxuXG4gICAgT2JqZWN0LmFzc2lnbiggdWdlbiwge1xuICAgICAgdHlwZTogJ3VnZW4nLFxuICAgICAgaWQ6IGZhY3RvcnkuZ2V0VUlEKCksIFxuICAgICAgdWdlbk5hbWU6IG5hbWUgKyAnXycsXG4gICAgICBncmFwaDogZ3JhcGgsXG4gICAgICBpbnB1dE5hbWVzOiBHaWJiZXJpc2guZ2VuaXNoLmdlbi5wYXJhbWV0ZXJzLnNsaWNlKDApLFxuICAgICAgaXNTdGVyZW86IEFycmF5LmlzQXJyYXkoIGdyYXBoICksXG4gICAgICBkaXJ0eTogdHJ1ZVxuICAgIH0pXG4gICAgXG4gICAgdWdlbi51Z2VuTmFtZSArPSB1Z2VuLmlkXG4gICAgdWdlbi5jYWxsYmFjay51Z2VuTmFtZSA9IHVnZW4udWdlbk5hbWUgLy8gWFhYIGhhY2t5XG5cbiAgICBmb3IoIGxldCBwYXJhbSBvZiB1Z2VuLmlucHV0TmFtZXMgKSB7XG4gICAgICBpZiggcGFyYW0gPT09ICdtZW1vcnknICkgY29udGludWVcblxuICAgICAgbGV0IHZhbHVlID0gdmFsdWVzWyBwYXJhbSBdXG5cbiAgICAgIC8vIFRPRE86IGRvIHdlIG5lZWQgdG8gY2hlY2sgZm9yIGEgc2V0dGVyP1xuICAgICAgbGV0IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKCB1Z2VuLCBwYXJhbSApLFxuICAgICAgICAgIHNldHRlclxuXG4gICAgICBpZiggZGVzYyAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICBzZXR0ZXIgPSBkZXNjLnNldFxuICAgICAgfVxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoIHVnZW4sIHBhcmFtLCB7XG4gICAgICAgIGdldCgpIHsgcmV0dXJuIHZhbHVlIH0sXG4gICAgICAgIHNldCggdiApIHtcbiAgICAgICAgICBpZiggdmFsdWUgIT09IHYgKSB7XG4gICAgICAgICAgICBHaWJiZXJpc2guZGlydHkoIHVnZW4gKVxuICAgICAgICAgICAgaWYoIHNldHRlciAhPT0gdW5kZWZpbmVkICkgc2V0dGVyKCB2IClcbiAgICAgICAgICAgIHZhbHVlID0gdlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiggdWdlbi5fX3JlcXVpcmVzUmVjb21waWxhdGlvbiAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgdWdlbi5fX3JlcXVpcmVzUmVjb21waWxhdGlvbi5mb3JFYWNoKCBwcm9wID0+IHtcbiAgICAgICAgbGV0IHZhbHVlID0gdWdlblsgcHJvcCBdXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggdWdlbiwgcHJvcCwge1xuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHZhbHVlIH0sXG4gICAgICAgICAgc2V0KCB2ICkge1xuICAgICAgICAgICAgaWYoIHZhbHVlICE9PSB2ICkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHZcbiAgICAgICAgICAgICAgdGhpcy5fX3JlZG9HcmFwaCgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSkgICAgICBcbiAgICB9XG4gICAgcmV0dXJuIHVnZW5cbiAgfVxuXG4gIGZhY3RvcnkuZ2V0VUlEID0gKCkgPT4gdWlkKytcblxuICByZXR1cm4gZmFjdG9yeVxufVxuIiwibGV0IGdlbmlzaCA9IHJlcXVpcmUoICdnZW5pc2guanMnIClcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggR2liYmVyaXNoICkge1xuXG5sZXQgdXRpbGl0aWVzID0ge1xuICBjcmVhdGVDb250ZXh0KCkge1xuICAgIGxldCBBQyA9IHR5cGVvZiBBdWRpb0NvbnRleHQgPT09ICd1bmRlZmluZWQnID8gd2Via2l0QXVkaW9Db250ZXh0IDogQXVkaW9Db250ZXh0XG4gICAgR2liYmVyaXNoLmN0eCA9IG5ldyBBQygpXG4gICAgZ2VuaXNoLmdlbi5zYW1wbGVyYXRlID0gR2liYmVyaXNoLmN0eC5zYW1wbGVSYXRlXG4gICAgZ2VuaXNoLnV0aWxpdGllcy5jdHggPSBHaWJiZXJpc2guY3R4XG5cbiAgICBsZXQgc3RhcnQgPSAoKSA9PiB7XG4gICAgICBpZiggdHlwZW9mIEFDICE9PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgaWYoIGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgKSB7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0Jywgc3RhcnQgKVxuXG4gICAgICAgICAgaWYoICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCApeyAvLyByZXF1aXJlZCB0byBzdGFydCBhdWRpbyB1bmRlciBpT1MgNlxuICAgICAgICAgICAgbGV0IG15U291cmNlID0gdXRpbGl0aWVzLmN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxuICAgICAgICAgICAgbXlTb3VyY2UuY29ubmVjdCggdXRpbGl0aWVzLmN0eC5kZXN0aW5hdGlvbiApXG4gICAgICAgICAgICBteVNvdXJjZS5ub3RlT24oIDAgKVxuICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiggZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmICdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCApIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIHN0YXJ0IClcbiAgICB9XG5cbiAgICByZXR1cm4gR2liYmVyaXNoLmN0eFxuICB9LFxuXG4gIGNyZWF0ZVNjcmlwdFByb2Nlc3NvcigpIHtcbiAgICBHaWJiZXJpc2gubm9kZSA9IEdpYmJlcmlzaC5jdHguY3JlYXRlU2NyaXB0UHJvY2Vzc29yKCAxMDI0LCAwLCAyICksXG4gICAgR2liYmVyaXNoLmNsZWFyRnVuY3Rpb24gPSBmdW5jdGlvbigpIHsgcmV0dXJuIDAgfSxcbiAgICBHaWJiZXJpc2guY2FsbGJhY2sgPSBHaWJiZXJpc2guY2xlYXJGdW5jdGlvblxuXG4gICAgR2liYmVyaXNoLm5vZGUub25hdWRpb3Byb2Nlc3MgPSBmdW5jdGlvbiggYXVkaW9Qcm9jZXNzaW5nRXZlbnQgKSB7XG4gICAgICBsZXQgZ2liYmVyaXNoID0gR2liYmVyaXNoLFxuICAgICAgICAgIGNhbGxiYWNrICA9IGdpYmJlcmlzaC5jYWxsYmFjayxcbiAgICAgICAgICBvdXRwdXRCdWZmZXIgPSBhdWRpb1Byb2Nlc3NpbmdFdmVudC5vdXRwdXRCdWZmZXIsXG4gICAgICAgICAgc2NoZWR1bGVyID0gR2liYmVyaXNoLnNjaGVkdWxlcixcbiAgICAgICAgICAvL29ianMgPSBnaWJiZXJpc2guY2FsbGJhY2tVZ2Vucy5zbGljZSggMCApLFxuICAgICAgICAgIGxlbmd0aFxuXG4gICAgICBsZXQgbGVmdCA9IG91dHB1dEJ1ZmZlci5nZXRDaGFubmVsRGF0YSggMCApLFxuICAgICAgICAgIHJpZ2h0PSBvdXRwdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoIDEgKVxuXG4gICAgICBsZXQgY2FsbGJhY2tsZW5ndGggPSBHaWJiZXJpc2guYmxvY2tDYWxsYmFja3MubGVuZ3RoXG4gICAgICBcbiAgICAgIGlmKCBjYWxsYmFja2xlbmd0aCAhPT0gMCApIHtcbiAgICAgICAgZm9yKCBsZXQgaT0wOyBpPCBjYWxsYmFja2xlbmd0aDsgaSsrICkge1xuICAgICAgICAgIEdpYmJlcmlzaC5ibG9ja0NhbGxiYWNrc1sgaSBdKClcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNhbid0IGp1c3Qgc2V0IGxlbmd0aCB0byAwIGFzIGNhbGxiYWNrcyBtaWdodCBiZSBhZGRlZCBkdXJpbmcgZm9yIGxvb3AsIHNvIHNwbGljZSBwcmUtZXhpc3RpbmcgZnVuY3Rpb25zXG4gICAgICAgIEdpYmJlcmlzaC5ibG9ja0NhbGxiYWNrcy5zcGxpY2UoIDAsIGNhbGxiYWNrbGVuZ3RoIClcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgc2FtcGxlID0gMCwgbGVuZ3RoID0gbGVmdC5sZW5ndGg7IHNhbXBsZSA8IGxlbmd0aDsgc2FtcGxlKyspIHtcbiAgICAgICAgc2NoZWR1bGVyLnRpY2soKVxuXG4gICAgICAgIGlmKCBnaWJiZXJpc2guZ3JhcGhJc0RpcnR5ICkgeyBcbiAgICAgICAgICBjYWxsYmFjayA9IGdpYmJlcmlzaC5nZW5lcmF0ZUNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gWFhYIGNhbnQgdXNlIGRlc3RydWN0dXJpbmcsIGJhYmVsIG1ha2VzIGl0IHNvbWV0aGluZyBpbmVmZmljaWVudC4uLlxuICAgICAgICBsZXQgb3V0ID0gY2FsbGJhY2suYXBwbHkoIG51bGwsIGdpYmJlcmlzaC5jYWxsYmFja1VnZW5zIClcblxuICAgICAgICBsZWZ0WyBzYW1wbGUgIF0gPSBvdXRbMF1cbiAgICAgICAgcmlnaHRbIHNhbXBsZSBdID0gb3V0WzFdXG4gICAgICB9XG4gICAgfVxuXG4gICAgR2liYmVyaXNoLm5vZGUuY29ubmVjdCggR2liYmVyaXNoLmN0eC5kZXN0aW5hdGlvbiApXG5cbiAgICByZXR1cm4gR2liYmVyaXNoLm5vZGVcbiAgfSwgXG59XG5cbnJldHVybiB1dGlsaXRpZXNcbn1cbiIsIi8qIGJpZy5qcyB2My4xLjMgaHR0cHM6Ly9naXRodWIuY29tL01pa2VNY2wvYmlnLmpzL0xJQ0VOQ0UgKi9cclxuOyhmdW5jdGlvbiAoZ2xvYmFsKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4gIGJpZy5qcyB2My4xLjNcclxuICBBIHNtYWxsLCBmYXN0LCBlYXN5LXRvLXVzZSBsaWJyYXJ5IGZvciBhcmJpdHJhcnktcHJlY2lzaW9uIGRlY2ltYWwgYXJpdGhtZXRpYy5cclxuICBodHRwczovL2dpdGh1Yi5jb20vTWlrZU1jbC9iaWcuanMvXHJcbiAgQ29weXJpZ2h0IChjKSAyMDE0IE1pY2hhZWwgTWNsYXVnaGxpbiA8TThjaDg4bEBnbWFpbC5jb20+XHJcbiAgTUlUIEV4cGF0IExpY2VuY2VcclxuKi9cclxuXHJcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKiBFRElUQUJMRSBERUZBVUxUUyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgLy8gVGhlIGRlZmF1bHQgdmFsdWVzIGJlbG93IG11c3QgYmUgaW50ZWdlcnMgd2l0aGluIHRoZSBzdGF0ZWQgcmFuZ2VzLlxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXMgb2YgdGhlIHJlc3VsdHMgb2Ygb3BlcmF0aW9uc1xyXG4gICAgICogaW52b2x2aW5nIGRpdmlzaW9uOiBkaXYgYW5kIHNxcnQsIGFuZCBwb3cgd2l0aCBuZWdhdGl2ZSBleHBvbmVudHMuXHJcbiAgICAgKi9cclxuICAgIHZhciBEUCA9IDIwLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gTUFYX0RQXHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhlIHJvdW5kaW5nIG1vZGUgdXNlZCB3aGVuIHJvdW5kaW5nIHRvIHRoZSBhYm92ZSBkZWNpbWFsIHBsYWNlcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIDAgVG93YXJkcyB6ZXJvIChpLmUuIHRydW5jYXRlLCBubyByb3VuZGluZykuICAgICAgIChST1VORF9ET1dOKVxyXG4gICAgICAgICAqIDEgVG8gbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCByb3VuZCB1cC4gIChST1VORF9IQUxGX1VQKVxyXG4gICAgICAgICAqIDIgVG8gbmVhcmVzdCBuZWlnaGJvdXIuIElmIGVxdWlkaXN0YW50LCB0byBldmVuLiAgIChST1VORF9IQUxGX0VWRU4pXHJcbiAgICAgICAgICogMyBBd2F5IGZyb20gemVyby4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKFJPVU5EX1VQKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFJNID0gMSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gMCwgMSwgMiBvciAzXHJcblxyXG4gICAgICAgIC8vIFRoZSBtYXhpbXVtIHZhbHVlIG9mIERQIGFuZCBCaWcuRFAuXHJcbiAgICAgICAgTUFYX0RQID0gMUU2LCAgICAgICAgICAgICAgICAgICAgICAvLyAwIHRvIDEwMDAwMDBcclxuXHJcbiAgICAgICAgLy8gVGhlIG1heGltdW0gbWFnbml0dWRlIG9mIHRoZSBleHBvbmVudCBhcmd1bWVudCB0byB0aGUgcG93IG1ldGhvZC5cclxuICAgICAgICBNQVhfUE9XRVIgPSAxRTYsICAgICAgICAgICAgICAgICAgIC8vIDEgdG8gMTAwMDAwMFxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIFRoZSBleHBvbmVudCB2YWx1ZSBhdCBhbmQgYmVuZWF0aCB3aGljaCB0b1N0cmluZyByZXR1cm5zIGV4cG9uZW50aWFsXHJcbiAgICAgICAgICogbm90YXRpb24uXHJcbiAgICAgICAgICogSmF2YVNjcmlwdCdzIE51bWJlciB0eXBlOiAtN1xyXG4gICAgICAgICAqIC0xMDAwMDAwIGlzIHRoZSBtaW5pbXVtIHJlY29tbWVuZGVkIGV4cG9uZW50IHZhbHVlIG9mIGEgQmlnLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEVfTkVHID0gLTcsICAgICAgICAgICAgICAgICAgIC8vIDAgdG8gLTEwMDAwMDBcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBUaGUgZXhwb25lbnQgdmFsdWUgYXQgYW5kIGFib3ZlIHdoaWNoIHRvU3RyaW5nIHJldHVybnMgZXhwb25lbnRpYWxcclxuICAgICAgICAgKiBub3RhdGlvbi5cclxuICAgICAgICAgKiBKYXZhU2NyaXB0J3MgTnVtYmVyIHR5cGU6IDIxXHJcbiAgICAgICAgICogMTAwMDAwMCBpcyB0aGUgbWF4aW11bSByZWNvbW1lbmRlZCBleHBvbmVudCB2YWx1ZSBvZiBhIEJpZy5cclxuICAgICAgICAgKiAoVGhpcyBsaW1pdCBpcyBub3QgZW5mb3JjZWQgb3IgY2hlY2tlZC4pXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgRV9QT1MgPSAyMSwgICAgICAgICAgICAgICAgICAgLy8gMCB0byAxMDAwMDAwXHJcblxyXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAvLyBUaGUgc2hhcmVkIHByb3RvdHlwZSBvYmplY3QuXHJcbiAgICAgICAgUCA9IHt9LFxyXG4gICAgICAgIGlzVmFsaWQgPSAvXi0/KFxcZCsoXFwuXFxkKik/fFxcLlxcZCspKGVbKy1dP1xcZCspPyQvaSxcclxuICAgICAgICBCaWc7XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBDcmVhdGUgYW5kIHJldHVybiBhIEJpZyBjb25zdHJ1Y3Rvci5cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJpZ0ZhY3RvcnkoKSB7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogVGhlIEJpZyBjb25zdHJ1Y3RvciBhbmQgZXhwb3J0ZWQgZnVuY3Rpb24uXHJcbiAgICAgICAgICogQ3JlYXRlIGFuZCByZXR1cm4gYSBuZXcgaW5zdGFuY2Ugb2YgYSBCaWcgbnVtYmVyIG9iamVjdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIG4ge251bWJlcnxzdHJpbmd8QmlnfSBBIG51bWVyaWMgdmFsdWUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gQmlnKG4pIHtcclxuICAgICAgICAgICAgdmFyIHggPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgLy8gRW5hYmxlIGNvbnN0cnVjdG9yIHVzYWdlIHdpdGhvdXQgbmV3LlxyXG4gICAgICAgICAgICBpZiAoISh4IGluc3RhbmNlb2YgQmlnKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG4gPT09IHZvaWQgMCA/IGJpZ0ZhY3RvcnkoKSA6IG5ldyBCaWcobik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIER1cGxpY2F0ZS5cclxuICAgICAgICAgICAgaWYgKG4gaW5zdGFuY2VvZiBCaWcpIHtcclxuICAgICAgICAgICAgICAgIHgucyA9IG4ucztcclxuICAgICAgICAgICAgICAgIHguZSA9IG4uZTtcclxuICAgICAgICAgICAgICAgIHguYyA9IG4uYy5zbGljZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcGFyc2UoeCwgbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIFJldGFpbiBhIHJlZmVyZW5jZSB0byB0aGlzIEJpZyBjb25zdHJ1Y3RvciwgYW5kIHNoYWRvd1xyXG4gICAgICAgICAgICAgKiBCaWcucHJvdG90eXBlLmNvbnN0cnVjdG9yIHdoaWNoIHBvaW50cyB0byBPYmplY3QuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB4LmNvbnN0cnVjdG9yID0gQmlnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQmlnLnByb3RvdHlwZSA9IFA7XHJcbiAgICAgICAgQmlnLkRQID0gRFA7XHJcbiAgICAgICAgQmlnLlJNID0gUk07XHJcbiAgICAgICAgQmlnLkVfTkVHID0gRV9ORUc7XHJcbiAgICAgICAgQmlnLkVfUE9TID0gRV9QT1M7XHJcblxyXG4gICAgICAgIHJldHVybiBCaWc7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIFByaXZhdGUgZnVuY3Rpb25zXHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiBCaWcgeCBpbiBub3JtYWwgb3IgZXhwb25lbnRpYWxcclxuICAgICAqIG5vdGF0aW9uIHRvIGRwIGZpeGVkIGRlY2ltYWwgcGxhY2VzIG9yIHNpZ25pZmljYW50IGRpZ2l0cy5cclxuICAgICAqXHJcbiAgICAgKiB4IHtCaWd9IFRoZSBCaWcgdG8gZm9ybWF0LlxyXG4gICAgICogZHAge251bWJlcn0gSW50ZWdlciwgMCB0byBNQVhfRFAgaW5jbHVzaXZlLlxyXG4gICAgICogdG9FIHtudW1iZXJ9IDEgKHRvRXhwb25lbnRpYWwpLCAyICh0b1ByZWNpc2lvbikgb3IgdW5kZWZpbmVkICh0b0ZpeGVkKS5cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZm9ybWF0KHgsIGRwLCB0b0UpIHtcclxuICAgICAgICB2YXIgQmlnID0geC5jb25zdHJ1Y3RvcixcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZSBpbmRleCAobm9ybWFsIG5vdGF0aW9uKSBvZiB0aGUgZGlnaXQgdGhhdCBtYXkgYmUgcm91bmRlZCB1cC5cclxuICAgICAgICAgICAgaSA9IGRwIC0gKHggPSBuZXcgQmlnKHgpKS5lLFxyXG4gICAgICAgICAgICBjID0geC5jO1xyXG5cclxuICAgICAgICAvLyBSb3VuZD9cclxuICAgICAgICBpZiAoYy5sZW5ndGggPiArK2RwKSB7XHJcbiAgICAgICAgICAgIHJuZCh4LCBpLCBCaWcuUk0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFjWzBdKSB7XHJcbiAgICAgICAgICAgICsraTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRvRSkge1xyXG4gICAgICAgICAgICBpID0gZHA7XHJcblxyXG4gICAgICAgIC8vIHRvRml4ZWRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjID0geC5jO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVjYWxjdWxhdGUgaSBhcyB4LmUgbWF5IGhhdmUgY2hhbmdlZCBpZiB2YWx1ZSByb3VuZGVkIHVwLlxyXG4gICAgICAgICAgICBpID0geC5lICsgaSArIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBBcHBlbmQgemVyb3M/XHJcbiAgICAgICAgZm9yICg7IGMubGVuZ3RoIDwgaTsgYy5wdXNoKDApKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGkgPSB4LmU7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogdG9QcmVjaXNpb24gcmV0dXJucyBleHBvbmVudGlhbCBub3RhdGlvbiBpZiB0aGUgbnVtYmVyIG9mXHJcbiAgICAgICAgICogc2lnbmlmaWNhbnQgZGlnaXRzIHNwZWNpZmllZCBpcyBsZXNzIHRoYW4gdGhlIG51bWJlciBvZiBkaWdpdHNcclxuICAgICAgICAgKiBuZWNlc3NhcnkgdG8gcmVwcmVzZW50IHRoZSBpbnRlZ2VyIHBhcnQgb2YgdGhlIHZhbHVlIGluIG5vcm1hbFxyXG4gICAgICAgICAqIG5vdGF0aW9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiB0b0UgPT09IDEgfHwgdG9FICYmIChkcCA8PSBpIHx8IGkgPD0gQmlnLkVfTkVHKSA/XHJcblxyXG4gICAgICAgICAgLy8gRXhwb25lbnRpYWwgbm90YXRpb24uXHJcbiAgICAgICAgICAoeC5zIDwgMCAmJiBjWzBdID8gJy0nIDogJycpICtcclxuICAgICAgICAgICAgKGMubGVuZ3RoID4gMSA/IGNbMF0gKyAnLicgKyBjLmpvaW4oJycpLnNsaWNlKDEpIDogY1swXSkgK1xyXG4gICAgICAgICAgICAgIChpIDwgMCA/ICdlJyA6ICdlKycpICsgaVxyXG5cclxuICAgICAgICAgIC8vIE5vcm1hbCBub3RhdGlvbi5cclxuICAgICAgICAgIDogeC50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUGFyc2UgdGhlIG51bWJlciBvciBzdHJpbmcgdmFsdWUgcGFzc2VkIHRvIGEgQmlnIGNvbnN0cnVjdG9yLlxyXG4gICAgICpcclxuICAgICAqIHgge0JpZ30gQSBCaWcgbnVtYmVyIGluc3RhbmNlLlxyXG4gICAgICogbiB7bnVtYmVyfHN0cmluZ30gQSBudW1lcmljIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZSh4LCBuKSB7XHJcbiAgICAgICAgdmFyIGUsIGksIG5MO1xyXG5cclxuICAgICAgICAvLyBNaW51cyB6ZXJvP1xyXG4gICAgICAgIGlmIChuID09PSAwICYmIDEgLyBuIDwgMCkge1xyXG4gICAgICAgICAgICBuID0gJy0wJztcclxuXHJcbiAgICAgICAgLy8gRW5zdXJlIG4gaXMgc3RyaW5nIGFuZCBjaGVjayB2YWxpZGl0eS5cclxuICAgICAgICB9IGVsc2UgaWYgKCFpc1ZhbGlkLnRlc3QobiArPSAnJykpIHtcclxuICAgICAgICAgICAgdGhyb3dFcnIoTmFOKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIERldGVybWluZSBzaWduLlxyXG4gICAgICAgIHgucyA9IG4uY2hhckF0KDApID09ICctJyA/IChuID0gbi5zbGljZSgxKSwgLTEpIDogMTtcclxuXHJcbiAgICAgICAgLy8gRGVjaW1hbCBwb2ludD9cclxuICAgICAgICBpZiAoKGUgPSBuLmluZGV4T2YoJy4nKSkgPiAtMSkge1xyXG4gICAgICAgICAgICBuID0gbi5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRXhwb25lbnRpYWwgZm9ybT9cclxuICAgICAgICBpZiAoKGkgPSBuLnNlYXJjaCgvZS9pKSkgPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgZXhwb25lbnQuXHJcbiAgICAgICAgICAgIGlmIChlIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgZSA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZSArPSArbi5zbGljZShpICsgMSk7XHJcbiAgICAgICAgICAgIG4gPSBuLnN1YnN0cmluZygwLCBpKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChlIDwgMCkge1xyXG5cclxuICAgICAgICAgICAgLy8gSW50ZWdlci5cclxuICAgICAgICAgICAgZSA9IG4ubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRGV0ZXJtaW5lIGxlYWRpbmcgemVyb3MuXHJcbiAgICAgICAgZm9yIChpID0gMDsgbi5jaGFyQXQoaSkgPT0gJzAnOyBpKyspIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpID09IChuTCA9IG4ubGVuZ3RoKSkge1xyXG5cclxuICAgICAgICAgICAgLy8gWmVyby5cclxuICAgICAgICAgICAgeC5jID0gWyB4LmUgPSAwIF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIC8vIERldGVybWluZSB0cmFpbGluZyB6ZXJvcy5cclxuICAgICAgICAgICAgZm9yICg7IG4uY2hhckF0KC0tbkwpID09ICcwJzspIHtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgeC5lID0gZSAtIGkgLSAxO1xyXG4gICAgICAgICAgICB4LmMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbnZlcnQgc3RyaW5nIHRvIGFycmF5IG9mIGRpZ2l0cyB3aXRob3V0IGxlYWRpbmcvdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgICAgICAgIGZvciAoZSA9IDA7IGkgPD0gbkw7IHguY1tlKytdID0gK24uY2hhckF0KGkrKykpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHg7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSb3VuZCBCaWcgeCB0byBhIG1heGltdW0gb2YgZHAgZGVjaW1hbCBwbGFjZXMgdXNpbmcgcm91bmRpbmcgbW9kZSBybS5cclxuICAgICAqIENhbGxlZCBieSBkaXYsIHNxcnQgYW5kIHJvdW5kLlxyXG4gICAgICpcclxuICAgICAqIHgge0JpZ30gVGhlIEJpZyB0byByb3VuZC5cclxuICAgICAqIGRwIHtudW1iZXJ9IEludGVnZXIsIDAgdG8gTUFYX0RQIGluY2x1c2l2ZS5cclxuICAgICAqIHJtIHtudW1iZXJ9IDAsIDEsIDIgb3IgMyAoRE9XTiwgSEFMRl9VUCwgSEFMRl9FVkVOLCBVUClcclxuICAgICAqIFttb3JlXSB7Ym9vbGVhbn0gV2hldGhlciB0aGUgcmVzdWx0IG9mIGRpdmlzaW9uIHdhcyB0cnVuY2F0ZWQuXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJuZCh4LCBkcCwgcm0sIG1vcmUpIHtcclxuICAgICAgICB2YXIgdSxcclxuICAgICAgICAgICAgeGMgPSB4LmMsXHJcbiAgICAgICAgICAgIGkgPSB4LmUgKyBkcCArIDE7XHJcblxyXG4gICAgICAgIGlmIChybSA9PT0gMSkge1xyXG5cclxuICAgICAgICAgICAgLy8geGNbaV0gaXMgdGhlIGRpZ2l0IGFmdGVyIHRoZSBkaWdpdCB0aGF0IG1heSBiZSByb3VuZGVkIHVwLlxyXG4gICAgICAgICAgICBtb3JlID0geGNbaV0gPj0gNTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJtID09PSAyKSB7XHJcbiAgICAgICAgICAgIG1vcmUgPSB4Y1tpXSA+IDUgfHwgeGNbaV0gPT0gNSAmJlxyXG4gICAgICAgICAgICAgIChtb3JlIHx8IGkgPCAwIHx8IHhjW2kgKyAxXSAhPT0gdSB8fCB4Y1tpIC0gMV0gJiAxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJtID09PSAzKSB7XHJcbiAgICAgICAgICAgIG1vcmUgPSBtb3JlIHx8IHhjW2ldICE9PSB1IHx8IGkgPCAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG1vcmUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChybSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3dFcnIoJyFCaWcuUk0hJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpIDwgMSB8fCAheGNbMF0pIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChtb3JlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gMSwgMC4xLCAwLjAxLCAwLjAwMSwgMC4wMDAxIGV0Yy5cclxuICAgICAgICAgICAgICAgIHguZSA9IC1kcDtcclxuICAgICAgICAgICAgICAgIHguYyA9IFsxXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBaZXJvLlxyXG4gICAgICAgICAgICAgICAgeC5jID0gW3guZSA9IDBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbnkgZGlnaXRzIGFmdGVyIHRoZSByZXF1aXJlZCBkZWNpbWFsIHBsYWNlcy5cclxuICAgICAgICAgICAgeGMubGVuZ3RoID0gaS0tO1xyXG5cclxuICAgICAgICAgICAgLy8gUm91bmQgdXA/XHJcbiAgICAgICAgICAgIGlmIChtb3JlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUm91bmRpbmcgdXAgbWF5IG1lYW4gdGhlIHByZXZpb3VzIGRpZ2l0IGhhcyB0byBiZSByb3VuZGVkIHVwLlxyXG4gICAgICAgICAgICAgICAgZm9yICg7ICsreGNbaV0gPiA5Oykge1xyXG4gICAgICAgICAgICAgICAgICAgIHhjW2ldID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpLS0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyt4LmU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhjLnVuc2hpZnQoMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgemVyb3MuXHJcbiAgICAgICAgICAgIGZvciAoaSA9IHhjLmxlbmd0aDsgIXhjWy0taV07IHhjLnBvcCgpKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogVGhyb3cgYSBCaWdFcnJvci5cclxuICAgICAqXHJcbiAgICAgKiBtZXNzYWdlIHtzdHJpbmd9IFRoZSBlcnJvciBtZXNzYWdlLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB0aHJvd0VycihtZXNzYWdlKSB7XHJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcclxuICAgICAgICBlcnIubmFtZSA9ICdCaWdFcnJvcic7XHJcblxyXG4gICAgICAgIHRocm93IGVycjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gUHJvdG90eXBlL2luc3RhbmNlIG1ldGhvZHNcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIGFic29sdXRlIHZhbHVlIG9mIHRoaXMgQmlnLlxyXG4gICAgICovXHJcbiAgICBQLmFicyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgeCA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpO1xyXG4gICAgICAgIHgucyA9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVyblxyXG4gICAgICogMSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgZ3JlYXRlciB0aGFuIHRoZSB2YWx1ZSBvZiBCaWcgeSxcclxuICAgICAqIC0xIGlmIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpcyBsZXNzIHRoYW4gdGhlIHZhbHVlIG9mIEJpZyB5LCBvclxyXG4gICAgICogMCBpZiB0aGV5IGhhdmUgdGhlIHNhbWUgdmFsdWUuXHJcbiAgICAqL1xyXG4gICAgUC5jbXAgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgICAgIHZhciB4TmVnLFxyXG4gICAgICAgICAgICB4ID0gdGhpcyxcclxuICAgICAgICAgICAgeGMgPSB4LmMsXHJcbiAgICAgICAgICAgIHljID0gKHkgPSBuZXcgeC5jb25zdHJ1Y3Rvcih5KSkuYyxcclxuICAgICAgICAgICAgaSA9IHgucyxcclxuICAgICAgICAgICAgaiA9IHkucyxcclxuICAgICAgICAgICAgayA9IHguZSxcclxuICAgICAgICAgICAgbCA9IHkuZTtcclxuXHJcbiAgICAgICAgLy8gRWl0aGVyIHplcm8/XHJcbiAgICAgICAgaWYgKCF4Y1swXSB8fCAheWNbMF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuICF4Y1swXSA/ICF5Y1swXSA/IDAgOiAtaiA6IGk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTaWducyBkaWZmZXI/XHJcbiAgICAgICAgaWYgKGkgIT0gaikge1xyXG4gICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICB9XHJcbiAgICAgICAgeE5lZyA9IGkgPCAwO1xyXG5cclxuICAgICAgICAvLyBDb21wYXJlIGV4cG9uZW50cy5cclxuICAgICAgICBpZiAoayAhPSBsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBrID4gbCBeIHhOZWcgPyAxIDogLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpID0gLTE7XHJcbiAgICAgICAgaiA9IChrID0geGMubGVuZ3RoKSA8IChsID0geWMubGVuZ3RoKSA/IGsgOiBsO1xyXG5cclxuICAgICAgICAvLyBDb21wYXJlIGRpZ2l0IGJ5IGRpZ2l0LlxyXG4gICAgICAgIGZvciAoOyArK2kgPCBqOykge1xyXG5cclxuICAgICAgICAgICAgaWYgKHhjW2ldICE9IHljW2ldKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geGNbaV0gPiB5Y1tpXSBeIHhOZWcgPyAxIDogLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENvbXBhcmUgbGVuZ3Rocy5cclxuICAgICAgICByZXR1cm4gayA9PSBsID8gMCA6IGsgPiBsIF4geE5lZyA/IDEgOiAtMTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBkaXZpZGVkIGJ5IHRoZVxyXG4gICAgICogdmFsdWUgb2YgQmlnIHksIHJvdW5kZWQsIGlmIG5lY2Vzc2FyeSwgdG8gYSBtYXhpbXVtIG9mIEJpZy5EUCBkZWNpbWFsXHJcbiAgICAgKiBwbGFjZXMgdXNpbmcgcm91bmRpbmcgbW9kZSBCaWcuUk0uXHJcbiAgICAgKi9cclxuICAgIFAuZGl2ID0gZnVuY3Rpb24gKHkpIHtcclxuICAgICAgICB2YXIgeCA9IHRoaXMsXHJcbiAgICAgICAgICAgIEJpZyA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgICAgICAgIC8vIGRpdmlkZW5kXHJcbiAgICAgICAgICAgIGR2ZCA9IHguYyxcclxuICAgICAgICAgICAgLy9kaXZpc29yXHJcbiAgICAgICAgICAgIGR2cyA9ICh5ID0gbmV3IEJpZyh5KSkuYyxcclxuICAgICAgICAgICAgcyA9IHgucyA9PSB5LnMgPyAxIDogLTEsXHJcbiAgICAgICAgICAgIGRwID0gQmlnLkRQO1xyXG5cclxuICAgICAgICBpZiAoZHAgIT09IH5+ZHAgfHwgZHAgPCAwIHx8IGRwID4gTUFYX0RQKSB7XHJcbiAgICAgICAgICAgIHRocm93RXJyKCchQmlnLkRQIScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRWl0aGVyIDA/XHJcbiAgICAgICAgaWYgKCFkdmRbMF0gfHwgIWR2c1swXSkge1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgYm90aCBhcmUgMCwgdGhyb3cgTmFOXHJcbiAgICAgICAgICAgIGlmIChkdmRbMF0gPT0gZHZzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvd0VycihOYU4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBkdnMgaXMgMCwgdGhyb3cgKy1JbmZpbml0eS5cclxuICAgICAgICAgICAgaWYgKCFkdnNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRocm93RXJyKHMgLyAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gZHZkIGlzIDAsIHJldHVybiArLTAuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQmlnKHMgKiAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBkdnNMLCBkdnNULCBuZXh0LCBjbXAsIHJlbUksIHUsXHJcbiAgICAgICAgICAgIGR2c1ogPSBkdnMuc2xpY2UoKSxcclxuICAgICAgICAgICAgZHZkSSA9IGR2c0wgPSBkdnMubGVuZ3RoLFxyXG4gICAgICAgICAgICBkdmRMID0gZHZkLmxlbmd0aCxcclxuICAgICAgICAgICAgLy8gcmVtYWluZGVyXHJcbiAgICAgICAgICAgIHJlbSA9IGR2ZC5zbGljZSgwLCBkdnNMKSxcclxuICAgICAgICAgICAgcmVtTCA9IHJlbS5sZW5ndGgsXHJcbiAgICAgICAgICAgIC8vIHF1b3RpZW50XHJcbiAgICAgICAgICAgIHEgPSB5LFxyXG4gICAgICAgICAgICBxYyA9IHEuYyA9IFtdLFxyXG4gICAgICAgICAgICBxaSA9IDAsXHJcbiAgICAgICAgICAgIGRpZ2l0cyA9IGRwICsgKHEuZSA9IHguZSAtIHkuZSkgKyAxO1xyXG5cclxuICAgICAgICBxLnMgPSBzO1xyXG4gICAgICAgIHMgPSBkaWdpdHMgPCAwID8gMCA6IGRpZ2l0cztcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHZlcnNpb24gb2YgZGl2aXNvciB3aXRoIGxlYWRpbmcgemVyby5cclxuICAgICAgICBkdnNaLnVuc2hpZnQoMCk7XHJcblxyXG4gICAgICAgIC8vIEFkZCB6ZXJvcyB0byBtYWtlIHJlbWFpbmRlciBhcyBsb25nIGFzIGRpdmlzb3IuXHJcbiAgICAgICAgZm9yICg7IHJlbUwrKyA8IGR2c0w7IHJlbS5wdXNoKDApKSB7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkbyB7XHJcblxyXG4gICAgICAgICAgICAvLyAnbmV4dCcgaXMgaG93IG1hbnkgdGltZXMgdGhlIGRpdmlzb3IgZ29lcyBpbnRvIGN1cnJlbnQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICBmb3IgKG5leHQgPSAwOyBuZXh0IDwgMTA7IG5leHQrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENvbXBhcmUgZGl2aXNvciBhbmQgcmVtYWluZGVyLlxyXG4gICAgICAgICAgICAgICAgaWYgKGR2c0wgIT0gKHJlbUwgPSByZW0ubGVuZ3RoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNtcCA9IGR2c0wgPiByZW1MID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChyZW1JID0gLTEsIGNtcCA9IDA7ICsrcmVtSSA8IGR2c0w7KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZHZzW3JlbUldICE9IHJlbVtyZW1JXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY21wID0gZHZzW3JlbUldID4gcmVtW3JlbUldID8gMSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgZGl2aXNvciA8IHJlbWFpbmRlciwgc3VidHJhY3QgZGl2aXNvciBmcm9tIHJlbWFpbmRlci5cclxuICAgICAgICAgICAgICAgIGlmIChjbXAgPCAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbWFpbmRlciBjYW4ndCBiZSBtb3JlIHRoYW4gMSBkaWdpdCBsb25nZXIgdGhhbiBkaXZpc29yLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVxdWFsaXNlIGxlbmd0aHMgdXNpbmcgZGl2aXNvciB3aXRoIGV4dHJhIGxlYWRpbmcgemVybz9cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGR2c1QgPSByZW1MID09IGR2c0wgPyBkdnMgOiBkdnNaOyByZW1MOykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbVstLXJlbUxdIDwgZHZzVFtyZW1MXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtSSA9IHJlbUw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICg7IHJlbUkgJiYgIXJlbVstLXJlbUldOyByZW1bcmVtSV0gPSA5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLXJlbVtyZW1JXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbVtyZW1MXSArPSAxMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1bcmVtTF0gLT0gZHZzVFtyZW1MXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7ICFyZW1bMF07IHJlbS5zaGlmdCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHRoZSAnbmV4dCcgZGlnaXQgdG8gdGhlIHJlc3VsdCBhcnJheS5cclxuICAgICAgICAgICAgcWNbcWkrK10gPSBjbXAgPyBuZXh0IDogKytuZXh0O1xyXG5cclxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSByZW1haW5kZXIuXHJcbiAgICAgICAgICAgIGlmIChyZW1bMF0gJiYgY21wKSB7XHJcbiAgICAgICAgICAgICAgICByZW1bcmVtTF0gPSBkdmRbZHZkSV0gfHwgMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbSA9IFsgZHZkW2R2ZEldIF07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSB3aGlsZSAoKGR2ZEkrKyA8IGR2ZEwgfHwgcmVtWzBdICE9PSB1KSAmJiBzLS0pO1xyXG5cclxuICAgICAgICAvLyBMZWFkaW5nIHplcm8/IERvIG5vdCByZW1vdmUgaWYgcmVzdWx0IGlzIHNpbXBseSB6ZXJvIChxaSA9PSAxKS5cclxuICAgICAgICBpZiAoIXFjWzBdICYmIHFpICE9IDEpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoZXJlIGNhbid0IGJlIG1vcmUgdGhhbiBvbmUgemVyby5cclxuICAgICAgICAgICAgcWMuc2hpZnQoKTtcclxuICAgICAgICAgICAgcS5lLS07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSb3VuZD9cclxuICAgICAgICBpZiAocWkgPiBkaWdpdHMpIHtcclxuICAgICAgICAgICAgcm5kKHEsIGRwLCBCaWcuUk0sIHJlbVswXSAhPT0gdSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgZXF1YWwgdG8gdGhlIHZhbHVlIG9mIEJpZyB5LFxyXG4gICAgICogb3RoZXJ3aXNlIHJldHVybnMgZmFsc2UuXHJcbiAgICAgKi9cclxuICAgIFAuZXEgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgICAgIHJldHVybiAhdGhpcy5jbXAoeSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdmFsdWUgb2YgQmlnIHksXHJcbiAgICAgKiBvdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgUC5ndCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY21wKHkpID4gMDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZVxyXG4gICAgICogdmFsdWUgb2YgQmlnIHksIG90aGVyd2lzZSByZXR1cm5zIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBQLmd0ZSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY21wKHkpID4gLTE7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIHRydWUgaWYgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGlzIGxlc3MgdGhhbiB0aGUgdmFsdWUgb2YgQmlnIHksXHJcbiAgICAgKiBvdGhlcndpc2UgcmV0dXJucyBmYWxzZS5cclxuICAgICAqL1xyXG4gICAgUC5sdCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY21wKHkpIDwgMDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIHRoZSB2YWx1ZVxyXG4gICAgICogb2YgQmlnIHksIG90aGVyd2lzZSByZXR1cm5zIGZhbHNlLlxyXG4gICAgICovXHJcbiAgICBQLmx0ZSA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICAgICAgIHJldHVybiB0aGlzLmNtcCh5KSA8IDE7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgbWludXMgdGhlIHZhbHVlXHJcbiAgICAgKiBvZiBCaWcgeS5cclxuICAgICAqL1xyXG4gICAgUC5zdWIgPSBQLm1pbnVzID0gZnVuY3Rpb24gKHkpIHtcclxuICAgICAgICB2YXIgaSwgaiwgdCwgeExUeSxcclxuICAgICAgICAgICAgeCA9IHRoaXMsXHJcbiAgICAgICAgICAgIEJpZyA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgICAgICAgIGEgPSB4LnMsXHJcbiAgICAgICAgICAgIGIgPSAoeSA9IG5ldyBCaWcoeSkpLnM7XHJcblxyXG4gICAgICAgIC8vIFNpZ25zIGRpZmZlcj9cclxuICAgICAgICBpZiAoYSAhPSBiKSB7XHJcbiAgICAgICAgICAgIHkucyA9IC1iO1xyXG4gICAgICAgICAgICByZXR1cm4geC5wbHVzKHkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHhjID0geC5jLnNsaWNlKCksXHJcbiAgICAgICAgICAgIHhlID0geC5lLFxyXG4gICAgICAgICAgICB5YyA9IHkuYyxcclxuICAgICAgICAgICAgeWUgPSB5LmU7XHJcblxyXG4gICAgICAgIC8vIEVpdGhlciB6ZXJvP1xyXG4gICAgICAgIGlmICgheGNbMF0gfHwgIXljWzBdKSB7XHJcblxyXG4gICAgICAgICAgICAvLyB5IGlzIG5vbi16ZXJvPyB4IGlzIG5vbi16ZXJvPyBPciBib3RoIGFyZSB6ZXJvLlxyXG4gICAgICAgICAgICByZXR1cm4geWNbMF0gPyAoeS5zID0gLWIsIHkpIDogbmV3IEJpZyh4Y1swXSA/IHggOiAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIERldGVybWluZSB3aGljaCBpcyB0aGUgYmlnZ2VyIG51bWJlci5cclxuICAgICAgICAvLyBQcmVwZW5kIHplcm9zIHRvIGVxdWFsaXNlIGV4cG9uZW50cy5cclxuICAgICAgICBpZiAoYSA9IHhlIC0geWUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICh4TFR5ID0gYSA8IDApIHtcclxuICAgICAgICAgICAgICAgIGEgPSAtYTtcclxuICAgICAgICAgICAgICAgIHQgPSB4YztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHllID0geGU7XHJcbiAgICAgICAgICAgICAgICB0ID0geWM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHQucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICBmb3IgKGIgPSBhOyBiLS07IHQucHVzaCgwKSkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHQucmV2ZXJzZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAvLyBFeHBvbmVudHMgZXF1YWwuIENoZWNrIGRpZ2l0IGJ5IGRpZ2l0LlxyXG4gICAgICAgICAgICBqID0gKCh4TFR5ID0geGMubGVuZ3RoIDwgeWMubGVuZ3RoKSA/IHhjIDogeWMpLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGZvciAoYSA9IGIgPSAwOyBiIDwgajsgYisrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHhjW2JdICE9IHljW2JdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgeExUeSA9IHhjW2JdIDwgeWNbYl07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHggPCB5PyBQb2ludCB4YyB0byB0aGUgYXJyYXkgb2YgdGhlIGJpZ2dlciBudW1iZXIuXHJcbiAgICAgICAgaWYgKHhMVHkpIHtcclxuICAgICAgICAgICAgdCA9IHhjO1xyXG4gICAgICAgICAgICB4YyA9IHljO1xyXG4gICAgICAgICAgICB5YyA9IHQ7XHJcbiAgICAgICAgICAgIHkucyA9IC15LnM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIEFwcGVuZCB6ZXJvcyB0byB4YyBpZiBzaG9ydGVyLiBObyBuZWVkIHRvIGFkZCB6ZXJvcyB0byB5YyBpZiBzaG9ydGVyXHJcbiAgICAgICAgICogYXMgc3VidHJhY3Rpb24gb25seSBuZWVkcyB0byBzdGFydCBhdCB5Yy5sZW5ndGguXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKCggYiA9IChqID0geWMubGVuZ3RoKSAtIChpID0geGMubGVuZ3RoKSApID4gMCkge1xyXG5cclxuICAgICAgICAgICAgZm9yICg7IGItLTsgeGNbaSsrXSA9IDApIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU3VidHJhY3QgeWMgZnJvbSB4Yy5cclxuICAgICAgICBmb3IgKGIgPSBpOyBqID4gYTspe1xyXG5cclxuICAgICAgICAgICAgaWYgKHhjWy0tal0gPCB5Y1tqXSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IGo7IGkgJiYgIXhjWy0taV07IHhjW2ldID0gOSkge1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLS14Y1tpXTtcclxuICAgICAgICAgICAgICAgIHhjW2pdICs9IDEwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHhjW2pdIC09IHljW2pdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICAgIGZvciAoOyB4Y1stLWJdID09PSAwOyB4Yy5wb3AoKSkge1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGxlYWRpbmcgemVyb3MgYW5kIGFkanVzdCBleHBvbmVudCBhY2NvcmRpbmdseS5cclxuICAgICAgICBmb3IgKDsgeGNbMF0gPT09IDA7KSB7XHJcbiAgICAgICAgICAgIHhjLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIC0teWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXhjWzBdKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBuIC0gbiA9ICswXHJcbiAgICAgICAgICAgIHkucyA9IDE7XHJcblxyXG4gICAgICAgICAgICAvLyBSZXN1bHQgbXVzdCBiZSB6ZXJvLlxyXG4gICAgICAgICAgICB4YyA9IFt5ZSA9IDBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgeS5jID0geGM7XHJcbiAgICAgICAgeS5lID0geWU7XHJcblxyXG4gICAgICAgIHJldHVybiB5O1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIG1vZHVsbyB0aGVcclxuICAgICAqIHZhbHVlIG9mIEJpZyB5LlxyXG4gICAgICovXHJcbiAgICBQLm1vZCA9IGZ1bmN0aW9uICh5KSB7XHJcbiAgICAgICAgdmFyIHlHVHgsXHJcbiAgICAgICAgICAgIHggPSB0aGlzLFxyXG4gICAgICAgICAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICAgICAgICBhID0geC5zLFxyXG4gICAgICAgICAgICBiID0gKHkgPSBuZXcgQmlnKHkpKS5zO1xyXG5cclxuICAgICAgICBpZiAoIXkuY1swXSkge1xyXG4gICAgICAgICAgICB0aHJvd0VycihOYU4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgeC5zID0geS5zID0gMTtcclxuICAgICAgICB5R1R4ID0geS5jbXAoeCkgPT0gMTtcclxuICAgICAgICB4LnMgPSBhO1xyXG4gICAgICAgIHkucyA9IGI7XHJcblxyXG4gICAgICAgIGlmICh5R1R4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQmlnKHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYSA9IEJpZy5EUDtcclxuICAgICAgICBiID0gQmlnLlJNO1xyXG4gICAgICAgIEJpZy5EUCA9IEJpZy5STSA9IDA7XHJcbiAgICAgICAgeCA9IHguZGl2KHkpO1xyXG4gICAgICAgIEJpZy5EUCA9IGE7XHJcbiAgICAgICAgQmlnLlJNID0gYjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWludXMoIHgudGltZXMoeSkgKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBwbHVzIHRoZSB2YWx1ZVxyXG4gICAgICogb2YgQmlnIHkuXHJcbiAgICAgKi9cclxuICAgIFAuYWRkID0gUC5wbHVzID0gZnVuY3Rpb24gKHkpIHtcclxuICAgICAgICB2YXIgdCxcclxuICAgICAgICAgICAgeCA9IHRoaXMsXHJcbiAgICAgICAgICAgIEJpZyA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgICAgICAgIGEgPSB4LnMsXHJcbiAgICAgICAgICAgIGIgPSAoeSA9IG5ldyBCaWcoeSkpLnM7XHJcblxyXG4gICAgICAgIC8vIFNpZ25zIGRpZmZlcj9cclxuICAgICAgICBpZiAoYSAhPSBiKSB7XHJcbiAgICAgICAgICAgIHkucyA9IC1iO1xyXG4gICAgICAgICAgICByZXR1cm4geC5taW51cyh5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB4ZSA9IHguZSxcclxuICAgICAgICAgICAgeGMgPSB4LmMsXHJcbiAgICAgICAgICAgIHllID0geS5lLFxyXG4gICAgICAgICAgICB5YyA9IHkuYztcclxuXHJcbiAgICAgICAgLy8gRWl0aGVyIHplcm8/XHJcbiAgICAgICAgaWYgKCF4Y1swXSB8fCAheWNbMF0pIHtcclxuXHJcbiAgICAgICAgICAgIC8vIHkgaXMgbm9uLXplcm8/IHggaXMgbm9uLXplcm8/IE9yIGJvdGggYXJlIHplcm8uXHJcbiAgICAgICAgICAgIHJldHVybiB5Y1swXSA/IHkgOiBuZXcgQmlnKHhjWzBdID8geCA6IGEgKiAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgeGMgPSB4Yy5zbGljZSgpO1xyXG5cclxuICAgICAgICAvLyBQcmVwZW5kIHplcm9zIHRvIGVxdWFsaXNlIGV4cG9uZW50cy5cclxuICAgICAgICAvLyBOb3RlOiBGYXN0ZXIgdG8gdXNlIHJldmVyc2UgdGhlbiBkbyB1bnNoaWZ0cy5cclxuICAgICAgICBpZiAoYSA9IHhlIC0geWUpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChhID4gMCkge1xyXG4gICAgICAgICAgICAgICAgeWUgPSB4ZTtcclxuICAgICAgICAgICAgICAgIHQgPSB5YztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGEgPSAtYTtcclxuICAgICAgICAgICAgICAgIHQgPSB4YztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdC5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgIGZvciAoOyBhLS07IHQucHVzaCgwKSkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHQucmV2ZXJzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUG9pbnQgeGMgdG8gdGhlIGxvbmdlciBhcnJheS5cclxuICAgICAgICBpZiAoeGMubGVuZ3RoIC0geWMubGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICB0ID0geWM7XHJcbiAgICAgICAgICAgIHljID0geGM7XHJcbiAgICAgICAgICAgIHhjID0gdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgYSA9IHljLmxlbmd0aDtcclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBPbmx5IHN0YXJ0IGFkZGluZyBhdCB5Yy5sZW5ndGggLSAxIGFzIHRoZSBmdXJ0aGVyIGRpZ2l0cyBvZiB4YyBjYW4gYmVcclxuICAgICAgICAgKiBsZWZ0IGFzIHRoZXkgYXJlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZvciAoYiA9IDA7IGE7KSB7XHJcbiAgICAgICAgICAgIGIgPSAoeGNbLS1hXSA9IHhjW2FdICsgeWNbYV0gKyBiKSAvIDEwIHwgMDtcclxuICAgICAgICAgICAgeGNbYV0gJT0gMTA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBObyBuZWVkIHRvIGNoZWNrIGZvciB6ZXJvLCBhcyAreCArICt5ICE9IDAgJiYgLXggKyAteSAhPSAwXHJcblxyXG4gICAgICAgIGlmIChiKSB7XHJcbiAgICAgICAgICAgIHhjLnVuc2hpZnQoYik7XHJcbiAgICAgICAgICAgICsreWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICAgIGZvciAoYSA9IHhjLmxlbmd0aDsgeGNbLS1hXSA9PT0gMDsgeGMucG9wKCkpIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHkuYyA9IHhjO1xyXG4gICAgICAgIHkuZSA9IHllO1xyXG5cclxuICAgICAgICByZXR1cm4geTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIHJhaXNlZCB0byB0aGUgcG93ZXIgbi5cclxuICAgICAqIElmIG4gaXMgbmVnYXRpdmUsIHJvdW5kLCBpZiBuZWNlc3NhcnksIHRvIGEgbWF4aW11bSBvZiBCaWcuRFAgZGVjaW1hbFxyXG4gICAgICogcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgQmlnLlJNLlxyXG4gICAgICpcclxuICAgICAqIG4ge251bWJlcn0gSW50ZWdlciwgLU1BWF9QT1dFUiB0byBNQVhfUE9XRVIgaW5jbHVzaXZlLlxyXG4gICAgICovXHJcbiAgICBQLnBvdyA9IGZ1bmN0aW9uIChuKSB7XHJcbiAgICAgICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICAgICAgICBvbmUgPSBuZXcgeC5jb25zdHJ1Y3RvcigxKSxcclxuICAgICAgICAgICAgeSA9IG9uZSxcclxuICAgICAgICAgICAgaXNOZWcgPSBuIDwgMDtcclxuXHJcbiAgICAgICAgaWYgKG4gIT09IH5+biB8fCBuIDwgLU1BWF9QT1dFUiB8fCBuID4gTUFYX1BPV0VSKSB7XHJcbiAgICAgICAgICAgIHRocm93RXJyKCchcG93IScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbiA9IGlzTmVnID8gLW4gOiBuO1xyXG5cclxuICAgICAgICBmb3IgKDs7KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAobiAmIDEpIHtcclxuICAgICAgICAgICAgICAgIHkgPSB5LnRpbWVzKHgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG4gPj49IDE7XHJcblxyXG4gICAgICAgICAgICBpZiAoIW4pIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHggPSB4LnRpbWVzKHgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGlzTmVnID8gb25lLmRpdih5KSA6IHk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICogUmV0dXJuIGEgbmV3IEJpZyB3aG9zZSB2YWx1ZSBpcyB0aGUgdmFsdWUgb2YgdGhpcyBCaWcgcm91bmRlZCB0byBhXHJcbiAgICAgKiBtYXhpbXVtIG9mIGRwIGRlY2ltYWwgcGxhY2VzIHVzaW5nIHJvdW5kaW5nIG1vZGUgcm0uXHJcbiAgICAgKiBJZiBkcCBpcyBub3Qgc3BlY2lmaWVkLCByb3VuZCB0byAwIGRlY2ltYWwgcGxhY2VzLlxyXG4gICAgICogSWYgcm0gaXMgbm90IHNwZWNpZmllZCwgdXNlIEJpZy5STS5cclxuICAgICAqXHJcbiAgICAgKiBbZHBdIHtudW1iZXJ9IEludGVnZXIsIDAgdG8gTUFYX0RQIGluY2x1c2l2ZS5cclxuICAgICAqIFtybV0gMCwgMSwgMiBvciAzIChST1VORF9ET1dOLCBST1VORF9IQUxGX1VQLCBST1VORF9IQUxGX0VWRU4sIFJPVU5EX1VQKVxyXG4gICAgICovXHJcbiAgICBQLnJvdW5kID0gZnVuY3Rpb24gKGRwLCBybSkge1xyXG4gICAgICAgIHZhciB4ID0gdGhpcyxcclxuICAgICAgICAgICAgQmlnID0geC5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICAgICAgaWYgKGRwID09IG51bGwpIHtcclxuICAgICAgICAgICAgZHAgPSAwO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZHAgIT09IH5+ZHAgfHwgZHAgPCAwIHx8IGRwID4gTUFYX0RQKSB7XHJcbiAgICAgICAgICAgIHRocm93RXJyKCchcm91bmQhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJuZCh4ID0gbmV3IEJpZyh4KSwgZHAsIHJtID09IG51bGwgPyBCaWcuUk0gOiBybSk7XHJcblxyXG4gICAgICAgIHJldHVybiB4O1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIG5ldyBCaWcgd2hvc2UgdmFsdWUgaXMgdGhlIHNxdWFyZSByb290IG9mIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyxcclxuICAgICAqIHJvdW5kZWQsIGlmIG5lY2Vzc2FyeSwgdG8gYSBtYXhpbXVtIG9mIEJpZy5EUCBkZWNpbWFsIHBsYWNlcyB1c2luZ1xyXG4gICAgICogcm91bmRpbmcgbW9kZSBCaWcuUk0uXHJcbiAgICAgKi9cclxuICAgIFAuc3FydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZXN0aW1hdGUsIHIsIGFwcHJveCxcclxuICAgICAgICAgICAgeCA9IHRoaXMsXHJcbiAgICAgICAgICAgIEJpZyA9IHguY29uc3RydWN0b3IsXHJcbiAgICAgICAgICAgIHhjID0geC5jLFxyXG4gICAgICAgICAgICBpID0geC5zLFxyXG4gICAgICAgICAgICBlID0geC5lLFxyXG4gICAgICAgICAgICBoYWxmID0gbmV3IEJpZygnMC41Jyk7XHJcblxyXG4gICAgICAgIC8vIFplcm8/XHJcbiAgICAgICAgaWYgKCF4Y1swXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEJpZyh4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIG5lZ2F0aXZlLCB0aHJvdyBOYU4uXHJcbiAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgIHRocm93RXJyKE5hTik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBFc3RpbWF0ZS5cclxuICAgICAgICBpID0gTWF0aC5zcXJ0KHgudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgIC8vIE1hdGguc3FydCB1bmRlcmZsb3cvb3ZlcmZsb3c/XHJcbiAgICAgICAgLy8gUGFzcyB4IHRvIE1hdGguc3FydCBhcyBpbnRlZ2VyLCB0aGVuIGFkanVzdCB0aGUgcmVzdWx0IGV4cG9uZW50LlxyXG4gICAgICAgIGlmIChpID09PSAwIHx8IGkgPT09IDEgLyAwKSB7XHJcbiAgICAgICAgICAgIGVzdGltYXRlID0geGMuam9pbignJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIShlc3RpbWF0ZS5sZW5ndGggKyBlICYgMSkpIHtcclxuICAgICAgICAgICAgICAgIGVzdGltYXRlICs9ICcwJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgciA9IG5ldyBCaWcoIE1hdGguc3FydChlc3RpbWF0ZSkudG9TdHJpbmcoKSApO1xyXG4gICAgICAgICAgICByLmUgPSAoKGUgKyAxKSAvIDIgfCAwKSAtIChlIDwgMCB8fCBlICYgMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgciA9IG5ldyBCaWcoaS50b1N0cmluZygpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGkgPSByLmUgKyAoQmlnLkRQICs9IDQpO1xyXG5cclxuICAgICAgICAvLyBOZXd0b24tUmFwaHNvbiBpdGVyYXRpb24uXHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBhcHByb3ggPSByO1xyXG4gICAgICAgICAgICByID0gaGFsZi50aW1lcyggYXBwcm94LnBsdXMoIHguZGl2KGFwcHJveCkgKSApO1xyXG4gICAgICAgIH0gd2hpbGUgKCBhcHByb3guYy5zbGljZSgwLCBpKS5qb2luKCcnKSAhPT1cclxuICAgICAgICAgICAgICAgICAgICAgICByLmMuc2xpY2UoMCwgaSkuam9pbignJykgKTtcclxuXHJcbiAgICAgICAgcm5kKHIsIEJpZy5EUCAtPSA0LCBCaWcuUk0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcjtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBuZXcgQmlnIHdob3NlIHZhbHVlIGlzIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyB0aW1lcyB0aGUgdmFsdWUgb2ZcclxuICAgICAqIEJpZyB5LlxyXG4gICAgICovXHJcbiAgICBQLm11bCA9IFAudGltZXMgPSBmdW5jdGlvbiAoeSkge1xyXG4gICAgICAgIHZhciBjLFxyXG4gICAgICAgICAgICB4ID0gdGhpcyxcclxuICAgICAgICAgICAgQmlnID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgICAgICAgeGMgPSB4LmMsXHJcbiAgICAgICAgICAgIHljID0gKHkgPSBuZXcgQmlnKHkpKS5jLFxyXG4gICAgICAgICAgICBhID0geGMubGVuZ3RoLFxyXG4gICAgICAgICAgICBiID0geWMubGVuZ3RoLFxyXG4gICAgICAgICAgICBpID0geC5lLFxyXG4gICAgICAgICAgICBqID0geS5lO1xyXG5cclxuICAgICAgICAvLyBEZXRlcm1pbmUgc2lnbiBvZiByZXN1bHQuXHJcbiAgICAgICAgeS5zID0geC5zID09IHkucyA/IDEgOiAtMTtcclxuXHJcbiAgICAgICAgLy8gUmV0dXJuIHNpZ25lZCAwIGlmIGVpdGhlciAwLlxyXG4gICAgICAgIGlmICgheGNbMF0gfHwgIXljWzBdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQmlnKHkucyAqIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGlzZSBleHBvbmVudCBvZiByZXN1bHQgYXMgeC5lICsgeS5lLlxyXG4gICAgICAgIHkuZSA9IGkgKyBqO1xyXG5cclxuICAgICAgICAvLyBJZiBhcnJheSB4YyBoYXMgZmV3ZXIgZGlnaXRzIHRoYW4geWMsIHN3YXAgeGMgYW5kIHljLCBhbmQgbGVuZ3Rocy5cclxuICAgICAgICBpZiAoYSA8IGIpIHtcclxuICAgICAgICAgICAgYyA9IHhjO1xyXG4gICAgICAgICAgICB4YyA9IHljO1xyXG4gICAgICAgICAgICB5YyA9IGM7XHJcbiAgICAgICAgICAgIGogPSBhO1xyXG4gICAgICAgICAgICBhID0gYjtcclxuICAgICAgICAgICAgYiA9IGo7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJbml0aWFsaXNlIGNvZWZmaWNpZW50IGFycmF5IG9mIHJlc3VsdCB3aXRoIHplcm9zLlxyXG4gICAgICAgIGZvciAoYyA9IG5ldyBBcnJheShqID0gYSArIGIpOyBqLS07IGNbal0gPSAwKSB7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBNdWx0aXBseS5cclxuXHJcbiAgICAgICAgLy8gaSBpcyBpbml0aWFsbHkgeGMubGVuZ3RoLlxyXG4gICAgICAgIGZvciAoaSA9IGI7IGktLTspIHtcclxuICAgICAgICAgICAgYiA9IDA7XHJcblxyXG4gICAgICAgICAgICAvLyBhIGlzIHljLmxlbmd0aC5cclxuICAgICAgICAgICAgZm9yIChqID0gYSArIGk7IGogPiBpOykge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEN1cnJlbnQgc3VtIG9mIHByb2R1Y3RzIGF0IHRoaXMgZGlnaXQgcG9zaXRpb24sIHBsdXMgY2FycnkuXHJcbiAgICAgICAgICAgICAgICBiID0gY1tqXSArIHljW2ldICogeGNbaiAtIGkgLSAxXSArIGI7XHJcbiAgICAgICAgICAgICAgICBjW2otLV0gPSBiICUgMTA7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY2FycnlcclxuICAgICAgICAgICAgICAgIGIgPSBiIC8gMTAgfCAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNbal0gPSAoY1tqXSArIGIpICUgMTA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJbmNyZW1lbnQgcmVzdWx0IGV4cG9uZW50IGlmIHRoZXJlIGlzIGEgZmluYWwgY2FycnkuXHJcbiAgICAgICAgaWYgKGIpIHtcclxuICAgICAgICAgICAgKyt5LmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZW1vdmUgYW55IGxlYWRpbmcgemVyby5cclxuICAgICAgICBpZiAoIWNbMF0pIHtcclxuICAgICAgICAgICAgYy5zaGlmdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIHRyYWlsaW5nIHplcm9zLlxyXG4gICAgICAgIGZvciAoaSA9IGMubGVuZ3RoOyAhY1stLWldOyBjLnBvcCgpKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHkuYyA9IGM7XHJcblxyXG4gICAgICAgIHJldHVybiB5O1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnLlxyXG4gICAgICogUmV0dXJuIGV4cG9uZW50aWFsIG5vdGF0aW9uIGlmIHRoaXMgQmlnIGhhcyBhIHBvc2l0aXZlIGV4cG9uZW50IGVxdWFsIHRvXHJcbiAgICAgKiBvciBncmVhdGVyIHRoYW4gQmlnLkVfUE9TLCBvciBhIG5lZ2F0aXZlIGV4cG9uZW50IGVxdWFsIHRvIG9yIGxlc3MgdGhhblxyXG4gICAgICogQmlnLkVfTkVHLlxyXG4gICAgICovXHJcbiAgICBQLnRvU3RyaW5nID0gUC52YWx1ZU9mID0gUC50b0pTT04gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHggPSB0aGlzLFxyXG4gICAgICAgICAgICBCaWcgPSB4LmNvbnN0cnVjdG9yLFxyXG4gICAgICAgICAgICBlID0geC5lLFxyXG4gICAgICAgICAgICBzdHIgPSB4LmMuam9pbignJyksXHJcbiAgICAgICAgICAgIHN0ckwgPSBzdHIubGVuZ3RoO1xyXG5cclxuICAgICAgICAvLyBFeHBvbmVudGlhbCBub3RhdGlvbj9cclxuICAgICAgICBpZiAoZSA8PSBCaWcuRV9ORUcgfHwgZSA+PSBCaWcuRV9QT1MpIHtcclxuICAgICAgICAgICAgc3RyID0gc3RyLmNoYXJBdCgwKSArIChzdHJMID4gMSA/ICcuJyArIHN0ci5zbGljZSgxKSA6ICcnKSArXHJcbiAgICAgICAgICAgICAgKGUgPCAwID8gJ2UnIDogJ2UrJykgKyBlO1xyXG5cclxuICAgICAgICAvLyBOZWdhdGl2ZSBleHBvbmVudD9cclxuICAgICAgICB9IGVsc2UgaWYgKGUgPCAwKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBQcmVwZW5kIHplcm9zLlxyXG4gICAgICAgICAgICBmb3IgKDsgKytlOyBzdHIgPSAnMCcgKyBzdHIpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdHIgPSAnMC4nICsgc3RyO1xyXG5cclxuICAgICAgICAvLyBQb3NpdGl2ZSBleHBvbmVudD9cclxuICAgICAgICB9IGVsc2UgaWYgKGUgPiAwKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoKytlID4gc3RyTCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFwcGVuZCB6ZXJvcy5cclxuICAgICAgICAgICAgICAgIGZvciAoZSAtPSBzdHJMOyBlLS0gOyBzdHIgKz0gJzAnKSB7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZSA8IHN0ckwpIHtcclxuICAgICAgICAgICAgICAgIHN0ciA9IHN0ci5zbGljZSgwLCBlKSArICcuJyArIHN0ci5zbGljZShlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBFeHBvbmVudCB6ZXJvLlxyXG4gICAgICAgIH0gZWxzZSBpZiAoc3RyTCA+IDEpIHtcclxuICAgICAgICAgICAgc3RyID0gc3RyLmNoYXJBdCgwKSArICcuJyArIHN0ci5zbGljZSgxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEF2b2lkICctMCdcclxuICAgICAgICByZXR1cm4geC5zIDwgMCAmJiB4LmNbMF0gPyAnLScgKyBzdHIgOiBzdHI7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICogSWYgdG9FeHBvbmVudGlhbCwgdG9GaXhlZCwgdG9QcmVjaXNpb24gYW5kIGZvcm1hdCBhcmUgbm90IHJlcXVpcmVkIHRoZXlcclxuICAgICAqIGNhbiBzYWZlbHkgYmUgY29tbWVudGVkLW91dCBvciBkZWxldGVkLiBObyByZWR1bmRhbnQgY29kZSB3aWxsIGJlIGxlZnQuXHJcbiAgICAgKiBmb3JtYXQgaXMgdXNlZCBvbmx5IGJ5IHRvRXhwb25lbnRpYWwsIHRvRml4ZWQgYW5kIHRvUHJlY2lzaW9uLlxyXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICovXHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyBpbiBleHBvbmVudGlhbFxyXG4gICAgICogbm90YXRpb24gdG8gZHAgZml4ZWQgZGVjaW1hbCBwbGFjZXMgYW5kIHJvdW5kZWQsIGlmIG5lY2Vzc2FyeSwgdXNpbmdcclxuICAgICAqIEJpZy5STS5cclxuICAgICAqXHJcbiAgICAgKiBbZHBdIHtudW1iZXJ9IEludGVnZXIsIDAgdG8gTUFYX0RQIGluY2x1c2l2ZS5cclxuICAgICAqL1xyXG4gICAgUC50b0V4cG9uZW50aWFsID0gZnVuY3Rpb24gKGRwKSB7XHJcblxyXG4gICAgICAgIGlmIChkcCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGRwID0gdGhpcy5jLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkcCAhPT0gfn5kcCB8fCBkcCA8IDAgfHwgZHAgPiBNQVhfRFApIHtcclxuICAgICAgICAgICAgdGhyb3dFcnIoJyF0b0V4cCEnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmb3JtYXQodGhpcywgZHAsIDEpO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLypcclxuICAgICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHZhbHVlIG9mIHRoaXMgQmlnIGluIG5vcm1hbCBub3RhdGlvblxyXG4gICAgICogdG8gZHAgZml4ZWQgZGVjaW1hbCBwbGFjZXMgYW5kIHJvdW5kZWQsIGlmIG5lY2Vzc2FyeSwgdXNpbmcgQmlnLlJNLlxyXG4gICAgICpcclxuICAgICAqIFtkcF0ge251bWJlcn0gSW50ZWdlciwgMCB0byBNQVhfRFAgaW5jbHVzaXZlLlxyXG4gICAgICovXHJcbiAgICBQLnRvRml4ZWQgPSBmdW5jdGlvbiAoZHApIHtcclxuICAgICAgICB2YXIgc3RyLFxyXG4gICAgICAgICAgICB4ID0gdGhpcyxcclxuICAgICAgICAgICAgQmlnID0geC5jb25zdHJ1Y3RvcixcclxuICAgICAgICAgICAgbmVnID0gQmlnLkVfTkVHLFxyXG4gICAgICAgICAgICBwb3MgPSBCaWcuRV9QT1M7XHJcblxyXG4gICAgICAgIC8vIFByZXZlbnQgdGhlIHBvc3NpYmlsaXR5IG9mIGV4cG9uZW50aWFsIG5vdGF0aW9uLlxyXG4gICAgICAgIEJpZy5FX05FRyA9IC0oQmlnLkVfUE9TID0gMSAvIDApO1xyXG5cclxuICAgICAgICBpZiAoZHAgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdHIgPSB4LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChkcCA9PT0gfn5kcCAmJiBkcCA+PSAwICYmIGRwIDw9IE1BWF9EUCkge1xyXG4gICAgICAgICAgICBzdHIgPSBmb3JtYXQoeCwgeC5lICsgZHApO1xyXG5cclxuICAgICAgICAgICAgLy8gKC0wKS50b0ZpeGVkKCkgaXMgJzAnLCBidXQgKC0wLjEpLnRvRml4ZWQoKSBpcyAnLTAnLlxyXG4gICAgICAgICAgICAvLyAoLTApLnRvRml4ZWQoMSkgaXMgJzAuMCcsIGJ1dCAoLTAuMDEpLnRvRml4ZWQoMSkgaXMgJy0wLjAnLlxyXG4gICAgICAgICAgICBpZiAoeC5zIDwgMCAmJiB4LmNbMF0gJiYgc3RyLmluZGV4T2YoJy0nKSA8IDApIHtcclxuICAgICAgICAvL0UuZy4gLTAuNSBpZiByb3VuZGVkIHRvIC0wIHdpbGwgY2F1c2UgdG9TdHJpbmcgdG8gb21pdCB0aGUgbWludXMgc2lnbi5cclxuICAgICAgICAgICAgICAgIHN0ciA9ICctJyArIHN0cjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBCaWcuRV9ORUcgPSBuZWc7XHJcbiAgICAgICAgQmlnLkVfUE9TID0gcG9zO1xyXG5cclxuICAgICAgICBpZiAoIXN0cikge1xyXG4gICAgICAgICAgICB0aHJvd0VycignIXRvRml4IScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qXHJcbiAgICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB2YWx1ZSBvZiB0aGlzIEJpZyByb3VuZGVkIHRvIHNkXHJcbiAgICAgKiBzaWduaWZpY2FudCBkaWdpdHMgdXNpbmcgQmlnLlJNLiBVc2UgZXhwb25lbnRpYWwgbm90YXRpb24gaWYgc2QgaXMgbGVzc1xyXG4gICAgICogdGhhbiB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBuZWNlc3NhcnkgdG8gcmVwcmVzZW50IHRoZSBpbnRlZ2VyIHBhcnQgb2YgdGhlXHJcbiAgICAgKiB2YWx1ZSBpbiBub3JtYWwgbm90YXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogc2Qge251bWJlcn0gSW50ZWdlciwgMSB0byBNQVhfRFAgaW5jbHVzaXZlLlxyXG4gICAgICovXHJcbiAgICBQLnRvUHJlY2lzaW9uID0gZnVuY3Rpb24gKHNkKSB7XHJcblxyXG4gICAgICAgIGlmIChzZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzZCAhPT0gfn5zZCB8fCBzZCA8IDEgfHwgc2QgPiBNQVhfRFApIHtcclxuICAgICAgICAgICAgdGhyb3dFcnIoJyF0b1ByZSEnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmb3JtYXQodGhpcywgc2QgLSAxLCAyKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEV4cG9ydFxyXG5cclxuXHJcbiAgICBCaWcgPSBiaWdGYWN0b3J5KCk7XHJcblxyXG4gICAgLy9BTUQuXHJcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpZztcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAvLyBOb2RlIGFuZCBvdGhlciBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMuXHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBCaWc7XHJcblxyXG4gICAgLy9Ccm93c2VyLlxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBnbG9iYWwuQmlnID0gQmlnO1xyXG4gICAgfVxyXG59KSh0aGlzKTtcclxuIl19
