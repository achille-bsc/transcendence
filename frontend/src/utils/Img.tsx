function Img({ src, alt= "Triste", width = 50, height = 60 }) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  );
}

export default Img