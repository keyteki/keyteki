describe('Revived Za-Orha', function () {
    describe("Revived Za-Orha's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'ekwidon',
                    hand: ['revived-ză-orhă', 'hire-on'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['thing-from-the-deep']
                }
            });
            this.player2.player.keys.red = true;
            this.player1.chains = 36;
        });

        it('forges a key and purges if opponent has more keys', function () {
            this.player1.playCreature(this.revivedZăOrhă);
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(0);
            expect(this.revivedZăOrhă.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });

        it('forges does nothing if opponent does not have more keys', function () {
            this.player1.player.keys.red = true;
            this.player1.playCreature(this.revivedZăOrhă);
            expect(this.revivedZăOrhă.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('forges does nothing without enough amber to forge', function () {
            this.player1.amber = 5;
            this.player1.playCreature(this.revivedZăOrhă);
            expect(this.revivedZăOrhă.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        describe('after play', function () {
            beforeEach(function () {
                this.player1.amber = 5;
                this.player1.playCreature(this.revivedZăOrhă);
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.endTurn();
                this.player1.clickPrompt('ekwidon');
            });

            it('does not archive on destroy if not haunted', function () {
                this.player1.fightWith(this.revivedZăOrhă, this.thingFromTheDeep);
                expect(this.revivedZăOrhă.location).toBe('discard');
                expect(this.player1).isReadyToTakeAction();
            });

            it('archives on destroy if haunted', function () {
                this.player1.play(this.hireOn);
                this.player1.fightWith(this.revivedZăOrhă, this.thingFromTheDeep);
                expect(this.revivedZăOrhă.location).toBe('archives');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
