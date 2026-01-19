
export default function GenerationSelect({ value, onChange, gens = [], disabled }) {
    return (
        <label className="generation">
            <span className="generation-label">Generation</span>
            <select
                className="generation-select"
                value={value ?? "all"}
                onChange={(e) => {
                    const num = e.target.value;
                    //console.log("num =", num);
                    onChange(num === "all" ? null : Number(num));
                }}
                disabled={disabled}
            >
                <option value="all">
                    All
                </option>

                {gens.map((g) => (
                    <option key={g} value={g}>
                        Gen {g}
                    </option>
                ))}
            </select>
        </label>
    );
}