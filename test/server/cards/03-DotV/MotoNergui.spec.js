describe('Moto Nergui', function() {
    integration(function() {
        describe('Moto Nergui\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-nergui', 'utaku-yumino']
                    },
                    player2: {
                        inPlay: ['shiba-tsukune']
                    }
                });
                this.noMoreActions();
            });

            it('should allow Nergui to send herself home', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['moto-nergui'],
                    defenders: []
                });
                this.player2.pass();
                this.motoNergui = this.player1.findCardByName('moto-nergui');
                this.player1.clickCard(this.motoNergui);
                expect(this.player1).toHavePrompt('Moto Nergüi');
                this.player1.clickCard(this.motoNergui);
                expect(this.motoNergui.inConflict).toBe(false);
            });

            it('should allow Nergui to send a friendly character home', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['moto-nergui', 'utaku-yumino'],
                    defenders: []
                });
                this.player2.pass();
                this.motoNergui = this.player1.findCardByName('moto-nergui');
                this.player1.clickCard(this.motoNergui);
                expect(this.player1).toHavePrompt('Moto Nergüi');
                expect(this.player1).not.toBeAbleToSelect(this.motoNergui);
                this.utakuYumino = this.player1.clickCard('utaku-yumino');
                expect(this.utakuYumino.inConflict).toBe(false);
            });

            it('should allow Nergui to send an enemy character home', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['moto-nergui'],
                    defenders: ['shiba-tsukune']
                });
                this.player2.pass();
                this.motoNergui = this.player1.findCardByName('moto-nergui');
                this.player1.clickCard(this.motoNergui);
                expect(this.player1).toHavePrompt('Moto Nergüi');
                expect(this.player1).not.toBeAbleToSelect(this.motoNergui);
                this.shibaTsukune = this.player1.clickCard('shiba-tsukune', 'any', 'opponent');
                expect(this.shibaTsukune.inConflict).toBe(false);
            });
        });
    });
});
