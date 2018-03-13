describe('Mountaintop Statuary', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'setup',
                player1: {
                    dynastyDeck: ['mountaintop-statuary'],
                    hand: ['rebuild'],
                    dynastyDiscard: ['the-imperial-palace']
                }
            });
            this.mountaintopStatuary = this.player1.placeCardInProvince('mountaintop-statuary', 'province 1');
            this.imperialPalace = this.player1.dynastyDiscard[0];
            this.keepDynasty();
            this.keepConflict();
        });

        describe('when flipped during the dynasty phase', function() {
            it('it should prompt the player', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.mountaintopStatuary);
            });

            it('it should move to the stronghold province when triggered', function() {
                this.player1.clickCard(this.mountaintopStatuary);
                expect(this.mountaintopStatuary.location).toBe('stronghold province');
            });

            it('it should be replaced by a facedown card', function() {
                this.player1.clickCard(this.mountaintopStatuary);
                this.newCard = this.player1.player.getDynastyCardInProvince('province 1');
                expect(this.newCard).toBeDefined();
                expect(this.newCard.facedown).toBe(true);
            });
        });

        describe('when Rebuild is played on Mountaintop Statuaryary in the stronghold province', function() {
            beforeEach(function() {
                this.player1.clickCard(this.mountaintopStatuary);
                this.player1.clickCard('rebuild');
            });

            it('it should prompt the player', function() {
                expect(this.player1).toHavePrompt('Rebuild');
                expect(this.player1).toBeAbleToSelect(this.mountaintopStatuary);
            });

            it('it should shuffle Mountaintop Statuary and place Imperial Palace in the stronghold province', function() {
                this.player1.clickCard(this.mountaintopStatuary);
                this.player1.clickCard(this.imperialPalace);
                expect(this.mountaintopStatuary.location).toBe('dynasty deck');
                expect(this.imperialPalace.location).toBe('stronghold province');
            });
        });
    });
});
