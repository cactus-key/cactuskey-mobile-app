import { createStore, combineReducers } from 'redux';
// import auth from './reducers/auth';
// import modals from './reducers/modals';
import settings from './reducers/settings';

import { persistStore, persistReducer } from "redux-persist";
import { AsyncStorage }                 from "react-native";



const persistConfig = {
    key: "root",
    storage: AsyncStorage
};

const rootReducer = combineReducers({ settings });

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);

const getPersistor = () => persistor;
const getStore = () => store;
const getState = () => {
    return store.getState();
};
export {
    getStore,
    getState,
    getPersistor
};
export default {
    getStore,
    getState,
    getPersistor
}