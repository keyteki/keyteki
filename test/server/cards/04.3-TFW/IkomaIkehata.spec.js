describe('Ikoma Ikehata', function() {
    integration(function() {
        describe('Ikoma Ikehata\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ikoma-ikehata','doji-hotaru'],
                        hand: ['fine-katana','ornate-fan','way-of-the-crane']
                    },
                    player2: {
                        inPlay: ['miya-mystic']
                    }
                });
                this.ikehata = this.player1.findCardByName('ikoma-ikehata');
                this.hotaru = this.player1.findCardByName('doji-hotaru');
                this.crane = this.player1.findCardByName('way-of-the-crane');

                this.mystic = this.player2.findCardByName('miya-mystic');
                this.noMoreActions();
            });

            it('should trigger only after winning a political conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['ikoma-ikehata'],
                    defenders: ['miya-mystic'],
                    jumpTo: 'afterConflict'
                });
                expect(this.player1).not.toBeAbleToSelect(this.ikehata);
            });

            it('should trigger after winning a political conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['ikoma-ikehata'],
                    defenders: ['miya-mystic'],
                    jumpTo: 'afterConflict'
                });
                expect(this.player1).toBeAbleToSelect(this.ikehata);
            });

            it('should only target characters that are not honored', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['ikoma-ikehata'],
                    defenders: ['miya-mystic']
                });
                this.player2.pass();
                this.player1.clickCard(this.crane);
                this.player1.clickCard(this.hotaru);
                expect(this.hotaru.isHonored).toBe(true);
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toBeAbleToSelect(this.ikehata);
                this.player1.clickCard(this.ikehata);
                expect(this.player1).not.toBeAbleToSelect(this.hotaru);
                expect(this.player1).toBeAbleToSelect(this.ikehata);
                expect(this.player1).not.toBeAbleToSelect(this.mystic);
            });

            it('should correctly honor targeted character', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['ikoma-ikehata'],
                    defenders: ['miya-mystic']
                });
                this.player2.pass();
                this.player1.clickCard(this.crane);
                this.player1.clickCard(this.hotaru);
                expect(this.hotaru.isHonored).toBe(true);
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toBeAbleToSelect(this.ikehata);
                this.player1.clickCard(this.ikehata);
                expect(this.player1).not.toBeAbleToSelect(this.hotaru);
                expect(this.player1).toBeAbleToSelect(this.ikehata);
                expect(this.player1).not.toBeAbleToSelect(this.mystic);
                this.player1.clickCard(this.ikehata);
                expect(this.ikehata.isHonored).toBe(true);
            });

            it('should correctly draw a card after honoring', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['ikoma-ikehata'],
                    defenders: ['miya-mystic']
                });
                this.player2.pass();
                this.player1.clickCard(this.crane);
                this.player1.clickCard(this.hotaru);
                expect(this.hotaru.isHonored).toBe(true);
                expect(this.player1.hand.length).toBe(2);
                this.player2.pass();
                this.player1.pass();
                this.player1.clickCard(this.ikehata);
                expect(this.player1).not.toBeAbleToSelect(this.hotaru);
                expect(this.player1).toBeAbleToSelect(this.ikehata);
                expect(this.player1).not.toBeAbleToSelect(this.mystic);
                this.player1.clickCard(this.ikehata);
                expect(this.ikehata.isHonored).toBe(true);
                expect(this.player1.hand.length).toBe(3);
            });
        });
    });
});
