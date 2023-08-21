import React from 'react';
import { BsFillBasketFill } from 'react-icons/bs';
import { RiAccountCircleFill } from 'react-icons/ri';
import { MdAnalytics } from 'react-icons/md';

export const SidebarLinks = [
    {
        index: 1,
        title: 'Get Order',
        icon: <BsFillBasketFill />,
        link: '/getOrder',
        selected: false,
    },
    {
        index: 2,
        title: 'Analytics',
        icon: <MdAnalytics />,
        link: '/analytics',
        selected: false,
    },
    {
        index: 3,
        title: 'Account',
        icon: <RiAccountCircleFill />,
        link: '/account',
        selected: false,
    },
];
