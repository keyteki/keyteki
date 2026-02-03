let navigateRef = null;

export function setNavigate(navigate) {
    navigateRef = navigate;
}

export function routerNavigate(path, options) {
    if (!navigateRef) {
        return false;
    }

    navigateRef(path, options);
    return true;
}
