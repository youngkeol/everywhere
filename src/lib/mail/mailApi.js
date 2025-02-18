export const fetchSendEmail = async ({ email }) => {
  const response = await fetch(`/api/mail/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),

  });

  console.log(response)
  if (!response.ok) {
    throw new Error("fetchMyPlacesInfo 호출 실패");
  }
  console.log(response)

  return await response.json();
};
