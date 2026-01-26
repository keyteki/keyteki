describe('Hoist Operations', function () {
    describe("Hoist Operations's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: [
                        'hoist-operations',
                        'exchange-program',
                        'ultra-gravitron',
                        'ultra-gravitron2'
                    ],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['troll', 'flaxia']
                }
            });
            this.ultraGravitron.maverick = true;
            this.ultraGravitron.printedHouse = 'ekwidon';
            this.ultraGravitron2.maverick = true;
            this.ultraGravitron2.printedHouse = 'ekwidon';
        });

        it('should put a friendly creature in your archives', function () {
            this.player1.play(this.hoistOperations);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.dustPixie);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should put an enemy creature in their archives', function () {
            this.player1.play(this.hoistOperations);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.player2.player.archives).toContain(this.troll);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should put a swapped creature in their archives', function () {
            this.player1.play(this.exchangeProgram);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.troll);
            this.player1.play(this.hoistOperations);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.player2.player.archives).toContain(this.troll);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should archive both halves of a gigantic creature', function () {
            this.player1.play(this.ultraGravitron);
            this.player1.play(this.hoistOperations);
            this.player1.clickCard(this.ultraGravitron);
            expect(this.player1.player.archives).toContain(this.ultraGravitron);
            expect(this.player1.player.archives).toContain(this.ultraGravitron2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
