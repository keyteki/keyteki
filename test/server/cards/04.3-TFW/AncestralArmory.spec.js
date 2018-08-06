describe('Ancestral Armory', function() {
    integration(function() {
        describe('Ancestral Armory\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['seppun-guardsman'],
                        hand: [],
                        conflictDiscard: ['fine-katana', 'ornate-fan'],
                        dynastyDiscard: ['ancestral-armory']
                    },
                    player2: {
                        inPlay: ['moto-nergui']
                    }
                });
                this.ancestralArmory = this.player1.placeCardInProvince('ancestral-armory', 'province 1');
            });

            it('should add a weapon attachment back to your hand', function() {
                this.player1.clickCard('ancestral-armory');
                expect(this.player1).toHavePrompt('Ancestral Armory');
                this.fineKatana = this.player1.clickCard('fine-katana');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.fineKatana.location).toBe('hand');
                expect(this.ancestralArmory.location).toBe('dynasty discard pile');
            });

            it('should not add a non weapon attachment back to your hand', function() {
                this.player1.clickCard('ancestral-armory');
                expect(this.player1).toHavePrompt('Ancestral Armory');
                this.oranteFan = this.player1.clickCard('ornate-fan');
                expect(this.oranteFan.location).toBe('conflict discard pile');
                expect(this.ancestralArmory.location).toBe('province 1');
            });
        });
    });
});
