import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getMoviesFromDB } from './database';
import {
  signInForm,
  registrationForm,
  queuedBtn,
  watchedBtn,
  signOutBtn,
  myLibraryBtn,
  modalSignInClose,
  goToRegistrationBtn,
  modalRegistrationOpen,
  modalRegistrationClose,
} from './refs';
import {
  successfulRegistrationMsg,
  authErrorMsg,
  signOutMsg,
  successfulSignInMsg,
  registrationErrorMsg,
  errorMsg,
} from './pontify';
import { markupMyLibrary, markupHome, onLibraryBtnClick } from './header';
import {
  closeRegistrationModal,
  openSignInModal,
  openRegistrationModal,
  closeSignInModal,
} from './modalAuth';
import { getDatabase } from 'firebase/database';
const database = getDatabase();
const auth = getAuth();
handleAuthStateChange();

//user registration function
function handleRegistration(e) {
  e.preventDefault();
  markupMyLibrary();
  const email = e.currentTarget.elements.email.value;
  const password = e.currentTarget.elements.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      successfulRegistrationMsg();
      closeRegistrationModal();
    })
    .catch(error => {
      const errorCode = error.code;
      registrationErrorMsg(errorCode.slice(5).replace(/-/g, ' '));
    });
}

//user sign in function
function handleSignIn(e) {
  e.preventDefault();
  markupMyLibrary();
  const email = e.currentTarget.elements.email.value;
  const password = e.currentTarget.elements.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      successfulSignInMsg();
      closeSignInModal();
    })
    .catch(authErrorMsg);
}

//user sign out function
function handleSignOut() {
  signOut(auth, user => {
    const userId = user.uid;
    watchedBtn.removeEventListener('click', e => {
      getMoviesFromDB(userId, 'watchedMovies');
    });
    queuedBtn.removeEventListener('click', e => {
      getMoviesFromDB(userId, 'queuedMovies');
    });
  })
    .then(() => {
      signOutMsg();
    })
    .catch(error => {
      errorMsg;
    });
}

//function that manages actions applied when user is logged in/logged out
function handleAuthStateChange() {
  onAuthStateChanged(auth, user => {
    if (user) {
      const userId = user.uid;
      myLibraryBtn.addEventListener('click', onLibraryBtnClick);
      watchedBtn.addEventListener('click', e => {
        getMoviesFromDB(userId, 'watchedMovies');
      });
      queuedBtn.addEventListener('click', e => {
        getMoviesFromDB(userId, 'queuedMovies');
      });
      manageLogInEvents();
    } else {
      markupHome();
      manageLogOutEvents();
    }
  });
}

//functions for managing event listeners as user  is logged in and logged out
function manageLogInEvents() {
  signInForm.removeEventListener('submit', handleSignIn);
  myLibraryBtn.removeEventListener('click', openSignInModal);
  registrationForm.removeEventListener('submit', handleRegistration);
  modalSignInClose.removeEventListener('click', closeSignInModal);
  modalRegistrationOpen.removeEventListener('click', openRegistrationModal);
  modalRegistrationClose.removeEventListener('click', closeRegistrationModal);
  goToRegistrationBtn.removeEventListener('click', openRegistrationModal);
  signOutBtn.addEventListener('click', handleSignOut);
}

function manageLogOutEvents() {
  registrationForm.addEventListener('submit', handleRegistration);
  signInForm.addEventListener('submit', handleSignIn);
  signOutBtn.removeEventListener('click', handleSignOut);
  myLibraryBtn.addEventListener('click', openSignInModal);
  modalSignInClose.addEventListener('click', closeSignInModal);
  modalRegistrationOpen.addEventListener('click', openRegistrationModal);
  modalRegistrationClose.addEventListener('click', closeRegistrationModal);
  goToRegistrationBtn.addEventListener('click', openRegistrationModal);
}
