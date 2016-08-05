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
        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return next(action);
      };
    };
  };
}

exports.default = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iYXRjaC1taWRkbGV3YXJlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUEsU0FBUyxZQUFULENBQXNCLE9BQXRCLEVBQStCLE1BQS9CLEVBQXVDO0FBQ3JDLHNCQUNLLE9BREwsRUFFSyxNQUZMO0FBR0UsdUJBQ0ssUUFBUSxJQURiLEVBRUssT0FBTyxJQUZaO0FBSEY7QUFRRDs7QUFFRCxTQUFTLGNBQVQsR0FBMEI7QUFDeEIsU0FBTyxPQUFPLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0MsUUFBUSxRQUF4QyxHQUFtRCxpQkFBRSxZQUFGLENBQWUsVUFBZixFQUEyQixDQUEzQixDQUExRDtBQUNEOztBQUVELFNBQVMsTUFBVCxHQUE0RDtBQUFBLG1FQUFKLEVBQUk7O0FBQUEsdUJBQTNDLElBQTJDO0FBQUEsTUFBM0MsSUFBMkMsNkJBQXBDLGdCQUFvQzs7QUFBQSxNQUFmLE9BQWU7O0FBQzFELFNBQU8sVUFBQyxLQUFELEVBQVc7QUFDaEIsV0FBTyxVQUFDLElBQUQsRUFBVTtBQUNmLFVBQUksUUFBUSxFQUFaO0FBQ0EsVUFBSSxTQUFTLEtBQWI7QUFDQSxVQUFNLFNBQVMsU0FBVCxNQUFTLEdBQU07QUFDbkIsZUFBTyxJQUFQLENBQVksS0FBWixFQUFtQixPQUFuQixDQUEyQixnQkFBUTtBQUNqQyxjQUFNLFVBQVUsTUFBTSxJQUFOLENBQWhCO0FBQ0EsY0FBSSxpQkFBRSxJQUFGLENBQU8sT0FBUCxNQUFvQixDQUF4QixFQUEyQjtBQUN6QjtBQUNEOztBQUVELGNBQU0saUJBQWlCLFFBQVEsTUFBUixDQUFlLFVBQUMsT0FBRCxTQUFrQztBQUFBLGdCQUF2QixNQUF1QixTQUF2QixNQUF1QjtBQUFBLGdCQUFmLFNBQWUsU0FBZixTQUFlOztBQUN0RSxnQkFBTSxVQUFVLGlCQUFFLGFBQUYsQ0FBZ0IsU0FBaEIsSUFBNkIsU0FBN0IsR0FDZCxpQkFBRSxVQUFGLENBQWEsU0FBYixJQUEwQixFQUFDLE9BQU8sU0FBUixFQUExQixHQUErQyxFQURqRDtBQURzRSxpQ0FHNUIsT0FINEIsQ0FHL0QsS0FIK0Q7QUFBQSxnQkFHL0QsS0FIK0Qsa0NBR3ZELFlBSHVEOztBQUFBLGdCQUd0QyxNQUhzQyw0QkFHNUIsT0FINEI7O0FBSXRFLG1CQUFPLE1BQU0sT0FBTixFQUFlLE1BQWYsQ0FBUDtBQUNELFdBTHNCLEVBS3BCLEVBTG9CLENBQXZCOztBQU9BLGdCQUFNLElBQU4sSUFBYyxFQUFkOztBQUVBLGNBQU0sMEJBQWlCLGNBQWpCLElBQWlDLFlBQVksSUFBN0MsR0FBTjtBQUNBLG1CQUFTLEtBQVQ7QUFDQSxnQkFBTSxRQUFOLENBQWUsVUFBZjtBQUNELFNBbEJEO0FBbUJELE9BcEJEOztBQXNCQSxhQUFPLFVBQUMsTUFBRCxFQUFZOztBQUVqQixZQUFNLGFBQWEsT0FBTyxJQUExQjtBQUNBLFlBQU0sWUFBWSxPQUFPLEtBQVAsSUFBZ0IsUUFBUSxVQUFSLENBQWxDOztBQUVBLFlBQUcsYUFBYSxDQUFDLE9BQU8sVUFBeEIsRUFBb0M7QUFDbEMsZ0JBQU0sVUFBTixJQUFvQixNQUFNLFVBQU4sS0FBcUIsRUFBekM7QUFDQSxnQkFBTSxVQUFOLEVBQWtCLElBQWxCLENBQXVCLEVBQUMsb0JBQUQsRUFBWSxjQUFaLEVBQXZCO0FBQ0EsV0FBQyxNQUFELEtBQVksS0FBSyxNQUFMLE1BQWlCLFNBQVMsSUFBMUIsQ0FBWjtBQUNBO0FBQ0Q7QUFDRDtBQUNBO0FBQ0EsZUFBTyxLQUFLLE1BQUwsQ0FBUDtBQUNELE9BZEQ7QUFlRCxLQXhDRDtBQXlDRCxHQTFDRDtBQTJDRDs7a0JBRWMsTSIsImZpbGUiOiJiYXRjaC1taWRkbGV3YXJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuZnVuY3Rpb24gZGVmYXVsdE1lcmdlKHBvaW50ZXIsIGFjdGlvbikge1xuICByZXR1cm4ge1xuICAgIC4uLnBvaW50ZXIsXG4gICAgLi4uYWN0aW9uLFxuICAgIGRhdGE6IHtcbiAgICAgIC4uLnBvaW50ZXIuZGF0YSxcbiAgICAgIC4uLmFjdGlvbi5kYXRhXG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0VGljaygpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gcHJvY2Vzcy5uZXh0VGljayA6IF8ucGFydGlhbFJpZ2h0KHNldFRpbWVvdXQsIDEpO1xufVxuXG5mdW5jdGlvbiBjb25maWcoe3RpY2sgPSBnZXREZWZhdWx0VGljaygpLCAuLi5vcHRpb25zfSA9IHt9KSB7XG4gIHJldHVybiAoc3RvcmUpID0+IHtcbiAgICByZXR1cm4gKG5leHQpID0+IHtcbiAgICAgIGxldCBxdWV1ZSA9IHt9O1xuICAgICAgbGV0IHRvVGljayA9IGZhbHNlO1xuICAgICAgY29uc3Qgb25UaWNrID0gKCkgPT4ge1xuICAgICAgICBPYmplY3Qua2V5cyhxdWV1ZSkuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICBjb25zdCB0b0JhdGNoID0gcXVldWVbdHlwZV07XG4gICAgICAgICAgaWYgKF8uc2l6ZSh0b0JhdGNoKSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGNvbWJpbmVkQWN0aW9uID0gdG9CYXRjaC5yZWR1Y2UoKHBvaW50ZXIsIHthY3Rpb24sICQkYmF0Y2hlcn0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJhdGNoZXIgPSBfLmlzUGxhaW5PYmplY3QoJCRiYXRjaGVyKSA/ICQkYmF0Y2hlciA6XG4gICAgICAgICAgICAgIF8uaXNGdW5jdGlvbigkJGJhdGNoZXIpID8ge21lcmdlOiAkJGJhdGNoZXJ9IDoge307XG4gICAgICAgICAgICBjb25zdCB7bWVyZ2UgPSBkZWZhdWx0TWVyZ2UsIC4uLmNvbmZpZ30gPSBiYXRjaGVyO1xuICAgICAgICAgICAgcmV0dXJuIG1lcmdlKHBvaW50ZXIsIGFjdGlvbik7XG4gICAgICAgICAgfSwge30pO1xuXG4gICAgICAgICAgcXVldWVbdHlwZV0gPSBbXTtcblxuICAgICAgICAgIGNvbnN0IHRvRGlzcGF0Y2ggPSB7Li4uY29tYmluZWRBY3Rpb24sICQkY29tYmluZWQ6IHRydWV9O1xuICAgICAgICAgIHRvVGljayA9IGZhbHNlO1xuICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHRvRGlzcGF0Y2gpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiAoYWN0aW9uKSA9PiB7XG5cbiAgICAgICAgY29uc3QgYWN0aW9uVHlwZSA9IGFjdGlvbi50eXBlO1xuICAgICAgICBjb25zdCAkJGJhdGNoZXIgPSBhY3Rpb24uYmF0Y2ggfHwgb3B0aW9uc1thY3Rpb25UeXBlXTtcblxuICAgICAgICBpZigkJGJhdGNoZXIgJiYgIWFjdGlvbi4kJGNvbWJpbmVkKSB7XG4gICAgICAgICAgcXVldWVbYWN0aW9uVHlwZV0gPSBxdWV1ZVthY3Rpb25UeXBlXSB8fCBbXTtcbiAgICAgICAgICBxdWV1ZVthY3Rpb25UeXBlXS5wdXNoKHskJGJhdGNoZXIsIGFjdGlvbn0pO1xuICAgICAgICAgICF0b1RpY2sgJiYgKHRpY2sob25UaWNrKSB8fCAodG9UaWNrID0gdHJ1ZSkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIHdpbGwgbGlrZWx5IGJlIHRoZSBhY3Rpb24gaXRzZWxmLCB1bmxlc3NcbiAgICAgICAgLy8gYSBtaWRkbGV3YXJlIGZ1cnRoZXIgaW4gY2hhaW4gY2hhbmdlZCBpdC5cbiAgICAgICAgcmV0dXJuIG5leHQoYWN0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiJdfQ==