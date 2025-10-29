export const formatSize = (sizeMB: number) => {
  if (sizeMB > 1024) {
    return `${(sizeMB / 1024).toFixed(2)} GB`;
  }
  return `${sizeMB} MB`;
};
