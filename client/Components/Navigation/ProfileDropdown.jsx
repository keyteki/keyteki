import React from 'react';
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { useTranslation } from 'react-i18next';
import NavItem from './NavItem';

const ProfileDropdown = ({ user, menu }) => {
    const { t } = useTranslation();

    if (!user) {
        return null;
    }

    return (
        <Dropdown>
            <DropdownTrigger>
                <Avatar
                    isBordered
                    as='button'
                    className='transition-transform'
                    name={user.name}
                    size='sm'
                    src={`/img/avatar/${user.username}.png`}
                />
            </DropdownTrigger>
            <DropdownMenu variant='flat'>
                {menu.map((mi) => (
                    <DropdownItem key={mi.title} textValue={mi.title}>
                        <NavItem className='w-full' size='md' path={mi.path}>
                            {t(mi.title)}
                        </NavItem>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};

export default ProfileDropdown;
