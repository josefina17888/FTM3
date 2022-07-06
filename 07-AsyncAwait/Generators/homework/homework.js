function* fizzBuzzGenerator(max) {
  // Tu código acá:
let num = 1;
while(max? num <= max : true){
  if (num%3 === 0 && num%5 === 0){
    yield 'Fizz Buzz'
    }
  else if (num%3 === 0){
    yield 'Fizz'
    }
  else if (num%5 === 0){
    yield 'Buzz'
    }
  else {
    yield num
    };
  num++;
}
}

module.exports = fizzBuzzGenerator;

/*  * Debe devolver como valor `Fizz` cuando el número actual 
es divisible por 3
  * Debe devolver como valor `Buzz` cuando el número actual 
es divisible por 5
  * Debe devolver como valor `Fizz Buzz` cuando el número actual 
es divisible tanto por 3 como por 5
  * Debe devolver como valor el número actual si no se cumple 
ninguna de las condiciones anteriores */
