const cards = require('../../../server/game/cards');
const AbilityDsl = require('../../../server/game/abilitydsl');
const localeEn = require('../../../client/locales/en.json');

const card = {
    hasHouse: () => true,
    getHouses: () => ['brobnar'],
    isOnFlank: () => true,
    neighbors: [],
    childCards: [],
    hasTrait: () => false,
    tokens: {},
    hasToken: () => false,
    isInCenter: () => true,
    isToken: () => false,
    bonusIcons: []
};
card.neighbors.push(card);
card.neighbors.push(card);
card.childCards.push(card);
const player = {
    deck: [card],
    hand: [card],
    archives: [card],
    discard: [card],
    creaturesInPlay: [card],
    cardsInPlay: [card],
    activeHouse: 'brobnar',
    checkRestrictions: () => true,
    getForgedKeys: () => 0,
    isTideHigh: () => true,
    isTideLow: () => false,
    isHaunted: () => true,
    keys: { red: true, blue: true, yellow: true },
    getDiscardSlice: () => [],
    isOverwhelmed: () => false
};
player.opponent = player;
card.controller = player;
const mockContext = {
    event: { card: card },
    game: {
        cardsUsed: [],
        cardsPlayed: [],
        creaturesInPlay: [],
        cardsInPlay: [],
        activePlayer: player,
        getFrameworkContext: () => {},
        getPlayers: () => [player]
    },
    house: {},
    source: card,
    target: card,
    targets: {
        reveal: [card],
        two: [card],
        flank: { hasHouse: () => true, neighbors: [], childCards: [], hasTrait: () => false }
    },
    selects: {
        action: {
            choice: 'any'
        }
    },
    houses: {
        select: 'brobnar'
    },
    option: {},
    player: player
};
mockContext.event.context = mockContext;

function expectLocalizedString(str) {
    if (isNaN(str)) {
        let localeStr = str.text ? str.text : str;
        expect(localeEn[localeStr]).toBe(localeStr);
    }
}

function expectLocalizedPromptForSelect(gameAction) {
    let gameActions = Array.isArray(gameAction) ? gameAction : [gameAction];
    for (const ga of gameActions) {
        if (ga.promptForSelect && ga.promptForSelect.activePromptTitle) {
            expectLocalizedString(ga.promptForSelect.activePromptTitle);
        }

        if (ga.promptWithHandlerMenu && ga.promptWithHandlerMenu.activePromptTitle) {
            expectLocalizedString(ga.promptWithHandlerMenu.activePromptTitle);
        }
    }
}

function expectLocalizedTarget(target) {
    if (target.activePromptTitle) {
        expectLocalizedString(target.activePromptTitle);
    }

    if (target.gameAction) {
        expectLocalizedPromptForSelect(target.gameAction);
    }

    if (target.choices) {
        for (const choice of Object.keys(target.choices)) {
            expectLocalizedString(choice);
        }
    }
}

function expectLocalizedPrompt(args) {
    // This is not complete, but can get a good amount of localized strings
    // What is missing:
    // 1) then as a function
    // 2) gameAction parameter as a function
    // 3) gained abilities in upgrades, for example
    // 4) sequential/conditional actions
    if (args.may) {
        expectLocalizedString('Do you wish to ' + args.may + '?');
    }

    if (args.gameAction) {
        expectLocalizedPromptForSelect(args.gameAction);
    }

    if (args.target) {
        expectLocalizedTarget(args.target);
    }

    if (args.targets) {
        for (const target of Object.keys(args.targets)) {
            expectLocalizedTarget(args.targets[target]);
        }
    }

    if (args.then) {
        expectLocalizedPrompt(args.then);
    }
}

