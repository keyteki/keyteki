describe('Captain No-Beard', function () {
    describe("Captain No-Beard's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'brobnar',
                    inPlay: ['narp']
                },
                player2: {
                    amber: 4,
                    inPlay: [
                        'lamindra',
                        'captain-no-beard',
                        'captain-no-beard-evil-twin',
                        'jackie-tar'
                    ]
                }
            });
        });

        it('when opponent has no amber, should not capture when destroyed', function () {
            this.player1.amber = 0;
            this.player1.fightWith(this.narp, this.captainNoBeardEvilTwin);

            expect(this.captainNoBeardEvilTwin.location).toBe('discard');
            expect(this.lamindra.amber).toBe(0);
            expect(this.captainNoBeard.amber).toBe(0);
            expect(this.captainNoBeardEvilTwin.amber).toBe(0);
            expect(this.jackieTar.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('when opponent has 1 amber, should prompt the neighbor', function () {
            this.player1.amber = 1;
            this.player1.fightWith(this.narp, this.captainNoBeardEvilTwin);

            expect(this.player1).toBeAbleToSelect(this.captainNoBeard);
            expect(this.player1).toBeAbleToSelect(this.jackieTar);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.captainNoBeardEvilTwin);

            this.player1.clickCard(this.captainNoBeard);

            expect(this.captainNoBeardEvilTwin.location).toBe('discard');
            expect(this.lamindra.amber).toBe(0);
            expect(this.captainNoBeard.amber).toBe(1);
            expect(this.captainNoBeardEvilTwin.amber).toBe(0);
            expect(this.jackieTar.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('when opponent has more than 2 ambers, both neighbors should capture', function () {
            this.player1.fightWith(this.narp, this.captainNoBeardEvilTwin);
            expect(this.captainNoBeardEvilTwin.location).toBe('discard');
            expect(this.lamindra.amber).toBe(0);
            expect(this.captainNoBeard.amber).toBe(1);
            expect(this.captainNoBeardEvilTwin.amber).toBe(0);
            expect(this.jackieTar.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
