import './style.scss';

interface SomeObject {
  name: string,
  age: number
}

const Ivan: SomeObject = {
  name: 'Ivan',
  age: 23,
};

// Ivan.name = someName;

console.log('Ivan', Ivan);
