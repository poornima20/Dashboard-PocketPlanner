// ==========================================
// FIREBASE IMPORTS
// ==========================================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyASyErnTbmHPFVEkjvlZrFp9oXFNS95SjY",
  authDomain: "pocket-planner-eeb28.firebaseapp.com",
  projectId: "pocket-planner-eeb28",
  storageBucket: "pocket-planner-eeb28.firebasestorage.app",
  messagingSenderId: "817631735021",
  appId: "1:817631735021:web:777a8c8a71133e1b24b0e4"
};


// ==========================================
// INIT
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

console.log("Firebase Connected");


// ==========================================
// KEEP LOGIN SESSION
// ==========================================

setPersistence(auth, browserLocalPersistence);


// ==========================================
// ELEMENTS
// ==========================================

const signupBtn =
document.getElementById("signupBtn");

const loginBtn =
document.getElementById("loginBtn");

const cloudBtn =
document.getElementById("cloudAccountBtn");

const confirmModal =
document.getElementById("confirmModal");

const confirmTitle =
document.getElementById("confirmTitle");

const confirmText =
document.getElementById("confirmText");

const confirmOkBtn =
document.getElementById("confirmOkBtn");

const confirmCancelBtn =
document.getElementById("confirmCancelBtn");

// ==========================================
// ELEMENTS - toast and confirmation
// ==========================================

const toast =
document.getElementById("toast");

function showToast(message) {

  toast.innerText = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);

}


function showConfirm({

  title = "Are you sure?",
  text = "",
  confirmButtonText = "Confirm",
  onConfirm = () => {}

}) {

  confirmTitle.innerText = title;

  confirmText.innerText = text;

  confirmOkBtn.innerText = confirmButtonText;

  confirmModal.classList.add("active");

  // CANCEL
  confirmCancelBtn.onclick = () => {

    confirmModal.classList.remove("active");

  };

  // CONFIRM
  confirmOkBtn.onclick = async () => {

    confirmModal.classList.remove("active");

    await onConfirm();

  };

}


// ==========================================
// SIGNUP
// ==========================================

signupBtn?.addEventListener("click", async () => {

  const plannerName =
    document.getElementById("signupPlannerName")
    .value
    .trim()
    .toLowerCase();

  const email =
    document.getElementById("signupEmail")
    .value
    .trim();

  const password =
    document.getElementById("signupPassword")
    .value;

  if (!plannerName || !email || !password) {
    showToast("Fill all fields");
    return;
  }

  try {

    // CHECK UNIQUE NAME
    const plannerRef =
      doc(db, "plannerNames", plannerName);

    const plannerSnap =
      await getDoc(plannerRef);

    if (plannerSnap.exists()) {
      showToast("Planner name already taken");
      return;
    }

    // CREATE ACCOUNT
    const userCred =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const uid = userCred.user.uid;

    // SAVE LOOKUP
    await setDoc(
      doc(db, "plannerNames", plannerName),
      {
        uid,
        email
      }
    );

    // SAVE USER
    await setDoc(
      doc(db, "users", uid),
      {
        plannerName,
        email
      }
    );

    localStorage.setItem(
      "plannerName",
      plannerName
    );

    signupBtn.innerText = "Account Created ✓";

    signupBtn.disabled = true;

    setTimeout(() => {

    // switch to login tab
    document.querySelector('[data-tab="login"]')
        .click();

    signupBtn.innerText = "Create Account";

    signupBtn.disabled = false;
    document
  .getElementById("authModal")
  .classList.remove("active");

    }, 1200);

  }

  catch(err) {
    console.error(err);
    showToast(err.message);
  }

});


// ==========================================
// LOGIN
// ==========================================

loginBtn?.addEventListener("click", async () => {

  const email =
    document.getElementById("loginEmail")
    .value
    .trim();

  const password =
    document.getElementById("loginPassword")
    .value;

  if (!email || !password) {
    showToast("Fill all fields");
    return;
  }

  try {

    const userCred =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    const uid = userCred.user.uid;

    // GET USER DATA
    const userSnap =
      await getDoc(doc(db, "users", uid));

    const plannerName =
      userSnap.data().plannerName;

    localStorage.setItem(
      "plannerName",
      plannerName
    );

    // ==========================================
// CHECK LOCAL DATA
// ==========================================

const localPlannerData =
  getPlannerStorage();

const hasLocalData =
  Object.keys(localPlannerData).length > 0;


// ==========================================
// CHECK CLOUD DATA
// ==========================================

const cloudSnap =
  await getDoc(
    doc(db, "plannerData", uid)
  );

const hasCloudData =
  cloudSnap.exists() &&
  cloudSnap.data().storage &&
  Object.keys(
    cloudSnap.data().storage
  ).length > 0;


// ==========================================
// CLOUD EXISTS
// ==========================================

if (hasCloudData) {

  await restorePlannerData(uid);

  showToast("Cloud restored");

  setTimeout(() => {
    location.reload();
  }, 1200);

}


// ==========================================
// CLOUD EMPTY
// ==========================================

else if (hasLocalData) {

  await uploadPlannerData(uid);

  showToast("Local data synced");

}


// ==========================================
// NOTHING EXISTS
// ==========================================

else {

  showToast(`Welcome @${plannerName}`);

}

// CLOSE AUTH MODAL
document
  .getElementById("authModal")
  .classList.remove("active");

  }

  catch(err) {
    console.error(err);
    showToast("Wrong email or password");
  }

});


// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(auth, async (user) => {

  if (!cloudBtn) return;

  // LOGGED OUT
  if (!user) {

    cloudBtn.innerHTML = `
      <i data-lucide="cloud"></i>
      <span>Cloud Account</span>
    `;

    cloudBtn.classList.remove("logged-in");
    lucide.createIcons();

    return;
  }

  // GET USER DATA
  const userSnap =
    await getDoc(doc(db, "users", user.uid));

  const plannerName =
    userSnap.data().plannerName;

  // SAVE LOCALLY
  localStorage.setItem(
    "plannerName",
    plannerName
  );

  // CHANGE SIDEBAR UI
 cloudBtn.innerHTML = `
  <div class="cloud-user">

    <div class="cloud-user-info">
      <i data-lucide="user"></i>
      <span>@${plannerName}</span>
    </div>

    <button class="cloud-logout" id="logoutBtn">
      <i data-lucide="log-out"></i>
    </button>

  </div>
`;

  cloudBtn.classList.add("logged-in");
  lucide.createIcons();

  // LOGOUT CLICK
const logoutBtn =
document.getElementById("logoutBtn");

logoutBtn.onclick = (e) => {

  e.stopPropagation();

  showConfirm({

    title: "Logout?",

    text:
      "You will need to login again to access your cloud planners.",

    confirmButtonText: "Logout",

onConfirm: async () => {

  try {

    showToast("Syncing cloud...");

    // wait for upload
    await uploadPlannerData(user.uid);

    // small safety delay
    await new Promise(resolve =>
      setTimeout(resolve, 500)
    );

    // clear local ONLY after successful upload
    clearPlannerStorage();

    localStorage.removeItem("plannerName");

    await signOut(auth);

    showToast("Logged out");

  }

  catch(err){

    console.error(err);

    showToast("Cloud sync failed");

  }

}

  });

};

});


// ==========================================
// GET ALL PLANNER STORAGE
// ==========================================

function getPlannerStorage() {

  const data = {};

  for (let i = 0; i < localStorage.length; i++) {

    const key = localStorage.key(i);

    if (
      key.startsWith("fullmoon.pocketplanner.")
    ) {

      data[key] = localStorage.getItem(key);

    }

  }

  return data;

}



// ==========================================
// CLEAR ALL PLANNER STORAGE
// ==========================================


function clearPlannerStorage() {

  const keysToRemove = [];

  for (let i = 0; i < localStorage.length; i++) {

    const key = localStorage.key(i);

    if (
      key.startsWith("fullmoon.pocketplanner.")
    ) {
      keysToRemove.push(key);
    }

  }

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

}

// ==========================================
// SAVE CLOUD DATA
// ==========================================

async function uploadPlannerData(uid) {

  const plannerData =
    getPlannerStorage();

  await setDoc(
    doc(db, "plannerData", uid),
    {
      storage: plannerData,
      updatedAt: Date.now()
    }
  );

  console.log("Cloud synced");

}

// ==========================================
// RESTORE CLOUD DATA
// ==========================================

async function restorePlannerData(uid) {

  const snap =
    await getDoc(
      doc(db, "plannerData", uid)
    );

  if (!snap.exists()) return false;

  const cloudData =
    snap.data().storage || {};

  clearPlannerStorage();

  Object.entries(cloudData)
    .forEach(([key, value]) => {

      localStorage.setItem(key, value);

    });

  return true;

}

// ==========================================
// Auto Snyc on unload
// ==========================================
window.addEventListener("beforeunload", async () => {

  const user = auth.currentUser;

  if (!user) return;

  await uploadPlannerData(user.uid);

});

setInterval(async () => {

  const user = auth.currentUser;

  if (!user) return;

  await uploadPlannerData(user.uid);

  console.log("Auto synced");

}, 30000);