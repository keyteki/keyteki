const _ = require('underscore');

class Optional {}

Optional.EvalOptional = function (context, optional) {
    if (_.isFunction(optional)) {
        return optional(context);
    }
    return !!optional;
};

module.exports = Optional;
