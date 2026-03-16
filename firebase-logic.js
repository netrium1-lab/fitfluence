import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";
import firebaseConfig from "./firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth };

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function uploadImage(path, base64Str) {
  const storageRef = ref(storage, path);
  // data_url format: data:image/jpeg;base64,...
  await uploadString(storageRef, base64Str, 'data_url');
  return getDownloadURL(storageRef);
}

export async function submitSurvey(name, phone, answers) {
...
    const docRef = await addDoc(collection(db, "consults"), {
      name,
      phone,
      answers,
      date: new Date().toISOString(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function getConsults() {
  const q = query(collection(db, "consults"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getPosts() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function deletePost(id) {
  await deleteDoc(doc(db, "posts", id));
}

export async function getConfig() {
  const docRef = doc(db, "config", "site");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

export async function updateConfig(cfg) {
  await setDoc(doc(db, "config", "site"), cfg, { merge: true });
}

export async function getSurveyMaster() {
  const querySnapshot = await getDocs(collection(db, "surveyMaster"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateSurveyMaster(master) {
  // Simple approach: clear and re-add or just overwrite a single doc
  // For simplicity with the current UI, we'll store the whole array in one doc
  await setDoc(doc(db, "surveyMaster", "current"), { items: master });
}

export async function getSurveyMasterItems() {
  const docSnap = await getDoc(doc(db, "surveyMaster", "current"));
  return docSnap.exists() ? docSnap.data().items : [];
}

export async function getPost(id) {
  const docRef = doc(db, "posts", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
}

export async function savePost(id, postData) {
  if (id) {
    await setDoc(doc(db, "posts", id), { ...postData, updatedAt: serverTimestamp() }, { merge: true });
    return id;
  } else {
    const docRef = await addDoc(collection(db, "posts"), { ...postData, createdAt: serverTimestamp() });
    return docRef.id;
  }
}
