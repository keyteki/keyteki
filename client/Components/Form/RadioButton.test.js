import React from 'react';
import { shallow } from 'enzyme';

import RadioButton from './RadioButton';

describe('The RadioButton component', () => {
    let wrapper;

    test('renders without crashing', () => {
        shallow(<RadioButton />);
    });

    describe('when the selected property is set', () => {

        beforeEach(() => {
            wrapper = shallow(<RadioButton selected />);
        });

        test('it should set the checked property', () => {
            expect(wrapper.find('input').prop('checked')).toEqual(true);
        });
    });

    describe('when the selected property is not set', () => {
        beforeEach(() => {
            wrapper = shallow(<RadioButton />);
        });

        test('it should set the checked property to false', () => {
            expect(wrapper.find('input').prop('checked')).toEqual(false);
        });
    });

    describe('when the button is clicked', () => {
        const onClick = jest.fn();

        beforeEach(() => {
            wrapper = shallow(<RadioButton onClick={ onClick }/>);

            wrapper.find('input').simulate('click');
        });

        test('it should raise the onClick handler', () => {
            expect(onClick).toHaveBeenCalled();
        });
    });
});
