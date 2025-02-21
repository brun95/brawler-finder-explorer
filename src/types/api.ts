
export interface Brawler {
    id: number;
    name: string;
    starPowers: {
        id: number;
        name: string;
    }[];
    gadgets: {
        id: number;
        name: string;
    }[];
}

export interface Event {
    startTime: string;
    endTime: string;
    slotId: number;
    event: {
        id: number;
        mode: string;
        map: string;
        modifiers?: string[];
    };
}

export interface PlayerBrawler {
    id: number;
    name: string;
    power: number;
    rank: number;
}

export interface BattleLog {
    battleTime: string;
    event: {
        id: number;
        mode: string;
        map: string;
    };
    battle: {
        mode: string;
        type: string;
        result: string;
        duration: number;
        starPlayer: {
            tag: string;
            name: string;
            brawler: {
                id: number;
                name: string;
                power: number;
                trophies: number;
            };
        };
        teams: {
            tag: string;
            name: string;
            brawler: {
                id: number;
                name: string;
                power: number;
                trophies: number;
            };
        }[][];
    };
}
