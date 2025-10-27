import { ButtonGroup } from '@heroui/react';
import React from 'react';
import { Constants } from '../../constants';
import { SmallButton } from '../Site/Variants';
import ThronesIcon from '../GameBoard/ThronesIcon';

const FactionFilter = ({ className, filter, setFilter, factions = Constants.Factions }) => {
    return (
        <ButtonGroup className={className}>
            {factions.map((faction) => {
                return (
                    <SmallButton
                        key={faction.value}
                        size='xs'
                        color={filter.some((f) => f === faction.value) ? 'primary' : null}
                        onPress={() =>
                            setFilter(
                                filter.some((f) => f === faction.value)
                                    ? filter.filter((f) => f !== faction.value)
                                    : filter.concat(faction.value)
                            )
                        }
                    >
                        <ThronesIcon icon={faction.value} />
                    </SmallButton>
                );
            })}
        </ButtonGroup>
    );
};

export default FactionFilter;
