describe('Duma The Martyr', function () {
    describe("Duma The Martyr's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: [
                        'duma-the-martyr',
                        'sequis',
                        'lady-maxena',
                        'the-grey-rider',
                        'veemos-lightbringer'
                    ],
                    hand: ['anger']
                },
                player2: {
                    inPlay: ['collector-worm', 'zorg'],
                    hand: ['ammonia-clouds']
                }
            });

            this.dumaTheMartyr.tokens.damage = 2;
            this.sequis.tokens.damage = 1;
            this.ladyMaxena.tokens.damage = 1;
            this.veemosLightbringer.tokens.damage = 2;
        });

        it('should heal others if destroyed during fight', function () {
            this.player1.fightWith(this.dumaTheMartyr, this.zorg);
            expect(this.dumaTheMartyr.location).toBe('discard');
            expect(this.zorg.tokens.damage).toBe(3);
            expect(this.sequis.tokens.damage).toBeUndefined();
            expect(this.ladyMaxena.tokens.damage).toBeUndefined();
            expect(this.veemosLightbringer.tokens.damage).toBeUndefined();
            expect(this.player1.player.hand.length).toBe(3);
        });

        it('should heal others if destroyed during defense', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.fightWith(this.zorg, this.dumaTheMartyr);
            expect(this.dumaTheMartyr.location).toBe('discard');
            expect(this.zorg.tokens.damage).toBe(3);
            expect(this.sequis.tokens.damage).toBeUndefined();
            expect(this.ladyMaxena.tokens.damage).toBeUndefined();
            expect(this.veemosLightbringer.tokens.damage).toBeUndefined();
            expect(this.player1.player.hand.length).toBe(8);
        });

        it('should heal survivors if destroyed during action', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.ammoniaClouds);
            expect(this.player2).isReadyToTakeAction();
            expect(this.dumaTheMartyr.location).toBe('discard');
            expect(this.theGreyRider.location).toBe('discard');
            expect(this.sequis.tokens.damage).toBeUndefined();
            expect(this.ladyMaxena.tokens.damage).toBeUndefined();
            expect(this.collectorWorm.tokens.armor).toBe(2);
            expect(this.zorg.tokens.damage).toBe(3);
            expect(this.player1.player.hand.length).toBe(8);
        });
    });
});
