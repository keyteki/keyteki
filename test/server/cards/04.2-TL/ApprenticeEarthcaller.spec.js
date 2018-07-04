describe('Apprentice Earthcaller', function() {
    integration(function() {
        describe('Apprentice Earthcaller\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['apprentice-earthcaller', 'third-tower-guard','crisis-breaker'],
                        hand: ['fine-katana']
                    },
                    player2: {
                        inPlay: ['togashi-initiate'],
                        hand: ['hurricane-punch','ornate-fan']
                    }
                });
                this.apprentice = this.player1.findCardByName('apprentice-earthcaller');
                this.crisisbreaker = this.player1.findCardByName('crisis-breaker');
                this.ttg = this.player1.findCardByName('third-tower-guard');
                this.katana = this.player1.findCardByName('fine-katana');

                this.togashi = this.player2.findCardByName('togashi-initiate');
                this.punch = this.player2.findCardByName('hurricane-punch');
                this.fan = this.player2.findCardByName('ornate-fan');

                this.player1.playAttachment(this.katana, this.ttg);
                this.noMoreActions();
            });

            it('should only target attacking characters without attachments', function() {
                this.initiateConflict({
                    attackers: [this.ttg,this.crisisbreaker],
                    defenders: [this.togashi]
                });
                this.player2.pass();
                this.player1.clickCard(this.apprentice);
                expect(this.player1).not.toBeAbleToSelect(this.ttg);
                expect(this.player1).toBeAbleToSelect(this.crisisbreaker);
                expect(this.player1).not.toBeAbleToSelect(this.apprentice);
                expect(this.player1).not.toBeAbleToSelect(this.togashi);
            });

            it('should set skills to printed skills', function() {
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.togashi],
                    defenders: [this.ttg]
                });
                this.player1.pass();
                this.player2.clickCard(this.punch);
                this.player2.clickCard(this.togashi);
                expect(this.togashi.getMilitarySkill()).toBe(3);
                this.player1.clickCard(this.apprentice);
                expect(this.player1).not.toBeAbleToSelect(this.ttg);
                expect(this.player1).not.toBeAbleToSelect(this.apprentice);
                expect(this.player1).not.toBeAbleToSelect(this.crisisbreaker);
                expect(this.player1).toBeAbleToSelect(this.togashi);
                this.player1.clickCard(this.togashi);
                expect(this.togashi.getMilitarySkill()).toBe(1);
                this.player2.clickCard(this.fan);
                this.player2.clickCard(this.togashi);
                expect(this.togashi.getPoliticalSkill()).toBe(1);
            });
        });
    });
});
