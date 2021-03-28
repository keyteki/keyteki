describe('FileTheResearcher', function () {
    describe("FileTheResearcher's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    inPlay: ['fila-the-researcher'],
                    hand: [
                        'professor-sutterkin',
                        'titan-librarian',
                        'titan-mechanic',
                        'library-of-babble'
                    ]
                },
                player2: {
                    amber: 1,
                    inPlay: ['nexus', 'brend-the-fanatic']
                }
            });
        });

        it('should draw a card when a creature is played to the left of fila', function () {
            let handSize = this.player1.hand.length;

            this.player1.playCreature(this.professorSutterkin, true);
            expect(this.player1.hand.length).toBe(handSize);
        });

        it('should draw a card when a creature is played to the right of fila', function () {
            let handSize = this.player1.hand.length;

            this.player1.playCreature(this.professorSutterkin, true);
            expect(this.player1.hand.length).toBe(handSize);
        });

        it('should draw two cards when a creature is played either side of fila', function () {
            let handSize = this.player1.hand.length;

            this.player1.playCreature(this.professorSutterkin, true);
            this.player1.playCreature(this.titanMechanic, false);
            expect(this.player1.hand.length).toBe(handSize);
        });

        it('should not draw any cards when a creature is played next to a card not fila', function () {
            let handSize = this.player1.hand.length;

            this.player1.playCreature(this.professorSutterkin, true);
            this.player1.playCreature(this.titanMechanic, true);
            expect(this.player1.hand.length).toBe(handSize - 1);
        });

        it('should not draw any cards when an artifact is played', function () {
            let handSize = this.player1.hand.length;

            this.player1.play(this.libraryOfBabble);
            expect(this.player1.hand.length).toBe(handSize - 1);
        });
    });
});
