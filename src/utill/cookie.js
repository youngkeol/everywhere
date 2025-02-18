export const setCookie = (name, value, hours) => {
  deleteCookie('token');
  let expires = "";
  
  if (hours) {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000)); // 현재 시간에 hours만큼 더하기
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax; ${
    window.location.protocol === 'https:' ? 'Secure' : ''
  }`;
};


export const deleteCookie = (name) => {
  // 쿠키의 경로와 도메인, Secure, SameSite 옵션을 동일하게 지정해줍니다.
  let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`;

  // https인 경우 Secure 추가
  if (window.location.protocol === 'https:') {
    cookieString += ' Secure';
  }

  // 쿠키 도메인이 지정되어 있다면 해당 도메인으로 설정
  // 예: 도메인이 명시되어 있으면 domain 설정을 추가할 수 있습니다
  // cookieString += '; domain=yourdomain.com';

  document.cookie = cookieString;
  //console.log("쿠키 삭제 완료. 현재 쿠키:", document.cookie);
};