describe('Saurarium test While in play', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'saurian',
                inPlay: ['senator-shrix', 'philophosaurus', 'questor-jarta', 'saurarium']
            },
            player2: {
                hand: ['bad-penny']
            }
        });
    });

    describe('creature with higher than lowest power', function () {
        beforeEach(function () {
            this.player1.clickCard(this.senatorShrix);
        });

        it('can reap', function () {
            expect(this.player1).toHavePromptButton('Reap with this creature');
        });
    });

    describe('creature with higher than lowest power', function () {
        beforeEach(function () {
            this.player1.clickCard(this.philophosaurus);
        });

        it('can reap', function () {
            expect(this.player1).toHavePromptButton('Reap with this creature');
        });
    });

    describe('creature with lowest power', function () {
        beforeEach(function () {
            this.player1.clickCard(this.questorJarta);
        });

        it('cannot reap', function () {
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });
    });

    describe('enemy creature with lowest power', function () {
        beforeEach(function () {
            this.player2.moveCard(this.badPenny, 'play area');
            this.player1.clickCard(this.questorJarta);
        });

        it('lets lowest friendly reap', function () {
            expect(this.player1).toHavePromptButton('Reap with this creature');
        });
    });
});
