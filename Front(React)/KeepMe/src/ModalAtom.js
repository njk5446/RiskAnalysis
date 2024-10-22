import { atom } from "recoil";

export const modalAtom = atom({
  key: 'modalAtom',
  default: {
    isOpen: false, // 모달이 열려 있는지 여부
    duplicate: false  // 모달 중첩 여부 (true, false)
  },
});