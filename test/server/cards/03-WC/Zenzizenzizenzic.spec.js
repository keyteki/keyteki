describe('Zenzizenzizenzic', function () {
    describe("Zenzizenzizenzic's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['zenzizenzizenzic'],
                    hand: [
                        'archimedes',
                        'hexpion',
                        'pip-pip',
                        'professor-sutterkin',
                        'brain-eater',
                        'research-smoko'
                    ]
                },
                player2: {
                    inPlay: ['zorg']
                }
            });
        });
        it('draw +2 cards if in center [1]', function () {
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(8);
        });
        it('NOT draw +2 cards if in center [2]', function () {
            this.player1.play(this.archimedes);
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(6);
        });
        it('draw +2 cards if in center [3]', function () {
            this.player1.play(this.archimedes);
            this.player1.play(this.hexpion, true);
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(8);
        });
    });
});
