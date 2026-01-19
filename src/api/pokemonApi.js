
//https://pokeapi.co/api/v2/generation/{generation_number}
//https://pokeapi.co/api/v2/pokemon/${name}

const BASE = "https://pokeapi.co/api/v2";


//fetch pokemon by generation number.
export async function fetchGeneration(generationNumber, signal) {
    const res = await fetch(`${BASE}/generation/${generationNumber}`, { signal });
    if (!res.ok) {
        throw new Error(`Failed to load generation ${generationNumber}`);
    }
    return res.json();
}


//fetch pokemon detail by name.
export async function fetchPokemonByName(name, signal) {
    const res = await fetch(`${BASE}/pokemon/${name}`, { signal });
    if (!res.ok) {
        throw new Error(`Failed to load pokemon: ${name}`);
    }
    return res.json();
}


//fetch all generation list
export async function fetchGenerationsList(signal) {
    const res = await fetch(`${BASE}/generation`, { signal });
    if (!res.ok) {
        throw new Error("Failed to load generations list");
    }
    return res.json();
}

//fetch all generation numbers
export async function fetchGenerationNumbers(signal) {
    const data = await fetchGenerationsList(signal);

    return data.results
        .map((g) => Number(g.url.split("/").filter(Boolean).pop()))
        .filter(Number.isFinite)
        .sort((a, b) => a - b);
}
