describe('Phloxem Spewer', function () {
    describe("Phloxem Spewer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    inPlay: ['flaxia', 'phloxem-spewer', 'tunk']
                },
                player2: {
                    inPlay: ['troll', 'dust-pixie', 'groke', 'witch-of-the-eye']
                }
            });
        });

        it('has splash attack 2', function () {
            this.player1.fightWith(this.phloxemSpewer, this.dustPixie);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.groke.tokens.damage).toBe(2);
            expect(this.witchOfTheEye.tokens.damage).toBeUndefined();
        });

        it('gives Mars neighbor splash attack 2', function () {
            this.player1.fightWith(this.tunk, this.dustPixie);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.groke.tokens.damage).toBe(2);
            expect(this.witchOfTheEye.tokens.damage).toBeUndefined();
        });

        it('does not give non-Mars neighbor splash attack 2', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.flaxia, this.dustPixie);
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.groke.tokens.damage).toBeUndefined();
            expect(this.witchOfTheEye.tokens.damage).toBeUndefined();
        });
    });
});
