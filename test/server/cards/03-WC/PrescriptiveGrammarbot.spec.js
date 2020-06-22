describe('Prescriptive Grammarbot', function () {
    describe('Reap ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'logos',
                    inPlay: ['prescriptive-grammarbot']
                },
                player2: {
                    inPlay: ['umbra', 'nexus']
                }
            });
        });

        it('enrages a creature when it reaps', function () {
            this.player1.reap(this.prescriptiveGrammarbot);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).toHavePrompt('Prescriptive Grammarbot');
            expect(this.player1).toBeAbleToSelect(this.prescriptiveGrammarbot);
            expect(this.player1).toBeAbleToSelect(this.nexus);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.nexus);
            expect(this.nexus.tokens.enrage).toBe(1);
        });
    });
    describe('Cant escape its own Reap ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'logos',
                    inPlay: ['prescriptive-grammarbot']
                },
                player2: {}
            });
        });

        it('is forced to enrage itself if theres no other targets', function () {
            this.player1.reap(this.prescriptiveGrammarbot);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).toHavePrompt('Prescriptive Grammarbot');
            expect(this.player1).toBeAbleToSelect(this.prescriptiveGrammarbot);
            this.player1.clickCard(this.prescriptiveGrammarbot);
            expect(this.prescriptiveGrammarbot.tokens.enrage).toBe(1);
        });
    });
});
