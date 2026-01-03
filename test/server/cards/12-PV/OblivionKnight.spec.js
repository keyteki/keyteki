describe('Oblivion Knight', function () {
    describe("Oblivion Knight's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    inPlay: ['oblivion-knight', 'krump']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'dust-pixie', 'troll']
                }
            });
        });

        it('should purge the creature it fights', function () {
            this.player1.fightWith(this.oblivionKnight, this.flaxia);
            expect(this.flaxia.location).toBe('purged');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not purge the creature it fights if that creature was destroyed', function () {
            this.player1.fightWith(this.oblivionKnight, this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not purge the creature it fights if it does not survive', function () {
            this.player1.fightWith(this.oblivionKnight, this.troll);
            expect(this.oblivionKnight.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should purge the most powerful friendly creature when fate is triggered', function () {
            this.player1.moveCard(this.oblivionKnight, 'hand');
            this.player1.activateProphecy(this.overreach, this.oblivionKnight);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            this.player2.clickCard(this.troll);
            expect(this.troll.location).toBe('purged');
            expect(this.flaxia.location).toBe('play area');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.oblivionKnight.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
