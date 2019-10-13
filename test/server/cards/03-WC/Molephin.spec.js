describe('Molephin', function() {
    integration(function() {
        describe('Molephin\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 5,
                        house: 'shadows',
                        inPlay: ['molephin'],
                        hand: ['ronnie-wristclocks']
                    },
                    player2: {
                        amber: 5,
                        inPlay: ['bad-penny', 'brain-eater'],
                        hand: ['urchin', 'swindle']
                    }
                });
            });
            it('on steal, should deal damage equal to the amount of aember stolen to the entire enemy board', function() {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.play(this.urchin);
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(6);
                expect(this.badPenny.location).toBe('hand');
                expect(this.urchin.location).toBe('discard');
                expect(this.brainEater.tokens.damage).toBe(1);
                expect(this.molephin.tokens.damage).toBe(undefined);
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.play(this.swindle);
                expect(this.brainEater.tokens.damage).toBe(4);
                expect(this.molephin.tokens.damage).toBe(undefined);
            });
            it('it shouldn\'t deal damage if molephins controller steals.', function() {
                this.player1.play(this.ronnieWristclocks);
                expect(this.player1.amber).toBe(6);
                expect(this.player2.amber).toBe(4);
                expect(this.badPenny.location).toBe('play area');
                expect(this.brainEater.tokens.damage).toBe(undefined);
                expect(this.molephin.tokens.damage).toBe(undefined);
            });
        });
    });
});
