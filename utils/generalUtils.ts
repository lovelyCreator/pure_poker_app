const categories = ["dog", "lion", "orca", "shark", "eagle", "panda", "elephant", "bear", "monkey", "snake"];
const colors = ["purple", "blue", "pink", "green", "orange", "grey"];

export function generateRandomProfilePicture(): string {
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return `${randomCategory}-${randomColor}`;
}