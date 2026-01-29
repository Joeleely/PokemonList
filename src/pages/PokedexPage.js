import { useState, useMemo, useEffect } from "react";
import GenerationSelect from "../components/GenerationSelect";
import "../styles/pokedexPage.css";
import "../styles/generationSelect.css";
import "../styles/pokemonCard.css";
import "../styles/pokemonDetail.css";
import "../styles/pokemonGrid.css";
import { usePokedexData } from "../hooks/usePokedexData";
import PokemonGrid from "../components/PokemonGrid";
import PokemonDetail from "../components/PokemonDetail";


export default function PokedexPage() {
    const [generation, setGeneration] = useState(null);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [limit, setLimit] = useState(80);

    const { generationNumbers, pokemonMap, loading, error, activeGen, hiddenPokemon, activeNames } = usePokedexData(generation);

    const pokemonList = useMemo(() => {
        const names = (activeNames || []).slice(0, limit);
        const lower = query.trim().toLowerCase();

        const filtered = lower
            ? names.filter((n) => n.includes(lower))
            : names;

        const isHidden = (name) => hiddenPokemon.includes(name);
        const hasData = (name) => Boolean(pokemonMap[name]);

        const available = [];
        const missing = [];

        for (const name of filtered) {
            if (hasData(name)) available.push(name);
            else if (isHidden(name)) missing.push(name);
            else available.push(name);
        }

        const orderedNames = [...available, ...missing];
        const limitedNames = orderedNames.slice(0, limit);

        return limitedNames.map((name) => {
            return (
                pokemonMap[name] || {
                    name,
                    missing: true,
                    abilities: [],
                    types: [],
                    sprites: null,
                }
            );
        });
    }, [activeNames, pokemonMap, hiddenPokemon, query, limit]);

    //console.log("hiddenPokemon = " ,hiddenPokemon);

    useEffect(() => setLimit(80), [activeGen]);

    useEffect(() => {
        const onScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="pokedex-container">
            <div className="pokedex-header">
                <h1>Pokedex</h1>
                <p className="muted">
                    Browse Pokemon by generation. Click a Pokemon to see details.
                </p>
            </div>
            <div className="pokedex-controls">
                <GenerationSelect
                    value={activeGen}
                    onChange={(g) => {
                        setGeneration(g);
                        setSelected(null);
                    }}
                    gens={generationNumbers}
                    disabled={loading || !!error}
                />

                <input className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name"
                    disabled={loading || !!error} />
            </div>

            {loading && <div className="loading">Loading Pokemon...</div>}
            {error && <div className="error-box">{error}</div>}

            {!loading && !error && (
                <div className="pokedex-content">
                    <div>
                        <PokemonGrid
                            pokemon={pokemonList}
                            onSelect={setSelected}
                        />
                    </div>

                    {selected && (
                        <PokemonDetail
                            pokemon={selected}
                            onClose={() => setSelected(null)}
                        />
                    )}

                    {activeNames?.length > limit && (
                        <div className="load-more-wrap">
                            <button
                                className="load-more-btn"
                                onClick={() => setLimit((x) => x + 80)}
                            >
                                Load more
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showScrollTop && (
                <button
                    className="scroll-top-btn"
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                >
                    ↑
                </button>
            )}

        </div >
    );
}