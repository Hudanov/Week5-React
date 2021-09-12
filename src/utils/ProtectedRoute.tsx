import { Redirect, Route, RouteProps } from 'react-router-dom';
import { UserAuth } from './userAuth';

type ProtectedRouteProps = {
  redirectTo: string;
} & RouteProps;

export default function ProtectedRoute({ redirectTo, ...routeProps }: ProtectedRouteProps) {
  const auth = UserAuth();

  if (auth.isAuthenticated) {
    return <Route {...routeProps} />
  }
  else {
    return <Redirect to={{ pathname: redirectTo }} />
  }
}