import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const withRouter = (Component) => {
    const WrappedComponent = (props) => {
        const location = useLocation();
        const navigate = useNavigate();
        const [searchParams] = useSearchParams();

        return React.createElement(Component, {
            ...props,
            location,
            navigate,
            searchParams
        });
    };

    const name = Component.displayName || Component.name || 'Component';
    WrappedComponent.displayName = `WithRouter(${name})`;

    return WrappedComponent;
};

export default withRouter;
