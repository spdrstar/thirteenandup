type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function Button({ children, ...otherProps }: ButtonProps) {
  return (
    <>
      <button {...otherProps}>{children}</button>
      <style jsx>{`
        button {
          padding: 20px 20px;
          border-radius: 50px;
          width: 300px;
          font-size: 22px;
          background: #E4C085;
          color: white;
          line-height: 22px;
          border: none;
          cursor: pointer;
        }
        button:hover {
          background-image: linear-gradient(
            to left,
            rgb(253, 95, 85),
            rgb(255, 85, 128)
          );
        }
      `}</style>
    </>
  )
}
