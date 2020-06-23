describe('Master of the Grey', function () {
    describe("Master of the Grey's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'logos',
                    inPlay: ['fission-bloom', 'pismire'],
                    hand: [
                        'phase-shift',
                        'wild-bounty',
                        'neuro-syphon',
                        'krrrzzzaaap',
                        'shadow-of-dis',
                        'harland-mindlock'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['master-of-the-grey'],
                    hand: ['virtuous-works']
                }
            });
        });

        it('should block normal bonus amber on cards', function () {
            this.player1.play(this.neuroSyphon);

            expect(this.player1.amber).toBe(4);
        });

        it('should not block the controllers bonus icons', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.virtuousWorks);

            expect(this.player2.amber).toBe(5);
        });

        it('should block the original controllers bonus icons after being stolen', function () {
            this.player1.play(this.harlandMindlock);
            this.player1.clickCard(this.masterOfTheGrey);
            this.player1.clickPrompt('left');
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.virtuousWorks);

            expect(this.player2.amber).toBe(2);
        });

        it('should block the doubling effect of fission bloom', function () {
            this.player1.useAction(this.fissionBloom);
            this.player1.play(this.neuroSyphon);

            expect(this.player1.amber).toBe(4);
        });

        it('should block the doubling effect of wild bounty bloom', function () {
            this.player1.play(this.phaseShift);
            this.player1.play(this.wildBounty);
            this.player1.play(this.neuroSyphon);

            expect(this.player1.amber).toBe(4);
        });

        it('should not block bonus amber or doubling effects after being destroyed', function () {
            this.player1.play(this.krrrzzzaaap);
            this.player1.play(this.phaseShift);
            this.player1.play(this.wildBounty);
            this.player1.play(this.neuroSyphon);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(6);
        });

        it('should not block bonus amber or doubling effects after being stolen', function () {
            this.player1.play(this.harlandMindlock);
            this.player1.clickCard(this.masterOfTheGrey);
            this.player1.clickPrompt('left');
            this.player1.play(this.phaseShift);
            this.player1.play(this.wildBounty);
            this.player1.play(this.neuroSyphon);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(6);
        });

        it('should not block bonus amber or doubling effects after abilities are removed', function () {
            this.player1.play(this.phaseShift);
            this.player1.play(this.shadowOfDis);
            this.player1.useAction(this.fissionBloom);
            this.player1.play(this.neuroSyphon);

            expect(this.player1.amber).toBe(6);
        });

        it('should block enhancements and doubling effects', function () {
            this.phaseShift.cardData.enhancements = ['amber', 'draw', 'capture', 'damage'];
            this.player1.useAction(this.fissionBloom);
            this.player1.play(this.phaseShift);

            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            expect(this.pismire.tokens.damage).toBeUndefined();
            expect(this.masterOfTheGrey.tokens.damage).toBeUndefined();
            expect(this.player1.player.hand.length).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not block enhancements or doubling effects after being destroyed', function () {
            this.phaseShift.cardData.enhancements = ['amber', 'draw', 'capture', 'damage'];
            this.player1.play(this.krrrzzzaaap);
            this.player1.useAction(this.fissionBloom);
            this.player1.play(this.phaseShift);

            expect(this.player1).toHavePrompt(
                'Choose a creature to capture amber due to bonus icon'
            );
            this.player1.clickCard(this.pismire);
            expect(this.player1).toHavePrompt('Choose a creature to damage due to bonus icon');
            this.player1.clickCard(this.pismire);
            expect(this.player1).toHavePrompt(
                'Choose a creature to capture amber due to bonus icon'
            );
            this.player1.clickCard(this.pismire);
            expect(this.player1).toHavePrompt('Choose a creature to damage due to bonus icon');
            this.player1.clickCard(this.pismire);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(0);
            expect(this.pismire.tokens.damage).toBe(2);
            expect(this.pismire.tokens.amber).toBe(2);
            expect(this.player1.player.hand.length).toBe(6);
        });
    });
});
