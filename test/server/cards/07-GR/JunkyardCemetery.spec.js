describe('Junkyard Cemetery', function () {
    describe("Junkyard Cemetery's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['junkyard-cemetery', 'echofly'],
                    discard: new Array(8).fill('poke').concat(['gub']) // not yet haunted
                },
                player2: {
                    hand: ['reclaimed-by-nature'],
                    inPlay: ['thing-from-the-deep'],
                    discard: ['flaxia']
                }
            });
            this.player1.chains = 36;
        });

        it('purges a card from discard', function () {
            this.player1.useAction(this.junkyardCemetery);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.poke);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).not.toBeAbleToSelect(this.echofly);
            this.player1.clickCard(this.gub);
            expect(this.gub.location).toBe('purged');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('counts purged cards for hauntedness', function () {
            expect(this.player1.player.isHaunted()).toBe(false);
            this.player1.useAction(this.junkyardCemetery);
            this.player1.clickCard(this.gub);
            this.player1.fightWith(this.echofly, this.thingFromTheDeep);
            expect(this.player1.player.discard.length).toBe(9);
            expect(this.player1.player.purged.length).toBe(1);
            expect(this.player1.player.isHaunted()).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player1.player.isHaunted()).toBe(true);
            this.player2.play(this.reclaimedByNature);
            this.player2.clickCard(this.junkyardCemetery);
            expect(this.player1.player.isHaunted()).toBe(false);
        });
    });
});
