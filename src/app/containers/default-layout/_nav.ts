import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    // badge: {
    //   color: 'info'
    //   // text: 'NEW'
    // }
   },
  {
    name: 'Main',
    title: true
  },
  {
    name: 'User Management',
    url: '/users',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Roles',
        url: '/users/roles'
      },
      {
        name: 'Users',
        url: '/users/users'
      },
      
    ]//
  },
  {
    name: 'Permissions',
    url: '/permissions',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Parent Forms',
        url: '/permissions/parent-permissions'
      },
      {
        name: 'Forms',
        url: '/permissions/permissions'
      },
      {
        name: 'Assign Permissions',
        url: '/permissions/assign-permissions'
      },
    ]//
  },
  {
    name: 'Trukkr',
    url: '/trukkr',
    iconComponent: { name: 'cil-drop' },
    children: [
      {
        name: 'Trips',
        url: '/trukkr/home'
      },
      {
        name: 'Inventory Transfer',
        url: '/trukkr/inventory-transfer'
      }
    ]
  }
];

