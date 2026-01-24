describe('Infernal Terran', function () {
    describe("Infernal Terran's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: [
                        'infernal-terran',
                        'ember-imp',
                        'dew-faerie',
                        'dust-pixie',
                        'control-the-weak'
                    ],
                    discard: ['carrion-wyrm']
                },
                player2: {
                    amber: 4
                }
            });
        });

        it('should discard a card and steal an amber on play', function () {
            this.player1.playCreature(this.infernalTerran);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.controlTheWeak);
            this.player1.clickCard(this.dewFaerie);
            expect(this.dewFaerie.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard a card and steal an amber on reap', function () {
            this.player1.playCreature(this.infernalTerran);
            this.player1.clickCard(this.dewFaerie);
            this.infernalTerran.ready();
            this.player1.reap(this.infernalTerran);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal an amber when hand is empty', function () {
            this.player1.moveCard(this.emberImp, 'discard');
            this.player1.moveCard(this.dewFaerie, 'discard');
            this.player1.moveCard(this.dustPixie, 'discard');
            this.player1.moveCard(this.controlTheWeak, 'discard');
            this.player1.playCreature(this.infernalTerran);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard hand and steal amber on scrap', function () {
            this.player1.scrap(this.infernalTerran);
            expect(this.emberImp.location).toBe('discard');
            expect(this.dewFaerie.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.controlTheWeak.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard hand and steal amber on scrap when there is another scrap ability', function () {
            this.player1.moveCard(this.carrionWyrm, 'hand');
            this.player1.scrap(this.infernalTerran);
            this.player1.clickCard(this.carrionWyrm);
            expect(this.emberImp.location).toBe('discard');
            expect(this.dewFaerie.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.controlTheWeak.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
