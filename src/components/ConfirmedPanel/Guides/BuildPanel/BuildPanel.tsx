import React from "react";
import styled from "styled-components";
import { Champ } from "../../../../types";
import structureImp from "./item.json";
import { StatsType } from "../Guides";
import { ItemStructure } from "./types";

const structure: ItemStructure = structureImp;

type WrapperProps = {};

const Wrapper = styled.div<WrapperProps>`
  > .content {
    display: flex;
    background: rgba(0, 0, 0, 0.1);
  }
  .item-wrapper {
    padding: ${(p) => p.theme.size.xxs};
    border-radius: 4px;
    img {
      width: ${(p) => p.theme.size.xxl};
    }
  }
  .item-wrapper + .item-wrapper {
    margin-left: ${(p) => p.theme.size.m};
  }
`;

export type BuildPanelProps = {
  type: StatsType;
  stats: Champ["lanes"][number]["buildStats"];
};

const BuildPanel: React.FC<BuildPanelProps> = (props) => {
  const { stats, type } = props;
  console.log(stats);
  return (
    <Wrapper>
      <h3 className="headline">Build</h3>
      <div className="content">
        {Object.values(stats).map((buildItem) => {
          const itemId =
            buildItem?.[
              type === StatsType.HIGHEST_WINRATE
                ? "highestWinrate"
                : "mostPopular"
            ];
          const structureItem = structure.data[itemId];

          if (!structureItem) {
            return null;
          }

          return (
            structureItem && (
              <div className="item-wrapper">
                <img
                  src={"item/" + structureItem?.image.full}
                  alt={structureItem.name}
                />
              </div>
            )
          );
        })}
      </div>
    </Wrapper>
  );
};

export default BuildPanel;
