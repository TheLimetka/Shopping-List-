export const initialShoppingLists = [
    {
      id: 1,
      name: 'Potraviny',
      owner: 'u1',
      items: [
        { id: 1, name: 'Mléko', resolved: false },
        { id: 2, name: 'Rohlíky', resolved: true },
        { id: 3, name: 'Máslo', resolved: false }
      ],
      members: ['u1', 'u2'],
      isArchived: false
    },
    {
      id: 2,
      name: 'Elektro',
      owner: 'u1',
      items: [{ id: 3, name: 'HDMI kabel', resolved: false }],
      members: ['u3'],
      isArchived: true
    },
  {
    id: 4,
    name: 'železářství',
    owner: 'u2',
    items: [
      { id: 1, name: 'Roxor', resolved: false },
      { id: 2, name: 'Šrouby', resolved: true },
      { id: 3, name: 'Kladivo', resolved: false }
    ],
    members: ['u1', 'u2'],
    isArchived: false
  },
  {
    id: 5,
    name: 'Stavebniny',
    owner: 'u1',
    items: [{ id: 3, name: 'Cement', resolved: false }],
    members: ['u3'],
    isArchived: false
  }
];
