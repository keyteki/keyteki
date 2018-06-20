describe('Miya Satoshi', function() {
    integration(function() {
        describe('When using his ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['miya-satoshi'],
                        dynastyDeck: ['kanjo-district', 'shiba-tsukune']
                    }
                });
                this.shibaTsukune = this.player1.placeCardInProvince('shiba-tsukune', 'province 1');
                this.kanjoDistrict = this.player1.findCardByName('kanjo-district');
                if(this.kanjoDistrict.location !== 'dynasty deck') {
                    this.player1.player.moveCard(this.kanjoDistrict, 'dynasty deck');
                }
                this.miyaSatoshi = this.player1.clickCard('miya-satoshi');
            });

            it('should discard cards until Kanjo District is the last card discarded', function() {
                expect(this.player1.player.dynastyDiscardPile.first()).toBe(this.kanjoDistrict);
            });

            it('should prompt the player to choose where to put Kanjo District', function() {
                expect(this.player1).toHavePrompt('Choose a card to discard');
                expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
            });

            it('should allow the player to choose a facedown card', function() {
                this.shibaTsukune.facedown = true;
                expect(this.player1).toHavePrompt('Choose a card to discard');
                expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
            });

            describe('When the player chooses a card', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.shibaTsukune);
                });

                it('should discard that card', function() {
                    expect(this.shibaTsukune.location).toBe('dynasty discard pile');
                });

                it('should place Kanjo District faceup in its place', function() {
                    expect(this.kanjoDistrict.location).toBe('province 1');
                    expect(this.kanjoDistrict.facedown).toBe(false);
                });
            });
        });
    });
});
