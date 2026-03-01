// export function SwitchButton({ checked, onChange }) {
//   return (
//     <label className="inline-flex items-center cursor-pointer">
//       <input
//         type="checkbox"
//         checked={checked}
//         onChange={onChange}
//         className="sr-only peer"
//       />

//       <div className="relative w-10 h-6 bg-gray-300 rounded-full transition peer-checked:bg-purple-900">
//         <span
//           className="absolute top-1 w-4 h-4 rounded-full transition-transform duration-300"
//           style={{
//             left: checked ? "20px" : "2px",
//             backgroundColor: "white",
//           }}
//         />
//         {/* moving circle */}
//       </div>
//     </label>
//   );
// }

export function SwitchButton({ checked, onChange }) {
  return (
    <label className="inline-flex items-center cursor-pointer rounded-full">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      <div
        className="relative bg-[var(--props)] rounded-full transition-colors duration-300"
        style={{
            width: "4vw",
            height: "2vw",
            backgroundColor: checked ? "var(--default)" : "var(--change-theme)",
        }}
      >
        <span
          className="absolute rounded-full transition-transform duration-300"
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