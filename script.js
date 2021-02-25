const consortiasData = [
  {
      "administrator":"BancoDesconsorcio",
      "type":"Contemplado",
      "item":"Carro",
      "credit":"20.000,00",
      "part":10,
      "debit":"1.500,00",
      "offer":"5.000,00"
  },
  {
      "administrator":"BancoDesconsorcio",
      "type":"Contemplado",
      "item":"Carro",
      "credit":"30.000,00",
      "part":20,
      "debit":"1.500,00",
      "offer":"10.000,00"
  },
  {
      "administrator":"BancoDesconsorcio",
      "type":"Contemplado",
      "item":"Carro",
      "credit":"35.000,00",
      "part":30,
      "debit":"1.900,00",
      "offer":"8.000,00"
  },
  {
      "administrator":"BancoDesconsorcio",
      "type":"Contemplado",
      "item":"Carro",
      "credit":"35.000,00",
      "part":30,
      "debit":"1.900,00",
      "offer":"8.000,00"
  },
  {
      "administrator":"BancoDesconsorcio",
      "type":"Contemplado",
      "item":"Carro",
      "credit":"15.000,00",
      "part":10,
      "debit":"1.850,00",
      "offer":"3.000,00"
  },
  {
      "administrator":"BancoDesconsorcio",
      "type":"Contemplado",
      "item":"Carro",
      "credit":"18.500,00",
      "part":30,
      "debit":"1.100,00",
      "offer":"7.000,00"
  },
  {
      "administrator":"BancoDesconsorcio",
      "type":"Contemplado",
      "item":"Carro",
      "credit":"22.000,00",
      "part":24,
      "debit":"980,00",
      "offer":"1.000,00"
  }
];

// End data

let allPossibilities = [];

const convertCreditStringToFloat = (data) => {
  return data.map((item) => {
    if (typeof item.credit === "string") {
      item.credit = parseFloat(item.credit.replace('.', '').replace(',', '.'));
    }

    return item;
  });
}

const createConsortiasId = (arr) => {
  const consortiasWithId = arr.map((item, index) => {
    return {
      id: index,
      ...item
    }
  });

  return consortiasWithId;
}

const changeCrescentOrder = ([...arr]) => {
  return arr.sort((a, b) => a.credit - b.credit);
}

const removeDuplicity = ([...arr]) => {
  const arrayWithoutDiplicity = new Set();

  arr.forEach((item) => {
    arrayWithoutDiplicity.add(JSON.stringify(changeCrescentOrder(item)));
  });

  return Array.from(arrayWithoutDiplicity).map((item) => JSON.parse(item));
}

const filterCombinations = (arr, max, min) => {
  const combinations = arr.filter((item) => item.length !== 1);

  const maxMinCombinations = combinations.map((item) => {
    const total = item.reduce((prev, curr) => prev+=curr.credit, 0);
    
    if (total > min && total < max) return item;
  });

  const filteredCombinations = maxMinCombinations.filter((item) => item !== undefined);

  return filteredCombinations;
}

const makeAllCombinations = (res, arr) => {
  allPossibilities.push(res);

  for (let j = 0; j < arr.length; j++) {
    let oldArray = [...arr];

    let [value] = oldArray.splice(j, 1);

    makeAllCombinations([...res, value], oldArray);
  }
}

const startApp = () => {
  allPossibilities = [];

  const dataParsed = createConsortiasId(convertCreditStringToFloat(consortiasData));

  for (let i = 0; i < dataParsed.length; i++) {
    let oldArray = [...dataParsed];

    let value = oldArray.splice(i, 1);

    makeAllCombinations(value, oldArray);
  }

  const max = document.getElementById("max").value;
  const min = document.getElementById("min").value;

  const combinations = removeDuplicity(filterCombinations(allPossibilities, max, min));

  listConsortiasDatas(combinations);
}

const listConsortiasDatas = (data) => {
  let contentHtml = '';
  document.getElementById("list-container").innerHTML = '';

  data.forEach((arr, indexContainer) => {
    arr.forEach((item) => {
      contentHtml += `<div class="item-content">
      <h3>Item: ${item.id}</h3>
      <span>Administrador: ${item.administrator}</span>
      <span>Tipo: ${item.type}</span>
      <span>Item: ${item.item}</span>
      <span>Crédito: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.credit)}</span>
      <span>Débito: R$ ${item.debit}</span>
      <span>Oferta: R$ ${item.offer}</span>
    </div>`;
    });

    document.getElementById("list-container").innerHTML += `<div class="list-container">
    <h2>Combinação: ${indexContainer + 1}</h2>
      <div class="list-content">${contentHtml}</div>
    </div>`;
  
    contentHtml = '';
  });
}

document.getElementById("submit-combinations").addEventListener("click", startApp);