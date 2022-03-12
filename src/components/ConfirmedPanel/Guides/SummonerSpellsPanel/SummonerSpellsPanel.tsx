import React from "react";
import styled from "styled-components";
import { Champ } from "../../../../types";
import { StatsType } from "../Guides";

type WrapperProps = {};

const Wrapper = styled.div<WrapperProps>`
  display: inline-flex;
  flex-direction: column;
  h3 {
    white-space: nowrap;
  }
  > div {
    margin-top: ${(p) => p.theme.size.m};
    display: flex;
    gap: ${(p) => p.theme.size.xs};
    background: rgba(0, 0, 0, 0.1);
    padding: ${(p) => p.theme.size.xs};
    justify-content: space-evenly;
  }
  img {
    width: ${(p) => p.theme.size.xxl};
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
              <img alt={spell.name} src={"/spell/" + spell.image} />
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};

export default SummonerSpellsPanel;
