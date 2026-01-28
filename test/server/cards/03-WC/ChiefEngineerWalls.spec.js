describe('Chief Engineer Walls', function () {
    describe("Chief Engineer Walls's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['lamindra', 'chief-engineer-walls'],
                    inPlay: ['umbra', 'redlock'],
                    discard: ['helper-bot', 'bad-penny', 'rocket-boots']
                },
                player2: {
                    inPlay: ['dust-pixie', 'po-s-pixies']
                }
            });
        });

        it('on play, should allow you to select a creature:robot, or an upgrade from discard pile to return to hand', function () {
            this.player1.play(this.chiefEngineerWalls);
            this.player1.clickCard(this.chiefEngineerWalls);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.rocketBoots);
            expect(this.player1).not.toBeAbleToSelect(this.badPenny);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('hand');
        });
    });

    describe("Chief Engineer Walls's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['lamindra'],
                    inPlay: ['umbra', 'redlock', 'chief-engineer-walls'],
                    discard: ['helper-bot', 'bad-penny', 'rocket-boots']
                },
                player2: {
                    inPlay: ['dust-pixie', 'po-s-pixies']
                }
            });
        });

        it('on reap, should allow you to select a creature:robot, or an upgrade from discard pile to return to hand', function () {
            this.player1.reap(this.chiefEngineerWalls);
            this.player1.clickCard(this.chiefEngineerWalls);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.rocketBoots);
            expect(this.player1).not.toBeAbleToSelect(this.badPenny);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('hand');
        });

        it('on fight, should allow you to select a creature:robot, or an upgrade from discard pile to return to hand', function () {
            this.player1.fightWith(this.chiefEngineerWalls, this.dustPixie);
            this.player1.clickCard(this.chiefEngineerWalls);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.rocketBoots);
            expect(this.player1).not.toBeAbleToSelect(this.badPenny);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('hand');
            expect(this.chiefEngineerWalls.damage).toBe(1);
            expect(this.dustPixie.location).toBe('discard');
        });
    });

    describe("when Walls' Blaster is attached and an upgrade is discarded by blaster damage", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['walls--blaster', 'access-denied'],
                    inPlay: ['chief-engineer-walls']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should allow ordering both abilities with no blaster in discard', function () {
            this.player1.playUpgrade(this.accessDenied, this.dustPixie);
            this.player1.playUpgrade(this.wallsBlaster, this.chiefEngineerWalls);
            this.player1.clickCard(this.dustPixie);
            this.player1.reap(this.chiefEngineerWalls);

            // Choose to trigger "may" abilities
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.chiefEngineerWalls);

            // Choose which "may" ability to resolve first
            expect(this.player1).toHavePrompt('Which ability would you like to use?');
            expect(this.player1).toHavePromptButton(this.wallsBlaster.name);
            expect(this.player1).toHavePromptButton(this.chiefEngineerWalls.name);
            expect(this.player1).toHavePromptButton('Back'); // Done
            this.player1.clickPrompt(this.chiefEngineerWalls.name);

            // Resolve Walls' ability - no upgrades in discard so fizzles

            // Choose to trigger remaining "may" ability
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.chiefEngineerWalls);

            // Resolve Walls' Blaster's ability
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Walls’ Blaster');
            expect(this.player1).not.toHavePrompt('Done');
            this.player1.clickPrompt('Deal 2 damage');
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.accessDenied.location).toBe('discard');

            expect(this.player1).isReadyToTakeAction();
        });

        it("should allow ordering both abilities to skip Walls' search", function () {
            this.player1.playUpgrade(this.accessDenied, this.dustPixie);
            this.player1.playUpgrade(this.wallsBlaster, this.chiefEngineerWalls);
            this.player1.clickCard(this.dustPixie);
            this.player1.reap(this.chiefEngineerWalls);

            // Choose to trigger "may" abilities
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.chiefEngineerWalls);

            // Choose which "may" ability to resolve first
            expect(this.player1).toHavePrompt('Which ability would you like to use?');
            expect(this.player1).toHavePromptButton(this.wallsBlaster.name);
            expect(this.player1).toHavePromptButton(this.chiefEngineerWalls.name);
            expect(this.player1).toHavePromptButton('Back'); // Done
            this.player1.clickPrompt(this.wallsBlaster.name);

            // Resolve Walls' Blaster's ability
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Deal 2 damage');
            expect(this.player1).toHavePromptButton('Move Walls’ Blaster');
            expect(this.player1).not.toHavePrompt('Done');
            this.player1.clickPrompt('Deal 2 damage');
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');

            // Choose to trigger remaining "may" ability
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.chiefEngineerWalls);

            // Resolve Walls' ability
            expect(this.player1).toBeAbleToSelect(this.accessDenied);
            this.player1.clickCard(this.accessDenied);
            expect(this.accessDenied.location).toBe('hand');

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
