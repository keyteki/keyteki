/*eslint no-console:0 */
const commandLineArgs = require('command-line-args');
const path = require('path');
const fs = require('fs');

const optionsDefinition = [
    { name: 'name', type: String },
    { name: 'set', type: String, defaultValue: '06-WoE' },
    { name: 'verbose', type: String, defaultValue: '1' }
];

let options = commandLineArgs(optionsDefinition);

function createStub(name, setName, verbose) {
    let testFileName = name.replace(/[^a-zA-Z0-9]/g, '') + '.spec.js';
    let outputFile = path.join('.', 'test', 'server', 'cards', setName, testFileName);

    if (verbose) {
        console.log('output file: ' + outputFile);
    }

    fs.writeFileSync(outputFile, buildTestTemplate(name));
}

function buildTestTemplate(cardName) {
    return `describe('${cardName}', function () {
    describe("${cardName}'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['bubbles'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should have tests', function () {
            // TODO write your code here
        });

        // examples repo (clean bellow after use)
        /*
        it('turn ending test', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            this.player1.clickPrompt('untamed');
        });

        it('creature token', function () {
            expect(this.mookling.tokens.power).toBeUndefined();
            this.mookling.addToken('power');
            expect(this.mookling.tokens.power).toBe(1);

            expect(this.mookling.tokens.damage).toBeUndefined();
            this.mookling.addToken('damage');
            expect(this.mookling.tokens.damage).toBe(1);

            expect(this.mookling.amber).toBe(0);
            this.mookling.addToken('amber');
            expect(this.mookling.amber).toBe(1);
        });

        it('creature amber test', function () {
            this.urchin.amber = 1;
        });

        it('location tests', function () {
            expect(this.mother.location).toBe('discard');
            expect(this.mother.location).toBe('hand');
            expect(this.mother.location).toBe('deck');
            expect(this.mother.location).toBe('play area');
        });

        it('game interation selection', function () {
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.larva);
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).not.toHavePromptButton('Done');
        });

        it('basic actions tests', function () {
            this.player1.play(this.cocoon);
            this.player1.useAction(this.cocoon);
            this.player1.reap(this.cocoon);
            this.player1.fight(this.cocoon);
        });

        it('player amber test', function () {
            this.player1.amber = 2
            expect(this.player1.amber).toBe(2);
        });

        it('tide test', function () {
            this.player1.lowerTide();
            expect(this.player1.isTideHigh()).toBe(false);
            this.player1.raiseTide();
        });

        it('moving cards test', function () {
            this.player1.moveCard(this.butterfly, 'play area');
            this.player1.moveCard(this.butterfly, 'discard');
            this.player1.moveCard(this.butterfly, 'hand');
        });
        */
    });
});`;
}

createStub(options['name'], options['set'], options['verbose']);
