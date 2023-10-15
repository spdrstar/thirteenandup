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
          font-size: 23px;
          background: #E4C085;
          color: #FBF4E4;
          line-height: 22px;
          border: none;
          cursor: pointer;
          font-family: departura;
        }
        button:hover {
          background: #F8333C;
        }
      `}</style>
    </>
  )
}
