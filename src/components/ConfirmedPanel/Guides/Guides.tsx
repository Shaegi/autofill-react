import { Tab, Tabs } from "@material-ui/core";
import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Champ, Lane } from "../../../types";
import BuildPanel from "./BuildPanel/BuildPanel";
import RunePanel from "./RunePanel/RunePanel";
import TipsPanel from "./TipsPanel/TipsPanel";
import SkillsPanel from "./SkillsPanel/SkillsPanel";
import SummonerSpellsPanel from "./SummonerSpellsPanel/SummonerSpellsPanel";

type WrapperProps = {};

const Wrapper = styled.div<WrapperProps>`
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .MuiTab-root {
    font-weight: bold;
  }
  .Mui-selected {
    color: white;
  }
  .MuiTabs-indicator {
    background-repeat: none;
    transform: translateY(-4px);
    background: radial-gradient(#e3cea3 0%, transparent 82%);
  }
`;

export enum StatsType {
  HIGHEST_WINRATE,
  MOST_POPULAR,
}

export type GuidesProps = {
  champ: Champ;
  lane: Lane;
};

const Guides: React.FC<GuidesProps> = (props) => {
  const { champ, lane } = props;
  const stats = champ.lanes.find((champLane) => champLane.type === lane);
  const [value, setValue] = useState(0);
  const handleTabChange = useCallback((event: any, value: any) => {
    setValue(value);
  }, []);
  if (!stats) {
    return null;
  }

  return (
    <Wrapper key={champ.key}>
      <Tabs value={value} onChange={handleTabChange}>
        <Tab label="Highest Winrate" />
        <Tab label="Most Popular" />
      </Tabs>
      <TabPanel
        champ={champ}
        value={value}
        index={0}
        stats={stats}
        type={StatsType.HIGHEST_WINRATE}
      />
      <TabPanel
        champ={champ}
        value={value}
        index={1}
        stats={stats}
        type={StatsType.MOST_POPULAR}
      />
    </Wrapper>
  );
};

const TabPanelWrapper = styled.div`
  height: 100%;

  overflow: auto;
  margin-top: ${(p) => p.theme.size.xs};
  padding: ${(p) => p.theme.size.m};
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  align-items: center;
  border-radius: ${(p) => p.theme.size.xxs};
  background: rgba(255, 255, 255, 0.1);

  gap: ${(p) => p.theme.size.m};
`;

type TabPanelProps = {
  type: StatsType;
  index: number;
  champ: Champ;
  value: number;
  stats: Champ["lanes"][number];
};

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { champ, index, value, stats, type } = props;

  if (index !== value) {
    return null;
  }

  return (
    <TabPanelWrapper>
      <RunePanel
        stats={
          type === StatsType.HIGHEST_WINRATE
            ? stats.highestWinrateRunes?.value
            : stats.mostPopularRunes?.value
        }
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <SkillsPanel champ={champ} stats={stats} type={type} />
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          <BuildPanel stats={stats.buildStats} type={type} />
          <SummonerSpellsPanel type={type} stats={stats} />
        </div>
        <TipsPanel champ={champ} />
      </div>
    </TabPanelWrapper>
  );
};

export default Guides;
