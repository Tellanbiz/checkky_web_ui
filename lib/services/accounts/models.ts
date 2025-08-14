export interface Account {
    picture: string;
    full_name: string;
    email: string;
}

export interface Owner {
    id: string;
    full_name: string;
    email: string;
    farm?: {
        id: string;
        name: string;
    }
}

export interface Farm {
    id: string;
    name: string;
    location: string;
    country: string;
    size_ha: number;
    points: [number, number]; // [longitude, latitude]
    owner: Owner;
}
