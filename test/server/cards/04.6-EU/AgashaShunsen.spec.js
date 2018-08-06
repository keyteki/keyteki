describe('Agasha Shunsen', function() {
    integration(function() {
        describe('Agasha Shunsen\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['agasha-shunsen'],
                        conflictDeck: ['fine-katana']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.player1.claimRing('earth');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['agasha-shunsen'],
                    defenders: []
                });
                this.player2.pass();
            });

            it('should prompt the player to return a ring', function() {
                this.agashaShunsen = this.player1.clickCard('agasha-shunsen');
                this.player1.clickCard('agasha-shunsen');
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('air');
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('fire');
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('water');
                expect(this.player1).toHavePrompt('Choose a ring to return');
                this.player1.clickRing('void');
                expect(this.player1).toHavePrompt('Choose a ring to return');
            });

            it('should prompt the player to choose a card', function() {
                this.agashaShunsen = this.player1.clickCard('agasha-shunsen');
                this.player1.clickCard('agasha-shunsen');
                this.player1.clickRing('earth');
                expect(this.game.rings.earth.isUnclaimed()).toBe(true);
                expect(this.player1).toHavePrompt('Agasha Shunsen');
            });

            it('should attach the chosen card', function() {
                this.agashaShunsen = this.player1.clickCard('agasha-shunsen');
                this.player1.clickCard('agasha-shunsen');
                this.player1.clickRing('earth');
                this.player1.clickPrompt('Fine Katana');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                expect(this.agashaShunsen.attachments.toArray()).toContain(this.fineKatana);
            });
        });
    });
});
