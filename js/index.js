import { auth } from './firebase-init.js';
import {
  onAuthStateChanged, signOut
} from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

const $app = document.getElementById('app');
$app.innerHTML = '<p class="text-light text-center">Loading…</p>';

// 最多等 2 秒讓 Firebase 復原 session
function waitAuth(timeout = 2000) {
  return new Promise(resolve => {
    let settled = false;
    const off = onAuthStateChanged(auth, u => {
      if (u) { settled = true; off(); resolve(u); }
    });
    setTimeout(() => { if (!settled) { off(); resolve(null); } }, timeout);
  });
}

(async () => {
  const user = await waitAuth();
  if (!user) return location.replace('login.html');

  const { displayName, email, photoURL } = user;
  $app.innerHTML = `
    <img src="${photoURL || ''}" width="96" class="rounded-circle mb-3">
    <h4 class="mb-1">${displayName || '使用者'}</h4>
    <p class="text-secondary mb-4" style="font-size:.9rem">${email || ''}</p>
    <button id="logout" class="btn btn-outline-light px-4 rounded-pill">
      <i class="fa-solid fa-right-from-bracket me-2"></i> 登出
    </button>`;
  document.getElementById('logout').onclick =
    () => signOut(auth).then(() => location.replace('login.html'));
})();
