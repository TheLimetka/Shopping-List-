import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // App name
      'appName': 'Shopping List App',
      
      // Common actions
      'create': 'Create',
      'delete': 'Delete',
      'cancel': 'Cancel',
      'close': 'Close',
      'save': 'Save',
      'add': 'Add',
      'edit': 'Edit',
      'remove': 'Remove',
      
      // List management
      'createList': 'Create New Shopping List',
      'shoppingLists': 'Shopping Lists',
      'createNewList': 'Create New List',
      'listName': 'List Name',
      'renameList': 'Rename List',
      'confirmDelete': 'Confirm Delete',
      'deleteConfirmMessage': 'Are you sure you want to delete this shopping list?',
      'viewList': 'View List',
      'backToList': 'Back to List',
      'leaveList': 'Leave List',
      'leaveListConfirmation': 'Are you sure you want to leave this shopping list?',
      
      // Archive functionality
      'archive': 'Archive',
      'restore': 'Restore',
      'archived': 'Archived',
      'showArchived': 'Show Archived',
      'hideArchived': 'Hide Archived',
      
      // Items
      'items': 'Items',
      'addItem': 'Add Item',
      'newItem': 'New Item',
      'deleteItem': 'Delete Item',
      'showResolvedItems': 'Show resolved items',
      'hideResolvedItems': 'Hide resolved items',
      
      // Members and permissions
      'owner': 'Owner',
      'members': 'Members',
      'addMember': 'Add Member',
      'removeMember': 'Remove Member',
      'enterUsername': 'Enter username',
      
      // Theme
      'darkMode': 'Dark Mode',
      'lightMode': 'Light Mode',

      //Charts and Graphs
      'solvedItems': 'Solved Items',
      'unsolvedItems': 'Unsolved Items',
      'noItems': 'No Items',

      // Status messages
      'listNotFound': 'List not found',
      'accessDenied': 'Access denied',
      'unknownUser': 'Unknown User',
      
      // Error messages
      'failedToAddItem': 'Failed to add item',
      'failedToToggleItem': 'Failed to toggle item status',
      'failedToDeleteItem': 'Failed to delete item',
      'failedToAddMember': 'Failed to add member',
      'failedToRemoveMember': 'Failed to remove member',
      'failedToLeaveList': 'Failed to leave list',
      'failedToRenameList': 'Failed to rename list',
      'failedToCreateList': 'Failed to create list',
      'failedToDeleteList': 'Failed to delete list',
      'failedToArchiveList': 'Failed to archive list',
      'userNotFound': 'User not found',
      'pleaseEnterListName': 'Please enter a list name',
    }
  },
  cs: {
    translation: {
      // App name
      'appName': 'Nákupní Seznam',
      
      // Common actions
      'create': 'Vytvořit',
      'delete': 'Smazat',
      'cancel': 'Zrušit',
      'close': 'Zavřít',
      'save': 'Uložit',
      'add': 'Přidat',
      'edit': 'Upravit',
      'remove': 'Odebrat',
      
      // List management
      'createList': 'Vytvořit nový nákupní seznam',
      'shoppingLists': 'Nákupní seznamy',
      'createNewList': 'Vytvořit nový seznam',
      'listName': 'Název seznamu',
      'renameList': 'Přejmenovat seznam',
      'confirmDelete': 'Potvrdit smazání',
      'deleteConfirmMessage': 'Opravdu chcete smazat tento nákupní seznam?',
      'viewList': 'Zobrazit seznam',
      'backToList': 'Zpět na seznam',
      'leaveList': 'Opustit seznam',
      'leaveListConfirmation': 'Opravdu chcete opustit tento nákupní seznam?',
      
      // Archive functionality
      'archive': 'Archivovat',
      'restore': 'Obnovit',
      'archived': 'Archivováno',
      'showArchived': 'Zobrazit archivované',
      'hideArchived': 'Skrýt archivované',
      
      // Items
      'items': 'Položky',
      'addItem': 'Přidat položku',
      'newItem': 'Nová položka',
      'deleteItem': 'Smazat položku',
      'showResolvedItems': 'Zobrazit vyřešené položky',
      'hideResolvedItems': 'Skrýt vyřešené položky',
      
      // Members and permissions
      'owner': 'Vlastník',
      'members': 'Členové',
      'addMember': 'Přidat člena',
      'removeMember': 'Odebrat člena',
      'enterUsername': 'Zadejte uživatelské jméno',
      
      // Theme
      'darkMode': 'Tmavý režim',
      'lightMode': 'Světlý režim',
    
      //Charts and Graphs
        'totalItems' : 'Celkové Položky',
       'solvedItems': 'Vyřešené Položky',
       'unsolvedItems': 'Nevyřešené Položky',
        'noItems': 'žádné položky',
      
      // Status messages
      'listNotFound': 'Seznam nenalezen',
      'accessDenied': 'Přístup zamítnut',
      'unknownUser': 'Neznámý uživatel',
      
      // Error messages
      'failedToAddItem': 'Nepodařilo se přidat položku',
      'failedToToggleItem': 'Nepodařilo se změnit stav položky',
      'failedToDeleteItem': 'Nepodařilo se smazat položku',
      'failedToAddMember': 'Nepodařilo se přidat člena',
      'failedToRemoveMember': 'Nepodařilo se odebrat člena',
      'failedToLeaveList': 'Nepodařilo se opustit seznam',
      'failedToRenameList': 'Nepodařilo se přejmenovat seznam',
      'failedToCreateList': 'Nepodařilo se vytvořit seznam',
      'failedToDeleteList': 'Nepodařilo se smazat seznam',
      'failedToArchiveList': 'Nepodařilo se archivovat seznam',
      'userNotFound': 'Uživatel nenalezen',
      'pleaseEnterListName': 'Prosím zadejte název seznamu',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'cs',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;