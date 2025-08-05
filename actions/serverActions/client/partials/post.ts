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

async function listByUser(userId: string) {
  const response = await axios.get(`/api/post?userId=${userId}`, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
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

async function changeBiddingStatus(postId: string, allowBidding: boolean) {
  const response = await axios.put(
    `/api/post/bidding-status?postId=${postId}&allowBidding=${allowBidding}`,
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

async function GetCustomerContact(postId: string, userId: string) {
  const response = await axios.get(
    `/api/post/cto?postId=${postId}&userId=${userId}`
  );
  return response.data;
}

async function Query(val: string) {
  let response: any = await axios.get(`/api/post/query?searchText=${val}`);
  response = response;
  return response.data;
}

async function fetchPosts(take?: number) {
  const response = await axios.get(`/api/post/fetch?take=${take}`);
  return response.data;
}

export const posts = {
  fetchPosts,
  createPost,
  removePost,
  Query,
  placeBid,
  listBids,
  listByUser,
  changeBiddingStatus,
  GetCustomerContact,
};
