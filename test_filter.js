const filter = 'brand';
const queryParam = 'Heritage,Atelier X';
const query = {};

const values = queryParam.split(',');
query[filter] = { $in: values };

console.log(JSON.stringify(query));
