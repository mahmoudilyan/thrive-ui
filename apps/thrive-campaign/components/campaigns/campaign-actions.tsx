import { Campaign } from '@/types/campaigns';
import { Group, Button, IconButton, Box } from '@chakra-ui/react';
import { MdExpandMore } from 'react-icons/md';
import { MenuContent, MenuItem, MenuRoot, MenuSeparator, MenuTrigger } from '@thrive/ui';

export default function CampaignActions({ campaignData }: { campaignData: Campaign }) {
  console.log('Campaign', campaignData);
  const handleAction = (value: string) => {
    const campaignId = campaignData.id;
    console.log('Dropdown action', value, campaignId);
  };

  return (
    <Box textAlign="right">
      <MenuRoot
        positioning={{ placement: 'bottom-end' }}
        onSelect={(details: { value: string }) => {
          handleAction(details.value);
        }}
      >
        <Group attached>
          {campaignData.campaign.status.name === 'sent' ? (
            <Button variant="secondary" size="sm">
              Analytics
            </Button>
          ) : (
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          )}
          <MenuTrigger asChild>
            <IconButton variant="secondary" size="sm">
              <MdExpandMore />
            </IconButton>
          </MenuTrigger>
        </Group>
        <MenuContent>
          <MenuItem value="preview">Preview</MenuItem>
          <MenuItem value="public-preview">Public Preview</MenuItem>
          <MenuSeparator />
          <MenuItem value="rename">Rename</MenuItem>
          <MenuItem value="copy">Copy</MenuItem>
          <MenuItem value="copy-to-account">Copy to Account</MenuItem>
          <MenuSeparator />
          <MenuItem value="attach-to-campaign">Attach to Campaign Group</MenuItem>
          <MenuItem value="add-to-task">Add to Task</MenuItem>
          <MenuItem value="create-task">Create Task</MenuItem>
          <MenuSeparator />
          <MenuItem value="delete" _hover={{ color: 'text.critical' }}>
            Delete
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </Box>
  );
}
