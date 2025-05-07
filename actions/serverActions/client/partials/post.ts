import axios from "axios";

async function removePost(id: string) {
  const response = await axios.delete(`/api/post?id=${id}`, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response;
}

export const posts = {
  removePost,
};
