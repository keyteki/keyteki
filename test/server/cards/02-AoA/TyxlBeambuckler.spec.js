describe('Tyxl Beambuckler', function () {
    describe("Tyxl Beambuckler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 0,
                    inPlay: ['zorg', 'lamindra'],
                    hand: ['tyxl-beambuckler']
                },
                player2: {
                    amber: 0,
                    inPlay: ['mighty-tiger', 'niffle-ape', 'hunting-witch', 'shadow-self'],
                    hand: []
                }
            });
        });

        it('should be able to target any creature', function () {
            this.player1.play(this.tyxlBeambuckler);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.tyxlBeambuckler);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.shadowSelf);
        });

        describe('after creature is dealt damage', function () {
            beforeEach(function () {
                this.player1.play(this.tyxlBeambuckler);
                this.player1.clickCard(this.niffleApe);
            });

            it('should deal 2 damage', function () {
                expect(this.niffleApe.damage).toBe(2);
                expect(this.niffleApe.location).toBe('play area');
            });

            it('should be able to move to Left flank', function () {
                this.player1.clickPrompt('Left');
                expect(this.player2.player.creaturesInPlay[0]).toBe(this.niffleApe);
            });

            it('should be able to move to Right flank', function () {
                this.player1.clickPrompt('Right');
                expect(this.player2.player.creaturesInPlay[3]).toBe(this.niffleApe);
            });
        });

        describe('if next to Shadow Self', function () {
            beforeEach(function () {
                this.player1.play(this.tyxlBeambuckler);
                this.player1.clickCard(this.huntingWitch);
            });

            it('should deal 2 damage to SS', function () {
                expect(this.shadowSelf.damage).toBe(2);
                expect(this.huntingWitch.damage).toBe(0);
                expect(this.huntingWitch.location).toBe('play area');
            });

            it('should be able to move to Left flank', function () {
                this.player1.clickPrompt('Left');
                expect(this.player2.player.creaturesInPlay[0]).toBe(this.huntingWitch);
            });

            it('should be able to move to Right flank', function () {
                this.player1.clickPrompt('Right');
                expect(this.player2.player.creaturesInPlay[3]).toBe(this.huntingWitch);
            });
        });

        describe('when targeting a warded creature', function () {
            it('ward should prevent damage but creature should still move', function () {
                this.niffleApe.ward();
                this.player1.play(this.tyxlBeambuckler);
                this.player1.clickCard(this.niffleApe);
                expect(this.niffleApe.warded).toBe(false);
                expect(this.niffleApe.damage).toBe(0);
                this.player1.clickPrompt('Left');
                expect(this.player2.player.creaturesInPlay[0]).toBe(this.niffleApe);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
