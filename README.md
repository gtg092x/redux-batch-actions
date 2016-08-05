# Redux Batch Middleware [![Build Status](https://travis-ci.org/gtg092x/redux-batch-actions.svg?branch=master)](https://travis-ci.org/gtg092x/redux-batch-actions)

Batch [Redux][] actions.

[![NPM](https://nodei.co/npm/redux-batch-actions.png?downloads=true&stars=true)](https://nodei.co/npm/redux-batch-actions/)


## Installation

    % npm install redux-batch-actions

## Usage

```js
import { createStore } from 'redux';
import reducify from 'reducify';


const store = createStore(
  reducify({
    "GRAPH": (state = 0, action) => action.data
  }),
  {},
  applyMiddleware(batchMiddleware({
    "GRAPH": true
  }))
);

store.dispatch({
   type: 'GRAPH',
   data: {foo: 'bar'}
});

store.dispatch({
   type: 'GRAPH',
   data: {fuz: 'bus'}
});

// on next tick:
// State is: {foo: 'bar', fuz: 'bus'}
```

### Merge

By default, batch-actions merges your data objects into a single action.

If you want to customize this, include it as a configuration with your middleware.

```js
import { createStore } from 'redux';
import reducify from 'reducify';


const store = createStore(
  reducify({
    "GRAPH": (state = 0, action) => action.data
  }),
  {},
  applyMiddleware(batchMiddleware({
    "GRAPH": {
        merge: (state, part) => ({...state, ...part, myProp: {...state.myProp, ...part.myProp}})
    }
  }))
);

store.dispatch({
   type: 'GRAPH',
   myProp: {foo: 'bar'}
});

store.dispatch({
   type: 'GRAPH',
   myProp: {fuz: 'bus'}
});

// on next tick:
// Action is: {type: 'GRAPH', myProp: {foo: 'bar', fuz: 'bus'}}
```

If you pass in a function as your type config, we'll assume that it's the merge function

```js
import { createStore } from 'redux';
import reducify from 'reducify';


const store = createStore(
  reducify({
    "GRAPH": (state = 0, action) => action.data
  }),
  {},
  applyMiddleware(batchMiddleware({
    "GRAPH": (state, part) => ({...state, ...part, myProp: {...state.myProp, ...part.myProp}})
  }))
);

// same as above

```

### Batch  

If you don't include the action type when you configure your middleware, just include batch as an argument with your action type

```js
import { createStore } from 'redux';
import reducify from 'reducify';


const store = createStore(
  reducify({
    "GRAPH": (state = 0, action) => action.data
  }),
  {},
  applyMiddleware(batchMiddleware())
);

store.dispatch({
   type: 'GRAPH',
   data: {foo: 'bar'},
   batch: true
});

store.dispatch({
   type: 'GRAPH',
   data: {fuz: 'bus'},
   batch: true
});

// on next tick:
// State is: {foo: 'bar', fuz: 'bus'}
```

You can also pass in batch config this way.

```js
import { createStore } from 'redux';
import reducify from 'reducify';


const store = createStore(
  reducify({
    "GRAPH": (state = 0, action) => action.data
  }),
  {},
  applyMiddleware(batchMiddleware())
);

store.dispatch({
   type: 'GRAPH',
   myProp: {foo: 'bar'},
   batch: (state, part) => ({...state, ...part, myProp: {...state.myProp, ...part.myProp}})
});

store.dispatch({
   type: 'GRAPH',
   myProp: {fuz: 'bus'},
   batch: (state, part) => ({...state, ...part, myProp: {...state.myProp, ...part.myProp}})
});

// on next tick:
// Action is: {type: 'GRAPH', myProp: {foo: 'bar', fuz: 'bus'}}
```

### Configuration
 
This batching relies on a tick function, that is - any function that we know will fire next time there is a javascript event loop.  

By default, we use `setTimeout([fn], 1)` on the browser and `process.nextTick([fn])` on the server. You can change this, however, by passing it in as an option when you declare your middleware.
 
```js
const store = createStore(
  reducify({
    "GRAPH": (state = 0, action) => action.data
  }),
  {},
  applyMiddleware(batchMiddleware({tick: requestAnimationFrame}))
);
```


## Credits

Redux Batch Middleware is free software under the MIT license. It was created in sunny Santa Monica by [Matthew Drake][].

[Redux]: https://github.com/reactjs/redux
[Matthew Drake]: http://www.mediadrake.com
