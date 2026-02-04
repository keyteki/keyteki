describe('Amberling', function () {
    describe("Amberling's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'staralliance',
                    token: 'æmberling',
                    inPlay: ['æmberling:pelf', 'first-officer-frane'],
                    hand: ['the-callipygian-ideal', 'senator-shrix']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('cannot reap', function () {
            this.player1.clickCard(this.æmberling);
            expect(this.player1).not.toHavePrompt('Reap with this Creature');
        });

        it('counts towards key cost', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.forgeKey('Blue');
            expect(this.æmberling.location).toBe('discard');
        });

        it('does not have to count towards key cost', function () {
            this.player1.amber = 6;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.forgeKey('Blue');
            expect(this.æmberling.location).toBe('play area');
        });

        it('discards wards', function () {
            this.æmberling.ward();
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.forgeKey('Blue');
            expect(this.æmberling.location).toBe('discard');
        });

        it('can use other sources of amber instead', function () {
            this.player1.amber = 4;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.playCreature(this.senatorShrix);
            this.player1.clickCard(this.senatorShrix);
            this.player1.amber = 5;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            // Select Senator Shrix as the amber source
            this.player1.clickCard(this.senatorShrix);
            this.player1.clickPrompt('1');

            // Skip using the Amberling
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.forgeKey('Blue');
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.æmberling.location).toBe('play area');
            this.player1.clickPrompt('staralliance');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can also spend amber on itself if enabled', function () {
            this.player1.amber = 4;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.playUpgrade(this.theCallipygianIdeal, this.æmberling);
            this.æmberling.amber = 2;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            // Amberling has 2 amber + the card itself
            expect(this.player1.amber).toBe(4);
            expect(this.æmberling.amber).toBe(2);
            this.player1.clickCard(this.æmberling);
            expect(this.player1).toHavePrompt('Select an amber source to use from Æmberling');
            expect(this.player1).toHavePromptButton('Spend amber tokens');
            expect(this.player1).toHavePromptButton('Spend card as amber');

            // Choose to spend the card first
            this.player1.clickPrompt('Spend card as amber');
            expect(this.æmberling.location).toBe('play area'); // Amber is not spent until key is forged
            expect(this.æmberling.amber).toBe(2);
            expect(this.player2.amber).toBe(1);

            // Now select Amberling again for its amber tokens
            expect(this.player1).toHavePrompt('How much amber do you want to use from Æmberling?');
            this.player1.clickPrompt('1');

            // Forge and spend amber and the card
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.forgeKey('Blue');
            expect(this.æmberling.location).toBe('discard');
            expect(this.player2.amber).toBe(2);
            this.player1.clickPrompt('staralliance');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can spend card and then choose tokens from multiple sources', function () {
            this.player1.amber = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.playUpgrade(this.theCallipygianIdeal, this.æmberling);
            this.player1.playCreature(this.senatorShrix);
            this.player1.clickCard(this.senatorShrix);
            this.æmberling.amber = 3;
            this.senatorShrix.amber = 4;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            expect(this.player1.amber).toBe(1);
            expect(this.æmberling.amber).toBe(3);
            expect(this.senatorShrix.amber).toBe(4);

            // Select Amberling first
            expect(this.player1).toHavePrompt('Select an amber source to use');
            this.player1.clickCard(this.æmberling);
            expect(this.player1).toHavePrompt('Select an amber source to use from Æmberling');
            expect(this.player1).toHavePromptButton('Spend amber tokens');
            expect(this.player1).toHavePromptButton('Spend card as amber');
            this.player1.clickPrompt('Spend card as amber');

            // Select Amberling again for its tokens
            expect(this.player1).toHavePrompt('Select an amber source to use');
            this.player1.clickCard(this.æmberling);
            this.player1.clickPrompt('2');

            // Senator Shrix automatically prompts for remaining 3
            expect(this.player1).toHavePrompt(
                'How much amber do you want to use from Senator Shrix?'
            );
            this.player1.clickCard(this.senatorShrix);
            this.player1.clickPrompt('2');

            // Forge and spend amber and the card
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.forgeKey('Blue'); // Amberling, Amberling 2 tokens, Shrix 2 tokens, player 1 token
            expect(this.æmberling.location).toBe('discard');
            expect(this.senatorShrix.amber).toBe(2);
            expect(this.player2.amber).toBe(2); // Opponent gains 1 from Amberling capture
            this.player1.clickPrompt('staralliance');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Amberling with The Sting', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'staralliance',
                    token: 'æmberling',
                    inPlay: ['æmberling:pelf', 'first-officer-frane']
                },
                player2: {
                    amber: 0,
                    inPlay: ['the-sting']
                }
            });
        });

        it('gives amber to opponent when forging with amberling', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.forgeKey('Blue');
            expect(this.æmberling.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(6);
            this.player1.clickPrompt('staralliance');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Amberling's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'staralliance',
                    token: 'æmberling',
                    inPlay: [
                        'æmberling:pelf',
                        'æmberling:pelf',
                        'æmberling:pelf',
                        'æmberling:pelf',
                        'æmberling:pelf',
                        'æmberling:pelf',
                        'æmberling:pelf'
                    ],
                    hand: ['teamwork']
                },
                player2: {
                    amber: 1
                }
            });

            this.a1 = this.player1.player.creaturesInPlay[0];
            this.a2 = this.player1.player.creaturesInPlay[1];
            this.a3 = this.player1.player.creaturesInPlay[2];
            this.a4 = this.player1.player.creaturesInPlay[3];
            this.a5 = this.player1.player.creaturesInPlay[4];
            this.a6 = this.player1.player.creaturesInPlay[5];
            this.a7 = this.player1.player.creaturesInPlay[6];
        });

        it('cannot overpay', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickCard(this.a1);
            this.player1.clickCard(this.a2);
            this.player1.clickCard(this.a3);
            this.player1.clickCard(this.a4);
            this.player1.clickCard(this.a5);
            this.player1.clickCard(this.a6);
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.forgeKey('Blue');
            expect(this.player1.amber).toBe(5);
            this.player1.clickPrompt('staralliance');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot underpay', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player1).not.toHavePromptButton('Done');
            this.player1.clickCard(this.a1);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.forgeKey('Blue');
            expect(this.player1.amber).toBe(0);
            this.player1.clickPrompt('staralliance');
            expect(this.player1.player.creaturesInPlay.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
