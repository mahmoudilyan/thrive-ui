// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Campaign } from '../types/campaigns';

export const campaignsData: Campaign[] = [
  {
    id: '262002',
    type: 'regular',
    campaign: {
      name: 'Comment to DM Automation',
      subject: 'Turn Instagram Comments into Leads Automatically :people_holding_hands:',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_8418822467.png',
      details: {
        email_opened: { r: 1865 },
        link_clicked: { r: 57 },
      },
      status: {
        name: 'sent',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients'],
      audiences: ['All contacts - Excluding inactive'],
      folders: [],
      total: 12352,
    },
    labels: {
      sent: 'Sent',
      warmup: 'Predictive Sending',
    },
    actions: {
      addtotask: {
        text: 'Add To Task',
        className: 'actionAddCampaignToTask',
      },
      createnewtask: {
        text: 'Create New Task',
        className: 'actionCreateTaskWithCampaign',
      },
      attachtoassetgroup: {
        text: 'Attach To Campaign Group',
        className: 'actionAttachToCampaignAssets',
      },
      preview: {
        href: '/App/EmailMarketing/Preview/262002.html',
      },
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
      folder: {
        text: 'Add To Folder',
        className: 'actionAddToFolder',
      },
    },
    startsenddate: '11/28/2024 03:07 PM',
    endsenddate: '11/30/2024 07:25 PM',
    folder_name: '',
  },
  {
    id: '161882',
    type: 'abtesting',
    campaign: {
      name: 'Introducing VBOUT Plugin for ChatGPT',
      subject: "Revolutionize Your Marketing with ChatGPT's New VBOUT Plugin! :rocket:",
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'A/B Campaign (Subject Line)',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_1166742858.png',
      details: {
        email_opened: {
          a: 424,
          b: 2869,
        },
        link_clicked: {
          a: 1,
          b: 78,
        },
      },
      status: {
        name: 'sent',
        scheduled: 'never',
      },
      subjectb: ':tada: Introducing VBOUT Plugin for ChatGPT!',
    },
    target: {
      lists: ['AS Clients'],
      audiences: ['All contacts - Excluding inactive'],
      folders: [],
      total: 11654,
      a: 1753,
      b: 9901,
    },
    labels: {
      paused: 'Paused',
      warmup: 'Predictive Sending',
    },
    actions: {
      addtotask: {
        text: 'Add To Task',
        className: 'actionAddCampaignToTask',
      },
      createnewtask: {
        text: 'Create New Task',
        className: 'actionCreateTaskWithCampaign',
      },
      attachtoassetgroup: {
        text: 'Attach To Campaign Group',
        className: 'actionAttachToCampaignAssets',
      },
      preview: {
        href: '/App/EmailMarketing/Preview/161882.html',
      },
      previewa: '',
      previewb: '',
      publicpreview: {
        href: 'https://app.vbout.com/vbt/preview/161882/?hash=2637e4eb878338a5128546e979ca6309',
      },
      publicpreviewa: '',
      publicpreviewb: '',
      divider: 'divider',
      resume: {
        text: 'Resume',
        className: 'actionResumeCampaign',
      },
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
      inboxpreview: '',
      inboxpreviewa: '',
      inboxpreviewb: '',
      edit: {
        text: 'Edit',
        className: 'actionEditCampaign',
      },
      folder: {
        text: 'Add To Folder',
        className: 'actionAddToFolder',
      },
    },
    startsenddate: 'Start sending on 07/06/2023 01:32 PM',
    folder_name: '',
  },
  {
    id: '256671',
    type: 'regular',
    campaign: {
      name: 'Yearly Announcement',
      subject: '',
      from: 'rich@vbout.com',
      fromname: 'https://www.vbout.com',
      replyto: 'rich@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_2243650221.png',
      details: {},
      status: {
        name: 'draft',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['Calendar Booking - Richard'],
      audiences: [],
      folders: [],
    },
    labels: {
      draft: 'Draft',
      warmup: 'Predictive Sending',
    },
    actions: {
      addtotask: {
        text: 'Add To Task',
        className: 'actionAddCampaignToTask',
      },
      createnewtask: {
        text: 'Create New Task',
        className: 'actionCreateTaskWithCampaign',
      },
      preview: {
        href: '/App/EmailMarketing/Preview/256671.html',
      },
      edit: {
        text: 'Edit',
        className: 'actionEditCampaign',
      },
    },
    date: '10/30/2024 03:22 PM',
    folder_name: '',
  },
  {
    id: '248767',
    type: 'regular',
    campaign: {
      name: 'Email Marketing Templates',
      subject: 'Access Ready-Made Templates or Create Your Own with Our Builder :email:',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'Regular',
      thumb: 'Thumbs/Campaign/248767.png?timthumb=yes&w=200&t=1733842114',
      details: {},
      status: {
        name: 'draft',
        scheduled: 'never',
      },
    },
    target: {
      lists: [],
      audiences: [],
      folders: [],
    },
    labels: {
      draft: 'Draft',
    },
    actions: {
      preview: {
        href: '/App/EmailMarketing/Preview/248767.html',
      },
      edit: {
        text: 'Edit',
        className: 'actionEditCampaign',
      },
    },
    date: '09/18/2024 05:45 AM',
    folder_name: '',
  },
  {
    id: '117861',
    type: 'abtesting',
    campaign: {
      name: 'VBOUT Recognized in GetApp’s Midyear Report for Top Marketing Software',
      subject: 'You’ve really made our day',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'A/B Campaign (Different Content)',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_3337637028.png',
      details: {
        email_opened: {
          a: 1275,
          b: 163,
        },
        link_clicked: {
          a: 52,
          b: 6,
        },
      },
      status: {
        name: 'sent',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients', 'VBOUT Signups'],
      audiences: [],
      folders: [],
      total: 4682,
      a: 3743,
      b: 939,
    },
    labels: {
      sent: 'Sent',
      warmup: 'Predictive Sending',
    },
    actions: {
      addtotask: {
        text: 'Add To Task',
        className: 'actionAddCampaignToTask',
      },
      createnewtask: {
        text: 'Create New Task',
        className: 'actionCreateTaskWithCampaign',
      },
      attachtoassetgroup: {
        text: 'Attach To Campaign Group',
        className: 'actionAttachToCampaignAssets',
      },
      preview: '',
      previewa: {
        href: '/App/EmailMarketing/Preview/117861.html',
      },
      previewb: {
        href: '/App/EmailMarketing/Preview/117862.html',
      },
      publicpreview: '',
      publicpreviewa: {
        href: 'https://app.vbout.com/vbt/preview/117861/?hash=691873de36d55b69143827830aac56d3',
      },
      publicpreviewb: {
        href: 'https://app.vbout.com/vbt/preview/117862/?hash=7594719f8e1ee93590450126d2ea6006',
      },
      labela: 'Campaign A',
      labelb: 'Campaign B',
      dividera: 'divider',
      dividerb: 'divider',
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
      inboxpreview: '',
      inboxpreviewa: '',
      inboxpreviewb: '',
      folder: {
        text: 'Add To Folder',
        className: 'actionAddToFolder',
      },
    },
    startsenddate: 'Start sending on 08/31/2022 01:17 PM',
    endsenddate: 'Sending completed on 09/01/2022 11:35 AM',
    folder_name: '',
  },
  {
    id: '247919',
    type: 'regular',
    campaign: {
      name: 'Google My Business',
      subject: 'Expand Your Reach: Manage Google My Business with VBOUT',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_8216434306.png',
      details: {},
      status: {
        name: 'draft',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients'],
      audiences: ['All contacts - Excluding inactive'],
      folders: [],
    },
    labels: {
      draft: 'Draft',
      warmup: 'Predictive Sending',
    },
    date: '09/12/2024 03:33 PM',
    actions: {
      preview: {
        href: '/App/EmailMarketing/Preview/247919.html',
      },
      edit: {
        text: 'Edit',
        className: 'actionEditCampaign',
      },
    },
    folder_name: '',
  },
  {
    id: '226014',
    type: 'regular',
    campaign: {
      name: 'Google My Business',
      subject: 'Expand Your Reach: Manage Google My Business with VBOUT',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_6542651520.png',
      details: {
        email_opened: { r: 1962 },
        link_clicked: { r: 46 },
      },
      status: {
        name: 'sent',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients'],
      audiences: ['All contacts - Excluding inactive'],
      folders: [],
      total: 12101,
    },
    labels: {
      sent: 'Sent',
      warmup: 'Predictive Sending',
    },
    actions: {
      preview: {
        href: '/App/EmailMarketing/Preview/226014.html',
      },
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
    },
    startsenddate: '08/20/2024 03:33 PM',
    endsenddate: '08/23/2024 10:59 AM',
    folder_name: '',
  },
  {
    id: '216508',
    type: 'regular',
    campaign: {
      name: 'Maintenance for server size',
      subject: 'VBOUT Maintenance and Scheduled Downtime - Part 1',
      from: 'support@vbout.com',
      fromname: 'VBOUT',
      replyto: 'support@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_4716830044.png',
      details: {
        email_opened: { r: 1697 },
        link_clicked: { r: 14 },
      },
      status: {
        name: 'sent',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients', 'VBOUT Signups'],
      audiences: [],
      folders: [],
      total: 7065,
    },
    labels: {
      sent: 'Sent',
    },
    actions: {
      preview: {
        href: '/App/EmailMarketing/Preview/216508.html',
      },
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
    },
    date: '06/12/2024 09:11 AM',
    folder_name: '',
  },
  {
    id: '214972',
    type: 'regular',
    campaign: {
      name: 'Multi-Step Forms',
      subject: ':rocket: Boost Your Conversion Rates with Multi-Step Forms!',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_7320615745.png',
      details: {
        email_opened: { r: 1518 },
        link_clicked: { r: 58 },
      },
      status: {
        name: 'sent',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients'],
      audiences: ['All contacts - Excluding inactive'],
      folders: [],
      total: 13457,
    },
    labels: {
      sent: 'Sent',
      warmup: 'Predictive Sending',
    },
    actions: {
      preview: {
        href: '/App/EmailMarketing/Preview/214972.html',
      },
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
    },
    startsenddate: '06/18/2024 03:02 PM',
    endsenddate: '06/20/2024 04:19 PM',
    folder_name: '',
  },
  {
    id: '214582',
    type: 'regular',
    campaign: {
      name: "VBOUT's New Landing Page Builder - 2024",
      subject: ':wrench: Upgrade to Our Modern Landing Page Builder!',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_8648571347.png',
      details: {
        email_opened: { r: 1646 },
        link_clicked: { r: 137 },
      },
      status: {
        name: 'sent',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients', 'Testing for Georges'],
      audiences: ['All contacts - Excluding inactive'],
      folders: [],
      total: 13541,
    },
    labels: {
      sent: 'Sent',
      warmup: 'Predictive Sending',
    },
    actions: {
      preview: {
        href: '/App/EmailMarketing/Preview/214582.html',
      },
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
    },
    startsenddate: '06/04/2024 12:17 PM',
    endsenddate: '06/06/2024 11:29 AM',
    folder_name: '',
  },
  {
    id: '209622',
    type: 'regular',
    campaign: {
      name: 'Email Bounce Rates',
      subject: 'How to Reduce Email Bounce Rates! :e-mail: ',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_3478377361.png',
      details: {
        email_opened: { r: 1977 },
        link_clicked: { r: 46 },
      },
      status: {
        name: 'sent',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients', 'Testing for Georges'],
      audiences: ['All contacts - Excluding inactive'],
      folders: [],
      total: 13899,
    },
    labels: {
      sent: 'Sent',
      warmup: 'Predictive Sending',
    },
    actions: {
      preview: {
        href: '/App/EmailMarketing/Preview/209622.html',
      },
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
    },
    startsenddate: '05/28/2024 03:33 PM',
    endsenddate: '05/31/2024 10:45 AM',
    folder_name: '',
  },
  {
    id: '209278',
    type: 'regular',
    campaign: {
      name: 'Email Bounce Rates',
      subject: 'How to Reduce Email Bounce Rates! :e-mail: ',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_1156538753.png',
      details: {
        email_opened: { r: 4 },
        link_clicked: { r: 0 },
      },
      status: {
        name: 'sent',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['Testing for Georges'],
      audiences: [],
      folders: [],
      total: 7,
    },
    labels: {
      sent: 'Sent',
    },
    actions: {
      preview: {
        href: '/App/EmailMarketing/Preview/209278.html',
      },
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
    },
    date: '04/24/2024 08:45 AM',
    folder_name: '',
  },
  {
    id: '209049',
    type: 'regular',
    campaign: {
      name: 'Facebook API Change',
      subject: ':rotating_light: Important Update: Changes to Facebook Group API! ',
      from: 'support@vbout.com',
      fromname: 'VBOUT',
      replyto: 'support@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_2300817726.png',
      details: {
        email_opened: { r: 1501 },
        link_clicked: { r: 29 },
      },
      status: {
        name: 'sent',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients', 'VBOUT Signups'],
      audiences: [],
      folders: [],
      total: 7536,
    },
    labels: {
      sent: 'Sent',
      warmup: 'Predictive Sending',
    },
    actions: {
      preview: {
        href: '/App/EmailMarketing/Preview/209049.html',
      },
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
    },
    startsenddate: '05/16/2024 04:02 PM',
    endsenddate: '05/17/2024 08:16 PM',
    folder_name: '',
  },
  {
    id: '206910',
    type: 'regular',
    campaign: {
      name: 'AI Chatbot',
      subject: ':speech_balloon: Introducing Our New AI Chatbot Features and More :bulb:',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_5134252216.png',
      details: {
        email_opened: { r: 1466 },
        link_clicked: { r: 72 },
      },
      status: {
        name: 'paused',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients'],
      audiences: ['All contacts - Excluding inactive'],
      folders: [],
      total: 12209,
    },
    labels: {
      sent: 'Sent',
      warmup: 'Predictive Sending',
    },
    actions: {
      preview: {
        href: '/App/EmailMarketing/Preview/206910.html',
      },
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
    },
    startsenddate: '08/12/2024 03:32 PM',
    endsenddate: '08/15/2024 09:59 AM',
    folder_name: '',
  },
  {
    id: '264823',
    type: 'regular',
    campaign: {
      name: 'Happy Holidays 2024',
      subject: ':christmas_tree: Celebrate the Season with Us and Explore the Highlights ',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'Regular',
      thumb: 'Thumbs/Campaign/264823.png?timthumb=yes&w=200&t=1734016250',
      details: {
        email_opened: [],
        link_clicked: [],
      },
      status: {
        name: 'draft',
        scheduled: 'never',
      },
    },
    target: {
      lists: [],
      audiences: [],
      folders: [],
    },
    labels: {
      draft: 'Draft',
      warmup: 'Predictive Sending',
    },
    date: '12/11/2024 05:31 AM',
    actions: {
      addtotask: {
        text: 'Add To Task',
        className: 'actionAddCampaignToTask',
      },
      createnewtask: {
        text: 'Create New Task',
        className: 'actionCreateTaskWithCampaign',
      },
      attachtoassetgroup: {
        text: 'Attach To Campaign Group',
        className: 'actionAttachToCampaignAssets',
      },
      preview: {
        href: '/App/EmailMarketing/Preview/264823.html',
      },
      edit: {
        text: 'Edit',
        className: 'actionEditCampaign',
      },
      folder: {
        text: 'Add To Folder',
        className: 'actionAddToFolder',
      },
    },
    folder_name: '',
  },
  {
    id: '264636',
    type: 'regular',
    campaign: {
      name: 'test',
      subject: 'test',
      from: 'rich@vbout.com',
      fromname: 'https://www.vbout.com',
      replyto: 'rich@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_6253255888.png',
      details: {
        email_opened: [],
        link_clicked: [],
      },
      status: {
        name: 'draft',
        scheduled: 'never',
      },
    },
    target: {
      lists: [],
      audiences: [],
      folders: [],
    },
    labels: {
      draft: 'Draft',
    },
    date: '12/10/2024 12:54 PM',
    actions: {
      preview: {
        href: '/App/EmailMarketing/Preview/264636.html',
      },
      edit: {
        text: 'Edit',
        className: 'actionEditCampaign',
      },
    },
    folder_name: '',
  },
  {
    id: '203964',
    type: 'regular',
    campaign: {
      name: 'Calendar Integration & Important Changes to Inbox Sync',
      subject:
        ':arrows_counterclockwise: Important: New Booking Calendar Integration & Changes to Inbox Sync ',
      from: 'support@vbout.com',
      fromname: 'VBOUT',
      replyto: 'support@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_0282228518.png',
      details: {
        email_opened: { r: 2299 },
        link_clicked: { r: 73 },
      },
      status: {
        name: 'sent',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients', 'VBOUT Signups'],
      audiences: [],
      folders: [],
      total: 7125,
    },
    labels: {
      sent: 'Sent',
      warmup: 'Predictive Sending',
    },
    actions: {
      addtotask: {
        text: 'Add To Task',
        className: 'actionAddCampaignToTask',
      },
      createnewtask: {
        text: 'Create New Task',
        className: 'actionCreateTaskWithCampaign',
      },
      attachtoassetgroup: {
        text: 'Attach To Campaign Group',
        className: 'actionAttachToCampaignAssets',
      },
      preview: {
        href: '/App/EmailMarketing/Preview/203964.html',
      },
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
      folder: {
        text: 'Add To Folder',
        className: 'actionAddToFolder',
      },
    },
    startsenddate: '04/16/2024 01:59 PM',
    endsenddate: '04/20/2024 03:22 AM',
    folder_name: '',
  },
  {
    id: '201765',
    type: 'regular',
    campaign: {
      name: 'Webinar- March 2024',
      subject: ':fire:Hop on the AI Rocket! :rocket:',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_7171177006.png',
      details: {
        email_opened: [],
        link_clicked: [],
      },
      status: {
        name: 'draft',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients', 'VBOUT Signups'],
      audiences: [],
      folders: [],
    },
    labels: {
      draft: 'Draft',
      warmup: 'Predictive Sending',
    },
    date: '03/06/2024 06:32 AM',
    actions: {
      addtotask: {
        text: 'Add To Task',
        className: 'actionAddCampaignToTask',
      },
      createnewtask: {
        text: 'Create New Task',
        className: 'actionCreateTaskWithCampaign',
      },
      attachtoassetgroup: {
        text: 'Attach To Campaign Group',
        className: 'actionAttachToCampaignAssets',
      },
      preview: {
        href: '/App/EmailMarketing/Preview/201765.html',
      },
      edit: {
        text: 'Edit',
        className: 'actionEditCampaign',
      },
      folder: {
        text: 'Add To Folder',
        className: 'actionAddToFolder',
      },
    },
    folder_name: '',
  },
  {
    id: '191960',
    type: 'regular',
    campaign: {
      name: 'Google and Yahoo Authentication',
      subject:
        ' :loudspeaker: Important Update! Google & Yahoo Authentication Changes: Stay Compliant!',
      from: 'georges@vbout.com',
      fromname: 'Georges from VBOUT',
      replyto: 'georges@vbout.com',
      type: 'Regular',
      thumb: 'https://assets.vbt.io/public/capture_url/capture_5008078144.png',
      details: {
        email_opened: { r: 2178 },
        link_clicked: { r: 97 },
      },
      status: {
        name: 'sent',
        scheduled: 'never',
      },
    },
    target: {
      lists: ['AS Clients', 'VBOUT Signups'],
      audiences: [],
      folders: [],
      total: 7368,
    },
    labels: {
      paused: 'Paused',
      warmup: 'Predictive Sending',
    },
    actions: {
      addtotask: {
        text: 'Add To Task',
        className: 'actionAddCampaignToTask',
      },
      createnewtask: {
        text: 'Create New Task',
        className: 'actionCreateTaskWithCampaign',
      },
      attachtoassetgroup: {
        text: 'Attach To Campaign Group',
        className: 'actionAttachToCampaignAssets',
      },
      preview: {
        href: '/App/EmailMarketing/Preview/191960.html',
      },
      resume: {
        text: 'Resume',
        className: 'actionResumeCampaign',
      },
      master: {
        text: 'Analytics',
        className: 'actionCampaignStats',
      },
      edit: {
        text: 'Edit',
        className: 'actionEditCampaign',
      },
      folder: {
        text: 'Add To Folder',
        className: 'actionAddToFolder',
      },
    },
    startsenddate: '01/19/2024 04:03 PM',
    folder_name: '',
  },
];
