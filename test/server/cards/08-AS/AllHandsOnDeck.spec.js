describe('All Hands on Deck', function () {
    describe("All Hands on Deck's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['all-hands-on-deck', 'a-strong-feeling'],
                    inPlay: ['echofly', 'plow-sword'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll', 'hunting-witch']
                }
            });
        });

        it('deals 3 damage to a creature if not haunted', function () {
            this.player1.play(this.allHandsOnDeck);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.plowSword);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys a creature if haunted', function () {
            this.player1.scrap(this.aStrongFeeling);
            this.player1.play(this.allHandsOnDeck);
            expect(this.player1).toBeAbleToSelect(this.echofly);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.plowSword);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
