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

          return mergeAlias || merge(pointer, action);
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

        var $$batchComplete = action.batchComplete;
        if ($$batchComplete) {
          completeType(actionType);
          return;
        }

        if ($$batcher && !action.$$combined) {
          queue[actionType] = queue[actionType] || [];
          queue[actionType].push({ $$batcher: $$batcher, action: action });
          !toTick && (tick(onTick) || (toTick = true));
          return;
        }
        return next(action);
      };
    };
  };
}

exports.default = config;
//# sourceMappingURL=data:application/json;base64,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YyxNIiwiZmlsZSI6ImJhdGNoLWFjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5mdW5jdGlvbiBkZWZhdWx0TWVyZ2UocG9pbnRlciwgYWN0aW9uKSB7XG4gIHJldHVybiB7XG4gICAgLi4ucG9pbnRlcixcbiAgICAuLi5hY3Rpb24sXG4gICAgZGF0YToge1xuICAgICAgLi4ucG9pbnRlci5kYXRhLFxuICAgICAgLi4uYWN0aW9uLmRhdGFcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRUaWNrKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBwcm9jZXNzLm5leHRUaWNrIDogXy5wYXJ0aWFsUmlnaHQoc2V0VGltZW91dCwgMSk7XG59XG5cbmZ1bmN0aW9uIGNvbmZpZyh7dGljazogdGlja0FyZyA9IGdldERlZmF1bHRUaWNrKCksIC4uLm9wdGlvbnN9ID0ge30pIHtcbiAgY29uc3QgdGljayA9IHRpY2tBcmcgPT09IG51bGwgPyBfLm5vb3AgOiB0aWNrQXJnO1xuICByZXR1cm4gKHN0b3JlKSA9PiB7XG4gICAgcmV0dXJuIChuZXh0KSA9PiB7XG4gICAgICBsZXQgcXVldWUgPSB7fTtcbiAgICAgIGxldCB0b1RpY2sgPSBmYWxzZTtcblxuICAgICAgY29uc3QgY29tcGxldGVUeXBlID0gdHlwZSA9PiB7XG4gICAgICAgIGNvbnN0IHRvQmF0Y2ggPSBxdWV1ZVt0eXBlXTtcbiAgICAgICAgaWYgKF8uc2l6ZSh0b0JhdGNoKSA9PT0gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbWJpbmVkQWN0aW9uID0gdG9CYXRjaC5yZWR1Y2UoKHBvaW50ZXIsIHthY3Rpb24sICQkYmF0Y2hlcn0pID0+IHtcbiAgICAgICAgICBjb25zdCBiYXRjaGVyID0gXy5pc1BsYWluT2JqZWN0KCQkYmF0Y2hlcikgPyAkJGJhdGNoZXIgOlxuICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKCQkYmF0Y2hlcikgPyB7bWVyZ2U6ICQkYmF0Y2hlcn0gOiB7fTtcbiAgICAgICAgICBjb25zdCB7bWVyZ2UgPSBkZWZhdWx0TWVyZ2UsIF86IG1lcmdlQWxpYXMsIC4uLmNvbmZpZ30gPSBiYXRjaGVyO1xuICAgICAgICAgIHJldHVybiBtZXJnZUFsaWFzIHx8IG1lcmdlKHBvaW50ZXIsIGFjdGlvbik7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICBxdWV1ZVt0eXBlXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IHRvRGlzcGF0Y2ggPSB7Li4uY29tYmluZWRBY3Rpb24sICQkY29tYmluZWQ6IHRydWV9O1xuICAgICAgICB0b1RpY2sgPSBmYWxzZTtcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2godG9EaXNwYXRjaCk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBvblRpY2sgPSAoKSA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKHF1ZXVlKS5mb3JFYWNoKGNvbXBsZXRlVHlwZSk7XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gKGFjdGlvbikgPT4ge1xuXG4gICAgICAgIGNvbnN0IGFjdGlvblR5cGUgPSBhY3Rpb24udHlwZTtcbiAgICAgICAgY29uc3QgJCRiYXRjaGVyID0gYWN0aW9uLmJhdGNoIHx8IG9wdGlvbnNbYWN0aW9uVHlwZV07XG5cbiAgICAgICAgY29uc3QgJCRiYXRjaENvbXBsZXRlID0gYWN0aW9uLmJhdGNoQ29tcGxldGU7XG4gICAgICAgIGlmICgkJGJhdGNoQ29tcGxldGUpIHtcbiAgICAgICAgICBjb21wbGV0ZVR5cGUoYWN0aW9uVHlwZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoJCRiYXRjaGVyICYmICFhY3Rpb24uJCRjb21iaW5lZCkge1xuICAgICAgICAgIHF1ZXVlW2FjdGlvblR5cGVdID0gcXVldWVbYWN0aW9uVHlwZV0gfHwgW107XG4gICAgICAgICAgcXVldWVbYWN0aW9uVHlwZV0ucHVzaCh7JCRiYXRjaGVyLCBhY3Rpb259KTtcbiAgICAgICAgICAhdG9UaWNrICYmICh0aWNrKG9uVGljaykgfHwgKHRvVGljayA9IHRydWUpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiJdfQ==