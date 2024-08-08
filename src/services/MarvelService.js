import { useHttp } from "../hooks/http.hook";

const useMarvelService = () =>  {

    const {loading, request, error} = useHttp();

    const _apiBase = "https://gateway.marvel.com:443/v1/public/";
    const _apiKey = "apikey=34ecb79365cc8179db6707560ca76ca9";
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(
            `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
        );
        return res.data.results.map(_transformCharacter);
    };

    const getCharacter = async (id) => {
        const res = await request(
            `${_apiBase}characters/${id}?${_apiKey}`
        );
        return _transformCharacter(res.data.results[0]);
    };

    const _transformCharacter = ({ name, description, thumbnail, urls: [homepage, wiki], id, comics }) => ({
        name,
        description: description.trim().length > 186
            ? `${description.slice(0, 186)}...`
            : 'No description found for this character(s).',
        thumbnail: `${thumbnail.path}.${thumbnail.extension}`,
        homepage,
        wiki,
        id,
        comics: comics.items,
    });

    return {
        loading, 
        error, 
        getAllCharacters,
        getCharacter,
    };

}




export default useMarvelService;


