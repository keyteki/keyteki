describe('In Here Somewhere...', function () {
    describe("In Here Somehwere...'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['a-strong-feeling', 'in-here-somewhere…'],
                    discard: new Array(7).fill('poke').concat(['shadys', 'purse-a-phone']) // not yet haunted
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('discards top 5 of deck if not haunted', function () {
            let p1deck = this.player1.player.deck.length;
            this.player1.play(this['inHereSomewhere…']);
            expect(this.player1.deck.length).toBe(p1deck - Math.min(5, p1deck));
            expect(this.player1.discard.length).toBe(10 + Math.min(5, p1deck));
            this.expectReadyToTakeAction(this.player1);
        });

        it('archives 2 cards from discard if haunted', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.play(this['inHereSomewhere…']);
            expect(this.player1).toBeAbleToSelect(this.poke);
            expect(this.player1).toBeAbleToSelect(this.shadys);
            expect(this.player1).toBeAbleToSelect(this.purseAPhone);
            this.player1.clickCard(this.shadys);
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.purseAPhone);
            this.player1.clickPrompt('Done');
            expect(this.shadys.location).toBe('archives');
            expect(this.purseAPhone.location).toBe('archives');
            expect(this.player1.discard.length).toBe(9);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
