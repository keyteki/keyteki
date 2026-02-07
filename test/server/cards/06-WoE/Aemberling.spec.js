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
            this.player1.clickPrompt('No');
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
            this.player1.clickPrompt('1');
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.forgeKey('Blue');
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.æmberling.location).toBe('play area');
        });

        it('can also spend amber on itself if enabled', function () {
            this.player1.amber = 4;
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.playUpgrade(this.theCallipygianIdeal, this.æmberling);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.forgeKey('Blue');
            expect(this.æmberling.location).toBe('discard');
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
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.forgeKey('Blue');
            expect(this.player1.amber).toBe(5);
            this.player1.clickPrompt('staralliance');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
        });

        it('cannot underpay', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Which key would you like to forge?');
            this.player1.forgeKey('Blue');
            expect(this.player1.amber).toBe(0);
            this.player1.clickPrompt('staralliance');
            expect(this.player1.player.creaturesInPlay.length).toBe(6);
        });
    });
});
