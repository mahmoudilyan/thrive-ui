export interface Automation {
  id: string;
  name: string;
  completed: number;
  pending: number;
  created_on: string;
  status: number;
  actions: {
    addtotask: {
      text: string;
      className: string;
    };
    createnewtask: {
      text: string;
      className: string;
    };
    attachtoassetgroup: {
      text: string;
      className: string;
    };
    folder: {
      text: string;
      className: string;
    };
  };
  folder_name: string;
}
