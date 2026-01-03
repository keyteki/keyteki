describe('Ley, Earl of Hurl', function () {
    describe("Ley, Earl of Hurl's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['umbra', 'ley-earl-of-hurl', 'old-bruno']
                },
                player2: {
                    inPlay: ['troll']
                }
            });

            this.leyEarlOfHurl.tokens.damage = 1;
        });

        it('should be moved/exhausted/warded/healed on destroy when not on a flank', function () {
            this.player1.fightWith(this.leyEarlOfHurl, this.troll);
            this.player1.clickPrompt('Right');
            expect(this.leyEarlOfHurl.tokens.damage).toBe(undefined);
            expect(this.leyEarlOfHurl.exhausted).toBe(true);
            expect(this.leyEarlOfHurl.warded).toBe(true);
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.leyEarlOfHurl);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should do nothing on destroy when on a flank', function () {
            this.player1.moveCard(this.umbra, 'discard');
            this.player1.fightWith(this.leyEarlOfHurl, this.troll);
            expect(this.leyEarlOfHurl.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should be moved/exhausted/warded/healed by opponent on destroy when not on a flank', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.leyEarlOfHurl);
            this.player2.clickPrompt('Right');
            expect(this.leyEarlOfHurl.tokens.damage).toBe(undefined);
            expect(this.leyEarlOfHurl.exhausted).toBe(true);
            expect(this.leyEarlOfHurl.warded).toBe(true);
            expect(this.player1.player.creaturesInPlay[2]).toBe(this.leyEarlOfHurl);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
