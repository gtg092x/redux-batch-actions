'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function defaultMerge(pointer, action) {
  return _extends({}, pointer, action, {
    data: _extends({}, pointer.data, action.data)
  });
}

function getDefaultTick() {
  return typeof window === 'undefined' ? process.nextTick : _lodash2.default.partialRight(setTimeout, 1);
}

function config() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$tick = _ref.tick;
  var tickArg = _ref$tick === undefined ? getDefaultTick() : _ref$tick;

  var options = _objectWithoutProperties(_ref, ['tick']);

  var tick = tickArg === null ? _lodash2.default.noop : tickArg;
  return function (store) {
    return function (next) {
      var queue = {};
      var toTick = false;

      var completeType = function completeType(type) {
        var toBatch = queue[type];
        if (_lodash2.default.size(toBatch) === 0) {
          return;
        }

        var combinedAction = toBatch.reduce(function (pointer, _ref2) {
          var action = _ref2.action;
          var $$batcher = _ref2.$$batcher;

          var batcher = _lodash2.default.isPlainObject($$batcher) ? $$batcher : _lodash2.default.isFunction($$batcher) ? { merge: $$batcher } : {};
          var _batcher$merge = batcher.merge;
          var merge = _batcher$merge === undefined ? defaultMerge : _batcher$merge;
          var mergeAlias = batcher._;

          var config = _objectWithoutProperties(batcher, ['merge', '_']);

          return mergeAlias || merge(pointer, action, store.getState());
        }, {});

        queue[type] = [];

        var toDispatch = _extends({}, combinedAction, { $$combined: true });
        toTick = false;
        store.dispatch(toDispatch);
      };

      var onTick = function onTick() {
        Object.keys(queue).forEach(completeType);
      };

      return function (action) {

        var actionType = action.type;
        var $$batcher = action.batch || options[actionType];

        if ($$batcher && !action.$$combined) {
          queue[actionType] = queue[actionType] || [];
          queue[actionType].push({ $$batcher: $$batcher, action: action });

          var $$batchComplete = action.batchComplete;
          if ($$batchComplete) {
            completeType(actionType);
            return;
          } else {
            !toTick && (tick(onTick) || (toTick = true));
          }

          return;
        }
        return next(action);
      };
    };
  };
}

exports.default = config;
//# sourceMappingURL=data:application/json;base64,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QkQ7QUF1QkQsS0FuREQ7QUFvREQsR0FyREQ7QUFzREQ7O2tCQUVjLE0iLCJmaWxlIjoiYmF0Y2gtYWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmZ1bmN0aW9uIGRlZmF1bHRNZXJnZShwb2ludGVyLCBhY3Rpb24pIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5wb2ludGVyLFxuICAgIC4uLmFjdGlvbixcbiAgICBkYXRhOiB7XG4gICAgICAuLi5wb2ludGVyLmRhdGEsXG4gICAgICAuLi5hY3Rpb24uZGF0YVxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdFRpY2soKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHByb2Nlc3MubmV4dFRpY2sgOiBfLnBhcnRpYWxSaWdodChzZXRUaW1lb3V0LCAxKTtcbn1cblxuZnVuY3Rpb24gY29uZmlnKHt0aWNrOiB0aWNrQXJnID0gZ2V0RGVmYXVsdFRpY2soKSwgLi4ub3B0aW9uc30gPSB7fSkge1xuICBjb25zdCB0aWNrID0gdGlja0FyZyA9PT0gbnVsbCA/IF8ubm9vcCA6IHRpY2tBcmc7XG4gIHJldHVybiAoc3RvcmUpID0+IHtcbiAgICByZXR1cm4gKG5leHQpID0+IHtcbiAgICAgIGxldCBxdWV1ZSA9IHt9O1xuICAgICAgbGV0IHRvVGljayA9IGZhbHNlO1xuXG4gICAgICBjb25zdCBjb21wbGV0ZVR5cGUgPSB0eXBlID0+IHtcbiAgICAgICAgY29uc3QgdG9CYXRjaCA9IHF1ZXVlW3R5cGVdO1xuICAgICAgICBpZiAoXy5zaXplKHRvQmF0Y2gpID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29tYmluZWRBY3Rpb24gPSB0b0JhdGNoLnJlZHVjZSgocG9pbnRlciwge2FjdGlvbiwgJCRiYXRjaGVyfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGJhdGNoZXIgPSBfLmlzUGxhaW5PYmplY3QoJCRiYXRjaGVyKSA/ICQkYmF0Y2hlciA6XG4gICAgICAgICAgICBfLmlzRnVuY3Rpb24oJCRiYXRjaGVyKSA/IHttZXJnZTogJCRiYXRjaGVyfSA6IHt9O1xuICAgICAgICAgIGNvbnN0IHttZXJnZSA9IGRlZmF1bHRNZXJnZSwgXzogbWVyZ2VBbGlhcywgLi4uY29uZmlnfSA9IGJhdGNoZXI7XG4gICAgICAgICAgcmV0dXJuIG1lcmdlQWxpYXMgfHwgbWVyZ2UocG9pbnRlciwgYWN0aW9uLCBzdG9yZS5nZXRTdGF0ZSgpKTtcbiAgICAgICAgfSwge30pO1xuXG4gICAgICAgIHF1ZXVlW3R5cGVdID0gW107XG5cbiAgICAgICAgY29uc3QgdG9EaXNwYXRjaCA9IHsuLi5jb21iaW5lZEFjdGlvbiwgJCRjb21iaW5lZDogdHJ1ZX07XG4gICAgICAgIHRvVGljayA9IGZhbHNlO1xuICAgICAgICBzdG9yZS5kaXNwYXRjaCh0b0Rpc3BhdGNoKTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IG9uVGljayA9ICgpID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMocXVldWUpLmZvckVhY2goY29tcGxldGVUeXBlKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiAoYWN0aW9uKSA9PiB7XG5cbiAgICAgICAgY29uc3QgYWN0aW9uVHlwZSA9IGFjdGlvbi50eXBlO1xuICAgICAgICBjb25zdCAkJGJhdGNoZXIgPSBhY3Rpb24uYmF0Y2ggfHwgb3B0aW9uc1thY3Rpb25UeXBlXTtcblxuXG5cbiAgICAgICAgaWYoJCRiYXRjaGVyICYmICFhY3Rpb24uJCRjb21iaW5lZCkge1xuICAgICAgICAgIHF1ZXVlW2FjdGlvblR5cGVdID0gcXVldWVbYWN0aW9uVHlwZV0gfHwgW107XG4gICAgICAgICAgcXVldWVbYWN0aW9uVHlwZV0ucHVzaCh7JCRiYXRjaGVyLCBhY3Rpb259KTtcblxuICAgICAgICAgIGNvbnN0ICQkYmF0Y2hDb21wbGV0ZSA9IGFjdGlvbi5iYXRjaENvbXBsZXRlO1xuICAgICAgICAgIGlmICgkJGJhdGNoQ29tcGxldGUpIHtcbiAgICAgICAgICAgIGNvbXBsZXRlVHlwZShhY3Rpb25UeXBlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgIXRvVGljayAmJiAodGljayhvblRpY2spIHx8ICh0b1RpY2sgPSB0cnVlKSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiJdfQ==