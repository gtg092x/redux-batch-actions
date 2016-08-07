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
//# sourceMappingURL=data:application/json;base64,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QXJERDtBQXNERDs7a0JBRWMsTSIsImZpbGUiOiJiYXRjaC1hY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuZnVuY3Rpb24gZGVmYXVsdE1lcmdlKHBvaW50ZXIsIGFjdGlvbikge1xuICByZXR1cm4ge1xuICAgIC4uLnBvaW50ZXIsXG4gICAgLi4uYWN0aW9uLFxuICAgIGRhdGE6IHtcbiAgICAgIC4uLnBvaW50ZXIuZGF0YSxcbiAgICAgIC4uLmFjdGlvbi5kYXRhXG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0VGljaygpIHtcbiAgcmV0dXJuIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gcHJvY2Vzcy5uZXh0VGljayA6IF8ucGFydGlhbFJpZ2h0KHNldFRpbWVvdXQsIDEpO1xufVxuXG5mdW5jdGlvbiBjb25maWcoe3RpY2s6IHRpY2tBcmcgPSBnZXREZWZhdWx0VGljaygpLCAuLi5vcHRpb25zfSA9IHt9KSB7XG4gIGNvbnN0IHRpY2sgPSB0aWNrQXJnID09PSBudWxsID8gXy5ub29wIDogdGlja0FyZztcbiAgcmV0dXJuIChzdG9yZSkgPT4ge1xuICAgIHJldHVybiAobmV4dCkgPT4ge1xuICAgICAgbGV0IHF1ZXVlID0ge307XG4gICAgICBsZXQgdG9UaWNrID0gZmFsc2U7XG5cbiAgICAgIGNvbnN0IGNvbXBsZXRlVHlwZSA9IHR5cGUgPT4ge1xuICAgICAgICBjb25zdCB0b0JhdGNoID0gcXVldWVbdHlwZV07XG4gICAgICAgIGlmIChfLnNpemUodG9CYXRjaCkgPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb21iaW5lZEFjdGlvbiA9IHRvQmF0Y2gucmVkdWNlKChwb2ludGVyLCB7YWN0aW9uLCAkJGJhdGNoZXJ9KSA9PiB7XG4gICAgICAgICAgY29uc3QgYmF0Y2hlciA9IF8uaXNQbGFpbk9iamVjdCgkJGJhdGNoZXIpID8gJCRiYXRjaGVyIDpcbiAgICAgICAgICAgIF8uaXNGdW5jdGlvbigkJGJhdGNoZXIpID8ge21lcmdlOiAkJGJhdGNoZXJ9IDoge307XG4gICAgICAgICAgY29uc3Qge21lcmdlID0gZGVmYXVsdE1lcmdlLCBfOiBtZXJnZUFsaWFzLCAuLi5jb25maWd9ID0gYmF0Y2hlcjtcbiAgICAgICAgICByZXR1cm4gbWVyZ2VBbGlhcyB8fCBtZXJnZShwb2ludGVyLCBhY3Rpb24pO1xuICAgICAgICB9LCB7fSk7XG5cbiAgICAgICAgcXVldWVbdHlwZV0gPSBbXTtcblxuICAgICAgICBjb25zdCB0b0Rpc3BhdGNoID0gey4uLmNvbWJpbmVkQWN0aW9uLCAkJGNvbWJpbmVkOiB0cnVlfTtcbiAgICAgICAgdG9UaWNrID0gZmFsc2U7XG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKHRvRGlzcGF0Y2gpO1xuICAgICAgfTtcblxuICAgICAgY29uc3Qgb25UaWNrID0gKCkgPT4ge1xuICAgICAgICBPYmplY3Qua2V5cyhxdWV1ZSkuZm9yRWFjaChjb21wbGV0ZVR5cGUpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIChhY3Rpb24pID0+IHtcblxuICAgICAgICBjb25zdCBhY3Rpb25UeXBlID0gYWN0aW9uLnR5cGU7XG4gICAgICAgIGNvbnN0ICQkYmF0Y2hlciA9IGFjdGlvbi5iYXRjaCB8fCBvcHRpb25zW2FjdGlvblR5cGVdO1xuXG5cblxuICAgICAgICBpZigkJGJhdGNoZXIgJiYgIWFjdGlvbi4kJGNvbWJpbmVkKSB7XG4gICAgICAgICAgcXVldWVbYWN0aW9uVHlwZV0gPSBxdWV1ZVthY3Rpb25UeXBlXSB8fCBbXTtcbiAgICAgICAgICBxdWV1ZVthY3Rpb25UeXBlXS5wdXNoKHskJGJhdGNoZXIsIGFjdGlvbn0pO1xuXG4gICAgICAgICAgY29uc3QgJCRiYXRjaENvbXBsZXRlID0gYWN0aW9uLmJhdGNoQ29tcGxldGU7XG4gICAgICAgICAgaWYgKCQkYmF0Y2hDb21wbGV0ZSkge1xuICAgICAgICAgICAgY29tcGxldGVUeXBlKGFjdGlvblR5cGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAhdG9UaWNrICYmICh0aWNrKG9uVGljaykgfHwgKHRvVGljayA9IHRydWUpKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV4dChhY3Rpb24pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIl19