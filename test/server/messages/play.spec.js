describe('Play Messages', function () {
    describe('play a creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['troll']
                },
                player2: {}
            });
        });

        it('should log correct message when playing a creature', function () {
            this.player1.play(this.troll);
            expect(this).toHaveAllChatMessagesBe(['player1 plays Troll']);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('play a creature with amber bonus', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['dust-pixie']
                },
                player2: {}
            });
        });

        it('should log correct message when playing a creature with amber bonus', function () {
            this.player1.play(this.dustPixie);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Dust Pixie',
                "player1 gains an amber due to Dust Pixie's bonus icon",
                "player1 gains an amber due to Dust Pixie's bonus icon"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('play an artifact', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['library-of-babble']
                },
                player2: {}
            });
        });

        it('should log correct message when playing an artifact', function () {
            this.player1.play(this.libraryOfBabble);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Library of Babble',
                'player1 plays Library of Babble'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('play an upgrade', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['silent-dagger'],
                    inPlay: ['silvertooth']
                },
                player2: {}
            });
        });

        it('should log correct message when playing an upgrade on a creature', function () {
            this.player1.playUpgrade(this.silentDagger, this.silvertooth);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Silent Dagger attaching it to Silvertooth',
                "player1 gains an amber due to Silent Dagger's bonus icon"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('play an action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['punch']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log correct message when playing an action', function () {
            this.player1.play(this.punch);
            this.player1.clickCard(this.troll);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Punch',
                "player1 gains an amber due to Punch's bonus icon",
                'player1 uses Punch to deal 3 damage to Troll'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('play a creature with play ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['flaxia'],
                    inPlay: ['dust-pixie']
                },
                player2: {}
            });
        });

        it('should log correct message when playing a creature with play ability', function () {
            this.player1.play(this.flaxia);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Flaxia',
                'player1 uses Flaxia to gain 2 amber'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('play an artifact with play ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['ceaseforge']
                },
                player2: {}
            });
        });

        it('should log correct message when playing an artifact with play ability', function () {
            this.player1.play(this.ceaseforge);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Ceaseforge',
                'player1 plays Ceaseforge',
                "player1 gains an amber due to Ceaseforge's bonus icon",
                'player1 uses Ceaseforge to place 2 time on Ceaseforge'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
