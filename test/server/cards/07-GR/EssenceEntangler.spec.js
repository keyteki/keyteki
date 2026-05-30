describe('Essence Entangler', function () {
    describe("Essence Entangler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['essence-entangler'],
                    inPlay: ['charette', 'cpo-zytar', 'away-team']
                },
                player2: {
                    inPlay: ['senator-shrix']
                }
            });
        });

        it('can modify creature power', function () {
            this.player1.playUpgrade(this.essenceEntangler, this.senatorShrix);
            expect(this.senatorShrix.power).toBe(4);
            this.senatorShrix.amber = 3;
            this.player1.reap(this.cpoZytar);
            expect(this.senatorShrix.power).toBe(1);
            this.senatorShrix.amber = 5;
            this.player1.reap(this.awayTeam);
            expect(this.senatorShrix.location).toBe('discard');
            expect(this.player1.amber).toBe(9);
        });

        it('can move an amber on scrap', function () {
            this.charette.amber = 2;
            this.player1.scrap(this.essenceEntangler);
            this.player1.clickCard(this.charette);
            this.player1.clickCard(this.senatorShrix);
            expect(this.charette.amber).toBe(1);
            expect(this.senatorShrix.amber).toBe(1);
            expect(this.essenceEntangler.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Essence Entangler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 8,
                    house: 'staralliance',
                    hand: ['essence-entangler'],
                    inPlay: ['po-s-pixies']
                },
                player2: {
                    inPlay: ['bull-wark'],
                    hand: ['bring-low']
                }
            });
        });

        it('modifies power after mass capture', function () {
            this.bullWark.amber = 2;
            this.player1.playUpgrade(this.essenceEntangler, this.bullWark);
            expect(this.bullWark.power).toBe(2);
            expect(this.player1.amber).toBe(9);
            this.player1.endTurn();
            this.player2.clickPrompt('Sanctum');

            // Capture 4 from pool
            this.player2.play(this.bringLow);
            expect(this.player2).toBeAbleToSelect(this.bullWark);
            this.player2.clickCard(this.bullWark);
            this.player2.clickCard(this.bullWark);
            this.player2.clickCard(this.bullWark);
            this.player2.clickCard(this.bullWark);

            // Amber returns to player1: 9 + 6 = 15
            expect(this.bullWark.amber).toBe(0);
            expect(this.bullWark.location).toBe('discard');
            expect(this.player1.amber).toBe(15);
            expect(this.player2.amber).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
