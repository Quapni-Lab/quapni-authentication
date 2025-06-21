//----------------------------------------------
//  共用初始化
//----------------------------------------------
import { auth } from './firebase-init.js';
import {
  GoogleAuthProvider, FacebookAuthProvider,
  signInWithPopup, signInWithRedirect, getRedirectResult,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

// Provider
const gProvider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider().addScope('email');

// 行動裝置或 App 內 WebView
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

//------------------------------------------------
// ① 檢查是否為 redirect 回來
//------------------------------------------------
(async () => {
  // 先呼叫一次，讓 SDK 嘗試把 redirect 資訊放進 auth
  await getRedirectResult(auth).catch(() => {});

  // 最多等 1.5 秒，直到 onAuthStateChanged 拿到 user
  const user = await new Promise(resolve => {
    let done = false;
    const off = onAuthStateChanged(auth, u => {
      if (u) { done = true; off(); resolve(u); }
    });
    setTimeout(() => { if (!done) { off(); resolve(null); } }, 1500);
  });

  if (user) location.replace('index.html');
})();

//------------------------------------------------
// ② Google 登入
//------------------------------------------------
async function google_login() {
  try {
    if (isMobile) return await signInWithRedirect(auth, gProvider);

    await signInWithPopup(auth, gProvider);
    location.replace('index.html');
  } catch (err) {
    if (err.code.startsWith('auth/popup')) {
      // 被擋彈窗 → 改用 redirect
      await signInWithRedirect(auth, gProvider);
    } else {
      console.error('Google 登入失敗：', err.code, err.message);
    }
  }
}

//------------------------------------------------
// ③ Facebook 登入（同邏輯）
//------------------------------------------------
async function facebook_login() {
  try {
    if (isMobile) return await signInWithRedirect(auth, fbProvider);

    await signInWithPopup(auth, fbProvider);
    location.replace('index.html');
  } catch (err) {
    if (err.code.startsWith('auth/popup')) {
      await signInWithRedirect(auth, fbProvider);
    } else {
      console.error('Facebook 登入失敗：', err.code, err.message);
    }
  }
}

window.google_login   = google_login;
window.facebook_login = facebook_login;
