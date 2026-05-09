describe('Cancel investigation', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'dis',
                hand: ['dust-imp'],
                inPlay: ['ember-imp', 'soul-snatcher']
            },
            player2: {}
        });
    });

    it('should not gain bonus amber when cancelled', function () {
        const startAmber = this.player1.amber;
        this.player1.clickCard(this.dustImp);
        // need to choose flank
        expect(this.player1).toHavePromptButton('Cancel');
        this.player1.clickPrompt('Cancel');
        expect(this.dustImp.location).toBe('hand');
        expect(this.player1.amber).toBe(startAmber);
    });
});

describe('Cancel investigation - onCardPlayed trigger', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'untamed',
                hand: ['niffle-ape'],
                inPlay: ['harmonia', 'witch-of-the-eye']
            },
            player2: {
                inPlay: ['troll', 'troll', 'troll']
            }
        });
    });

    it('should not trigger Harmonia when cancelled', function () {
        const startAmber = this.player1.amber;
        this.player1.clickCard(this.niffleApe);
        expect(this.player1).toHavePromptButton('Cancel');
        this.player1.clickPrompt('Cancel');
        expect(this.niffleApe.location).toBe('hand');
        expect(this.player1.amber).toBe(startAmber);
    });
});
