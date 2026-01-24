describe('HealOrHarm', function () {
    describe('Action test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bad-penny', 'foozle', 'groke'],
                    hand: ['heal-or-harm']
                },
                player2: {
                    inPlay: ['bumpsy', 'mother', 'helper-bot', 'alaka'],
                    amber: 2
                }
            });
            this.foozle.tokens.damage = 3;
            this.mother.tokens.damage = 3;
            this.groke.tokens.damage = 3;
            this.player1.play(this.healOrHarm);
        });

        describe('select heal', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Heal');
                expect(this.player1).toBeAbleToSelect(this.foozle);
                expect(this.player1).toBeAbleToSelect(this.mother);
                expect(this.player1).toBeAbleToSelect(this.badPenny);
                this.player1.clickCard(this.foozle);
            });

            it('Fully heal creature and gain 1A', function () {
                expect(this.foozle.damage).toBe(0);
                expect(this.mother.damage).toBe(3);
                expect(this.groke.damage).toBe(3);
                expect(this.player1.amber).toBe(1);
            });
        });

        describe('select harm', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Harm');
                expect(this.player1).toBeAbleToSelect(this.foozle);
                this.player1.clickCard(this.foozle);
                this.player1.clickCard(this.helperBot);
            });

            it('Ready and fight with creature', function () {
                expect(this.foozle.damage).toBe(4);
                expect(this.helperBot.location).toBe('discard');
            });
        });
    });

    describe('Action test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['heal-or-harm']
                },
                player2: {
                    amber: 2
                }
            });
            this.player1.play(this.healOrHarm);
        });

        describe('select heal', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Heal');
            });

            it('and gain 1A if not creatures are in play', function () {
                expect(this.player1.amber).toBe(1);
            });
        });
    });
});
