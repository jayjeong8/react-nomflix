import {motion} from "framer-motion";
import styled from "styled-components";
import {COLOR_BLACK, COLOR_YELLOW} from "../theme";
import {useRecoilState} from "recoil";
import {useEffect} from "react";
import {FavoriteMovie} from "../atom";
import {IStar, IContent} from "../interface";

const Svg = styled(motion.div)`
  cursor: pointer;
  filter: drop-shadow(0 0.6px 0.6rem ${props => props.theme.black});
`;

const logoVariants = {
    normal: {strokeOpacity: 1},
    active: {
        strokeOpacity: [0, 1, 0],
        transition: {repeat: Infinity}
    },
}

export default function Star({content, color}: IStar,) {
    const [favorite, setFavorite] = useRecoilState(FavoriteMovie);
    useEffect(() => {
        window.localStorage.setItem("favorite", JSON.stringify(favorite));
    }, [favorite]);
    let addArray: boolean = false;
    const onStarClick = (content: IContent) => {
        //클릭하면 로컬에 저장하고 로컬에 있으면 아이콘 채워짐. 없으면 라인
        //Favorite 페이지에서 로컬 목록 불러오기
        let array = [...favorite];
        addArray = true;
        array.map((data, index) => {
            if (data.id === content.id) {
                array.splice(index, 1);
                addArray = false;
                // return;
            }
        });
        if (addArray) {
            setFavorite(() => [content, ...array])
        } else if (!addArray) {
            setFavorite(() => [...array])
        }

        // console.log(content)
        console.log("addArray", addArray);
        // console.log("array", array);
        // console.log("favorite", favorite);
    }

    return (
        <Svg
            variants={logoVariants}
            animate="normal"
            whileHover="active"
            onClick={() => onStarClick(content)}
        >
            <svg width="18" height="24" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7.49185 19.4025C7.29718 12.3666 3.64859 10 -4.37114e-07 10C2.5 10 7.5 10 7.5 -3.27835e-07C7.5 10 12.5 10 15 10C8.10066 10 7.49814 16.7335 7.49185 19.4025C7.49726 19.598 7.5 19.7972 7.5 20C7.49527 19.8364 7.4913 19.6348 7.49185 19.4025Z"
                    fill={color}
                    stroke={COLOR_YELLOW}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                />
            </svg>
        </Svg>
    )
}