describe('Transmutation', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'mars',
                hand: ['transmutation'],
                inPlay: ['iyxrenu-the-clever', 'john-smyth']
            },
            player2: {
                amber: 4,
                inPlay: ['troll']
            }
        });
    });

    it('adds 2 power counters to a creature, then optionally removes counters to capture', function () {
        this.player1.play(this.transmutation);
        this.player1.clickCard(this.iyxrenuTheClever);
        expect(this.iyxrenuTheClever.powerCounters).toBe(2);
        expect(this.player1).toBeAbleToSelect(this.iyxrenuTheClever);
        expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
        expect(this.player1).not.toBeAbleToSelect(this.troll);
        this.player1.clickCard(this.iyxrenuTheClever);
        expect(this.player1).toHavePromptButton('0');
        expect(this.player1).toHavePromptButton('1');
        expect(this.player1).toHavePromptButton('2');
        expect(this.player1).not.toHavePromptButton('3');
        this.player1.clickPrompt('2');
        expect(this.iyxrenuTheClever.powerCounters).toBe(0);
        expect(this.iyxrenuTheClever.amber).toBe(2);
        expect(this.player2.amber).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('can remove counters from a creature that already had power counters', function () {
        this.iyxrenuTheClever.powerCounters = 3;
        this.player1.play(this.transmutation);
        this.player1.clickCard(this.iyxrenuTheClever);
        expect(this.iyxrenuTheClever.powerCounters).toBe(5);
        this.player1.clickCard(this.iyxrenuTheClever);
        expect(this.player1).toHavePromptButton('0');
        expect(this.player1).toHavePromptButton('1');
        expect(this.player1).toHavePromptButton('2');
        expect(this.player1).toHavePromptButton('3');
        expect(this.player1).toHavePromptButton('4');
        expect(this.player1).toHavePromptButton('5');
        expect(this.player1).not.toHavePromptButton('6');
        this.player1.clickPrompt('5');
        expect(this.iyxrenuTheClever.powerCounters).toBe(0);
        expect(this.iyxrenuTheClever.amber).toBe(4);
        expect(this.player2.amber).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('skips removing counters when no friendly creature has counters', function () {
        this.player1.play(this.transmutation);
        this.player1.clickCard(this.troll);
        expect(this.troll.powerCounters).toBe(2);
        expect(this.troll.amber).toBe(0);
        expect(this.player2.amber).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
