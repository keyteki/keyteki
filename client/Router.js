import React from 'react';
import toRegex from 'path-to-regexp';
import queryString from 'query-string';

import routes from './routes';
import NotFound from './pages/NotFound';
import Unauthorised from './pages/Unauthorised';

class Router {
    constructor() {
        this.routes = routes;
    }

    matchUri(path, uri) {
        const keys = [];
        const pattern = toRegex(path, keys);
        const match = pattern.exec(uri);

        if (!match) {
            return undefined;
        }

        let params = {};

        for (let i = 1; i < match.length; i++) {
            params[keys[i - 1].name] = match[i] !== undefined ? match[i] : undefined;
        }

        let parsedString = queryString.parse(location.search);

        params = Object.assign(params, parsedString);

        return params;
    }

    resolvePath(context) {
        for (const route of this.routes) {
            const uri = context.pathname;
            const params = this.matchUri(route.path, uri);

            if (!params) {
                continue;
            }

            const result = route.action({ ...context, params });

            if (!result) {
                continue;
            }

            if (
                route.permission &&
                (!context.user || !context.user.permissions[route.permission])
            ) {
                return <Unauthorised />;
            }

            return result;
        }

        return <NotFound />;
    }
}

export default Router;
