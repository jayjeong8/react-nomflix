import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {motion} from "framer-motion";
import {useRecoilState, useSetRecoilState} from "recoil";
import {
    IncreaseState,
    ModalLeaving,
    MovieNowPlaying,
    MoviePopular,
     MovieTopRated,
    MovieUpcoming,
    TVAiringToday, TVOnTheAir, TVPopular,
    TVTopRated
} from "../atom";
import {IIndexControl} from "../api";


const DecreaseButton = styled(motion.span)`
  z-index: 2;
  position: absolute;
  align-items: center;
  top: 13vw;
  left: 4%;
`;
const IncreaseButton = styled(motion.span)`
  z-index: 2;
  position: absolute;
  align-items: center;
  top: 13vw;
  right: 4%;
`;

const offset = 6;

export default function IndexControlButton({queryKeyName2, data}:IIndexControl) {
    const [leaving, setLeaving] = useRecoilState(ModalLeaving);
    const setIndex = useSetRecoilState(queryKeyName2 === "nowPlaying" ? MovieNowPlaying :
        queryKeyName2 === "topRated" ? MovieTopRated :
            queryKeyName2 === "popular" ? MoviePopular :
                queryKeyName2 === "upcoming" ? MovieUpcoming :
                    queryKeyName2 === "airingToday" ? TVAiringToday :
                        queryKeyName2 === "topRatedTV" ? TVTopRated :
                            queryKeyName2 === "popularTV" ? TVPopular : TVOnTheAir)
    const toggleLeaving = () => setLeaving((prev:boolean) => !prev);
    const setIncreaseValue = useSetRecoilState(IncreaseState);

    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            setIncreaseValue(true);
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev: number) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const decreaseIndex = () => {
        if (data) {
            if (leaving) return;
            setIncreaseValue(false);
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev: number) => (prev === 0 ? maxIndex : prev - 1));
        }
    };
    return(<>
        <DecreaseButton onClick={decreaseIndex}>
        <FontAwesomeIcon icon={faAngleLeft}
                         size="2x"/>
    </DecreaseButton>
        <IncreaseButton onClick={increaseIndex}>
            <FontAwesomeIcon icon={faAngleRight}
                             size="2x"/>
        </IncreaseButton>
    </>)

}