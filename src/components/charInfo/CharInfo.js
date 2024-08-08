import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import "./charInfo.scss";
import Spinner from "../spinner/spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";
import useMarvelService from "../../services/MarvelService";

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const prevProps = useRef(props);
    const marvelService = new useMarvelService();

    useEffect(() => {
        updateChar();
    }, []);

    useEffect(() => {
        if (props.charId !== prevProps.charId) {
            updateChar();
        }
    }, [props])

    const updateChar = () => {
        const { charId } = props;

        if (!charId) {
            return;
        }

        onCharLoading();

        marvelService
            .getCharacter(charId)
            .then((char) => onCharLoaded(char))
            .catch(onError);
    };

    const onCharLoading = () => {
        setLoading(loading => true);
    };

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(loading => false);
    };

    const onError = () => {
        setLoading(loading => false);
        setError(error => true);
    };

        const skeleton = char || loading || error ? null : <Skeleton />;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error || !char) ? (
            <Veiw char={char} />
        ) : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        );
}


const Veiw = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = char;
    return (
        <>
                <div className="char__basics">
                    <img className="char__img" src={thumbnail} alt="{name}" />
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a
                                href="{homepage}"
                                className="button button__main"
                            >
                                <div className="inner">homepage</div>
                            </a>
                            <a
                                href="{wiki}"
                                className="button button__secondary"
                            >
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">{description}</div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0
                        ? null
                        : "No comics found for this character"}
                    {comics.slice(0, 10).map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        );
                    })}
                </ul>
        </>
    );
};

CharInfo.propTypes = {
    charId: PropTypes.number,
};

export default CharInfo;
