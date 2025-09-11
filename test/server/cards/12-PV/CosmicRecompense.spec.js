describe('Cosmic Recompense', function () {
    describe("Cosmic Recompense's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['cosmic-recompense'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    inPlay: ['medic-ingram'],
                    amber: 1
                },
                player2: {
                    amber: 3,
                    inPlay: ['krump', 'ember-imp', 'troll'],
                    hand: ['anger']
                }
            });
        });

        it('should deal 3 damage and steal 1 amber if creature survives', function () {
            this.player1.play(this.cosmicRecompense);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.medicIngram);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not steal amber if first creature is destroyed', function () {
            this.player1.play(this.cosmicRecompense);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            this.player1.clickCard(this.krump);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not steal amber if second creature is destroyed', function () {
            this.player1.play(this.cosmicRecompense);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prevent playing, using, or discarding cards when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.cosmicRecompense);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.cosmicRecompense.location).toBe('discard');
            this.player2.clickCard(this.anger);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            this.player2.clickCard(this.troll);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
