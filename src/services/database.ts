/**
 * Mock Database Service
 * Simulates a database with usuarios and federados tables
 */

// Types
export interface Usuario {
  id: number;
  dni: string;
  fullName: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  birthDate: string;
  phone: string;
  sex: "Mujer" | "Hombre";
  createdAt: string;
  updatedAt: string;
}

export interface Federado {
  id: number;
  dni: string;
  anioVigente: number;
  numeroLicencia: string | null;
  federation: "FERM" | "FMRM" | "FEDME";
  licenseType: string;
  selectedComplements: Record<string, boolean>;
  printPhysicalCard: boolean;
}

export type UsuarioInput = Omit<Usuario, "id" | "createdAt" | "updatedAt">;
export type FederadoInput = Omit<Federado, "id">;

// Calculate current valid year for federation
export function getAnioHabil(): number {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // If we're in October-December, licenses are for next year
  if (month >= 10) {
    return year + 1;
  }
  return year;
}

// Mock data storage (simulates database tables)
const usuarios: Usuario[] = [
  {
    id: 1,
    dni: "12345678A",
    fullName: "Juan García López",
    email: "juan@example.com",
    address: "Calle Mayor 123",
    postalCode: "30001",
    city: "Murcia",
    birthDate: "1990-05-15",
    phone: "666123456",
    sex: "Hombre",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    dni: "87654321B",
    fullName: "María Martínez Ruiz",
    email: "maria@example.com",
    address: "Avenida de la Libertad 45",
    postalCode: "30002",
    city: "Cartagena",
    birthDate: "1985-08-22",
    phone: "677234567",
    sex: "Mujer",
    createdAt: "2024-02-10T14:30:00Z",
    updatedAt: "2024-02-10T14:30:00Z",
  },
  {
    id: 3,
    dni: "11223344C",
    fullName: "Pedro Sánchez Fernández",
    email: "pedro@example.com",
    address: "Plaza España 7",
    postalCode: "30003",
    city: "Lorca",
    birthDate: "1978-12-03",
    phone: "688345678",
    sex: "Hombre",
    createdAt: "2023-11-20T09:15:00Z",
    updatedAt: "2024-01-05T11:20:00Z",
  },
];

const federados: Federado[] = [
  {
    id: 1,
    dni: "12345678A",
    anioVigente: 2025,
    numeroLicencia: "FERM-2025-0001",
    federation: "FERM",
    licenseType: "FERM_BASICA_A",
    selectedComplements: {},
    printPhysicalCard: false,
  },
  {
    id: 2,
    dni: "87654321B",
    anioVigente: 2025,
    numeroLicencia: "FMRM-2025-0042",
    federation: "FMRM",
    licenseType: "FMRM_B",
    selectedComplements: { mountainBike: true },
    printPhysicalCard: true,
  },
  {
    id: 3,
    dni: "11223344C",
    anioVigente: 2024,
    numeroLicencia: "FEDME-2024-0123",
    federation: "FEDME",
    licenseType: "FEDME_C",
    selectedComplements: { alpineSki: true, snow: true },
    printPhysicalCard: true,
  },
];

// Auto-increment IDs
let nextUsuarioId = usuarios.length + 1;
let nextFederadoId = federados.length + 1;

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Database operations for usuarios table
 */
export const usuariosDB = {
  async getByDNI(dni: string): Promise<Usuario | null> {
    await delay(200);
    const normalizedDNI = dni.toUpperCase().trim();
    return usuarios.find((u) => u.dni.toUpperCase() === normalizedDNI) || null;
  },

  async getAll(): Promise<Usuario[]> {
    await delay(150);
    return [...usuarios];
  },

  async create(data: UsuarioInput): Promise<Usuario> {
    await delay(300);
    const now = new Date().toISOString();
    const newUsuario: Usuario = {
      ...data,
      dni: data.dni.toUpperCase().trim(),
      id: nextUsuarioId++,
      createdAt: now,
      updatedAt: now,
    };
    usuarios.push(newUsuario);
    return newUsuario;
  },

  async update(dni: string, data: Partial<UsuarioInput>): Promise<Usuario | null> {
    await delay(250);
    const normalizedDNI = dni.toUpperCase().trim();
    const index = usuarios.findIndex((u) => u.dni.toUpperCase() === normalizedDNI);
    if (index === -1) return null;

    usuarios[index] = {
      ...usuarios[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return usuarios[index];
  },

  async delete(dni: string): Promise<boolean> {
    await delay(200);
    const normalizedDNI = dni.toUpperCase().trim();
    const index = usuarios.findIndex((u) => u.dni.toUpperCase() === normalizedDNI);
    if (index === -1) return false;
    usuarios.splice(index, 1);
    return true;
  },
};

/**
 * Database operations for federados table
 */
export const federadosDB = {
  async getByDNI(dni: string, anio?: number): Promise<Federado | null> {
    await delay(200);
    const normalizedDNI = dni.toUpperCase().trim();
    const targetAnio = anio || getAnioHabil();

    return (
      federados.find(
        (f) => f.dni.toUpperCase() === normalizedDNI && f.anioVigente === targetAnio
      ) || null
    );
  },

  async getAllByDNI(dni: string): Promise<Federado[]> {
    await delay(150);
    const normalizedDNI = dni.toUpperCase().trim();
    return federados.filter((f) => f.dni.toUpperCase() === normalizedDNI);
  },

  async getLatestByDNI(dni: string): Promise<Federado | null> {
    await delay(200);
    const normalizedDNI = dni.toUpperCase().trim();
    const userFederados = federados
      .filter((f) => f.dni.toUpperCase() === normalizedDNI)
      .sort((a, b) => b.anioVigente - a.anioVigente);

    return userFederados[0] || null;
  },

  async create(data: FederadoInput): Promise<Federado> {
    await delay(300);
    const newFederado: Federado = {
      ...data,
      dni: data.dni.toUpperCase().trim(),
      id: nextFederadoId++,
    };
    federados.push(newFederado);
    return newFederado;
  },

  async update(
    dni: string,
    anio: number,
    data: Partial<FederadoInput>
  ): Promise<Federado | null> {
    await delay(250);
    const normalizedDNI = dni.toUpperCase().trim();
    const index = federados.findIndex(
      (f) => f.dni.toUpperCase() === normalizedDNI && f.anioVigente === anio
    );
    if (index === -1) return null;

    federados[index] = {
      ...federados[index],
      ...data,
    };
    return federados[index];
  },

  async existsForYear(dni: string, anio: number): Promise<boolean> {
    await delay(100);
    const normalizedDNI = dni.toUpperCase().trim();
    return federados.some(
      (f) => f.dni.toUpperCase() === normalizedDNI && f.anioVigente === anio
    );
  },
};

/**
 * Generate a new license number
 */
export function generateLicenseNumber(federation: string, anio: number): string {
  const count = federados.filter(
    (f) => f.federation === federation && f.anioVigente === anio
  ).length;
  const paddedCount = String(count + 1).padStart(4, "0");
  return `${federation}-${anio}-${paddedCount}`;
}
