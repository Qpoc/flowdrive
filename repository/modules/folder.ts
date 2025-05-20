class Folder {
  async create(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/folder`, {
      method: "POST",
      ...options,
    });
  }

  async rename(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/folder/${options.folder_id}/rename`, {
      method: "PATCH",
      ...options,
    });
  }

  async delete(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/folder/delete`, {
      method: "POST",
      ...options,
    });
  }

  async show(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/folder/${options.folder_id}`, {
      method: "GET",
      ...options,
    });
  }

  async getFolders(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/folder/${options.folder_id}/folder`, {
      method: "GET",
      ...options,
    });
  }

  async getFiles(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/folder/${options.folder_id}/file`, {
      method: "GET",
      ...options,
    });
  }

  async breadcrumbs(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/folder/${options.folder_id}/breadcrumbs`, {
      method: "GET",
      ...options,
    });
  }

  async move(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/folder/move`, {
      method: "POST",
      ...options,
    });
  }
}

export default Folder;
