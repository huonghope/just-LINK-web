const utils = {
  comparerArrayWithId: (otherArray) => {
    return function(current) {
      return otherArray.filter(function(other) {
        return other.id === current.id;
      }).length == 0;
    };
  },
  formatBytes: (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    );
  },
  sleep: async (ms) => {
    return new Promise((r) => setTimeout(() => r(), ms));
  },
};

export default utils;
