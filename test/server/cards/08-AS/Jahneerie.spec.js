describe('Jahneerie', function () {
    describe("Jahneerie's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    inPlay: ['jahneerie', 'echofly', 'kaspara', 'ælbia-stray']
                },
                player2: {
                    amber: 4,
                    inPlay: ['charette']
                }
            });

            this.echofly.amber = 1;
            this.charette.amber = 3;
        });

        it('should give friendly creatures with amber a reap ability to move that amber to their pool', function () {
            this.player1.reap(this.echofly);
            expect(this.echofly.amber).toBe(0);
            expect(this.player1.amber).toBe(3);

            this.player1.reap(this.kaspara);
            expect(this.player1.amber).toBe(4);

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.reap(this.charette);
            expect(this.charette.amber).toBe(3);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(5);
            this.expectReadyToTakeAction(this.player2);
        });

        it('should let creature gain the ability if they get amber on them during the reap', function () {
            this.player1.reap(this.ælbiaStray);
            expect(this.ælbiaStray.amber).toBe(0);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
