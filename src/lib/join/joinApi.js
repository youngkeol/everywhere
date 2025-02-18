export const fetchJoin = async ({email, password, nickname, verificationCode}) => {
  const response = await fetch('/api/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, nickname, verificationCode }),
  });


  if(!response.ok) {
    throw new Error('호출 실패');
  }

  return await response.json();
}
