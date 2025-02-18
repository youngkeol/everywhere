//지역리스트
export const fetchAreaList = async () => {
  const response = await fetch("/api/myPlaces/areaList", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("fetchAreaList 호출 실패");
  }

  return await response.json();
};

//글 리스트
export const fetchMyPlaces = async () => {
  const response = await fetch("/api/myPlaces/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("fetchMyPlaces 호출 실패");
  }

  return await response.json();
};

//글등록
export const fetchAddMyPlaces = async (
  address,
  title,
  htmlContent,
  files,
  tags,
  openFlag
) => {
  try {
    // FormData 생성 (파일 포함)
    const formData = new FormData();

    // title이 빈 값이 아닌 경우에만 추가
    if (title) {
      formData.append("title", title);
    }

    // address가 빈 값이 아닌 경우에만 추가
    if (address) {
      formData.append("address", JSON.stringify(address));
    }

    // contents가 빈 값이 아닌 경우에만 추가
    if (htmlContent) {
      formData.append("contents", htmlContent);
    }

    // tags가 비어있지 않은 경우에만 추가
    if (Array.isArray(tags) && tags.length > 0) {
      tags.forEach((tag) => formData.append("tags[]", tag));
    }

    // files가 비어있지 않은 경우에만 추가
    if (Array.isArray(files) && files.length > 0) {
      files.forEach((file) => formData.append("files[]", file));
    }

    if (openFlag) {
      formData.append("openFlag", openFlag);
    }


    const response = await fetch("/api/myPlaces/add", {
      method: "POST",
      body: formData,
    });

    console.log("A@@@@@@@");
    console.log(response);
    if (!response.ok) {
      throw new Error("등록 실패");
    }

    return await response.json();
  } catch (error) {
    throw new Error("등록 실패");
  }
};


export const fetchDelPost =  async(idx) => {
  console.log("@@@@@" + idx)
  try {
  const response = await fetch('/api/myPlaces/del', {
    method: "POST",
    body: JSON.stringify({
      idx: idx
    })
  })


  if (!response.ok) {
    throw new Error("fetchDelPost 호출 실패");
  }
  const data = await response.json();
  return data;
  } catch (error) {
    console.error("fetchDelPost 에러:", error);
    throw error;
  }
}