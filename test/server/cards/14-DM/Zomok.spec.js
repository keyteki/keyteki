describe('Zomok', function () {
    describe("Zomok's persistent effect ignores keywords", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['zomok', 'zomok2']
                },
                player2: {
                    inPlay: [
                        'urchin',
                        'big-sal',
                        'emperor-memrox',
                        'macis-asp',
                        'mickey-the-carver'
                    ]
                }
            });
            this.player1.play(this.zomok);
            this.zomok.ready();
        });

        it('ignores taunt and elusive while attacking', function () {
            this.player1.fightWith(this.zomok, this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.zomok.location).toBe('play area');
            expect(this.zomok.damage).toBe(0);
            expect(this.zomok.armor).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('ignores poison while attacking', function () {
            this.player1.fightWith(this.zomok, this.macisAsp);
            expect(this.macisAsp.location).toBe('discard');
            expect(this.zomok.location).toBe('play area');
        });

        it('ignores hazardous while attacking', function () {
            this.player1.fightWith(this.zomok, this.mickeyTheCarver);
            expect(this.zomok.damage).toBe(this.mickeyTheCarver.power - 2);
            expect(this.zomok.armor).toBe(0);
            expect(this.mickeyTheCarver.location).toBe('discard');
        });

        it('ignores invulnerable for after-fight damage', function () {
            expect(this.emperorMemrox.hasKeyword('invulnerable')).toBe(true);
            this.player1.player.keys.red = true;
            this.player1.fightWith(this.zomok, this.urchin);
            this.player1.clickCard(this.emperorMemrox);
            expect(this.emperorMemrox.damage).toBe(2);
        });

        it('can destroy an invulnerable creature with lethal after-fight damage', function () {
            expect(this.emperorMemrox.hasKeyword('invulnerable')).toBe(true);
            this.player1.player.keys.red = true;
            this.player1.player.keys.blue = true;
            this.player2.player.keys.red = true;
            this.player1.fightWith(this.zomok, this.urchin);
            this.player1.clickCard(this.emperorMemrox);
            this.player1.clickCard(this.emperorMemrox);
            this.player1.clickCard(this.emperorMemrox);
            expect(this.emperorMemrox.location).toBe('discard');
        });

        it('does not bypass invulnerable when Zomok is the defender', function () {
            expect(this.emperorMemrox.hasKeyword('invulnerable')).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.fightWith(this.emperorMemrox, this.zomok);
            expect(this.emperorMemrox.location).toBe('play area');
            expect(this.emperorMemrox.damage).toBe(0);
            expect(this.zomok.damage).toBe(this.emperorMemrox.power - 2);
            expect(this.zomok.armor).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not bypass poison when Zomok is the defender', function () {
            expect(this.macisAsp.hasKeyword('poison')).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.macisAsp, this.zomok);
            expect(this.zomok.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe("Zomok's after-fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['zomok', 'zomok2']
                },
                player2: {
                    inPlay: ['bumpsy', 'pen-pal', 'urchin', 'bad-penny']
                }
            });
            this.player1.play(this.zomok);
            this.zomok.ready();
        });

        it('deals 2 damage to a creature for each forged key', function () {
            this.player1.player.keys.red = true;
            this.player1.fightWith(this.zomok, this.bumpsy);
            this.player1.clickCard(this.penPal);
            expect(this.penPal.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals no damage when no keys are forged', function () {
            this.player1.fightWith(this.zomok, this.bumpsy);
            expect(this.penPal.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('forces clicking once per damage instance and can stack on a single creature', function () {
            this.player1.player.keys.red = true;
            this.player1.player.keys.blue = true;
            this.player1.fightWith(this.zomok, this.bumpsy);
            this.player1.clickCard(this.penPal);
            expect(this.player1).not.isReadyToTakeAction();
            this.player1.clickCard(this.penPal);
            expect(this.penPal.damage).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can split damage among different creatures', function () {
            this.player1.player.keys.red = true;
            this.player1.player.keys.blue = true;
            this.player1.fightWith(this.zomok, this.bumpsy);
            this.player1.clickCard(this.penPal);
            this.player1.clickCard(this.urchin);
            expect(this.penPal.damage).toBe(2);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('with 4 keys deals 4 instances of 2 damage ', function () {
            this.player1.player.keys.red = true;
            this.player1.player.keys.blue = true;
            this.player2.player.keys.red = true;
            this.player2.player.keys.blue = true;
            this.player1.fightWith(this.zomok, this.bumpsy);
            this.player1.clickCard(this.penPal);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.badPenny);
            this.player1.clickCard(this.penPal);
            expect(this.penPal.damage).toBe(4);
            expect(this.urchin.location).toBe('discard');
            expect(this.badPenny.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('counts opponent forged keys', function () {
            this.player2.player.keys.red = true;
            this.player1.fightWith(this.zomok, this.bumpsy);
            this.player1.clickCard(this.penPal);
            expect(this.penPal.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
