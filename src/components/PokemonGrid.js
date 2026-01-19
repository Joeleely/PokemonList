import PokemonCard from "./PokemonCard";

export default function PokemonGrid({pokemon, onSelect}) {
    return (
        <div className="pokemon-grid">
            {pokemon.map((p) => (
                <PokemonCard key={p.name} pokemon={p} onClick={() => onSelect(p)} />
            ))}
        </div>
    );
}