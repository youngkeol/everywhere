export const fetchLogin = async (email, password) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if(!response.ok) {
    throw new Error('호출 실패');
  }
  
  return await response.json();
}