import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import './custom.css';
import NotFound from './components/NotFound/NotFound';

const App = () => {
  
  return (
      <Routes>
        {AppRoutes.map((route, index) => { 
          const { element, ...rest } = route;
          return (
            <Route 
              key={index} 
              {...rest} 
              element={element} 
            />
          );
        })}
        <Route path="*" element={<NotFound />}/>
      </Routes>
  );
}

export default App;