import { ButtonGroup } from '@heroui/react';
import React from 'react';
import { Constants } from '../../constants';
import { SmallButton } from '../Site/Variants';
import ThronesIcon from '../GameBoard/ThronesIcon';

const CardTypeFilter = ({ className, filter, setFilter, types = Constants.CardTypes }) => {
    return (
        <ButtonGroup className={className}>
            {types.map((type) => {
                return (
                    <SmallButton
                        key={type.value}
                        size='xs'
                        color={filter.some((t) => t === type.value) ? 'primary' : null}
                        onPress={() =>
                            setFilter(
                                filter.some((t) => t === type.value)
                                    ? filter.filter((t) => t !== type.value)
                                    : filter.concat(type.value)
                            )
                        }
                    >
                        <ThronesIcon icon={type.value} />
                    </SmallButton>
                );
            })}
        </ButtonGroup>
    );
};

export default CardTypeFilter;
