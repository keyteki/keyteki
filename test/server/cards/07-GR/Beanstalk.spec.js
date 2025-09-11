describe('Beanstalk', function () {
    describe("Beanstalk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['groke', 'foozle', 'bingle-bangbang'],
                    inPlay: ['beanstalk']
                },
                player2: {
                    hand: ['troll']
                }
            });
        });

        it('causes giants to enter play ready', function () {
            this.player1.playCreature(this.groke);
            this.player1.reap(this.groke);
            this.player1.playCreature(this.foozle);
            this.player1.reap(this.foozle);
        });

        it('does not cause non-giants to enter play ready', function () {
            this.player1.playCreature(this.bingleBangbang);
            expect(this.bingleBangbang.exhausted).toBe(true);
        });

        it('does not work for the opponent', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.playCreature(this.troll);
            expect(this.troll.exhausted).toBe(true);
        });

        it('can search deck for a giant', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.moveCard(this.groke, 'deck');
            this.player1.moveCard(this.foozle, 'deck');
            this.player1.moveCard(this.bingleBangbang, 'deck');
            this.player1.useAction(this.beanstalk);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).toBeAbleToSelect(this.foozle);
            expect(this.player1).not.toBeAbleToSelect(this.bingleBangbang);
            this.player1.clickCard(this.groke);
            this.player1.clickPrompt('Done');
            expect(this.groke.location).toBe('hand');
            expect(this.foozle.location).toBe('deck');
            expect(this.bingleBangbang.location).toBe('deck');
            expect(shuffled).toBe(this.player1.player);
        });

        it('can search discard for a giant', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.moveCard(this.groke, 'discard');
            this.player1.moveCard(this.foozle, 'discard');
            this.player1.moveCard(this.bingleBangbang, 'discard');
            this.player1.useAction(this.beanstalk);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).toBeAbleToSelect(this.foozle);
            expect(this.player1).not.toBeAbleToSelect(this.bingleBangbang);
            this.player1.clickCard(this.groke);
            this.player1.clickPrompt('Done');
            expect(this.groke.location).toBe('hand');
            expect(this.foozle.location).toBe('discard');
            expect(this.bingleBangbang.location).toBe('discard');
            expect(shuffled).toBe(this.player1.player);
        });
    });
});
