describe('Being And Becoming', function() {
    integration(function() {
        describe('Being And Becoming\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-initiate','togashi-mendicant'],
                        hand: ['being-and-becoming']
                    },
                    player2: {
                        inPlay: [],
                        hand: []
                    }
                });
                this.initiate = this.player1.findCardByName('togashi-initiate');
                this.mendicant = this.player1.findCardByName('togashi-mendicant');
                this.bab = this.player1.findCardByName('being-and-becoming');

                this.game.rings.fire.fate = 2;
            });

            it('should work on rings with fate', function() {
                this.player1.clickCard(this.bab);
                this.player1.clickCard(this.mendicant);
                this.player2.pass();
                this.player1.clickCard(this.bab);
                expect(this.player1).toHavePrompt('Choose an unclaimed ring to move fate from');
                expect(this.game.rings.fire.fate).toBe(2);
                this.player1.clickRing('fire');
                expect(this.game.rings.fire.fate).toBe(0);
                expect(this.mendicant.fate).toBe(2);
                expect(this.initiate.fate).toBe(0);
                expect(this.mendicant.bowed).toBe(true);
            });

            it('should not work on rings without fate', function() {
                this.player1.clickCard(this.bab);
                this.player1.clickCard(this.mendicant);
                this.player2.pass();
                this.player1.clickCard(this.bab);
                expect(this.player1).toHavePrompt('Choose an unclaimed ring to move fate from');
                expect(this.game.rings.air.fate).toBe(0);
                this.player1.clickRing('air');
                expect(this.player1).toHavePrompt('Choose an unclaimed ring to move fate from');
            });
        });
    });
});
