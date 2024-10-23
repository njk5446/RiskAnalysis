
import { atom } from 'recoil';

export const refreshState = atom({
  key: 'refreshState',
  default: false,
})

export const isBoardMainOpenState = atom({
  key: 'isBoardMainOpen',
  default: false,
});

export const isBoardDetailOpenState = atom({
  key: 'isBoardDetailOpen',
  default: false,
});

export const isBoardEditOpenState = atom({
  key: 'isBoardEditOpen',
  default: false,
});

export const isBoardWriteOpenState = atom({
  key: 'isBoardWriteOpen',
  default: false,
});

export const selectedPostIdState = atom({
  key: 'selectedPostId',
  default: null,
});