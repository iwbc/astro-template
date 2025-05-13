import styles from './breakpoint.module.scss';

type Breakpoint = Record<string, string>;

export const BREAKPOINTS: Breakpoint = styles;
export const BREAKPOINT_KEYS = Object.keys(BREAKPOINTS) as Array<keyof Breakpoint>;
