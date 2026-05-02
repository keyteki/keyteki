describe('Amber Messages', function () {
    describe('gain amber from reap', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ganger-chieftain']
                },
                player2: {}
            });
        });

        it('should log correct message when reaping for amber', function () {
            this.player1.reap(this.gangerChieftain);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Ganger Chieftain to reap with Ganger Chieftain'
            ]);
        });
    });

    describe('gain amber from bonus icon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['dust-pixie']
                },
                player2: {}
            });
        });

        it('should log correct message when gaining amber from bonus icon', function () {
            this.player1.play(this.dustPixie);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Dust Pixie',
                "player1 gains an amber due to Dust Pixie's bonus icon",
                "player1 gains an amber due to Dust Pixie's bonus icon"
            ]);
        });
    });

    describe('gain amber from card ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['dust-pixie'],
                    inPlay: ['hunting-witch']
                },
                player2: {}
            });
        });

        it('should log correct message when gaining amber from card ability', function () {
            this.player1.play(this.dustPixie);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Dust Pixie',
                "player1 gains an amber due to Dust Pixie's bonus icon",
                "player1 gains an amber due to Dust Pixie's bonus icon",
                'player1 uses Hunting Witch to gain 1 amber'
            ]);
        });
    });

    describe('lose amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['rotgrub']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should log correct message when opponent loses amber', function () {
            this.player1.play(this.rotgrub);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Rotgrub',
                'player1 uses Rotgrub to make player2 lose 1 amber'
            ]);
        });
    });

    describe('transfer amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 2,
                    inPlay: ['dextre']
                },
                player2: {
                    inPlay: ['cap-reigns']
                }
            });
        });

        it('should log correct message when transferring amber', function () {
            this.player1.reap(this.dextre);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Dextre to reap with Dextre',
                'player1 uses Dextre to transfer 1 amber from player1'
            ]);
        });
    });

    describe('place amber on a card', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['uncharted-lands']
                },
                player2: {}
            });
        });

        it('should log correct message when placing amber on a card', function () {
            this.player1.play(this.unchartedLands);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Uncharted Lands',
                'player1 uses Uncharted Lands to place 6 amber on Uncharted Lands'
            ]);
        });
    });

    describe('move amber between creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['ditch-the-loot'],
                    inPlay: ['urchin', 'hobnobber']
                },
                player2: {}
            });
            this.urchin.amber = 3;
        });

        it('should log correct message when moving amber from one creature to another', function () {
            this.player1.play(this.ditchTheLoot);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.hobnobber);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Ditch the Loot',
                "player1 gains an amber due to Ditch the Loot's bonus icon",
                'player1 uses Ditch the Loot to remove all amber from Urchin',
                'player1 uses Ditch the Loot to move 3 amber from Urchin to Hobnobber'
            ]);
        });
    });
});
