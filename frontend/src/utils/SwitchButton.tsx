export function SwitchButton({ checked, onChange }) {
  return (
    <label className="switch-root">
	      <input
	        type="checkbox"
	        checked={checked}
	        onChange={onChange}
	        aria-label="Toggle theme"
	        className="switch-input"
	      />

      <div
        className="switch-track"
        style={{
            width: "4vw",
            height: "2vw",
            backgroundColor: checked ? "var(--default)" : "var(--change-theme)",
        }}
      >
        <span
          className="switch-thumb"
          style={{
            width: "2vw",
            height: "2vw",
            left: checked ? "2vw" : "0",
            backgroundColor: "white",
          }}
        />
      </div>
    </label>
  );
}

export default SwitchButton
