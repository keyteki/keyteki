describe('Ritual of Balance', function () {
    describe("Ritual of Balance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 3,
                    inPlay: ['nexus', 'library-of-babble', 'ritual-of-balance']
                },
                player2: {
                    amber: 8,
                    inPlay: ['gauntlet-of-command']
                }
            });
        });

        it('should steal 1 amber if opponent has less 6 or more amber', function () {
            this.player1.useAction(this.ritualOfBalance);
            expect(this.ritualOfBalance.exhausted).toBe(true);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(7);
        });

        it('should not steal 1 amber if opponent has less than 6', function () {
            this.player2.amber = 5;
            this.player1.useAction(this.ritualOfBalance);
            expect(this.ritualOfBalance.exhausted).toBe(true);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(5);
        });
    });

    describe("Ritual of Balance's ability", function () {
        beforeEach(function () {
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

        it('should be exhausted if used by an opponent even if the condition is met', function () {
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

    describe("Ritual of Balance's ability", function () {
        beforeEach(function () {
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

        it('should be exhausted if used by an opponent even if the condition is not met', function () {
            this.player1.reap(this.nexus);
            expect(this.player1).toHavePrompt('Nexus');
            expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Ritual of Balance's ability", function () {
        beforeEach(function () {
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

        it('should be exhausted if used by an opponent even if the condition is not met', function () {
            this.player1.play(this.remoteAccess);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
