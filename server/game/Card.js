const _ = require('underscore');

const AbilityDsl = require('./abilitydsl.js');
const CardAction = require('./cardaction.js');
const EffectSource = require('./EffectSource.js');
const TriggeredAbility = require('./triggeredability');

const DiscardAction = require('./BaseActions/DiscardAction');
const PlayAction = require('./BaseActions/PlayAction');
const PlayCreatureAction = require('./BaseActions/PlayCreatureAction');
const PlayArtifactAction = require('./BaseActions/PlayArtifactAction');
const PlayUpgradeAction = require('./BaseActions/PlayUpgradeAction');
const ResolveFightAction = require('./GameActions/ResolveFightAction');
const ResolveReapAction = require('./GameActions/ResolveReapAction');
const RemoveStun = require('./BaseActions/RemoveStun');

class Card extends EffectSource {
    constructor(owner, cardData) {
        super(owner.game);
        this.owner = owner;
        this.cardData = cardData;

        this.id = cardData.id;
        this.printedName = cardData.name;
        this.image = cardData.image;
        this.setDefaultController(owner);

        this.printedType = cardData.type;
        this.composedPart = null;
        this.tokens = {};
        this.gigantic = false;

        this.abilities = {
            actions: [],
            reactions: [],
            persistentEffects: [],
            keywordReactions: [],
            keywordPersistentEffects: []
        };
        this.traits = cardData.traits || [];
        this.printedKeywords = {};
        for (let keyword of cardData.keywords || []) {
            let split = keyword.split(':');
            let value = 1;
            if (split.length > 1) {
                value = parseInt(split[1]);
            }

            this.printedKeywords[split[0]] = value;
            this.persistentEffect({
                location: 'any',
                effect: AbilityDsl.effects.addKeyword({ [split[0]]: value })
            });
        }

        this.printedHouse = cardData.house;
        this.cardPrintedAmber = cardData.amber;
        this.maverick = cardData.maverick;
        this.anomaly = cardData.anomaly;
        this.enhancements = cardData.enhancements;

        this.upgrades = [];
        this.parent = null;
        this.purgedBy = null;
        this.childCards = [];
        this.purgedCards = [];
        this.clonedNeighbors = null;
        this.clonedPurgedCards = null;

        this.printedPower = cardData.power;
        this.printedArmor = cardData.armor;
        this.armorUsed = 0;
        this.exhausted = false;
        this.stunned = false;
        this.moribund = false;
        this.isFighting = false;

        this.locale = cardData.locale;

        this.menu = [
            { command: 'exhaust', text: 'Exhaust/Ready', menu: 'main' },
            { command: 'tokens', text: 'Modify Tokens', menu: 'main' },
            { command: 'control', text: 'Give control', menu: 'main' },
            { command: 'main', text: 'Back', menu: 'tokens' },
            { command: 'addDamage', text: 'Add 1 damage', menu: 'tokens' },
            { command: 'remDamage', text: 'Remove 1 damage', menu: 'tokens' },
            { command: 'addPower', text: 'Add 1 power token', menu: 'tokens' },
            { command: 'remPower', text: 'Remove 1 power token', menu: 'tokens' },
            { command: 'addAmber', text: 'Add 1 amber', menu: 'tokens' },
            { command: 'remAmber', text: 'Remove 1 amber', menu: 'tokens' },
            { command: 'stun', text: 'Stun/Remove Stun', menu: 'tokens' },
            { command: 'ward', text: 'Ward/Remove Ward', menu: 'tokens' },
            { command: 'enrage', text: 'Enrage/Remove Enrage', menu: 'tokens' }
        ];

        this.endRound();
        this.modifiedPower = undefined;
    }

    getTopCard() {
        return this;
    }

    getBottomCard() {
        return this;
    }

    get name() {
        const copyEffect = this.mostRecentEffect('copyCard');
        return copyEffect ? copyEffect.printedName : this.printedName;
    }

    get type() {
        return this.mostRecentEffect('changeType') || this.printedType;
    }

    isToken() {
        return this.sumEffects('flipToken') % 2 === 1;
    }

    get actions() {
        if (this.isBlank()) {
            return [];
        }

        let actions = this.abilities.actions;
        if (this.anyEffect('copyCard')) {
            let mostRecentEffect = _.last(
                this.effects.filter((effect) => effect.type === 'copyCard')
            );
            actions = mostRecentEffect.value.getActions(this);
        }

        let effectActions = this.getEffects('gainAbility').filter(
            (ability) => ability.abilityType === 'action'
        );
        return actions.concat(effectActions);
    }

