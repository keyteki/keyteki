describe('Director of Z.Y.X.', function () {
    describe("Director of Z.Y.X.'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['archimedes'],
                    hand: [
                        'director-of-zyx',
                        'gub',
                        'gub',
                        'gub',
                        'gub',
                        'gub',
                        'gub',
                        'phase-shift',
                        'the-sting'
                    ],
                    discard: ['eureka', 'dextre']
                },
                player2: {
                    hand: ['screechbomb', 'grump-buggy', 'miasma']
                }
            });

            this.player1.moveCard(this.dextre, 'deck');
            this.player1.moveCard(this.eureka, 'deck');
        });

        it("should archive at the start of owner's turn only", function () {
            this.player1.play(this.directorOfZyx);
            this.player1.endTurn();
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.eureka.location).toBe('archives');
            expect(this.dextre.location).toBe('deck');
            this.player1.clickPrompt('logos');
            this.player1.clickPrompt('no');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player2.player.archives.length).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.eureka.location).toBe('archives');
            expect(this.dextre.location).toBe('archives');
        });

        it('should not archive any card if deck is empty', function () {
            this.player1.play(this.directorOfZyx);
            this.player1.endTurn();
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
            this.player2.clickPrompt('shadows');
            this.player1.player.deck = [];
            this.player2.endTurn();
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
        });

        it('should not be affected by miasma', function () {
            this.player1.play(this.directorOfZyx);
            this.player1.endTurn();
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
            this.player1.player.amber = 10;

            this.player2.clickPrompt('shadows');
            this.player2.play(this.miasma);
            this.player2.endTurn();

            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.eureka.location).toBe('archives');
            expect(this.dextre.location).toBe('deck');
            this.player1.clickPrompt('logos');
            this.player1.clickPrompt('no');
            this.player1.endTurn();
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player2.player.archives.length).toBe(0);
        });

        it('should not be affected by the sting', function () {
            this.player1.play(this.phaseShift);
            this.player1.play(this.theSting);
            this.player1.player.amber = 10;

            this.player1.play(this.directorOfZyx);
            this.player1.endTurn();
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.eureka.location).toBe('archives');
            expect(this.dextre.location).toBe('deck');
            this.player1.clickPrompt('logos');
            this.player1.clickPrompt('no');
            expect(this.player1.player.archives.length).toBe(1);
            expect(this.player2.player.archives.length).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.eureka.location).toBe('archives');
            expect(this.dextre.location).toBe('archives');
        });
    });
});
