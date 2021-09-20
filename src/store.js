import { createStore } from 'redux';
import createRootReducer from './reducer';

export const store = createStore(createRootReducer(), window.devToolsExtension ? window.devToolsExtension() : f => f);
