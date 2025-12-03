export interface Section {
    id: string;
    name: string;
    location: string;
    size_ha: number;
    points?: [number, number][];
    live: {
        workers: number;
        active: number;
        complete: number;
    }
}


export interface SectionParams {
    id?: string;
    name: string;
    location: string;
    size_ha: number;
    points: [number, number][];
    active?: boolean;
}