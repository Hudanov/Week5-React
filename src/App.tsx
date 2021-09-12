import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Landing from './component/Landing';
import Login from './component/Login';
import Forecast from './component/Forecast';
import ProtectedRoute from './utils/ProtectedRoute';
import { AuthContext, Auth } from './utils/userAuth';

export default function App(): JSX.Element {
    return (
      <AuthContext.Provider value={new Auth()}>
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute path="/forecast" redirectTo="/login">
            <Forecast />
          </ProtectedRoute>
          <Route path="/" component={Landing} />
        </Switch>
      </AuthContext.Provider>
    );
}