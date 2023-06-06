import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TreeViewHeader from '../header/TreeViewHeader';

interface CostomRouteProps {
    isAuthenticated: boolean;
    type: string;
    path: string;
    component: any;
}

function CostomRoute({ isAuthenticated, type = 'public', path, component: Component }: CostomRouteProps) {
    if (type === 'private') {
        return (
            <Routes>
                <Route
                    path={path}
                    element={
                        isAuthenticated ? (
                            <>
                                <TreeViewHeader />
                                <Component />
                            </>
                        ) : (
                            <Navigate to='/signin'/>
                        )
                    }
                />
            </Routes>
        )
    } else {
        return (
            <Routes>
                <Route path={path}
                    element={
                        !isAuthenticated ? (
                            <Component />
                        ) : (
                            <Navigate to='/' />
                        )
                    }
                />
            </Routes>
        )
    }
}

export default CostomRoute;
