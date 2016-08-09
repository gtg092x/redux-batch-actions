'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function defaultMerge() {
  var pointer = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var action = arguments[1];

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
        var toFinalize = arguments.length <= 1 || arguments[1] === undefined ? finalize : arguments[1];

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
          var mergeAlias2 = batcher.reduce;

          var config = _objectWithoutProperties(batcher, ['merge', '_', 'reduce']);

          return (mergeAlias2 || mergeAlias || merge)(pointer, action, store.getState());
        }, {});

        queue[type] = [];

        var toDispatch = toFinalize(_extends({}, combinedAction, { $$combined: true }));
        toTick = false;
        store.dispatch(toDispatch);
      };

      var onTick = function onTick() {
        Object.keys(queue).forEach(function (item) {
          return completeType(item);
        });
      };

      return function (action) {

        var actionType = action.type;
        var $$batcher = action.batch || options[actionType];

        if ($$batcher && !action.$$combined) {
          queue[actionType] = queue[actionType] || [];
          queue[actionType].push({ $$batcher: $$batcher, action: action });

          if (action.batchPurge) {
            queue[actionType] = [];
            return;
          }

          var $$batchComplete = action.batchComplete;
          if ($$batchComplete) {
            var finalizeArg = _lodash2.default.isFunction($$batchComplete) ? $$batchComplete : finalize;
            completeType(actionType, finalizeArg);
            return;
          } else {
            !toTick && (tick(onTick) || (toTick = true));
          }

          return;
        } else if ($$batcher) {
          return next(_lodash2.default.omit(action, ['batchComplete', '$$combined']));
        }
        return next(action);
      };
    };
  };
}