    get reactions() {
        return this.getReactions();
    }

    getReactions(ignoreBlank = false) {
        if (this.isBlank() && !ignoreBlank) {
            return this.abilities.keywordReactions;
        }

        const TriggeredAbilityTypes = ['interrupt', 'reaction'];
        let reactions = this.abilities.reactions;
        if (this.anyEffect('copyCard')) {
            let mostRecentEffect = _.last(
                this.effects.filter((effect) => effect.type === 'copyCard')
            );
            reactions = mostRecentEffect.value.getReactions(this);
        }

        let effectReactions = this.getEffects('gainAbility').filter((ability) =>
            TriggeredAbilityTypes.includes(ability.abilityType)
        );
        reactions = reactions.concat(this.abilities.keywordReactions, effectReactions);

        if (this.isBlankFight() && !ignoreBlank) {
            reactions = reactions.filter((reaction) => !reaction.properties.fight);
        }

        if (
            this.type === 'action' &&
            !this.controller.checkRestrictions('resolveActionPlayEffects')
        ) {
            reactions = reactions.filter((reaction) => !reaction.properties.play);
        }

        return reactions;
    }

    get persistentEffects() {
        return this.getPersistentEffects();
    }

    getPersistentEffects(ignoreBlank = false) {
        if (this.isBlank() && !ignoreBlank) {
            return this.abilities.keywordPersistentEffects;
        }

        let persistentEffects = this.abilities.persistentEffects;
        if (this.anyEffect('copyCard')) {
            let mostRecentEffect = _.last(
                this.effects.filter((effect) => effect.type === 'copyCard')
            );
            persistentEffects = mostRecentEffect.value.getPersistentEffects(this);
        }

        let gainedPersistentEffects = this.getEffects('gainAbility').filter(
            (ability) => ability.abilityType === 'persistentEffect'
        );

        let result = persistentEffects.concat(
            this.abilities.keywordPersistentEffects,
            gainedPersistentEffects
        );

        return result;
    }

    get bonusIcons() {
        if (this.anyEffect('copyCard')) {
            return this.mostRecentEffect('copyCard').bonusIcons;
        }

        if (this.anyEffect('modifyBonusIcons')) {
            return this.mostRecentEffect('modifyBonusIcons');
        }

        let printedAmber = this.getTopCard().cardPrintedAmber;
        let enhancements = this.getTopCard().enhancements;

        let result = printedAmber ? Array.from(Array(printedAmber), () => 'amber') : [];
        return enhancements ? result.concat(enhancements) : result;
    }

    setupAbilities() {
        this.setupKeywordAbilities(AbilityDsl);
        this.setupCardAbilities(AbilityDsl);
    }

    /**
     * Create card abilities by calling subsequent methods with appropriate properties
     * @param ability - object containing limits, costs, effects, and game actions
     */
    // eslint-disable-next-line no-unused-vars
    setupCardAbilities(ability) {}

