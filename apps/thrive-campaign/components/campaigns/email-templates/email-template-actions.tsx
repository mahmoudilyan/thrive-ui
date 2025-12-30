import { IconButton } from '@chakra-ui/react';
import { MdMoreHoriz } from 'react-icons/md';
import type { EmailTemplate } from '@/types/email-templates';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@thrive/ui';

interface EmailTemplateActionsProps {
  template: EmailTemplate;
}

export default function EmailTemplateActions({ template }: EmailTemplateActionsProps) {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton aria-label="Options" variant="ghost" size="sm">
          <MdMoreHoriz />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <MenuItem
          value="preview"
          onClick={() => window.open(template.actions.preview.href, '_blank')}
        >
          Preview
        </MenuItem>
        <MenuItem
          value="publicpreview"
          onClick={() => window.open(template.actions.publicpreview.href, '_blank')}
        >
          Public Preview
        </MenuItem>
        <MenuItem value="edit" className={template.actions.edit.className}>
          Edit
        </MenuItem>
        <MenuItem value="copy" className={template.actions.copy.className}>
          Copy
        </MenuItem>
        <MenuItem value="delete" className={template.actions.delete.className} color="red.500">
          Delete
        </MenuItem>
        <MenuItem value="copytoaccount" className={template.actions.copytoaccount.className}>
          Copy To Account
        </MenuItem>
        <MenuItem value="addtotask" className={template.actions.addtotask.className}>
          Add To Task
        </MenuItem>
        <MenuItem value="createnewtask" className={template.actions.createnewtask.className}>
          Create New Task
        </MenuItem>
        <MenuItem
          value="attachtoassetgroup"
          className={template.actions.attachtoassetgroup.className}
        >
          Attach To Campaign Group
        </MenuItem>
        <MenuItem value="folder" className={template.actions.folder.className}>
          Add To Folder
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
