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
  getDoc,
  collection,
  getDocs
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
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

// ==========================================
// SYNC FLAGS
// ==========================================

let isRestoringFromCloud = false;

let syncTimeout;

let isUploading = false;


// ==========================================
// KEEP LOGIN SESSION
// ==========================================

await setPersistence(
  auth,
  browserLocalPersistence
);

console.log("Firebase Connected");






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


// ==========================================
// RESTORE CLOUD
// ==========================================

await restorePlannerData(uid);

showToast(`Welcome @${plannerName}`);

// refresh UI after restore
setTimeout(() => {

  window.location.href =
    window.location.pathname +
    "?refresh=" + Date.now();

}, 1200);


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

  console.log("AUTH USER:", user);

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

  await restorePlannerData(user.uid);

  if (window.refreshPlannerState) {
  window.refreshPlannerState();
}

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

    createEmergencyBackup();
    showToast("Syncing cloud...");

    // wait for upload
    await uploadPlannerData(user.uid);

    // small safety delay
    await new Promise(resolve =>
      setTimeout(resolve, 500)
    );

    // clear local ONLY after successful upload
    clearPlannerStorage();
    sessionStorage.clear();

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

  for (
    let i = 0;
    i < localStorage.length;
    i++
  ) {

    const key =
      localStorage.key(i);

if (
  key.startsWith(
    "fullmoon.pocketplanner."
  ) &&
  key !==
  "fullmoon.pocketplanner.backup"
) {

  const rawValue =
    localStorage.getItem(key);

  try {

    data[key] =
      JSON.parse(rawValue);

  }

  catch {

    data[key] = {

      data: rawValue,

      updatedAt: 0

    };

  }

}

  }

  return data;

}


// ==========================================
// EMERGENCY BACKUP
// ==========================================

function createEmergencyBackup() {

  try {

    const backup = {
      createdAt: Date.now(),
      storage: getPlannerStorage()
    };

    originalSetItem.call(
      localStorage,
      "fullmoon.pocketplanner.backup",
      JSON.stringify(backup)
    );

    console.log(
      "Emergency backup created"
    );

  }

  catch(err){

    console.error(
      "Backup failed",
      err
    );

  }

}


// ==========================================
// CLEAR ALL PLANNER STORAGE
// ==========================================


function clearPlannerStorage() {

  const keysToRemove = [];

  for (let i = 0; i < localStorage.length; i++) {

    const key = localStorage.key(i);

    if (
  key.startsWith(
    "fullmoon.pocketplanner."
  ) &&
  key !==
  "fullmoon.pocketplanner.backup"
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

  try {

    if (isRestoringFromCloud) return;

    if (isUploading) return;

    isUploading = true;

    const plannerData =
      getPlannerStorage();

    const entries =
      Object.entries(plannerData);

    for (const [key, value] of entries) {

      const plannerKey =
        key.replace(
          "fullmoon.pocketplanner.",
          ""
        );

      await setDoc(

        doc(
          db,
          "users",
          uid,
          "planners",
          plannerKey
        ),

        value,

        { merge: true }

      );

    }

    console.log("Cloud synced");

    isUploading = false;

  }

  catch(err){

    isUploading = false;

    console.error(err);

  }

}


// ==========================================
// RESTORE CLOUD DATA
// ==========================================

async function restorePlannerData(uid) {

  try {

    createEmergencyBackup();

    isRestoringFromCloud = true;

    const plannersRef =
  collection(
    db,
    "users",
    uid,
    "planners"
  );

const snapshot =
  await getDocs(plannersRef);

for (const plannerDoc of snapshot.docs) {

  const plannerKey =
    plannerDoc.id;

  const cloudValue =
    plannerDoc.data();

  const localKey =
    `fullmoon.pocketplanner.${plannerKey}`;

  const rawLocal =
    localStorage.getItem(localKey);

  let localValue = null;

  try {

    localValue =
      JSON.parse(rawLocal);

  }

  catch {}

  let finalValue;

  if (!localValue) {

    finalValue = cloudValue;

  }

  else {

    finalValue =

      localValue.updatedAt >
      cloudValue.updatedAt

        ? localValue
        : cloudValue;

  }

  localStorage.setItem(

    localKey,

    JSON.stringify(finalValue)

  );

}

    isRestoringFromCloud = false;

    console.log(
      "Cloud restored safely"
    );

    return true;

  }

  catch(err){

    isRestoringFromCloud = false;

    console.error(err);

    return false;

  }

}

// ==========================================
// Auto Snyc on unload
// ==========================================
window.addEventListener("beforeunload", async () => {

  const user = auth.currentUser;

  if (!user) return;

  createEmergencyBackup();

  await uploadPlannerData(user.uid);

});



// ==========================================
// PATCH CLOUD STORAGE
// ==========================================

function queueCloudSync() {

  const user = auth.currentUser;

  if (!user) return;

  if (isRestoringFromCloud) return;

  clearTimeout(syncTimeout);

  syncTimeout = setTimeout(async () => {

    try {

      await uploadPlannerData(user.uid);

    }

    catch(err){

      console.error(
        "Auto sync failed",
        err
      );

    }

  }, 1500);

}

// ==========================================
// PATCH LOCALSTORAGE
// ==========================================

const originalSetItem =
  localStorage.setItem;

localStorage.setItem = function(key, value) {

  // run original localStorage
  originalSetItem.apply(
    this,
    [key, value]
  );

  // only sync planner keys
  if (
    key.startsWith(
      "fullmoon.pocketplanner."
    )
  ) {

    queueCloudSync();

  }

};


// ==========================================
// PATCH REMOVE ITEM
// ==========================================

const originalRemoveItem =
  localStorage.removeItem;

localStorage.removeItem =
function(key) {

  originalRemoveItem.apply(
    this,
    [key]
  );

  if (
    key.startsWith(
      "fullmoon.pocketplanner."
    )
  ) {

    queueCloudSync();

  }

};