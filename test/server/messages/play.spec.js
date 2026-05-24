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
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe(['player1 plays Troll']);
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
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Dust Pixie',
                "player1 uses Dust Pixie's amber bonus icon to gain 1 amber",
                "player1 uses Dust Pixie's amber bonus icon to gain 1 amber"
            ]);
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
            expect(this).toHaveAllChatMessagesBe(['player1 plays Library of Babble']);
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
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Silent Dagger attaching it to Silvertooth',
                "player1 uses Silent Dagger's amber bonus icon to gain 1 amber"
            ]);
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
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Punch',
                "player1 uses Punch's amber bonus icon to gain 1 amber",
                'player1 uses Punch to deal 3 damage to Troll'
            ]);
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
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Flaxia',
                'player1 uses Flaxia to gain 2 amber'
            ]);
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
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Ceaseforge',
                "player1 uses Ceaseforge's amber bonus icon to gain 1 amber",
                'player1 uses Ceaseforge to place 2 time on Ceaseforge'
            ]);
        });
    });

    describe('play a treachery creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['scowly-caper']
                },
                player2: {}
            });
        });

        it('should log a single play message naming the playing player even though the creature enters play under the opponent', function () {
            this.player1.play(this.scowlyCaper);
            expect(this.scowlyCaper.location).toBe('play area');
            expect(this.scowlyCaper.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe(['player1 plays Scowly Caper']);
        });
    });

    describe('play a treachery creature while restricted from playing', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['batdrone', 'wild-wormhole', 'scowly-caper']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should log a single play message naming the attempting player', function () {
            this.player1.moveCard(this.scowlyCaper, 'deck');
            this.player1.play(this.batdrone);
            this.player1.play(this.wildWormhole);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            expect(this.scowlyCaper.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Batdrone',
                'player1 plays Wild Wormhole',
                "player1 uses Wild Wormhole's amber bonus icon to gain 1 amber",
                'player1 is unable to play a card from deck due to a restriction'
            ]);
        });
    });
});
