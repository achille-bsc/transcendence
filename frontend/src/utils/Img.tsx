// function Img({ src, alt= "Triste", width = 50, height = 60 }) {
//   return (
//     <img
//       src={src}
//       alt={alt}
//       width={width}
//       height={height}
//     />
//   );
// }


function Img({ src, alt = "Triste", className = "" }: { src: string; alt?: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
    />
  );
}

export default Img