describe('Double Doom', function () {
    describe("Double Doom's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['double-doom'],
                    inPlay: ['snag']
                },
                player2: {
                    inPlay: ['troll'],
                    hand: ['bad-penny']
                }
            });
            this.player1.play(this.doubleDoom);
        });
        it('prompt to target enemy creatures', function () {
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.snag);
        });

        describe('return an enemy creature', function () {
            beforeEach(function () {
                this.player1.clickCard(this.troll);
            });

            it('to hand and discard random card', function () {
                expect(this.player2.hand.length).toBe(1);
                expect(this.player2.discard.length).toBe(1);
            });
        });
    });

    describe('Play double doom with no enemy creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['double-doom'],
                    inPlay: ['snag']
                },
                player2: {
                    hand: ['bad-penny']
                }
            });
            this.player1.play(this.doubleDoom);
        });

        it('discard random card', function () {
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.badPenny.location).toBe('discard');
        });
    });
});
