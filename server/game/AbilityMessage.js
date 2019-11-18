class AbilityMessage {
    static create(formatOrProperties) {
        class NullValue {
            output() {
                // no-op.
            }
        }

        class FunctionAdapter {
            constructor(outputFunc) {
                this.outputFunc = outputFunc;
            }

            output(outputter, context) {
                this.outputFunc(context);
            }
        }

        if(!formatOrProperties) {
            return new NullValue();
        }

        if(typeof (formatOrProperties) === 'function') {
            return new FunctionAdapter(formatOrProperties);
        }

        if(typeof (formatOrProperties) === 'string') {
            return new AbilityMessage({ format: formatOrProperties });
        }

        return new AbilityMessage(formatOrProperties);
    }

    constructor(properties) {
        this.fullMessage = properties.fullMessage || false;
        this.args = this.createArgs(properties.format, properties.args || {});
        this.format = this.translateNamedArgs(properties.format, this.args);
        this.type = properties.type || 'message';

        this.validateNamedArgs(properties.format, this.args);
    }

    translateNamedArgs(format, args) {
        let result;
        let index = 0;

        if(this.fullMessage) {
            result = format;
        } else {
            result = `{player} uses {source} to ${format}`;
        }

        for(let arg of args) {
            result = result.replace(new RegExp(`\\{${arg.name}\\}`, 'g'), `{${index}}`);
            ++index;
        }

        return result;
    }

    validateNamedArgs(format, args) {
        let definedArgNames = args.map(arg => arg.name);
        let usedArgNames = this.getUsedArgNames(format);
        let undefinedArgNames = usedArgNames.filter(argName => !definedArgNames.includes(argName));

        if(undefinedArgNames.length !== 0) {
            throw new Error(`Undefined argument names for ability message: ${undefinedArgNames.join(', ')}`);
        }
    }

    getUsedArgNames(format) {
        let result = [];
        let namedArgRegex = /{(\w+)}/g;
        let match;

        while((match = namedArgRegex.exec(format)) !== null) {
            result.push(match[1]);
        }

        return result;
    }

    createArgs(format, customArgsHash) {
        const standardArgs = [
            { name: 'player', getValue: context => context.player },
            { name: 'source', getValue: context => context.source },
            { name: 'target', getValue: context => context.target }
        ];
        const optionalArgs = this.getOptionalArgs(format);
        const targetSelectionArgs = this.getTargetSelectionArgs(format);
        const customArgs = Object.entries(customArgsHash).map(([name, getValue]) => ({ name, getValue }));

        return standardArgs.concat(optionalArgs).concat(targetSelectionArgs).concat(customArgs);
    }

    getOptionalArgs(format) {
        const optionalArgTypes = [
            { name: 'opponent', getValue: context => context.player.opponent },
            { name: 'chosenPlayer', getValue: context => context.chosenPlayer },
            { name: 'searchTarget', getValue: context => context.searchTarget }
        ];

        return optionalArgTypes.filter(argType => format.includes(`{${argType.name}}`));
    }

    getTargetSelectionArgs(format) {
        let args = [];
        let regex = /{targetSelection\.(\w+)}/g;
        let match;
        while((match = regex.exec(format)) !== null) {
            let property = match[1];
            args.push({
                name: `targetSelection.${property}`,
                getValue: context => context.currentTargetSelection && context.currentTargetSelection[property]
            });
        }

        return args;
    }

    output(outputter, context) {
        let args = this.generateArgValues(context);

        if(this.type === 'message') {
            outputter.addMessage(this.format, ...args);
        } else {
            outputter.addAlert(this.type, this.format, ...args);
        }
    }

    generateArgValues(context) {
        return this.args.map(arg => arg.getValue(context));
    }
}

module.exports = AbilityMessage;
