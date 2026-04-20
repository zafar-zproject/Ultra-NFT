import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface UserProfile {
  telegramId: string;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  balance: number;
}

export interface TransactionRecord {
  id?: string;
  userId: string;
  type: 'win' | 'loss' | 'deposit' | 'withdrawal' | 'purchase';
  amount: number;
  description: string;
  timestamp: any;
}

export const syncUser = async (tgUser: any) => {
  if (!tgUser) return null;

  let currentUser = auth.currentUser;
  if (!currentUser) {
    const cred = await signInAnonymously(auth);
    currentUser = cred.user;
  }

  const userRef = doc(db, 'users', currentUser.uid);
  const userDoc = await getDoc(userRef);

  const userData = {
    telegramId: String(tgUser.id),
    firstName: tgUser.first_name || '',
    lastName: tgUser.last_name || '',
    username: tgUser.username || '',
    photoUrl: tgUser.photo_url || '',
    updatedAt: serverTimestamp(),
  };

  if (!userDoc.exists()) {
    const newUser = {
      ...userData,
      balance: 9000000.0,
    };
    await setDoc(userRef, newUser);
    
    // Log initial balance as a deposit/bonus
    await recordTransaction({
      userId: currentUser.uid,
      type: 'deposit',
      amount: 9000000.0,
      description: 'Initial Bonus Balance',
      timestamp: serverTimestamp()
    });

    return newUser as UserProfile;
  } else {
    await updateDoc(userRef, userData);
    const existingData = userDoc.data();
    return { ...existingData, ...userData } as unknown as UserProfile;
  }
};

export const updateUserBalance = async (newBalance: number) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const userRef = doc(db, 'users', currentUser.uid);
  await updateDoc(userRef, {
    balance: newBalance,
    updatedAt: serverTimestamp(),
  });
};

export const recordTransaction = async (tx: Omit<TransactionRecord, 'id'>) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const txRef = collection(db, 'users', currentUser.uid, 'transactions');
  await addDoc(txRef, {
    ...tx,
    timestamp: serverTimestamp(),
  });
};

export const subscribeToTransactions = (callback: (txs: TransactionRecord[]) => void) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return () => {};

  const q = query(
    collection(db, 'users', currentUser.uid, 'transactions'),
    orderBy('timestamp', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const txs: TransactionRecord[] = [];
    snapshot.forEach((doc) => {
      txs.push({ id: doc.id, ...doc.data() } as TransactionRecord);
    });
    callback(txs);
  });
};
