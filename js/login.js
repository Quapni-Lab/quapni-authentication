//----------------------------------------------
// 共用初始化
//----------------------------------------------
import { auth }                                   from './firebase-init.js';
import {
  GoogleAuthProvider, FacebookAuthProvider,
  signInWithPopup, signInWithRedirect, getRedirectResult
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

// Provider
const gProvider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();
fbProvider.addScope('email');

// 判斷是否為行動裝置（含平板、App 內嵌瀏覽器）
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

//------------------------------------------------
// ① 處理 redirect 回來的結果
//------------------------------------------------
(async () => {
  try {
    const res = await getRedirectResult(auth);
    if (res?.user) {
      // 確定狀態寫入後再跳
      await res.user.getIdToken(true);
      location.replace('index.html');
    }
  } catch (err) {
    console.error('getRedirectResult 失敗：', err.code, err.message);
  }
})();

//------------------------------------------------
// ② Google 登入
//------------------------------------------------
async function google_login() {
  try {
    // 行動裝置 or app 內瀏覽器 → 直接 redirect
    if (isMobile) return await signInWithRedirect(auth, gProvider);

    // 桌機先嘗試 popup
    await signInWithPopup(auth, gProvider);
    location.replace('index.html');

  } catch (err) {
    // 如果被擋，改走 redirect
    if (err.code === 'auth/popup-blocked' ||
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/web-popup-blocked') {

      console.warn('Popup 失敗，改用 redirect…');
      await signInWithRedirect(auth, gProvider);
    } else {
      console.error('Google 登入失敗：', err.code, err.message);
    }
  }
}

//------------------------------------------------
// ③ Facebook 登入（同樣邏輯）
//------------------------------------------------
async function facebook_login() {
  try {
    if (isMobile) return await signInWithRedirect(auth, fbProvider);

    await signInWithPopup(auth, fbProvider);
    location.replace('index.html');

  } catch (err) {
    if (err.code === 'auth/popup-blocked' ||
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/web-popup-blocked') {

      console.warn('Popup 失敗，改用 redirect…');
      await signInWithRedirect(auth, fbProvider);
    } else {
      console.error('Facebook 登入失敗：', err.code, err.message);
    }
  }
}

// 將函式掛到 global
window.google_login   = google_login;
window.facebook_login = facebook_login;
