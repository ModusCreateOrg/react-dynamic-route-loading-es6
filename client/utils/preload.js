/**
 * Preload resources
 */

const tag = document.createElement('link');
tag.rel = 'preload';
tag.as = 'script';

export default (src) => {
  tag.href = src;
  document.head.appendChild(tag.cloneNode());
};
