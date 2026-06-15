class Optional {}

Optional.EvalOptional = function (context, optional) {
    if (typeof optional === 'function') {
        return optional(context);
    }
    return !!optional;
};

module.exports = Optional;
