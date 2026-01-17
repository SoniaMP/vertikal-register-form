/**
 * Mock Database for MSW handlers
 * In-memory storage that simulates a database
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

// Initial mock data
const initialUsuarios: Usuario[] = [
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

const initialFederados: Federado[] = [
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

// In-memory database state
class MockDatabase {
  private usuarios: Usuario[] = [...initialUsuarios];
  private federados: Federado[] = [...initialFederados];
  private nextUsuarioId = initialUsuarios.length + 1;
  private nextFederadoId = initialFederados.length + 1;

  // Usuario operations
  getUsuarioByDNI(dni: string): Usuario | null {
    const normalizedDNI = dni.toUpperCase().trim();
    return this.usuarios.find((u) => u.dni.toUpperCase() === normalizedDNI) || null;
  }

  getAllUsuarios(): Usuario[] {
    return [...this.usuarios];
  }

  createUsuario(data: UsuarioInput): Usuario {
    const now = new Date().toISOString();
    const newUsuario: Usuario = {
      ...data,
      dni: data.dni.toUpperCase().trim(),
      id: this.nextUsuarioId++,
      createdAt: now,
      updatedAt: now,
    };
    this.usuarios.push(newUsuario);
    return newUsuario;
  }

  updateUsuario(dni: string, data: Partial<UsuarioInput>): Usuario | null {
    const normalizedDNI = dni.toUpperCase().trim();
    const index = this.usuarios.findIndex((u) => u.dni.toUpperCase() === normalizedDNI);
    if (index === -1) return null;

    this.usuarios[index] = {
      ...this.usuarios[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.usuarios[index];
  }

  deleteUsuario(dni: string): boolean {
    const normalizedDNI = dni.toUpperCase().trim();
    const index = this.usuarios.findIndex((u) => u.dni.toUpperCase() === normalizedDNI);
    if (index === -1) return false;
    this.usuarios.splice(index, 1);
    return true;
  }

  // Federado operations
  getFederadoByDNI(dni: string, anio?: number): Federado | null {
    const normalizedDNI = dni.toUpperCase().trim();
    const targetAnio = anio || getAnioHabil();

    return (
      this.federados.find(
        (f) => f.dni.toUpperCase() === normalizedDNI && f.anioVigente === targetAnio
      ) || null
    );
  }

  getAllFederadosByDNI(dni: string): Federado[] {
    const normalizedDNI = dni.toUpperCase().trim();
    return this.federados.filter((f) => f.dni.toUpperCase() === normalizedDNI);
  }

  getLatestFederadoByDNI(dni: string): Federado | null {
    const normalizedDNI = dni.toUpperCase().trim();
    const userFederados = this.federados
      .filter((f) => f.dni.toUpperCase() === normalizedDNI)
      .sort((a, b) => b.anioVigente - a.anioVigente);

    return userFederados[0] || null;
  }

  createFederado(data: FederadoInput): Federado {
    const newFederado: Federado = {
      ...data,
      dni: data.dni.toUpperCase().trim(),
      id: this.nextFederadoId++,
    };
    this.federados.push(newFederado);
    return newFederado;
  }

  updateFederado(dni: string, anio: number, data: Partial<FederadoInput>): Federado | null {
    const normalizedDNI = dni.toUpperCase().trim();
    const index = this.federados.findIndex(
      (f) => f.dni.toUpperCase() === normalizedDNI && f.anioVigente === anio
    );
    if (index === -1) return null;

    this.federados[index] = {
      ...this.federados[index],
      ...data,
    };
    return this.federados[index];
  }

  existsFederadoForYear(dni: string, anio: number): boolean {
    const normalizedDNI = dni.toUpperCase().trim();
    return this.federados.some(
      (f) => f.dni.toUpperCase() === normalizedDNI && f.anioVigente === anio
    );
  }

  // Combined query
  getUsuarioConFederacion(dni: string): { usuario: Usuario; federado: Federado | null } | null {
    const usuario = this.getUsuarioByDNI(dni);
    if (!usuario) return null;

    const federado = this.getLatestFederadoByDNI(dni);
    return { usuario, federado };
  }

  // Generate license number
  generateLicenseNumber(federation: string, anio: number): string {
    const count = this.federados.filter(
      (f) => f.federation === federation && f.anioVigente === anio
    ).length;
    const paddedCount = String(count + 1).padStart(4, "0");
    return `${federation}-${anio}-${paddedCount}`;
  }

  // Reset to initial state (useful for tests)
  reset(): void {
    this.usuarios = [...initialUsuarios];
    this.federados = [...initialFederados];
    this.nextUsuarioId = initialUsuarios.length + 1;
    this.nextFederadoId = initialFederados.length + 1;
  }
}

// Export singleton instance
export const db = new MockDatabase();
