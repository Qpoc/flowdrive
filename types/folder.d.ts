declare interface Folder {
  id: Number;
  name: string;
  is_leaf: Boolean,
  parent_id: Number;
  updated_at: Date;
  created_at: Date;
  created_by: Number;
  deleted_at: Date;
  deleted_by: Number;
  is_selected: Boolean;
  is_hover: Boolean;
  is_deleting: Boolean;
  is_downloading: Boolean;
}
