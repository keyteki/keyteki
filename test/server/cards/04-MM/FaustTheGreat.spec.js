describe('Faust The Great', function() {
    integration(function() {
        describe('Faust The Great\'s abilities', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'saurian',
                        inPlay: ['mother', 'bad-penny'],
                        hand: ['faust-the-great']
                    },
                    player2: {
                        amber: 7,
                        hand: ['urchin']
                    }
                });
                this.player1.play(this.faustTheGreat);
            });

            it('should allow you to target friendly creatures', function() {
                expect(this.player1).toBeAbleToSelect(this.mother);
                expect(this.player1).toBeAbleToSelect(this.badPenny);
                expect(this.player1).toBeAbleToSelect(this.faustTheGreat);
                expect(this.player1).not.toBeAbleToSelect(this.urchin);
            });

            describe('exalt a card', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.mother);
                });

                describe('should increase cost for each exalted creature', function() {
                    beforeEach(function() {
                        this.player1.endTurn();
                    });

                    it('opponent should forge for 7.',
                        function() {
                            expect(this.faustTheGreat.location).toBe('play area');
                            expect(this.mother.tokens.amber).toBe(1);
                            expect(this.player2).toHavePrompt('Which key would you like to forge?');
                            this.player2.clickPrompt('Yellow');
                            expect(this.player2.player.keys.yellow).toBe(true);
                            expect(this.player2.player.amber).toBe(0);
                        });
                });
            });

            describe('do not exalt card', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Done');
                });

                describe('should not increase cost without exalted creature', function() {
                    beforeEach(function() {
                        this.player1.endTurn();
                    });

                    it('opponent should forge for 6.',
                        function() {
                            expect(this.faustTheGreat.location).toBe('play area');
                            expect(this.mother.tokens.amber).toBe(undefined);
                            expect(this.player2).toHavePrompt('Which key would you like to forge?');
                            this.player2.clickPrompt('Yellow');
                            expect(this.player2.player.keys.yellow).toBe(true);
                            expect(this.player2.player.amber).toBe(1);
                        });
                });
            });
        });
    });
});
