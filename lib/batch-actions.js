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
  var tick = _ref$tick === undefined ? getDefaultTick() : _ref$tick;

  var options = _objectWithoutProperties(_ref, ['tick']);

  return function (store) {
    return function (next) {
      var queue = {};
      var toTick = false;
      var onTick = function onTick() {
        Object.keys(queue).forEach(function (type) {
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

            var config = _objectWithoutProperties(batcher, ['merge']);

            return merge(pointer, action);
          }, {});

          queue[type] = [];

          var toDispatch = _extends({}, combinedAction, { $$combined: true });
          toTick = false;
          store.dispatch(toDispatch);
        });
      };

      return function (action) {

        var actionType = action.type;
        var $$batcher = action.batch || options[actionType];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iYXRjaC1hY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUEsU0FBUyxZQUFULENBQXNCLE9BQXRCLEVBQStCLE1BQS9CLEVBQXVDO0FBQ3JDLHNCQUNLLE9BREwsRUFFSyxNQUZMO0FBR0UsdUJBQ0ssUUFBUSxJQURiLEVBRUssT0FBTyxJQUZaO0FBSEY7QUFRRDs7QUFFRCxTQUFTLGNBQVQsR0FBMEI7QUFDeEIsU0FBTyxPQUFPLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0MsUUFBUSxRQUF4QyxHQUFtRCxpQkFBRSxZQUFGLENBQWUsVUFBZixFQUEyQixDQUEzQixDQUExRDtBQUNEOztBQUVELFNBQVMsTUFBVCxHQUE0RDtBQUFBLG1FQUFKLEVBQUk7O0FBQUEsdUJBQTNDLElBQTJDO0FBQUEsTUFBM0MsSUFBMkMsNkJBQXBDLGdCQUFvQzs7QUFBQSxNQUFmLE9BQWU7O0FBQzFELFNBQU8sVUFBQyxLQUFELEVBQVc7QUFDaEIsV0FBTyxVQUFDLElBQUQsRUFBVTtBQUNmLFVBQUksUUFBUSxFQUFaO0FBQ0EsVUFBSSxTQUFTLEtBQWI7QUFDQSxVQUFNLFNBQVMsU0FBVCxNQUFTLEdBQU07QUFDbkIsZUFBTyxJQUFQLENBQVksS0FBWixFQUFtQixPQUFuQixDQUEyQixnQkFBUTtBQUNqQyxjQUFNLFVBQVUsTUFBTSxJQUFOLENBQWhCO0FBQ0EsY0FBSSxpQkFBRSxJQUFGLENBQU8sT0FBUCxNQUFvQixDQUF4QixFQUEyQjtBQUN6QjtBQUNEOztBQUVELGNBQU0saUJBQWlCLFFBQVEsTUFBUixDQUFlLFVBQUMsT0FBRCxTQUFrQztBQUFBLGdCQUF2QixNQUF1QixTQUF2QixNQUF1QjtBQUFBLGdCQUFmLFNBQWUsU0FBZixTQUFlOztBQUN0RSxnQkFBTSxVQUFVLGlCQUFFLGFBQUYsQ0FBZ0IsU0FBaEIsSUFBNkIsU0FBN0IsR0FDZCxpQkFBRSxVQUFGLENBQWEsU0FBYixJQUEwQixFQUFDLE9BQU8sU0FBUixFQUExQixHQUErQyxFQURqRDtBQURzRSxpQ0FHNUIsT0FINEIsQ0FHL0QsS0FIK0Q7QUFBQSxnQkFHL0QsS0FIK0Qsa0NBR3ZELFlBSHVEOztBQUFBLGdCQUd0QyxNQUhzQyw0QkFHNUIsT0FINEI7O0FBSXRFLG1CQUFPLE1BQU0sT0FBTixFQUFlLE1BQWYsQ0FBUDtBQUNELFdBTHNCLEVBS3BCLEVBTG9CLENBQXZCOztBQU9BLGdCQUFNLElBQU4sSUFBYyxFQUFkOztBQUVBLGNBQU0sMEJBQWlCLGNBQWpCLElBQWlDLFlBQVksSUFBN0MsR0FBTjtBQUNBLG1CQUFTLEtBQVQ7QUFDQSxnQkFBTSxRQUFOLENBQWUsVUFBZjtBQUNELFNBbEJEO0FBbUJELE9BcEJEOztBQXNCQSxhQUFPLFVBQUMsTUFBRCxFQUFZOztBQUVqQixZQUFNLGFBQWEsT0FBTyxJQUExQjtBQUNBLFlBQU0sWUFBWSxPQUFPLEtBQVAsSUFBZ0IsUUFBUSxVQUFSLENBQWxDOztBQUVBLFlBQUcsYUFBYSxDQUFDLE9BQU8sVUFBeEIsRUFBb0M7QUFDbEMsZ0JBQU0sVUFBTixJQUFvQixNQUFNLFVBQU4sS0FBcUIsRUFBekM7QUFDQSxnQkFBTSxVQUFOLEVBQWtCLElBQWxCLENBQXVCLEVBQUMsb0JBQUQsRUFBWSxjQUFaLEVBQXZCO0FBQ0EsV0FBQyxNQUFELEtBQVksS0FBSyxNQUFMLE1BQWlCLFNBQVMsSUFBMUIsQ0FBWjtBQUNBO0FBQ0Q7QUFDRCxlQUFPLEtBQUssTUFBTCxDQUFQO0FBQ0QsT0FaRDtBQWFELEtBdENEO0FBdUNELEdBeENEO0FBeUNEOztrQkFFYyxNIiwiZmlsZSI6ImJhdGNoLWFjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5mdW5jdGlvbiBkZWZhdWx0TWVyZ2UocG9pbnRlciwgYWN0aW9uKSB7XG4gIHJldHVybiB7XG4gICAgLi4ucG9pbnRlcixcbiAgICAuLi5hY3Rpb24sXG4gICAgZGF0YToge1xuICAgICAgLi4ucG9pbnRlci5kYXRhLFxuICAgICAgLi4uYWN0aW9uLmRhdGFcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRUaWNrKCkge1xuICByZXR1cm4gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBwcm9jZXNzLm5leHRUaWNrIDogXy5wYXJ0aWFsUmlnaHQoc2V0VGltZW91dCwgMSk7XG59XG5cbmZ1bmN0aW9uIGNvbmZpZyh7dGljayA9IGdldERlZmF1bHRUaWNrKCksIC4uLm9wdGlvbnN9ID0ge30pIHtcbiAgcmV0dXJuIChzdG9yZSkgPT4ge1xuICAgIHJldHVybiAobmV4dCkgPT4ge1xuICAgICAgbGV0IHF1ZXVlID0ge307XG4gICAgICBsZXQgdG9UaWNrID0gZmFsc2U7XG4gICAgICBjb25zdCBvblRpY2sgPSAoKSA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKHF1ZXVlKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICAgIGNvbnN0IHRvQmF0Y2ggPSBxdWV1ZVt0eXBlXTtcbiAgICAgICAgICBpZiAoXy5zaXplKHRvQmF0Y2gpID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgY29tYmluZWRBY3Rpb24gPSB0b0JhdGNoLnJlZHVjZSgocG9pbnRlciwge2FjdGlvbiwgJCRiYXRjaGVyfSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYmF0Y2hlciA9IF8uaXNQbGFpbk9iamVjdCgkJGJhdGNoZXIpID8gJCRiYXRjaGVyIDpcbiAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKCQkYmF0Y2hlcikgPyB7bWVyZ2U6ICQkYmF0Y2hlcn0gOiB7fTtcbiAgICAgICAgICAgIGNvbnN0IHttZXJnZSA9IGRlZmF1bHRNZXJnZSwgLi4uY29uZmlnfSA9IGJhdGNoZXI7XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2UocG9pbnRlciwgYWN0aW9uKTtcbiAgICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgICBxdWV1ZVt0eXBlXSA9IFtdO1xuXG4gICAgICAgICAgY29uc3QgdG9EaXNwYXRjaCA9IHsuLi5jb21iaW5lZEFjdGlvbiwgJCRjb21iaW5lZDogdHJ1ZX07XG4gICAgICAgICAgdG9UaWNrID0gZmFsc2U7XG4gICAgICAgICAgc3RvcmUuZGlzcGF0Y2godG9EaXNwYXRjaCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIChhY3Rpb24pID0+IHtcblxuICAgICAgICBjb25zdCBhY3Rpb25UeXBlID0gYWN0aW9uLnR5cGU7XG4gICAgICAgIGNvbnN0ICQkYmF0Y2hlciA9IGFjdGlvbi5iYXRjaCB8fCBvcHRpb25zW2FjdGlvblR5cGVdO1xuXG4gICAgICAgIGlmKCQkYmF0Y2hlciAmJiAhYWN0aW9uLiQkY29tYmluZWQpIHtcbiAgICAgICAgICBxdWV1ZVthY3Rpb25UeXBlXSA9IHF1ZXVlW2FjdGlvblR5cGVdIHx8IFtdO1xuICAgICAgICAgIHF1ZXVlW2FjdGlvblR5cGVdLnB1c2goeyQkYmF0Y2hlciwgYWN0aW9ufSk7XG4gICAgICAgICAgIXRvVGljayAmJiAodGljayhvblRpY2spIHx8ICh0b1RpY2sgPSB0cnVlKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXh0KGFjdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XG4iXX0=