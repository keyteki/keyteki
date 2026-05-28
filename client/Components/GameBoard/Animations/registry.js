const registry = {};

export const registerAnimation = (type, { component, resolver }) => {
    registry[type] = { component, resolver };
};

export const getComponent = (type) => registry[type]?.component;

export const getResolver = (type) => registry[type]?.resolver;
