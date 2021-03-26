import React from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteProps } from 'react-router-dom';

import AuthenticationPage from './pages/AuthenticationPage/AuthenticationPage'
import MovieListPage from './pages/MovieListPage/MovieListPage'

interface PrivateRouteProps {
    children: JSX.Element
    exact: boolean
    path: string
}

function PrivateRoute({ children, ...rest }: PrivateRouteProps) {
    const hasAuth = !!localStorage.getItem('user');
    
    return (
        <Route
            {...rest}
            render={({ location }: RouteProps) => {
                return hasAuth ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/auth",
                            state: { from: location }
                        }}
                    />
                )
            }}
        />
    )
}

export default function App() {
    return (
        <Router>
        <Route exact path="/auth">
          <AuthenticationPage />
        </Route>
        <PrivateRoute exact path="/">
          <MovieListPage />
        </PrivateRoute>
      </Router>
    )
}