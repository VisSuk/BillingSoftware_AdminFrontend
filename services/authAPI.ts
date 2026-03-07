
export const authAPI = {
  login: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            name: 'Admin User',
            email: 'admin@nexusbill.com'
          }
        });
      }, 500);
    });
  }
};
