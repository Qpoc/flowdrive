class Share {
  async invite(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/share/invite`, {
      method: "POST",
      ...options,
    });
  }
  async show(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/share/${options.share_id}`, {
      method: "GET",
      ...options,
    });
  }
}

export default Share;
