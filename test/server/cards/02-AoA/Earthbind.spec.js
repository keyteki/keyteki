describe('Earthbind', function () {
    describe("Earthbind's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['flaxia', 'gebuk'],
                    hand: ['earthbind', 'bumblebird', 'punctuated-equilibrium', 'mimicry'],
                    discard: ['nepenthe-seed'],
                    amber: 1
                },
                player2: {
                    inPlay: ['troll'],
                    discard: ['mind-barb'],
                    hand: ['brammo', 'brammo', 'brammo', 'brammo'],
                    amber: 3
                }
            });
        });

        it('should not be able to use if no card is discarded', function () {
            this.player1.playUpgrade(this.earthbind, this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });

        it('should be able to use if a card is discarded by the player', function () {
            this.player1.playUpgrade(this.earthbind, this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickCard(this.bumblebird);
            this.player1.clickPrompt('Discard this card');
            expect(this.bumblebird.location).toBe('discard');
            this.player1.clickCard(this.flaxia);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
        });

        it('should be able to use if a card is discarded through effect of other cards', function () {
            this.player1.playUpgrade(this.earthbind, this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.play(this.punctuatedEquilibrium);
            // Both players have cards to discard, so we get prompted for order
            expect(this.player1).toHavePrompt('Choose which player discards first');
            this.player1.clickPrompt('Me');
            this.player1.clickCard(this.flaxia);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
        });

        it('should not be able to use if an opponent card is discarded', function () {
            this.player1.playUpgrade(this.earthbind, this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player2.player.hand.length).toBe(4);
            this.player1.play(this.mimicry);
            this.player1.clickCard(this.mindBarb);
            expect(this.player2.player.hand.length).toBe(3);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });

        it('should not be able to use if a card is discarded from deck', function () {
            this.player1.moveCard(this.mimicry, 'deck');
            this.player1.playUpgrade(this.earthbind, this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.fightWith(this.gebuk, this.troll);
            expect(this.gebuk.location).toBe('discard');
            expect(this.mimicry.location).toBe('discard');
            this.player1.clickCard(this.flaxia);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });
    });
});
