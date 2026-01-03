describe('Belcher', function () {
    describe("Belcher's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: [
                        'the-warchest',
                        'anger',
                        'blood-of-titans',
                        'ganger-chieftain',
                        'urchin'
                    ],
                    inPlay: ['belcher', 'troll']
                },
                player2: {
                    inPlay: ['mother', 'krump']
                }
            });
        });

        it('works with a creature in the deck', function () {
            this.player1.moveCard(this.urchin, 'deck');
            this.player1.moveCard(this.gangerChieftain, 'deck');
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.bloodOfTitans, 'deck');
            this.player1.moveCard(this.theWarchest, 'deck');

            this.player1.useAction(this.belcher);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(5);
            expect(this.urchin.location).toBe('deck');
            expect(this.anger.location).toBe('discard');
            expect(this.bloodOfTitans.location).toBe('discard');
            expect(this.theWarchest.location).toBe('discard');
            expect(this.gangerChieftain.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('does not work with no creatures in the deck', function () {
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.bloodOfTitans, 'deck');
            this.player1.moveCard(this.theWarchest, 'deck');

            this.player1.useAction(this.belcher);
            expect(this.anger.location).toBe('discard');
            expect(this.bloodOfTitans.location).toBe('discard');
            expect(this.theWarchest.location).toBe('discard');
            expect(this.player1.player.deck.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
