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
  var _ref$finalize = _ref.finalize;
  var finalize = _ref$finalize === undefined ? _lodash2.default.identity : _ref$finalize;

  var options = _objectWithoutProperties(_ref, ['tick', 'finalize']);

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

        var toDispatch = finalize(_extends({}, combinedAction, { $$combined: true }));
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
//# sourceMappingURL=data:application/json;base64,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QTFCLENBQVo7QUFDRDs7QUFFRDtBQUNEO0FBQ0QsZUFBTyxLQUFLLE1BQUwsQ0FBUDtBQUNELE9BdEJEO0FBdUJELEtBbkREO0FBb0RELEdBckREO0FBc0REOztrQkFFYyxNIiwiZmlsZSI6ImJhdGNoLWFjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5mdW5jdGlvbiBkZWZhdWx0TWVyZ2UocG9pbnRlciwgYWN0aW9uKSB7XG4gIHJldHVybiB7XG4gICAgLi4ucG9pbnRlcixcbiAgICAuLi5hY3Rpb24sXG4gICAgZGF0YToge1xuICAgICAgLi4ucG9pbnRlci5kYXRhLFxuICAgICAgLi4uYWN0aW9uLmRhdGFcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRUaWNrKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBwcm9jZXNzLm5leHRUaWNrIDogXy5wYXJ0aWFsUmlnaHQoc2V0VGltZW91dCwgMSk7XG59XG5cbmZ1bmN0aW9uIGNvbmZpZyh7dGljazogdGlja0FyZyA9IGdldERlZmF1bHRUaWNrKCksIGZpbmFsaXplID0gXy5pZGVudGl0eSwgLi4ub3B0aW9uc30gPSB7fSkge1xuICBjb25zdCB0aWNrID0gdGlja0FyZyA9PT0gbnVsbCA/IF8ubm9vcCA6IHRpY2tBcmc7XG4gIHJldHVybiAoc3RvcmUpID0+IHtcbiAgICByZXR1cm4gKG5leHQpID0+IHtcbiAgICAgIGxldCBxdWV1ZSA9IHt9O1xuICAgICAgbGV0IHRvVGljayA9IGZhbHNlO1xuXG4gICAgICBjb25zdCBjb21wbGV0ZVR5cGUgPSB0eXBlID0+IHtcbiAgICAgICAgY29uc3QgdG9CYXRjaCA9IHF1ZXVlW3R5cGVdO1xuICAgICAgICBpZiAoXy5zaXplKHRvQmF0Y2gpID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29tYmluZWRBY3Rpb24gPSB0b0JhdGNoLnJlZHVjZSgocG9pbnRlciwge2FjdGlvbiwgJCRiYXRjaGVyfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGJhdGNoZXIgPSBfLmlzUGxhaW5PYmplY3QoJCRiYXRjaGVyKSA/ICQkYmF0Y2hlciA6XG4gICAgICAgICAgICBfLmlzRnVuY3Rpb24oJCRiYXRjaGVyKSA/IHttZXJnZTogJCRiYXRjaGVyfSA6IHt9O1xuICAgICAgICAgIGNvbnN0IHttZXJnZSA9IGRlZmF1bHRNZXJnZSwgXzogbWVyZ2VBbGlhcywgLi4uY29uZmlnfSA9IGJhdGNoZXI7XG4gICAgICAgICAgcmV0dXJuIG1lcmdlQWxpYXMgfHwgbWVyZ2UocG9pbnRlciwgYWN0aW9uLCBzdG9yZS5nZXRTdGF0ZSgpKTtcbiAgICAgICAgfSwge30pO1xuXG4gICAgICAgIHF1ZXVlW3R5cGVdID0gW107XG5cbiAgICAgICAgY29uc3QgdG9EaXNwYXRjaCA9IGZpbmFsaXplKHsuLi5jb21iaW5lZEFjdGlvbiwgJCRjb21iaW5lZDogdHJ1ZX0pO1xuICAgICAgICB0b1RpY2sgPSBmYWxzZTtcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2godG9EaXNwYXRjaCk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBvblRpY2sgPSAoKSA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKHF1ZXVlKS5mb3JFYWNoKGNvbXBsZXRlVHlwZSk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gKGFjdGlvbikgPT4ge1xuXG4gICAgICAgIGNvbnN0IGFjdGlvblR5cGUgPSBhY3Rpb24udHlwZTtcbiAgICAgICAgY29uc3QgJCRiYXRjaGVyID0gYWN0aW9uLmJhdGNoIHx8IG9wdGlvbnNbYWN0aW9uVHlwZV07XG5cblxuXG4gICAgICAgIGlmKCQkYmF0Y2hlciAmJiAhYWN0aW9uLiQkY29tYmluZWQpIHtcbiAgICAgICAgICBxdWV1ZVthY3Rpb25UeXBlXSA9IHF1ZXVlW2FjdGlvblR5cGVdIHx8IFtdO1xuICAgICAgICAgIHF1ZXVlW2FjdGlvblR5cGVdLnB1c2goeyQkYmF0Y2hlciwgYWN0aW9ufSk7XG5cbiAgICAgICAgICBjb25zdCAkJGJhdGNoQ29tcGxldGUgPSBhY3Rpb24uYmF0Y2hDb21wbGV0ZTtcbiAgICAgICAgICBpZiAoJCRiYXRjaENvbXBsZXRlKSB7XG4gICAgICAgICAgICBjb21wbGV0ZVR5cGUoYWN0aW9uVHlwZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICF0b1RpY2sgJiYgKHRpY2sob25UaWNrKSB8fCAodG9UaWNrID0gdHJ1ZSkpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXh0KGFjdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XG4iXX0=