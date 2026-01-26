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

            this.dumaTheMartyr.damage = 2;
            this.sequis.damage = 1;
            this.ladyMaxena.damage = 1;
            this.veemosLightbringer.damage = 2;
        });

        it('should heal others if destroyed during fight', function () {
            this.player1.fightWith(this.dumaTheMartyr, this.zorg);
            expect(this.dumaTheMartyr.location).toBe('discard');
            expect(this.zorg.damage).toBe(3);
            expect(this.sequis.damage).toBe(0);
            expect(this.ladyMaxena.damage).toBe(0);
            expect(this.veemosLightbringer.damage).toBe(0);
            expect(this.player1.player.hand.length).toBe(3);
        });

        it('should heal others if destroyed during defense', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.fightWith(this.zorg, this.dumaTheMartyr);
            expect(this.dumaTheMartyr.location).toBe('discard');
            expect(this.zorg.damage).toBe(3);
            expect(this.sequis.damage).toBe(0);
            expect(this.ladyMaxena.damage).toBe(0);
            expect(this.veemosLightbringer.damage).toBe(0);
            expect(this.player1.player.hand.length).toBe(8);
        });

        it('should heal survivors if destroyed during action', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.ammoniaClouds);
            expect(this.player2).isReadyToTakeAction();
            expect(this.dumaTheMartyr.location).toBe('discard');
            expect(this.theGreyRider.location).toBe('discard');
            expect(this.sequis.damage).toBe(0);
            expect(this.ladyMaxena.damage).toBe(0);
            expect(this.collectorWorm.armor).toBe(2);
            expect(this.zorg.damage).toBe(3);
            expect(this.player1.player.hand.length).toBe(8);
        });
    });
});
