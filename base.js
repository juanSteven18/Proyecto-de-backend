// Entidad Peliculas 
let peliculas = [
    { id: "6f8b1a32-9c41-4e7a-8fbd-52d3a9b1c0e4", titulo: "Dune: Parte 2", duracion: 166, genero: "Ciencia Ficcion" },
    { id: "a2d4f5e1-0b3c-4d2e-9a1f-8c7b6a5d4e3f", titulo: "Kung Fu Panda 4", duracion: 94, genero: "Animacion" },
    { id: "123e4567-e89b-12d3-a456-426614174000", titulo: "Godzilla x Kong", duracion: 115, genero: "Accion" }
];

// Entidad Salas 
let salas = [
    { id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", nombre: "Sala 1 - IMAX", capacidad: 150 },
    { id: "550e8400-e29b-41d4-a716-446655440000", nombre: "Sala 2 - 3D", capacidad: 100 },
    { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479", nombre: "Sala 3 - VIP", capacidad: 50 }
];

// Entidad Boletos 
let boletos = [
    { id: "c9bf9e57-1685-4c89-bafb-ff5af830be8a", peliculaId: "6f8b1a32-9c41-4e7a-8fbd-52d3a9b1c0e4", salaId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", fecha: "2026-05-20" },
    { id: "d3b1b6d0-6f8d-4e92-9b21-4f1e9b2c5e4a", peliculaId: "123e4567-e89b-12d3-a456-426614174000", salaId: "550e8400-e29b-41d4-a716-446655440000", fecha: "2026-05-21" }
];

//Entidad funciones
let funciones = [
    {
        id: "f1b2c3d4-e5f6-7a8b-9c0d-11e12f13g14h",
        peliculaId: "123e4567-e89b-12d3-a456-426614174000", 
        salaId: "550e8400-e29b-41d4-a716-446655440000",        
        fecha: "2026-05-20",
        hora: "19:30",
        disponibilidad: 100 
    }
];

//Entidad reservaciones
let reservaciones = [
    {
        id: "r1a2b3c4-d5e6-7f8g-9h0i-11j12k13l14m",
        funcionId: "f1b2c3d4-e5f6-7a8b-9c0d-11e12f13g14h", 
        nombreCliente: "Carlos Mendoza",
        asiento: "F-05",
        estado: "RESERVADO" 
    }
];

module.exports = {
    peliculas,
    salas,
    boletos,
    funciones,       
    reservaciones   
};