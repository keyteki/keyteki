describe('Iuchi Wayfinder', function() {
    integration(function() {
        describe('Iuchi Wayfinder ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['iuchi-wayfinder']
                    }
                });
                this.shamefulDisplay1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.shamefulDisplay2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.shamefulDisplay2.facedown = false;
            });

            it('should allow targeting only facedown provinces', function() {
                this.iuchiWayfinder = this.player1.playCharacterFromHand('iuchi-wayfinder');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.iuchiWayfinder);
                expect(this.player1).toHavePrompt('Iuchi Wayfinder');
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay1);
                expect(this.player1).not.toBeAbleToSelect(this.shamefulDisplay2);
            });

            it('should display a message in chat when a province is chosen', function() {
                this.chat = spyOn(this.game, 'addMessage');
                this.iuchiWayfinder = this.player1.playCharacterFromHand('iuchi-wayfinder');
                this.player1.clickCard(this.iuchiWayfinder);
                this.player1.clickCard(this.shamefulDisplay1);
                expect(this.chat).toHaveBeenCalledWith('{0} reveals {1}', this.iuchiWayfinder, [this.shamefulDisplay1]);
            });
        });
    });
});
