import React from 'react';
import ReactDOM from 'react-dom';

// entry point
import App from './app_';

import {reMakeStore, store} from './UI/store/store';
import {Provider} from 'react-redux';


import { globals, lostConnection, portDidUpdate } from './UI/helpers/globals';
    

// awaits for the app to load the correct port
portDidUpdate.then(
    () => {
        console.log("[ROOT] RENDERING APP.");
        renderAPP();
    }
);

lostConnection.then(() => {
    // while we wait for backend
    renderNoConnection();
    // try to re-establish connection
    setInterval(
        () => {
            portDidUpdate.then(
                () => {
                    renderAPP();
                }
            );
        }
    , 2000);
})

const rootElement = (<div id="root"></div>);

let renderAPP = () => {
    if (document.querySelector('#root').length === 0)
    {
        document.querySelector('body').createElement(rootElement);
    }
    console.log('re-render of app')
    reMakeStore();
    console.log(store.getState())
    ReactDOM.render( 
        (<Provider store={store}>
            <App />
        </Provider>)
        , 
        document.getElementById('root'))
}

let renderNoConnection = () => {
    // while we wait for backend
    ReactDOM.render(
        (<h1>Waiting for connection ...</h1>)
        , 
        document.querySelector('#root'))
}

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

let rerenderAPP = () => {
    
    setTimeout(
        () => ipcRenderer.send('rerender'), 1500
    )
}

export {
    rerenderAPP
}