import { ReactNode } from 'react';

export enum AppId {
  WELCOME = 'welcome',
  PRODUCT_OS = 'product_os',
  TERMINAL = 'terminal',
  WRITE = 'write',
  MEMO = 'memo',
  VIDEOS = 'videos',
  COMICS = 'comics',
  TRAVEL = 'travel',
  LEARN = 'learn'
}

export interface AppConfig {
  id: AppId;
  title: string;
  icon: ReactNode;
  component: ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultX?: number;
  defaultY?: number;
  mobileFullScreen?: boolean;
}

export interface WindowState {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export type Theme = 'light' | 'dark';