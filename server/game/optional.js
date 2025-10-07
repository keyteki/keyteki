import _ from 'underscore';

class Optional {}

Optional.EvalOptional = function (context, optional) {
    if (_.isFunction(optional)) {
        return optional(context);
    }
    return !!optional;
};

export default Optional;
