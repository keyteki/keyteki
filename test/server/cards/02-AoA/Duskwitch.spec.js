describe('Duskwitch', function() {
    integration(function() {
        describe('Duskwitch\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 2,
                        house: 'untamed',
                        hand: ['hunting-witch', 'dust-pixie'],
                        inPlay: ['duskwitch']
                    },
                    player2: {
                        amber: 2,
                        hand: ['remote-access']
                    }
                });
            });
            it('should ready ALL creatures played by the owner', function() {
                this.player1.play(this.huntingWitch);
                this.player1.play(this.dustPixie);
                expect(this.huntingWitch.exhausted).toBe(false);
                expect(this.dustPixie.exhausted).toBe(false);
            });
        });

        describe('Duskwitch\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 2,
                        house: 'untamed',
                        inPlay: ['heart-of-the-forest']
                    },
                    player2: {
                        amber: 1,
                        house: 'untamed',
                        hand: ['hunting-witch', 'dust-pixie'],
                    }
                });
            });

            it('should NOT ready creatures played by the opponent', function() {
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.play(this.huntingWitch);
                this.player2.play(this.dustPixie);
                expect(this.huntingWitch.exhausted).toBe(true);
                expect(this.dustPixie.exhausted).toBe(true);
            });
        });
    });
});