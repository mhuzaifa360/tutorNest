export const getImageUrl = (profileImage) => {
  if (!profileImage || typeof profileImage !== "string") return "";
  if (profileImage.startsWith("http") || profileImage.startsWith("/")) {
    return profileImage;
  }
  return `http://localhost:5000/uploads/${profileImage}`;
};
