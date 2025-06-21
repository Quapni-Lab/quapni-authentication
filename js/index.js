import { auth } from './firebase-init.js';
import { onAuthStateChanged, signOut }
  from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js';

const $app = document.getElementById('app');
$app.innerHTML = '<p class="text-light text-center">Loading…</p>';

function waitAuth(timeout = 2000){
  return new Promise(resolve=>{
    let ok=false;
    const off=onAuthStateChanged(auth,u=>{
      if(u){ok=true;off();resolve(u);}
    });
    setTimeout(()=>{if(!ok){off();resolve(null);}},timeout);
  });
}

(async()=>{
  const user = await waitAuth();
  if(!user) return location.replace('login.html');

  // 取出需要顯示的欄位
  const {
    uid,            // UID
    displayName,
    email,
    emailVerified,
    phoneNumber,
    photoURL,
    metadata        // creationTime / lastSignInTime
  } = user;

  $app.innerHTML = `
    <div class="profile-card text-center mx-auto">
      <img src="${photoURL || ''}" class="profile-avatar shadow-sm" alt="avatar">

      <h2 class="profile-name">${displayName || '使用者'}</h2>
      <p class="profile-mail">${email || ''}</p>

      <!-- 驗證徽章 -->
      <span class="badge rounded-pill ${emailVerified ? 'bg-success' : 'bg-secondary'} mb-3">
        <i class="fa-solid fa-envelope me-1"></i>
        ${emailVerified ? '已驗證 Email' : '未驗證 Email'}
      </span>

      <!-- 基本帳號資訊 -->
      <div class="text-start small mb-4" style="line-height:1.45">
        <p class="mb-1"><strong>UID：</strong>${uid}</p>
        <p class="mb-1"><strong>建立時間：</strong>${metadata.creationTime}</p>
        <p class="mb-1"><strong>最後登入：</strong>${metadata.lastSignInTime}</p>
        <p class="mb-0"><strong>電話：</strong>${phoneNumber ?? '—'}</p>
      </div>

      <button id="logout" class="btn btn-outline-light w-100">
        <i class="fa-solid fa-arrow-right-from-bracket me-2"></i>登出
      </button>
    </div>`;

  // 登出
  document.getElementById('logout').onclick =
    () => signOut(auth).then(() => location.replace('login.html'));
})();