exports.default = config;
//# sourceMappingURL=data:application/json;base64,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LG9CQUFELEVBQVksY0FBWixFQUF2Qjs7QUFFQSxjQUFJLE9BQU8sVUFBWCxFQUF1QjtBQUNyQixrQkFBTSxVQUFOLElBQW9CLEVBQXBCO0FBQ0E7QUFDRDs7QUFFRCxjQUFNLGtCQUFrQixPQUFPLGFBQS9CO0FBQ0EsY0FBSSxlQUFKLEVBQXFCO0FBQ25CLGdCQUFNLGNBQWMsaUJBQUUsVUFBRixDQUFhLGVBQWIsSUFBZ0MsZUFBaEMsR0FBa0QsUUFBdEU7QUFDQSx5QkFBYSxVQUFiLEVBQXlCLFdBQXpCO0FBQ0E7QUFDRCxXQUpELE1BSU87QUFDTCxhQUFDLE1BQUQsS0FBWSxLQUFLLE1BQUwsTUFBaUIsU0FBUyxJQUExQixDQUFaO0FBQ0Q7O0FBRUQ7QUFDRCxTQW5CRCxNQW1CTyxJQUFJLFNBQUosRUFBZTtBQUNwQixpQkFBTyxLQUFLLGlCQUFFLElBQUYsQ0FBTyxNQUFQLEVBQWUsQ0FBQyxlQUFELEVBQWtCLFlBQWxCLENBQWYsQ0FBTCxDQUFQO0FBQ0Q7QUFDRCxlQUFPLEtBQUssTUFBTCxDQUFQO0FBQ0QsT0E1QkQ7QUE2QkQsS0F6REQ7QUEwREQsR0EzREQ7QUE0REQ7O2tCQUVjLE0iLCJmaWxlIjoiYmF0Y2gtYWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmZ1bmN0aW9uIGRlZmF1bHRNZXJnZShwb2ludGVyID0ge30sIGFjdGlvbikge1xuICByZXR1cm4ge1xuICAgIC4uLnBvaW50ZXIsXG4gICAgLi4uYWN0aW9uLFxuICAgIGRhdGE6IHtcbiAgICAgIC4uLnBvaW50ZXIuZGF0YSxcbiAgICAgIC4uLmFjdGlvbi5kYXRhXG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0VGljaygpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gcHJvY2Vzcy5uZXh0VGljayA6IF8ucGFydGlhbFJpZ2h0KHNldFRpbWVvdXQsIDEpO1xufVxuXG5mdW5jdGlvbiBjb25maWcoe3RpY2s6IHRpY2tBcmcgPSBnZXREZWZhdWx0VGljaygpLCBmaW5hbGl6ZSA9IF8uaWRlbnRpdHksIC4uLm9wdGlvbnN9ID0ge30pIHtcbiAgY29uc3QgdGljayA9IHRpY2tBcmcgPT09IG51bGwgPyBfLm5vb3AgOiB0aWNrQXJnO1xuICByZXR1cm4gKHN0b3JlKSA9PiB7XG4gICAgcmV0dXJuIChuZXh0KSA9PiB7XG4gICAgICBsZXQgcXVldWUgPSB7fTtcbiAgICAgIGxldCB0b1RpY2sgPSBmYWxzZTtcblxuICAgICAgY29uc3QgY29tcGxldGVUeXBlID0gKHR5cGUsIHRvRmluYWxpemUgPSBmaW5hbGl6ZSkgPT4ge1xuICAgICAgICBjb25zdCB0b0JhdGNoID0gcXVldWVbdHlwZV07XG4gICAgICAgIGlmIChfLnNpemUodG9CYXRjaCkgPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb21iaW5lZEFjdGlvbiA9IHRvQmF0Y2gucmVkdWNlKChwb2ludGVyLCB7YWN0aW9uLCAkJGJhdGNoZXJ9KSA9PiB7XG4gICAgICAgICAgY29uc3QgYmF0Y2hlciA9IF8uaXNQbGFpbk9iamVjdCgkJGJhdGNoZXIpID8gJCRiYXRjaGVyIDpcbiAgICAgICAgICAgIF8uaXNGdW5jdGlvbigkJGJhdGNoZXIpID8ge21lcmdlOiAkJGJhdGNoZXJ9IDoge307XG4gICAgICAgICAgY29uc3Qge21lcmdlID0gZGVmYXVsdE1lcmdlLCBfOiBtZXJnZUFsaWFzLCByZWR1Y2U6IG1lcmdlQWxpYXMyLCAuLi5jb25maWd9ID0gYmF0Y2hlcjtcbiAgICAgICAgICByZXR1cm4gKG1lcmdlQWxpYXMyIHx8IG1lcmdlQWxpYXMgfHwgbWVyZ2UpKHBvaW50ZXIsIGFjdGlvbiwgc3RvcmUuZ2V0U3RhdGUoKSk7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICBxdWV1ZVt0eXBlXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IHRvRGlzcGF0Y2ggPSB0b0ZpbmFsaXplKHsuLi5jb21iaW5lZEFjdGlvbiwgJCRjb21iaW5lZDogdHJ1ZX0pO1xuICAgICAgICB0b1RpY2sgPSBmYWxzZTtcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2godG9EaXNwYXRjaCk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBvblRpY2sgPSAoKSA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKHF1ZXVlKS5mb3JFYWNoKGl0ZW0gPT4gY29tcGxldGVUeXBlKGl0ZW0pKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiAoYWN0aW9uKSA9PiB7XG5cbiAgICAgICAgY29uc3QgYWN0aW9uVHlwZSA9IGFjdGlvbi50eXBlO1xuICAgICAgICBjb25zdCAkJGJhdGNoZXIgPSBhY3Rpb24uYmF0Y2ggfHwgb3B0aW9uc1thY3Rpb25UeXBlXTtcblxuICAgICAgICBpZigkJGJhdGNoZXIgJiYgIWFjdGlvbi4kJGNvbWJpbmVkKSB7XG4gICAgICAgICAgcXVldWVbYWN0aW9uVHlwZV0gPSBxdWV1ZVthY3Rpb25UeXBlXSB8fCBbXTtcbiAgICAgICAgICBxdWV1ZVthY3Rpb25UeXBlXS5wdXNoKHskJGJhdGNoZXIsIGFjdGlvbn0pO1xuXG4gICAgICAgICAgaWYgKGFjdGlvbi5iYXRjaFB1cmdlKSB7XG4gICAgICAgICAgICBxdWV1ZVthY3Rpb25UeXBlXSA9IFtdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0ICQkYmF0Y2hDb21wbGV0ZSA9IGFjdGlvbi5iYXRjaENvbXBsZXRlO1xuICAgICAgICAgIGlmICgkJGJhdGNoQ29tcGxldGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmFsaXplQXJnID0gXy5pc0Z1bmN0aW9uKCQkYmF0Y2hDb21wbGV0ZSkgPyAkJGJhdGNoQ29tcGxldGUgOiBmaW5hbGl6ZTtcbiAgICAgICAgICAgIGNvbXBsZXRlVHlwZShhY3Rpb25UeXBlLCBmaW5hbGl6ZUFyZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICF0b1RpY2sgJiYgKHRpY2sob25UaWNrKSB8fCAodG9UaWNrID0gdHJ1ZSkpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKCQkYmF0Y2hlcikge1xuICAgICAgICAgIHJldHVybiBuZXh0KF8ub21pdChhY3Rpb24sIFsnYmF0Y2hDb21wbGV0ZScsICckJGNvbWJpbmVkJ10pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV4dChhY3Rpb24pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIl19