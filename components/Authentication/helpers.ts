export function getCookie(name: any) {
  const cookie = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
  return cookie ? cookie.pop() : "";
}
