/* eslint-disable no-unused-vars */
/* global describe, it, expect, beforeEach, window, document */
/* eslint camelcase: 0, no-invalid-this: 0 */

import ChatControls from '../../../client/GameComponents/ChatControls.jsx';
import ReactDOM from 'react-dom';
import React from 'react';
import TestUtils from 'react-dom/test-utils';

describe('The <ChatControls /> component', () => {
    describe('when rendered on a large screen', () => {
        let rendered;

        beforeEach(function() {
            window.innerWidth = 1920;
            rendered = TestUtils.findRenderedDOMComponentWithClass(
                ReactDOM.render(<ChatControls />, document.createElement('div')),
                'chat-controls'
            );
        });

        it('should render two buttons with labels', () => {
            expect(rendered.parentNode.innerHTML).toBe(getExpectedHtml(true));
        });
    });

    describe('when rendered on a small screen', () => {
        let rendered;

        beforeEach(function() {
            window.innerWidth = 1366;
            rendered = TestUtils.findRenderedDOMComponentWithClass(
                ReactDOM.render(<ChatControls />, document.createElement('div')),
                'chat-controls'
            );
        });

        it('should render two buttons without labels', () => {
            expect(rendered.parentNode.innerHTML).toBe(getExpectedHtml());
        });
    });
});

function getExpectedHtml(withLabels = false) {
    return `<div class="chat-controls panel">
                <button class="btn btn-transparent">
                    <span class="glyphicon glyphicon-menu-hamburger"></span>${withLabels ? ' Toggle Chat' : ''}
                </button>
                <button class="btn btn-transparent">
                    <span class="glyphicon glyphicon-cog"></span>${withLabels ? ' Settings' : ''}
                </button>
            </div>`.replace(/(\n\s*)/gi, '');
}
