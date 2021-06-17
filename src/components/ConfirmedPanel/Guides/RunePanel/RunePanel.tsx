import React from "react";
import styled from "styled-components";
import { RuneStat } from "../../../../types";
import structureDataImp from "./runesReforged.json";
import { RuneTree, StructureType } from "./types";
import classNames from "classnames";

const structureData: StructureType = structureDataImp;

type WrapperProps = {};

const Wrapper = styled.div<WrapperProps>`
  .content {
    display: flex;
    background: rgba(0,0,0,0.1);
    padding: ${p => p.theme.size.m};
    
    ul {
      display: flex;
      list-style: none;

      img {
        height: 40px;
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
      <div className='headline'>Runes</div>
      <div className='content'>
        <Tree selected={stats.primary} />
        <Tree selected={stats.secondary} />
      </div>
    </Wrapper>
  );
};

type TreeProps = {
  selected: Record<string, number>;
};

const Tree: React.FC<TreeProps> = (props) => {
  const { selected } = props;
  const ids = Object.values(selected);
  const selectedTree = structureData.find((tree) =>
    tree.slots.some((slot) => slot.runes.some((rune) => rune.id === ids[0]))
  );

  return (
    <div>
      <ul className="head">
        {structureData.map((tree) => {
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
      <div className="tree">
        {selectedTree?.slots.map((slot) => {
          return <Slot slot={slot} selectedIds={ids} />;
        }) || null}
      </div>
    </div>
  );
};

type SlotProps = {
  selectedIds: number[];
  slot: RuneTree["slots"][number];
};

const Slot: React.FC<SlotProps> = (props) => {
  const { selectedIds, slot } = props;
  return (
    <ul>
      {slot.runes.map((rune) => {
        const selected = selectedIds.includes(rune.id);
        return (
          <li className={classNames("slot-rune", { selected })}>
            <img src={rune.icon} alt={rune.name} />
          </li>
        );
      })}
    </ul>
  );
};

export default RunePanel;
