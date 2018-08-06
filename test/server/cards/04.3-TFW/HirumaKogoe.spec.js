describe('Hiruma Kogoe', function () {
    integration(function () {
        describe('Hiruma Kogoe\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['hiruma-kogoe'],
                        honor: 5,
                        hand: ['reprieve','fine-katana','ornate-fan']
                    },
                    player2: {
                        honor:5
                    }
                });
                this.kogoe = this.player1.findCardByName('hiruma-kogoe');
                this.katana = this.player1.findCardByName('fine-katana');
                this.fan = this.player1.findCardByName('ornate-fan');
                this.reprieve = this.player1.findCardByName('reprieve');
            });

            it('should not trigger if no lower honor', function () {
                this.player2.player.honor = 3;
                this.nextPhase();
                expect(this.player1).not.toBeAbleToSelect(this.kogoe);
            });

            it('should trigger if lower honor', function () {
                this.player2.player.honor = 11;
                this.nextPhase();
                expect(this.player1).toBeAbleToSelect(this.kogoe);
            });

            it('should not trigger if even honor', function () {
                this.player2.player.honor = 5;
                this.nextPhase();
                expect(this.player1).not.toBeAbleToSelect(this.kogoe);
            });

            it('should correctly rearrange cards', function () {
                this.player2.player.honor = 11;
                this.player1.moveCard(this.reprieve, 'conflict deck');
                this.player1.moveCard(this.fan, 'conflict deck');
                this.player1.moveCard(this.katana, 'conflict deck');
                this.nextPhase();
                this.player1.clickCard(this.kogoe);
                expect(this.player1).toHavePrompt('Which card do you want to be on top?');
                this.player1.clickPrompt('Ornate Fan');
                expect(this.player1).toHavePrompt('Which card do you want to be the second card?');
                expect(this.player1).toHavePromptButton('Reprieve');
                expect(this.player1).toHavePromptButton('Fine Katana');
                this.player1.clickPrompt('Reprieve');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');
                expect(this.fan.location).toBe('hand');
            });
        });
    });
});
