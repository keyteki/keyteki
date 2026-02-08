describe('Ward Messages', function () {
    describe('ward', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['hologrammophone', 'dextre']
                },
                player2: {}
            });
        });

        it('should log correct message when warding a creature', function () {
            this.player1.useAction(this.hologrammophone);
            this.player1.clickCard(this.dextre);
            expect(this).toHaveAllChatMessagesBe(['player1 uses Hologrammophone to ward Dextre']);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('ward prevents damage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['dextre']
                }
            });
            this.dextre.ward();
        });

        it('should log correct message when ward prevents damage', function () {
            this.player1.fightWith(this.troll, this.dextre);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Troll to make Troll fight Dextre',
                "Dextre's ward token prevents the damage dealt by Troll and is discarded"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('ward prevents destroy', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['gateway-to-dis']
                },
                player2: {
                    inPlay: ['dextre']
                }
            });
            this.dextre.ward();
        });

        it('should log correct message when ward prevents destroy', function () {
            this.player1.play(this.gatewayToDis);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Gateway to Dis',
                'player1 uses Gateway to Dis to destroy all creatures and gain 3 chains',
                'player2 uses Dextre to remove its ward token'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('ward prevents return to hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['fear']
                },
                player2: {
                    inPlay: ['dextre']
                }
            });
            this.dextre.ward();
        });

        it('should log correct message when ward prevents return to hand', function () {
            this.player1.play(this.fear);
            this.player1.clickCard(this.dextre);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Fear',
                'player1 uses Fear to return Dextre to their hand',
                'player2 uses Dextre to remove its ward token'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('ward prevents purge', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['harvest-time']
                },
                player2: {
                    inPlay: ['dysania']
                }
            });
            this.dysania.ward();
        });

        it('should log correct message when ward prevents purge', function () {
            this.player1.play(this.harvestTime);
            this.player1.selectTrait('Mutant');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Harvest Time',
                'player1 chooses trait Mutant',
                'player1 uses Harvest Time to purge all cards with the Mutant trait and each player gains amber equal to the number of their cards purged',
                'player2 uses Dysania to remove its ward token'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('ward prevents archive', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['hoist-operations']
                },
                player2: {
                    inPlay: ['dextre']
                }
            });
            this.dextre.ward();
        });

        it('should log correct message when ward prevents archive', function () {
            this.player1.play(this.hoistOperations);
            this.player1.clickCard(this.dextre);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Hoist Operations',
                "player1 gains an amber due to Hoist Operations's bonus icon",
                'player1 uses Hoist Operations to archive Dextre',
                'player2 uses Dextre to remove its ward token'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('ward prevents put under another card', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['soul-lock']
                },
                player2: {
                    inPlay: ['dextre']
                }
            });
            this.dextre.ward();
        });

        it('should log correct message when ward prevents put under card', function () {
            this.player1.useAction(this.soulLock);
            this.player1.clickCard(this.dextre);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Soul Lock',
                'player2 uses Dextre to remove its ward token'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
