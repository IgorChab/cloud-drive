import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from "react-redux";
import {store, persistor} from "./app/store";
import { PersistGate } from 'redux-persist/integration/react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import * as dotenv from 'dotenv'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <DndProvider backend={HTML5Backend}>
        <App/>
      </DndProvider>
    </PersistGate>
  </Provider>
);
