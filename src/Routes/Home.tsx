import {useQuery} from "react-query";
import {getMovies, IGetMoviesResult} from "../api";
import styled from "styled-components";
import {motion, AnimatePresence} from "framer-motion";
import {makeImagePath} from "../utils";
import {useState} from "react";
import {useMatch, useNavigate} from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
  url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 56px;
  margin-bottom: 16px;
`;
const Overview = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin-left: 4px;
  width: 50%;
`;
const Slider = styled.div`
  position: relative;
  top: -100px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 64px;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
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


const rowVariants = {
    hidden: {
        x: window.outerWidth,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth,
    }
};
const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        scale: 1.2,
        y: -80,
        transition: {
            delay: 0.4,
            duration: 0.3,
            type: "tween",
        }
    },
};
const infoVariants = {
    hover: {
        opacity: 1,
        transition: {
            delay: 0.4,
            duration: 0.3,
            type: "tween",
        }
    },
};

const offset = 6;

function Home() {
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("/movies/:movieId");
    const {data, isLoading} = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"], getMovies
    );
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const onBoxClicked = (movieId: number) => {
        navigate(`/movies/${movieId}`);
    };
    const NETFLIX_LOGO_URL =
        'https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4';

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading..</Loader>
            ) : (
                <>
                    <Banner
                        onClick={increaseIndex}
                        bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{type: "tween", duration: 1}}
                                key={index}
                            >
                                {data?.results
                                    .slice(1) //메인화면에 들어가는 영화 제외
                                    .slice(offset * index, offset * index + offset)
                                    .map((movie) => (
                                        <Box
                                            key={movie.id}
                                            layoutId={movie.id + ""}
                                            onClick={() => onBoxClicked(movie.id)}
                                            variants={boxVariants}
                                            initial="normal"
                                            whileHover="hover"
                                            transition={{type: "tween"}}
                                            bgphoto={movie.backdrop_path ?
                                                makeImagePath(movie.backdrop_path, "w500")
                                                : NETFLIX_LOGO_URL}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <motion.div
                                layoutId={bigMovieMatch.params.movieId}
                                style={{
                                    position: "absolute",
                                    width: "40vw",
                                    height: "80vh",
                                    backgroundColor: "red",
                                    top: 120,
                                    left: 0,
                                    right: 0,
                                    margin: "0 auto",
                                }}
                            />
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;