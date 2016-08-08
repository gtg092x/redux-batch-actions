import _ from 'lodash';

function defaultMerge(pointer, action) {
  return {
    ...pointer,
    ...action,
    data: {
      ...pointer.data,
      ...action.data
    }
  };
}

function getDefaultTick() {
  return typeof window === 'undefined' ? process.nextTick : _.partialRight(setTimeout, 1);
}

function config({tick: tickArg = getDefaultTick(), finalize = _.identity, ...options} = {}) {
  const tick = tickArg === null ? _.noop : tickArg;
  return (store) => {
    return (next) => {
      let queue = {};
      let toTick = false;

      const completeType = type => {
        const toBatch = queue[type];
        if (_.size(toBatch) === 0) {
          return;
        }

        const combinedAction = toBatch.reduce((pointer, {action, $$batcher}) => {
          const batcher = _.isPlainObject($$batcher) ? $$batcher :
            _.isFunction($$batcher) ? {merge: $$batcher} : {};
          const {merge = defaultMerge, _: mergeAlias, ...config} = batcher;
          return mergeAlias || merge(pointer, action, store.getState());
        }, {});

        queue[type] = [];

        const toDispatch = finalize({...combinedAction, $$combined: true});
        toTick = false;
        store.dispatch(toDispatch);
      };

      const onTick = () => {
        Object.keys(queue).forEach(completeType);
      };

      return (action) => {

        const actionType = action.type;
        const $$batcher = action.batch || options[actionType];



        if($$batcher && !action.$$combined) {
          queue[actionType] = queue[actionType] || [];
          queue[actionType].push({$$batcher, action});

          const $$batchComplete = action.batchComplete;
          if ($$batchComplete) {
            completeType(actionType);
            return;
          } else {
            !toTick && (tick(onTick) || (toTick = true))
          }

          return;
        }
        return next(action);
      }
    };
  }
}

export default config;
