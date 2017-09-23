/*global beforeEach, afterEach, spyOn */
import React from 'react';

var container = document.createElement('div');
container.id = 'component';

document.body.appendChild(container);

var stubComponent = function(componentClass) {
    var originalPropTypes;

    beforeEach(function() {
        originalPropTypes = componentClass.propTypes;

        componentClass.propTypes = {};

        spyOn(componentClass.prototype, 'render').and.returnValue(<div />);
        if(componentClass.prototype.componentWillMount) {
            spyOn(componentClass.prototype, 'componentWillMount').and.returnValue(null);
        }

        if(componentClass.prototype.componentDidMount) {
            spyOn(componentClass.prototype, 'componentDidMount').and.returnValue(null);
        }

        if(componentClass.prototype.componentWillReceiveProps) {
            spyOn(componentClass.prototype, 'componentWillReceiveProps').and.returnValue(null);
        }

        if(componentClass.prototype.shouldComponentUpdate) {
            spyOn(componentClass.prototype, 'shouldComponentUpdate').and.returnValue(null);
        }

        if(componentClass.prototype.componentWillUpdate) {
            spyOn(componentClass.prototype, 'componentWillUpdate').and.returnValue(null);
        }

        if(componentClass.prototype.componentDidUpdate) {
            spyOn(componentClass.prototype, 'componentDidUpdate').and.returnValue(null);
        }

        if(componentClass.prototype.componentWillUnmount) {
            spyOn(componentClass.prototype, 'componentWillUnmount').and.returnValue(null);
        }
    });

    afterEach(function() {
        componentClass.propTypes = originalPropTypes;
    });
};

export default stubComponent;
