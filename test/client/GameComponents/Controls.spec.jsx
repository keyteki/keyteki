/* eslint-disable no-unused-vars */
/* global describe, it, expect, beforeEach, window, document */
/* eslint camelcase: 0, no-invalid-this: 0 */

import Controls from '../../../client/GameComponents/Controls.jsx';
import ReactDOM from 'react-dom';
import React from 'react';
import TestUtils from 'react-dom/test-utils';

describe('The <Controls /> component', () => {
    describe('when rendered on a large screen with active player', () => {
        window.innerWidth = 1920;

        let component = ReactDOM.render(
            <Controls
                showManualMode={true}
            />,
            document.createElement('div')
        );

        it('should render three buttons with labels', () => {
            const buttons = TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn');

            expect(buttons.length).toBe(3);
            expect(buttons[0].innerText).toBe(' Toggle Chat');
            expect(buttons[1].innerText).not.toBeFalsy();
            expect(buttons[2].innerText).toBe(' Settings');
        });
    });

    describe('when rendered on a small screen with active player', () => {
        window.innerWidth = 1366;

        let component = ReactDOM.render(
            <Controls
                showManualMode={true}
            />,
            document.createElement('div')
        );

        it('should render three buttons with labels', () => {
            const buttons = TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn');

            expect(buttons.length).toBe(3);
            expect(buttons[0].innerText).toBe('');
            expect(buttons[1].innerText).toBe('');
            expect(buttons[2].innerText).toBe('');
        });
    });

    describe('when rendered on a large screen with spectator', () => {
        window.innerWidth = 1920;

        let component = ReactDOM.render(
            <Controls
                showManualMode={false}
            />,
            document.createElement('div')
        );

        it('should render two buttons with labels', () => {
            const buttons = TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn');

            expect(buttons.length).toBe(2);
            expect(buttons[0].innerText).toBe(' Toggle Chat');
            expect(buttons[1].innerText).toBe(' Settings');
        });
    });

    describe('when rendered on a small screen with spectator', () => {
        window.innerWidth = 1366;

        let component = ReactDOM.render(
            <Controls
                showManualMode={false}
            />,
            document.createElement('div')
        );

        it('should render two buttons without labels', () => {
            const buttons = TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn');

            expect(buttons.length).toBe(2);
            expect(buttons[0].innerText).toBe('');
            expect(buttons[1].innerText).toBe('');
        });
    });

    describe('when manual mode is on', () => {
        let component = ReactDOM.render(
            <Controls
                showManualMode={true}
                manualModeEnabled={true}
            />,
            document.createElement('div')
        );

        it('the manual mode button should have class `manual`', () => {
            const buttons = TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn');

            expect(buttons.length).toBe(3);
            expect(buttons[1].classList.contains('auto')).toBeFalsy();
            expect(buttons[1].classList.contains('manual')).toBeTruthy();
        });
    });

    describe('when manual mode is off', () => {
        let component = ReactDOM.render(
            <Controls
                showManualMode={true}
            />,
            document.createElement('div')
        );

        it('the manual mode button should have class `auto`', () => {
            const buttons = TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn');

            expect(buttons.length).toBe(3);
            expect(buttons[1].classList.contains('auto')).toBeTruthy();
            expect(buttons[1].classList.contains('manual')).toBeFalsy();
        });
    });
});
