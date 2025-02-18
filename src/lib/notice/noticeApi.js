//fetchNoticeList
export const fetchNoticeList = async () => {
  const response = await fetch('/api/notice/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if(!response.ok) {
    throw new Error('fetchNoticeList 호출 실패');
  }
  
  return await response.json();
}


//fetchNoticeTypeList
export const fetchNoticeTypeList = async() => {
  const response = await fetch('/api/notice/typeList', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if(!response.ok) {
    throw new Error('fetchNoticeTypeList 호출 실패');
  }

  return await response.json();
}