describe('Damage Messages', function () {
    describe('damage from fight', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should log correct message when fighting', function () {
            this.player1.fightWith(this.troll, this.emberImp);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Troll to make Troll fight Ember Imp',
                'Ember Imp is destroyed'
            ]);
        });
    });

    describe('damage from action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['punch']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should log correct message when creature takes damage from action', function () {
            this.player1.play(this.punch);
            this.player1.clickCard(this.emberImp);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Punch',
                "player1 uses Punch's amber bonus icon to gain 1 amber",
                'player1 uses Punch to deal 3 damage to Ember Imp',
                'Ember Imp is destroyed'
            ]);
        });
    });

    describe('damage bonus icons', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['anomaly-exploiter']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log correct message when dealing 1 damage', function () {
            this.anomalyExploiter.enhancements = ['damage'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickCard(this.troll);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's damage bonus icon to deal 1 damage to Troll"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should log correct message when dealing 2 damage', function () {
            this.anomalyExploiter.enhancements = ['damage', 'damage'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's damage bonus icon to deal 1 damage to Troll",
                "player1 uses Anomaly Exploiter's damage bonus icon to deal 1 damage to Troll"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should log correct message in bonus icon order', function () {
            this.anomalyExploiter.enhancements = ['brobnar', 'damage', 'amber', 'damage'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's damage bonus icon to deal 1 damage to Troll",
                "player1 uses Anomaly Exploiter's amber bonus icon to gain 1 amber",
                "player1 uses Anomaly Exploiter's damage bonus icon to deal 1 damage to Troll"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('amphora captura replacing damage bonus icon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['anomaly-exploiter'],
                    inPlay: ['amphora-captura', 'batdrone']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll']
                }
            });
        });

        it('should log correct message when damage bonus icon is replaced with capture', function () {
            this.anomalyExploiter.enhancements = ['damage'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.batdrone);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Amphora Captura to resolve Anomaly Exploiter's damage bonus icon as a capture bonus icon",
                "player1 uses Anomaly Exploiter's capture bonus icon to capture 1 amber onto Batdrone"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
