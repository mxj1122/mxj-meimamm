const KEY = "heimamm_token";
const setToken = token => {
    localStorage.setItem(KEY, token)
}
const getToken = () => {
    return localStorage.getItem(KEY)
}
const delToken = () => {
    localStorage.removeItem(KEY)
}
// 按需导出
export { setToken, getToken, delToken }
