export const fetchCheckAuth = async (token, email) => {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if(!response.ok) {
    throw new Error('호출 실패');
  }
  
  return await response.json();
}