xdescribe('Ritual of Balance', function() {
    integration(function() {
        describe('Ritual of Balance\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        amber: 3,
                        hand: ['remote-access'],
                        inPlay: ['nexus', 'gorm-of-omm', 'library-of-babble']
                    },
                    player2: {
                        amber: 8,
                        inPlay: ['gauntlet-of-command', 'ritual-of-balance']
                    }
                });
            });

            it('should be exhausted if used by an opponent even if the condition is met', function() {
                this.player1.reap(this.nexus);
                expect(this.player1).toHavePrompt('Nexus');
                expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
                this.player1.clickCard(this.ritualOfBalance);
                expect(this.ritualOfBalance.exhausted).toBe(true);
                expect(this.player1.amber).toBe(5);
                expect(this.player2.amber).toBe(7);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe('Ritual of Balance\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        hand: ['remote-access'],
                        inPlay: ['nexus', 'gorm-of-omm', 'library-of-babble']
                    },
                    player2: {
                        inPlay: ['gauntlet-of-command', 'ritual-of-balance']
                    }
                });
            });

            it('should be exhausted if used by an opponent even if the condition is not met', function() {
                this.player1.reap(this.nexus);
                expect(this.player1).toHavePrompt('Nexus');
                expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
                this.player1.clickCard(this.ritualOfBalance);
                expect(this.ritualOfBalance.exhausted).toBe(true);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        describe('Ritual of Balance\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        hand: ['remote-access'],
                        inPlay: ['nexus', 'gorm-of-omm', 'library-of-babble']
                    },
                    player2: {
                        inPlay: ['gauntlet-of-command', 'ritual-of-balance']
                    }
                });
            });

            it('should be exhausted if used by an opponent even if the condition is not met', function() {
                this.player1.play(this.remoteAccess);
                this.player1.clickCard(this.ritualOfBalance);
                expect(this.ritualOfBalance.exhausted).toBe(true);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
