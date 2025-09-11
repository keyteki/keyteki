describe('De-Animator', function () {
    describe("De-Animator's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    hand: [
                        'de-animator',
                        'de-animator',
                        'positron-bolt',
                        'neutron-shark',
                        'rocket-boots'
                    ],
                    inPlay: ['bot-bookton', 'seismo-entangler']
                },
                player2: {
                    amber: 1,
                    inPlay: ['noddy-the-thief', 'lamindra', 'memrox-the-red']
                }
            });

            this.deAnimator2 = this.player1.player.hand[1];
        });

        it('should mineralize a creature on play', function () {
            this.player1.playCreature(this.deAnimator);
            expect(this.player1).toBeAbleToSelect(this.deAnimator);
            expect(this.player1).toBeAbleToSelect(this.botBookton);
            expect(this.player1).toBeAbleToSelect(this.noddyTheThief);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.seismoEntangler);
            this.player1.clickCard(this.botBookton);
            expect(this.botBookton.type).toBe('artifact');
            expect(this.player1.player.creaturesInPlay).not.toContain(this.botBookton);
            expect(this.botBookton.tokens.mineralize).toBe(1);
            this.player1.clickCard(this.botBookton);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.botBookton.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should mineralize a creature on reap', function () {
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.botBookton);
            this.deAnimator.exhausted = false;
            this.player1.reap(this.deAnimator);
            this.player1.clickCard(this.noddyTheThief);
            expect(this.noddyTheThief.type).toBe('artifact');
            expect(this.player2.player.creaturesInPlay).not.toContain(this.noddyTheThief);
            expect(this.noddyTheThief.tokens.mineralize).toBe(1);
            this.player1.endTurn();

            // Can still use actions
            this.player2.clickPrompt('shadows');
            this.player2.clickCard(this.noddyTheThief);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
            this.player2.clickPrompt("Use this card's Action ability", 0);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should let mineralized creatures go back to being creatures when it leaves play', function () {
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.noddyTheThief);
            expect(this.noddyTheThief.type).toBe('artifact');
            this.player1.play(this.positronBolt);
            this.player1.clickCard(this.deAnimator);
            this.player1.clickPrompt('Right');
            expect(this.noddyTheThief.type).toBe('creature');
            expect(this.player2.player.creaturesInPlay).toContain(this.noddyTheThief);

            // But they should go back to being artifacts when another
            // one is played.
            this.player1.playCreature(this.deAnimator2);
            this.player1.clickCard(this.botBookton);
            expect(this.noddyTheThief.type).toBe('artifact');
            expect(this.botBookton.type).toBe('artifact');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should keep mineralized creatures if one leaves play but another is still in play ', function () {
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.noddyTheThief);
            this.player1.playCreature(this.deAnimator2);
            this.player1.clickCard(this.botBookton);
            expect(this.noddyTheThief.type).toBe('artifact');
            expect(this.botBookton.type).toBe('artifact');
            this.player1.play(this.positronBolt);
            this.player1.clickCard(this.deAnimator2);
            expect(this.deAnimator2.location).toBe('discard');
            expect(this.noddyTheThief.type).toBe('artifact');
            expect(this.botBookton.type).toBe('artifact');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow mineralized creatures to stack actions', function () {
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.memroxTheRed);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.moveCard(this.noddyTheThief, 'archives');
            this.player2.clickCard(this.memroxTheRed);
            this.player2.clickPrompt("Use this card's Action ability", 0);
            expect(this.player2.amber).toBe(2);
            expect(this.memroxTheRed.location).toBe('play area');
            this.memroxTheRed.exhausted = false;
            this.player2.clickCard(this.memroxTheRed);
            this.player2.clickPrompt("Use this card's Action ability", 1);
            expect(this.memroxTheRed.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not allow wards to affect the creature as an artifact', function () {
            this.botBookton.ward();
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.botBookton);
            this.player1.playCreature(this.neutronShark);
            this.player1.clickCard(this.noddyTheThief);
            this.player1.clickCard(this.botBookton);
            expect(this.botBookton.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should keep upgrades on de-animated creatures', function () {
            this.player1.playUpgrade(this.rocketBoots, this.botBookton);
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.botBookton);
            expect(this.rocketBoots.location).toBe('play area');
            expect(this.rocketBoots.parent).toBe(this.botBookton);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
