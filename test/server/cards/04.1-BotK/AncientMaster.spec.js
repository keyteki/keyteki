describe('Ancient Master', function() {
    integration(function() {
        describe('Ancient Master', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['niten-master'],
                        hand: ['ancient-master'],
                        conflictDeck: ['hurricane-punch', 'centipede-tattoo', 'mantra-of-fire', 'censure', 'ornate-fan'],
                        conflictDeckSize: 5
                    },
                    player2: { }
                });
                this.nitenMaster = this.player1.findCardByName('niten-master');
                this.ancientMaster = this.player1.findCardByName('ancient-master');
            });

            it('can be played as an attachment', function() {
                this.player1.clickCard(this.ancientMaster);
                this.player1.clickPrompt('Play Ancient Master as an attachment');
                this.player1.clickCard(this.nitenMaster);
                expect(this.nitenMaster.attachments.size()).toBe(1);
            });

            it('should trigger its reaction and find kihos', function() {
                this.player1.clickCard(this.ancientMaster);
                this.player1.clickPrompt('Play Ancient Master as an attachment');
                this.player1.clickCard(this.nitenMaster);
                this.noMoreActions();
                let handsize = this.player1.player.hand.size();
                this.initiateConflict({
                    attackers: [this.nitenMaster]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ancientMaster);
                this.player1.clickCard(this.ancientMaster);
                expect(this.player1).toHavePrompt('Ancient Master');
                this.player1.clickPrompt('Hurricane Punch');
                expect(this.player1.player.hand.size()).toBe(handsize + 1);
            });

            it('should trigger its reaction and find tattoos', function() {
                this.player1.clickCard(this.ancientMaster);
                this.player1.clickPrompt('Play Ancient Master as an attachment');
                this.player1.clickCard(this.nitenMaster);
                this.noMoreActions();
                let handsize = this.player1.player.hand.size();
                this.initiateConflict({
                    attackers: [this.nitenMaster]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ancientMaster);
                this.player1.clickCard(this.ancientMaster);
                expect(this.player1).toHavePrompt('Ancient Master');
                this.player1.clickPrompt('Centipede Tattoo');
                expect(this.player1.player.hand.size()).toBe(handsize + 1);

            });

            it('should not trigger the reaction when not played as an attachment', function() {
                this.player1.clickCard(this.ancientMaster);
                this.player1.clickPrompt('Play this character');
                this.player1.clickPrompt('0');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ancientMaster],
                    defenders: []
                });
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
