import React from 'react';
import { shallow } from 'enzyme';
import RadioGroup from './RadioGroup';
import RadioButton from './RadioButton';

describe('The RadioGroup component', () => {
    let buttons;

    beforeEach(() => {
        buttons = [];
    });

    test('renders without crashing', () => {
        shallow(<RadioGroup buttons={ buttons }/>);
    });

    test('renders no radio buttons when none are passed in', () => {
        let wrapper = shallow(<RadioGroup buttons={ buttons } />);

        expect(wrapper.find(RadioButton).length).toEqual(0);
    });

    describe('when one button is passed in', () => {
        let wrapper;

        beforeEach(() => {
            buttons = [];
            buttons.push({ value: 'test', label: 'Test Button' });

            wrapper = shallow(<RadioGroup buttons={ buttons } />);
        });

        test('a button is rendered with the correct properties', () => {
            let radioButtons = wrapper.find(RadioButton);
            expect(radioButtons.length).toEqual(1);

            let firstButton = radioButtons.first();
            expect(firstButton.prop('label')).toEqual('Test Button');
        });

        describe('and a button is clicked', () => {
            beforeEach(() => {
                wrapper = shallow(<RadioGroup buttons={ buttons } />);
                wrapper.find(RadioButton).prop('onClick')();
            });

            describe('and a callback is not specified', () => {
                test('it does not crash', () => {});
            });

            describe('and a callback is specified', () => {
                const onValueSelected = jest.fn();
                beforeEach(() => {
                    wrapper = shallow(<RadioGroup buttons={ buttons } onValueSelected={ onValueSelected } />);
                    wrapper.find(RadioButton).first().prop('onClick')();
                });

                test('the selected event is raised', () => {
                    expect(onValueSelected).toHaveBeenCalled();
                });
            });

            test('the button is set to selected', () => {
                let button = wrapper.find(RadioButton);

                expect(button.prop('selected')).toEqual(true);
            });

            describe('and is clicked again', () => {
                test('when a button is clicked twice it is still selected', () => {
                    wrapper.find(RadioButton).first().prop('onClick')();
                    let button = wrapper.find(RadioButton);

                    expect(button.prop('selected')).toEqual(true);
                });
            });
        });
    });

    describe('when multiple buttons are passed in', () => {
        let wrapper;

        beforeEach(() => {
            buttons = [];
            buttons.push({ value: 'test', label: 'Test Button' });
            buttons.push({ value: 'test2' });
            buttons.push({ value: 'test3' });

            wrapper = shallow(<RadioGroup buttons={ buttons } />);
        });

        test('all of the buttons are rendered', () => {
            let radioButtons = wrapper.find(RadioButton);
            expect(radioButtons.length).toEqual(3);
        });

        describe('and a button is clicked', () => {
            beforeEach(() => {
                wrapper.find(RadioButton).first().prop('onClick')();
            });

            test('the button is selected', () => {
                let button = wrapper.find(RadioButton).first();

                expect(button.prop('selected')).toEqual(true);
            });

            test('the other buttons are not selected', () => {
                let buttons = wrapper.find(RadioButton);

                let button2 = buttons.at(1);
                let button3 = buttons.at(2);

                expect(button2.prop('selected')).toEqual(false);
                expect(button3.prop('selected')).toEqual(false);
            });
        });
    });
});
