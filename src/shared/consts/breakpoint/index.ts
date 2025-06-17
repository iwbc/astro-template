import styles from './index.module.scss';

type Breakpoint = Record<string, string>;

const { printMinWidth, ...breakpoints } = styles;

export const BREAKPOINTS: Breakpoint = breakpoints;
export const BREAKPOINT_KEYS = Object.keys(BREAKPOINTS) as Array<keyof Breakpoint>;
export const PRINT_MIN_WIDTH = printMinWidth;
