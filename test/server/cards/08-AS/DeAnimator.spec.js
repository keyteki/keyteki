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
                    inPlay: ['noddy-the-thief', 'lamindra', 'memrox-the-red', 'envoy-of-ekwirrĕ']
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
            expect(this.player1).isReadyToTakeAction();
        });

        it('should mineralize a creature on reap', function () {
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.botBookton);
            this.deAnimator.ready();
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
            expect(this.player2).isReadyToTakeAction();
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
            expect(this.player1).isReadyToTakeAction();
        });

        it('should keep creatures mineralized if one leaves play but another is still in play', function () {
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
            expect(this.player1).isReadyToTakeAction();
        });

        it('should keep creatures mineralized if tokens are swapped', function () {
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.memroxTheRed);
            this.player1.moveCard(this.deAnimator, 'hand');
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.reap(this.envoyOfEkwirrĕ);
            this.player2.clickCard(this.memroxTheRed);
            expect(this.player2).isReadyToTakeAction();
            expect(this.memroxTheRed.tokens.mineralize).toBe(undefined);
            expect(this.envoyOfEkwirrĕ.tokens.mineralize).toBe(1);
            expect(this.memroxTheRed.type).toBe('creature');
            expect(this.envoyOfEkwirrĕ.type).toBe('creature');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.lamindra);
            expect(this.memroxTheRed.type).toBe('creature');
            expect(this.lamindra.type).toBe('artifact');
            expect(this.envoyOfEkwirrĕ.type).toBe('artifact');
            expect(this.player1).isReadyToTakeAction();
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
            this.memroxTheRed.ready();
            this.player2.clickCard(this.memroxTheRed);
            this.player2.clickPrompt("Use this card's Action ability", 1);
            expect(this.memroxTheRed.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not allow wards to affect the creature as an artifact', function () {
            this.botBookton.ward();
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.botBookton);
            this.player1.playCreature(this.neutronShark);
            this.player1.clickCard(this.noddyTheThief);
            this.player1.clickCard(this.botBookton);
            expect(this.botBookton.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should keep upgrades on de-animated creatures', function () {
            this.player1.playUpgrade(this.rocketBoots, this.botBookton);
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.botBookton);
            expect(this.rocketBoots.location).toBe('play area');
            expect(this.rocketBoots.parent).toBe(this.botBookton);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow stunned creatures to use their new destroy action', function () {
            this.botBookton.stun();
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.botBookton);
            expect(this.botBookton.type).toBe('artifact');
            this.player1.clickCard(this.botBookton);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.botBookton.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should send amber on destroyed creatures as artifacts to the common supply', function () {
            this.botBookton.amber = 4;

            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.botBookton);
            expect(this.botBookton.type).toBe('artifact');

            this.player1.clickCard(this.botBookton);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.botBookton.location).toBe('discard');

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
        });
    });

    describe('De-Animator with Animating Force', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['de-animator', 'positron-bolt'],
                    inPlay: ['batdrone', 'troll']
                },
                player2: {
                    house: 'geistoid',
                    hand: ['animating-force']
                }
            });
        });

        it('should keep a mineralized creature as an artifact when Animating Force is attached while De-Animator is in play', function () {
            // Mineralize Batdrone
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.type).toBe('artifact');
            expect(this.batdrone.tokens.mineralize).toBe(1);
            expect(this.batdrone.hasKeyword('versatile')).toBe(false);
            expect(this.batdrone.power).toBe(2); // Not relevant as an artifact, but is still set
            this.player1.endTurn();

            // Animating Force Batdrone - stays an artifact
            this.player2.clickPrompt('geistoid');
            this.player2.playUpgrade(this.animatingForce, this.batdrone);
            expect(this.batdrone.type).toBe('artifact');
            expect(this.batdrone.tokens.mineralize).toBe(1);
            expect(this.batdrone.hasKeyword('versatile')).toBe(true);
            expect(this.batdrone.power).toBe(4);
            this.player2.endTurn();

            // Remove De-Animator - Batdrone becomes a creature
            this.player1.clickPrompt('logos');
            this.player1.play(this.positronBolt);
            this.player1.clickCard(this.deAnimator);
            this.player1.clickPrompt('Right'); // Move Batdrone to battleline
            expect(this.deAnimator.location).toBe('discard');
            expect(this.batdrone.type).toBe('creature');
            expect(this.batdrone.tokens.mineralize).toBe(1);
            expect(this.batdrone.hasKeyword('versatile')).toBe(true);
            expect(this.batdrone.power).toBe(4);

            // De-Animator comes back - Batdrone goes back to being an artifact
            this.player1.moveCard(this.deAnimator, 'hand');
            this.player1.playCreature(this.deAnimator);
            this.player1.clickCard(this.deAnimator);
            expect(this.batdrone.type).toBe('artifact');
            expect(this.batdrone.tokens.mineralize).toBe(1);
            expect(this.batdrone.hasKeyword('versatile')).toBe(true);
            expect(this.batdrone.power).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
