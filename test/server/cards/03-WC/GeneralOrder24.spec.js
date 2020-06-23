describe('General Order 24', function () {
    describe('with no other creatures in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: [],
                    hand: [
                        'general-order-24',
                        'captain-val-jericho',
                        'navigator-ali',
                        'ganger-chieftain',
                        'shooler',
                        'malison'
                    ]
                },
                player2: {
                    house: 'shadows',
                    inPlay: [],
                    hand: ['bad-penny', 'umbra', 'chain-gang', 'eyegor']
                }
            });
        });

        it('general order 24 is activated when owner has no creatures, it gets destroyed', function () {
            this.player2.moveCard(this.badPenny, 'play area');
            this.player1.play(this.generalOrder24, 'play area');
            this.player1.endTurn();
            this.player2.clickCard(this.badPenny);
            this.player2.clickPrompt('shadows');
            this.player2.play(this.badPenny);
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            expect(this.generalOrder24.location).toBe('discard');
        });

        it('general order 24 is activated when opponent has no creatures, it gets destroyed', function () {
            this.player1.moveCard(this.navigatorAli, 'play area');
            this.player1.play(this.generalOrder24);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.generalOrder24.location).toBe('discard');
        });

        it('general order 24 is played when opponent has creatures, it forces the opponent to choose a creature', function () {
            this.player2.moveCard(this.badPenny, 'play area');
            this.player2.moveCard(this.umbra, 'play area');
            this.player2.moveCard(this.eyegor, 'play area');
            this.player1.play(this.generalOrder24);
            this.player1.endTurn();
            expect(this.player1.inPlay.length).toBe(1);
            expect(this.player2).toHavePrompt('Choose a creature to destroy');
        });

        it('general order 24 is played when opponent has creatures, it destroys the creature the opponent chooses and other cards in the house', function () {
            this.player2.moveCard(this.badPenny, 'play area');
            this.player2.moveCard(this.umbra, 'play area');
            this.player2.moveCard(this.eyegor, 'play area');
            this.player1.play(this.generalOrder24);
            this.player1.endTurn();
            expect(this.player1.inPlay.length).toBe(1);
            expect(this.player2).toHavePrompt('Choose a creature to destroy');
            this.player2.clickCard(this.badPenny);
            expect(this.player2.inPlay.length).toBe(1);
            expect(this.player2.inPlay).toContain(this.eyegor);
        });

        it('general order 24 is played when owner has creatures, it destroys the creature the owner chooses and other cards in the house', function () {
            this.player2.moveCard(this.badPenny, 'play area');
            this.player2.moveCard(this.umbra, 'play area');
            this.player2.moveCard(this.eyegor, 'play area');
            this.player1.moveCard(this.captainValJericho, 'play area');
            this.player1.moveCard(this.navigatorAli, 'play area');
            this.player1.play(this.generalOrder24);
            this.player1.endTurn();
            expect(this.player1.inPlay.length).toBe(3);
            expect(this.player2).toHavePrompt('Choose a creature to destroy');
            this.player2.clickCard(this.badPenny);
            expect(this.player2.inPlay.length).toBe(1);
            expect(this.player2.inPlay).toContain(this.eyegor);
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt('Choose a creature to destroy');
            this.player1.clickCard(this.captainValJericho);
            expect(this.player1.inPlay.length).toBe(1);
            expect(this.player1.inPlay).toContain(this.generalOrder24);
            expect(this.player2.inPlay.length).toBe(1);
        });
    });
});
