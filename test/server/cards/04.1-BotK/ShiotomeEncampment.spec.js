describe('Shiotome Encampment', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDeck: ['shiotome-encampment'],
                    inPlay: ['miya-mystic', 'aggressive-moto']
                }
            });
            this.shiotomeEncampment = this.player1.placeCardInProvince(
                'shiotome-encampment',
                'province 1'
            );
            this.miyaMystic = this.player1.findCardByName('miya-mystic');
            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.miyaMystic.bow();
            this.aggressiveMoto.bow();
        });

        describe('Using Shiotome Encampment', function() {
            it('shouldn\'t work if there is no claimed ring', function() {
                this.player1.clickCard(this.shiotomeEncampment);
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            it('shouldn\'t work if the only claimed ring is political', function() {
                this.game.rings.earth.claimRing(this.player1);
                this.player1.clickCard(this.shiotomeEncampment);
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            it('should work if at least one claimed ring is military', function() {
                this.game.rings.air.claimRing(this.player1);
                this.game.rings.earth.claimRing(this.player1);
                this.player1.clickCard(this.shiotomeEncampment);
                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should only target cavalry characters', function() {
                this.game.rings.air.claimRing(this.player1);
                this.player1.clickCard(this.shiotomeEncampment);
                expect(this.player1).toBeAbleToSelect(this.aggressiveMoto);
                expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            });

            it('should ready bowed character', function() {
                this.game.rings.air.claimRing(this.player1);
                this.player1.clickCard(this.shiotomeEncampment);
                this.player1.clickCard(this.aggressiveMoto);
                expect(this.aggressiveMoto.bowed).not.toBe(true);
            });
        });
    });
});
