describe('Niffle Grounds', function () {
    describe("Niffle Grounds' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['mindwarper', 'niffle-grounds']
                },
                player2: {
                    inPlay: ['gamgee', 'knuckles-bolton', 'champion-anaphiel']
                }
            });
        });
        it('should have creatures with the stats we expect for testing', function () {
            expect(this.mindwarper.getKeywordValue('elusive')).toBe(1);
            expect(this.knucklesBolton.getKeywordValue('elusive')).toBe(1);
            expect(this.gamgee.getKeywordValue('elusive')).toBe(1);
        });
        it('should be able to target any creatures', function () {
            this.player1.clickCard(this.niffleGrounds);
            expect(this.player1).toHavePrompt('Niffle Grounds');
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.gamgee);
            expect(this.player1).toBeAbleToSelect(this.knucklesBolton);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.niffleGrounds);
        });
        it('should remove elusive from mindwarper without affecting other creatures', function () {
            this.player1.clickCard(this.niffleGrounds);
            expect(this.player1).toHavePrompt('Niffle Grounds');
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.gamgee);
            expect(this.player1).toBeAbleToSelect(this.knucklesBolton);
            this.player1.clickCard(this.mindwarper);
            expect(this.mindwarper.getKeywordValue('elusive')).toBe(0);
            expect(this.knucklesBolton.getKeywordValue('elusive')).toBe(1);
            expect(this.gamgee.getKeywordValue('elusive')).toBe(1);
            expect(this.championAnaphiel.getKeywordValue('taunt')).toBe(1);
        });
        it('should remove elusive from gamgee without affecting other creatures', function () {
            this.player1.clickCard(this.niffleGrounds);
            expect(this.player1).toHavePrompt('Niffle Grounds');
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.gamgee);
            expect(this.player1).toBeAbleToSelect(this.knucklesBolton);
            this.player1.clickCard(this.gamgee);
            expect(this.gamgee.getKeywordValue('elusive')).toBe(0);
            expect(this.mindwarper.getKeywordValue('elusive')).toBe(1);
            expect(this.knucklesBolton.getKeywordValue('elusive')).toBe(1);
            expect(this.championAnaphiel.getKeywordValue('taunt')).toBe(1);
        });
        it('should remove taunt from anaphiel without affecting other creatures', function () {
            this.player1.clickCard(this.niffleGrounds);
            expect(this.player1).toHavePrompt('Niffle Grounds');
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.gamgee);
            expect(this.player1).toBeAbleToSelect(this.knucklesBolton);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            this.player1.clickCard(this.championAnaphiel);
            expect(this.gamgee.getKeywordValue('elusive')).toBe(1);
            expect(this.mindwarper.getKeywordValue('elusive')).toBe(1);
            expect(this.knucklesBolton.getKeywordValue('elusive')).toBe(1);
            expect(this.championAnaphiel.getKeywordValue('taunt')).toBe(0);
        });
    });
});
