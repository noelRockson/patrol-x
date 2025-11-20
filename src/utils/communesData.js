export const portAuPrinceCommunes = [
  {
    id: "delmas",
    name: "Delmas",
    center: [18.550, -72.302],
    bounds: [
      [18.530, -72.325], // Sud-ouest
      [18.570, -72.280]  // Nord-est
    ],
    population: 395260,
    color: "#3B82F6"
  },
  {
    id: "petion-ville", 
    name: "Pétion-Ville",
    center: [18.512, -72.285],
    bounds: [
      [18.500, -72.300],
      [18.525, -72.270]
    ],
    population: 283052,
    color: "#10B981"
  },
  {
    id: "croix-des-bouquets",
    name: "Croix-des-Bouquets",
    center: [18.576, -72.226],
    bounds: [
      [18.560, -72.245],
      [18.592, -72.207]
    ],
    population: 229127,
    color: "#8B5CF6"
  },
  {
    id: "carrefour",
    name: "Carrefour", 
    center: [18.534, -72.395],
    bounds: [
      [18.520, -72.410],
      [18.548, -72.380]
    ],
    population: 465019,
    color: "#F59E0B"
  },
  {
    id: "port-au-prince",
    name: "Port-au-Prince",
    center: [18.539, -72.339],
    bounds: [
      [18.525, -72.355],
      [18.553, -72.323]
    ],
    population: 987310,
    color: "#EF4444"
  },
  {
    id: "cite-soleil",
    name: "Cité Soleil",
    center: [18.577, -72.321],
    bounds: [
      [18.565, -72.335],
      [18.589, -72.307]
    ],
    population: 241093,
    color: "#EC4899"
  },
  {
    id: "tabarre",
    name: "Tabarre",
    center: [18.584, -72.267],
    bounds: [
      [18.575, -72.280],
      [18.593, -72.254]
    ],
    population: 118477,
    color: "#06B6D4"
  }
]

// Polygones simplifiés pour chaque commune (coordonnées)
export const communePolygons = {
  delmas: [
    [18.530, -72.325], [18.530, -72.280], [18.570, -72.280], [18.570, -72.325], [18.530, -72.325]
  ],
  "petion-ville": [
    [18.500, -72.300], [18.500, -72.270], [18.525, -72.270], [18.525, -72.300], [18.500, -72.300]
  ],
  "croix-des-bouquets": [
    [18.560, -72.245], [18.560, -72.207], [18.592, -72.207], [18.592, -72.245], [18.560, -72.245]
  ],
  carrefour: [
    [18.520, -72.410], [18.520, -72.380], [18.548, -72.380], [18.548, -72.410], [18.520, -72.410]
  ],
  "port-au-prince": [
    [18.525, -72.355], [18.525, -72.323], [18.553, -72.323], [18.553, -72.355], [18.525, -72.355]
  ],
  "cite-soleil": [
    [18.565, -72.335], [18.565, -72.307], [18.589, -72.307], [18.589, -72.335], [18.565, -72.335]
  ],
  tabarre: [
    [18.575, -72.280], [18.575, -72.254], [18.593, -72.254], [18.593, -72.280], [18.575, -72.280]
  ]
}

