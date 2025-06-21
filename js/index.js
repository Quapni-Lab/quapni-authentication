
import { auth } from './firebase-init.js';
import {
  onAuthStateChanged, signOut
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

const $app = document.getElementById('app');

// 先顯示 Loading（可自行換成 spinner）
$app.innerHTML = '<p class="text-light text-center">Loading…</p>';

/**
 * 只監聽一次，拿到最終 user（可能為 null），就解除訂閱。
 * 這是官方文件推薦的 pattern。
 */
function waitAuth() {
  return new Promise(resolve => {
    const off = onAuthStateChanged(auth, user => {
      off();          // 立刻解除監聽，避免額外回呼
      resolve(user);  // user 可能是 null
    });
  });
}

(async () => {
  const user = await waitAuth();

  if (!user) {
    // 沒登入 → 導到 login.html
    location.replace('login.html');
    return;
  }

  // 已登入 → Render 使用者介面
  const { displayName, email, photoURL } = user;
  $app.innerHTML = `
    <div class="text-center text-light">
      <h2 class="mb-2">Hi, ${displayName || '使用者'} !</h2>
      <img src="${photoURL || ''}" width="96" class="rounded-circle mb-3">
      <p class="text-secondary">${email || ''}</p>
      <button class="btn btn-outline-light" id="logout">登出</button>
    </div>`;

  document.getElementById('logout').onclick = () =>
    signOut(auth).then(() => location.replace('login.html'));
})();
