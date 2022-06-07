
import './style.scss';

console.log('Webpack with typescript');

const a = 25;

const Persone = {
  name: 'huy',
  age: 25,
  skils: ['html', 'css', 'js']
}

console.log('Persone', Persone);

const start = new Promise((res, rej) => {
  console.log('ONE!');
})

start.then(() => {
  console.log('DWO');
})