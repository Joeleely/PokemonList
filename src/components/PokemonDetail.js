import { useEffect } from "react";

export default function PokemonDetail({ pokemon, onClose }) {

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKeyDown);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    if (!pokemon) return null;

    //console.log(pokemon);
    return (
        <div className="modal-overlay" onMouseDown={onClose}>
            <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    ✕
                </button>

                <div className="modal-header">
                    <h2 className="modal-title">{pokemon.name}</h2>
                </div>

                <div className="modal-body">
                    <img
                        className="modal-image"
                        src={pokemon.sprites?.front_default}
                        alt={pokemon.name}
                    />

                    <div className="modal-section">
                        <div className="modal-types">
                            {(pokemon.types || []).map((a) => (
                                <span className={`type type-${a.type.name}`} key={a.type.name}>
                                    {a.type.name}
                                </span>
                            ))}
                        </div>
                        <div className="modal-section-title">Abilities</div>
                        <div className="modal-abilities">
                            {(pokemon.abilities || []).map((a) => (
                                <span className="ability" key={a.ability.name}>
                                    {a.ability.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}