    setupKeywordAbilities(ability) {
        // Assault
        this.abilities.keywordReactions.push(
            this.interrupt({
                title: 'Assault',
                printedAbility: false,
                when: {
                    onFight: (event, context) => event.attacker === context.source
                },
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.source.getKeywordValue('assault'),
                    target: context.event.card,
                    damageSource: context.source,
                    damageType: 'assault'
                }))
            })
        );

        // Hazardous
        this.abilities.keywordReactions.push(
            this.interrupt({
                title: 'Hazardous',
                printedAbility: false,
                when: {
                    onFight: (event, context) => event.card === context.source
                },
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.source.getKeywordValue('hazardous'),
                    target: context.event.attacker,
                    damageSource: context.source,
                    damageType: 'hazardous'
                }))
            })
        );

        // Taunt
        this.abilities.keywordPersistentEffects.push(
            this.persistentEffect({
                condition: () => !!this.getKeywordValue('taunt') && this.type === 'creature',
                printedAbility: false,
                match: (card) => this.neighbors.includes(card) && !card.getKeywordValue('taunt'),
                effect: ability.effects.cardCannot('attackDueToTaunt')
            })
        );

        // enraged
        this.abilities.keywordPersistentEffects.push(
            this.persistentEffect({
                printedAbility: false,
                condition: () => {
                    return this.hasToken('enrage') && this.type === 'creature';
                },
                match: this,
                effect: AbilityDsl.effects.mustFightIfAble()
            })
        );

        // warded
        this.abilities.keywordReactions.push(
            this.interrupt({
                when: {
                    onCardDestroyed: (event, context) =>
                        event.card === context.source && context.source.warded,
                    onCardPurged: (event, context) =>
                        event.card === context.source && context.source.warded,
                    onCardLeavesPlay: (event, context) =>
                        event.card === context.source && context.source.warded
                },
                autoResolve: true,
                effect: 'remove its ward token',
                gameAction: [
                    AbilityDsl.actions.changeEvent((context) => ({
                        event: context.event,
                        cancel: true,
                        postHandler: (context) => (context.event.card.moribund = false)
                    })),
                    AbilityDsl.actions.removeWard()
                ]
            })
        );

        // Invulnerable
        this.abilities.keywordPersistentEffects.push(
            this.persistentEffect({
                condition: () => !!this.getKeywordValue('invulnerable'),
                printedAbility: false,
                match: this,
                effect: [
                    ability.effects.cardCannot('damage'),
                    ability.effects.cardCannot('destroy')
                ]
            })
        );
    }

    /**
     * @typedef {('play area'|'discard'|'archives'|'being played'|'draw')} CardLocation
     */

    /**
     * @typedef PlayProperties
     * @property {CardLocation} location The location this effect can trigger from
     * @property {function(any): boolean} condition An expression that returns whether this effect is allowed to trigger
     * @property {string} effect The text added to the game log when this effect triggers
     * @property {function(any): [any]} effectArgs A function that returns the arguments to the effect string
     */

    play(properties) {
        if (this.type === 'action') {
            properties.location = properties.location || 'being played';
        }

        return this.reaction(Object.assign({ play: true, name: 'Play' }, properties));
    }

    fight(properties) {
        return this.reaction(Object.assign({ fight: true, name: 'Fight' }, properties));
    }

    reap(properties) {
        return this.reaction(Object.assign({ reap: true, name: 'Reap' }, properties));
    }

    destroyed(properties) {
        return this.interrupt(
            Object.assign(
                {
                    when: {
                        onCardLeavesPlay: (event, context) =>
                            event.triggeringEvent &&
                            event.triggeringEvent.name === 'onCardDestroyed' &&
                            event.card === context.source
                    },
                    destroyed: true
                },
                properties
            )
        );
    }

    omni(properties) {
        properties.omni = true;
        return this.action(properties);
    }

    action(properties) {
        const action = new CardAction(this.game, this, properties);
        if (action.printedAbility) {
            this.abilities.actions.push(action);
        }

        return action;
    }

    beforeFight(properties) {
        return this.interrupt(
            Object.assign(
                { when: { onFight: (event, context) => event.attacker === context.source } },
                properties
            )
        );
    }

    triggeredAbility(abilityType, properties) {
        const ability = new TriggeredAbility(this.game, this, abilityType, properties);
        if (ability.printedAbility) {
            this.abilities.reactions.push(ability);
        }

        return ability;
    }

    reaction(properties) {
        if (properties.play || properties.fight || properties.reap) {
            properties.when = {
                onCardPlayed: (event, context) => event.card === context.source,
                onFight: (event, context) => event.attacker === context.source,
                onReap: (event, context) => event.card === context.source
            };
        }

        return this.triggeredAbility('reaction', properties);
    }

    interrupt(properties) {
        return this.triggeredAbility('interrupt', properties);
    }

    /**
     * Applies an effect that continues as long as the card providing the effect
     * is both in play and not blank.
     */
    persistentEffect(properties) {
        const allowedLocations = ['any', 'play area'];
        let location = properties.location || 'play area';
        if (!allowedLocations.includes(location)) {
            throw new Error(`'${location}' is not a supported effect location.`);
        }

        let ability = _.extend(
            {
                abilityType: 'persistentEffect',
                duration: 'persistentEffect',
                location: location,
                printedAbility: true
            },
            properties
        );
        if (ability.printedAbility) {
            this.abilities.persistentEffects.push(ability);
        }

        return ability;
    }

    hasTrait(trait) {
        if (!trait) {
            return false;
        }

        trait = trait.toLowerCase();
        return this.getTraits().includes(trait);
    }

    getTraits(printed = false) {
        if (printed) {
            return this.getBottomCard().traits;
        }
        let copyEffect = this.mostRecentEffect('copyCard');
        let traits = copyEffect ? copyEffect.traits : this.getBottomCard().traits;
        return _.uniq(traits.concat(this.getEffects('addTrait')));
    }

    getHouses() {
        let combinedHouses = [];

        if (this.anyEffect('changeHouse')) {
            combinedHouses = combinedHouses.concat(this.getEffects('changeHouse'));
        } else {
            let copyEffect = this.mostRecentEffect('copyCard');
            combinedHouses.push(copyEffect ? copyEffect.printedHouse : this.printedHouse);
        }

        if (this.anyEffect('addHouse')) {
            combinedHouses = combinedHouses.concat(this.getEffects('addHouse'));
        }

        return combinedHouses;
    }

    hasHouse(house) {
        if (!house) {
            return false;
        }

        house = house.toLowerCase();
        let copyEffect = this.mostRecentEffect('copyCard');
        let currentHouse;
        if (this.anyEffect('changeHouse')) {
            currentHouse = this.getEffects('changeHouse');
        } else {
            currentHouse = [copyEffect ? copyEffect.printedHouse : this.printedHouse];
        }

        return currentHouse.includes(house) || this.getEffects('addHouse').includes(house);
    }

    applyAnyLocationPersistentEffects() {
        _.each(this.persistentEffects, (effect) => {
            if (effect.location === 'any') {
                effect.ref = this.addEffectToEngine(effect);
            }
        });
    }

    onLeavesPlay() {
        if (this.type === 'creature' && this.hasToken('amber') && this.controller.opponent) {
            this.game.actions
                .gainAmber({ amount: this.tokens.amber })
                .resolve(this.controller.opponent, this.game.getFrameworkContext());
        }

        this.exhausted = false;
        this.stunned = false;
        this.moribund = false;
        this.new = false;
        this.tokens = {};
        this.setDefaultController(this.owner);
        this.updateEffectContexts();
        this.endRound();
    }

    endRound() {
        this.armorUsed = 0;
        this.elusiveUsed = false;
    }

    updateAbilityEvents(from, to) {
        _.each(this.getReactions(true), (reaction) => {
            if (reaction.location.includes(to) && !reaction.location.includes(from)) {
                reaction.registerEvents();
            } else if (!reaction.location.includes(to) && reaction.location.includes(from)) {
                reaction.unregisterEvents();
            }
        });
    }

    updateEffects(from = '', to = '') {
        if (from === 'play area' || from === 'being played') {
            this.removeLastingEffects();
        }

        _.each(this.getPersistentEffects(true), (effect) => {
            if (effect.location !== 'any') {
                if (to === 'play area' && from !== 'play area') {
                    effect.ref = this.addEffectToEngine(effect);
                } else if (to !== 'play area' && from === 'play area') {
                    if (effect.ref) {
                        this.removeEffectFromEngine(effect.ref);
                    }
                    effect.ref = [];
                }
            }
        });
    }

    updateEffectContexts() {
        for (const effect of this.getPersistentEffects(true)) {
            if (effect.ref) {
                for (let e of effect.ref) {
                    e.refreshContext();
                }
            }
        }
    }

    moveTo(targetLocation) {
        let originalLocation = this.location;

        this.location = targetLocation;

        if (
            ['play area', 'discard', 'hand', 'purged', 'grafted', 'archives'].includes(
                targetLocation
            )
        ) {
            this.facedown = false;
        }

        if (originalLocation !== targetLocation) {
            this.updateAbilityEvents(originalLocation, targetLocation);
            this.updateEffects(originalLocation, targetLocation);
            this.game.emitEvent('onCardMoved', {
                card: this,
                originalLocation: originalLocation,
                newLocation: targetLocation
            });
        }
    }

    getMenu() {
        var menu = [];

        if (!this.menu.length || !this.game.manualMode || this.location !== 'play area') {
            return undefined;
        }

        if (this.facedown) {
            return [{ command: 'reveal', text: 'Reveal', menu: 'main' }];
        }

        menu.push({ command: 'click', text: 'Select Card', menu: 'main' });
        if (this.location === 'play area') {
            menu = menu.concat(this.menu);
        }

        return menu;
    }

    checkRestrictions(actionType, context = null, event = null) {
        return (
            super.checkRestrictions(actionType, context, event) &&
            (!context ||
                !context.player ||
                context.player.checkRestrictions(actionType, context, event))
        );
    }

    addToken(type, number = 1) {
        if (!number || !Number.isInteger(number)) {
            return;
        }

        if (_.isUndefined(this.tokens[type])) {
            this.tokens[type] = 0;
        }

        this.tokens[type] += number;
    }

    hasToken(type) {
        return !!this.tokens[type];
    }

    removeToken(type, number = this.tokens[type]) {
        if (!this.tokens[type]) {
            return;
        }

        this.tokens[type] -= number;

        if (this.tokens[type] < 0) {
            this.tokens[type] = 0;
        }

        if (this.tokens[type] === 0) {
            delete this.tokens[type];
        }
    }

    clearToken(type) {
        if (this.tokens[type]) {
            delete this.tokens[type];
        }
    }

    readiesDuringReadyPhase() {
        return !this.anyEffect('doesNotReady');
    }

    isBlank() {
        return this.anyEffect('blank');
    }

    isBlankFight() {
        return this.anyEffect('blankFight');
    }

    hasKeyword(keyword) {
        return !!this.getKeywordValue(keyword);
    }

    getKeywordValue(keyword) {
        keyword = keyword.toLowerCase();
        if (this.getEffects('removeKeyword').includes(keyword)) {
            return 0;
        }

        return this.getEffects('addKeyword').reduce(
            (total, keywords) => total + (keywords[keyword] ? keywords[keyword] : 0),
            0
        );
    }

    createSnapshot() {
        let clone = new Card(this.owner, this.cardData);

        clone.upgrades = this.upgrades.map((upgrade) => upgrade.createSnapshot());
        clone.effects = _.clone(this.effects);
        clone.tokens = _.clone(this.tokens);
        clone.controller = this.controller;
        clone.clonedPurgedCards = this.purgedCards;
        clone.exhausted = this.exhausted;
        clone.location = this.location;
        clone.parent = this.parent;
        clone.clonedNeighbors = this.neighbors;
        clone.traits = this.getTraits();
        clone.modifiedPower = this.getPower();
        return clone;
    }

    get power() {
        return this.getPower();
    }

    getPower(printed = false) {
        const printedPower = this.getBottomCard().printedPower;

        if (printed) {
            return printedPower;
        }

        if (this.anyEffect('setPower')) {
            return this.mostRecentEffect('setPower');
        }

        const copyEffect = this.mostRecentEffect('copyCard');

        const basePower = copyEffect ? copyEffect.printedPower : printedPower;
        return (
            basePower +
            this.sumEffects('modifyPower') +
            (this.hasToken('power') ? this.tokens.power : 0)
        );
    }

    get armor() {
        return this.getArmor();
    }

    getArmor(printed = false) {
        const printedArmor = this.getBottomCard().printedArmor;

        if (printed) {
            return printedArmor;
        }

        if (this.anyEffect('setArmor')) {
            return this.mostRecentEffect('setArmor');
        }

        const copyEffect = this.mostRecentEffect('copyCard');
        const baseArmor = copyEffect ? copyEffect.printedArmor : printedArmor;
        return baseArmor + this.sumEffects('modifyArmor');
    }

    get amber() {
        return this.hasToken('amber') ? this.tokens.amber : 0;
    }

    set amber(amber) {
        this.tokens.amber = amber;
    }

    get enraged() {
        return this.hasToken('enrage');
    }

    enrage() {
        if (!this.hasToken('enrage')) {
            this.addToken('enrage');
        }
    }

    unenrage() {
        this.clearToken('enrage');
    }

    stun() {
        this.stunned = true;
    }

    unstun() {
        this.stunned = false;
    }

    get warded() {
        return this.hasToken('ward');
    }

    ward() {
        if (!this.hasToken('ward')) {
            this.addToken('ward');
        }
    }

    unward() {
        this.clearToken('ward');
    }

    exhaust() {
        this.exhausted = true;
    }

    ready() {
        this.exhausted = false;
    }

    removeAttachment(card) {
        this.upgrades = this.upgrades.filter((c) => c !== card);
    }

    /**
     * Applies an effect with the specified properties while the current card is
     * attached to another card. By default the effect will target the parent
     * card, but you can provide a match function to narrow down whether the
     * effect is applied (for cases where the effect only applies to specific
     * characters).
     */
    whileAttached(properties) {
        this.persistentEffect({
            condition: properties.condition || (() => true),
            match: (card, context) =>
                card === this.parent && (!properties.match || properties.match(card, context)),
            targetController: 'any',
            effect: properties.effect
        });
    }

    canPlayAsUpgrade() {
        return this.anyEffect('canPlayAsUpgrade') || this.type === 'upgrade';
    }

    /**
     * Checks whether the passed card meets the upgrade restrictions (e.g.
     * Opponent cards only, specific factions, etc) for this card.
     */
    // eslint-disable-next-line no-unused-vars
    canAttach(card, context) {
        return card && card.getType() === 'creature' && this.canPlayAsUpgrade();
    }

    use(player, ignoreHouse = false) {
        let legalActions = this.getLegalActions(player, ignoreHouse);

        if (legalActions.length === 0) {
            return false;
        } else if (legalActions.length === 1) {
            let action = legalActions[0];
            if (!this.game.activePlayer.optionSettings.confirmOneClick || ignoreHouse) {
                let context = action.createContext(player);
                context.ignoreHouse = ignoreHouse;
                this.game.resolveAbility(context);
                return true;
            }
        }

        let choices = legalActions.map((action) => action.title);
        let handlers = legalActions.map((action) => () => {
            let context = action.createContext(player);
            context.ignoreHouse = ignoreHouse;
            this.game.resolveAbility(context);
        });
        if (!ignoreHouse) {
            choices = choices.concat('Cancel');
            handlers = handlers.concat(() => true);
        }

        this.game.promptWithHandlerMenu(player, {
            activePromptTitle:
                this.location === 'play area'
                    ? 'Choose an ability:'
                    : { text: 'Play {{card}}:', values: { card: this.name } },
            source: this,
            choices: choices,
            handlers: handlers
        });

        return true;
    }

    getLegalActions(player, ignoreHouse = false) {
        let actions = this.getActions();
        actions = actions.filter((action) => {
            let context = action.createContext(player);
            context.ignoreHouse = ignoreHouse;
            return !action.meetsRequirements(context);
        });
        let canFight =
            actions.findIndex((action) => action.title === 'Fight with this creature') >= 0;
        if (this.getEffects('mustFightIfAble').length > 0 && canFight) {
            actions = actions.filter((action) => action.title === 'Fight with this creature');
        }

        return actions;
    }

    getFightAction(cardCondition = null, postHandler = null, ignoreTaunt = false) {
        return this.action({
            title: 'Fight with this creature',
            fight: true,
            useCondition: (context) =>
                this.checkRestrictions('fight', context) && this.type === 'creature',
            printedAbility: false,
            target: {
                activePromptTitle: 'Choose a creature to attack',
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: cardCondition,
                gameAction: new ResolveFightAction({
                    attacker: this,
                    postHandler: postHandler,
                    ignoreTaunt: ignoreTaunt
                })
            }
        });
    }

    getReapAction() {
        return this.action({
            title: 'Reap with this creature',
            reap: true,
            useCondition: (context) =>
                this.checkRestrictions('reap', context) && this.type === 'creature',
            printedAbility: false,
            gameAction: new ResolveReapAction({})
        });
    }

    getRemoveStunAction() {
        let removeStun = new RemoveStun(this);
        // if card has an omni ability, it should allow to stun, so stun becomes omni
        removeStun.omni = this.actions.some((action) => !!action.omni);
        return removeStun;
    }

    getActions(location = this.location) {
        let actions = [];
        if (location === 'hand') {
            if (this.type === 'creature') {
                actions.push(new PlayCreatureAction(this));
            } else if (this.type === 'artifact') {
                actions.push(new PlayArtifactAction(this));
            } else if (this.type === 'action') {
                actions.push(new PlayAction(this));
            }

            if (this.canPlayAsUpgrade()) {
                actions.push(new PlayUpgradeAction(this));
            }

            actions.push(new DiscardAction(this));
        } else if (location === 'play area' && this.type === 'creature') {
            actions.push(this.getFightAction());
            actions.push(this.getReapAction());
            actions.push(this.getRemoveStunAction());
        }

        return actions.concat(this.actions.slice());
    }

    setDefaultController(player) {
        this.defaultController = player;
        this.controller = player;
    }

    getModifiedController() {
        if (this.location === 'play area') {
            return this.mostRecentEffect('takeControl') || this.defaultController;
        }

        return this.owner;
    }

    isOnFlank(flank) {
        if (this.type !== 'creature') {
            return false;
        }

        let position = this.controller.creaturesInPlay.indexOf(this);
        if (flank === 'left') {
            return (
                (this.anyEffect('consideredAsFlank') || this.neighbors.length < 2) && position === 0
            );
        } else if (flank === 'right') {
            return (
                (this.anyEffect('consideredAsFlank') || this.neighbors.length < 2) &&
                position === this.controller.creaturesInPlay.length - 1
            );
        }

        return this.anyEffect('consideredAsFlank') || this.neighbors.length < 2;
    }

    checkForIllegalAttachments() {
        if (this.type === 'artifact' && this.upgrades.length > 0) {
            this.upgrades.forEach((upgrade) => {
                upgrade.owner.moveCard(upgrade, 'discard');
            });
        }
    }

    isInCenter() {
        let creatures = this.controller.creaturesInPlay;
        if (creatures.length % 2 === 0) {
            return false;
        }

        let mid = Math.floor(creatures.length / 2);
        let centerCreature = creatures[mid];

        return this === centerCreature;
    }

    get neighbors() {
        if (this.type !== 'creature') {
            return [];
        } else if (this.clonedNeighbors) {
            return this.clonedNeighbors;
        }

        let creatures = this.controller.creaturesInPlay;
        let index = creatures.indexOf(this);
        let neighbors = [];

        if (index < 0) {
            return neighbors;
        } else if (index > 0) {
            neighbors.push(creatures[index - 1]);
        }

        if (index < creatures.length - 1) {
            neighbors.push(creatures[index + 1]);
        }

        return neighbors;
    }

    leftNeighbor() {
        let neighbor;
        if (this.type === 'creature') {
            let creatures = this.controller.creaturesInPlay;
            let index = creatures.indexOf(this);
            if (index > 0) {
                neighbor = creatures[index - 1];
            }
        }
        return neighbor;
    }

    rightNeighbor() {
        let neighbor;
        if (this.type === 'creature') {
            let creatures = this.controller.creaturesInPlay;
            let index = creatures.indexOf(this);
            if (index < creatures.length - 1) {
                neighbor = creatures[index + 1];
            }
        }
        return neighbor;
    }

    ignores(trait) {
        return this.getEffects('ignores').includes(trait);
    }

    getShortSummary() {
        let result = super.getShortSummary();

        // Include card specific information useful for UI rendering
        result.maverick = this.maverick;
        result.anomaly = this.anomaly;
        result.enhancements = this.enhancements;
        result.cardPrintedAmber = this.cardPrintedAmber;
        result.locale = this.locale;
        return result;
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let isController = activePlayer === this.controller;
        let selectionState = activePlayer.getCardSelectionState(this);

        if (!this.game.isCardVisible(this, activePlayer)) {
            return {
                cardback: this.owner.deckData.cardback,
                controller: this.controller.name,
                location: this.location,
                facedown: true,
                uuid: this.uuid,
                tokens: this.tokens,
                ...selectionState
            };
        }

        let childCards = this.childCards
            .map((card) => card.getSummary(activePlayer, hideWhenFaceup))
            .concat(this.purgedCards.map((card) => card.getSummary(activePlayer, hideWhenFaceup)));

        let state = {
            anomaly: this.anomaly,
            enhancements: this.enhancements,
            id: this.id,
            image: this.image,
            canPlay: !!(
                activePlayer === this.game.activePlayer &&
                this.game.activePlayer.activeHouse &&
                isController &&
                this.getLegalActions(activePlayer, false).length > 0
            ),
            cardback: this.owner.deckData.cardback,
            childCards: childCards,
            controlled: this.owner !== this.controller,
            exhausted: this.exhausted,
            facedown: this.facedown,
            location: this.location,
            locale: this.locale,
            menu: this.getMenu(),
            name: this.name,
            new: this.new,
            printedHouse: this.printedHouse,
            maverick: this.maverick,
            cardPrintedAmber: this.cardPrintedAmber,
            printedPower: this.printedPower,
            printedArmor: this.printedArmor,
            modifiedPower: this.getPower(),
            stunned: this.stunned,
            taunt: this.getType() === 'creature' && !!this.getKeywordValue('taunt'),
            tokens: this.tokens,
            type: this.getType(),
            gigantic: this.gigantic,
            upgrades: this.upgrades.map((upgrade) => {
                return upgrade.getSummary(activePlayer, hideWhenFaceup);
            }),
            uuid: this.uuid
        };

        return Object.assign(state, selectionState);
    }
}

module.exports = Card;
