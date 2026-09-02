export type Folder = {
  id: number;
  name: number;
  userId: number;
  parentId: number | null;
};

export type File = {
  id: number;
  name: string;
  url: string;
  folderId: number;
  userId: number;
};
