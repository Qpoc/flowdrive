class File {

  async getFiles(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/file`, {
      method: "POST",
      ...options,
    });
  }

  async show(options: object = {}): Promise<any> {
    return useFetchApi(`v1/file/${options.file_id}`, {
      method: "GET",
      ...options,
    });
  }

  async share(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/file/share`, {
      method: "POST",
      ...options,
    });
  }

  async rename(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/file/${options.file_id}/rename`, {
      method: "PATCH",
      ...options,
    });
  }

  async getSignedUrl(options: object = {}): Promise<any> {
    return useFetchApi(`v1/onlyoffice/signed-url/file/${options.file_id}`, {
      method: "GET",
      ...options,
    });
  }

  async download(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/file/${options.file_id}/download`, {
      method: "GET",
      ...options,
    });
  }

  async multipleDownload(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/file/download`, {
      method: "POST",
      ...options,
    });
  }

  async delete(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/file/delete`, {
      method: "POST",
      ...options,
    });
  }
}

export default File;
