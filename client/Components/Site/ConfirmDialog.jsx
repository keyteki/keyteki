import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

const ConfirmDialog = ({
    isOpen,
    onOpenChange,
    title = 'Are you sure?',
    message,
    onOk,
    onCancel,
    placement = 'center'
}) => {
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={placement}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className='flex flex-col gap-1'>
                            {title || t('Are you sure?')}
                        </ModalHeader>
                        <ModalBody>{message}</ModalBody>
                        <ModalFooter>
                            <Button
                                color='primary'
                                onPress={() => {
                                    onClose();

                                    if (onOk) {
                                        onOk();
                                    }
                                }}
                            >
                                <Trans>Yes</Trans>
                            </Button>
                            <Button
                                onPress={(e) => {
                                    onClose(e);
                                    if (onCancel) {
                                        onCancel();
                                    }
                                }}
                            >
                                <Trans>No</Trans>
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ConfirmDialog;
