class OnlyOffice {
  async generateToken(options: object = {}): Promise<any> {
    return use$FetchApi(`v1/onlyoffice/token`, {
      method: "POST",
      ...options,
    });
  }
}

export default OnlyOffice;
