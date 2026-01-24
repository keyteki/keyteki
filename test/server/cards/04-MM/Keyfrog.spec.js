describe('Keyfrog', function () {
    describe("Keyfrog's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['keyfrog', 'senator-shrix']
                },
                player2: {
                    inPlay: ['troll', 'keyfrog'],
                    hand: ['collar-of-subordination', 'beasts--bane']
                }
            });

            this.keyfrog = this.player1.player.creaturesInPlay[0];
            this.keyfrog2 = this.player2.player.creaturesInPlay[1];
        });

        it('should not forge a key if not enough amber', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.fightWith(this.keyfrog, this.troll);
            expect(this.keyfrog.location).toBe('discard');
            expect(this.player1).not.toHavePrompt('Which key would you like to forge?');
        });

        it('should forge a key after being destroyed', function () {
            this.player1.player.amber = 6;
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.fightWith(this.keyfrog, this.troll);

            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            expect(this.player1).toHavePromptButton('Blue');
            expect(this.player1).toHavePromptButton('Yellow');
            expect(this.player1).not.toHavePromptButton('Red');
            this.player1.forgeKey('blue');

            expect(this.player1.player.getForgedKeys()).toBe(2);

            expect(this.keyfrog.location).toBe('discard');
        });

        it('should not forge a key if not enough amber, when destroyed by opponent', function () {
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.keyfrog);
            expect(this.keyfrog.location).toBe('discard');
            expect(this.player2).not.toHavePrompt('Which key would you like to forge?');
        });

        it("should choose opponent's key color", function () {
            this.player1.player.amber = 6;
            this.player1.player.keys = { red: true, blue: false, yellow: false };
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.keyfrog);

            expect(this.player1).not.toHavePrompt('Which key would you like to forge?');
            //Odd wording, because your opponent is the one who actually gets the key.
            expect(this.player2).toHavePrompt('Which key would you like to forge?');
            expect(this.player2).toHavePromptButton('Blue');
            expect(this.player2).toHavePromptButton('Yellow');
            expect(this.player2).not.toHavePromptButton('Red');
            this.player2.forgeKey('blue');

            expect(this.player1.player.getForgedKeys()).toBe(2);
            expect(this.player2.player.getForgedKeys()).toBe(0);

            expect(this.keyfrog.location).toBe('discard');
        });

        it("should end the game when it is the last key and not controller's turn", function () {
            this.player1.player.amber = 6;
            this.player1.player.keys = { red: true, blue: true, yellow: false };
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.keyfrog);

            expect(this.player1.player.getForgedKeys()).toBe(3);
            expect(this.player2.player.getForgedKeys()).toBe(0);

            expect(this.player1).toHavePrompt('player1 has won the game!');
            expect(this.player2).toHavePrompt('player1 has won the game!');
        });

        it("should end the game when it is the last key and controller's turn", function () {
            this.player1.player.amber = 6;
            this.player1.player.keys = { red: true, blue: false, yellow: true };
            this.player1.fightWith(this.keyfrog, this.troll);

            expect(this.player1.player.getForgedKeys()).toBe(3);
            expect(this.player2.player.getForgedKeys()).toBe(0);

            expect(this.player1).toHavePrompt('player1 has won the game!');
            expect(this.player2).toHavePrompt('player1 has won the game!');
        });

        it('should prompt to choose which keyfrog triggers first', function () {
            this.player1.player.amber = 6;
            this.player1.player.keys = { red: true, blue: false, yellow: true };
            this.player2.player.amber = 6;
            this.player2.player.keys = { red: true, blue: false, yellow: true };
            this.player1.fightWith(this.keyfrog, this.keyfrog2);

            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).toBeAbleToSelect(this.keyfrog2);

            this.player1.clickCard(this.keyfrog);

            expect(this.player1.player.getForgedKeys()).toBe(3);
            expect(this.player2.player.getForgedKeys()).toBe(2);

            expect(this.player1).toHavePrompt('player1 has won the game!');
            expect(this.player2).toHavePrompt('player1 has won the game!');
        });

        it('should forge a key when destroying a controlled creature', function () {
            this.player2.moveCard(this.keyfrog2, 'discard');
            this.player2.moveCard(this.troll, 'discard');
            this.player2.player.amber = 5;
            this.player2.player.keys = { red: true, blue: false, yellow: true };

            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.playUpgrade(this.collarOfSubordination, this.keyfrog);
            this.player2.play(this.beastsBane);
            this.player2.clickCard(this.keyfrog);

            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.getForgedKeys()).toBe(3);

            expect(this.player1).toHavePrompt('player2 has won the game!');
            expect(this.player2).toHavePrompt('player2 has won the game!');
        });

        it('opponent should decide how much amber to use from cards that allow using amber', function () {
            this.player1.player.amber = 4;
            this.senatorShrix.tokens.amber = 10;
            this.player1.player.keys = { red: true, blue: false, yellow: false };

            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.keyfrog);

            expect(this.player2).toHavePrompt(
                'How much amber do you want to use from Senator Shrix?'
            );
            this.player2.clickPrompt('2');
            expect(this.player1).not.toHavePrompt('Which key would you like to forge?');
            //Odd wording, because your opponent is the one who actually gets the key.
            expect(this.player2).toHavePrompt('Which key would you like to forge?');
            expect(this.player2).toHavePromptButton('Blue');
            expect(this.player2).toHavePromptButton('Yellow');
            expect(this.player2).not.toHavePromptButton('Red');
            this.player2.forgeKey('blue');

            expect(this.player1.amber).toBe(0);
            expect(this.senatorShrix.amber).toBe(8);
            expect(this.player1.player.getForgedKeys()).toBe(2);
            expect(this.player2.player.getForgedKeys()).toBe(0);
        });
    });

    describe("Keyfrog's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'untamed',
                    token: 'grumpus',
                    hand: ['gĕzdrutyŏ-the-arcane', 'unsuspecting-prey'],
                    inPlay: ['keyfrog', 'creed-of-nurture']
                },
                player2: {}
            });
        });

        it('should not forge if flipped into a token creature', function () {
            expect(this.player1.player.getForgedKeys()).toBe(0);
            this.keyfrog.ready();

            // Flip Keyfrog - this does not remove Keyfrog from play
            this.player1.useAction(this.creedOfNurture, true);
            this.player1.clickCard(this.gĕzdrutyŏTheArcane);
            this.player1.clickCard(this.keyfrog);
            this.player1.useAction(this.keyfrog); // Steal 2 and flip with Gĕzdrutyŏ's action
            expect(this.keyfrog.isToken()).toBe(true);
            expect(this.keyfrog.name).toBe('Grumpus');
            expect(this.player1.player.getForgedKeys()).toBe(0);

            // Destroy the Grumpus:Keyfrog - now Keyfrog is considered to be leaving play
            this.player1.play(this.unsuspectingPrey);
            this.player1.clickCard(this.keyfrog);
            this.player1.clickPrompt('Done');
            expect(this.keyfrog.location).toBe('discard');
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Keyfrog's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'untamed',
                    hand: ['gĕzdrutyŏ-the-arcane', 'unsuspecting-prey'],
                    inPlay: ['keyfrog', 'creed-of-nurture']
                },
                player2: {}
            });
        });

        it('should not forge if flipped and discarded', function () {
            expect(this.player1.player.getForgedKeys()).toBe(0);
            this.keyfrog.ready();

            // Flip Keyfrog - without a token creature this removes Keyfrog from play
            this.player1.useAction(this.creedOfNurture, true);
            this.player1.clickCard(this.gĕzdrutyŏTheArcane);
            this.player1.clickCard(this.keyfrog);
            this.player1.useAction(this.keyfrog); // Steal 2 and flip with Gĕzdrutyŏ's action
            expect(this.keyfrog.location).toBe('discard');
            expect(this.player1.player.amber).toBe(6);
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
