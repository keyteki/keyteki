describe('Ghost Tree', function () {
    describe("Ghost Tree's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['ghost-tree', 'fertility-chant'],
                    discard: new Array(9).fill('poke'), // not yet haunted
                    deck: ['poke', 'poke', 'poke', 'poke', 'poke']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.player1.chains = 36;
        });

        it('deals fight damage when not haunted', function () {
            this.player1.playCreature(this.ghostTree);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.ghostTree);
            expect(this.troll.location).toBe('discard');
        });

        it('deals no fight damage when haunted', function () {
            this.player1.playCreature(this.ghostTree);
            this.player1.play(this.fertilityChant);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.ghostTree);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.damage).toBe(0);
        });

        it('discards 5 cards from deck on scrap', function () {
            expect(this.player1.player.discard.length).toBe(9);
            this.player1.scrap(this.ghostTree);
            expect(this.player1.player.discard.length).toBe(15);
        });
    });
});
