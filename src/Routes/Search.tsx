import {useLocation} from "react-router";
import {useQuery} from "react-query";
import {AnimatePresence, useViewportScroll} from "framer-motion";
import IndexControlButton from "../Components/IndexControlButton";
import {makeImagePath} from "../utils";
import {Slider, Info, Box, RowTitle, InRow} from "../Components/StyledRow";
import {rowVariants, infoVariants, boxVariants} from "../Components/RowVariants";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {
    ClickedMovie,
    ClickedTV,
    IncreaseState,
    ModalLeaving,
    SearchMovieIndex, SearchTVIndex,
} from "../atom";
import {IGetContentsResult} from "../api";
import styled from "styled-components";
import {useState} from "react";
import {BigCover, BigModal, BigOverview, BigTitle, BigDate, Overlay} from "../Components/StyledBigModal";
import {Loader} from "../Components/Loader";

const API_KEY = "8b0c5f0400aa76e404ea70c8b1e0ce22";
const BASE_PATH = "https://api.themoviedb.org/3";

const Wrapper = styled.div`
  margin-top: 40vh;
  position: relative;
`;
const SearchTitle = styled.div`
  position: absolute;
  top: -24vh;
  margin-left: 8vw;
  font-size: 40px;
`;

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const movieData = useQuery<IGetContentsResult>(["movieSearch", keyword], async () => {
        return await fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`)
            .then(response => response.json())
    })
    const tvData = useQuery<IGetContentsResult>(["tvSearch", keyword], async () => {
        return await fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`)
            .then(response => response.json())
    })
    const {isLoading} = useQuery(["movieSearch", keyword]);
    const [savedId, setSavedId] = useState<number | null>(null);
    const [checkMedia, setCheckMedia] = useState("searchMovie");
    const clickedContents = useRecoilValue(checkMedia === "searchMovie" ?
        ClickedMovie : ClickedTV);
    const setClickedMovie = useSetRecoilState(ClickedMovie);
    const setClickedTV = useSetRecoilState(ClickedTV);
    const setLeaving = useSetRecoilState(ModalLeaving);
    const increaseValue = useRecoilValue(IncreaseState);
    const movieIndex = useRecoilValue(SearchMovieIndex);
    const tvIndex = useRecoilValue(SearchTVIndex);
    const {scrollY} = useViewportScroll();

    const toggleLeaving = () => setLeaving((prev: boolean) => !prev);

    const onMovieBoxClicked = (contentId: number) => {
        setCheckMedia("searchMovie")
        const clicked = movieData?.data?.results.find((content) =>
            content.id === contentId || undefined);
        setClickedMovie(clicked);
        setSavedId(contentId);
    };
    const onTVBoxClicked = (contentId: number) => {
        setCheckMedia("searchTV");
        const clicked = tvData?.data?.results.find((content) =>
            content.id === contentId || undefined);
        setClickedTV(clicked);
        setSavedId(contentId);
    };
    const onOverlayClick = () => {
        setSavedId(null);
    };

    const offset = 5;
    const NETFLIX_LOGO_URL =
        'https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4';


    return (
        <>
            {isLoading ? (<Loader>Loading..</Loader>) : (
                <Wrapper>
                    <SearchTitle>{`Search "${keyword}"..`}</SearchTitle>
                    <Slider>
                        <RowTitle>Movie</RowTitle>
                        <IndexControlButton
                            queryKeyName2={"searchMovie"}
                            data={movieData.data}/>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <InRow
                                variants={rowVariants}
                                initial={increaseValue ? "hidden" : "exit"}
                                animate="visible"
                                exit={increaseValue ? "exit" : "hidden"}
                                transition={{type: "tween", duration: 1}}
                                key={movieIndex}
                            >
                                {movieData?.data?.results
                                    .slice(offset * movieIndex, offset * movieIndex + offset)
                                    .map((content) => (
                                        <Box
                                            key={content.id + "movie"}
                                            layoutId={content.id + ""}
                                            onClick={() => onMovieBoxClicked(content.id)}
                                            variants={boxVariants}
                                            initial="normal"
                                            whileHover="hover"
                                            transition={{type: "tween"}}
                                            bgphoto={content.poster_path ?
                                                makeImagePath(content.poster_path, "w500")
                                                : NETFLIX_LOGO_URL}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{content.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </InRow>
                        </AnimatePresence>
                    </Slider>
                    <Slider>
                        <RowTitle>TV show</RowTitle>
                        <IndexControlButton
                            queryKeyName2={"searchTV"}
                            data={tvData.data}/>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <InRow
                                variants={rowVariants}
                                initial={increaseValue ? "hidden" : "exit"}
                                animate="visible"
                                exit={increaseValue ? "exit" : "hidden"}
                                transition={{type: "tween", duration: 1}}
                                key={tvIndex}
                            >
                                {tvData?.data?.results
                                    .slice(offset * tvIndex, offset * tvIndex + offset)
                                    .map((content) => (
                                        <Box
                                            key={content.id + "tv"}
                                            layoutId={content.id + ""}
                                            onClick={() => onTVBoxClicked(content.id)}
                                            variants={boxVariants}
                                            initial="normal"
                                            whileHover="hover"
                                            transition={{type: "tween"}}
                                            bgphoto={content.poster_path ?
                                                makeImagePath(content.poster_path, "w500")
                                                : NETFLIX_LOGO_URL}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{content.name}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </InRow>
                        </AnimatePresence>
                    </Slider>

                    <AnimatePresence>
                        {savedId ? (
                            <>
                                <Overlay onClick={onOverlayClick}
                                         animate={{opacity: 1}}
                                         exit={{opacity: 0}}/>
                                <BigModal
                                    style={{top: scrollY.get() - 220}}
                                    layoutId={savedId + ""}
                                >
                                    {clickedContents && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedContents.backdrop_path ? clickedContents.backdrop_path : clickedContents.poster_path, "w1280"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>{
                                                checkMedia === "searchMovie" ? clickedContents.title
                                                    : clickedContents.name}
                                            </BigTitle>
                                            <BigDate>({checkMedia === "searchMovie" ? clickedContents.release_date
                                                : clickedContents.first_air_date})</BigDate>
                                            <BigOverview>{clickedContents.overview}</BigOverview>
                                        </>
                                    )}
                                </BigModal>
                            </>
                        ) : null}
                    </AnimatePresence>
                </Wrapper>
            )
            }
        </>
    )

}

export default Search;