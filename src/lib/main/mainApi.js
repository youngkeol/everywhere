export const fetchRecentPosts = async({count})=> {
  const response = await fetch(`/api/main/recentPosts?count=${count}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("fetchRecentPost 호출 실패");
  }

  return await response.json();
}


export const fetchRecentNotices = async({count})=> {

  const response = await fetch(`/api/main/recentNotices?count=${count}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("fetchRecentNotice 호출 실패");
  }
  return await response.json();
}


