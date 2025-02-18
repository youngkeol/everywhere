
//글 리스트
export const fetchPublicPlaces = async ({idx, type}) => {
  const queryParams = new URLSearchParams({ idx, type }).toString();
  const response = await fetch(`/api/publicPlaces/list?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });


  if (!response.ok) {
    throw new Error("fetchPublicPlaces 호출 실패");
  }

  return await response.json();
};