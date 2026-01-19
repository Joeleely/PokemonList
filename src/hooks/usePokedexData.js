import { useEffect, useMemo, useRef, useState } from "react";
import { fetchGeneration, fetchGenerationNumbers, fetchPokemonByName } from "../api/pokemonApi";


export function usePokedexData(activeGeneration) {
    const [generationNumbers, setGenerationNumbers] = useState([]);
    const [pokemonByGeneration, setPokemonByGeneration] = useState({});
    const [pokemonMap, setPokemonMap] = useState({});
    const [hiddenPokemon, setHiddenPokemon] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //const missPokemon = useRef(new Set());

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError("");

        fetchGenerationNumbers(controller.signal)
            .then((nums) => setGenerationNumbers(nums))
            .catch((err) => {
                if (err?.name !== "AbortError") {
                    setError(err?.message || "Failed to load generations");
                }
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    const safeGen = useMemo(() => {
        if (!generationNumbers.length) {
            return null;
        }
        if (activeGeneration === null) {
            return null;
        }
        const g = Number(activeGeneration);
        return generationNumbers.includes(g) ? g : null;
    }, [generationNumbers, activeGeneration]);

    async function fetchPokemonDetails(names) {
        const missing = names.filter((n) => !pokemonMap[n]) ;
        //&& !missPokemon.current.has(n));

        if (!missing.length) {
            return;
        }

        const CONCURRENCY = 10
        const results = {};

        async function worker() {
            while (missing.length) {
                const name = missing.shift();
                try {
                    const data = await fetchPokemonByName(name);
                    results[name] = data;
                } catch (err) {
                    console.warn("Skipped pokemon:", name);

                    //missPokemon.current.add(name);
                    setHiddenPokemon((h) => {
                        if (h.includes(name)) {
                            return h;
                        }
                        return [...h, name];
                    })
                }
            }
        }

        const workers = Array.from({ length: Math.min(CONCURRENCY, missing.length) }, worker);
        await Promise.all(workers);

        setPokemonMap((p) => ({ ...p, ...results }));
    }

    useEffect(() => {
        if (!generationNumbers.length) {
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        async function loadGen() {
            try {
                setLoading(true);
                setError("");

                let names = [];

                if (safeGen === null) {
                    for (const g of generationNumbers) {
                        let genNames = pokemonByGeneration[g]
                        if (!genNames) {
                            const genData = await fetchGeneration(g, signal);
                            genNames = (genData?.pokemon_species || [])
                                .map((p) => p.name)
                                .sort((a, b) => a.localeCompare(b));

                            setPokemonByGeneration((s) => ({ ...s, [g]: genNames }));
                        }
                        names.push(...genNames);
                    }
                } else {
                    let genNames = pokemonByGeneration[safeGen];
                    if (!genNames) {
                        const genData = await fetchGeneration(safeGen, signal);
                        genNames = (genData?.pokemon_species || [])
                            .map((p) => p.name)
                            .sort((a, b) => a.localeCompare(b));

                        setPokemonByGeneration((x) => ({ ...x, [safeGen]: genNames }));
                    }
                    names = genNames;
                }
                names = Array.from(new Set(names));
                await fetchPokemonDetails(names, signal);

            } catch (err) {
                if (err?.name !== "AbortError") {
                    setError(err?.message || "Something went wrong");
                }
            } finally {
                setLoading(false);
            }
        }

        loadGen();
        return () => controller.abort();
    }, [safeGen, generationNumbers]);

    const activeNames = useMemo(() => {
        if (!generationNumbers.length) {
            return []
        };

        if (safeGen === null) {
            const all = generationNumbers.flatMap((g) => pokemonByGeneration[g] || []);
            return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
        }

        return pokemonByGeneration[safeGen] || [];
    }, [safeGen, generationNumbers, pokemonByGeneration]);

    return {
        generationNumbers,
        pokemonMap,
        loading,
        error,
        activeGen: safeGen,
        hiddenPokemon,
        activeNames,
    };
}