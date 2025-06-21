/**
 * firebase-init.js
 * ---------------------------
 * 初始化 Firebase 並匯出共用 auth 物件
 */
import { initializeApp }  from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js';
import {
  getAuth, setPersistence,
  browserLocalPersistence, browserSessionPersistence
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

const firebaseConfig = {
  apiKey:            'AIzaSyDPKL_Eio7KL7GaQsrai9uMrZ8mA7psMHE',
  authDomain:        'quapniapp.firebaseapp.com',
  projectId:         'quapniapp',
  storageBucket:     'quapniapp.appspot.com',
  messagingSenderId: '290644575778',
  appId:             '1:290644575778:web:2f5d4df1bb6b10c9ceec7b'
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.useDeviceLanguage();

// 先嘗試寫入 IndexedDB；若失敗（無痕模式）則自動改用 sessionStorage
setPersistence(auth, browserLocalPersistence)
  .catch(() => setPersistence(auth, browserSessionPersistence))
  .catch(console.warn);
