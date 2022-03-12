import React from "react";
import styled from "styled-components";
import { Champ } from "../../../../types";
import { StatsType } from "../Guides";

type WrapperProps = {};

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  .content {
    display: flex;
    flex-direction: column;
    gap: ${(p) => p.theme.size.xs};
    align-self: flex-start;
    margin-top: ${(p) => p.theme.size.m};
    background: rgba(0, 0, 0, 0.1);
    padding: ${(p) => p.theme.size.s};

    .row {
      display: flex;
      gap: ${(p) => p.theme.size.xxs};
      > div {
        border-radius: 4px;
        height: ${(p) => p.theme.size.l};
        width: ${(p) => p.theme.size.l};
        line-height: ${(p) => p.theme.size.s};
        font-size: 13px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: rgba(255, 255, 255, 0.6);
      }
      img {
        max-height: 100%;
        /** Hide alt text if image not present */
        text-indent: 100%;
        white-space: nowrap;
        overflow: hidden;
      }
    }

    .row:not(.head-row) {
      > div {
        color: ${(p) => p.theme.color.primary};
        background: rgba(0, 0, 0, 0.7);
      }
    }
  }
`;

export type SkillsPanelProps = {
  champ: Champ;
  stats: Champ["lanes"][number];
  type: StatsType;
};

const SkillsPanel: React.FC<SkillsPanelProps> = (props) => {
  const {
    stats,
    type,
    champ: { spells },
  } = props;

  const skilled = (
    type === StatsType.HIGHEST_WINRATE
      ? stats.highestWinrateSkillOrder
      : stats.mostPopularSkillOrder
  )?.value;

  if (!skilled) {
    return null;
  }

  return (
    <Wrapper>
      <h3>Skill order</h3>
      <div className="content">
        <div className="row head-row">
          <div />
          {[...new Array(18)].map((v, i) => {
            return (
              <div>
                <span>{i + 1}</span>
              </div>
            );
          })}
        </div>
        <SkillRow skilled={skilled} id={1} name="Q" image={spells[0]} />
        <SkillRow skilled={skilled} id={2} name="W" image={spells[1]} />
        <SkillRow skilled={skilled} id={3} name="E" image={spells[2]} />
        <SkillRow skilled={skilled} id={4} name="R" image={spells[3]} />
      </div>
    </Wrapper>
  );
};

type SkillRowProps = {
  skilled: number[];
  id: number;
  image: Champ["spells"][number];
  name: string;
};

const SkillRow: React.FC<SkillRowProps> = (props) => {
  const { skilled, id, name } = props;
  return (
    <div className="row">
      <div>
        <img src={"./spell/" + props.image.image} alt={props.image.id} />
      </div>
      {[...new Array(18)].map((v, i) => {
        return (
          <div>
            <span>{skilled[i] === id ? name : null}</span>
          </div>
        );
      })}
    </div>
  );
};

export default SkillsPanel;
