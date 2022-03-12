import React, { useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Champ } from "../../../types";

const getSkinUrl = (champId: Champ["id"], num: number) =>
  `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champId}_${num}.jpg`;
const getTransformedName = (name: string) =>
  name.substr(0, 1).toUpperCase() + name.slice(1);

const Wrapper = styled.li<{
  active: boolean;
  rolled?: boolean;
  highlight?: boolean;
  disabled?: boolean;
  selectable?: boolean;
}>`
  position: relative;
  img {
    user-select: none;
    border: 3px solid transparent;
    ${(p) =>
      p.active &&
      css`
        border-color: ${p.theme.color.primary};
      `}
    position: relative;
    z-index: 2;
  }

  .highlight-bg {
    z-index: 1;
    height: 15vh;
    width: 15vh;
    transform: translateX(-50%) scale(1.9);
    top: 0;
    left: 50%;
    position: absolute;
    background: radial-gradient(#c8aa6e 0%, transparent 72%);
  }

  ${(p) =>
    p.disabled &&
    css`
      img {
        opacity: 0.6;
      }
    `}

  ${(p) =>
    p.selectable &&
    css`
      &:hover {
        img {
          opacity: 0.75;
          border-color: white;
        }
      }
    `}

  ${(p) =>
    p.highlight &&
    css`
      transition: 1s all ease-in-out;
      z-index: 10;
      transform: scale(2);
    `}
`;

type SkinProps = {
  champ: Champ;
  skin: Champ["skins"][number];
  active: boolean;
  selectable?: boolean;
  anyRolled?: boolean;
  onClick?: (skin: SkinProps["skin"]) => void;
};

const Skin: React.FC<SkinProps> = (props) => {
  const { champ, skin, onClick, active, anyRolled, selectable } = props;
  const transformName = getTransformedName(skin.name);
  const url = getSkinUrl(champ.id, skin.num);
  const handleClick = useCallback(() => {
    onClick?.(skin);
  }, [onClick, skin]);

  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (anyRolled) {
      setTimeout(() => {
        setHighlight(true);
      }, 400);
    } else {
      setHighlight(false);
    }
  }, [anyRolled, active]);

  return (
    <Wrapper
      key={skin.id}
      onClick={handleClick}
      highlight={active && highlight}
      active={active}
      rolled={active}
      disabled={anyRolled && !active && highlight}
      selectable={selectable}
    >
      <img src={url} alt={transformName} title={transformName} />
      {highlight && active && <div className="highlight-bg" />}
    </Wrapper>
  );
};

export default Skin;
