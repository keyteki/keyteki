describe('Centurion Stenopius', function () {
    describe("Centurion Stenopius' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['questor-jarta'],
                    hand: ['centurion-stenopius']
                },
                player2: {
                    amber: 3,
                    inPlay: ['groke', 'grovekeeper']
                }
            });
        });

        it('should not increase power if no exalt', function () {
            this.player1.playCreature(this.centurionStenopius);

            expect(this.player1).toHavePrompt('Any reactions to Centurion Stenopius being played?');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.centurionStenopius.hasToken('amber')).toBe(false);
        });
        it('should increase power +3 after exalt', function () {
            this.player1.playCreature(this.centurionStenopius);

            expect(this.player1).toBeAbleToSelect(this.centurionStenopius);
            this.player1.clickCard(this.centurionStenopius);

            expect(this.centurionStenopius.tokens.amber).toBe(1);
            expect(this.centurionStenopius.power).toBe(6);
        });
    });
    describe("Centurion Stenopius' reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['questor-jarta', 'centurion-stenopius']
                },
                player2: {
                    amber: 3,
                    inPlay: ['groke', 'grovekeeper']
                }
            });
        });

        it('should not increase power if no exalt', function () {
            this.player1.reap(this.centurionStenopius);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
        });

        it('should increase power +6 after exalt', function () {
            this.centurionStenopius.tokens.amber = 1;

            this.player1.reap(this.centurionStenopius);

            expect(this.player1).toBeAbleToSelect(this.centurionStenopius);
            this.player1.clickCard(this.centurionStenopius);

            expect(this.centurionStenopius.tokens.amber).toBe(2);
            expect(this.centurionStenopius.power).toBe(9);
        });
    });

    describe("Centurion Stenopius' fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['questor-jarta', 'centurion-stenopius']
                },
                player2: {
                    amber: 3,
                    inPlay: ['groke', 'grovekeeper']
                }
            });
        });

        it('should not increase power if no exalt', function () {
            this.player1.fightWith(this.centurionStenopius, this.grovekeeper);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
        });

        it('should increase power +9 after exalt', function () {
            this.centurionStenopius.tokens.amber = 2;

            this.player1.fightWith(this.centurionStenopius, this.grovekeeper);

            expect(this.player1).toBeAbleToSelect(this.centurionStenopius);
            this.player1.clickCard(this.centurionStenopius);

            expect(this.centurionStenopius.tokens.amber).toBe(3);
            expect(this.centurionStenopius.power).toBe(12);
        });
    });
});
