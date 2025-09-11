describe('Cryptic Collapse', function () {
    describe("Cryptic Collapse's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['cryptic-collapse', 'ember-imp', 'parasitic-arachnoid'],
                    inPlay: ['charette']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'dust-pixie']
                }
            });
        });

        it('should discard hand and make enemy creatures capture amber', function () {
            this.player1.play(this.crypticCollapse);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player2).not.toBeAbleToSelect(this.charette);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.dustPixie);
            expect(this.troll.amber).toBe(1);
            expect(this.dustPixie.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not capture amber if no cards in hand', function () {
            this.player1.scrap(this.emberImp);
            this.player1.scrap(this.parasiticArachnoid);
            this.player1.play(this.crypticCollapse);
            expect(this.troll.amber).toBe(0);
            expect(this.dustPixie.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
