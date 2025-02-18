export const fetchMyInfo = async () => {
  const response = await fetch("/api/myPage/myInfo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("fetchMyInfo 호출 실패");
  }

  return await response.json();
};

export const fetchMyPlacesInfo = async () => {
  const response = await fetch("/api/myPage/myPlacesInfo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("fetchMyPlacesInfo 호출 실패");
  }

  return await response.json();
};


export const fetchUserLeave = async () => {
  console.log("v1");

  try {
    const response = await fetch("/api/myPage/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("fetchUserLeave 호출 실패");
    }

    const data = await response.json();
    console.log("response data", data);

    return data;
  } catch (error) {
    console.error("fetchUserLeave 에러:", error);
    throw error; // 오류 던져서 호출자에게 알려줄 수도 있음
  }
};


export const fetchModifyUserInfo = async ({password, nickname}) => {
    console.log("aaa")
    try {
    const response = await fetch("/api/myPage/modify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password, // 비밀번호
        nickname: nickname, // 닉네임
      }),
    });

    if (!response.ok) {
      throw new Error("fetchModifyUserInfo 호출 실패");
    }
    const data = await response.json();
    console.log("response data", data);

    return data;
  } catch (error) {
    console.error("fetchModifyUserInfo 에러:", error);
    throw error; // 오류 던져서 호출자에게 알려줄 수도 있음
  }
};

