declare interface File {
  id: 2;
  folder_id: Number;
  name: string;
  path: string;
  size: Number;
  url: string;
  shared_link: {
    link_type: Object;
  };
  updated_at: Date;
  created_at: Date;
  created_by: Number;
  deleted_at: Date;
  deleted_by: Number;
  is_hover: Boolean;
  is_deleting: Boolean;
  is_downloading: Boolean
}
