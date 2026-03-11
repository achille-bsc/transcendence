import { useLang } from "../script/langProvider";

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


function Img({ src, alt, className = "" }: { src: string; alt?: string; className?: string }) {
  const lang = useLang().getLang();
  const finalAlt = alt ?? lang.Feedback.sad_alt;
  return (
    <img
      src={src}
      alt={finalAlt}
      className={className}
    />
  );
}

export default Img