class Trash {
    async deleteFile(options: object = {}): Promise<any> {
      return use$FetchApi(`v1/trash/file`, {
        method: "POST",
        ...options,
      });
    }

    async deleteFolder(options: object = {}): Promise<any> {
      return use$FetchApi(`v1/trash/folder`, {
        method: "POST",
        ...options,
      });
    }

    async restoreFile(options: object = {}): Promise<any> {
      return use$FetchApi(`v1/trash/file/${options.file_id}/restore`, {
        method: "POST",
        ...options,
      });
    }
  }
  
  export default Trash;
  