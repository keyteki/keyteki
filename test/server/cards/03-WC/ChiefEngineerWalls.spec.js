describe('Chief Engineer Walls', function () {
    describe("Chief Engineer Walls's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['lamindra', 'chief-engineer-walls'],
                    inPlay: ['umbra', 'redlock'],
                    discard: ['helper-bot', 'bad-penny', 'rocket-boots']
                },
                player2: {
                    inPlay: ['dust-pixie', 'po-s-pixies']
                }
            });
        });

        it('on play, should allow you to select a creature:robot, or an upgrade from discard pile to return to hand', function () {
            this.player1.play(this.chiefEngineerWalls);
            this.player1.clickCard(this.chiefEngineerWalls);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.rocketBoots);
            expect(this.player1).not.toBeAbleToSelect(this.badPenny);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('hand');
        });
    });

    describe("Chief Engineer Walls's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['lamindra'],
                    inPlay: ['umbra', 'redlock', 'chief-engineer-walls'],
                    discard: ['helper-bot', 'bad-penny', 'rocket-boots']
                },
                player2: {
                    inPlay: ['dust-pixie', 'po-s-pixies']
                }
            });
        });

        it('on reap, should allow you to select a creature:robot, or an upgrade from discard pile to return to hand', function () {
            this.player1.reap(this.chiefEngineerWalls);
            this.player1.clickCard(this.chiefEngineerWalls);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.rocketBoots);
            expect(this.player1).not.toBeAbleToSelect(this.badPenny);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('hand');
        });

        it('on fight, should allow you to select a creature:robot, or an upgrade from discard pile to return to hand', function () {
            this.player1.fightWith(this.chiefEngineerWalls, this.dustPixie);
            this.player1.clickCard(this.chiefEngineerWalls);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.rocketBoots);
            expect(this.player1).not.toBeAbleToSelect(this.badPenny);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('hand');
            expect(this.chiefEngineerWalls.tokens.damage).toBe(1);
            expect(this.dustPixie.location).toBe('discard');
        });
    });
});
