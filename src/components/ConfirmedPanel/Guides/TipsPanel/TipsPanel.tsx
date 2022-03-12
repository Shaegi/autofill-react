import React from "react";
import styled from "styled-components";
import { Champ } from "../../../../types";

type WrapperProps = {};

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2vh;
  .content {
    display: flex;
    flex-direction: column;
    gap: ${(p) => p.theme.size.xs};
    align-self: flex-start;
    margin-top: ${(p) => p.theme.size.m};
    background: rgba(0, 0, 0, 0.1);
    padding: ${(p) => p.theme.size.s};
  }

  ul {
    min-width: 20vw;
    max-width: 30vw;
    list-style: none;

    li {
      border-bottom: 1px solid white;
      padding-bottom: 8px;
      margin-bottom: 4px;

      :last-of-type {
        border-bottom: none;
        padding-bottom: 0px;
        margin-bottom: 0px;
      }
    }
  }
`;

export type TipsPanelProps = {
  champ: Champ;
};

const TipsPanel: React.FC<TipsPanelProps> = (props) => {
  const {
    champ: { tips },
  } = props;

  return (
    <Wrapper>
      <h3>Tips</h3>
      <div className="content">
        {tips?.length > 0 ? (
          <ul>
            {tips.map((t, i) => {
              return <li key={i}>{t}</li>;
            })}
          </ul>
        ) : (
          <div className="no-data">No Tips available</div>
        )}
      </div>
    </Wrapper>
  );
};

export default TipsPanel;
