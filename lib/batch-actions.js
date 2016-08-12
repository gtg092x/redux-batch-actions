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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iYXRjaC1hY3Rpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUEsU0FBUyxZQUFULEdBQTRDO0FBQUEsTUFBdEIsT0FBc0IseURBQVosRUFBWTtBQUFBLE1BQVIsTUFBUTs7QUFDMUMsc0JBQ0ssT0FETCxFQUVLLE1BRkw7QUFHRSx1QkFDSyxRQUFRLElBRGIsRUFFSyxPQUFPLElBRlo7QUFIRjtBQVFEOztBQUVELFNBQVMsY0FBVCxHQUEwQjtBQUN4QixTQUFPLE9BQU8sTUFBUCxLQUFrQixXQUFsQixHQUFnQyxRQUFRLFFBQXhDLEdBQW1ELGlCQUFFLFlBQUYsQ0FBZSxVQUFmLEVBQTJCLENBQTNCLENBQTFEO0FBQ0Q7O0FBRUQsU0FBUyxNQUFULEdBQTRGO0FBQUEsbUVBQUosRUFBSTs7QUFBQSx1QkFBM0UsSUFBMkU7QUFBQSxNQUFyRSxPQUFxRSw2QkFBM0QsZ0JBQTJEO0FBQUEsMkJBQXpDLFFBQXlDO0FBQUEsTUFBekMsUUFBeUMsaUNBQTlCLGlCQUFFLFFBQTRCOztBQUFBLE1BQWYsT0FBZTs7QUFDMUYsTUFBTSxPQUFPLFlBQVksSUFBWixHQUFtQixpQkFBRSxJQUFyQixHQUE0QixPQUF6QztBQUNBLFNBQU8sVUFBQyxLQUFELEVBQVc7QUFDaEIsV0FBTyxVQUFDLElBQUQsRUFBVTtBQUNmLFVBQUksUUFBUSxFQUFaO0FBQ0EsVUFBSSxTQUFTLEtBQWI7O0FBRUEsVUFBTSxlQUFlLFNBQWYsWUFBZSxDQUFDLElBQUQsRUFBaUM7QUFBQSxZQUExQixVQUEwQix5REFBYixRQUFhOztBQUNwRCxZQUFNLFVBQVUsTUFBTSxJQUFOLENBQWhCOztBQUVBLFlBQUksaUJBQUUsSUFBRixDQUFPLE9BQVAsTUFBb0IsQ0FBeEIsRUFBMkI7QUFDekI7QUFDRDs7QUFFRCxZQUFNLGlCQUFpQixRQUFRLE1BQVIsQ0FBZSxVQUFDLE9BQUQsU0FBa0M7QUFBQSxjQUF2QixNQUF1QixTQUF2QixNQUF1QjtBQUFBLGNBQWYsU0FBZSxTQUFmLFNBQWU7O0FBQ3RFLGNBQU0sVUFBVSxpQkFBRSxhQUFGLENBQWdCLFNBQWhCLElBQTZCLFNBQTdCLEdBQ2QsaUJBQUUsVUFBRixDQUFhLFNBQWIsSUFBMEIsRUFBQyxPQUFPLFNBQVIsRUFBMUIsR0FBK0MsRUFEakQ7QUFEc0UsK0JBR1EsT0FIUixDQUcvRCxLQUgrRDtBQUFBLGNBRy9ELEtBSCtELGtDQUd2RCxZQUh1RDtBQUFBLGNBR3RDLFVBSHNDLEdBR1EsT0FIUixDQUd6QyxDQUh5QztBQUFBLGNBR2xCLFdBSGtCLEdBR1EsT0FIUixDQUcxQixNQUgwQjs7QUFBQSxjQUdGLE1BSEUsNEJBR1EsT0FIUjs7QUFJdEUsaUJBQU8sQ0FBQyxlQUFlLFVBQWYsSUFBNkIsS0FBOUIsRUFBcUMsT0FBckMsRUFBOEMsTUFBOUMsRUFBc0QsTUFBTSxRQUFOLEVBQXRELENBQVA7QUFDRCxTQUxzQixFQUtwQixFQUxvQixDQUF2Qjs7QUFPQSxjQUFNLElBQU4sSUFBYyxFQUFkOztBQUVBLFlBQU0sYUFBYSx3QkFBZSxjQUFmLElBQStCLFlBQVksSUFBM0MsSUFBbkI7QUFDQSxpQkFBUyxLQUFUO0FBQ0EsY0FBTSxRQUFOLENBQWUsVUFBZjtBQUNELE9BbkJEOztBQXFCQSxVQUFNLFNBQVMsU0FBVCxNQUFTLEdBQU07QUFDbkIsZUFBTyxJQUFQLENBQVksS0FBWixFQUFtQixPQUFuQixDQUEyQjtBQUFBLGlCQUFRLGFBQWEsSUFBYixDQUFSO0FBQUEsU0FBM0I7QUFDRCxPQUZEOztBQUlBLGFBQU8sVUFBQyxNQUFELEVBQVk7O0FBRWpCLFlBQU0sYUFBYSxPQUFPLElBQTFCO0FBQ0EsWUFBTSxZQUFZLE9BQU8sS0FBUCxJQUFnQixRQUFRLFVBQVIsQ0FBbEM7O0FBRUEsWUFBRyxhQUFhLENBQUMsT0FBTyxVQUF4QixFQUFvQztBQUNsQyxnQkFBTSxVQUFOLElBQW9CLE1BQU0sVUFBTixLQUFxQixFQUF6QztBQUNBLGdCQUFNLFVBQU4sRUFBa0IsSUFBbEIsQ0FBdUIsRUFBQyxvQkFBRCxFQUFZLGNBQVosRUFBdkI7O0FBRUEsY0FBSSxPQUFPLFVBQVgsRUFBdUI7QUFDckIsa0JBQU0sVUFBTixJQUFvQixFQUFwQjtBQUNBO0FBQ0Q7O0FBRUQsY0FBTSxrQkFBa0IsT0FBTyxhQUEvQjtBQUNBLGNBQUksZUFBSixFQUFxQjtBQUNuQixnQkFBTSxjQUFjLGlCQUFFLFVBQUYsQ0FBYSxlQUFiLElBQWdDLGVBQWhDLEdBQWtELFFBQXRFO0FBQ0EseUJBQWEsVUFBYixFQUF5QixXQUF6QjtBQUNBO0FBQ0QsV0FKRCxNQUlPO0FBQ0wsYUFBQyxNQUFELEtBQVksS0FBSyxNQUFMLE1BQWlCLFNBQVMsSUFBMUIsQ0FBWjtBQUNEOztBQUVEO0FBQ0QsU0FuQkQsTUFtQk8sSUFBSSxTQUFKLEVBQWU7QUFDcEIsaUJBQU8sS0FBSyxpQkFBRSxJQUFGLENBQU8sTUFBUCxFQUFlLENBQUMsZUFBRCxFQUFrQixZQUFsQixDQUFmLENBQUwsQ0FBUDtBQUNEO0FBQ0QsZUFBTyxLQUFLLE1BQUwsQ0FBUDtBQUNELE9BNUJEO0FBNkJELEtBMUREO0FBMkRELEdBNUREO0FBNkREOztrQkFFYyxNIiwiZmlsZSI6ImJhdGNoLWFjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5mdW5jdGlvbiBkZWZhdWx0TWVyZ2UocG9pbnRlciA9IHt9LCBhY3Rpb24pIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5wb2ludGVyLFxuICAgIC4uLmFjdGlvbixcbiAgICBkYXRhOiB7XG4gICAgICAuLi5wb2ludGVyLmRhdGEsXG4gICAgICAuLi5hY3Rpb24uZGF0YVxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdFRpY2soKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHByb2Nlc3MubmV4dFRpY2sgOiBfLnBhcnRpYWxSaWdodChzZXRUaW1lb3V0LCAxKTtcbn1cblxuZnVuY3Rpb24gY29uZmlnKHt0aWNrOiB0aWNrQXJnID0gZ2V0RGVmYXVsdFRpY2soKSwgZmluYWxpemUgPSBfLmlkZW50aXR5LCAuLi5vcHRpb25zfSA9IHt9KSB7XG4gIGNvbnN0IHRpY2sgPSB0aWNrQXJnID09PSBudWxsID8gXy5ub29wIDogdGlja0FyZztcbiAgcmV0dXJuIChzdG9yZSkgPT4ge1xuICAgIHJldHVybiAobmV4dCkgPT4ge1xuICAgICAgbGV0IHF1ZXVlID0ge307XG4gICAgICBsZXQgdG9UaWNrID0gZmFsc2U7XG5cbiAgICAgIGNvbnN0IGNvbXBsZXRlVHlwZSA9ICh0eXBlLCB0b0ZpbmFsaXplID0gZmluYWxpemUpID0+IHtcbiAgICAgICAgY29uc3QgdG9CYXRjaCA9IHF1ZXVlW3R5cGVdO1xuXG4gICAgICAgIGlmIChfLnNpemUodG9CYXRjaCkgPT09IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb21iaW5lZEFjdGlvbiA9IHRvQmF0Y2gucmVkdWNlKChwb2ludGVyLCB7YWN0aW9uLCAkJGJhdGNoZXJ9KSA9PiB7XG4gICAgICAgICAgY29uc3QgYmF0Y2hlciA9IF8uaXNQbGFpbk9iamVjdCgkJGJhdGNoZXIpID8gJCRiYXRjaGVyIDpcbiAgICAgICAgICAgIF8uaXNGdW5jdGlvbigkJGJhdGNoZXIpID8ge21lcmdlOiAkJGJhdGNoZXJ9IDoge307XG4gICAgICAgICAgY29uc3Qge21lcmdlID0gZGVmYXVsdE1lcmdlLCBfOiBtZXJnZUFsaWFzLCByZWR1Y2U6IG1lcmdlQWxpYXMyLCAuLi5jb25maWd9ID0gYmF0Y2hlcjtcbiAgICAgICAgICByZXR1cm4gKG1lcmdlQWxpYXMyIHx8IG1lcmdlQWxpYXMgfHwgbWVyZ2UpKHBvaW50ZXIsIGFjdGlvbiwgc3RvcmUuZ2V0U3RhdGUoKSk7XG4gICAgICAgIH0sIHt9KTtcblxuICAgICAgICBxdWV1ZVt0eXBlXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IHRvRGlzcGF0Y2ggPSB0b0ZpbmFsaXplKHsuLi5jb21iaW5lZEFjdGlvbiwgJCRjb21iaW5lZDogdHJ1ZX0pO1xuICAgICAgICB0b1RpY2sgPSBmYWxzZTtcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2godG9EaXNwYXRjaCk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBvblRpY2sgPSAoKSA9PiB7XG4gICAgICAgIE9iamVjdC5rZXlzKHF1ZXVlKS5mb3JFYWNoKGl0ZW0gPT4gY29tcGxldGVUeXBlKGl0ZW0pKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiAoYWN0aW9uKSA9PiB7XG5cbiAgICAgICAgY29uc3QgYWN0aW9uVHlwZSA9IGFjdGlvbi50eXBlO1xuICAgICAgICBjb25zdCAkJGJhdGNoZXIgPSBhY3Rpb24uYmF0Y2ggfHwgb3B0aW9uc1thY3Rpb25UeXBlXTtcblxuICAgICAgICBpZigkJGJhdGNoZXIgJiYgIWFjdGlvbi4kJGNvbWJpbmVkKSB7XG4gICAgICAgICAgcXVldWVbYWN0aW9uVHlwZV0gPSBxdWV1ZVthY3Rpb25UeXBlXSB8fCBbXTtcbiAgICAgICAgICBxdWV1ZVthY3Rpb25UeXBlXS5wdXNoKHskJGJhdGNoZXIsIGFjdGlvbn0pO1xuXG4gICAgICAgICAgaWYgKGFjdGlvbi5iYXRjaFB1cmdlKSB7XG4gICAgICAgICAgICBxdWV1ZVthY3Rpb25UeXBlXSA9IFtdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0ICQkYmF0Y2hDb21wbGV0ZSA9IGFjdGlvbi5iYXRjaENvbXBsZXRlO1xuICAgICAgICAgIGlmICgkJGJhdGNoQ29tcGxldGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbmFsaXplQXJnID0gXy5pc0Z1bmN0aW9uKCQkYmF0Y2hDb21wbGV0ZSkgPyAkJGJhdGNoQ29tcGxldGUgOiBmaW5hbGl6ZTtcbiAgICAgICAgICAgIGNvbXBsZXRlVHlwZShhY3Rpb25UeXBlLCBmaW5hbGl6ZUFyZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICF0b1RpY2sgJiYgKHRpY2sob25UaWNrKSB8fCAodG9UaWNrID0gdHJ1ZSkpXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKCQkYmF0Y2hlcikge1xuICAgICAgICAgIHJldHVybiBuZXh0KF8ub21pdChhY3Rpb24sIFsnYmF0Y2hDb21wbGV0ZScsICckJGNvbWJpbmVkJ10pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV4dChhY3Rpb24pO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnO1xuIl19