import React from 'react';
import { BsFillBasketFill } from 'react-icons/bs';
import { MdOutlineInventory } from 'react-icons/md';
import { FaWarehouse } from 'react-icons/fa';

export const SidebarLinks = [
    {
        index: 1,
        title: 'Get Order',
        icon: <BsFillBasketFill />,
        link: '/getOrder'
    },
    {
        index: 2,
        title: 'Inventory',
        icon: <MdOutlineInventory />,
        link: '/inventoryStatus'
    },
    {
        index: 3,
        title: 'Warehouse',
        icon: <FaWarehouse />,
        link: '/warehouse'
    },
];
