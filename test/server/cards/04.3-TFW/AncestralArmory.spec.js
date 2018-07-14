describe('Ancestral Armory', function() {
    integration(function() {
        describe('Ancestral Armory\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['seppun-guardsman'],
                        hand: [],
                        conflictDiscard: ['fine-katana', 'ornate-fan']
                    },
                    player2: {
                        inPlay: ['moto-nergui']
                    }
                });
                this.ancestralArmory = this.player1.placeCardInProvince('ancestral-armory', 'province 1');
                this.player2.pass();
            });

            it('should add a weapon attachment back to your hand', function() {
                this.player1.clickCard('ancestral-armory');
                expect(this.player1).toHavePrompt('Ancestral Armory');
                this.fineKatana = this.player1.clickCard('fine-katana');
                expect(this.fineKatana.location).toBe('play area');
                expect(this.ancestralArmory.location).toBe('dynasty discard pile');
            });

            it('should not add a non weapon attachment back to your hand', function() {
                this.player1.clickCard('ancestral-armory');
                expect(this.player1).toHavePrompt('Ancestral Armory');
                this.oranteFan = this.player1.clickCard('ornate-fan');
                expect(this.oranteFan.location).toBe('conflict discard pile');
                expect(this.ancestralArmory.location).toBe('play area');
            });
        });
    });
});
