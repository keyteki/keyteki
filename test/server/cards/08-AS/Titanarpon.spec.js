describe('Titanarpon', function () {
    describe("Titanarpon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    token: 'facet',
                    inPlay: ['titanarpon'],
                    hand: ['dust-imp', 'gub', 'dominator-bauble', 'unbinding']
                },
                player2: {
                    amber: 3,
                    hand: ['troll']
                }
            });

            this.titanarpon.printedHouse = 'dis';
            this.titanarpon.maverick = 'dis';
        });

        it('should allow first creature played to come in ready', function () {
            this.player1.playCreature(this.dustImp);
            expect(this.dustImp.exhausted).toBe(false);
            this.player1.playCreature(this.gub);
            expect(this.gub.exhausted).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.playCreature(this.troll);
            expect(this.troll.exhausted).toBe(true);
            this.expectReadyToTakeAction(this.player2);
        });

        it('should make itself enter play ready if first', function () {
            this.player1.moveCard(this.titanarpon, 'hand');
            this.player1.playCreature(this.titanarpon);
            expect(this.titanarpon.exhausted).toBe(false);
            this.player1.playCreature(this.gub);
            expect(this.gub.exhausted).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not make itself enter play ready if second', function () {
            this.player1.moveCard(this.titanarpon, 'hand');
            this.player1.playCreature(this.gub);
            expect(this.gub.exhausted).toBe(true);
            this.player1.playCreature(this.titanarpon);
            expect(this.titanarpon.exhausted).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not ready token creatures', function () {
            this.player1.play(this.unbinding);
            this.player1.clickPrompt('Left');
            let tokenCreature = this.player1.inPlay[0];
            expect(tokenCreature.isToken()).toBe(true);
            expect(tokenCreature.exhausted).toBe(true);
            this.player1.playCreature(this.gub);
            expect(this.gub.exhausted).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not ready an artifact', function () {
            this.player1.play(this.dominatorBauble);
            expect(this.dominatorBauble.exhausted).toBe(true);
            this.player1.playCreature(this.gub);
            expect(this.gub.exhausted).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
