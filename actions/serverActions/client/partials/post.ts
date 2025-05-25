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

async function createPost(data: any) {
  const response = await axios.post(`/api/post`, data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response.data;
}

async function placeBid(userId: string, postId: string, amount: number) {
  const response = await axios.post(
    `/api/post/bid`,
    {
      userId,
      postId,
      amount,
    },
    {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
  return response.data;
}

async function listBids(postId: string) {
  const response = await axios.get(`/api/post/bid?postId=${postId}`, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response.data;
}

export const posts = {
  createPost,
  removePost,
  placeBid,
  listBids,
};
