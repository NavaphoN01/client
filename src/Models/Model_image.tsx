export default interface Image {
    id: number;
    attributes: {
      Title: string;
      description: string;
      email: string;
      user_name: string;
      createdAt: Date;
      picture: {
        data: [{
          attributes: {
              url: string;
              }
            }]
      }
    }
  }
  