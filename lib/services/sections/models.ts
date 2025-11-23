export interface Farm {
    id: string;
    name: string;
    location: string;
    size_ha: number;
    status: string;
    live: {
        workers: number;
        active: number;
        complete: number;
    }
}


export interface FarmParams {
    id?: string;
    name: string;
    location: string;
    size_ha: number;
    points: [number, number][];
    active?: boolean;
}