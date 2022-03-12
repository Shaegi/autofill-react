export type RuneStat = {
  primary: {
    keyStone: number;
    perk1: number;
    perk2: number;
    perk3: number;
  };
  secondary: {
    perk1: number;
    perk2: number;
  };
};

export type ItemStatDetail = {
  id: number;
  wins: number;
  count: number;
};

export type ItemStat = {
  highestWinrate: string;
  mostPopular: string;
};

export type BuildStat = {
  trinket: ItemStat;
  item0: ItemStat;
  item1: ItemStat;
  item2: ItemStat;
  item3: ItemStat;
  item4: ItemStat;
  item5: ItemStat;
};

export type SummonerSpellDetail = {
  name: string;
  id: string;
  image: string;
};

export type SummonerSpellStat = {
  value: [SummonerSpellDetail, SummonerSpellDetail];
};

export type Champ = {
  name: string;
  id: string;
  key: string;
  version: string;
  chestGranted: boolean;
  spells: {
    id: string;
    image: string;
  }[];
  tips: string[];
  lanes: {
    type: string;
    probability: number;
    buildStats: BuildStat;
    highestWinrateSummonerSpells: SummonerSpellStat;
    mostPopularSummonerSpells: SummonerSpellStat;
    highestWinrateRunes: {
      value: RuneStat;
    };
    mostPopularRunes: {
      value: RuneStat;
    };
    mostPopularSkillOrder: {
      value: number[];
    };
    highestWinrateSkillOrder: {
      value: number[];
    };
  }[];
  title: string;
  info: {
    difficulty: number;
  };
  layout: {
    key: string | null;
    splashArtOffset: number | null;
  };
  skins: {
    name: string;
    id: string;
    num: number;
  }[];
  totalConfirmedCount: number;
  confirmedCount: {
    count: number;
    lane: Lane;
    score: number;
  }[];
  masteryPoints: number | null;
  masteryLevel: number | null;
  probability?: number | null;
  roles: Role[];
  tags: string[];
};

export enum Lane {
  TOP = "LANE_TYPE_TOP",
  JUNGLE = "LANE_TYPE_JUNGLE",
  MID = "LANE_TYPE_MID",
  BOT = "LANE_TYPE_ADC",
  SUPPORT = "LANE_TYPE_SUPPORT",
}

export enum Role {
  MAGE = "Mage",
  FIGHTER = "Fighter",
  TANK = "Tank",
  SUPPORT = "Support",
  MARKSMAN = "Marksman",
  ASSASSIN = "Assassin",
}
