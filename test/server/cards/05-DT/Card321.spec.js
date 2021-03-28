describe('Card 321', function () {
    describe("Card 321's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: [],
                    inPlay: ['card-321', 'deep-priest-glebe']
                },
                player2: {
                    amber: 1,
                    inPlay: [
                        'gub',
                        'dexus',
                        'streke',
                        'malison',
                        'sinestra',
                        'bonesaw',
                        'impspector'
                    ]
                }
            });
        });

        it('should add counter when opponent reaps', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');

            expect(this.card321.tokens.melerukh).toBeUndefined();
            this.player2.reap(this.gub);
            expect(this.card321.tokens.melerukh).toBe(1);

            this.player2.endTurn();
        });

        it('should become 100/100 creature when opponent reaps 6 times', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.reap(this.gub);
            this.player2.reap(this.dexus);
            this.player2.reap(this.streke);
            this.player2.reap(this.malison);
            this.player2.reap(this.sinestra);
            this.player2.reap(this.bonesaw);

            this.player2.clickPrompt('Left');
            this.player2.endTurn();

            expect(this.card321.location).toBe('play area');
            expect(this.card321.power).toBe(100);
            expect(this.card321.armor).toBe(100);

            this.player1.amber = 1;
            this.player1.clickPrompt('unfathomable');
            this.player1.reap(this.card321);
            expect(this.player1.amber).toBe(2);
        });

        it('should not get created twice', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.reap(this.gub);
            this.player2.reap(this.dexus);
            this.player2.reap(this.streke);
            this.player2.reap(this.malison);
            this.player2.reap(this.sinestra);
            this.player2.reap(this.bonesaw);

            this.player2.clickPrompt('Left');
            this.player2.reap(this.impspector);
            expect(this.player2).not.toHavePromptButton('Left');
            this.player2.endTurn();
        });

        it('should not gain counters when friendly creatures reap', function () {
            expect(this.card321.tokens.melerukh).toBeUndefined();
            this.player1.reap(this.deepPriestGlebe);
            expect(this.card321.tokens.melerukh).toBeUndefined();
        });
    });
});
