import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux';
import SignIn from './pages/signIn/SignIn';
import SignUp from './pages/signUp/SignUp';
import CostomRoute from './common/costomRoute/CostomRoute';
import DataWrapper from './layouts/dataWrapper/DataWrapper';
import RootContent from './pages/rootContent/RootContent';

function  Layout() {
    const isAuthenticated = useSelector((state: RootState) => state.authReducer.isAuthenticated);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path='/'
                    element={<Navigate to="/content" />}
                />
                <Route
                    path='/content/*'
                    element={
                        <CostomRoute
                            type='private'
                            path=''
                            component={ RootContent }
                            isAuthenticated={isAuthenticated}
                        />
                    }
                />
                <Route
                    path='/content/:id/*'
                    element={
                        <CostomRoute
                            type='private'
                            path=''
                            component={ DataWrapper }
                            isAuthenticated={isAuthenticated}
                        />
                    }
                />
                <Route
                    path='/signin/*'
                    element={
                        <CostomRoute
                            type={'public'}
                            path=''
                            component={ SignIn }
                            isAuthenticated={isAuthenticated}
                        />
                    }
                />
                <Route
                    path="/signup/*"
                    element={
                        <CostomRoute
                            type={'public'}
                            path=''
                            component={ SignUp }
                            isAuthenticated={isAuthenticated}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default Layout;
