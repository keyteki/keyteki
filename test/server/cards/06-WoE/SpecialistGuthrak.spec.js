describe('Specialist Guthrak', function () {
    describe("Specialist Guthrak's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    hand: ['llack-gaboon'],
                    inPlay: [
                        'flaxia',
                        'away-team',
                        'specialist-guthrak',
                        'doctor-driscoll',
                        'bubbles',
                        'diplomat-agung'
                    ]
                },
                player2: {
                    amber: 5,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should capture 1 if neighbors are all staralliance on fight', function () {
            expect(this.player2.amber).toBe(5);

            this.player1.fightWith(this.specialistGuthrak, this.krump);

            expect(this.player2.amber).toBe(4);
            expect(this.specialistGuthrak.amber).toBe(1);

            this.player1.endTurn();
        });

        it('should capture 1 if neighbors are all staralliance on reap', function () {
            expect(this.player2.amber).toBe(5);

            this.player1.reap(this.specialistGuthrak);

            expect(this.player2.amber).toBe(4);
            expect(this.specialistGuthrak.amber).toBe(1);

            this.player1.endTurn();
        });

        it('should capture 3 if neighbors are different houses on reap', function () {
            expect(this.player2.amber).toBe(5);
            this.player1.moveCard(this.awayTeam, 'discard');
            this.player1.moveCard(this.doctorDriscoll, 'discard');
            this.player1.moveCard(this.diplomatAgung, 'discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);

            this.player1.reap(this.specialistGuthrak);

            expect(this.player2.amber).toBe(2);
            expect(this.specialistGuthrak.amber).toBe(3);

            this.player1.endTurn();
        });

        it('should capture 1 if neighbors are different houses on reap', function () {
            expect(this.player2.amber).toBe(5);
            this.player1.moveCard(this.awayTeam, 'discard');
            this.player1.moveCard(this.doctorDriscoll, 'discard');
            this.player1.moveCard(this.bubbles, 'discard');
            this.player1.moveCard(this.diplomatAgung, 'discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);

            this.player1.reap(this.specialistGuthrak);

            expect(this.player2.amber).toBe(3);
            expect(this.specialistGuthrak.amber).toBe(2);

            this.player1.endTurn();
        });

        it('should capture 1 if alone reap', function () {
            expect(this.player2.amber).toBe(5);
            this.player1.moveCard(this.awayTeam, 'discard');
            this.player1.moveCard(this.doctorDriscoll, 'discard');
            this.player1.moveCard(this.bubbles, 'discard');
            this.player1.moveCard(this.flaxia, 'discard');
            this.player1.moveCard(this.diplomatAgung, 'discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);

            this.player1.reap(this.specialistGuthrak);

            expect(this.player2.amber).toBe(4);
            expect(this.specialistGuthrak.amber).toBe(1);

            this.player1.endTurn();
        });

        it('should capture 4 if neighbors are different houses on reap and agung gives extra house', function () {
            expect(this.player2.amber).toBe(5);
            this.player1.moveCard(this.awayTeam, 'discard');
            this.player1.moveCard(this.doctorDriscoll, 'discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(4);

            this.player1.reap(this.diplomatAgung);
            this.player1.clickPrompt('mars');
            this.player1.clickCard(this.specialistGuthrak);

            this.player1.reap(this.specialistGuthrak);

            expect(this.player2.amber).toBe(1);
            expect(this.specialistGuthrak.amber).toBe(4);

            this.player1.endTurn();
        });
    });
});
