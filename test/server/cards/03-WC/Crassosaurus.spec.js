describe('Crassosaurus', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['crassosaurus']
                },
                player2: {
                    inPlay: ['batdrone', 'dextre']
                }
            });
        });

        it('should capture from opponent and from self', function () {
            this.player1.amber = 5;
            this.player2.amber = 5;
            this.player1.play(this.crassosaurus);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('5');
            this.player1.selectOption(5);

            expect(this.crassosaurus.location).toBe('play area');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.crassosaurus.tokens.amber).toBe(10);
        });

        it('should prompt for amber capture from opponent', function () {
            this.player1.amber = 5;
            this.player2.amber = 11;
            this.player1.play(this.crassosaurus);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).not.toHavePromptButton('4');
            expect(this.player1).toHavePromptButton('5');
            expect(this.player1).toHavePromptButton('6');
            expect(this.player1).toHavePromptButton('7');
            expect(this.player1).toHavePromptButton('8');
            expect(this.player1).toHavePromptButton('9');
            expect(this.player1).toHavePromptButton('10');
            expect(this.player1).not.toHavePromptButton('11');
            expect(this.player1).not.toHavePromptButton('12');

            this.player1.selectOption(10);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);
            expect(this.crassosaurus.tokens.amber).toBe(10);
        });

        it('should prompt for amber capture from opponent and auto calculate from own', function () {
            this.player1.amber = 5;
            this.player2.amber = 11;
            this.player1.play(this.crassosaurus);

            this.player1.selectOption(8);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            expect(this.crassosaurus.tokens.amber).toBe(10);
        });

        it('should prompt for amber capture from opponent and auto calculate from own', function () {
            this.player1.amber = 11;
            this.player2.amber = 6;
            this.player1.play(this.crassosaurus);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).toHavePromptButton('4');
            expect(this.player1).toHavePromptButton('5');
            expect(this.player1).toHavePromptButton('6');
            expect(this.player1).not.toHavePromptButton('7');

            this.player1.selectOption(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(6);
            expect(this.crassosaurus.tokens.amber).toBe(10);
        });

        it('should purge when choosing to capture 1 from self and fewer than 10 total is captured', function () {
            this.player1.amber = 1;
            this.player2.amber = 3;
            this.player1.play(this.crassosaurus);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('3');
            this.player1.selectOption(3);

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.crassosaurus.location).toBe('purged');
        });

        it('should purge when choosing to capture 0 from self and fewer than 10 total is captured', function () {
            this.player1.amber = 0;
            this.player2.amber = 3;
            this.player1.play(this.crassosaurus);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('3');
            this.player1.selectOption(3);

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.crassosaurus.location).toBe('purged');
        });

        it('should purge when choosing to capture 0 from self and fewer than 10 total is captured', function () {
            this.player1.amber = 0;
            this.player2.amber = 0;
            this.player1.play(this.crassosaurus);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('0');
            this.player1.selectOption(0);

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.crassosaurus.location).toBe('purged');
        });

        it('should purge when choosing to capture 3 from self and fewer than 10 total is captured', function () {
            this.player1.amber = 3;
            this.player2.amber = 0;
            this.player1.play(this.crassosaurus);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('0');
            this.player1.selectOption(0);

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.crassosaurus.location).toBe('purged');
        });
    });

    describe('when played, should interact with Sci. Officer Morpheus', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['sci-officer-morpheus'],
                    hand: ['crassosaurus']
                },
                player2: {
                    inPlay: ['batdrone', 'dextre']
                }
            });
            this.player1.player.optionSettings.orderForcedAbilities = false;
        });

        it('and prompt once if purge when less than 10 first time', function () {
            this.player1.amber = 1;
            this.player2.amber = 3;
            this.player1.play(this.crassosaurus);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('3');
            this.player1.selectOption(3);

            expect(this.crassosaurus.location).toBe('purged');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
        });

        it('and prompt twice if captured 10 first time', function () {
            this.player1.amber = 5;
            this.player2.amber = 5;
            this.player1.play(this.crassosaurus);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('5');
            this.player1.selectOption(5);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('0');
            this.player1.selectOption(0);

            expect(this.crassosaurus.location).toBe('play area');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.crassosaurus.tokens.amber).toBe(10);
        });

        it('and prompt twice if captured 10 first time and still amber to capture', function () {
            this.player1.amber = 5;
            this.player2.amber = 6;
            this.player1.play(this.crassosaurus);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('6');
            expect(this.player1).toHavePromptButton('5');
            this.player1.selectOption(6);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('0');
            this.player1.selectOption(0);

            expect(this.crassosaurus.location).toBe('play area');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.crassosaurus.tokens.amber).toBe(11);
        });

        it('and prompt twice if captured 10 first time and still amber to capture, with multiple options twice', function () {
            this.player1.amber = 5;
            this.player2.amber = 16;
            this.player1.play(this.crassosaurus);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('10');
            expect(this.player1).toHavePromptButton('9');
            expect(this.player1).toHavePromptButton('8');
            expect(this.player1).toHavePromptButton('7');
            expect(this.player1).toHavePromptButton('6');
            expect(this.player1).toHavePromptButton('5');
            expect(this.player1).not.toHavePromptButton('4');
            this.player1.selectOption(6);

            expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            expect(this.player1).toHavePromptButton('10');
            expect(this.player1).toHavePromptButton('9');
            expect(this.player1).not.toHavePromptButton('8');
            this.player1.selectOption(10);

            expect(this.crassosaurus.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.crassosaurus.tokens.amber).toBe(20);
        });
    });
});
