describe('Hallowed Eve Festival', function () {
    describe("Hallowed Eve Festival's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['hallowed-eve-festival'],
                    inPlay: ['echofly', 'flaxia'],
                    discard: [
                        'shadys',
                        'purse-a-phone',
                        'full-moon',
                        'call-of-need',
                        'a-strong-feeling'
                    ]
                },
                player2: {
                    amber: 6,
                    inPlay: ['thing-from-the-deep']
                }
            });
            this.player1.moveCard(this.aStrongFeeling, 'deck');
            this.player1.moveCard(this.callOfNeed, 'deck');
            this.player1.moveCard(this.fullMoon, 'deck');
            this.player1.moveCard(this.purseAPhone, 'deck');
            this.player1.moveCard(this.shadys, 'deck');
        });

        it('discards 5 cards from the top of the players deck', function () {
            let p1deck = this.player1.player.deck.length;
            this.player1.play(this.hallowedEveFestival);
            expect(this.aStrongFeeling.location).toBe('discard');
            expect(this.callOfNeed.location).toBe('discard');
            expect(this.fullMoon.location).toBe('discard');
            expect(this.purseAPhone.location).toBe('discard');
            expect(this.shadys.location).toBe('discard');
            expect(this.player1.player.deck.length).toBe(p1deck - 5);
        });

        it('captures 1 amber for each discarded Geistoid card', function () {
            this.player1.play(this.hallowedEveFestival);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            this.player1.clickCard(this.echofly);
            this.player1.clickCard(this.echofly);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.echofly);
            expect(this.echofly.amber).toBe(3);
            expect(this.flaxia.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does nothing with no deck', function () {
            this.player1.player.deck = [];
            this.player1.play(this.hallowedEveFestival);
            expect(this.player2.amber).toBe(6);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
