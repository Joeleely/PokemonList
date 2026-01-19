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

    const { generationNumbers, pokemonMap, loading, error, activeGen, hiddenPokemon, activeNames } = usePokedexData(generation);

    const pokemonList = useMemo(() => {
        const names = activeNames || [];
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

        const ordered = [...available, ...missing];

        //     return filtered
        //         .map((n) => pokemonMap[n])
        //         .filter(Boolean);
        // }, [activeNames, pokemonMap, query]);

        return ordered.map((name) => {
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
    }, [activeNames, pokemonMap, hiddenPokemon, query]);

    //console.log("hiddenPokemon = " ,hiddenPokemon);

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

            {/* {hiddenPokemon.length > 0 && (
                <small style={{ opacity: 0.6 }}>
                    Some Pokémon could not be loaded.
                </small>
            )} */}
        </div >
    );
}