//----------------------------------------------
//  Firebase (v11.9.1 modular CDN) 設定
//----------------------------------------------
import { auth } from './firebase-init.js';
import {
  getAuth, GoogleAuthProvider, FacebookAuthProvider,
  signInWithPopup
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';


//----------------------------------------------
//  Provider 物件
//----------------------------------------------
const gProvider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();
fbProvider.addScope('email'); // 若需要取得 e-mail

//----------------------------------------------
//  登入流程：Google
//----------------------------------------------
async function google_login() {
  try {
    // Google 登入成功
    const result = await signInWithPopup(auth, gProvider);
    window.location.replace('index.html');   // ← 新增這行

    // result.user 內即可拿到 displayName / photoURL / uid …
  } catch (err) {
    console.error('❌ Google 登入失敗：', err.code, err.message);
  }
}

//----------------------------------------------
//  登入流程：Facebook
//----------------------------------------------
async function facebook_login() {
  try {
    const result = await signInWithPopup(auth, fbProvider);
    console.log('✅ Facebook 登入成功：', result.user);
  } catch (err) {
    console.error('❌ Facebook 登入失敗：', err.code, err.message);
  }
}

// 將函式掛到 global，讓 inline onclick 能找到
window.google_login = google_login;
window.facebook_login = facebook_login;
