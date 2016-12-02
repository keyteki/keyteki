/* global describe, it, expect, beforeEach, afterEach jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

import Card from '../../client/GameComponents/Card.jsx';
import ReactDOM from 'react-dom';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

describe('the <Card /> component', function() {
    beforeEach(function() {
        this.node = document.createElement('div');

        this.card = {
            code: '00001',
            name: 'Test Card'
        };

        this.spy = jasmine.createSpyObj('spy', ['onMouseOver', 'onMouseOut', 'onClick']);

        this.component = ReactDOM.render(<Card card={{}} source='hand' />, this.node);
    });

    describe('when initially rendered', function() {
        it('should show a facedown card with a card back rendered', function() {
            var cardImage = TestUtils.findRenderedDOMComponentWithTag(this.component, 'img');
            
            expect(cardImage.src.indexOf('/img/cards/cardback.jpg')).not.toBe(-1);
        });
    });

    describe('when rendered with a card', function() {
        beforeEach(function() {
            this.component = ReactDOM.render(<Card card={this.card} source='hand' />, this.node);   
        });

        describe('that is selected', function() {
            beforeEach(function() {
                this.card.selected = true;
                this.component = ReactDOM.render(<Card card={this.card} source='hand' />, this.node);
            });
            
            afterEach(function() {
                this.card.selected = undefined;
            });

            describe('and also new', function() {
                beforeEach(function() {
                    this.card.selected = true;
                    this.component = ReactDOM.render(<Card card={this.card} source='hand' />, this.node);
                });

                it('should flag as selected and not new', function() {
                    var selectedClass = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'selected');
                    expect(selectedClass.length).not.toBe(0);

                    var newClass = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'new');
                    expect(newClass.length).toBe(0);
                });
            });

            it('should mark the card as selected', function() {
                var selectedClass = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'selected');

                expect(selectedClass.length).not.toBe(0);
            });
        });

        describe('that is new', function() {
            beforeEach(function() {
                this.card.new = true;

                this.component = ReactDOM.render(<Card card={this.card} source='hand' />, this.node);
            });

            afterEach(function() {
                this.card.new = undefined;
            });

            it('should mark the card as new', function() {
                var newClass = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'new');

                expect(newClass.length).not.toBe(0);
            });
        });

        describe('that is facedown', function() {
            beforeEach(function() {
                this.card.facedown = true;

                this.component = ReactDOM.render(<Card card={this.card} source='hand' />, this.node);
            });

            afterEach(function() {
                this.card.facedown = undefined;
            });

            it('should show a facedown image', function() {
                var cardImage = TestUtils.findRenderedDOMComponentWithTag(this.component, 'img');

                expect(cardImage.src.indexOf('/img/cards/00001.png')).toBe(-1);
                expect(cardImage.src.indexOf('/img/cards/cardback.jpg')).not.toBe(-1);
            });
        });

        it('should show the card image and name', function() {
            var cardImage = TestUtils.findRenderedDOMComponentWithTag(this.component, 'img');
            var cardLabel = TestUtils.findRenderedDOMComponentWithClass(this.component, 'card-name');
            
            expect(cardImage.src.indexOf('/img/cards/00001.png')).not.toBe(-1);
            expect(cardLabel.innerText).toBe(this.card.name);
        });

        describe('that is kneeled', function() {
            beforeEach(function() {
                this.card.kneeled = true;

                this.component = ReactDOM.render(<Card card={this.card} source='hand' />, this.node);
            });

            afterEach(function() {
                this.card.kneeled = undefined;
            });

            it('should add the kneeled styling to the card', function() {
                var kneeledClass = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'horizontal-card');
                expect(kneeledClass.length).not.toBe(0);

                // var verticalClass = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'vertical');
                // expect(verticalClass.length).not.toBe(0);
            });            
        });
    });

    describe('when moused over', function() {
        describe('and mouseover is disabled', function() {
            beforeEach(function() {
                this.component = ReactDOM.render(<Card card={this.card} source='hand' disableMouseOver onMouseOver={this.spy.onMouseOver} onMouseOut={this.spy.onMouseOut} />, this.node);
                this.cardDiv = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'card')[0];

                TestUtils.Simulate.mouseOver(this.cardDiv);
            });

            it('should not call the mouse over handler', function() {
                expect(this.spy.onMouseOver).not.toHaveBeenCalled();
            });
        });

        describe('and mouseover is not disabled', function() {
            beforeEach(function() {
                this.component = ReactDOM.render(<Card card={this.card} source='hand' onMouseOver={this.spy.onMouseOver} onMouseOut={this.spy.onMouseOut} />, this.node);
                this.cardDiv = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'card')[0];

                TestUtils.Simulate.mouseOver(this.cardDiv);
            });

            it('should call the mouse over handler', function() {
                expect(this.spy.onMouseOver).toHaveBeenCalled();
            });
        });
    });

    describe('when mouse out', function() {
        describe('and mouseover is disabled', function() {
            beforeEach(function() {
                this.component = ReactDOM.render(<Card card={this.card} source='hand' disableMouseOver onMouseOver={this.spy.onMouseOver} onMouseOut={this.spy.onMouseOut} />, this.node);
                this.cardDiv = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'card')[0];

                TestUtils.Simulate.mouseOut(this.cardDiv);
            });

            it('should not call the mouse out handler', function() {
                expect(this.spy.onMouseOut).not.toHaveBeenCalled();
            });
        });

        describe('and mouseover is not disabled', function() {
            beforeEach(function() {
                this.component = ReactDOM.render(<Card card={this.card} source='hand' onMouseOver={this.spy.onMouseOver} onMouseOut={this.spy.onMouseOut} />, this.node);
                this.cardDiv = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'card')[0];

                TestUtils.Simulate.mouseOut(this.cardDiv);
            });

            it('should call the mouse out handler', function() {
                expect(this.spy.onMouseOut).toHaveBeenCalled();
            });
        });
    });

    describe('when the card is clicked', function() {
        beforeEach(function() {
            this.component = ReactDOM.render(<Card card={this.card} source='hand' onMouseOver={this.spy.onMouseOver} onMouseOut={this.spy.onMouseOut} onClick={this.spy.onClick} />, this.node);
            this.cardDiv = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'card')[0];

            TestUtils.Simulate.click(this.cardDiv);
        });

        it('should call the on click handler with the card source', function() {
            expect(this.spy.onClick).toHaveBeenCalledWith('hand', this.card);
        });
    });

    describe('when card has power', function() {
        beforeEach(function() {
            this.card.power = 4;
            this.component = ReactDOM.render(<Card card={this.card} source='hand' />, this.node);          
        });

        afterEach(function() {
            this.card.power = undefined;
        });

        it('should render the power counters', function() {
            var counter = TestUtils.findRenderedDOMComponentWithClass(this.component, 'counter');

            expect(counter.innerText).toBe(this.card.power.toString());
            expect(counter.className).toBe('counter power');
        });
    });
    
    describe('when a card has strength matching its base strength', function() {
        beforeEach(function() {
            this.card.strength = 1;
            this.card.baseStrength = 1;

            this.component = ReactDOM.render(<Card card={this.card} source='hand' />, this.node);
        });

        it('should render no counters', function() {
            var counter = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'counter');

            expect(counter.length).toBe(0);
        });
    });

    describe('when a card has strength that does not match its base strength', function() {
        beforeEach(function() {
            this.card.strength = 1;
            this.card.baseStrength = 2;

            this.component = ReactDOM.render(<Card card={this.card} source='hand' />, this.node);
        });

        afterEach(function() {
            this.card.strength = undefined;
            this.card.baseStrength = undefined;
        });

        it('should render a counter for its current strength', function() {
            var counter = TestUtils.findRenderedDOMComponentWithClass(this.component, 'counter');

            expect(counter.innerText).toBe(this.card.strength.toString());
            expect(counter.className).toBe('counter strength');
        });
    });

    describe('when a card has dupes', function() {
        beforeEach(function() {
            this.card.dupes = [{}, {}];

            this.component = ReactDOM.render(<Card card={this.card} source='hand' />, this.node);
        });

        afterEach(function() {
            this.card.dupes = undefined;
        });

        it('should render a counter for the dupes', function() {
            var counter = TestUtils.findRenderedDOMComponentWithClass(this.component, 'counter');
            
            expect(counter.innerText).toBe('2');
            expect(counter.className).toBe('counter dupe');
        });
    });

    describe('when a card has other tokens', function() {
        beforeEach(function() {
            this.card.tokens = { 'poison': 1 }; 

            this.component = ReactDOM.render(<Card card={this.card} source='hand' />, this.node);
        });

        afterEach(function() {
            this.card.tokens = undefined;
        });

        it('should render the tokens', function() {
            var counter = TestUtils.findRenderedDOMComponentWithClass(this.component, 'counter');
            
            expect(counter.innerText).toBe('1');
            expect(counter.className).toBe('counter poison');            
        });
    });

    describe('when a card has multiple counters', function() {
        beforeEach(function() {
            this.card.tokens = { 'poison': 1 };
            this.card.power = 3;
            this.card.dupes = [{}, {}];

            this.component = ReactDOM.render(<Card card={this.card} source='hand' />, this.node);
        });

        afterEach(function() {
            this.card.tokens = undefined;
            this.card.power = undefined;
            this.card.dupes = undefined;
        });

        it('should render all of the counters', function() {
            var counters = TestUtils.scryRenderedDOMComponentsWithClass(this.component, 'counter');
            
            expect(counters.length).toBe(3);

            expect(counters[0].innerText).toBe(this.card.power.toString());
            expect(counters[0].className).toBe('counter power');
            expect(counters[1].innerText).toBe(this.card.dupes.length.toString());
            expect(counters[1].className).toBe('counter dupe');
            expect(counters[2].innerText).toBe(this.card.tokens.poison.toString());
            expect(counters[2].className).toBe('counter poison');
        });
    });
});
