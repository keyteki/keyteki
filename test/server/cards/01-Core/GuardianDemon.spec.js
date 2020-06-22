describe('Guardian Demon', function () {
    describe("Guardian Demon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['the-terror', 'restringuntus'],
                    hand: ['guardian-demon', 'poltergeist']
                },
                player2: {
                    inPlay: ['sequis', 'gauntlet-of-command', 'ember-imp', 'commander-remiel']
                }
            });
        });

        it('should move damage when played and fighting', function () {
            this.player1.fightWith(this.theTerror, this.sequis);
            expect(this.theTerror.tokens.damage).toBe(4);
            expect(this.sequis.tokens.damage).toBe(3);
            this.player1.play(this.guardianDemon);
            expect(this.player1).toHavePrompt('Guardian Demon');
            expect(this.player1).toBeAbleToSelect(this.theTerror);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.guardianDemon);
            expect(this.player1).toBeAbleToSelect(this.restringuntus);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.theTerror);
            expect(this.player1).toHavePrompt('Guardian Demon');
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            this.player1.clickPrompt('2');
            expect(this.player1).toHavePrompt('Guardian Demon');
            expect(this.player1).not.toBeAbleToSelect(this.theTerror);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.guardianDemon);
            expect(this.player1).toBeAbleToSelect(this.restringuntus);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.commanderRemiel);
            this.player1.clickCard(this.emberImp);
            expect(this.theTerror.tokens.damage).toBe(2);
            expect(this.emberImp.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.play(this.poltergeist);
            expect(this.player1).toHavePrompt('Poltergeist');
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.player1).toHavePrompt('Gauntlet of Command');
            this.player1.clickCard(this.guardianDemon);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.commanderRemiel);
            expect(this.commanderRemiel.location).toBe('discard');
            expect(this.guardianDemon.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Guardian Demon');
            expect(this.player1).toBeAbleToSelect(this.theTerror);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).toBeAbleToSelect(this.guardianDemon);
            expect(this.player1).toBeAbleToSelect(this.restringuntus);
            this.player1.clickCard(this.guardianDemon);
            expect(this.player1).toHavePrompt('Guardian Demon');
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            this.player1.clickPrompt('2');
            expect(this.player1).toHavePrompt('Guardian Demon');
            expect(this.player1).toBeAbleToSelect(this.theTerror);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.guardianDemon);
            expect(this.player1).toBeAbleToSelect(this.restringuntus);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.commanderRemiel);
            this.player1.clickCard(this.sequis);
            expect(this.guardianDemon.tokens.damage).toBe(1);
            expect(this.sequis.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not trigger when there are no damaged creatures', function () {
            this.player1.play(this.guardianDemon);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not prompt to target a second creature if the first was not healed', function () {
            this.player1.fightWith(this.restringuntus, this.emberImp);
            expect(this.emberImp.tokens.damage).toBe(1);
            this.player1.play(this.guardianDemon);
            expect(this.player1).toHavePrompt('Guardian Demon');
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.guardianDemon);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.guardianDemon);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should deal 1 damage when only 1 damage is healed', function () {
            this.player1.fightWith(this.restringuntus, this.emberImp);
            expect(this.emberImp.tokens.damage).toBe(1);
            this.player1.play(this.guardianDemon);
            expect(this.player1).toHavePrompt('Guardian Demon');
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.emberImp);
            expect(this.player1).toHavePrompt('Guardian Demon');
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).not.toHavePromptButton('2');
            this.player1.clickPrompt('1');
            expect(this.player1).toHavePrompt('Guardian Demon');
            this.player1.clickCard(this.theTerror);
            expect(this.theTerror.tokens.damage).toBe(1);
        });
    });
});
