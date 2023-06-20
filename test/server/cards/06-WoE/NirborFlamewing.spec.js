describe('Nirbor Flamewing', function () {
    describe("Nirbor Flamewing's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    token: 'grunt',
                    inPlay: ['nirbor-flamewing', 'pelf'],
                    hand: ['nirbor-flamewing']
                },
                player2: {
                    inPlay: ['kelifi-dragon']
                }
            });

            this.nirborFlamewing2 = this.player1.player.hand[0];
        });

        it('makes a token creature when destroyed', function () {
            this.player1.fightWith(this.nirborFlamewing, this.kelifiDragon);
            this.player1.clickPrompt('Right');
            expect(this.nirborFlamewing.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
        });

        it('allows returning and readying when in discard at start of turn', function () {
            this.player1.fightWith(this.nirborFlamewing, this.kelifiDragon);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            this.player1.clickCard(this.nirborFlamewing);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.player1.player.creaturesInPlay[1]);
            expect(this.player2).not.toBeAbleToSelect(this.kelifiDragon);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Right');
            expect(this.nirborFlamewing.location).toBe('play area');
            expect(this.nirborFlamewing.exhausted).toBe(false);
            expect(this.pelf.location).toBe('discard');

            this.player1.clickPrompt('brobnar');
            this.player1.reap(this.nirborFlamewing);
            expect(this.player1.amber).toBe(2);
        });

        it('does not allow returning when creature is warded', function () {
            this.player1.fightWith(this.nirborFlamewing, this.kelifiDragon);
            this.player1.clickPrompt('Right');
            this.pelf.tokens.ward = 1;
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            this.player1.clickCard(this.nirborFlamewing);
            this.player1.clickCard(this.pelf);
            expect(this.nirborFlamewing.location).toBe('discard');
            this.player1.clickPrompt('brobnar');
            expect(this.pelf.location).toBe('play area');
        });

        it('allows not returning', function () {
            this.player1.fightWith(this.nirborFlamewing, this.kelifiDragon);
            this.player1.clickPrompt('Right');
            this.pelf.tokens.ward = 1;
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('brobnar');
            expect(this.nirborFlamewing.location).toBe('discard');
            expect(this.pelf.location).toBe('play area');
        });

        it('allows for arbitrary token creature when you have 2 in the discard', function () {
            this.player1.fightWith(this.nirborFlamewing, this.kelifiDragon);
            this.player1.clickPrompt('Right'); // Token1
            this.player1.clickCard(this.nirborFlamewing2);
            this.player1.clickPrompt('Discard this card');
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            console.log('ABOUT TO END TURN');
            this.player2.endTurn();

            this.player1.clickCard(this.nirborFlamewing); // Resurrect
            this.player1.clickCard(this.pelf); // Destroy for Nirbor1
            this.player1.clickPrompt('Right'); // Nirbor1

            this.player1.clickCard(this.nirborFlamewing2); // Resurrect
            this.player1.clickCard(this.nirborFlamewing); // Destroy for Nirbor2
            this.player1.clickPrompt('Right'); // Token2 for destroying Nirbor1
            this.player1.clickPrompt('Right'); // Nirbor2 reborn

            this.player1.clickCard(this.nirborFlamewing); // Resurrect
            this.player1.clickCard(this.nirborFlamewing2); // Destroy for Nirbor2
            this.player1.clickPrompt('Right'); // Token3 for destroying Nirbor2
            this.player1.clickPrompt('Right'); // Nirbor1 reborn

            this.player1.clickCard(this.nirborFlamewing2); // Resurrect
            this.player1.clickCard(this.nirborFlamewing); // Destroy for Nirbor2
            this.player1.clickPrompt('Right'); // Token4 for destroying Nirbor
            this.player1.clickPrompt('Right'); // Nirbor2 reborn

            this.player1.clickPrompt('Done');

            // 1 flamewing, and 4 tokens.
            expect(this.player1.player.creaturesInPlay.length).toBe(5);

            this.player1.clickPrompt('brobnar');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
