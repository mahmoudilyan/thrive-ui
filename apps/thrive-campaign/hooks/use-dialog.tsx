// @deprecated
// import { useContext } from 'react';
// import { DialogContext } from '@/providers/dialog-provider';

// export const useDialog = () => {
// 	const context = useContext(DialogContext);
// 	if (!context) {
// 		throw new Error('useDialog must be used within a DialogProvider');
// 	}

// 	return {
// 		openDialog: context.openDialog,
// 		dialogType: context.dialogStack[context.dialogStack.length - 1]?.dialogType,
// 		dialogProps: context.dialogStack[context.dialogStack.length - 1]?.dialogProps,
// 		closeDialog: context.closeDialog,
// 		closeAllDialogs: context.closeAllDialogs,
// 	};
// };
