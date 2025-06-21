/**
 * firebase-init.js
 * ----------------------------------------------------
 * 專門負責：
 *  1. 匯入新版 Firebase SDK (CDN 模組)
 *  2. 初始化 Firebase App
 *  3. 建立並匯出 Auth 物件（其他服務可自行加上）
 * ----------------------------------------------------
 */
import { initializeApp }     from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js';
import { getAuth }           from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

// ✅ 唯一的 firebaseConfig 放這裡
const firebaseConfig = {
  apiKey:            'AIzaSyDPKL_Eio7KL7GaQsrai9uMrZ8mA7psMHE',
  authDomain:        'quapniapp.firebaseapp.com',
  projectId:         'quapniapp',
  storageBucket:     'quapniapp.appspot.com',
  messagingSenderId: '290644575778',
  appId:             '1:290644575778:web:2f5d4df1bb6b10c9ceec7b'
};

// 初始化並導出
export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.useDeviceLanguage();   // 共用語系設定
