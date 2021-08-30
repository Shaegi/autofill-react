import React from "react";
import styled from "styled-components";
import { Champ } from "../../../../types";
import { StatsType } from "../Guides";

type WrapperProps = {};

const Wrapper = styled.div<WrapperProps>`
  > div {
    display: flex;
    gap: 8px;
  }
  img {
    height: 40px;
  }
`;

export type SummonerSpellsPanelProps = {
  stats: Champ["lanes"][number];
  type: StatsType;
};

const SummonerSpellsPanel: React.FC<SummonerSpellsPanelProps> = (props) => {
  const { stats, type } = props;
  const stat = (
    type === StatsType.HIGHEST_WINRATE
      ? stats.highestWinrateSummonerSpells
      : stats.mostPopularSummonerSpells
  ).value;
  return (
    <Wrapper>
      <h3>Summoner Spells</h3>
      <div>
        {stat.map((spell) => {
          return (
            <div key={spell.name}>
              <img src={"/spell/" + spell.image} />
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default SummonerSpellsPanel;
