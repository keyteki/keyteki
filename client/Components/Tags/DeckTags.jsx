import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTags, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import {
    loadTags,
    assignTagToDeck,
    removeTagFromDeck,
    loadDecks,
    createTag
} from '../../redux/actions';
import TagPill from './TagPill';
import TagManagementModal from './TagManagementModal';

import './DeckTags.scss';

/**
 * @typedef DeckTagsProps
 * @property {Object} deck - The deck object containing tags and other properties
 */

/**
 * @param {DeckTagsProps} props
 */
const DeckTags = ({ deck }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { tags, loading, tagAssigned, tagRemoved, tagCreated, tagDeleted } = useSelector(
        (state) => ({
            tags: state.tags?.tags || [],
            loading: state.tags?.loading || false,
            tagAssigned: state.tags?.tagAssigned || false,
            tagRemoved: state.tags?.tagRemoved || false,
            tagCreated: state.tags?.tagCreated || false,
            tagDeleted: state.tags?.tagDeleted || false
        })
    );

    const [showTagModal, setShowTagModal] = useState(false);

    const [showAddTagInput, setShowAddTagInput] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#007bff');

    const colorPalette = [
        '#007bff', // Blue
        '#28a745', // Green
        '#dc3545', // Red
        '#ffc107', // Yellow
        '#17a2b8', // Cyan
        '#6f42c1', // Purple
        '#e83e8c', // Pink
        '#fd7e14', // Orange
        '#20c997', // Teal
        '#795548' // Brown
    ];

    useEffect(() => {
        dispatch(loadTags());
    }, [dispatch]);

    const deckTags = deck?.tags || [];
    const deckId = deck?.id;
    const deckTagsLength = deckTags.length;
    const availableTags = tags.filter((tag) => !deckTags.some((deckTag) => deckTag.id === tag.id));

    useEffect(() => {
        if (tagAssigned || tagRemoved || tagDeleted) {
            dispatch(
                loadDecks({
                    pageSize: 10,
                    page: 1,
                    sort: 'lastUpdated',
                    sortDir: 'desc',
                    filter: []
                })
            );
        }
    }, [tagAssigned, tagRemoved, tagDeleted, dispatch]);

    useEffect(() => {
        if (tagCreated && newTagName && deckId) {
            const createdTag = tags.find((tag) => tag.name === newTagName.trim());
            if (createdTag && deckTagsLength < 10) {
                dispatch(assignTagToDeck(deckId, createdTag.id));
            }
            setNewTagName('');
            setNewTagColor('#007bff');
            setShowAddTagInput(false);
        }
    }, [tagCreated, newTagName, tags, deckId, deckTagsLength, dispatch]);

    const handleTagToggle = (tag) => {
        if (!deck?.id) return;

        const isDeckTag = deckTags.some((deckTag) => deckTag.id === tag.id);

        if (isDeckTag) {
            dispatch(removeTagFromDeck(deck.id, tag.id));
        } else {
            if (deckTags.length < 10) {
                dispatch(assignTagToDeck(deck.id, tag.id));
            }
        }
    };

    const handleAddNewTag = () => {
        setShowTagModal(true);
    };

    const handleShowAddTagInput = () => {
        setShowAddTagInput(true);
    };

    const handleCreateAndAssignTag = () => {
        if (!newTagName.trim() || !deck?.id) return;

        const existingTag = tags.find(
            (tag) => tag.name.toLowerCase() === newTagName.trim().toLowerCase()
        );

        if (existingTag) {
            if (deckTags.length < 10) {
                dispatch(assignTagToDeck(deck.id, existingTag.id));
            }
            setNewTagName('');
            setShowAddTagInput(false);
            return;
        }

        if (tags.length >= 10) {
            return;
        }

        if (deckTags.length >= 10) {
            return;
        }

        dispatch(
            createTag({
                name: newTagName.trim(),
                color: newTagColor
            })
        );
    };

    const handleCancelAddTag = () => {
        setNewTagName('');
        setNewTagColor('#007bff');
        setShowAddTagInput(false);
    };

    if (!deck) {
        return null;
    }

    return (
        <div className='deck-tags-section'>
            <Row className='deck-tags-header'>
                <Col xs='auto'>
                    <span className='tags-title'>
                        <FontAwesomeIcon icon={faTags} className='me-2' />
                        {t('Tags')} ({deckTags.length}/10)
                    </span>
                </Col>
                <Col className='text-end'>
                    <Button
                        variant='outline-success'
                        size='sm'
                        onClick={handleShowAddTagInput}
                        className='me-2'
                        disabled={tags.length >= 10 || deckTags.length >= 10}
                    >
                        <FontAwesomeIcon icon={faPlus} className='me-1' />
                        {t('New Tag')}
                    </Button>
                    <Button variant='outline-secondary' size='sm' onClick={handleAddNewTag}>
                        {t('Manage Tags')}
                    </Button>
                </Col>
            </Row>

            {/* Current Deck Tags */}
            <Row>
                <Col>
                    <div className='tag-pills-container'>
                        {deckTags.length === 0 ? (
                            <span className='text-muted'>{t('No tags assigned to this deck')}</span>
                        ) : (
                            deckTags.map((tag) => (
                                <TagPill
                                    key={tag.id}
                                    tag={tag}
                                    removable
                                    onRemove={() => handleTagToggle(tag)}
                                />
                            ))
                        )}
                    </div>
                </Col>
            </Row>

            {/* Available Tags */}
            <Row className='available-tags-section'>
                <Col>
                    <div className='tag-section-title'>
                        {t('Available Tags')} - {t('Click to add')}
                    </div>

                    {/* Inline Tag Creation Form */}
                    {showAddTagInput && (
                        <div className='inline-tag-creation mb-3'>
                            <Form.Group>
                                <Form.Label className='small'>{t('Create New Tag')}</Form.Label>
                                <div className='tag-creation-form'>
                                    <div className='form-inputs mb-2'>
                                        <Form.Control
                                            size='sm'
                                            type='text'
                                            placeholder={t('Tag name')}
                                            value={newTagName}
                                            onChange={(e) => setNewTagName(e.target.value)}
                                            maxLength={50}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleCreateAndAssignTag();
                                                }
                                            }}
                                            className='mb-2'
                                        />
                                        <div className='tag-color-picker-inline mb-2'>
                                            {colorPalette.map((color) => (
                                                <div
                                                    key={color}
                                                    className={`color-option-small ${
                                                        newTagColor === color ? 'selected' : ''
                                                    }`}
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => setNewTagColor(color)}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className='form-buttons'>
                                        <Button
                                            variant='success'
                                            size='sm'
                                            onClick={handleCreateAndAssignTag}
                                            disabled={!newTagName.trim() || loading}
                                            className='me-2'
                                        >
                                            <FontAwesomeIcon icon={faCheck} />
                                        </Button>
                                        <Button
                                            variant='secondary'
                                            size='sm'
                                            onClick={handleCancelAddTag}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </Button>
                                    </div>
                                </div>
                                {newTagName && (
                                    <div className='tag-preview mt-1'>
                                        <TagPill tag={{ name: newTagName, color: newTagColor }} />
                                    </div>
                                )}
                            </Form.Group>
                        </div>
                    )}

                    <div className='tag-pills-container'>
                        {availableTags.length === 0 ? (
                            <span className='text-muted'>
                                {tags.length === 0
                                    ? t('No tags created yet. Create your first tag!')
                                    : t('All your tags are already assigned to this deck')}
                            </span>
                        ) : (
                            <>
                                {availableTags.map((tag) => (
                                    <TagPill
                                        key={tag.id}
                                        tag={tag}
                                        clickable
                                        onClick={() => handleTagToggle(tag)}
                                    />
                                ))}
                                {deckTags.length >= 10 && (
                                    <span className='text-warning small'>
                                        {t('Maximum tags reached for this deck')}
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </Col>
            </Row>

            <TagManagementModal show={showTagModal} onHide={() => setShowTagModal(false)} />
        </div>
    );
};

DeckTags.displayName = 'DeckTags';

export default DeckTags;
