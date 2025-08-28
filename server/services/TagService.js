const logger = require('../log.js');
const db = require('../db');

class TagService {
    constructor(configService) {
        this.configService = configService;
    }

    async getTagsForUser(user) {
        try {
            const tags = await db.query(
                'SELECT "Id" as id, "Name" as name, "Color" as color, "CreatedAt" as "createdAt" ' +
                    'FROM "Tags" ' +
                    'WHERE "UserId" = $1 ' +
                    'ORDER BY "Name" ASC',
                [user.id]
            );

            return tags;
        } catch (error) {
            logger.error('Error getting tags for user', error);
            throw new Error('Unable to get tags');
        }
    }

    async createTag(user, tagData) {
        try {
            // Check if user already has 10 tags
            const existingTagsCount = await db.query(
                'SELECT COUNT("Id") as count FROM "Tags" WHERE "UserId" = $1',
                [user.id]
            );

            if (existingTagsCount[0]?.count >= 10) {
                throw new Error('User cannot have more than 10 tags');
            }

            // Check if tag name already exists for this user
            const existingTag = await db.query(
                'SELECT "Id" FROM "Tags" WHERE "UserId" = $1 AND "Name" = $2',
                [user.id, tagData.name]
            );

            if (existingTag.length > 0) {
                throw new Error('Tag name already exists');
            }

            const tag = await db.query(
                'INSERT INTO "Tags" ("UserId", "Name", "Color", "CreatedAt", "UpdatedAt") ' +
                    'VALUES ($1, $2, $3, $4, $5) ' +
                    'RETURNING "Id" as id, "Name" as name, "Color" as color, "CreatedAt" as "createdAt"',
                [user.id, tagData.name, tagData.color || '#007bff', new Date(), new Date()]
            );

            return tag[0];
        } catch (error) {
            logger.error('Error creating tag', error);
            throw error;
        }
    }

    async updateTag(user, tagId, tagData) {
        try {
            // Verify tag belongs to user
            const existingTag = await db.query(
                'SELECT "Id", "Name", "Color" FROM "Tags" WHERE "Id" = $1 AND "UserId" = $2',
                [tagId, user.id]
            );

            if (existingTag.length === 0) {
                throw new Error('Tag not found');
            }

            // Check if new name conflicts with existing tag
            if (tagData.name && tagData.name !== existingTag[0].Name) {
                const conflictingTag = await db.query(
                    'SELECT "Id" FROM "Tags" WHERE "UserId" = $1 AND "Name" = $2 AND "Id" != $3',
                    [user.id, tagData.name, tagId]
                );

                if (conflictingTag.length > 0) {
                    throw new Error('Tag name already exists');
                }
            }

            // Build update query dynamically
            let setClause = '"UpdatedAt" = $3';
            let values = [tagId, user.id, new Date()];
            let paramIndex = 4;

            if (tagData.name) {
                setClause += `, "Name" = $${paramIndex}`;
                values.push(tagData.name);
                paramIndex++;
            }
            if (tagData.color) {
                setClause += `, "Color" = $${paramIndex}`;
                values.push(tagData.color);
                paramIndex++;
            }

            const tag = await db.query(
                `UPDATE "Tags" SET ${setClause} ` +
                    'WHERE "Id" = $1 AND "UserId" = $2 ' +
                    'RETURNING "Id" as id, "Name" as name, "Color" as color, "CreatedAt" as "createdAt"',
                values
            );

            return tag[0];
        } catch (error) {
            logger.error('Error updating tag', error);
            throw error;
        }
    }

    async deleteTag(user, tagId) {
        try {
            // Verify tag belongs to user
            const existingTag = await db.query(
                'SELECT "Id" FROM "Tags" WHERE "Id" = $1 AND "UserId" = $2',
                [tagId, user.id]
            );

            if (existingTag.length === 0) {
                throw new Error('Tag not found');
            }

            // Delete the tag (DeckTags will be deleted via CASCADE)
            await db.query('DELETE FROM "Tags" WHERE "Id" = $1 AND "UserId" = $2', [
                tagId,
                user.id
            ]);

            return true;
        } catch (error) {
            logger.error('Error deleting tag', error);
            throw error;
        }
    }

    async assignTagToDeck(user, deckId, tagId) {
        try {
            // Verify deck belongs to user
            const deck = await db.query(
                'SELECT "Id" FROM "Decks" WHERE "Id" = $1 AND "UserId" = $2',
                [deckId, user.id]
            );

            if (deck.length === 0) {
                throw new Error('Deck not found');
            }

            // Verify tag belongs to user
            const tag = await db.query(
                'SELECT "Id" FROM "Tags" WHERE "Id" = $1 AND "UserId" = $2',
                [tagId, user.id]
            );

            if (tag.length === 0) {
                throw new Error('Tag not found');
            }

            // Check if deck already has 10 tags
            const existingTagsCount = await db.query(
                'SELECT COUNT("Id") as count FROM "DeckTags" WHERE "DeckId" = $1',
                [deckId]
            );

            if (existingTagsCount[0]?.count >= 10) {
                throw new Error('Deck cannot have more than 10 tags');
            }

            // Check if assignment already exists
            const existingAssignment = await db.query(
                'SELECT "Id", "DeckId", "TagId" FROM "DeckTags" WHERE "DeckId" = $1 AND "TagId" = $2',
                [deckId, tagId]
            );

            if (existingAssignment.length > 0) {
                return {
                    id: existingAssignment[0].Id,
                    deckId: existingAssignment[0].DeckId,
                    tagId: existingAssignment[0].TagId
                };
            }

            const assignment = await db.query(
                'INSERT INTO "DeckTags" ("DeckId", "TagId", "CreatedAt") ' +
                    'VALUES ($1, $2, $3) ' +
                    'RETURNING "Id" as id, "DeckId" as "deckId", "TagId" as "tagId"',
                [deckId, tagId, new Date()]
            );

            return assignment[0];
        } catch (error) {
            logger.error('Error assigning tag to deck', error);
            throw error;
        }
    }

    async removeTagFromDeck(user, deckId, tagId) {
        try {
            // Verify deck belongs to user
            const deck = await db.query(
                'SELECT "Id" FROM "Decks" WHERE "Id" = $1 AND "UserId" = $2',
                [deckId, user.id]
            );

            if (deck.length === 0) {
                throw new Error('Deck not found');
            }

            // Remove the assignment
            await db.query('DELETE FROM "DeckTags" WHERE "DeckId" = $1 AND "TagId" = $2', [
                deckId,
                tagId
            ]);

            return true;
        } catch (error) {
            logger.error('Error removing tag from deck', error);
            throw error;
        }
    }

    async getTagsForDeck(user, deckId) {
        try {
            // Verify deck belongs to user
            const deck = await db.query(
                'SELECT "Id" FROM "Decks" WHERE "Id" = $1 AND "UserId" = $2',
                [deckId, user.id]
            );

            if (deck.length === 0) {
                throw new Error('Deck not found');
            }

            const tags = await db.query(
                'SELECT t."Id" as id, t."Name" as name, t."Color" as color ' +
                    'FROM "Tags" t ' +
                    'JOIN "DeckTags" dt ON t."Id" = dt."TagId" ' +
                    'WHERE dt."DeckId" = $1 AND t."UserId" = $2 ' +
                    'ORDER BY t."Name" ASC',
                [deckId, user.id]
            );

            return tags;
        } catch (error) {
            logger.error('Error getting tags for deck', error);
            throw error;
        }
    }
}

module.exports = TagService;
