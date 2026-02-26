describe('Draw Messages', function () {
    describe('draw card', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['library-of-babble']
                },
                player2: {}
            });
        });

        it('should log correct message when drawing a card', function () {
            this.player1.useAction(this.libraryOfBabble);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Library of Babble to draw 1 card',
                'player1 draws 1 card'
            ]);
        });
    });

    describe('draw multiple cards', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['timetraveller']
                },
                player2: {}
            });
        });

        it('should log correct message when drawing multiple cards', function () {
            this.player1.play(this.timetraveller);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Timetraveller',
                "player1 uses Timetraveller's amber bonus icon to gain 1 amber",
                'player1 uses Timetraveller to draw 2 cards',
                'player1 draws 2 cards'
            ]);
        });
    });

    describe('refill hand at end of turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['phase-shift']
                },
                player2: {}
            });
        });

        it('should log correct message when refilling hand', function () {
            this.player1.play(this.phaseShift);
            this.player1.endTurn();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Phase Shift',
                'player1 uses Phase Shift to allow them to play one non-Logos card this turn',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber'
            ]);
        });
    });

    describe('draw bonus icons', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['anomaly-exploiter']
                },
                player2: {}
            });
        });

        it('should log correct message when drawing 1 card', function () {
            this.anomalyExploiter.enhancements = ['draw'];
            this.player1.play(this.anomalyExploiter);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's draw bonus icon to draw a card"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should log correct message when drawing 2 card', function () {
            this.anomalyExploiter.enhancements = ['draw', 'draw'];
            this.player1.play(this.anomalyExploiter);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's draw bonus icon to draw a card",
                "player1 uses Anomaly Exploiter's draw bonus icon to draw a card"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should log correct message in bonus icon order', function () {
            this.anomalyExploiter.enhancements = ['brobnar', 'draw', 'amber', 'draw'];
            this.player1.play(this.anomalyExploiter);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's draw bonus icon to draw a card",
                "player1 uses Anomaly Exploiter's amber bonus icon to gain 1 amber",
                "player1 uses Anomaly Exploiter's draw bonus icon to draw a card"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('amphora captura replacing draw bonus icon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['anomaly-exploiter'],
                    inPlay: ['amphora-captura', 'batdrone']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should log correct message when draw bonus icon is replaced with capture', function () {
            this.anomalyExploiter.enhancements = ['draw'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.batdrone);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Amphora Captura to resolve Anomaly Exploiter's draw bonus icon as a capture bonus icon",
                "player1 uses Anomaly Exploiter's capture bonus icon to capture 1 amber onto Batdrone"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('quantum mouse replacing draw bonus icon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['anomaly-exploiter', 'batdrone'],
                    inPlay: ['quantum-mouse']
                },
                player2: {}
            });
        });

        it('should log correct message when draw bonus icon is replaced with discard', function () {
            this.anomalyExploiter.enhancements = ['draw'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickPrompt('discard');
            this.player1.clickCard(this.batdrone);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Quantum Mouse to resolve Anomaly Exploiter's draw bonus icon as a discard bonus icon",
                "player1 uses Anomaly Exploiter's discard bonus icon to discard Batdrone"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
