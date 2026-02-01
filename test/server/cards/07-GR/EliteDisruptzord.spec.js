describe('Elite Disruptzord', function () {
    describe("Elite Disruptzord's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    inPlay: ['elite-disruptzord'],
                    hand: ['cowfyne', 'ogopogo', 'earthshaker', 'narp', 'the-fittest']
                },
                player2: {
                    inPlay: ['lapisaurus'],
                    hand: [
                        'platopelta',
                        'nerotaurus',
                        'scylla',
                        'magistrate-crispus',
                        'deusillus',
                        'deusillus2'
                    ]
                }
            });
        });

        it('should be able to play itself', function () {
            this.player1.moveCard(this.eliteDisruptzord, 'hand');
            this.player1.clickPrompt('mars');
            this.player1.clickCard(this.eliteDisruptzord);
            expect(this.player1).toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Play this creature');
        });

        it('should only block creatures above six power', function () {
            expect(this.eliteDisruptzord.location).toBe('play area');
            this.player1.clickPrompt('brobnar');
            this.player1.clickCard(this.cowfyne);
            expect(this.player1).toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Play this creature');
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.ogopogo);
            expect(this.player1).toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Play this creature');
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.earthshaker);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Discard this card');
            this.player1.endTurn();

            this.player2.clickPrompt('saurian');
            this.player2.clickCard(this.platopelta);
            expect(this.player2).toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Play this creature');
            this.player2.clickPrompt('Left');
            this.player2.clickCard(this.nerotaurus);
            expect(this.player2).toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Play this creature');
            this.player2.clickPrompt('Left');
            this.player2.clickCard(this.scylla);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Discard this card');
        });

        it('should only block creatures above seven power', function () {
            expect(this.eliteDisruptzord.location).toBe('play area');
            this.player1.clickPrompt('untamed');
            this.player1.play(this.theFittest);
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.endTurn();

            this.player1.clickPrompt('brobnar');
            this.player1.clickCard(this.earthshaker);
            expect(this.player1).toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Play this creature');
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.narp);
            expect(this.player1).not.toHavePromptButton('Play this creature');
            this.player1.clickPrompt('Discard this card');
            this.player1.endTurn();

            this.player2.clickPrompt('saurian');
            this.player2.clickCard(this.scylla);
            expect(this.player2).toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Play this creature');
            this.player2.clickPrompt('Left');
            this.player2.clickCard(this.magistrateCrispus);
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Discard this card');
        });

        it('blocks gigantic creatures being played from hand', function () {
            this.player1.clickPrompt('brobnar');
            expect(this.eliteDisruptzord.location).toBe('play area');
            this.player1.endTurn();

            this.player2.clickPrompt('saurian');
            this.player2.clickCard(this.deusillus2); // top half
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.clickCard(this.deusillus); // bottom half
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Elite Disruptzord with big Dr. Xyloxxzlphrex', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['elite-disruptzord', 'dr-xyloxxzlphrex'],
                    discard: ['mindwarper', 'zorg']
                }
            });

            this.drXyloxxzlphrex.powerCounters = 5;
        });

        it('should allow playing a Mars creature from discard with power <= 6 via Dr. Xylo despite Dr. Xylo having more power', function () {
            expect(this.drXyloxxzlphrex.power).toBe(7);
            expect(this.eliteDisruptzord.power).toBe(6);
            this.player1.reap(this.drXyloxxzlphrex);
            expect(this.player1).toHavePrompt('Dr. Xyloxxzlphrex');
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.mindwarper);
            this.player1.clickPrompt('Right');
            expect(this.mindwarper.location).toBe('play area');
            expect(this.mindwarper.exhausted).toBe(false);
        });
    });
});
