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
    alert("Fill all fields");
    return;
  }

  try {

    // CHECK UNIQUE NAME
    const plannerRef =
      doc(db, "plannerNames", plannerName);

    const plannerSnap =
      await getDoc(plannerRef);

    if (plannerSnap.exists()) {
      alert("Planner name already taken");
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

    alert("Account created!");

  }

  catch(err) {
    console.error(err);
    alert(err.message);
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
    alert("Fill all fields");
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

    alert("Logged in!");

  }

  catch(err) {
    console.error(err);
    alert("Wrong email or password");
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
    <i data-lucide="user"></i>
    <span>@${plannerName}</span>
  `;

  lucide.createIcons();

  // LOGOUT CLICK
  cloudBtn.onclick = async () => {

    const confirmLogout =
      confirm("Logout?");

    if (!confirmLogout) return;

    await signOut(auth);

    localStorage.removeItem("plannerName");

    location.reload();

  };

});