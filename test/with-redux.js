import { createStore, applyMiddleware } from 'redux';
import reducify from 'reducify';
import chai from 'chai';
import batchMiddleware from '../src/batch-actions';
import _ from 'lodash';

const {assert} = chai;

export default function () {

  describe('should integreate with redux', function () {


    it('work with middleware', function (done) {

      const store = createStore(reducify(
        {
          "GRAPH": (state, action) => action.data,
          "GRUPH": (state, action) => action.data
        }
      ), {},
        applyMiddleware(batchMiddleware({
          "GRAPH": true,
          "GRAPHALT": true
        }))
      );

      const expectedStates = [
        {},
        {fa: 'bar', foo: 'buz'},
        {fa: 'bar1', foo: 'buz2'}
      ];

      store.subscribe(() => {
        const state = store.getState();
        const toExpect = expectedStates.shift();
        assert.deepEqual(state, toExpect);
      });

      store.dispatch({
        type: 'GRAPH',
        data: {fa: 'bar'}
      });

      store.dispatch({
        type: 'GRAPHALT',
        data: {fu: 2}
      });

      store.dispatch({
        type: 'GRAPHALT',
        data: {fa: 1},
        batchComplete: true
      });

      store.dispatch({
        type: 'GRAPH',
        data: {foo: 'buz'}
      });

      setTimeout(() => {
        store.dispatch({
          type: 'GRUPH',
          batch: true,
          data: {fa: 'bar1'}
        });

        store.dispatch({
          type: 'GRUPH',
          batch: true,
          data: {foo: 'buz2'}
        });
        setTimeout(done, 1);
      }, 1);

    });

    it('works with complete signals', function () {

      const store = createStore(reducify(
        {
          "GRAPH": (state, action) => ({...action.data, ...(action.param || {})})
        }
        ), {},
        applyMiddleware(batchMiddleware({
          "GRAPH": true
        }))
      );

      const expectedStates = [
        {fa: 'bar', foo: 'buz', fun: 'bas', data: 1}
      ];

      store.subscribe(() => {
        const state = store.getState();
        assert.deepEqual(state, expectedStates.shift());
      });

      store.dispatch({
        type: 'GRAPH',
        data: {fa: 'bar'}
      });

      store.dispatch({
        type: 'GRAPH',
        data: {foo: 'buz'}
      });

      store.dispatch({
        type: 'GRAPH',
        data: {fun: 'bas'},
        param: {data : 1},
        batchComplete: true
      });

    });

    it('works with purge signals', function (done) {

      const store = createStore(reducify(
        {
          "GRAPH": (state, action) => ({...action.data})
        }
        ), {},
        applyMiddleware(batchMiddleware({
          "GRAPH": true
        }))
      );

      store.subscribe(() => {
        assert.fail();
      });

      store.dispatch({
        type: 'GRAPH',
        data: {fa: 'bar'}
      });

      store.dispatch({
        type: 'GRAPH',
        data: {foo: 'buz'}
      });

      store.dispatch({
        type: 'GRAPH',
        batchPurge: true
      });
      setTimeout(done, 2);
    });


    it('work with a custom merger', function (done) {

      const store = createStore(reducify(
        {
          "GRAPH": (state, action) => action.stuff
        }
        ), {},
        applyMiddleware(batchMiddleware({
          "GRAPH": {merge: (action, part) => ({...action, ...part, stuff: {...action.stuff, ...part.stuff}})}
        }))
      );

      const expectedStates = [
        {fa: 'bar', foo: 'buz'},
        {fa: 'bar1', foo: 'buz2'}
      ];

      store.subscribe(() => {
        const state = store.getState();
        assert.deepEqual(state, expectedStates.shift());
      });

      store.dispatch({
        type: 'GRAPH',
        stuff: {fa: 'bar'}
      });

      store.dispatch({
        type: 'GRAPH',
        stuff: {foo: 'buz'}
      });
      setTimeout(done, 1);


    });

    it('work with a custom merger short', function (done) {

      const store = createStore(reducify(
        {
          "GRAPH": (state, action) => action.stuff
        }
        ), {},
        applyMiddleware(batchMiddleware({
          "GRAPH": (action, part) => ({...action, ...part, stuff: {...action.stuff, ...part.stuff}})
        }))
      );

      const expectedStates = [
        {fa: 'bar', foo: 'buz'},
        {fa: 'bar1', foo: 'buz2'}
      ];

      store.subscribe(() => {
        const state = store.getState();
        assert.deepEqual(state, expectedStates.shift());
      });

      store.dispatch({
        type: 'GRAPH',
        stuff: {fa: 'bar'}
      });

      store.dispatch({
        type: 'GRAPH',
        stuff: {foo: 'buz'}
      });
      setTimeout(done, 1);


    });

    it('work with a custom merger injected', function (done) {

      const store = createStore(reducify(
        {
          "GRAPH": (state, action) => action.stuff
        }
        ), {},
        applyMiddleware(batchMiddleware())
      );

      const expectedStates = [
        {fa: 'bar', foo: 'buz'},
        {fa: 'bar1', foo: 'buz2'}
      ];

      store.subscribe(() => {
        const state = store.getState();
        assert.deepEqual(state, expectedStates.shift());
      });

      store.dispatch({
        type: 'GRAPH',
        stuff: {fa: 'bar'},
        batch: (action, part) => ({...action, ...part, stuff: {...action.stuff, ...part.stuff}})
      });

      store.dispatch({
        type: 'GRAPH',
        stuff: {foo: 'buz'},
        batch: (action, part) => ({...action, ...part, stuff: {...action.stuff, ...part.stuff}})
      });
      setTimeout(done, 1);


    });

    it('observes custom ticks', function (done) {

      const store = createStore(reducify(
        {
          "GRAPH": (state, action) => action.stuff
        }
        ), {},
        applyMiddleware(batchMiddleware({tick: _.noop}))
      );

      const expectedStates = [
        {fa: 'bar', foo: 'buz'},
        {fa: 'bar1', foo: 'buz2'}
      ];

      store.subscribe(() => {
        const state = store.getState();
        assert.notDeepEqual(state, expectedStates.shift());
      });

      store.dispatch({
        type: 'GRAPH',
        stuff: {fa: 'bar'},
        batch: (action, part) => ({...action, ...part, stuff: {...action.stuff, ...part.stuff}})
      });

      store.dispatch({
        type: 'GRAPH',
        stuff: {foo: 'buz'},
        batch: (action, part) => ({...action, ...part, stuff: {...action.stuff, ...part.stuff}})
      });
      setTimeout(done, 1);


    });

    it('works with custom finalize', function () {

      const store = createStore(reducify(
        {
          "GRAPH": (state, action) => ({...action.data})
        }
        ), {},
        applyMiddleware(batchMiddleware({
          "GRAPH": true,
          finalize: state => ({...state, data: {...state.data, hi: 'mom'}})
        }))
      );

      const expectedStates = [
        {fa: 'bar', foo: 'buz', fun: 'bas', hi: 'mom'}
      ];

      store.subscribe(() => {
        const state = store.getState();
        assert.deepEqual(state, expectedStates.shift());
      });

      store.dispatch({
        type: 'GRAPH',
        data: {fa: 'bar'}
      });

      store.dispatch({
        type: 'GRAPH',
        data: {foo: 'buz'}
      });

      store.dispatch({
        type: 'GRAPH',
        data: {fun: 'bas'},
        batchComplete: true
      });
    });

    it('works with custom finalize short', function () {

      const store = createStore(reducify(
        {
          "GRAPH": (state, action) => action
        }
        ), {},
        applyMiddleware(batchMiddleware({
          "GRAPH": true
        }))
      );

      const expectedStates = [
        {data: {fa: 'bar', foo: 'buz', fun: 'bas'}, hi: 'mom', type: 'GRAPH'}
      ];

      store.subscribe(() => {
        const state = store.getState();
        assert.deepEqual(state, expectedStates.shift());
      });

      store.dispatch({
        type: 'GRAPH',
        data: {fa: 'bar'}
      });

      store.dispatch({
        type: 'GRAPH',
        data: {foo: 'buz'}
      });

      store.dispatch({
        type: 'GRAPH',
        data: {fun: 'bas'},
        batchComplete: state => ({...state, hi: 'mom'})
      });
    });



  });
}
