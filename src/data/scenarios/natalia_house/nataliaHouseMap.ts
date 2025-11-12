import MapCell from "../../../classes/map/MapCell";

// En el nombre de cada celda, el primer número es la columna y el segundo la fila.

const mapCell11 = new MapCell({
  id: 1,
  col: 1,
  row: 1,
  group: "salon",
  reachableCells: [{ col: 2, row: 1 }],
});

const mapCell21 = new MapCell({
  id: 2,
  col: 2,
  row: 1,
  group: "salon",
  name: "Salón",
  reachableCells: [
    { col: 1, row: 1 },
    { col: 3, row: 1 },
  ],
  doorsToShow: {
    north: "closed",
    south: "open",
  },
  hasPuzzle: true,
});

const mapCell31 = new MapCell({
  id: 3,
  col: 3,
  row: 1,
  group: "salon",
  reachableCells: [{ col: 2, row: 1 }],
});

const mapCell12 = new MapCell({
  id: 4,
  col: 1,
  row: 2,
});

const mapCell22 = new MapCell({
  id: 5,
  col: 2,
  row: 2,
  group: "pasillo",
  reachableCells: [
    { col: 2, row: 1 },
    { col: 2, row: 3 },
  ],
});

const mapCell32 = new MapCell({
  id: 6,
  col: 3,
  row: 2,
});

const mapCell13 = new MapCell({
  id: 7,
  col: 1,
  row: 3,
  group: "",
  name: "Baño",
  reachableCells: [{ col: 2, row: 3 }],
  hasNpc: true,
});

const mapCell23 = new MapCell({
  id: 8,
  col: 2,
  row: 3,
  group: "pasillo",
  name: "Pasillo Secreto de la Muerte",
  namePosition: "top",
  reachableCells: [
    { col: 2, row: 2 },
    { col: 1, row: 3 },
    { col: 2, row: 4 },
  ],
  doorsToShow: {
    west: "open",
  },
  hasSpirit: true,
});

const mapCell33 = new MapCell({
  id: 9,
  col: 3,
  row: 3,
});

const mapCell14 = new MapCell({
  id: 10,
  col: 1,
  row: 4,
});

const mapCell24 = new MapCell({
  id: 11,
  col: 2,
  row: 4,
  group: "",
  name: "Descansillo",
  reachableCells: [{ col: 2, row: 4 }],
  doorsToShow: {
    north: "open",
  },
  hasPuzzle: true,
  hasNpc: true,
  hasSpirit: true,
});

const mapCell34 = new MapCell({
  id: 12,
  col: 3,
  row: 4,
});

const nataliaHouseMap = [
  mapCell11,
  mapCell21,
  mapCell31,
  mapCell12,
  mapCell22,
  mapCell32,
  mapCell13,
  mapCell23,
  mapCell33,
  mapCell14,
  mapCell24,
  mapCell34,
];

export default nataliaHouseMap;