describe('All Cards:', function () {
    beforeEach(function () {
        this.gameSpy = {
            on: vi.fn(),
            removeListener: vi.fn(),
            addPower: vi.fn(),
            addMessage: vi.fn(),
            addEffect: vi.fn(),
            getPlayers: vi.fn().mockReturnValue([])
        };
        this.playerSpy = {
            registerAbilityMax: vi.fn(),
            game: this.gameSpy
        };
    });

    for (const cardClass of Object.values(cards)) {
        it("should be able to create '" + cardClass.name + "' and set it up", function () {
            // No explicit assertion - if this throws an exception it will fail
            // and give us a better stacktrace than the expect().not.toThrow()
            // assertion.
            new cardClass(this.playerSpy, { id: 'id' });
        });

        describe("Actions for '" + cardClass.name + "'", function () {
            beforeEach(function () {
                this.card = new cardClass(this.playerSpy, { id: 'id' });
                this.actionSpy = vi.spyOn(this.card, 'action');
                this.card.setupCardAbilities(AbilityDsl);
                this.calls = this.actionSpy.mock.calls.flat();
            });

            it('should have an string effect or a gameAction (either on the ability or one of its targets', function () {
                expect(
                    this.calls.every((args) => {
                        if (args.effect !== undefined) {
                            return typeof args.effect === 'string';
                        } else if (args.gameAction) {
                            return true;
                        } else if (args.target) {
                            if (args.target.gameAction) {
                                return true;
                            }

                            return (
                                args.target.mode &&
                                args.target.mode === 'select' &&
                                Object.values(args.target.choices).every(
                                    (choice) => typeof choice !== 'function'
                                )
                            );
                        }

                        return (
                            args.targets &&
                            Object.values(args.targets).some(
                                (target) =>
                                    target.gameAction ||
                                    (target.mode &&
                                        target.mode === 'select' &&
                                        Object.values(target.choices).every(
                                            (choice) => typeof choice !== 'function'
                                        ))
                            )
                        );
                    })
                ).toBe(true);
            });

            it('should have an effectArgs which matches effect', function () {
                expect(
                    this.calls.every((args) => {
                        if (args.effect === undefined) {
                            return true;
                        }

                        let argCount = 0;
                        let effectArgs = args.effectArgs;
                        if (typeof effectArgs === 'function') {
                            effectArgs = effectArgs(mockContext);
                        }

                        for (let i = 1; i < 10; i++) {
                            if (args.effect.includes('{' + i.toString() + '}')) {
                                argCount = i;
                            }
                        }

                        if (argCount === 0) {
                            return true;
                        } else if (argCount === 1 && !Array.isArray(effectArgs)) {
                            return true;
                        }

                        return argCount === effectArgs.length;
                    })
                ).toBe(true);
            });

            it('should have localized strings', function () {
                for (const args of this.calls) {
                    expectLocalizedPrompt(args);
                }
            });

            it('should have no condition or its condition should be a function', function () {
                expect(
                    this.calls.every(
                        (args) =>
                            args.condition === undefined || typeof args.condition === 'function'
                    )
                ).toBe(true);
            });

            it('should not have a when property', function () {
                expect(this.calls.every((args) => args.when === undefined)).toBe(true);
            });
        });

        describe("Reactions and Interrupts for '" + cardClass.name + "'", function () {
            beforeEach(function () {
                this.card = new cardClass(this.playerSpy, { id: 'id' });
                this.reactionSpy = vi.spyOn(this.card, 'reaction');
                this.interruptSpy = vi.spyOn(this.card, 'interrupt');
                this.card.setupCardAbilities(AbilityDsl);
                this.calls = this.reactionSpy.mock.calls.flat();
                this.calls = this.calls.concat(this.interruptSpy.mock.calls.flat());
            });

            it('should have an string effect or a gameAction (either on the ability or one of its targets', function () {
                expect(
                    this.calls.every((args) => {
                        if (args.effect !== undefined) {
                            return typeof args.effect === 'string';
                        } else if (args.gameAction) {
                            return true;
                        } else if (args.target) {
                            if (args.target.gameAction) {
                                return true;
                            }

                            return (
                                args.target.mode &&
                                args.target.mode === 'select' &&
                                Object.values(args.target.choices).every(
                                    (choice) => typeof choice !== 'function'
                                )
                            );
                        }

                        return (
                            args.targets &&
                            Object.values(args.targets).some(
                                (target) =>
                                    target.gameAction ||
                                    (target.mode &&
                                        target.mode === 'select' &&
                                        Object.values(target.choices).every(
                                            (choice) => typeof choice !== 'function'
                                        ))
                            )
                        );
                    })
                ).toBe(true);
            });

            it('should have localized strings', function () {
                for (const args of this.calls) {
                    expectLocalizedPrompt(args);
                }
            });

            it('should have an effectArgs which matches effect', function () {
                expect(
                    this.calls.every((args) => {
                        if (args.effect === undefined) {
                            return true;
                        }

                        let argCount = 0;
                        let effectArgs = args.effectArgs;
                        if (typeof effectArgs === 'function') {
                            effectArgs = effectArgs(mockContext);
                        }

                        for (let i = 1; i < 10; i++) {
                            if (args.effect.includes('{' + i.toString() + '}')) {
                                argCount = i;
                            }
                        }

                        if (argCount === 0) {
                            return true;
                        } else if (argCount === 1 && !Array.isArray(effectArgs)) {
                            return true;
                        }

                        return argCount === effectArgs.length;
                    })
                ).toBe(true);
            });

            it('should have at least one when property (or a play, fight or reap property)', function () {
                expect(
                    this.calls.every(
                        (args) =>
                            Object.keys(args.when).length > 0 ||
                            args.play ||
                            args.fight ||
                            args.reap
                    )
                ).toBe(true);
            });

            it('should have a function as the value for its when properties', function () {
                expect(
                    this.calls.every((args) =>
                        Object.values(args.when).every((when) => typeof when === 'function')
                    )
                ).toBe(true);
            });
        });
    }
});
