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

function config({tick = getDefaultTick(), ...options} = {}) {
  return (store) => {
    return (next) => {
      let queue = {};
      let toTick = false;
      const onTick = () => {
        Object.keys(queue).forEach(type => {
          const toBatch = queue[type];
          if (_.size(toBatch) === 0) {
            return;
          }

          const combinedAction = toBatch.reduce((pointer, {action, $$batcher}) => {
            const batcher = _.isPlainObject($$batcher) ? $$batcher :
              _.isFunction($$batcher) ? {merge: $$batcher} : {};
            const {merge = defaultMerge, ...config} = batcher;
            return merge(pointer, action);
          }, {});

          queue[type] = [];

          const toDispatch = {...combinedAction, $$combined: true};
          toTick = false;
          store.dispatch(toDispatch);
        });
      };

      return (action) => {

        const actionType = action.type;
        const $$batcher = action.batch || options[actionType];

        if($$batcher && !action.$$combined) {
          queue[actionType] = queue[actionType] || [];
          queue[actionType].push({$$batcher, action});
          !toTick && (tick(onTick) || (toTick = true));
          return;
        }
        return next(action);
      }
    };
  }
}

export default config;
