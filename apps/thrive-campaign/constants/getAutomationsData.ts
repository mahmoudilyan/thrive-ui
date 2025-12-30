import type { Automation } from '@/types/automations';

export const automationsData: Automation[] = [
  {
    id: '90916',
    name: '[DRAFT] My Untitled Automation 138',
    completed: 0,
    pending: 0,
    created_on: 'Tuesday 12/17/2024 11:21 AM',
    status: 0,
    actions: {
      addtotask: {
        text: '',
        className: 'actionAddJourneyToTask',
      },
      createnewtask: {
        text: 'Create New Task',
        className: 'actionCreateTaskWithJourney',
      },
      attachtoassetgroup: {
        text: 'Attach To Campaign Group',
        className: 'actionAttachToCampaignAssets',
      },
      folder: {
        text: 'Add To Folder',
        className: 'actionAddToFolder',
      },
    },
    folder_name: '',
  },
  {
    id: '90572',
    name: 'December 2024 - Post Partners Meeting Group',
    completed: 3578,
    pending: 0,
    created_on: 'Monday 12/09/2024 05:10 AM',
    status: 0,
    actions: {
      addtotask: {
        text: '',
        className: 'actionAddJourneyToTask',
      },
      createnewtask: {
        text: 'Create New Task',
        className: 'actionCreateTaskWithJourney',
      },
      attachtoassetgroup: {
        text: 'Attach To Campaign Group',
        className: 'actionAttachToCampaignAssets',
      },
      folder: {
        text: 'Add To Folder',
        className: 'actionAddToFolder',
      },
    },
    folder_name: '',
  },
  {
    id: '90311',
    name: 'Instagram Funnel Automation',
    completed: 0,
    pending: 0,
    created_on: 'Monday 12/02/2024 04:58 PM',
    status: 1,
    actions: {
      addtotask: {
        text: '',
        className: 'actionAddJourneyToTask',
      },
      createnewtask: {
        text: 'Create New Task',
        className: 'actionCreateTaskWithJourney',
      },
      attachtoassetgroup: {
        text: 'Attach To Campaign Group',
        className: 'actionAttachToCampaignAssets',
      },
      folder: {
        text: 'Move from Folder',
        className: 'actionMoveFromFolder',
      },
    },
    folder_name: 'Social Media and Chatbot automation - Richard',
  },
  // Add more automations as needed...
];
