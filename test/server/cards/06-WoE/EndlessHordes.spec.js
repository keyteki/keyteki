describe('Endless Hordes', function () {
    describe("Endless Hordes's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'grunt',
                    hand: ['endless-hordes', 'anger']
                },
                player2: {
                    inPlay: ['bumpsy', 'dust-pixie'],
                    hand: ['champion-anaphiel']
                }
            });
        });

        it('should make the right number of tokens', function () {
            this.player1.play(this.endlessHordes);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
        });

        it('should ready and fight with each token against each enemy creature', function () {
            this.player1.play(this.endlessHordes);
            this.player1.clickPrompt('Right');
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.dustPixie);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.dustPixie.location).toBe('discard');
        });

        it('should ready and fight while ignoring taunt', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.playCreature(this.championAnaphiel, false);
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.endlessHordes);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.championAnaphiel);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.dustPixie.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);

            // Ignoring taunt shouldn't persist.
            this.player1.play(this.anger);
            this.player1.clickCard(this.player1.player.creaturesInPlay[0]);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
        });
    });

    describe("Endless Hordes's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'grunt',
                    hand: ['endless-hordes', 'anger']
                },
                player2: {
                    inPlay: [
                        'bumpsy',
                        'dust-pixie',
                        'urchin',
                        'hunting-witch',
                        'dodger',
                        'groke',
                        'witch-of-the-eye'
                    ]
                }
            });
        });

        it('should obey the rule of 6', function () {
            this.player1.play(this.endlessHordes);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.huntingWitch);
            this.player1.clickCard(this.dodger);
            this.player1.clickCard(this.groke);
            expect(
                this.player1.player.creaturesInPlay[this.player1.player.creaturesInPlay.length - 1]
                    .exhausted
            ).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Endless Hordes's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'skirmisher',
                    hand: ['endless-hordes']
                },
                player2: {
                    inPlay: [
                        'eyegor',
                        'com-officer-kirby',
                        'titan-guardian',
                        'com-officer-kirby',
                        'eyegor'
                    ]
                }
            });

            this.kirby2 = this.player2.player.creaturesInPlay[3];
            this.eyegor2 = this.player2.player.creaturesInPlay[4];
        });

        it('should not care about names', function () {
            this.player1.play(this.endlessHordes);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            this.player1.clickCard(this.eyegor2);
            this.player1.clickCard(this.kirby2);
            this.player1.clickCard(this.titanGuardian);
            this.player1.clickCard(this.comOfficerKirby);
            this.player1.clickCard(this.eyegor);
            expect(this.eyegor.location).toBe('discard');
            expect(this.eyegor2.location).toBe('discard');
            expect(this.comOfficerKirby.tokens.damage).toBe(2);
            expect(this.kirby2.tokens.damage).toBe(2);
            expect(this.titanGuardian.tokens.damage).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
