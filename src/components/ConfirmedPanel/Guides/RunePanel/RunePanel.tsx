import React from "react";
import styled from "styled-components";
import { RuneStat } from "../../../../types";
import structureDataImp from "./runesReforged.json";
import { RuneTree, StructureType } from "./types";
import classNames from "classnames";

const structureData: StructureType = structureDataImp;

type WrapperProps = {};

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .content {
    display: flex;
    padding: ${(p) => p.theme.size.m};

    ul {
      display: flex;
      align-items: center;
      list-style: none;
      justify-content: space-between;

      img {
        height: 40px;
      }
    }

    .rune-tree {
      background: rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: ${(p) => p.theme.size.m};
    }

    .rune-tree + .rune-tree {
      margin-left: ${(p) => p.theme.size.m};
    }

    .head {
      margin-bottom: ${(p) => p.theme.size.xs};
      .keystone + .keystone {
        margin-left: ${(p) => p.theme.size.s};
      }
      .keystone {
        img {
          background: ${(p) => p.theme.color.primaryLight}1A;
          border-radius: 50%;
          padding: 4px;
          border: 2px solid ${(p) => p.theme.color.primary}40;
          height: 40px;
        }
        &:not(.selected) {
          img {
            border: none;
            border-color: rgba(211, 211, 211, 0.5);
            background: none;
            height: 20px;
          }
        }
      }
    }

    .tree {
      flex-grow: 1;
      justify-content: space-between;
      display: flex;
      flex-direction: column;
      width: 200px;

      ul + ul {
        margin-top: ${(p) => p.theme.size.xs};
      }
      .slot {
        &.hidden {
          visibility: hidden;
        }
      }

      .slot-rune {
        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;

        &:not(.selected) {
          img {
            border-color: rgba(211, 211, 211, 0.5);
            height: 25px;
          }
        }
        img {
          border: 2px solid ${(p) => p.theme.color.primary};
          border-radius: 50%;
          height: 40px;
        }
      }
    }

    li:not(.selected) {
      filter: grayscale(1);
    }
  }
`;

export type RunePanelProps = {
  stats: RuneStat;
};

const RunePanel: React.FC<RunePanelProps> = (props) => {
  const { stats } = props;
  return (
    <Wrapper>
      <h3 className="headline">Runes</h3>
      <div className="content">
        <Tree selected={stats.primary} />
        <Tree selected={stats.secondary} secondary />
      </div>
    </Wrapper>
  );
};

type TreeProps = {
  selected: Record<string, number>;
  secondary?: boolean;
};

const Tree: React.FC<TreeProps> = (props) => {
  const { selected, secondary } = props;
  const ids = Object.values(selected);
  const selectedTree = structureData.find((tree) =>
    tree.slots.some((slot) => slot.runes.some((rune) => rune.id === ids[0]))
  );

  return (
    <div className="rune-tree">
      <ul className="head">
        {structureData.map((tree, index) => {
          const selected = tree.slots.some((slot) =>
            slot.runes.some((rune) => rune.id === ids[0])
          );
          return (
            <li className={classNames("keystone", { selected })}>
              <img src={tree.icon} alt={tree.name} />
            </li>
          );
        })}
      </ul>
      <div className={classNames("tree", { secondary })}>
        {selectedTree?.slots.map((slot, index) => {
          return (
            <Slot
              slot={slot}
              selectedIds={ids}
              hidden={!!secondary && index === 0}
            />
          );
        }) || null}
      </div>
    </div>
  );
};

type SlotProps = {
  selectedIds: number[];
  hidden: boolean;
  slot: RuneTree["slots"][number];
};

const Slot: React.FC<SlotProps> = (props) => {
  const { selectedIds, slot, hidden } = props;
  return (
    <ul className={classNames("slot", { hidden })}>
      {slot.runes.map((rune) => {
        const selected = selectedIds.includes(rune.id);
        return (
          <li className={classNames("slot-rune", { selected, hidden })}>
            <img src={rune.icon} alt={rune.name} />
          </li>
        );
      })}
    </ul>
  );
};

export default RunePanel;
