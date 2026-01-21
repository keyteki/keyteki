import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { createTag, updateTag, deleteTag, loadTags, clearTagStatus } from '../../redux/actions';
import TagPill from './TagPill';
import { toastr } from 'react-redux-toastr';

import './TagManagementModal.scss';

/**
 * @typedef TagManagementModalProps
 * @property {boolean} show - Whether the modal is visible
 * @property {function} onHide - Callback when modal is hidden
 */

/**
 * @param {TagManagementModalProps} props
 */
const TagManagementModal = ({ show, onHide }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { tags, loading, tagCreated, tagUpdated, tagDeleted, error } = useSelector((state) => ({
        tags: state.tags?.tags || [],
        loading: state.tags?.loading || false,
        tagCreated: state.tags?.tagCreated || false,
        tagUpdated: state.tags?.tagUpdated || false,
        tagDeleted: state.tags?.tagDeleted || false,
        error: state.api?.error
    }));

    const [editingTag, setEditingTag] = useState(null);
    const [tagName, setTagName] = useState('');
    const [tagColor, setTagColor] = useState('#007bff');
    const [validationError, setValidationError] = useState('');

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
        if (show) {
            dispatch(loadTags());
            dispatch(clearTagStatus());
        }
    }, [show, dispatch]);

    useEffect(() => {
        if (tagCreated || tagUpdated || tagDeleted) {
            setEditingTag(null);
            setTagName('');
            setTagColor('#007bff');
            setValidationError('');
            dispatch(loadTags());

            setTimeout(() => {
                dispatch(clearTagStatus());
            }, 1000);
        }
    }, [tagCreated, tagUpdated, tagDeleted, dispatch]);

    const handleCreateTag = () => {
        if (validateTagInput()) {
            dispatch(createTag({ name: tagName.trim(), color: tagColor }));
        }
    };

    const handleUpdateTag = () => {
        if (validateTagInput() && editingTag) {
            dispatch(updateTag(editingTag.id, { name: tagName.trim(), color: tagColor }));
        }
    };

    const handleDeleteTag = (tag) => {
        toastr.confirm(
            t('Are you sure you want to delete the tag "{{tagName}}"?', { tagName: tag.name }),
            {
                okText: t('Delete'),
                cancelText: t('Cancel'),
                onOk: () => {
                    dispatch(deleteTag(tag.id));
                }
            }
        );
    };

    const startEditingTag = (tag) => {
        setEditingTag(tag);
        setTagName(tag.name);
        setTagColor(tag.color);
        setValidationError('');
    };

    const cancelEditing = () => {
        setEditingTag(null);
        setTagName('');
        setTagColor('#007bff');
        setValidationError('');
    };

    const validateTagInput = () => {
        setValidationError('');

        if (!tagName.trim()) {
            setValidationError(t('Tag name is required'));
            return false;
        }

        if (tagName.trim().length > 50) {
            setValidationError(t('Tag name cannot exceed 50 characters'));
            return false;
        }

        const existingTag = tags.find(
            (tag) =>
                tag.name.toLowerCase() === tagName.trim().toLowerCase() &&
                (!editingTag || tag.id !== editingTag.id)
        );

        if (existingTag) {
            setValidationError(t('A tag with this name already exists'));
            return false;
        }

        if (tags.length >= 10 && !editingTag) {
            setValidationError(t('You cannot have more than 10 tags'));
            return false;
        }

        return true;
    };

    return (
        <Modal show={show} onHide={onHide} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>{t('Manage Tags')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(validationError || error) && (
                    <Alert variant='danger' className='mb-3'>
                        {validationError || error}
                    </Alert>
                )}

                {(tagCreated || tagUpdated || tagDeleted) && (
                    <Alert variant='success' className='mb-3'>
                        {tagCreated && t('Tag created successfully')}
                        {tagUpdated && t('Tag updated successfully')}
                        {tagDeleted && t('Tag deleted successfully')}
                    </Alert>
                )}

                {/* Tag Creation/Editing Form */}
                <div className='tag-form-section mb-4'>
                    <h5>{editingTag ? t('Edit Tag') : t('Create New Tag')}</h5>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('Tag Name')}</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={tagName}
                                        onChange={(e) => setTagName(e.target.value)}
                                        maxLength={50}
                                        placeholder={t('Enter tag name')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('Tag Color')}</Form.Label>
                                    <div className='tag-color-picker'>
                                        {colorPalette.map((color) => (
                                            <div
                                                key={color}
                                                className={`color-option ${
                                                    tagColor === color ? 'selected' : ''
                                                }`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setTagColor(color)}
                                            />
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <div className='tag-preview mb-3'>
                                    <span className='me-2'>{t('Preview:')} </span>
                                    <TagPill
                                        tag={{ name: tagName || t('Tag Name'), color: tagColor }}
                                    />
                                </div>
                            </Col>
                            <Col md={6} className='text-end'>
                                {editingTag ? (
                                    <>
                                        <Button
                                            variant='secondary'
                                            className='me-2'
                                            onClick={cancelEditing}
                                        >
                                            {t('Cancel')}
                                        </Button>
                                        <Button
                                            variant='primary'
                                            onClick={handleUpdateTag}
                                            disabled={loading}
                                        >
                                            {t('Update Tag')}
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant='primary'
                                        onClick={handleCreateTag}
                                        disabled={loading || tags.length >= 10}
                                    >
                                        {t('Create Tag')}
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </Form>
                </div>

                {/* Existing Tags List */}
                <div className='existing-tags-section'>
                    <h5>
                        {t('Your Tags')} ({tags.length}/10)
                    </h5>

                    {tags.length === 0 ? (
                        <p className='text-muted'>{t("You haven't created any tags yet.")}</p>
                    ) : (
                        <div className='tags-list'>
                            {tags.map((tag) => (
                                <Row key={tag.id} className='tag-item'>
                                    <Col
                                        xs={12}
                                        sm={12}
                                        md={6}
                                        className='d-flex align-items-center'
                                    >
                                        <TagPill tag={tag} />
                                    </Col>
                                    <Col xs={12} sm={12} md={3}>
                                        <Button
                                            variant='primary'
                                            size='sm'
                                            className='me-2'
                                            onClick={() => startEditingTag(tag)}
                                        >
                                            {t('Edit')}
                                        </Button>
                                    </Col>
                                    <Col xs={12} sm={12} md={2}>
                                        <Button
                                            variant='danger'
                                            size='sm'
                                            onClick={() => handleDeleteTag(tag)}
                                        >
                                            {t('Delete')}
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={onHide}>
                    {t('Close')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

TagManagementModal.displayName = 'TagManagementModal';

export default TagManagementModal;
