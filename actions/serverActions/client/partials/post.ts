import axios from "axios";

async function removePost(id: string) {
  const response = await axios.delete(`/api/post?id=${id}`);
  return response;
}

export const posts = {
  removePost,
};
