export const getImageUrl = (profileImage) => {
  if (!profileImage || typeof profileImage !== "string") return "";
  if (profileImage.startsWith("http") || profileImage.startsWith("data:") || profileImage.startsWith("blob:")) {
    return profileImage;
  }
  if (profileImage.startsWith("/uploads")) {
    return `http://localhost:5000${profileImage}`;
  }
  if (profileImage.startsWith("/")) return profileImage;
  return `http://localhost:5000/uploads/profile/${profileImage}`;
};
