import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import Spinner from "../spinner/spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useMarvelService from "../../services/MarvelService";
import "./charList.scss";

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [lastSelectedItem, setLastItemSelected] = useState(null);
    const [charEnded, setCharEnded] = useState();

    const marvelService = useMarvelService();

    useEffect(() => {
        onRequest();
    }, [])

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService
            .getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError);
    };


    const onCharListLoading = () => {
        setNewItemLoading(true);
    };

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    };

    const onError = () => {
        setError(true);
        setLoading(loading => false);
    };

    const itemRefs = useRef([]);

    const setItemSelected = (id) => {
        itemRefs.current.forEach(item => {
            item.classList.remove('char__item_selected');
        });
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    };

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { objectFit: "cover" };
            if (
                item.thumbnail ===
                "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
            ) {
                imgStyle = { objectFit: "unset" };
            }
            return (
                <li
                    className="char__item"
                    tabIndex={0}
                    ref={(el) => {
                        itemRefs.current[i] = el;
                    }}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        setItemSelected(i);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(item.id);
                            setItemSelected(i);
                        }
                    }}
                >
                    <img
                        src={item.thumbnail}
                        alt={item.name}
                        style={imgStyle}
                        className="char__img_item"
                    />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });

        return <ul className="char__grid">{items}</ul>;
    }


    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                style={{ display: charEnded ? "none" : "block" }}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    );
}

export default CharList;
