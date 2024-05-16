import EmailConfirm from './components/EmailConfirm/EmailConfirm';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import RestorePassword from './components/RestorePassword/RestorePassword';
import Restore from './components/Restore/Restore';
import Home from './pages/HomePage';
import Error from './components/Error/Error'
import PrivateRoute from "./PrivateRoute";
import { Navigate } from 'react-router-dom';

const AppRoutes = [
  {
    path: '/im',
    element: <PrivateRoute><Home /></PrivateRoute>
  },
  {
    path: '/login',
    element: <PrivateRoute><Login /></PrivateRoute>
  },
  {
    path: '/register',
    element: <PrivateRoute><Register /></PrivateRoute>
  },
  {
    path: '/emailconfirm',
    element: <PrivateRoute><EmailConfirm /></PrivateRoute>
  },
  {
    path: '/restorepassword',
    element: <PrivateRoute><RestorePassword /></PrivateRoute>
  },
  {
    path: '/restore',
    element: <PrivateRoute><Restore /></PrivateRoute>
  },
  {
    path: '/',
    element: <Navigate to="/im"/>
  },
  {
    path: '/home',
    element: <Navigate to="/im"/>
  },
  {
    path: '/error',
    element: <Error />
  }
];
export default AppRoutes;
