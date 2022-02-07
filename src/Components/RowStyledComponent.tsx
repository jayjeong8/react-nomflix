import styled from "styled-components";
import {motion} from "framer-motion";

export const Slider = styled.div`
  position: relative;
  height: 26vw;
  top: -100px;
`;
export const RowTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin: 16px 8%;
`;
export const InRow = styled(motion.div)`
  display: grid;
  width: 80%;
  gap: 1%;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  align-items: center;
  margin: 0 10% 16px 10%;
`;

export const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 20vw;
  font-size: 64px;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;
export const Info = styled(motion.div)`
  padding: 16px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: center;
    font-size: 12px;
  }
`;