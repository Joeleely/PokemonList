
export default function PokemonCard({ pokemon, onClick }) {
    const sprite =
        pokemon?.sprites?.other?.["official-artwork"]?.front_default ||
        pokemon?.sprites?.front_default ||
        "";

    const isMissing = Boolean(pokemon?.missing);
    //console.log(pokemon)
    return (
        <button
            className={`pokemon-card ${isMissing ? "pokemon-card-missing" : ""}`}
            onClick={isMissing ? undefined : onClick}
            type="button"
            disabled={isMissing}>
            <div className="pokemon-card-imgWrap">
                {!isMissing && sprite ? (
                    <img className="pokemon-card-img" src={sprite} alt={pokemon.name} />
                ) : (
                    <div className="pokemon-card-placeholder" />
                )}
            </div>
            <div className="pokemon-card-name">{pokemon.name}</div>
            {!isMissing && (
                <div className="ability-box">
                    <div className="pokemon-card-ability">
                        {(pokemon.abilities || []).map((a) => (
                            <div>{a.ability.name}</div>
                        ))}
                    </div>
                </div>
            )}
        </button>
    );
}