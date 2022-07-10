import elementClosest from 'element-closest';

try {
  elementClosest(window); // this is used to reference window.Element
} catch (e) {
  console.error('Error in polyfills', e);
}
