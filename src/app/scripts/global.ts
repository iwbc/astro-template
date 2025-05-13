import isMobile from 'ismobilejs';
import { debounce } from 'throttle-debounce';

function setViewport() {
  const screenWidth = window.screen.width;
  let viewport = 'width=device-width';

  if (isMobile().phone) {
    if (screenWidth < 375) {
      viewport = 'width=375';
    } else {
      viewport = 'width=device-width';
    }
  } else {
    viewport = 'width=1280';
  }

  document.querySelector('meta[name=viewport]')?.setAttribute('content', viewport);
}

function setScrollbarWidthCSSProp() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', (scrollbarWidth > 0 ? scrollbarWidth : 0) + 'px');
}

setViewport();
setScrollbarWidthCSSProp();
window.addEventListener('resize', debounce(100, setViewport));
window.addEventListener('resize', debounce(100, setScrollbarWidthCSSProp));

document.documentElement.style.scrollBehavior = 'smooth';
