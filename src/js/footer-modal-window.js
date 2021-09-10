import { backdrop, footerLink, modalCloseBtn } from './refs.js';

export default function clickOnFooterLink(e) {
  e.preventDefault();
  openModal();
}

function clickOnCloseModalBtn(e) {
  e.preventDefault();
  closeModal();
}

function openModal() {
  window.addEventListener('keydown', onEscPress);
  backdrop.classList.remove('visually-hidden', 'team__backdrop-is-hiden');
}

function closeModal() {
  window.removeEventListener('keydown', onEscPress);
  backdrop.classList.add('visually-hidden', 'team__backdrop-is-hiden');
}

function onEscPress(event) {
  if (event.code === 'Escape') {
    closeModal();
  }
}

function closeOnLightboxClick(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

backdrop.addEventListener('click', closeOnLightboxClick);
footerLink.addEventListener('click', clickOnFooterLink);
modalCloseBtn.addEventListener('click', clickOnCloseModalBtn);
