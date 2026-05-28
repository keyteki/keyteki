describe('Capture Messages', function () {
    describe('capture amber on play ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['dextre']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should log correct message when capturing amber on play', function () {
            this.player1.play(this.dextre);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Dextre',
                'player1 uses Dextre to capture 1 amber from their opponent, placing it on Dextre'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('capture amber after reap ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['berinon']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should log correct message when capturing amber after reap', function () {
            this.player1.reap(this.berinon);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Berinon to reap with Berinon',
                'player1 uses Berinon to capture 2 amber from their opponent, placing it on Berinon'
            ]);
        });
    });

    describe('capture bonus icons', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['anomaly-exploiter'],
                    inPlay: ['batdrone']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should log correct message when capturing 1 amber', function () {
            this.anomalyExploiter.enhancements = ['capture'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickCard(this.batdrone);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's capture bonus icon to capture 1 amber onto Batdrone"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should log correct message when capturing 2 amber', function () {
            this.anomalyExploiter.enhancements = ['capture', 'capture'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.batdrone);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's capture bonus icon to capture 1 amber onto Batdrone",
                "player1 uses Anomaly Exploiter's capture bonus icon to capture 1 amber onto Batdrone"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should log correct message in bonus icon order', function () {
            this.anomalyExploiter.enhancements = ['brobnar', 'capture', 'amber', 'capture'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.batdrone);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's capture bonus icon to capture 1 amber onto Batdrone",
                "player1 uses Anomaly Exploiter's amber bonus icon to gain 1 amber",
                "player1 uses Anomaly Exploiter's capture bonus icon to capture 1 amber onto Batdrone"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('scrivener favian replacing capture bonus icon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['anomaly-exploiter'],
                    inPlay: ['scrivener-favian', 'batdrone']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should log correct message when capture bonus icon is replaced with steal', function () {
            this.anomalyExploiter.enhancements = ['capture'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickPrompt('steal');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Scrivener Favian to resolve Anomaly Exploiter's capture bonus icon to steal 1 amber"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
