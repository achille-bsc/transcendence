function MyButton({children, onClick}) {
  return <button onClick={onClick}>{children}</button>;
}

export default MyButton