
export interface DefaultPawnData {
    pawnClass: string;
    abilitySets: string;
    tagRelationshipMapping: string;
    inputConfig: string;
    defaultCameraMode: string;
}

export interface ActionData {
    actionClassName: string;
    data: Array<Array<string>>
}

export interface ExperienceData {
    gameFeaturesToEnable: Array<string>;
    defaultPawnData: DefaultPawnData;
    actions: Array<ActionData>;
    actionSets: Array<string>;
    jsons: Array<string>;
    prefabs: Array<string>;
}

export interface GameModeData {
    gameModeClassString: string;
    gameStateClassString: string;
    playerStateClassString: string;
    experienceConfig: ExperienceData
}

